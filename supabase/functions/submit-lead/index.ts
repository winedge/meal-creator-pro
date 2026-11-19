import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';
import { createClient } from 'npm:@supabase/supabase-js@2';
import { z } from 'npm:zod@3';
import { leadPayload, RETRY_DELAYS_MS } from './payload.mjs';

const optional = z.string().max(1000).nullable().optional();
const schema = z.object({
  first_name: z.string().trim().min(1).max(60), last_name: z.string().trim().min(1).max(60),
  email: z.string().email().max(255), phone: z.string().min(7).max(25),
  address: optional, city: optional, state: optional, zip: z.string().min(3).max(12),
  claim_type: z.enum(['mva', 'ssdi', 'rideshare']), incident_state: optional, description: optional,
  consent: z.literal(true), consent_text: z.string().min(100).max(3000),
  trusted_form_cert_url: z.string().url().max(2048).nullable().optional(),
  trusted_form_ping_url: z.string().url().max(2048).nullable().optional(),
  page_url: z.string().url().max(2048), user_agent: z.string().max(1000),
});

Deno.serve(async (req) => {
  const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), {
    status, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405);
  try {
    const parsed = schema.safeParse(await req.json());
    if (!parsed.success) return json({ error: 'Please review your form details.' }, 400);
    const url = Deno.env.get('SUPABASE_URL');
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    const apiKey = Deno.env.get('AIMEDICALLS_API_KEY');
    if (!url || !serviceKey || !apiKey) return json({ error: 'Intake service is unavailable.' }, 503);
    const db = createClient(url, serviceKey);
    const ip = req.headers.get('cf-connecting-ip') ?? req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? null;
    const { data: row, error } = await db.from('submissions').insert({
      ...parsed.data, ip_address: ip, aimedicalls_status: 'pending',
    }).select('*').single();
    if (error || !row) return json({ error: 'Unable to save your request.' }, 500);

    // Start immediately; bounded transient retries finish in under two minutes.
    const deliver = async () => {
      for (let attempt = 0; attempt < RETRY_DELAYS_MS.length; attempt++) {
        if (RETRY_DELAYS_MS[attempt]) await new Promise(resolve => setTimeout(resolve, RETRY_DELAYS_MS[attempt]));
        let status: number | null = null;
        try {
          const response = await fetch('https://aimedicalls.com/api/public/leads', {
            method: 'POST', headers: { 'X-Api-Key': apiKey, 'Content-Type': 'application/json' },
            body: JSON.stringify(leadPayload(row)), signal: AbortSignal.timeout(12000),
          });
          status = response.status;
          const contentType = response.headers.get('content-type') ?? '';
          const body = contentType.includes('application/json') ? await response.json() : null;
          // A rewritten HTML page is not an API acceptance.
          const accepted = response.ok && body !== null && body.success !== false && !body.error;
          const retryable = status === 429 || status >= 500;
          const final = accepted || !retryable || attempt === RETRY_DELAYS_MS.length - 1;
          await db.from('submissions').update({
            aimedicalls_status: accepted ? 'sent' : final ? 'failed' : 'pending',
            aimedicalls_attempts: attempt + 1, aimedicalls_http_status: status,
            aimedicalls_sent_at: accepted ? new Date().toISOString() : null,
          }).eq('id', row.id);
          console.info('AIMedicalls delivery', { submission_id: row.id, attempt: attempt + 1, status, accepted });
          if (final) return;
        } catch {
          await db.from('submissions').update({
            aimedicalls_status: attempt === RETRY_DELAYS_MS.length - 1 ? 'failed' : 'pending',
            aimedicalls_attempts: attempt + 1, aimedicalls_http_status: status,
          }).eq('id', row.id);
        }
      }
    };
    EdgeRuntime.waitUntil(deliver());
    return json({ success: true });
  } catch {
    return json({ error: 'Unable to process your request.' }, 400);
  }
});