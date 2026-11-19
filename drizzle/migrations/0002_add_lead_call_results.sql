ALTER TABLE public.submissions
  ADD COLUMN call_id text,
  ADD COLUMN call_status text,
  ADD COLUMN call_outcome text,
  ADD COLUMN call_end_reason text,
  ADD COLUMN call_duration_sec integer,
  ADD COLUMN call_summary text,
  ADD COLUMN call_transcript jsonb,
  ADD COLUMN call_recording_path text,
  ADD COLUMN call_completed_at timestamptz;

CREATE POLICY "Admins can read call recordings"
ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'call-recordings' AND public.has_role(auth.uid(), 'admin'));