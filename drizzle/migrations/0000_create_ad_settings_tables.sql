CREATE TABLE public.ad_settings (
  id boolean PRIMARY KEY DEFAULT true CHECK (id),
  meta_pixel_id text NOT NULL DEFAULT '',
  google_ads_id text NOT NULL DEFAULT '',
  google_conversion_label text NOT NULL DEFAULT '',
  tracking_enabled boolean NOT NULL DEFAULT true,
  updated_at timestamptz NOT NULL DEFAULT now()
);
INSERT INTO public.ad_settings (id) VALUES (true);
GRANT SELECT ON public.ad_settings TO anon;
GRANT SELECT, UPDATE ON public.ad_settings TO authenticated;
GRANT ALL ON public.ad_settings TO service_role;
ALTER TABLE public.ad_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read ad settings" ON public.ad_settings FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins can update ad settings" ON public.ad_settings FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TABLE public.ad_secrets (
  id boolean PRIMARY KEY DEFAULT true CHECK (id),
  meta_capi_access_token text NOT NULL DEFAULT '',
  updated_at timestamptz NOT NULL DEFAULT now()
);
INSERT INTO public.ad_secrets (id) VALUES (true);
GRANT SELECT, UPDATE ON public.ad_secrets TO authenticated;
GRANT ALL ON public.ad_secrets TO service_role;
ALTER TABLE public.ad_secrets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can read ad secrets" ON public.ad_secrets FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update ad secrets" ON public.ad_secrets FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));