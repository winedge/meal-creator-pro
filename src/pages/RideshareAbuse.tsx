import { useEffect, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { initAdTracking, trackLeadConversion } from "@/lib/adsTracking";
import { Phone, Mail, ChevronRight, ShieldCheck, Lock, Scale, Clock, CheckCircle2, Check, ArrowLeft } from "lucide-react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import logo from "@/assets/medinjuryclaims-logo.png";
import rideshareHero from "@/assets/rideshare-hero.jpg";
import ridesharePassenger from "@/assets/rideshare-passenger.jpg";
import { Reveal } from "@/components/Reveal";

const caseReviewSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required").max(60),
  lastName: z.string().trim().min(1, "Last name is required").max(60),
  email: z.string().trim().email("Enter a valid email").max(255),
  phone: z.string().trim().min(7, "Enter a valid phone number").max(25),
  address: z.string().trim().max(200).optional().or(z.literal("")),
  city: z.string().trim().max(80).optional().or(z.literal("")),
  state: z.string().trim().max(40).optional().or(z.literal("")),
  zip: z.string().trim().min(3, "Zip is required").max(12),
  incidentState: z.string().max(40).optional().or(z.literal("")),
  description: z.string().trim().max(1000).optional().or(z.literal("")),
  consent: z.literal(true, { errorMap: () => ({ message: "Consent is required" }) }),
});

const eligibility = [
  "You were a passenger in an Uber, Lyft, or another rideshare vehicle when the abuse occurred",
  "You experienced sexual assault, harassment, or improper touching by a rideshare driver",
  "The incident took place within the applicable time limits in your state",
  "You are willing to describe what happened in a confidential review",
];

const receive = [
  { t: "Free Legal Consultation", d: "No upfront cost, no obligation." },
  { t: "Confidential Review", d: "Your information is kept private and secure." },
  { t: "Nationwide Support", d: "Attorneys licensed across the U.S." },
  { t: "No Upfront Fees", d: "Many attorneys work on a contingency basis - you pay nothing unless you win compensation." },
];

const faqs = [
  { q: "What counts as rideshare abuse?", a: "Any sexual assault, sexual battery, harassment, or improper physical contact by a rideshare driver while you were a passenger, or in the course of being picked up or dropped off. Every case is different - a confidential review is the fastest way to find out where you stand." },
  { q: "Can I file a claim even if I didn't report it to the police at the time?", a: "In many cases, yes. A police report strengthens a claim but is not always required. Request a free review as soon as possible so important evidence and deadlines can be preserved." },
  { q: "How much does it cost to speak with an attorney?", a: "Nothing. Every case review is free, confidential, and carries no obligation to proceed. Most attorneys handling these cases work on contingency - you pay nothing unless you win." },
  { q: "Will my information be shared?", a: "Your submission is reviewed only by our intake team and the participating law firms handling your matter." },
];

