import { useState } from "react";
import { Phone, Mail, ChevronRight, ShieldCheck, Lock, Scale, Clock, CheckCircle2, Check } from "lucide-react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import logo from "@/assets/medinjuryclaims-logo.png.asset.json";
import courthouse from "@/assets/courthouse-hero.jpg";
import consult from "@/assets/consult.jpg";

const caseReviewSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required").max(60),
  lastName: z.string().trim().min(1, "Last name is required").max(60),
  email: z.string().trim().email("Enter a valid email").max(255),
  phone: z.string().trim().min(7, "Enter a valid phone number").max(25),
  address: z.string().trim().max(200).optional().or(z.literal("")),
  city: z.string().trim().max(80).optional().or(z.literal("")),
  state: z.string().trim().max(40).optional().or(z.literal("")),
  zip: z.string().trim().min(3, "Zip is required").max(12),
  claimType: z.string().min(1, "Select a claim type"),
  incidentState: z.string().max(40).optional().or(z.literal("")),
  description: z.string().trim().max(1000).optional().or(z.literal("")),
  consent: z.literal(true, { errorMap: () => ({ message: "Consent is required" }) }),
});


const nav = [
  { label: "Home", href: "#top" },
  { label: "About Us", href: "#about" },
  { label: "Frequently Asked Questions", href: "#faq" },
  { label: "Active Lawsuits", href: "#lawsuits" },
  { label: "Contact Us", href: "#contact" },
];

const lawsuits = [
  { t: "Rideshare Abuse", d: "Assault, harassment, and negligence claims involving Uber and Lyft drivers." },
  { t: "Roblox Abuse", d: "Investigations into online exploitation and grooming of minors on gaming platforms." },
  { t: "Defective Medications", d: "Injuries caused by unsafe prescription drugs and undisclosed side effects." },
  { t: "Medical Device Failure", d: "Claims involving implants, catheters, and surgical hardware defects." },
  { t: "Toxic Exposure", d: "Harm from contaminated water, industrial chemicals, and hazardous products." },
  { t: "Manufacturer Negligence", d: "Design defects and inadequate warnings by product manufacturers." },
];

const eligibility = [
  "You or a loved one suffered a serious injury connected to a product, drug, or service",
  "The incident involved a company, manufacturer, or platform named in an active investigation",
  "You received a diagnosis or documented harm from a medical professional",
  "The event occurred within the past several years and you have supporting records",
];

const receive = [
  { t: "Free Legal Consultation", d: "No upfront cost, no obligation." },
  { t: "Confidential Review", d: "Your information is kept private and secure." },
  { t: "Nationwide Support", d: "Attorneys licensed across the U.S." },
  { t: "No Upfront Fees", d: "Many attorneys work on a contingency basis — you pay nothing unless you win compensation." },
];

const faqs = [
  { q: "How much does it cost to speak with an attorney?", a: "Nothing. Every case review is free, confidential, and carries no obligation to proceed." },
  { q: "How long do I have to file a claim?", a: "Statutes of limitations vary by state and claim type. The sooner you speak with a qualified attorney, the more options you preserve." },
  { q: "Will my information be shared?", a: "Your submission is reviewed only by our intake team and the participating law firms handling your matter." },
  { q: "What if my case does not qualify?", a: "We will tell you honestly and, when possible, point you toward other resources at no cost." },
];

