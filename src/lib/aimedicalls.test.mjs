import { test } from 'node:test';
import assert from 'node:assert/strict';
import { leadPayload, RETRY_DELAYS_MS } from '../../supabase/functions/submit-lead/payload.mjs';

test('AIMedicalls receives the requested field names and human-readable claim/state', () => {
  const payload = leadPayload({ first_name: 'John', last_name: 'Smith', email: 'john@example.com', phone: '(415) 555-1234', address: '12 Main St', city: 'Austin', state: 'TX', zip: '78701', claim_type: 'mva', incident_state: 'TX', description: 'Rear-ended at a red light last month, my neck and back hurt.', consent: true, consent_text: 'Exact wording', ip_address: '192.0.2.1', page_url: 'https://example.com/', trusted_form_cert_url: 'https://cert.trustedform.com/example' });
  assert.equal(payload.claim_type, 'Motor Vehicle Accident');
  assert.equal(payload.incident_state, 'Texas');
  assert.equal(payload.consent_text, 'Exact wording');
  assert.equal(payload.trustedform_cert_url, 'https://cert.trustedform.com/example');
  assert.equal(payload.phone, '(415) 555-1234');
  assert.equal(payload.consent, true);
  assert.equal(Object.keys(payload).length, 17);
});
test('AIMedicalls receives the submission ID as external_id for callback matching', () => {
  const id = '3f4b13e2-42c5-4f22-bfcc-3b531aef8c15';
  assert.equal(leadPayload({ id }).external_id, id);
});
test('delivery begins immediately with retry attempts inside the requested two-minute window', () => {
  assert.equal(RETRY_DELAYS_MS[0], 0);
  assert.ok(RETRY_DELAYS_MS.reduce((a, b) => a + b, 0) + RETRY_DELAYS_MS.length * 12000 <= 120000);
});