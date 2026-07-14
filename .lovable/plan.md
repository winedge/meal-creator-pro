## Add TrustedForm certificate capture to the Case Review form

Integrate ActiveProspect's TrustedForm script so every form submission includes a certificate URL that can be sent to your lead buyer / CRM later.

### 1. Load the TrustedForm script
In `index.html`, inject the standard async TrustedForm snippet before `</body>`:

```html
<script type="text/javascript">
  (function() {
    var tf = document.createElement('script');
    tf.type = 'text/javascript'; tf.async = true;
    tf.src = ("https:" === document.location.protocol ? 'https' : 'http')
      + '://api.trustedform.com/trustedform.js?field=xxTrustedFormCertUrl&ping_field=xxTrustedFormPingUrl&l='
      + new Date().getTime() + Math.random();
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(tf, s);
  })();
</script>
<noscript>
  <img src="https://api.trustedform.com/ns.gif" alt="" />
</noscript>
```

The script auto-injects hidden inputs `xxTrustedFormCertUrl` and `xxTrustedFormPingUrl` into every `<form>` on the page.

### 2. Update the Case Review form in `src/pages/Index.tsx`
- Convert the intake section to a real `<form>` element (currently uses div + button click).
- Add hidden inputs so React doesn't overwrite what TrustedForm injects:
  - `<input type="hidden" name="xxTrustedFormCertUrl" />`
  - `<input type="hidden" name="xxTrustedFormPingUrl" />`
- Add zod validation (name, email, phone, state, zip, claim type, description, consent checkbox required).
- On submit:
  1. Read `xxTrustedFormCertUrl` value from the form.
  2. Validate fields.
  3. Show inline thank-you state (replace form with confirmation card containing checkmark, "Thank you — a case specialist will contact you within 24 hours", and the cert URL stored in component state for later dispatch).
  4. `console.log` the payload including `trustedFormCertUrl` so you can wire it to your endpoint later.

### 3. Inline thank-you UI
Add a `submitted` state. When true, render a centered success card in place of the form fields: green check icon, headline "Request received", supporting copy, and a muted line "Reference: {cert URL last 12 chars}".

### Notes
- No backend call is made — TrustedForm cert is captured and held in state; you can forward it to LeadConduit or your CRM whenever you're ready by sharing the endpoint.
- TrustedForm requires HTTPS in production (Lovable preview + published domains are HTTPS, so this works out of the box).
- No new dependencies needed (zod is already available in the shadcn stack).

### Files touched
- `index.html` — add TrustedForm script + noscript pixel
- `src/pages/Index.tsx` — form element, hidden inputs, validation, submitted state, thank-you card
