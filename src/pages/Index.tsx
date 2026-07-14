import { Phone, Mail, MapPin, Clock, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import officeImg from "@/assets/office.jpg";

const nav = [
  { label: "Home", href: "#top" },
  { label: "About Us", href: "#about" },
  { label: "Practice Areas", href: "#practice" },
  { label: "Case Results", href: "#results" },
  { label: "Contact", href: "#contact" },
];

const practiceAreas = [
  { title: "Defective Medications", desc: "Representation for injuries caused by unsafe prescription drugs, mislabeled medications, and undisclosed side effects." },
  { title: "Medical Device Failure", desc: "Claims involving implants, catheters, surgical hardware, and other devices that failed to perform as intended." },
  { title: "Manufacturer Negligence", desc: "Cases involving inadequate warnings, design defects, and safety failures by pharmaceutical and product manufacturers." },
  { title: "Product Liability", desc: "Legal support for consumers harmed by defective consumer products across a wide range of industries." },
  { title: "Class Action Support", desc: "Guidance and representation for individuals joining or considering ongoing class action lawsuits." },
  { title: "Personal Injury Claims", desc: "Comprehensive representation for individuals seeking compensation following a serious injury." },
];

const stats = [
  { k: "25+", l: "Years of Experience" },
  { k: "$500M+", l: "Recovered for Clients" },
  { k: "10,000+", l: "Cases Handled" },
  { k: "50", l: "States Served" },
];

export default function Index() {
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast.success("Thank you. Your request has been received.", {
      description: "A member of our team will contact you within one business day.",
    });
    (e.target as HTMLFormElement).reset();
  };

  return (
    <div id="top" className="min-h-screen bg-background text-foreground">
      {/* Top utility bar */}
      <div className="border-b border-border bg-navy text-primary-foreground">
        <div className="container flex h-10 items-center justify-between text-sm">
          <div className="hidden items-center gap-6 sm:flex">
            <span className="flex items-center gap-2"><Phone className="h-3.5 w-3.5" /> (800) 555-0142</span>
            <span className="flex items-center gap-2"><Mail className="h-3.5 w-3.5" /> intake@medinjuryclaims.com</span>
          </div>
          <div className="flex items-center gap-2 text-primary-foreground/80">
            <Clock className="h-3.5 w-3.5" />
            <span>Free consultation, available 24/7</span>
          </div>
        </div>
      </div>

      {/* Header / Nav */}
      <header className="border-b border-border bg-background">
        <div className="container flex h-20 items-center justify-between">
          <a href="#top" className="flex items-baseline gap-2">
            <span className="font-serif text-2xl font-black text-navy">Med Injury Claims</span>
            <span className="hidden text-xs uppercase tracking-widest text-muted-foreground sm:inline">Attorneys at Law</span>
          </a>
          <nav className="hidden items-center gap-8 lg:flex">
            {nav.map((n) => (
              <a key={n.href} href={n.href} className="text-sm font-semibold text-navy hover:text-gold">
                {n.label}
              </a>
            ))}
          </nav>
          <Button asChild className="bg-gold text-accent-foreground hover:bg-gold/90">
            <a href="#contact">Free Case Review</a>
          </Button>
        </div>
      </header>

      {/* Hero */}
      <section className="border-b border-border bg-surface">
        <div className="container grid gap-12 py-16 lg:grid-cols-2 lg:items-center lg:py-24">
          <div>
            <div className="mb-4 flex items-center gap-3">
              <span className="h-px w-10 bg-gold" />
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">Trusted Legal Representation</span>
            </div>
            <h1 className="font-serif text-4xl font-black leading-tight text-navy sm:text-5xl lg:text-6xl">
              Advocating for Those Injured by Defective Drugs and Medical Devices.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
              For over 25 years, our attorneys have helped injured consumers pursue fair compensation from
              pharmaceutical manufacturers and medical device companies. Every consultation is free and confidential.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="bg-navy hover:bg-navy-deep">
                <a href="#contact">Request a Free Consultation</a>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-navy text-navy hover:bg-navy hover:text-primary-foreground">
                <a href="#practice">View Practice Areas</a>
              </Button>
            </div>
            <div className="mt-8 flex items-center gap-2 text-sm text-muted-foreground">
              <Phone className="h-4 w-4 text-gold" />
              Call now for a confidential review: <a href="tel:8005550142" className="font-semibold text-navy hover:underline">(800) 555-0142</a>
            </div>
          </div>

          <div className="relative">
            <img
              src={officeImg}
              alt="Law firm office interior"
              width={1200}
              height={900}
              className="w-full border border-border object-cover shadow-md"
            />
            <div className="absolute -bottom-6 -left-6 hidden max-w-xs border border-border bg-background p-5 shadow-md sm:block">
              <div className="text-xs font-semibold uppercase tracking-widest text-gold">Our Commitment</div>
              <p className="mt-2 font-serif text-lg leading-snug text-navy">
                "No fee unless we recover compensation for you."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats strip */}
      <section className="border-b border-border bg-navy text-primary-foreground">
        <div className="container grid grid-cols-2 gap-8 py-12 md:grid-cols-4">
          {stats.map((s) => (
            <div key={s.l} className="text-center">
              <div className="font-serif text-4xl font-black text-primary-foreground">{s.k}</div>
              <div className="mt-1 text-sm uppercase tracking-wider text-primary-foreground/75">{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* About */}
      <section id="about" className="border-b border-border">
        <div className="container grid gap-12 py-20 lg:grid-cols-[1fr_1.4fr]">
          <div>
            <div className="mb-4 flex items-center gap-3">
              <span className="h-px w-10 bg-gold" />
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">About Our Firm</span>
            </div>
            <h2 className="font-serif text-3xl font-black leading-tight text-navy sm:text-4xl">
              A firm built on experience, integrity, and results.
            </h2>
          </div>
          <div className="space-y-5 text-base leading-relaxed text-muted-foreground">
            <p>
              Med Injury Claims is a nationally recognized legal practice focused on pharmaceutical injury,
              defective medical device, and manufacturer negligence litigation. Our attorneys have handled
              matters in every U.S. jurisdiction and worked alongside leading firms in some of the country's
              largest multidistrict litigations.
            </p>
            <p>
              We take a straightforward approach: careful review of every claim, honest guidance about the
              strength of your case, and dedicated representation from intake through resolution. There is
              no cost to speak with our team, and no obligation to proceed after your consultation.
            </p>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {[
                "Licensed nationwide",
                "Contingency-fee representation",
                "Confidential case review",
                "Multi-district litigation experience",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-navy">
                  <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Practice Areas */}
      <section id="practice" className="border-b border-border bg-surface">
        <div className="container py-20">
          <div className="mx-auto max-w-2xl text-center">
            <div className="mb-4 flex items-center justify-center gap-3">
              <span className="h-px w-10 bg-gold" />
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">Practice Areas</span>
              <span className="h-px w-10 bg-gold" />
            </div>
            <h2 className="font-serif text-3xl font-black leading-tight text-navy sm:text-4xl">
              Comprehensive representation across pharmaceutical and product liability matters.
            </h2>
            <p className="mt-4 text-muted-foreground">
              Our attorneys handle a wide range of claims involving injuries caused by defective drugs,
              medical devices, and consumer products.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {practiceAreas.map((p, i) => (
              <article key={p.title} className="border border-border bg-background p-7 shadow-sm transition-shadow hover:shadow-md">
                <div className="font-serif text-sm text-gold">{String(i + 1).padStart(2, "0")}</div>
                <h3 className="mt-2 font-serif text-xl font-bold text-navy">{p.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{p.desc}</p>
                <a href="#contact" className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-navy hover:text-gold">
                  Learn more <ChevronRight className="h-4 w-4" />
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Process / Results */}
      <section id="results" className="border-b border-border">
        <div className="container grid gap-12 py-20 lg:grid-cols-2">
          <div>
            <div className="mb-4 flex items-center gap-3">
              <span className="h-px w-10 bg-gold" />
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">Our Process</span>
            </div>
            <h2 className="font-serif text-3xl font-black leading-tight text-navy sm:text-4xl">
              What to expect when you contact our firm.
            </h2>
            <ol className="mt-8 space-y-6">
              {[
                { t: "Initial Consultation", d: "Speak with an intake specialist about your situation at no cost and no obligation." },
                { t: "Case Review", d: "Our attorneys review your claim against active litigation criteria and current medical evidence." },
                { t: "Representation", d: "If your claim qualifies, we handle the case on a contingency-fee basis — no fee unless we recover." },
                { t: "Resolution", d: "We negotiate settlements or litigate in court, keeping you informed at every stage." },
              ].map((s, i) => (
                <li key={s.t} className="flex gap-5 border-b border-border pb-6 last:border-b-0">
                  <div className="grid h-10 w-10 shrink-0 place-items-center bg-navy font-serif text-lg font-bold text-primary-foreground">
                    {i + 1}
                  </div>
                  <div>
                    <h3 className="font-serif text-lg font-bold text-navy">{s.t}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{s.d}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div className="bg-surface p-10">
            <div className="mb-4 flex items-center gap-3">
              <span className="h-px w-10 bg-gold" />
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">Client Testimonial</span>
            </div>
            <blockquote className="font-serif text-2xl leading-snug text-navy">
              "From my first call, the team explained every step in plain language. They took my case seriously
              when other firms wouldn't return my calls. I'm grateful for their persistence and professionalism."
            </blockquote>
            <div className="mt-8 border-t border-border pt-6">
              <div className="font-semibold text-navy">Margaret L.</div>
              <div className="text-sm text-muted-foreground">Client, Pharmaceutical Injury Claim</div>
            </div>

            <div className="mt-10 grid grid-cols-2 gap-6 border-t border-border pt-8">
              <div>
                <div className="font-serif text-3xl font-black text-navy">98%</div>
                <div className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">Client Satisfaction</div>
              </div>
              <div>
                <div className="font-serif text-3xl font-black text-navy">24 hr</div>
                <div className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">Response Time</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="border-b border-border bg-surface">
        <div className="container grid gap-12 py-20 lg:grid-cols-[1fr_1.2fr]">
          <div>
            <div className="mb-4 flex items-center gap-3">
              <span className="h-px w-10 bg-gold" />
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">Free Consultation</span>
            </div>
            <h2 className="font-serif text-3xl font-black leading-tight text-navy sm:text-4xl">
              Request a confidential case review.
            </h2>
            <p className="mt-4 text-muted-foreground">
              Complete the form or reach us directly. All communications are confidential and there is no
              obligation to proceed after your consultation.
            </p>

            <div className="mt-8 space-y-5 border-t border-border pt-8">
              <div className="flex items-start gap-4">
                <Phone className="mt-0.5 h-5 w-5 text-gold" />
                <div>
                  <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Telephone</div>
                  <div className="font-serif text-lg text-navy">(800) 555-0142</div>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Mail className="mt-0.5 h-5 w-5 text-gold" />
                <div>
                  <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Email</div>
                  <div className="font-serif text-lg text-navy">intake@medinjuryclaims.com</div>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <MapPin className="mt-0.5 h-5 w-5 text-gold" />
                <div>
                  <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Main Office</div>
                  <div className="font-serif text-lg text-navy">1200 Market Street, Suite 400<br />Philadelphia, PA 19107</div>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Clock className="mt-0.5 h-5 w-5 text-gold" />
                <div>
                  <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Hours</div>
                  <div className="font-serif text-lg text-navy">Available 24/7 for new claims</div>
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={onSubmit} className="border border-border bg-background p-8 shadow-sm">
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="fname" className="text-navy">First Name</Label>
                <Input id="fname" required className="h-11 rounded-none border-border" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lname" className="text-navy">Last Name</Label>
                <Input id="lname" required className="h-11 rounded-none border-border" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-navy">Email Address</Label>
                <Input id="email" required type="email" className="h-11 rounded-none border-border" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-navy">Phone Number</Label>
                <Input id="phone" required type="tel" className="h-11 rounded-none border-border" />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="type" className="text-navy">Type of Claim</Label>
                <Select>
                  <SelectTrigger id="type" className="h-11 rounded-none border-border">
                    <SelectValue placeholder="Select the closest match" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="drug">Defective Medication</SelectItem>
                    <SelectItem value="device">Medical Device Failure</SelectItem>
                    <SelectItem value="implant">Defective Implant</SelectItem>
                    <SelectItem value="negligence">Manufacturer Negligence</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="msg" className="text-navy">Brief Description of Your Case</Label>
                <Textarea id="msg" required rows={5} className="rounded-none border-border" placeholder="Please describe your injury, the product involved, and approximate dates." />
              </div>
            </div>
            <Button type="submit" size="lg" className="mt-6 w-full bg-navy hover:bg-navy-deep">
              Submit for Free Review
            </Button>
            <p className="mt-4 text-xs text-muted-foreground">
              By submitting this form you agree to be contacted regarding your inquiry. Submissions are
              confidential and not shared with third parties.
            </p>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-navy-deep text-primary-foreground">
        <div className="container grid gap-10 py-14 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <div className="font-serif text-2xl font-black">Med Injury Claims</div>
            <div className="mt-1 text-xs uppercase tracking-widest text-primary-foreground/60">Attorneys at Law</div>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-primary-foreground/75">
              A nationally recognized legal practice focused on pharmaceutical injury, defective medical
              device, and manufacturer negligence litigation. Serving clients in all 50 states.
            </p>
          </div>
          <div>
            <div className="text-sm font-semibold uppercase tracking-widest text-primary-foreground">Navigation</div>
            <ul className="mt-4 space-y-2 text-sm text-primary-foreground/75">
              {nav.map((n) => (
                <li key={n.href}><a href={n.href} className="hover:text-gold">{n.label}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <div className="text-sm font-semibold uppercase tracking-widest text-primary-foreground">Contact</div>
            <ul className="mt-4 space-y-2 text-sm text-primary-foreground/75">
              <li>(800) 555-0142</li>
              <li>intake@medinjuryclaims.com</li>
              <li>1200 Market Street, Suite 400<br />Philadelphia, PA 19107</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-primary-foreground/15">
          <div className="container flex flex-col items-start justify-between gap-2 py-6 text-xs text-primary-foreground/60 sm:flex-row sm:items-center">
            <div>© {new Date().getFullYear()} Med Injury Claims. All rights reserved.</div>
            <div className="flex gap-6">
              <a href="#" className="hover:text-gold">Privacy Policy</a>
              <a href="#" className="hover:text-gold">Terms of Service</a>
              <a href="#" className="hover:text-gold">Attorney Advertising Disclaimer</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
