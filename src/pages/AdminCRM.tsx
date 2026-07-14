import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Download, FileText, LogOut, Search, Trash2, ExternalLink } from "lucide-react";
import { format } from "date-fns";
import { generateSubmissionPdf, type Submission } from "@/lib/submissionPdf";

const CLAIM_LABELS: Record<string, string> = {
  rideshare: "Rideshare Abuse",
  roblox: "Roblox / Online Platform",
  drug: "Defective Medication",
  device: "Medical Device Failure",
  toxic: "Toxic Exposure",
  other: "Other",
};

const STATUSES = ["new", "contacted", "qualified", "disqualified", "closed"] as const;

export default function AdminCRM() {
  const { session, isAdmin, loading } = useAdminAuth();
  const nav = useNavigate();
  const [rows, setRows] = useState<Submission[]>([]);
  const [fetching, setFetching] = useState(true);

  const [q, setQ] = useState("");
  const [claim, setClaim] = useState<string>("all");
  const [status, setStatus] = useState<string>("all");
  const [from, setFrom] = useState<string>("");
  const [to, setTo] = useState<string>("");

  useEffect(() => {
    if (!loading && (!session || !isAdmin)) nav("/admin/login", { replace: true });
  }, [session, isAdmin, loading, nav]);

  const load = async () => {
    setFetching(true);
    const { data, error } = await supabase
      .from("submissions")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) toast.error(error.message);
    else setRows((data ?? []) as Submission[]);
    setFetching(false);
  };

  useEffect(() => {
    if (isAdmin) load();
  }, [isAdmin]);

  const filtered = useMemo(() => {
    return rows.filter((r) => {
      if (claim !== "all" && r.claim_type !== claim) return false;
      if (status !== "all" && r.status !== status) return false;
      if (from && new Date(r.created_at) < new Date(from)) return false;
      if (to && new Date(r.created_at) > new Date(to + "T23:59:59")) return false;
      if (q) {
        const hay = `${r.first_name} ${r.last_name} ${r.email} ${r.phone} ${r.zip} ${r.city ?? ""} ${r.state ?? ""}`.toLowerCase();
        if (!hay.includes(q.toLowerCase())) return false;
      }
      return true;
    });
  }, [rows, q, claim, status, from, to]);

  const exportCsv = () => {
    if (!filtered.length) return toast.info("Nothing to export");
    const cols: (keyof Submission)[] = [
      "id", "created_at", "status", "first_name", "last_name", "email", "phone",
      "address", "city", "state", "zip", "claim_type", "incident_state",
      "description", "consent", "trusted_form_cert_url", "trusted_form_ping_url",
      "page_url", "user_agent", "notes",
    ];
    const esc = (v: any) => {
      const s = v === null || v === undefined ? "" : String(v);
      return `"${s.replace(/"/g, '""')}"`;
    };
    const csv = [cols.join(","), ...filtered.map((r) => cols.map((c) => esc(r[c])).join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `submissions-${format(new Date(), "yyyy-MM-dd-HHmm")}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const updateStatus = async (id: string, newStatus: string) => {
    const { error } = await supabase.from("submissions").update({ status: newStatus }).eq("id", id);
    if (error) return toast.error(error.message);
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r)));
  };

  const del = async (id: string) => {
    if (!confirm("Delete this submission permanently?")) return;
    const { error } = await supabase.from("submissions").delete().eq("id", id);
    if (error) return toast.error(error.message);
    setRows((prev) => prev.filter((r) => r.id !== id));
    toast.success("Deleted");
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    nav("/admin/login");
  };

  if (loading || (!isAdmin && session)) {
    return <div className="min-h-screen grid place-items-center text-muted-foreground">Loading…</div>;
  }

  return (
    <div className="min-h-screen bg-surface">
      <header className="border-b border-border bg-navy-deep text-primary-foreground">
        <div className="container flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center">
            <img src="/__l5e/assets-v1/06a79a3f-77b6-407f-bfab-d27d63adbafe/medinjuryclaims-logo.png" alt="Med Injury Claims" className="h-9 w-auto brightness-0 invert" />
            <span className="ml-4 hidden sm:inline text-[10px] uppercase tracking-[0.2em] text-primary-foreground/70 border-l border-primary-foreground/30 pl-4">Medinjury Admin · Submissions</span>
          </Link>
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline text-xs text-primary-foreground/70">{session?.user.email}</span>
            <Button variant="outline" size="sm" onClick={signOut} className="border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground hover:text-navy">
              <LogOut className="h-3.5 w-3.5 mr-1.5" /> Sign out
            </Button>
          </div>
        </div>
      </header>

      <main className="container py-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-serif text-2xl font-black text-navy">Submissions</h1>
            <p className="text-sm text-muted-foreground">
              {filtered.length} of {rows.length} record{rows.length === 1 ? "" : "s"}
            </p>
          </div>
          <Button onClick={exportCsv} className="bg-navy hover:bg-navy-deep text-primary-foreground">
            <Download className="h-4 w-4 mr-2" /> Export CSV
          </Button>
        </div>

        {/* Filters */}
        <div className="mt-6 grid gap-3 border border-border bg-background p-4 shadow-sm md:grid-cols-5">
          <div className="space-y-1">
            <Label className="text-xs">Search</Label>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Name, email, phone…" className="pl-8" />
            </div>
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Claim type</Label>
            <Select value={claim} onValueChange={setClaim}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All types</SelectItem>
                {Object.entries(CLAIM_LABELS).map(([v, l]) => <SelectItem key={v} value={v}>{l}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Status</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                {STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label className="text-xs">From</Label>
            <Input type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">To</Label>
            <Input type="date" value={to} onChange={(e) => setTo(e.target.value)} />
          </div>
        </div>

        {/* Table */}
        <div className="mt-6 overflow-hidden border border-border bg-background shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-surface text-left text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 font-semibold">Received</th>
                  <th className="px-4 py-3 font-semibold">Name</th>
                  <th className="px-4 py-3 font-semibold">Contact</th>
                  <th className="px-4 py-3 font-semibold">Claim</th>
                  <th className="px-4 py-3 font-semibold">Location</th>
                  <th className="px-4 py-3 font-semibold">Cert</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {fetching ? (
                  <tr><td colSpan={8} className="p-8 text-center text-muted-foreground">Loading…</td></tr>
                ) : filtered.length === 0 ? (
                  <tr><td colSpan={8} className="p-8 text-center text-muted-foreground">No submissions match your filters.</td></tr>
                ) : filtered.map((r) => (
                  <tr key={r.id} className="hover:bg-surface/50">
                    <td className="px-4 py-3 whitespace-nowrap text-xs text-muted-foreground">
                      {format(new Date(r.created_at), "MMM d, yyyy")}<br />
                      <span className="text-[10px]">{format(new Date(r.created_at), "HH:mm")}</span>
                    </td>
                    <td className="px-4 py-3 font-medium text-navy">{r.first_name} {r.last_name}</td>
                    <td className="px-4 py-3 text-xs">
                      <div>{r.email}</div>
                      <div className="text-muted-foreground">{r.phone}</div>
                    </td>
                    <td className="px-4 py-3 text-xs">{CLAIM_LABELS[r.claim_type] ?? r.claim_type}</td>
                    <td className="px-4 py-3 text-xs">
                      {[r.city, r.state].filter(Boolean).join(", ") || "—"}<br />
                      <span className="text-muted-foreground">{r.zip}</span>
                    </td>
                    <td className="px-4 py-3">
                      {r.trusted_form_cert_url ? (
                        <a href={r.trusted_form_cert_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-brand-red hover:underline">
                          view <ExternalLink className="h-3 w-3" />
                        </a>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <Select value={r.status} onValueChange={(v) => updateStatus(r.id, v)}>
                        <SelectTrigger className="h-8 w-32 text-xs"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <Button size="sm" variant="ghost" title="Download PDF docket" onClick={() => generateSubmissionPdf(r)}>
                          <FileText className="h-4 w-4" />
                        </Button>
                        <Button asChild size="sm" variant="ghost" title="View details">
                          <Link to={`/admin/${r.id}`}><Search className="h-4 w-4" /></Link>
                        </Button>
                        <Button size="sm" variant="ghost" title="Delete" onClick={() => del(r.id)}>
                          <Trash2 className="h-4 w-4 text-brand-red" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
