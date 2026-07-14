import { useState } from "react";
import { ArrowRight, ArrowUpRight, Check, ChevronDown, Pill, Stethoscope, ShieldAlert, Scale, FileText, Users, MapPin, ClipboardCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { toast } from "sonner";
import heroImg from "@/assets/hero-still-life.jpg";
import attorneyImg from "@/assets/attorney-portrait.jpg";

const caseCategories = [
  { icon: Pill, title: "Defective Medications", desc: "Claims tied to unsafe drugs, mislabeled prescriptions, and undisclosed side effects." },
  { icon: Stethoscope, title: "Medical Device Failure", desc: "Injuries involving implants, catheters, and hardware malfunctions." },
  { icon: ShieldAlert, title: "Manufacturer Negligence", desc: "Matters involving warning, design, and safety failures across product lines." },
];

const steps = [
  { n: "01", title: "Share the basics", desc: "Submit your name, contact, and a short summary so our team can assess fit and urgency." },
  { n: "02", title: "Review case signals", desc: "Our intake specialists compare your submission against active litigation criteria." },
  { n: "03", title: "Route to counsel", desc: "Qualified claims move to attorney follow-up. Informational leads continue with educational resources." },
  { n: "04", title: "Stay informed", desc: "Ongoing updates, litigation summaries, and briefings keep you engaged after first contact." },
];

const lawsuits = [
  { tag: "Medical device", title: "Port catheter complications", desc: "Potential claims related to catheter defects, migration, fracture, or device-related failures." },
  { tag: "Pharmaceutical", title: "Dangerous drug injuries", desc: "Side effects, inadequate warnings, contamination, and delayed regulatory response." },
  { tag: "Implant litigation", title: "Defective implant claims", desc: "Consumer injury matters involving mechanical failure, erosion, revision surgery, or design defects." },
  { tag: "Consumer protection", title: "Negligence-related harm", desc: "Manufacturer misconduct, missing disclosures, or avoidable safety failures." },
];

const updates = [
  { date: "Dec 17, 2025", title: "Port catheter motions signal case momentum", desc: "Procedural activity in MDL-related matters points to a strong engagement window for claimants researching device complications." },
  { date: "Dec 17, 2025", title: "Drug discovery coverage drives educational traffic", desc: "Not every update reports on a new lawsuit — broader pharmaceutical safety reporting keeps the page informative and current." },
  { date: "Dec 16, 2025", title: "Multi-state actions show the value of timely intake", desc: "Fast-moving litigation environments reward landing pages that explain developments clearly and route visitors toward next steps." },
];

const stats = [
  { k: "50", label: "States served" },
  { k: "3-step", label: "Claimant intake" },
  { k: "24hr", label: "Median follow-up" },
  { k: "100%", label: "Confidential review" },
];

const nav = [
  { label: "Why us", href: "#why" },
  { label: "Process", href: "#process" },
  { label: "Lawsuits", href: "#lawsuits" },
  { label: "Updates", href: "#updates" },
  { label: "Contact", href: "#contact" },
];

export default function Index() {
  const [open, setOpen] = useState<string | undefined>("item-0");

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast.success("Review request received", {
      description: "A member of our intake team will reach out within one business day.",
    });
    (e.target as HTMLFormElement).reset();
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Nav */}
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/85 backdrop-blur-md">
        <div className="container flex h-16 items-center justify-between">
          <a href="#" className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-md bg-ink text-cream">
              <Scale className="h-4 w-4" />
            </span>
            <div className="leading-tight">
              <div className="font-serif text-lg font-semibold text-ink">Med Injury Claims</div>
              <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">Legal intake, done well</div>
            </div>
          </a>
          <nav className="hidden items-center gap-8 md:flex">
            {nav.map((n) => (
              <a key={n.href} href={n.href} className="text-sm font-medium text-ink-soft transition-colors hover:text-ink">
                {n.label}
              </a>
            ))}
          </nav>
          <Button asChild className="rounded-full bg-clay text-accent-foreground shadow-soft hover:bg-clay-deep">
            <a href="#contact">Start a case review <ArrowRight className="ml-1 h-4 w-4" /></a>
          </Button>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[520px] bg-gradient-to-b from-cream-deep/70 via-background to-background" />
        <div className="container grid gap-10 pt-14 pb-20 lg:grid-cols-[1.15fr_1fr] lg:gap-14 lg:pt-24 lg:pb-28">
          <div className="animate-fade-up">
            <span className="eyebrow"><span className="h-1.5 w-1.5 rounded-full bg-clay" /> Claimant intake, rebuilt</span>
            <h1 className="mt-6 font-serif text-5xl leading-[0.98] tracking-tight text-ink sm:text-6xl lg:text-7xl">
              Connect injured consumers with the right{" "}
              <span className="italic text-clay">legal team</span> — faster.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-soft">
              Med Injury Claims is a modern intake experience for law firms handling pharmaceutical injury,
              defective device, and negligence matters. Built for clarity, trust, and conversion — without the
              overhead of legacy plugins.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button asChild size="lg" className="h-12 rounded-full bg-ink px-6 text-cream hover:bg-ink/90">
                <a href="#contact">Request a case review <ArrowRight className="ml-1.5 h-4 w-4" /></a>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-12 rounded-full border-ink/20 bg-transparent px-6 text-ink hover:bg-ink/5">
                <a href="#lawsuits">Browse active lawsuits</a>
              </Button>
            </div>

            <dl className="mt-12 grid grid-cols-2 gap-6 border-t border-border pt-8 sm:grid-cols-4">
              {stats.map((s) => (
                <div key={s.label}>
                  <dt className="font-serif text-3xl font-semibold text-ink">{s.k}</dt>
                  <dd className="mt-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">{s.label}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Hero card cluster */}
          <div className="relative">
            <div className="relative overflow-hidden rounded-3xl border border-border bg-card shadow-card">
              <img
                src={heroImg}
                alt="Legal documents, fountain pen, and pill bottle in warm editorial light"
                width={1200}
                height={1408}
                className="h-[420px] w-full object-cover"
              />
              <div className="absolute bottom-4 left-4 right-4 rounded-2xl bg-background/95 p-5 shadow-soft backdrop-blur">
                <div className="flex items-center gap-3">
                  <img src={attorneyImg} alt="Intake specialist" width={48} height={48} className="h-11 w-11 rounded-full object-cover" loading="lazy" />
                  <div>
                    <div className="text-sm font-semibold text-ink">Reviewed by legal intake specialists</div>
                    <div className="text-xs text-muted-foreground">Every submission is confidentially assessed within 24 hours.</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-5 rounded-3xl border border-border bg-card p-5 shadow-soft">
              <div className="mb-3 flex items-center justify-between">
                <div className="eyebrow">Focus areas</div>
                <span className="text-xs text-muted-foreground">Tap to expand</span>
              </div>
              <Accordion type="single" collapsible value={open} onValueChange={setOpen} className="divide-y divide-border">
                {caseCategories.map((c, i) => (
                  <AccordionItem key={c.title} value={`item-${i}`} className="border-none">
                    <AccordionTrigger className="py-4 hover:no-underline">
                      <div className="flex items-center gap-3 text-left">
                        <span className="grid h-9 w-9 place-items-center rounded-lg bg-secondary text-ink">
                          <c.icon className="h-4 w-4" />
                        </span>
                        <span className="font-medium text-ink">{c.title}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pl-12 text-sm text-ink-soft">{c.desc}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </div>
      </section>

      {/* Why */}
      <section id="why" className="border-t border-border bg-secondary/40 py-24">
        <div className="container">
          <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
            <div>
              <span className="eyebrow">Why claimants convert</span>
              <h2 className="mt-5 font-serif text-4xl leading-tight text-ink sm:text-5xl">
                Your path to legal representation, made clear.
              </h2>
              <p className="mt-5 max-w-md text-ink-soft">
                Injured consumers need a straightforward route to counsel. Every element of this experience is designed
                to reduce friction, build trust, and route the right claim to the right attorney.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                { icon: Scale, title: "Expert legal guidance", desc: "A direct route to request help, ask questions, and understand whether an injury meets active screening criteria." },
                { icon: ClipboardCheck, title: "Streamlined screening", desc: "A clear intake path that routes claimants toward the firm or campaign best suited to the case details you provide." },
                { icon: FileText, title: "Educational resources", desc: "Plain-language explanations around injuries, product failures, and documentation that may be useful during review." },
              ].map((f, i) => (
                <div key={f.title} className="group flex flex-col rounded-2xl border border-border bg-card p-6 shadow-soft transition-all hover:-translate-y-1 hover:shadow-card">
                  <div className="mb-4 flex items-center justify-between">
                    <span className="grid h-10 w-10 place-items-center rounded-lg bg-ink text-cream"><f.icon className="h-4 w-4" /></span>
                    <span className="font-serif text-sm text-muted-foreground">{String(i + 1).padStart(2, "0")}</span>
                  </div>
                  <h3 className="font-serif text-xl text-ink">{f.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-soft">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA band */}
          <div className="mt-16 flex flex-col items-start justify-between gap-6 rounded-3xl bg-ink p-8 text-cream shadow-card sm:flex-row sm:items-center sm:p-10">
            <div>
              <h3 className="font-serif text-2xl sm:text-3xl">Find the right attorney today.</h3>
              <p className="mt-2 max-w-xl text-sm text-cream/75">
                You may be eligible for compensation. Use the intake form below to start a confidential case review.
              </p>
            </div>
            <Button asChild size="lg" className="h-12 rounded-full bg-clay px-6 text-accent-foreground hover:bg-clay-deep">
              <a href="#contact">Start review <ArrowRight className="ml-1.5 h-4 w-4" /></a>
            </Button>
          </div>
        </div>
      </section>

      {/* Process */}
      <section id="process" className="py-24">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <span className="eyebrow">Simple workflow</span>
            <h2 className="mt-5 font-serif text-4xl leading-tight text-ink sm:text-5xl">How the intake process works.</h2>
            <p className="mt-5 text-ink-soft">Four dependable steps — designed to route claims accurately across desktop and mobile without third-party dependencies.</p>
          </div>

          <div className="relative mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((s, i) => (
              <div key={s.n} className="relative rounded-2xl border border-border bg-card p-6 shadow-soft">
                <div className="mb-5 flex items-center justify-between">
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-ink font-serif text-sm text-cream">{i + 1}</span>
                  {i < steps.length - 1 && <ArrowRight className="hidden h-4 w-4 text-muted-foreground lg:block" />}
                </div>
                <h3 className="font-serif text-lg text-ink">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lawsuits */}
      <section id="lawsuits" className="border-t border-border bg-secondary/40 py-24">
        <div className="container">
          <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
            <div className="max-w-2xl">
              <span className="eyebrow">Active lawsuits</span>
              <h2 className="mt-5 font-serif text-4xl leading-tight text-ink sm:text-5xl">Browse current case categories.</h2>
              <p className="mt-4 text-ink-soft">A curated view of active litigation lanes we route claimants into. Categories are updated as new cases open.</p>
            </div>
            <Button variant="outline" className="rounded-full border-ink/20 bg-card hover:bg-ink/5">
              View all intake options <ArrowUpRight className="ml-1 h-4 w-4" />
            </Button>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {lawsuits.map((l) => (
              <article key={l.title} className="group flex h-full flex-col justify-between rounded-2xl border border-border bg-card p-6 shadow-soft transition-all hover:-translate-y-1 hover:shadow-card">
                <div>
                  <h3 className="font-serif text-xl text-ink">{l.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-ink-soft">{l.desc}</p>
                </div>
                <div className="mt-6 flex items-center justify-between">
                  <span className="inline-flex items-center rounded-full bg-clay/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-clay-deep">{l.tag}</span>
                  <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-ink" />
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Updates */}
      <section id="updates" className="py-24">
        <div className="container">
          <div className="grid gap-10 lg:grid-cols-[1fr_1.6fr] lg:gap-16">
            <div>
              <span className="eyebrow">Latest updates</span>
              <h2 className="mt-5 font-serif text-4xl leading-tight text-ink sm:text-5xl">Publish clear legal insights, without the plugin overhead.</h2>
              <p className="mt-5 text-ink-soft">Editorial-style content keeps injured consumers informed — and keeps your page ranking for the case types your firm is actively pursuing.</p>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {updates.map((u) => (
                <article key={u.title} className="flex flex-col justify-between rounded-2xl border border-border bg-card p-6 shadow-soft transition-all hover:-translate-y-1 hover:shadow-card">
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-wider text-clay-deep">{u.date}</div>
                    <h3 className="mt-3 font-serif text-lg leading-snug text-ink">{u.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-ink-soft">{u.desc}</p>
                  </div>
                  <a href="#" className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-ink hover:text-clay-deep">
                    Read insight <ArrowRight className="h-3.5 w-3.5" />
                  </a>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="border-t border-border bg-secondary/40 py-24">
        <div className="container">
          <div className="grid gap-8 lg:grid-cols-[1fr_1.3fr] lg:gap-14">
            <div>
              <span className="eyebrow">Free case review</span>
              <h2 className="mt-5 font-serif text-4xl leading-tight text-ink sm:text-5xl">Request a review, or adapt this page to your intake workflow.</h2>
              <p className="mt-5 text-ink-soft">
                This form validates input on-page and confirms receipt instantly. Wire the endpoint to your CRM or intake API when you're ready to go live.
              </p>

              <div className="mt-8 space-y-4">
                {[
                  { icon: Users, title: "For claimants", desc: "Share what happened, the product involved, and when the injury or complication occurred." },
                  { icon: Scale, title: "For law firms", desc: "Use this page as a clean front-end for campaign-specific screening and follow-up automation." },
                  { icon: MapPin, title: "Nationwide coverage", desc: "Intake routing works across state lines — matched to firms licensed in your jurisdiction." },
                ].map((item) => (
                  <div key={item.title} className="flex items-start gap-4 rounded-2xl border border-border bg-card p-5 shadow-soft">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-ink text-cream">
                      <item.icon className="h-4 w-4" />
                    </span>
                    <div>
                      <div className="font-semibold text-ink">{item.title}</div>
                      <p className="mt-1 text-sm text-ink-soft">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <form onSubmit={onSubmit} className="rounded-3xl border border-border bg-card p-8 shadow-card">
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Full name</Label>
                  <Input id="name" required placeholder="Jordan Smith" className="h-11 rounded-lg bg-background" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email address</Label>
                  <Input id="email" type="email" required placeholder="name@example.com" className="h-11 rounded-lg bg-background" />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="phone">Phone (optional)</Label>
                  <Input id="phone" type="tel" placeholder="(555) 123-4567" className="h-11 rounded-lg bg-background" />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="category">Case category</Label>
                  <Select>
                    <SelectTrigger id="category" className="h-11 rounded-lg bg-background">
                      <SelectValue placeholder="Select one" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="medications">Defective medications</SelectItem>
                      <SelectItem value="device">Medical device failure</SelectItem>
                      <SelectItem value="implant">Defective implant</SelectItem>
                      <SelectItem value="negligence">Manufacturer negligence</SelectItem>
                      <SelectItem value="other">Something else</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="summary">Brief case summary</Label>
                  <Textarea id="summary" required rows={5} placeholder="Describe the injury, product involved, and any timeline details you want reviewed." className="rounded-lg bg-background" />
                </div>
              </div>
              <Button type="submit" size="lg" className="mt-6 h-12 w-full rounded-full bg-clay text-accent-foreground hover:bg-clay-deep">
                Submit review request <ArrowRight className="ml-1.5 h-4 w-4" />
              </Button>
              <p className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                <Check className="h-3.5 w-3.5 text-clay" /> Submissions are private. No data is sold or shared with third parties.
              </p>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-background">
        <div className="container grid gap-10 py-16 lg:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-2">
              <span className="grid h-8 w-8 place-items-center rounded-md bg-ink text-cream">
                <Scale className="h-4 w-4" />
              </span>
              <span className="font-serif text-lg font-semibold text-ink">Med Injury Claims</span>
            </div>
            <p className="mt-4 max-w-md text-sm text-ink-soft">
              A modern, dependency-free landing page for legal lead generation — built to route injured consumers to
              qualified attorneys with clarity and speed.
            </p>
          </div>
          <div>
            <div className="text-sm font-semibold text-ink">Explore</div>
            <ul className="mt-4 space-y-2 text-sm text-ink-soft">
              {nav.map((n) => (
                <li key={n.href}><a href={n.href} className="hover:text-ink">{n.label}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <div className="text-sm font-semibold text-ink">Next integration points</div>
            <ul className="mt-4 space-y-2 text-sm text-ink-soft">
              <li>Wire form endpoint to your CRM</li>
              <li>Refresh content blocks per campaign</li>
              <li>Add case-specific landing pages</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-border">
          <div className="container flex flex-col items-start justify-between gap-3 py-6 text-xs text-muted-foreground sm:flex-row sm:items-center">
            <div>© {new Date().getFullYear()} Med Injury Claims. All rights reserved.</div>
            <div className="flex items-center gap-5">
              <a href="#" className="hover:text-ink">Privacy</a>
              <a href="#" className="hover:text-ink">Terms</a>
              <a href="#" className="hover:text-ink">Disclaimer</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