export default function RideshareAbuse() {
  const [submitted, setSubmitted] = useState(false);
  const [certRef, setCertRef] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    void initAdTracking();
  }, []);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
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
      claim_type: "rideshare",
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
      console.error("[rideshare-abuse] insert failed", error);
      return;
    }

    setCertRef(trustedFormCertUrl ? trustedFormCertUrl.slice(-12) : "pending");
    setSubmitted(true);
    void trackLeadConversion();
    form.reset();
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
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
          <Link to="/" className="flex items-center">
            <img src={logo} alt="Med Injury Claims - Trusted Representation, Proven Results" className="h-7 w-auto sm:h-10" />
          </Link>
          <Button asChild variant="outline" size="sm" className="hidden sm:inline-flex">
            <Link to="/"><ArrowLeft className="h-3.5 w-3.5 mr-1.5" /> Back to Home</Link>
          </Button>
          <Button asChild className="bg-brand-red text-primary-foreground hover:bg-brand-red-dark sm:hidden">
            <a href="#contact">Free Case Review</a>
          </Button>
        </div>
      </header>

      {/* Hero */}
      <section
        className="relative border-b border-border bg-navy-deep text-primary-foreground"
        style={{
          backgroundImage: `linear-gradient(rgba(10,14,25,0.82), rgba(10,14,25,0.9)), url(${rideshareHero})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="container py-20 lg:py-28">
          <div className="max-w-3xl animate-hero-in">
            <div className="mb-4 text-xs font-semibold uppercase tracking-[0.22em] text-brand-red">
              Rideshare Abuse Tort · Free · Confidential Case Review
            </div>
            <h1 className="font-serif text-4xl font-black leading-tight sm:text-5xl lg:text-6xl">
              Rideshare Abuse Victims: Know If You Qualify
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-primary-foreground/85 sm:text-lg">
              If you were sexually assaulted, harassed, or abused by an Uber or Lyft driver, you may be entitled
              to significant compensation. Find out if you qualify - free, confidential, and with no obligation.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="bg-brand-red text-primary-foreground hover:bg-brand-red-dark transition-transform duration-200 hover:scale-[1.03] active:scale-[0.98]">
                <a href="#contact">Check If You Qualify</a>
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

      {/* What is rideshare abuse */}
      <section id="about" className="border-b border-border bg-surface">
        <div className="container grid gap-12 py-16 lg:grid-cols-2 lg:items-center">
          <img
            src={ridesharePassenger}
            alt="Passenger sitting in the back seat of a rideshare vehicle at night"
            width={1200}
            height={900}
            loading="lazy"
            className="w-full border border-border object-cover shadow-md"
          />
          <div>
            <h2 className="font-serif text-2xl font-black text-navy sm:text-3xl">What Is Rideshare Abuse?</h2>
            <p className="mt-4 text-muted-foreground">
              Millions of people trust rideshare services like Uber and Lyft to get home safely. When drivers use
              that trust to sexually assault, harass, or abuse passengers, the consequences reach far beyond the
              ride itself.
            </p>
            <p className="mt-4 text-muted-foreground">
              Passengers have filed lawsuits against rideshare companies across the country, alleging that the
              companies failed to properly screen drivers, ignored prior complaints, and put profits over
              passenger safety.
            </p>
            <ul className="mt-5 space-y-2.5 text-sm text-navy">
              {[
                "Sexual assault or sexual battery by a rideshare driver",
                "Harassment, stalking, or improper touching during a ride",
                "Incidents involving Uber, Lyft, or other rideshare platforms",
                "Failure of the company to screen or remove dangerous drivers",
              ].map((i) => (
                <li key={i} className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand-red" /> {i}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Qualification */}
      <section className="border-b border-border">
        <div className="container max-w-3xl py-16">
          <h2 className="font-serif text-2xl font-black text-navy sm:text-3xl">Do You Qualify?</h2>
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

      {/* What you'll receive */}
      <section className="border-b border-border">
        <div className="container py-16">
          <div className="mx-auto max-w-2xl text-center">
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-red">100% Confidential · No Obligation · Free Consultation</div>
            <h2 className="mt-3 font-serif text-2xl font-black text-navy sm:text-3xl">What You'll Receive</h2>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {receive.map((r, i) => (
              <Reveal key={r.t} delay={i * 80}>
                <div className="lift border-l-2 border-brand-red bg-surface p-5 h-full">
                  <h3 className="font-serif text-base font-bold text-navy">{r.t}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{r.d}</p>
                </div>
              </Reveal>
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
              You don't have to face this alone. Click below to start your <strong className="text-navy">free, confidential case review</strong> - it only takes 30 seconds.
            </p>
          </div>

          {submitted ? (
            <div className="mt-10 border border-border bg-background p-8 text-center shadow-sm sm:p-14">
              <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-brand-red/10 text-brand-red">
                <Check className="h-7 w-7" />
              </div>
              <h3 className="mt-6 font-serif text-2xl font-black text-navy">Request received</h3>
              <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
                Thank you - a case specialist will contact you within 24 hours to discuss your potential claim.
                Please keep an eye on your phone and email.
              </p>
              <p className="mt-6 text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                Reference: {certRef || "pending"}
              </p>
            </div>
          ) : (
          <form onSubmit={onSubmit} className="mt-10 border border-border bg-background p-6 shadow-sm sm:p-10">
            <h3 className="font-serif text-2xl font-black text-navy">Rideshare Abuse Case Review</h3>
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
                <Label className="text-navy">Type of claim</Label>
                <Select value="Rideshare Abuse" disabled>
                  <SelectTrigger className="h-11 rounded-none border-x-0 border-t-0 border-b border-border px-0 shadow-none">
                    <SelectValue placeholder="Rideshare Abuse" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Rideshare Abuse">Rideshare Abuse</SelectItem>
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
            <img src={logo} alt="Med Injury Claims" className="h-10 w-auto brightness-0 invert" />
            <p className="mt-4 text-sm leading-relaxed text-primary-foreground/70">
              Med Injury Claims helps people injured in motor vehicle accidents, rideshare abuse survivors, and those
              seeking Social Security Disability benefits get connected to trusted legal professionals. We're not a law
              firm - we're your first step toward justice.
            </p>
          </div>
          <div>
            <div className="text-sm font-semibold uppercase tracking-widest">Quick Links</div>
            <ul className="mt-4 space-y-2 text-sm text-primary-foreground/70">
              <li><Link to="/" className="hover:text-brand-red">Home</Link></li>
              <li><Link to="/" className="hover:text-brand-red">Practice Areas</Link></li>
              <li><Link to="/" className="hover:text-brand-red">Frequently Asked Questions</Link></li>
            </ul>
          </div>
          <div>
            <div className="text-sm font-semibold uppercase tracking-widest">Legal</div>
            <ul className="mt-4 space-y-2 text-sm text-primary-foreground/70">
              <li><Link to="/privacy" className="hover:text-brand-red">Privacy Policy</Link></li>
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
