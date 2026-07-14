import { useState } from "react";
import { ArrowUpRight, ArrowRight, Circle, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import heroImg from "@/assets/hero-still-life.jpg";

// Editorial magazine layout — dark ink, bone type, ember accents.
// Structure: fixed left rail + right-rail dossier index, giant asymmetric masthead,
// numbered "brief", ticker marquee, dossier table, editor's letter, endnote CTA.

const dossiers = [
  { no: "N° 01", title: "Defective medications", meta: "MDL · Active", body: "Unsafe drugs, mislabeled prescriptions, and undisclosed side effects — filed across 27 jurisdictions this quarter." },
  { no: "N° 02", title: "Medical device failure", meta: "Class III · Ongoing", body: "Implants, catheters, and hardware malfunctions with documented revision surgery outcomes." },
  { no: "N° 03", title: "Manufacturer negligence", meta: "Consumer · Open", body: "Warning, design, and safety failures across pharmaceutical and consumer product lines." },
  { no: "N° 04", title: "Port catheter matters", meta: "Device · New", body: "Migration, fracture, and device-related failures under active review with partner counsel." },
];

const brief = [
  { n: "01", label: "Signal", body: "Claimant submits a two-minute intake with product, timeline, and injury detail." },
  { n: "02", label: "Screen", body: "Intake specialists cross-check against active litigation criteria within 24 hours." },
  { n: "03", label: "Route", body: "Qualified matters move to counsel licensed in the claimant's jurisdiction." },
  { n: "04", label: "Follow", body: "Case updates, litigation briefings, and educational resources continue post-contact." },
];

const nav = [
  ["00", "Masthead", "#top"],
  ["01", "Brief", "#brief"],
  ["02", "Dossiers", "#dossiers"],
  ["03", "Letter", "#letter"],
  ["04", "Contact", "#contact"],
];

const marqueeItems = [
  "Defective medications",
  "Port catheter litigation",
  "Consumer protection",
  "Medical device failure",
  "Pharmaceutical injury",
  "Manufacturer negligence",
  "Implant revision claims",
  "Nationwide intake",
];

const faqs = [
  { q: "Is a case review actually free?", a: "Yes. Every submission is reviewed at no cost. You are under no obligation to proceed after intake." },
  { q: "How long does intake take?", a: "About two minutes. Our specialists respond within one business day with next steps or referral." },
  { q: "Do I need documentation ready?", a: "No. If your matter moves to counsel, they will guide you through what records to gather." },
  { q: "Which states do you cover?", a: "All 50. We route claims to partner firms licensed in the claimant's jurisdiction." },
];

export default function Index() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast.success("Filed. Editor's review begins now.", {
      description: "Expect a reply within one business day.",
    });
    (e.target as HTMLFormElement).reset();
  };

  return (
    <div id="top" className="min-h-screen bg-background text-foreground selection:bg-ember selection:text-ink">
      {/* Fixed left rail — masthead identity */}
      <aside className="pointer-events-none fixed inset-y-0 left-0 z-30 hidden w-16 flex-col items-center justify-between border-r border-border py-6 lg:flex">
        <div className="pointer-events-auto flex flex-col items-center gap-3">
          <span className="grid h-9 w-9 place-items-center border border-border font-serif text-lg italic text-bone">M</span>
          <div className="rule h-6 w-px" />
        </div>
        <div className="pointer-events-auto -rotate-90 whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.4em] text-muted-foreground">
          Med Injury Claims · Vol. XII
        </div>
        <div className="pointer-events-auto font-mono text-[10px] uppercase tracking-widest text-muted-foreground">ISSN</div>
      </aside>

      {/* Fixed right rail — index nav */}
      <aside className="pointer-events-none fixed inset-y-0 right-0 z-30 hidden w-16 flex-col items-center justify-center gap-6 border-l border-border py-6 xl:flex">
        <div className="pointer-events-auto flex flex-col items-center gap-5">
          {nav.map(([n, , href]) => (
            <a key={n} href={href} className="group flex flex-col items-center gap-1">
              <Circle className="h-1.5 w-1.5 fill-muted-foreground text-muted-foreground transition-all group-hover:fill-ember group-hover:text-ember" />
              <span className="font-mono text-[10px] text-muted-foreground group-hover:text-bone">{n}</span>
            </a>
          ))}
        </div>
      </aside>

      <div className="lg:pl-16 xl:pr-16">
        {/* Top strip */}
        <div className="border-b border-border">
          <div className="container flex h-11 items-center justify-between font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
            <div className="hidden sm:block">Confidential legal intake · Est. 2013</div>
            <div className="flex items-center gap-6">
              <span>Nationwide · 50 states</span>
              <span className="hidden md:inline">24hr median reply</span>
              <a href="#contact" className="text-bone hover:text-ember">File a claim →</a>
            </div>
          </div>
        </div>

        {/* Nav strip */}
        <div className="border-b border-border">
          <div className="container flex h-14 items-center justify-between">
            <a href="#top" className="font-serif text-xl font-semibold tracking-tight text-bone">
              Med Injury <span className="italic text-ember">Claims</span>
            </a>
            <nav className="hidden items-center gap-8 md:flex">
              {nav.slice(1).map(([n, label, href]) => (
                <a key={href} href={href} className="group flex items-baseline gap-1.5 text-sm text-bone-soft hover:text-bone">
                  <span className="font-mono text-[10px] text-muted-foreground group-hover:text-ember">{n}</span>
                  {label}
                </a>
              ))}
            </nav>
            <Button asChild className="h-10 rounded-none bg-ember px-5 font-mono text-[11px] uppercase tracking-[0.2em] text-ink hover:bg-ember-deep">
              <a href="#contact">Start intake</a>
            </Button>
          </div>
        </div>

        {/* MASTHEAD — asymmetric 12-col */}
        <section className="relative border-b border-border">
          <div className="container relative py-16 lg:py-24">
            {/* meta row */}
            <div className="flex flex-wrap items-center justify-between gap-3 font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
              <div className="flex items-center gap-4">
                <span className="text-ember">●</span>
                <span>Volume XII</span>
                <span>·</span>
                <span>Issue 04</span>
                <span>·</span>
                <span>Winter 2026</span>
              </div>
              <div>Filed under: Pharmaceutical · Device · Negligence</div>
            </div>

            <div className="mt-10 grid gap-10 lg:grid-cols-12 lg:gap-8">
              {/* Headline (spans 8) */}
              <div className="lg:col-span-8">
                <h1 className="font-serif text-[13vw] font-medium leading-[0.86] tracking-[-0.03em] text-bone sm:text-[9vw] lg:text-[8.2vw]">
                  Injured by a<br />
                  product?<br />
                  <span className="italic text-ember">Find</span> counsel.
                </h1>
              </div>

              {/* Right column: dek + still-life */}
              <div className="flex flex-col justify-between gap-8 lg:col-span-4">
                <div className="border-l border-border pl-5">
                  <div className="kicker mb-3">The dek</div>
                  <p className="font-serif text-lg leading-snug text-bone-soft">
                    A modern intake desk for pharmaceutical injury, defective devices, and
                    manufacturer negligence — reported like a magazine, filed like a case.
                  </p>
                </div>

                <figure className="relative">
                  <img
                    src={heroImg}
                    alt="Editorial still-life: legal documents and prescription bottle"
                    width={1200}
                    height={1408}
                    className="aspect-[4/5] w-full object-cover grayscale-[15%]"
                  />
                  <figcaption className="mt-2 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                    Fig. 01 — Evidence, awaiting review
                  </figcaption>
                </figure>
              </div>
            </div>

            {/* Byline / stats strip */}
            <div className="mt-16 grid grid-cols-2 gap-x-6 gap-y-8 border-t border-border pt-10 md:grid-cols-4">
              {[
                ["50", "States served"],
                ["24hr", "Median reply"],
                ["2min", "Intake length"],
                ["100%", "Confidential"],
              ].map(([k, l]) => (
                <div key={l} className="flex items-baseline gap-4">
                  <div className="font-serif text-5xl font-medium text-bone">{k}</div>
                  <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{l}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Ticker marquee */}
        <section aria-hidden className="overflow-hidden border-b border-border bg-bone text-ink">
          <div className="marquee-track flex whitespace-nowrap py-4">
            {[...marqueeItems, ...marqueeItems].map((t, i) => (
              <span key={i} className="mx-8 flex items-center gap-8 font-serif text-2xl italic">
                {t}
                <span className="text-ember">✦</span>
              </span>
            ))}
          </div>
        </section>

        {/* BRIEF — numbered horizontal ledger */}
        <section id="brief" className="border-b border-border">
          <div className="container py-20 lg:py-28">
            <div className="grid gap-8 lg:grid-cols-12">
              <div className="lg:col-span-4">
                <div className="kicker">Section 01 — The Brief</div>
                <h2 className="mt-4 font-serif text-5xl leading-[0.95] tracking-tight text-bone lg:text-6xl">
                  How a claim moves from <span className="italic text-ember">signal</span> to counsel.
                </h2>
                <p className="mt-6 max-w-sm text-bone-soft">
                  Four movements. No plugins. No dead ends. Every submission is triaged by a human intake
                  specialist within one business day.
                </p>
              </div>

              <ol className="lg:col-span-8">
                {brief.map((b, i) => (
                  <li
                    key={b.n}
                    className="group relative grid grid-cols-12 gap-4 border-t border-border py-8 last:border-b hover:bg-secondary/40"
                  >
                    <div className="col-span-2 font-mono text-xs text-muted-foreground">{b.n}</div>
                    <div className="col-span-3 font-serif text-2xl italic text-bone">{b.label}</div>
                    <div className="col-span-6 text-bone-soft">{b.body}</div>
                    <div className="col-span-1 flex justify-end text-muted-foreground transition-colors group-hover:text-ember">
                      <ArrowUpRight className="h-5 w-5" />
                    </div>
                    {i === brief.length - 1 && (
                      <span className="absolute -bottom-2 right-0 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                        — end of brief
                      </span>
                    )}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        {/* DOSSIERS — table style */}
        <section id="dossiers" className="border-b border-border bg-secondary/30">
          <div className="container py-20 lg:py-28">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <div>
                <div className="kicker">Section 02 — Dossiers</div>
                <h2 className="mt-4 font-serif text-5xl leading-[0.95] tracking-tight text-bone lg:text-6xl">
                  Currently under <span className="italic text-ember">review</span>.
                </h2>
              </div>
              <a href="#contact" className="group inline-flex items-center gap-2 border-b border-bone pb-1 font-mono text-xs uppercase tracking-[0.22em] text-bone">
                Request a dossier <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </a>
            </div>

            <div className="mt-12 border-t border-border">
              {dossiers.map((d) => (
                <a
                  href="#contact"
                  key={d.no}
                  className="group grid grid-cols-12 items-baseline gap-4 border-b border-border py-8 transition-colors hover:bg-background"
                >
                  <div className="col-span-12 font-mono text-xs text-muted-foreground md:col-span-1">{d.no}</div>
                  <h3 className="col-span-12 font-serif text-3xl text-bone md:col-span-5 lg:text-4xl">
                    <span className="border-b border-transparent transition-colors group-hover:border-ember">{d.title}</span>
                  </h3>
                  <p className="col-span-12 text-sm leading-relaxed text-bone-soft md:col-span-4">{d.body}</p>
                  <div className="col-span-10 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground md:col-span-1">{d.meta}</div>
                  <div className="col-span-2 flex justify-end text-muted-foreground group-hover:text-ember md:col-span-1">
                    <ArrowUpRight className="h-6 w-6" />
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* EDITOR'S LETTER + FAQ split */}
        <section id="letter" className="border-b border-border">
          <div className="container py-20 lg:py-28">
            <div className="grid gap-14 lg:grid-cols-12 lg:gap-8">
              {/* Letter */}
              <article className="lg:col-span-7">
                <div className="kicker">Section 03 — Editor's letter</div>
                <p className="mt-8 font-serif text-4xl leading-[1.1] text-bone lg:text-5xl">
                  <span className="float-left mr-3 mt-1 font-serif text-8xl font-semibold leading-none text-ember">L</span>
                  egal aid should read the way a good essay reads — plainly, patiently, and with respect for
                  the reader's time. This page is our attempt at that. No third-party plugins to break, no
                  buried disclosures, no theatrics. Just a clear route from an injury you didn't ask for to
                  an attorney who takes it seriously.
                </p>
                <div className="mt-10 flex items-center gap-4 border-t border-border pt-6">
                  <div className="h-10 w-10 rounded-full bg-ember" />
                  <div>
                    <div className="font-serif italic text-bone">— The intake desk</div>
                    <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Med Injury Claims</div>
                  </div>
                </div>
              </article>

              {/* FAQ */}
              <div className="lg:col-span-5">
                <div className="kicker">Reader questions</div>
                <div className="mt-6 border-t border-border">
                  {faqs.map((f, i) => {
                    const open = openFaq === i;
                    return (
                      <div key={f.q} className="border-b border-border">
                        <button
                          onClick={() => setOpenFaq(open ? null : i)}
                          className="flex w-full items-start justify-between gap-4 py-5 text-left"
                        >
                          <div className="flex items-baseline gap-4">
                            <span className="font-mono text-[10px] text-muted-foreground">{String(i + 1).padStart(2, "0")}</span>
                            <span className="font-serif text-xl text-bone">{f.q}</span>
                          </div>
                          <span className="mt-1 text-ember">{open ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}</span>
                        </button>
                        {open && <p className="pb-6 pl-10 pr-8 text-sm leading-relaxed text-bone-soft">{f.a}</p>}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ENDNOTE — Contact / intake */}
        <section id="contact" className="border-b border-border bg-bone text-ink">
          <div className="container grid gap-12 py-20 lg:grid-cols-12 lg:gap-8 lg:py-28">
            <div className="lg:col-span-6">
              <div className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.22em] text-ink/60">
                <span className="text-ember">●</span> Endnote — File your claim
              </div>
              <h2 className="mt-6 font-serif text-6xl leading-[0.92] tracking-tight lg:text-7xl">
                Two minutes.<br />
                <span className="italic">One reply,</span> by tomorrow.
              </h2>
              <p className="mt-6 max-w-md text-ink/70">
                Submissions land at our intake desk directly. If your matter fits an active dossier, a
                specialist walks you through the next step. If not, we say so — plainly.
              </p>

              <dl className="mt-10 grid grid-cols-2 gap-6 border-t border-ink/15 pt-8">
                {[
                  ["No cost", "Every review is free."],
                  ["No obligation", "You choose the next step."],
                  ["Private", "We never sell submissions."],
                  ["Nationwide", "All 50 states."],
                ].map(([k, v]) => (
                  <div key={k}>
                    <dt className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink/60">{k}</dt>
                    <dd className="mt-1 font-serif text-lg">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <form onSubmit={onSubmit} className="border-t border-ink/15 pt-8 lg:col-span-6 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0">
              <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink/60">Intake — 01/04</div>
              <div className="mt-6 space-y-6">
                <label className="block">
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink/60">Full name</span>
                  <Input required placeholder="Jordan Smith" className="mt-2 h-12 rounded-none border-x-0 border-t-0 border-b border-ink/25 bg-transparent px-0 font-serif text-xl text-ink placeholder:text-ink/30 focus-visible:border-ember focus-visible:ring-0" />
                </label>
                <label className="block">
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink/60">Email</span>
                  <Input required type="email" placeholder="name@example.com" className="mt-2 h-12 rounded-none border-x-0 border-t-0 border-b border-ink/25 bg-transparent px-0 font-serif text-xl text-ink placeholder:text-ink/30 focus-visible:border-ember focus-visible:ring-0" />
                </label>
                <label className="block">
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink/60">Case summary</span>
                  <Textarea required rows={4} placeholder="What happened, which product, and when." className="mt-2 resize-none rounded-none border-x-0 border-t-0 border-b border-ink/25 bg-transparent px-0 font-serif text-lg text-ink placeholder:text-ink/30 focus-visible:border-ember focus-visible:ring-0" />
                </label>
              </div>
              <Button type="submit" className="mt-10 h-14 w-full rounded-none bg-ink font-mono text-[12px] uppercase tracking-[0.28em] text-bone hover:bg-ink/90">
                File the claim <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.18em] text-ink/50">
                By filing, you agree to a confidential review only. No obligation.
              </p>
            </form>
          </div>
        </section>

        {/* COLOPHON footer */}
        <footer className="border-b border-border">
          <div className="container grid gap-10 py-14 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <div className="font-serif text-3xl italic text-bone">Med Injury Claims</div>
              <p className="mt-3 max-w-sm text-sm text-bone-soft">
                An editorial-grade legal intake desk. Volume XII in continuous publication.
              </p>
            </div>
            {[
              ["Sections", nav.slice(1).map(([, l, h]) => [l, h])],
              ["Practice", [["Pharmaceutical", "#"], ["Devices", "#"], ["Negligence", "#"], ["Implants", "#"]]],
              ["Colophon", [["Privacy", "#"], ["Terms", "#"], ["Disclaimer", "#"], ["Press", "#"]]],
            ].map(([title, items]) => (
              <div key={title as string} className="lg:col-span-2">
                <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">{title as string}</div>
                <ul className="mt-4 space-y-2">
                  {(items as [string, string][]).map(([l, h]) => (
                    <li key={l}><a href={h} className="text-sm text-bone-soft hover:text-bone">{l}</a></li>
                  ))}
                </ul>
              </div>
            ))}
            <div className="lg:col-span-1 lg:text-right">
              <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">Set in</div>
              <div className="mt-4 font-serif italic text-bone">Fraunces & Inter</div>
            </div>
          </div>
          <div className="container flex flex-col items-start justify-between gap-2 border-t border-border py-5 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground sm:flex-row sm:items-center">
            <div>© {new Date().getFullYear()} Med Injury Claims — All rights reserved</div>
            <div>Filed with care · Printed on the web</div>
          </div>
        </footer>
      </div>
    </div>
  );
}
