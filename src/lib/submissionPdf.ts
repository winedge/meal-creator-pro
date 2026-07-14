import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { format } from "date-fns";

export type Submission = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string | null;
  city: string | null;
  state: string | null;
  zip: string;
  claim_type: string;
  incident_state: string | null;
  description: string | null;
  consent: boolean;
  trusted_form_cert_url: string | null;
  trusted_form_ping_url: string | null;
  page_url: string | null;
  user_agent: string | null;
  status: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

const NAVY: [number, number, number] = [15, 30, 65];
const GOLD: [number, number, number] = [180, 140, 50];
const MUTED: [number, number, number] = [110, 110, 120];

export function generateSubmissionPdf(s: Submission) {
  const doc = new jsPDF({ unit: "pt", format: "letter" });
  const W = doc.internal.pageSize.getWidth();
  const M = 48;

  // Header band
  doc.setFillColor(...NAVY);
  doc.rect(0, 0, W, 96, "F");
  doc.setFillColor(...GOLD);
  doc.rect(0, 96, W, 3, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFont("times", "bold");
  doc.setFontSize(22);
  doc.text("Med Injury Claims", M, 44);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(220, 220, 230);
  doc.text("CASE INTAKE DOCKET · CONFIDENTIAL", M, 62);

  // Docket ref (right side)
  doc.setFontSize(9);
  doc.setTextColor(255, 255, 255);
  const ref = `DOCKET #${s.id.slice(0, 8).toUpperCase()}`;
  doc.text(ref, W - M, 44, { align: "right" });
  doc.setTextColor(220, 220, 230);
  doc.text(format(new Date(s.created_at), "PPpp"), W - M, 62, { align: "right" });

  let y = 128;

  // Claimant title
  doc.setTextColor(...NAVY);
  doc.setFont("times", "bold");
  doc.setFontSize(18);
  doc.text(`${s.first_name} ${s.last_name}`, M, y);
  y += 8;
  doc.setDrawColor(...GOLD);
  doc.setLineWidth(1);
  doc.line(M, y, M + 60, y);
  y += 18;

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...MUTED);
  doc.text(`Status: ${s.status.toUpperCase()}   ·   Claim: ${s.claim_type}`, M, y);
  y += 22;

  const section = (title: string) => {
    doc.setFillColor(245, 246, 250);
    doc.rect(M, y - 12, W - M * 2, 22, "F");
    doc.setTextColor(...NAVY);
    doc.setFont("times", "bold");
    doc.setFontSize(11);
    doc.text(title.toUpperCase(), M + 8, y + 3);
    y += 18;
  };

  const rows = (data: [string, string][]) => {
    autoTable(doc, {
      startY: y,
      theme: "plain",
      margin: { left: M, right: M },
      styles: { font: "helvetica", fontSize: 10, cellPadding: { top: 5, bottom: 5, left: 8, right: 8 }, textColor: [30, 30, 40] },
      columnStyles: {
        0: { cellWidth: 140, textColor: MUTED, fontStyle: "bold" },
        1: { cellWidth: "auto" },
      },
      body: data.map(([k, v]) => [k, v || "-"]),
      didDrawPage: () => {},
    });
    y = (doc as any).lastAutoTable.finalY + 16;
  };

  section("Claimant Information");
  rows([
    ["Full name", `${s.first_name} ${s.last_name}`],
    ["Email", s.email],
    ["Phone", s.phone],
    ["Address", [s.address, s.city, s.state, s.zip].filter(Boolean).join(", ")],
  ]);

  section("Claim Details");
  rows([
    ["Claim type", s.claim_type],
    ["Incident state", s.incident_state ?? ""],
    ["Description", s.description ?? ""],
    ["TCPA consent", s.consent ? "Granted" : "Not granted"],
  ]);

  section("TrustedForm Certification");
  rows([
    ["Certificate URL", s.trusted_form_cert_url ?? ""],
    ["Ping URL", s.trusted_form_ping_url ?? ""],
    ["Page URL", s.page_url ?? ""],
    ["User agent", s.user_agent ?? ""],
  ]);

  if (s.notes) {
    section("Internal Notes");
    rows([["Notes", s.notes]]);
  }

  section("Record Metadata");
  rows([
    ["Submission ID", s.id],
    ["Submitted", format(new Date(s.created_at), "PPpp")],
    ["Last updated", format(new Date(s.updated_at), "PPpp")],
  ]);

  // Footer on every page
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    const H = doc.internal.pageSize.getHeight();
    doc.setDrawColor(...GOLD);
    doc.setLineWidth(0.5);
    doc.line(M, H - 48, W - M, H - 48);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(...MUTED);
    doc.text(
      "Confidential - Med Injury Claims intake docket. Not legal advice. Not a law firm.",
      M,
      H - 32
    );
    doc.text(`Page ${i} of ${pageCount}`, W - M, H - 32, { align: "right" });
  }

  doc.save(`docket-${s.last_name}-${s.id.slice(0, 8)}.pdf`);
}
