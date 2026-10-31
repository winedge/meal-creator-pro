import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { createClient } from "npm:@supabase/supabase-js@2";
import { z } from "npm:zod@3";

// Sends the Lead event to Meta's Conversions API after a successful form
// submission. Shares the browser Pixel's event id so Meta deduplicates.
// The browser gates this call on the visitor's region (no-banner route:
// consent-required and unresolved regions are blocked before invoking).

const BodySchema = z.object({
  event_id: z.string().uuid(),
  event_time: z.number().int().positive(),
  event_source_url: z.string().url().max(2048),
  client_user_agent: z.string().min(1).max(512),
  fbp: z.string().max(255).optional(),
  fbc: z.string().max(255).optional(),
});

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const json = (data: unknown, status = 200) =>
    new Response(JSON.stringify(data), {
      status,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  try {
    const parsed = BodySchema.safeParse(await req.json());
    if (!parsed.success) {
      return json({ error: "Invalid payload", details: parsed.error.flatten().fieldErrors }, 400);
    }
    const body = parsed.data;

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!supabaseUrl || !serviceRoleKey) {
      return json({ error: "Server configuration missing" }, 500);
    }
    const admin = createClient(supabaseUrl, serviceRoleKey);

    const [{ data: settings }, { data: secrets }] = await Promise.all([
      admin.from("ad_settings").select("meta_pixel_id, tracking_enabled").limit(1).maybeSingle(),
      admin.from("ad_secrets").select("meta_capi_access_token").limit(1).maybeSingle(),
    ]);

    const pixelId = settings?.meta_pixel_id?.trim();
    const token = secrets?.meta_capi_access_token?.trim();
    if (!settings?.tracking_enabled || !pixelId || !token) {
      return json({ skipped: true, reason: "tracking disabled or Meta CAPI not configured" });
    }

    const forwardedFor = req.headers.get("x-forwarded-for") ?? "";
    const clientIp = forwardedFor.split(",")[0]?.trim() || undefined;

    const userData: Record<string, string> = { client_user_agent: body.client_user_agent };
    if (clientIp) userData.client_ip_address = clientIp;
    if (body.fbp) userData.fbp = body.fbp;
    if (body.fbc) userData.fbc = body.fbc;

    const response = await fetch(
      `https://graph.facebook.com/v26.0/${pixelId}/events?access_token=${encodeURIComponent(token)}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          data: [
            {
              event_name: "Lead",
              event_time: body.event_time,
              action_source: "website",
              event_source_url: body.event_source_url,
              event_id: body.event_id,
              user_data: userData,
            },
          ],
          partner_agent: "lovable",
        }),
      },
    );

    if (!response.ok) {
      const errorBody = await response.text();
      console.error(`Meta CAPI failed [${response.status}]: ${errorBody}`);
      return json({ error: "Provider request failed", status: response.status, details: errorBody }, response.status);
    }

    const result = await response.json();
    return json({ ok: true, events_received: result?.events_received ?? null });
  } catch (err) {
    console.error("meta-capi error", err);
    return json({ error: "Unexpected server error" }, 500);
  }
});