export default function Index() {
  const [submitted, setSubmitted] = useState(false);
  const [certRef, setCertRef] = useState<string>("");

  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const data = {
      firstName: String(fd.get("firstName") ?? ""),
      lastName: String(fd.get("lastName") ?? ""),
      email: String(fd.get("email") ?? ""),
      phone: String(fd.get("phone") ?? ""),
      address: String(fd.get("address") ?? ""),
      city: String(fd.get("city") ?? ""),
      state: String(fd.get("state") ?? ""),
      zip: String(fd.get("zip") ?? ""),
      claimType: String(fd.get("claimType") ?? ""),
      incidentState: String(fd.get("incidentState") ?? ""),
      description: String(fd.get("description") ?? ""),
      consent: fd.get("consent") === "on",
    };

    const parsed = caseReviewSchema.safeParse(data);
    if (!parsed.success) {
      toast.error(parsed.error.errors[0]?.message ?? "Please review the form.");
      return;
    }

    const trustedFormCertUrl = String(fd.get("xxTrustedFormCertUrl") ?? "");
    const trustedFormPingUrl = String(fd.get("xxTrustedFormPingUrl") ?? "");

    setSubmitting(true);
    const { error } = await supabase.from("submissions").insert({
      first_name: parsed.data.firstName,
      last_name: parsed.data.lastName,
      email: parsed.data.email,
      phone: parsed.data.phone,
      address: parsed.data.address || null,
      city: parsed.data.city || null,
      state: parsed.data.state || null,
      zip: parsed.data.zip,
      claim_type: parsed.data.claimType,
      incident_state: parsed.data.incidentState || null,
      description: parsed.data.description || null,
      consent: parsed.data.consent,
      trusted_form_cert_url: trustedFormCertUrl || null,
      trusted_form_ping_url: trustedFormPingUrl || null,
      page_url: window.location.href,
      user_agent: navigator.userAgent,
    });
    setSubmitting(false);

    if (error) {
      toast.error("We couldn't submit your request. Please try again.");
      console.error("[case-review] insert failed", error);
      return;
    }

    setCertRef(trustedFormCertUrl ? trustedFormCertUrl.slice(-12) : "pending");
    setSubmitted(true);
    form.reset();
  };


  return (
    <div id="top" className="min-h-screen bg-background text-foreground">
      {/* Top utility bar */}
      <div className="bg-navy-deep text-primary-foreground">
        <div className="container flex h-9 items-center justify-between text-xs">
          <div className="hidden items-center gap-5 sm:flex">
            <span className="flex items-center gap-1.5"><Phone className="h-3 w-3" /> (800) 555-0142</span>
            <span className="flex items-center gap-1.5"><Mail className="h-3 w-3" /> intake@medinjuryclaims.com</span>
          </div>
          <div className="flex items-center gap-1.5 text-primary-foreground/70">
            <Clock className="h-3 w-3" /> Free consultation · Available 24/7
          </div>
        </div>
      </div>

      {/* Header */}
      <header className="border-b border-border bg-background">
        <div className="container flex h-20 items-center justify-between">
          <a href="#top" className="flex items-center">
            <img src={logo.url} alt="Med Injury Claims — Trusted Representation, Proven Results" className="h-7 w-auto sm:h-10" />
          </a>
          <nav className="hidden items-center gap-7 lg:flex">
            {nav.map((n) => (
              <a key={n.href} href={n.href} className="text-sm font-semibold text-navy hover:text-brand-red">
                {n.label}
              </a>
            ))}
          </nav>
          <Button asChild className="bg-brand-red text-primary-foreground hover:bg-brand-red-dark">
            <a href="#contact">Free Case Review</a>
          </Button>
        </div>
      </header>

      {/* Hero — page title banner */}
      <section
        className="relative border-b border-border bg-navy-deep text-primary-foreground"
        style={{
          backgroundImage: `linear-gradient(rgba(10,14,25,0.82), rgba(10,14,25,0.9)), url(${courthouse})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="container py-20 lg:py-28">
          <div className="max-w-3xl">
            <div className="mb-4 text-xs font-semibold uppercase tracking-[0.22em] text-brand-red">
              Free · Confidential Case Review
            </div>
            <h1 className="font-serif text-4xl font-black leading-tight sm:text-5xl lg:text-6xl">
              Mass Tort & Personal Injury Investigation
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-primary-foreground/85 sm:text-lg">
              Injured by a defective product, medication, or the negligence of a major company?
              You may qualify for financial compensation through an ongoing lawsuit or individual claim.
              Speak with a qualified attorney — at no cost and no obligation.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="bg-brand-red text-primary-foreground hover:bg-brand-red-dark">
                <a href="#contact">Check If You Qualify</a>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground hover:text-navy">
                <a href="#lawsuits">View Active Lawsuits</a>
              </Button>
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-6 text-xs text-primary-foreground/70">
              <span className="flex items-center gap-1.5"><Lock className="h-3.5 w-3.5" /> 100% Confidential</span>
              <span className="flex items-center gap-1.5"><ShieldCheck className="h-3.5 w-3.5" /> No Obligation</span>
              <span className="flex items-center gap-1.5"><Scale className="h-3.5 w-3.5" /> Nationwide Attorneys</span>
            </div>
          </div>
        </div>
      </section>

      {/* Intro */}
      <section className="border-b border-border">
        <div className="container max-w-4xl py-16 text-center">
          <h2 className="font-serif text-2xl font-black text-navy sm:text-3xl">
            Justice for Victims of Negligence and Corporate Misconduct
          </h2>
          <p className="mt-5 text-base leading-relaxed text-muted-foreground">
            Over the past few years, alarming reports have surfaced of consumers being <strong className="text-navy">harmed by defective drugs,
            unsafe medical devices, and dangerous consumer products</strong> across the United States. If you or someone you
            love was injured, you may be entitled to <strong className="text-navy">significant compensation</strong> through
            an ongoing <strong className="text-navy">mass tort or individual lawsuit.</strong>
          </p>
          <div className="mt-8">
            <Button asChild className="bg-brand-red text-primary-foreground hover:bg-brand-red-dark uppercase tracking-wider">
              <a href="#contact">Do You Qualify to Join a Lawsuit?</a>
            </Button>
          </div>
        </div>
      </section>

      {/* What's happening */}
      <section id="about" className="border-b border-border bg-surface">
        <div className="container grid gap-12 py-16 lg:grid-cols-2 lg:items-center">
          <img
            src={consult}
            alt="Attorney consulting with a client"
            width={1200}
            height={900}
            loading="lazy"
            className="w-full border border-border object-cover shadow-md"
          />
          <div>
            <h2 className="font-serif text-2xl font-black text-navy sm:text-3xl">What's Happening?</h2>
            <p className="mt-4 text-muted-foreground">
              In recent years, multiple <strong className="text-navy">nationwide legal actions</strong> have been filed against major
              manufacturers, pharmaceutical companies, and digital platforms, alleging:
            </p>
            <ul className="mt-5 space-y-2.5 text-sm text-navy">
              {[
                "Negligent safety testing and quality control",
                "Failure to warn consumers of known risks",
                "Inadequate reporting and safety protocols",
                "Concealment of adverse events and injuries",
              ].map((i) => (
                <li key={i} className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand-red" /> {i}
                </li>
              ))}
            </ul>
            <p className="mt-5 text-muted-foreground">
              These lawsuits aim to hold companies accountable and provide financial recovery for victims of
              negligence, defective products, and corporate misconduct.
            </p>
          </div>
        </div>
      </section>

      {/* Qualification */}
      <section className="border-b border-border">
        <div className="container max-w-3xl py-16">
          <h2 className="font-serif text-2xl font-black text-navy sm:text-3xl">Do You Qualify to Join a Lawsuit?</h2>
          <p className="mt-3 text-sm text-muted-foreground">You may be eligible if:</p>
          <ul className="mt-6 space-y-3">
            {eligibility.map((e) => (
              <li key={e} className="flex items-start gap-3 border-b border-border pb-3 text-sm text-navy">
                <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-brand-red" /> {e}
              </li>
            ))}
          </ul>
          <p className="mt-6 text-sm text-muted-foreground">
            A confidential, no-obligation case review can help determine if your situation qualifies for legal action.
          </p>
          <div className="mt-6">
            <Button asChild size="lg" className="bg-brand-red text-primary-foreground hover:bg-brand-red-dark uppercase tracking-wider">
              <a href="#contact">Start My Free Case Review</a>
            </Button>
          </div>
        </div>
      </section>

      {/* Active lawsuits */}
      <section id="lawsuits" className="border-b border-border bg-surface">
        <div className="container py-16">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-serif text-2xl font-black text-navy sm:text-3xl">Active Lawsuits & Investigations</h2>
            <p className="mt-3 text-muted-foreground">
              Our legal partners are currently accepting claims across the following practice areas.
            </p>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {lawsuits.map((l, i) => {
              const href = l.t === "Rideshare Abuse" ? "/rideshare-abuse" : "#contact";
              return (
                <article key={l.t} className="border border-border bg-background p-6 shadow-sm transition hover:shadow-md">
                  <div className="font-serif text-xs font-bold text-brand-red">CASE {String(i + 1).padStart(2, "0")}</div>
                  <h3 className="mt-2 font-serif text-lg font-bold text-navy">{l.t}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{l.d}</p>
                  <a href={href} className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-navy hover:text-brand-red">
                    {l.t === "Rideshare Abuse" ? "Learn more" : "Assess your case"} <ChevronRight className="h-4 w-4" />
                  </a>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* What you'll receive */}
      <section className="border-b border-border">
        <div className="container py-16">
          <div className="mx-auto max-w-2xl text-center">
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-red">100% Confidential · No Obligation · Free Consultation</div>
            <h2 className="mt-3 font-serif text-2xl font-black text-navy sm:text-3xl">What You'll Receive</h2>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {receive.map((r) => (
              <div key={r.t} className="border-l-2 border-brand-red bg-surface p-5">
                <h3 className="font-serif text-base font-bold text-navy">{r.t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{r.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="border-b border-border bg-surface">
        <div className="container max-w-3xl py-16">
          <h2 className="font-serif text-2xl font-black text-navy sm:text-3xl">Frequently Asked Questions</h2>
          <div className="mt-8 divide-y divide-border border-y border-border">
            {faqs.map((f) => (
              <details key={f.q} className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-serif text-base font-bold text-navy">
                  {f.q}
                  <ChevronRight className="h-4 w-4 shrink-0 text-brand-red transition-transform group-open:rotate-90" />
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Case Review Form */}
      <section id="contact" className="border-b border-border">
        <div className="container max-w-4xl py-16">
          <div className="text-center">
            <h2 className="font-serif text-2xl font-black text-navy sm:text-3xl">Take the First Step Toward Justice</h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground">
              You don't have to face this alone. Click below to start your <strong className="text-navy">free, confidential case review</strong> — it only takes 30 seconds.
            </p>
          </div>

          {submitted ? (
            <div className="mt-10 border border-border bg-background p-8 text-center shadow-sm sm:p-14">
              <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-brand-red/10 text-brand-red">
                <Check className="h-7 w-7" />
              </div>
              <h3 className="mt-6 font-serif text-2xl font-black text-navy">Request received</h3>
              <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
                Thank you — a case specialist will contact you within 24 hours to discuss your potential claim.
                Please keep an eye on your phone and email.
              </p>
              <p className="mt-6 text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                Reference: {certRef || "pending"}
              </p>
            </div>
          ) : (
          <form onSubmit={onSubmit} className="mt-10 border border-border bg-background p-6 shadow-sm sm:p-10">
            <h3 className="font-serif text-2xl font-black text-navy">Case Review</h3>
            {/* TrustedForm auto-populated hidden fields */}
            <input type="hidden" name="xxTrustedFormCertUrl" defaultValue="" />
            <input type="hidden" name="xxTrustedFormPingUrl" defaultValue="" />
            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="fname" className="text-navy">First Name <span className="text-brand-red">*</span></Label>
                <Input id="fname" name="firstName" required placeholder="First Name" maxLength={60} className="h-11 rounded-none border-x-0 border-t-0 border-b border-border px-0 shadow-none focus-visible:ring-0" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="lname" className="text-navy">Last Name <span className="text-brand-red">*</span></Label>
                <Input id="lname" name="lastName" required placeholder="Last Name" maxLength={60} className="h-11 rounded-none border-x-0 border-t-0 border-b border-border px-0 shadow-none focus-visible:ring-0" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-navy">Email <span className="text-brand-red">*</span></Label>
                <Input id="email" name="email" required type="email" placeholder="Email" maxLength={255} className="h-11 rounded-none border-x-0 border-t-0 border-b border-border px-0 shadow-none focus-visible:ring-0" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="phone" className="text-navy">Phone / Mobile <span className="text-brand-red">*</span></Label>
                <Input id="phone" name="phone" required type="tel" placeholder="Mobile Number" maxLength={25} className="h-11 rounded-none border-x-0 border-t-0 border-b border-border px-0 shadow-none focus-visible:ring-0" />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="address" className="text-navy">Address</Label>
                <Input id="address" name="address" placeholder="Address Line 1" maxLength={200} className="h-11 rounded-none border-x-0 border-t-0 border-b border-border px-0 shadow-none focus-visible:ring-0" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="city" className="text-navy">City</Label>
                <Input id="city" name="city" placeholder="City" maxLength={80} className="h-11 rounded-none border-x-0 border-t-0 border-b border-border px-0 shadow-none focus-visible:ring-0" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="state" className="text-navy">State</Label>
                  <Input id="state" name="state" placeholder="State" maxLength={40} className="h-11 rounded-none border-x-0 border-t-0 border-b border-border px-0 shadow-none focus-visible:ring-0" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="zip" className="text-navy">Zip Code <span className="text-brand-red">*</span></Label>
                  <Input id="zip" name="zip" required placeholder="Zip" maxLength={12} className="h-11 rounded-none border-x-0 border-t-0 border-b border-border px-0 shadow-none focus-visible:ring-0" />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-navy">Type of claim <span className="text-brand-red">*</span></Label>
                <Select name="claimType">
                  <SelectTrigger className="h-11 rounded-none border-x-0 border-t-0 border-b border-border px-0 shadow-none">
                    <SelectValue placeholder="- Select -" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rideshare">Rideshare Abuse</SelectItem>
                    <SelectItem value="roblox">Roblox / Online Platform Abuse</SelectItem>
                    <SelectItem value="drug">Defective Medication</SelectItem>
                    <SelectItem value="device">Medical Device Failure</SelectItem>
                    <SelectItem value="toxic">Toxic Exposure</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-navy">State where incident occurred</Label>
                <Select name="incidentState">
                  <SelectTrigger className="h-11 rounded-none border-x-0 border-t-0 border-b border-border px-0 shadow-none">
                    <SelectValue placeholder="- Select -" />
                  </SelectTrigger>
                  <SelectContent>
                    {["CA","TX","NY","FL","PA","IL","OH","GA","NC","MI","Other"].map((s) => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="desc" className="text-navy">Brief Description (Optional)</Label>
                <Textarea id="desc" name="description" rows={4} maxLength={1000} placeholder="Please describe what happened briefly (optional)" className="rounded-none border-border" />
              </div>
              <div className="sm:col-span-2 flex items-start gap-3 pt-2">
                <Checkbox id="consent" name="consent" required className="mt-1" />
                <Label htmlFor="consent" className="text-xs font-normal leading-relaxed text-muted-foreground">
                  By checking the box, you agree to be contacted about your potential case or promotional legal offers sent by or on
                  behalf of Med Injury Claims and/or participating law firms. You may receive live calls, automated calls, emails, or
                  text messages at the phone number provided above even if you are on a national or state "Do Not Call" list. Consent
                  is not a condition of any purchase.
                </Label>
              </div>
            </div>
            <Button type="submit" size="lg" disabled={submitting} className="mt-8 w-full rounded-none bg-brand-red text-primary-foreground hover:bg-brand-red-dark">
              {submitting ? "Submitting…" : "Submit"}
            </Button>
          </form>
          )}
        </div>
      </section>


      {/* Footer */}
      <footer className="bg-navy-deep text-primary-foreground">
        <div className="container grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <img src={logo.url} alt="Med Injury Claims" className="h-10 w-auto brightness-0 invert" />
            <p className="mt-4 text-sm leading-relaxed text-primary-foreground/70">
              Med Injury Claims helps individuals harmed by dangerous drugs, medical devices, or toxic exposures get connected to
              trusted legal professionals. We're not a law firm — we're your first step toward justice.
            </p>
          </div>
          <div>
            <div className="text-sm font-semibold uppercase tracking-widest">Quick Links</div>
            <ul className="mt-4 space-y-2 text-sm text-primary-foreground/70">
              {nav.map((n) => (
                <li key={n.href}><a href={n.href} className="hover:text-brand-red">{n.label}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <div className="text-sm font-semibold uppercase tracking-widest">Legal</div>
            <ul className="mt-4 space-y-2 text-sm text-primary-foreground/70">
              <li><a href="#" className="hover:text-brand-red">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-brand-red">Terms & Conditions</a></li>
              <li><a href="#" className="hover:text-brand-red">Attorney Advertising Disclaimer</a></li>
            </ul>
          </div>
          <div>
            <div className="text-sm font-semibold uppercase tracking-widest">Contact Us</div>
            <ul className="mt-4 space-y-2 text-sm text-primary-foreground/70">
              <li className="flex items-center gap-2"><Mail className="h-4 w-4" /> intake@medinjuryclaims.com</li>
              <li className="flex items-center gap-2"><Phone className="h-4 w-4" /> (800) 555-0142</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-primary-foreground/15">
          <div className="container py-6 text-center text-xs leading-relaxed text-primary-foreground/50">
            Disclaimer: Med Injury Claims is not a law firm and does not provide legal advice. We connect individuals with law firms
            who may offer legal representation. This is attorney advertising. Results vary.
            <div className="mt-1">© {new Date().getFullYear()} Med Injury Claims. All rights reserved.</div>
          </div>
        </div>
      </footer>
    </div>
  );
}
