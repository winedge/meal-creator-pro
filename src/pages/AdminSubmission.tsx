import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { ArrowLeft, FileText, Save, ExternalLink } from "lucide-react";
import { format } from "date-fns";
import { generateSubmissionPdf, type Submission } from "@/lib/submissionPdf";

export default function AdminSubmission() {
  const { id } = useParams<{ id: string }>();
  const { session, isAdmin, loading } = useAdminAuth();
  const nav = useNavigate();
  const [row, setRow] = useState<Submission | null>(null);
  const [notes, setNotes] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!loading && (!session || !isAdmin)) nav("/admin/login", { replace: true });
  }, [session, isAdmin, loading, nav]);

  useEffect(() => {
    if (!isAdmin || !id) return;
    (async () => {
      const { data, error } = await supabase.from("submissions").select("*").eq("id", id).maybeSingle();
      if (error) toast.error(error.message);
      else if (data) {
        setRow(data as Submission);
        setNotes(data.notes ?? "");
      }
    })();
  }, [id, isAdmin]);

  const saveNotes = async () => {
    if (!row) return;
    setBusy(true);
    const { error } = await supabase.from("submissions").update({ notes }).eq("id", row.id);
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Notes saved");
    setRow({ ...row, notes });
  };

  if (!row) {
    return <div className="min-h-screen grid place-items-center text-muted-foreground">Loading…</div>;
  }

  const Field = ({ label, value, mono }: { label: string; value?: string | null; mono?: boolean }) => (
    <div className="border-b border-border py-3">
      <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</div>
      <div className={`mt-1 text-sm text-navy break-words ${mono ? "font-mono text-xs" : ""}`}>{value || "—"}</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-surface">
      <header className="border-b border-border bg-navy-deep text-primary-foreground">
        <div className="container flex h-16 items-center justify-between">
          <Button asChild variant="outline" size="sm" className="border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground hover:text-navy">
            <Link to="/admin"><ArrowLeft className="h-3.5 w-3.5 mr-1.5" /> Back to CRM</Link>
          </Button>
          <Button onClick={() => generateSubmissionPdf(row)} className="bg-brand-red hover:bg-brand-red-dark text-primary-foreground">
            <FileText className="h-4 w-4 mr-2" /> Download PDF Docket
          </Button>
        </div>
      </header>

      <main className="container max-w-5xl py-10">
        <div className="mb-2 text-xs uppercase tracking-widest text-muted-foreground">
          Docket #{row.id.slice(0, 8).toUpperCase()} · Received {format(new Date(row.created_at), "PPpp")}
        </div>
        <h1 className="font-serif text-3xl font-black text-navy">{row.first_name} {row.last_name}</h1>
        <div className="mt-1 text-sm text-muted-foreground">Status: <span className="font-semibold text-navy">{row.status.toUpperCase()}</span></div>

        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          <div className="border border-border bg-background p-6 shadow-sm">
            <h2 className="font-serif text-lg font-bold text-navy border-b-2 border-brand-red pb-2">Claimant</h2>
            <Field label="Email" value={row.email} />
            <Field label="Phone" value={row.phone} />
            <Field label="Address" value={row.address} />
            <Field label="City / State / Zip" value={[row.city, row.state, row.zip].filter(Boolean).join(", ")} />
          </div>

          <div className="border border-border bg-background p-6 shadow-sm">
            <h2 className="font-serif text-lg font-bold text-navy border-b-2 border-brand-red pb-2">Claim</h2>
            <Field label="Claim type" value={row.claim_type} />
            <Field label="Incident state" value={row.incident_state} />
            <Field label="TCPA consent" value={row.consent ? "Granted" : "Not granted"} />
            <Field label="Description" value={row.description} />
          </div>

          <div className="border border-border bg-background p-6 shadow-sm lg:col-span-2">
            <h2 className="font-serif text-lg font-bold text-navy border-b-2 border-brand-red pb-2">TrustedForm Certification</h2>
            <div className="py-3 border-b border-border">
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Certificate URL</div>
              {row.trusted_form_cert_url ? (
                <a href={row.trusted_form_cert_url} target="_blank" rel="noopener noreferrer" className="mt-1 inline-flex items-center gap-1.5 text-xs font-mono text-brand-red hover:underline break-all">
                  {row.trusted_form_cert_url} <ExternalLink className="h-3 w-3 shrink-0" />
                </a>
              ) : <div className="mt-1 text-sm text-muted-foreground">—</div>}
            </div>
            <div className="py-3 border-b border-border">
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Ping URL</div>
              {row.trusted_form_ping_url ? (
                <a href={row.trusted_form_ping_url} target="_blank" rel="noopener noreferrer" className="mt-1 inline-flex items-center gap-1.5 text-xs font-mono text-brand-red hover:underline break-all">
                  {row.trusted_form_ping_url} <ExternalLink className="h-3 w-3 shrink-0" />
                </a>
              ) : <div className="mt-1 text-sm text-muted-foreground">—</div>}
            </div>
            <Field label="Page URL" value={row.page_url} mono />
            <Field label="User agent" value={row.user_agent} mono />
          </div>

          <div className="border border-border bg-background p-6 shadow-sm lg:col-span-2">
            <h2 className="font-serif text-lg font-bold text-navy border-b-2 border-brand-red pb-2 mb-4">Internal Notes</h2>
            <Label htmlFor="notes" className="text-xs">Only visible to CRM admins. Included in PDF docket.</Label>
            <Textarea id="notes" rows={5} value={notes} onChange={(e) => setNotes(e.target.value)} className="mt-2" />
            <Button onClick={saveNotes} disabled={busy} className="mt-3 bg-navy hover:bg-navy-deep text-primary-foreground">
              <Save className="h-4 w-4 mr-2" /> {busy ? "Saving…" : "Save notes"}
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
