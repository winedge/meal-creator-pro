# Architecture rules

- Keep the Meta Pixel base loader in the document HTML, and invoke it only from the shared tracking library after permission and saved settings checks; this exposes the setup in page source without bypassing regional blocking or duplicating Pixel installs.
- Submit both intake forms through submit-lead, saving the CRM record before server-only AIMedicalls delivery with bounded retries; this protects credentials and preserves leads during provider failures.
- Render and submit consent from one shared text constant so the captured consent matches what the visitor sees.
- Keep call recordings in private storage and obtain expiring signed URLs under the signed-in admin's session; this preserves admin-only access without exposing recordings publicly.