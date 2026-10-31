import { useEffect, useState, type FormEvent } from "react";
import { initAdTracking, trackLeadConversion } from "@/lib/adsTracking";
import { Link } from "react-router-dom";
import { Phone, Mail, ChevronRight, ShieldCheck, Lock, Scale, Clock, CheckCircle2, Check, AlertTriangle, Car } from "lucide-react";
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
import heroImg from "@/assets/rideshare-hero.jpg";
import passengerImg from "@/assets/rideshare-passenger.jpg";

const schema = z.object({
  firstName: z.string().trim().min(1, "First name is required").max(60),
  lastName: z.string().trim().min(1, "Last name is required").max(60),
  email: z.string().trim().email("Enter a valid email").max(255),
  phone: z.string().trim().min(7, "Enter a valid phone number").max(25),
  address: z.string().trim().max(200).optional().or(z.literal("")),
  city: z.string().trim().max(80).optional().or(z.literal("")),
  state: z.string().trim().max(40).optional().or(z.literal("")),
  zip: z.string().trim().min(3, "Zip is required").max(12),
  rideshareCompany: z.string().min(1, "Please select"),
  abuseType: z.string().min(1, "Please select"),
  incidentState: z.string().max(40).optional().or(z.literal("")),
  description: z.string().trim().max(1000).optional().or(z.literal("")),
  consent: z.literal(true, { errorMap: () => ({ message: "Consent is required" }) }),
});

const nav = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/#about" },
  { label: "Active Lawsuits", href: "/#lawsuits" },
  { label: "FAQs", href: "/#faq" },
  { label: "Contact Us", href: "/#contact" },
];

const qualifiers = [
  "You were sexually assaulted, harassed, or physically attacked during a rideshare trip",
  "The incident involved an Uber or Lyft driver or occurred as part of a rideshare ride",
  "You suffered emotional or physical harm as a result",
  "You are a biological female victim (many lawsuits currently focus on women harmed by rideshare drivers)",
];

const abuseExamples = [
  "Sexual assault or harassment",
  "Physical violence or unwanted contact",
  "Verbal abuse or intimidation",
  "Stalking or invasion of privacy",
  "Discrimination based on race, gender, or disability",
  "Theft or property damage",
  "Dangerous or reckless driving behavior",
];

const allegations = [
  "Negligent driver screening and background checks",
  "Failure to protect passengers from known risks",
  "Inadequate safety and reporting protocols",
];

const usStates = [
  "Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut","Delaware","District of Columbia",
  "Florida","Georgia","Hawaii","Idaho","Illinois","Indiana","Iowa","Kansas","Kentucky","Louisiana","Maine",
  "Maryland","Massachusetts","Michigan","Minnesota","Mississippi","Missouri","Montana","Nebraska","Nevada",
  "New Hampshire","New Jersey","New Mexico","New York","North Carolina","North Dakota","Ohio","Oklahoma",
  "Oregon","Pennsylvania","Rhode Island","South Carolina","South Dakota","Tennessee","Texas","Utah",
  "Vermont","Virginia","Washington","West Virginia","Wisconsin","Wyoming",
];

const abuseTypes = [
  "Rape – vaginal penetration",
  "Rape – anal penetration",
  "Digital penetration",
  "Forced oral copulation",
  "Non-penetrative sexual assault",
  "Forced manual stimulation",
  "Unwanted touching under clothes",
  "Indecent exposure and unwanted touching",
  "Masturbation by the driver",
  "Threats, coercion, or aggression",
  "Aggressive flirtation / overt sexual threats",
  "False imprisonment or kidnapping",
  "Driver used weapons or force",
  "Other (please describe)",
  "Not sure",
];

