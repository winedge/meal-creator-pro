# Roadmap

- [x] Meta Pixel + Google Ads conversion tracking, manual config (no connectors)
  - [x] Admin → Ad Tracking tab for Meta Pixel ID, CAPI token, Google AW-ID + label, master switch
  - [x] Consent route: no banner, tags blocked in EEA/UK/CH and unresolved regions
  - [x] Browser Pixel + Google tag load from saved settings; Lead + conversion fire on both form submissions
  - [x] meta-capi edge function sends the server event with the shared event id (deployed, verified reachable)
  - [x] Privacy policy at /privacy naming data, recipients, purposes; linked in both footers
- [x] Remove all torts except MVA & SSDI (site content, form options, rideshare page + admin tab removed)
- [x] Re-add rideshare tort: dedicated /rideshare-abuse page, homepage practice card + claim option, CRM filter label
- [x] Rework landing page around MVA & SSDI for ad traffic
- [ ] User: paste real IDs in Admin → Ad Tracking, then publish
- [ ] After publishing: verify a test Lead arrives in Meta Events Manager and Google Ads (needs live domain + real IDs)
