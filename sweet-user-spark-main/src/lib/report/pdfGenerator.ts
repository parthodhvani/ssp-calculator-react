import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import type { ReportData } from "@/context/ReportContext";

// ---- Helpers ----
const formatEuro = (value: number | null | undefined): string => {
  if (value == null || isNaN(value)) return "—";
  return `€ ${Math.round(value).toLocaleString()}`;
};

const formatDate = (iso: string | undefined): string => {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const formatWeeks = (value: number | null | undefined): string => {
  if (value == null || isNaN(value)) return "—";
  const plural = value !== 1 ? "s" : "";
  return `${value} week${plural}`;
};

const formatWeeksWithSuffix = (
  value: number | null | undefined,
  suffix?: string
): string => {
  if (value == null || isNaN(value)) return "—";
  return suffix ? `${formatWeeks(value)} ${suffix}` : formatWeeks(value);
};

const formatWaitingDays = (value: number | null | undefined): string => {
  if (value == null || isNaN(value)) return "—";
  if (value === 0) return "No waiting days";
  return `${value} waiting day${value !== 1 ? "s" : ""}`;
};

const formatLinked = (linked: boolean | null | undefined): string => {
  if (linked == null) return "—";
  return linked ? "Yes – included in calculation" : "No";
};

/**
 * Generate a full, professional PDF report.
 * `footnote` lets you pass the CMS-driven result.footnote text
 * (e.g. content.result.footnote) so it matches what's shown on screen.
 */
export async function generatePDF(
  report: ReportData,
  footnote?: string
): Promise<Blob> {
  const doc = new jsPDF({
    unit: "mm",
    format: "a4",
    orientation: "portrait",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  let y = margin;

  /** Add a new page if there isn't enough space left */
  const ensureSpace = (needed: number): void => {
    if (y + needed > pageHeight - margin) {
      doc.addPage();
      y = margin;
    }
  };

  /** Draw a subtle horizontal divider */
  const drawDivider = (offsetY: number): void => {
    doc.setDrawColor(226, 232, 240);
    doc.line(margin, offsetY, pageWidth - margin, offsetY);
  };

  const sectionTitle = (title: string): void => {
    ensureSpace(20);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(15, 23, 42);
    doc.text(title, margin, y);
    y += 6;
  };

  const renderTable = (
    rows: (string | number)[][],
    colWidths: [number, string | number] = [50, "auto"]
  ): void => {
    autoTable(doc, {
      startY: y,
      margin: { left: margin, right: margin },
      body: rows as string[][],
      theme: "plain",
      styles: {
        fontSize: 10,
        cellPadding: { top: 2.5, bottom: 2.5, left: 0, right: 0 },
      },
      columnStyles: {
        0: { fontStyle: "bold", textColor: [71, 85, 105], cellWidth: colWidths[0] },
        1: { textColor: [15, 23, 42], cellWidth: colWidths[1] as any },
      },
    });
    y = ((doc as any).lastAutoTable?.finalY ?? y) + 10;
  };

  // ---- HEADER ----
  let logoLoaded = false;
  try {
    const logoUrl = "https://www.iflair.com/wp-content/uploads/2024/06/iFlair-logo.svg";
    const response = await fetch(logoUrl);
    if (response.ok) {
      const svgText = await response.text();
      const img = new Image();
      const svgBlob = new Blob([svgText], { type: "image/svg+xml" });
      const url = URL.createObjectURL(svgBlob);
      img.onload = () => {
        const logoWidth = 40;
        const logoHeight = (img.height / img.width) * logoWidth;
        doc.addImage(img, "PNG", margin, y - 5, logoWidth, logoHeight);
        URL.revokeObjectURL(url);
      };
      img.src = url;
      await new Promise((resolve) => {
        if (img.complete) resolve(null);
        else img.onload = resolve;
      });
      logoLoaded = true;
    }
  } catch (error) {
    console.warn("Could not load logo:", error);
  }

  doc.setFontSize(24);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(15, 23, 42);
  doc.text("Recura", margin + (logoLoaded ? 45 : 0), y);
  y += 8;

  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 116, 139);
  doc.text("Dutch Sick Leave Report", margin + (logoLoaded ? 45 : 0), y);
  y += 6;

  drawDivider(y);
  y += 10;

  // ---- PERSONAL INFORMATION ----
  sectionTitle("Personal Information");
  renderTable([
    ["Name", report.name || "—"],
    ["Email", report.email || "—"],
    ["Company", report.company || "—"],
    ["Industry", report.industry || "—"],
    ["Employment Status", report.status || "—"],
  ]);

  // ---- EMPLOYMENT INFORMATION ----
  const est = report.estimate || ({} as any);
  const contractedHours = report.hours ?? 0;
  const fullTimeHours = est.fullTimeHours ?? 40;
  const hourFactor = est.hourFactor ?? 1;

  sectionTitle("Employment Information");
  renderTable([
    ["Salary (gross monthly)", formatEuro(report.salary)],
    ["Contracted hours / week", contractedHours > 0 ? `${contractedHours} hrs` : "—"],
    ["Full-time baseline", `${fullTimeHours} hrs`],
    ["Hour factor", hourFactor.toFixed(2)],
    ["Effective monthly", formatEuro(est.effectiveMonthly)],
  ]);

  // ---- SICK LEAVE DETAILS ----
  const effectiveLinked = est.effectiveLinked ?? report.linked ?? false;

  sectionTitle("Sick Leave Details");
  const sickData: string[][] = [
    ["First day of sick leave", formatDate(report.firstDay)],
    ["Last day of sick leave", report.lastDay ? formatDate(report.lastDay) : "—"],
    ["Previous sickness linked", formatLinked(effectiveLinked)],
  ];
  if (report.linked && report.linkedFirstDay && report.linkedLastDay) {
    sickData.push(["Earlier first day", formatDate(report.linkedFirstDay)]);
    sickData.push(["Earlier last day", formatDate(report.linkedLastDay)]);
  }
  renderTable(sickData);

  // ---- ESTIMATED ENTITLEMENT (headline, matches on-screen card) ----
  ensureSpace(30);
  const mainAmount = est.currentMonthly ?? est.year1Monthly;
  const percent = est.currentPercent ?? est.year1Percent;

  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(100, 116, 139);
  doc.text("ESTIMATED SICK PAY ENTITLEMENT", margin, y);
  y += 9;

  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(15, 23, 42);
  doc.text(
    mainAmount != null ? `${formatEuro(mainAmount)} /month` : "—",
    margin,
    y
  );
  y += 7;

  if (percent != null) {
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 116, 139);
    doc.text(`Based on ${percent}% of your gross salary`, margin, y);
    y += 8;
  } else {
    y += 4;
  }

  // ---- ENTITLEMENT USAGE BREAKDOWN ----
  sectionTitle("Entitlement Usage");

  const maxWeeks = est.maxWeeks ?? 104;
  const weeksElapsed = est.weeksElapsed ?? 0;
  const weeksRemaining = est.weeksRemaining ?? 0;
  const absenceWeeks = est.absenceWeeks;
  const year1Weeks = est.year1Weeks ?? 52;
  const currentYear = est.currentYear ?? 1;

  let previousWeeks: number | null = null;
  let currentWeeks: number | null = null;
  if (effectiveLinked && absenceWeeks != null) {
    previousWeeks = Math.max(0, weeksElapsed - absenceWeeks);
    currentWeeks = absenceWeeks;
  } else {
    currentWeeks = weeksElapsed;
  }

  const breakdownRows: string[][] = [];
  breakdownRows.push(["Total entitlement period", formatWeeks(maxWeeks)]);

  if (previousWeeks !== null && previousWeeks > 0) {
    breakdownRows.push([
      "Previous sickness period",
      formatWeeksWithSuffix(previousWeeks, "used"),
    ]);
  }

  if (currentWeeks !== null) {
    const label = previousWeeks !== null ? "Current sickness period" : "Used so far";
    const suffix = previousWeeks !== null ? "used" : undefined;
    breakdownRows.push([label, formatWeeksWithSuffix(currentWeeks, suffix)]);
  }

  breakdownRows.push([
    "Remaining entitlement",
    formatWeeksWithSuffix(weeksRemaining, "remaining"),
  ]);

  const periodLabel =
    currentYear === 1
      ? `Year 1 (weeks 1–${year1Weeks})`
      : `Year 2 (after ${year1Weeks} weeks)`;
  breakdownRows.push(["Current payment period", periodLabel]);

  renderTable(breakdownRows, [60, "auto"]);

  // ---- MONTHLY ENTITLEMENT ----
  sectionTitle("Monthly Entitlement");
  renderTable(
    [
      [
        "Current monthly pay",
        formatEuro(est.currentMonthly),
        `${est.currentPercent ?? 0}% · year ${est.currentYear ?? 1}`,
      ],
      ["Year 1 monthly pay", formatEuro(est.year1Monthly), `${est.year1Percent ?? 0}%`],
      ["Year 2 monthly pay", formatEuro(est.year2Monthly), `${est.year2Percent ?? 0}%`],
    ] as any,
    [45, 40]
  );

  // ---- PAYMENT SUMMARY ----
  sectionTitle("Payment Summary");
  renderTable([
    ["Year 2 payment", `${formatEuro(est.year2Monthly)} /month`],
    ["Maximum estimated payment", formatEuro(est.totalOverMaxTerm)],
    ["Weeks remaining", `${est.weeksRemaining ?? "—"} / ${est.maxWeeks ?? "—"}`],
    ["Waiting period", formatWaitingDays(est.waitingDays)],
    ["Previous sickness linked", formatLinked(effectiveLinked)],
  ]);

  // ---- BELOW MINIMUM WAGE WARNING ----
  if (est.belowMinWage) {
    ensureSpace(20);
    doc.setFillColor(254, 242, 242);
    doc.setDrawColor(252, 165, 165);
    doc.roundedRect(margin, y - 5, pageWidth - 2 * margin, 14, 2, 2, "FD");
    doc.setFontSize(9.5);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(185, 28, 28);
    const warnLines = doc.splitTextToSize(
      "Your calculated sick pay may require review because it is below the minimum wage threshold.",
      pageWidth - 2 * margin - 8
    );
    doc.text(warnLines, margin + 4, y + 2);
    y += 14 + warnLines.length * 2 + 6;
  }

  // ---- LINK NOTE (if applicable) ----
  let linkNote: string | null = null;
  if (report.linked && report.linkedLastDay && report.firstDay) {
    const prevEnd = new Date(report.linkedLastDay);
    const newStart = new Date(report.firstDay);
    const gapDays = Math.round((newStart.getTime() - prevEnd.getTime()) / (1000 * 60 * 60 * 24));
    const windowDays = 28;
    if (gapDays >= 0) {
      const isLinked = gapDays <= windowDays;
      linkNote = isLinked
        ? `The gap between the previous sickness and this one is ${gapDays} days, which is within the ${windowDays}-day legal window – they are treated as one continuous period.`
        : `The gap between the previous sickness and this one is ${gapDays} days, which exceeds the ${windowDays}-day legal window – they are treated as separate periods.`;
    }
  }

  if (linkNote) {
    ensureSpace(20);
    doc.setFontSize(10);
    doc.setFont("helvetica", "italic");
    doc.setTextColor(71, 85, 105);
    doc.text("Note:", margin, y);
    y += 5;
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 116, 139);
    const noteLines = doc.splitTextToSize(linkNote, pageWidth - 2 * margin);
    doc.text(noteLines, margin, y);
    y += noteLines.length * 5 + 5;
  }

  // ---- EXPLANATION ----
  sectionTitle("Explanation");
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(71, 85, 105);

  const explanationLines = [
    "This estimate is based on the Dutch Civil Code Article 7:629.",
    "The calculation uses the statutory percentages (year 1: X%, year 2: Y%)",
    "applied to the effective monthly salary (prorated for part-time).",
    "The entitlement period is capped at 104 weeks (2 years).",
    "The waiting days are applied according to the statutory rules.",
    "Linked absences share the same 104-week clock.",
  ];
  explanationLines.forEach((line, i) => doc.text(line, margin, y + i * 5));
  y += explanationLines.length * 5 + 8;

  // ---- LEGAL BASIS ----
  sectionTitle("Legal Basis");
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(71, 85, 105);
  doc.text("Dutch Civil Code Article 7:629", margin, y);
  y += 5;

  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  const legalLines = [
    "The employee is entitled to continued payment of wages during sickness",
    "for a maximum of 104 weeks. The first 52 weeks at 70% of the wage",
    "(or the statutory minimum, whichever is higher), and the following",
    "52 weeks at 70% of the minimum wage.",
  ];
  legalLines.forEach((line, i) => doc.text(line, margin, y + i * 4.5));
  y += legalLines.length * 4.5 + 8;

  // ---- FOOTNOTE (dynamic, matches on-screen card) ----
  ensureSpace(15);
  doc.setFontSize(9);
  doc.setFont("helvetica", "italic");
  doc.setTextColor(100, 116, 139);
  const footnoteText =
    footnote ||
    "Based on Article 7:629 of the Dutch Civil Code. CAO agreements may provide higher benefits.";
  const footnoteLines = doc.splitTextToSize(footnoteText, pageWidth - 2 * margin);
  doc.text(footnoteLines, margin, y);
  y += footnoteLines.length * 4.5 + 8;

  // ---- DISCLAIMER ----
  ensureSpace(15);
  doc.setFontSize(9);
  doc.setFont("helvetica", "italic");
  doc.setTextColor(148, 163, 184);
  doc.text(
    "Disclaimer: This is an automated estimate and not legal or financial advice.",
    margin,
    y
  );
  y += 5;

  // ---- FOOTER (page numbers & timestamp) ----
  const totalPages = doc.internal.pages.length;
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    const pageY = doc.internal.pageSize.getHeight() - 10;
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(148, 163, 184);
    doc.text(
      `Generated: ${new Date(report.generatedDate).toLocaleString()} · Page ${i} of ${totalPages}`,
      margin,
      pageY
    );
  }

  return doc.output("blob");
}