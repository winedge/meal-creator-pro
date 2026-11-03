import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { LogOut, Save, Megaphone } from "lucide-react";
import logo from "@/assets/medinjuryclaims-logo.png";

export default function AdminSettings() {
  const { session, isAdmin, loading } = useAdminAuth();
  const nav = useNavigate();

  const [fetching, setFetching] = useState(true);
  const [saving, setSaving] = useState(false);
  const [trackingEnabled, setTrackingEnabled] = useState(true);
  const [metaPixelId, setMetaPixelId] = useState("");
  const [googleAdsId, setGoogleAdsId] = useState("");
  const [googleConversionLabel, setGoogleConversionLabel] = useState("");
  const [metaCapiToken, setMetaCapiToken] = useState("");

  useEffect(() => {
    if (!loading && (!session || !isAdmin)) nav("/admin/login", { replace: true });
  }, [session, isAdmin, loading, nav]);

  useEffect(() => {
    if (!isAdmin) return;
    (async () => {
      setFetching(true);
      const [{ data: settings, error: sErr }, { data: secrets, error: tErr }] = await Promise.all([
        supabase.from("ad_settings").select("*").limit(1).maybeSingle(),
        supabase.from("ad_secrets").select("*").limit(1).maybeSingle(),
      ]);
      if (sErr) toast.error(sErr.message);
      if (tErr) toast.error(tErr.message);
      if (settings) {
        setTrackingEnabled(settings.tracking_enabled);
        setMetaPixelId(settings.meta_pixel_id);
        setGoogleAdsId(settings.google_ads_id);
        setGoogleConversionLabel(settings.google_conversion_label);
      }
      if (secrets) setMetaCapiToken(secrets.meta_capi_access_token);
      setFetching(false);
    })();
  }, [isAdmin]);

  const save = async () => {
    setSaving(true);
    const { error: sErr } = await supabase
      .from("ad_settings")
      .update({
        tracking_enabled: trackingEnabled,
        meta_pixel_id: metaPixelId.trim(),
        google_ads_id: googleAdsId.trim(),
        google_conversion_label: googleConversionLabel.trim(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", true);
    const { error: tErr } = await supabase
      .from("ad_secrets")
      .update({ meta_capi_access_token: metaCapiToken.trim(), updated_at: new Date().toISOString() })
      .eq("id", true);
    setSaving(false);
    if (sErr || tErr) return toast.error(sErr?.message ?? tErr?.message ?? "Save failed");
    toast.success("Ad tracking settings saved");
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    nav("/admin/login");
  };

  if (loading || (!isAdmin && session)) {
    return <div className="min-h-screen grid place-items-center text-muted-foreground">Loading…</div>;
  }

  return (
    <div className="min-h-screen bg-surface">
      <header className="border-b border-border bg-navy-deep text-primary-foreground">
        <div className="container flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center">
            <img src={logo} alt="Med Injury Claims" className="h-9 w-auto brightness-0 invert" />
            <span className="ml-4 hidden sm:inline text-[10px] uppercase tracking-[0.2em] text-primary-foreground/70 border-l border-primary-foreground/30 pl-4">Medinjury Admin · Settings</span>
          </Link>
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline text-xs text-primary-foreground/70">{session?.user.email}</span>
            <Button variant="outline" size="sm" onClick={signOut} className="border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground hover:text-navy">
              <LogOut className="h-3.5 w-3.5 mr-1.5" /> Sign out
            </Button>
          </div>
        </div>
      </header>

      <main className="container max-w-2xl py-8">
        <div className="mb-6 flex flex-wrap gap-1 border-b border-border">
          {[
            { to: "/admin", label: "All Submissions", active: false },
            { to: "/admin", label: "All Submissions", active: false },
            { to: "/admin/settings", label: "Ad Tracking", active: true },
          ].map((t) => (
            <Link
              key={t.to}
              to={t.to}
              className={`-mb-px border-b-2 px-4 py-2 text-sm font-semibold transition ${
                t.active
                  ? "border-brand-red text-navy"
                  : "border-transparent text-muted-foreground hover:text-navy"
              }`}
            >
              {t.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <Megaphone className="h-6 w-6 text-navy" />
          <div>
            <h1 className="font-serif text-2xl font-black text-navy">Ad Tracking</h1>
            <p className="text-sm text-muted-foreground">
              Meta Pixel + Conversions API and Google Ads conversion tracking for the case review forms.
            </p>
          </div>
        </div>

        <div className="mt-8 space-y-6 border border-border bg-background p-6 shadow-sm sm:p-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <Label htmlFor="tracking-enabled" className="text-base font-semibold text-navy">Tracking enabled</Label>
              <p className="text-xs text-muted-foreground">Master switch for all ad tags and server events.</p>
            </div>
            <Switch id="tracking-enabled" checked={trackingEnabled} onCheckedChange={setTrackingEnabled} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="meta-pixel">Meta Pixel ID</Label>
            <Input id="meta-pixel" value={metaPixelId} onChange={(e) => setMetaPixelId(e.target.value)} placeholder="1234567890123456" />
            <p className="text-xs text-muted-foreground">Events Manager → Data sources → your dataset → Settings → Dataset ID.</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="meta-capi">Meta Conversions API access token</Label>
            <Input id="meta-capi" type="password" value={metaCapiToken} onChange={(e) => setMetaCapiToken(e.target.value)} placeholder="EAAB…" />
            <p className="text-xs text-muted-foreground">Events Manager → your dataset → Settings → Conversions API → Generate access token. Stored so only admins can see it.</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="google-ads-id">Google Ads conversion ID</Label>
            <Input id="google-ads-id" value={googleAdsId} onChange={(e) => setGoogleAdsId(e.target.value)} placeholder="AW-123456789" />
            <p className="text-xs text-muted-foreground">Google Ads → Goals → Conversions → your lead action → Tag setup.</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="google-label">Google Ads conversion label</Label>
            <Input id="google-label" value={googleConversionLabel} onChange={(e) => setGoogleConversionLabel(e.target.value)} placeholder="abcDEF123ghi" />
          </div>

          <Button onClick={save} disabled={saving || fetching} className="bg-navy hover:bg-navy-deep text-primary-foreground">
            <Save className="h-4 w-4 mr-2" /> {saving ? "Saving…" : "Save settings"}
          </Button>

          <p className="text-xs text-muted-foreground border-t border-border pt-4">
            In regions that require consent (EU, UK, Switzerland) tracking stays off entirely; ad clicks and
            impressions are still counted by the platforms. Form details such as claim descriptions are never
            sent to Meta or Google.
          </p>
        </div>
      </main>
    </div>
  );
}
