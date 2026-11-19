export const RETRY_DELAYS_MS = [0, 30000, 30000];
const claims = { mva: 'Motor Vehicle Accident', ssdi: 'Social Security Disability', rideshare: 'Rideshare Abuse' };
const states = { CA: 'California', TX: 'Texas', NY: 'New York', FL: 'Florida', PA: 'Pennsylvania', IL: 'Illinois', OH: 'Ohio', GA: 'Georgia', NC: 'North Carolina', MI: 'Michigan' };
export function leadPayload(row) {
  return {
    first_name: row.first_name, last_name: row.last_name, email: row.email, phone: row.phone,
    address: row.address ?? '', city: row.city ?? '', state: row.state ?? '', zip: row.zip,
    claim_type: claims[row.claim_type] ?? row.claim_type,
    incident_state: states[row.incident_state] ?? row.incident_state ?? '',
    description: row.description ?? '', consent: row.consent, consent_text: row.consent_text,
    ip_address: row.ip_address ?? '', page_url: row.page_url ?? '',
    trustedform_cert_url: row.trusted_form_cert_url ?? '',
  };
}