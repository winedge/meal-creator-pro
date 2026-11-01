import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

// Returns the visitor's country code, used to decide whether ad tracking may
// run when the site's own host can't answer /cdn-cgi/trace. Unknown -> "XX".
Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  const json = (country: string) =>
    new Response(JSON.stringify({ country }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  const ip =
    req.headers.get("cf-connecting-ip") ??
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  if (!ip) return json("XX");
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 1500);
    const res = await fetch(`https://api.country.is/${encodeURIComponent(ip)}`, { signal: controller.signal });
    clearTimeout(timer);
    if (!res.ok) return json("XX");
    const data = await res.json();
    const c = typeof data?.country === "string" && /^[A-Z]{2}$/.test(data.country) ? data.country : "XX";
    return json(c);
  } catch {
    return json("XX");
  }
});
