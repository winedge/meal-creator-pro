import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
Deno.serve((req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  const h: Record<string,string> = {};
  req.headers.forEach((v,k)=>{ if(/country|geo|cf-/i.test(k)) h[k]=v; });
  return new Response(JSON.stringify(h), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
});
