import { supabase } from "@/integrations/supabase/client";

// Ad conversion tracking: Meta Pixel (browser + Conversions API) and Google Ads.
// IDs are managed in Admin > Settings (public.ad_settings / public.ad_secrets).
// Consent route (chosen): no banner — tags and server events are blocked for
// visitors in regions that require consent, and when the region cannot be
// determined. Clicks and impressions are counted by the platforms either way.

// EEA + United Kingdom + Switzerland require consent for ad tracking cookies.
const CONSENT_REGIONS = new Set([
  "AT", "BE", "BG", "HR", "CY", "CZ", "DK", "EE", "FI", "FR", "DE", "GR",
  "HU", "IS", "IE", "IT", "LV", "LI", "LT", "LU", "MT", "NL", "NO", "PL",
  "PT", "RO", "SK", "SI", "ES", "SE", "GB", "CH",
]);

interface AdSettings {
  meta_pixel_id: string;
  google_ads_id: string;
  google_conversion_label: string;
  tracking_enabled: boolean;
}

type Fbq = ((...args: unknown[]) => void) & {
  callMethod?: (...args: unknown[]) => void;
  queue?: unknown[];
  push?: (...args: unknown[]) => void;
  loaded?: boolean;
  version?: string;
};

declare global {
  interface Window {
    fbq?: Fbq;
    _fbq?: Fbq;
    dataLayer?: unknown[];
  }
}

let settingsPromise: Promise<AdSettings | null> | null = null;
let regionPromise: Promise<boolean> | null = null;
let initialized = false;

function getAdSettings(): Promise<AdSettings | null> {
  if (!settingsPromise) {
    settingsPromise = (async () => {
      const { data, error } = await supabase
        .from("ad_settings")
        .select("meta_pixel_id, google_ads_id, google_conversion_label, tracking_enabled")
        .limit(1)
        .maybeSingle();
      if (error) {
        console.error("[ads] settings load failed", error);
        return null;
      }
      return (data as AdSettings | null) ?? null;
    })();
  }
  return settingsPromise;
}

// True when tracking may run for this visitor; false in consent-required or
// unresolved regions (chosen no-banner route blocks both).
async function countryFromTrace(): Promise<string> {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 2000);
    const res = await fetch("/cdn-cgi/trace", { signal: controller.signal });
    clearTimeout(timer);
    if (!res.ok) return "";
    const text = await res.text();
    const get = (key: string) =>
      text.split("\n").find((l) => l.startsWith(`${key}=`))?.slice(key.length + 1).trim() ?? "";
    // A rewrite proxy's trace belongs to another host — treat as unresolved.
    if (get("h") && get("h") !== window.location.host) return "";
    return get("loc");
  } catch {
    return "";
  }
}

// Fallback for hosts without a Cloudflare trace endpoint.
async function countryFromServer(): Promise<string> {
  try {
    const { data, error } = await supabase.functions.invoke("geo");
    if (error) return "";
    return typeof data?.country === "string" ? data.country : "";
  } catch {
    return "";
  }
}

// Visit any page with ?ads_debug=1 to see the tracking decision in the console.
const adsDebug =
  typeof window !== "undefined" && new URLSearchParams(window.location.search).has("ads_debug");
function debugLog(...args: unknown[]) {
  if (adsDebug) console.info("[ads]", ...args);
}

function regionPermitsTracking(): Promise<boolean> {
  if (!regionPromise) {
    regionPromise = (async () => {
      let loc = await countryFromTrace();
      if (!loc || loc === "XX") loc = await countryFromServer();
      const permitted = !(!loc || loc === "XX" || loc === "T1") && !CONSENT_REGIONS.has(loc);
      debugLog("visitor country:", loc || "unknown", "- tracking", permitted ? "allowed" : "blocked");
      return permitted;
    })();
  }
  return regionPromise;
}

function loadGtag(googleAdsId: string) {
  if (document.querySelector(`script[src*="googletagmanager.com/gtag/js"]`)) return;
  const s = document.createElement("script");
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(googleAdsId)}`;
  document.head.appendChild(s);
  window.dataLayer = window.dataLayer || [];
  const gtag = (...args: unknown[]) => {
    window.dataLayer!.push(args);
  };
  gtag("js", new Date());
  gtag("config", googleAdsId);
}

function loadMetaPixel(pixelId: string) {
  if (window.fbq && window.fbq.loaded) return;
  const w = window;
  const fbq: Fbq = function (...args: unknown[]) {
    if (fbq.callMethod) {
      fbq.callMethod.apply(fbq, args);
    } else {
      (fbq.queue as unknown[]).push(args);
    }
  } as Fbq;
  if (!w._fbq) w._fbq = fbq;
  fbq.push = fbq;
  fbq.loaded = true;
  fbq.version = "2.0";
  fbq.queue = [];
  w.fbq = fbq;
  const s = document.createElement("script");
  s.async = true;
  s.src = "https://connect.facebook.net/en_US/fbevents.js";
  document.head.appendChild(s);
  fbq("init", pixelId, {}, { agent: "lovable" });
  fbq("track", "PageView");
}

function fbqCall(...args: unknown[]) {
  const fbq = window.fbq;
  if (!fbq) return;
  if (fbq.callMethod) {
    fbq.callMethod.apply(fbq, args);
  } else if (Array.isArray(fbq.queue)) {
    fbq.queue.push(args);
  }
}

function gtagCall(...args: unknown[]) {
  if (!window.dataLayer) return;
  window.dataLayer.push(args);
}

function readCookie(name: string): string | undefined {
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : undefined;
}

/** Loads ad tags once, when settings allow and the visitor's region permits. */
export async function initAdTracking(): Promise<void> {
  if (initialized) return;
  const [settings, permitted] = await Promise.all([getAdSettings(), regionPermitsTracking()]);
  if (!settings || !settings.tracking_enabled || !permitted) return;
  initialized = true;
  if (settings.google_ads_id) loadGtag(settings.google_ads_id);
  if (settings.meta_pixel_id) loadMetaPixel(settings.meta_pixel_id);
}

/**
 * Fires the lead conversion after a successful form submission.
 * Browser Pixel and the Conversions API share one event id so Meta deduplicates.
 * No-ops when tracking is disabled or the region blocks it.
 */
export async function trackLeadConversion(): Promise<void> {
  const [settings, permitted] = await Promise.all([getAdSettings(), regionPermitsTracking()]);
  if (!settings || !settings.tracking_enabled || !permitted) return;

  const eventId = crypto.randomUUID();
  const eventTime = Math.floor(Date.now() / 1000);

  if (settings.meta_pixel_id) {
    fbqCall("track", "Lead", {}, { eventID: eventId });
  }

  if (settings.google_ads_id && settings.google_conversion_label) {
    gtagCall("event", "conversion", {
      send_to: `${settings.google_ads_id}/${settings.google_conversion_label}`,
    });
  }

  if (settings.meta_pixel_id) {
    const { error } = await supabase.functions.invoke("meta-capi", {
      body: {
        event_id: eventId,
        event_time: eventTime,
        event_source_url: window.location.href,
        client_user_agent: navigator.userAgent,
        fbp: readCookie("_fbp"),
        fbc: readCookie("_fbc"),
      },
    });
    if (error) console.error("[ads] meta-capi failed", error);
  }
}
