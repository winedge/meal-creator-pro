# Roadmap

- [ ] Meta Pixel + Google Ads conversion tracking, manual config (no connectors; user provides IDs)
  - [ ] Collect IDs: Google Ads conversion ID (AW-...), conversion label, Meta Pixel ID
  - [ ] Consent decision: regional banner vs skip consent regions (ask before installing)
  - [ ] Meta health-data eligibility: user confirms no data restrictions on dataset in Events Manager before wiring events
  - [ ] Install gtag + Meta Pixel base code, fire conversion events on form submit (both forms)
  - [ ] Add privacy policy naming data/recipients/purposes
  - [ ] Publish + verify tag fires end-to-end before any campaign spend
