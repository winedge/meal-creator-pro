import { Link } from "react-router-dom";
import logo from "@/assets/medinjuryclaims-logo.png";

export default function Privacy() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-navy-deep">
        <div className="container flex h-16 items-center">
          <Link to="/">
            <img src={logo} alt="Med Injury Claims" className="h-8 w-auto brightness-0 invert" />
          </Link>
        </div>
      </header>

      <main className="container max-w-3xl py-12">
        <h1 className="font-serif text-3xl font-black text-navy">Privacy Policy</h1>
        <p className="mt-2 text-sm text-muted-foreground">Last updated: October 2026</p>

        <div className="mt-8 space-y-8 text-sm leading-relaxed text-foreground/90">
          <section>
            <h2 className="font-serif text-lg font-bold text-navy">Information we collect</h2>
            <p className="mt-2">
              When you submit a case review form, we collect the details you provide: your name, email address,
              phone number, address, city, state, zip code, claim type, and your description of the incident,
              together with your consent record. We also record the page you submitted from, your browser's user
              agent, and a TrustedForm certificate (provided by ActiveProspect) that documents your form session.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-lg font-bold text-navy">How we use it</h2>
            <p className="mt-2">
              We use your submission to review your potential claim and to connect you with a participating law
              firm. Your information is shared only with our intake team and the attorneys handling your matter.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-lg font-bold text-navy">Advertising measurement</h2>
            <p className="mt-2">
              We advertise on Meta (Facebook and Instagram) and Google. To measure whether our ads lead to form
              submissions, our pages load the Meta Pixel and the Google Ads tag, and a successful form submission
              is reported to Meta (through the Pixel and the Conversions API) and to Google Ads as a conversion.
              These reports contain a unique event reference, the time of the event, the page address, and technical
              identifiers (your browser's user agent, IP address, and Meta cookie identifiers). The contents of your
              form - including any description of your injury or medical situation - are never sent to Meta or Google.
            </p>
            <p className="mt-2">
              Meta and Google may use these reports to measure and optimize our advertising under their own privacy
              policies. Ad clicks and impressions are counted by the platforms regardless of these settings.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-lg font-bold text-navy">Regional consent</h2>
            <p className="mt-2">
              Visitors in regions that require consent for advertising cookies (the European Economic Area, the
              United Kingdom, and Switzerland) are not tracked: the advertising tags and server reports described
              above are switched off for those visitors.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-lg font-bold text-navy">Your choices</h2>
            <p className="mt-2">
              You may opt out of personalized advertising through your Meta ad preferences and Google Ads Settings,
              and you may request access to or deletion of the information we hold about you by contacting us through
              this website. If you previously agreed to advertising measurement, you can withdraw that agreement the
              same way and we will stop future advertising reports about you.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-lg font-bold text-navy">Contact</h2>
            <p className="mt-2">
              Questions about this policy can be sent through the contact options on our homepage.
            </p>
          </section>
        </div>

        <Link to="/" className="mt-10 inline-block text-sm font-semibold text-brand-red hover:underline">
          Back to homepage
        </Link>
      </main>
    </div>
  );
}