export default function RideshareAbuse() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [certRef, setCertRef] = useState("");

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
      rideshareCompany: String(fd.get("rideshareCompany") ?? ""),
      abuseType: String(fd.get("abuseType") ?? ""),
      incidentState: String(fd.get("incidentState") ?? ""),
      description: String(fd.get("description") ?? ""),
      consent: fd.get("consent") === "on",
    };

    const parsed = schema.safeParse(data);
    if (!parsed.success) {
      toast.error(parsed.error.errors[0]?.message ?? "Please review the form.");
      return;
    }

    const trustedFormCertUrl = String(fd.get("xxTrustedFormCertUrl") ?? "");
    const trustedFormPingUrl = String(fd.get("xxTrustedFormPingUrl") ?? "");

    const composedDescription = [
      `Rideshare company: ${parsed.data.rideshareCompany}`,
      `Type of abuse: ${parsed.data.abuseType}`,
      parsed.data.description ? `Details: ${parsed.data.description}` : "",
    ].filter(Boolean).join("\n");

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
      description: composedDescription,
      consent: parsed.data.consent,
      trusted_form_cert_url: trustedFormCertUrl || null,
      trusted_form_ping_url: trustedFormPingUrl || null,
      page_url: window.location.href,
      user_agent: navigator.userAgent,
    });
    setSubmitting(false);

    if (error) {
      toast.error("We couldn't submit your request. Please try again.");
      console.error("[rideshare] insert failed", error);
      return;
    }

    setCertRef(trustedFormCertUrl ? trustedFormCertUrl.slice(-12) : "pending");
    setSubmitted(true);
    void trackLeadConversion();
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
          <Link to="/" className="flex items-center">
            <img src={logo} alt="Med Injury Claims" className="h-7 w-auto sm:h-10" />
          </Link>
          <nav className="hidden items-center gap-7 lg:flex">
            {nav.map((n) => (
              <a key={n.href} href={n.href} className="text-sm font-semibold text-navy hover:text-brand-red">
                {n.label}
              </a>
            ))}
          </nav>
          <Button asChild className="bg-brand-red text-primary-foreground hover:bg-brand-red-dark">
            <a href="#case-review">Free Case Review</a>
          </Button>
        </div>
      </header>

      {/* Hero */}
      <section
        className="relative border-b border-border bg-navy-deep text-primary-foreground"
        style={{
          backgroundImage: `linear-gradient(rgba(10,14,25,0.82), rgba(10,14,25,0.9)), url(${heroImg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="container py-20 lg:py-28">
          <div className="max-w-3xl animate-hero-in">
            <div className="mb-4 text-xs font-semibold uppercase tracking-[0.22em] text-brand-red">
              Rideshare Abuse · Free Case Review
            </div>
            <h1 className="font-serif text-4xl font-black leading-tight sm:text-5xl lg:text-6xl">
              Justice for Victims of Rideshare Assault and Negligence
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-primary-foreground/85 sm:text-lg">
              Over the past few years, alarming reports have surfaced of assault, harassment, and other forms of abuse
              involving rideshare drivers and passengers across the United States. If you or someone you love was harmed
              during an Uber or Lyft ride, you may be entitled to <strong className="text-primary-foreground">significant compensation</strong>
              {" "}through an ongoing mass tort or individual lawsuit.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="bg-brand-red text-primary-foreground hover:bg-brand-red-dark">
                <a href="#case-review">Do You Qualify to Join a Lawsuit?</a>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground hover:text-navy">
                <a href="#what-is">Learn More</a>
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

      {/* Allegations */}
      <section className="border-b border-border bg-surface">
        <div className="container grid gap-12 py-16 lg:grid-cols-2 lg:items-center">
          <img
            src={passengerImg}
            alt="Attorney consulting a rideshare abuse survivor"
            width={1200}
            height={900}
            loading="lazy"
            className="w-full border border-border object-cover shadow-md"
          />
          <div>
            <h2 className="font-serif text-2xl font-black text-navy sm:text-3xl">Nationwide Legal Actions Against Rideshare Companies</h2>
            <p className="mt-4 text-muted-foreground">
              In recent years, multiple <strong className="text-navy">nationwide legal actions</strong> have been filed against
              major rideshare companies, alleging:
            </p>
            <ul className="mt-5 space-y-2.5 text-sm text-navy">
              {allegations.map((i) => (
                <li key={i} className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand-red" /> {i}
                </li>
              ))}
            </ul>
            <p className="mt-5 text-muted-foreground">
              These lawsuits aim to hold companies accountable and provide financial recovery for victims of rideshare-related
              abuse and negligence.
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
            {qualifiers.map((e) => (
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
              <a href="#case-review">Start My Free Case Review</a>
            </Button>
          </div>
        </div>
      </section>

      {/* What Is Rideshare Abuse */}
      <section id="what-is" className="border-b border-border bg-surface">
        <div className="container max-w-4xl py-16">
          <div className="flex items-center gap-3">
            <Car className="h-6 w-6 text-brand-red" />
            <h2 className="font-serif text-2xl font-black text-navy sm:text-3xl">What Is Rideshare Abuse?</h2>
          </div>
          <p className="mt-4 text-muted-foreground">
            Rideshare abuse refers to <strong className="text-navy">any misconduct, assault, or negligence occurring in connection
            with a rideshare service</strong>. This includes incidents involving both drivers and passengers. Common examples include:
          </p>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {abuseExamples.map((i) => (
              <li key={i} className="lift flex items-start gap-3 border-l-2 border-brand-red bg-background p-4 text-sm text-navy shadow-sm">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-brand-red" /> {i}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* CTA banner */}
      <section className="border-b border-border bg-navy-deep text-primary-foreground">
        <div className="container max-w-3xl py-14 text-center">
          <h2 className="font-serif text-2xl font-black sm:text-3xl">Take the First Step Toward Justice</h2>
          <p className="mt-3 text-primary-foreground/80">
            You don't have to face this alone. Our legal partners are currently reviewing Rideshare Abuse Claims nationwide
            to help survivors seek justice and compensation. Start your free, confidential case review - it only takes 30 seconds.
          </p>
          <div className="mt-6">
            <Button asChild size="lg" className="bg-brand-red text-primary-foreground hover:bg-brand-red-dark uppercase tracking-wider">
              <a href="#case-review">Start My Free Case Review</a>
            </Button>
          </div>
        </div>
      </section>

      {/* Case Review Form */}
      <section id="case-review" className="border-b border-border">
        <div className="container max-w-4xl py-16">
          <div className="text-center">
            <h2 className="font-serif text-2xl font-black text-navy sm:text-3xl">Rideshare Abuse Case Review</h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground">
              Confidential and no obligation. A case specialist will contact you within 24 hours.
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
              </p>
              <p className="mt-6 text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                Reference: {certRef || "pending"}
              </p>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="mt-10 border border-border bg-background p-6 shadow-sm sm:p-10">
              <h3 className="font-serif text-2xl font-black text-navy">Case Review</h3>
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
                <div className="space-y-1.5 sm:col-span-2">
                  <Label className="text-navy">Were you or a loved one assaulted during an Uber or Lyft ride? <span className="text-brand-red">*</span></Label>
                  <Select name="rideshareCompany">
                    <SelectTrigger className="h-11 rounded-none border-x-0 border-t-0 border-b border-border px-0 shadow-none">
                      <SelectValue placeholder="- Select -" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Yes – Uber">Yes – Uber</SelectItem>
                      <SelectItem value="Yes – Lyft">Yes – Lyft</SelectItem>
                      <SelectItem value="No">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <Label className="text-navy">What type of assault or misconduct occurred? <span className="text-brand-red">*</span></Label>
                  <Select name="abuseType">
                    <SelectTrigger className="h-11 rounded-none border-x-0 border-t-0 border-b border-border px-0 shadow-none">
                      <SelectValue placeholder="- Select -" />
                    </SelectTrigger>
                    <SelectContent>
                      {abuseTypes.map((t) => (
                        <SelectItem key={t} value={t}>{t}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <Label className="text-navy">State where abuse occurred</Label>
                  <Select name="incidentState">
                    <SelectTrigger className="h-11 rounded-none border-x-0 border-t-0 border-b border-border px-0 shadow-none">
                      <SelectValue placeholder="- Select -" />
                    </SelectTrigger>
                    <SelectContent>
                      {usStates.map((s) => (
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
                    By checking the box, you agree to be contacted about your potential case or promotional legal offers sent
                    by or on behalf of Med Injury Claims and/or participating law firms. You may receive live calls, automated
                    calls, emails, or text messages at the phone number provided above even if you are on a national or state
                    "Do Not Call" list. Consent is not a condition of any purchase.
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
              Med Injury Claims helps individuals harmed by dangerous drugs, medical devices, toxic exposures, and negligent
              services get connected to trusted legal professionals. We're not a law firm - we're your first step toward justice.
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
              <li><a href="/privacy" className="hover:text-brand-red">Privacy Policy</a></li>
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
            Disclaimer: Med Injury Claims is not a law firm and does not provide legal advice. We connect individuals with law
            firms who may offer legal representation. This is attorney advertising. Results vary.
            <div className="mt-1">© {new Date().getFullYear()} Med Injury Claims. All rights reserved.</div>
          </div>
        </div>
      </footer>
    </div>
  );
}
