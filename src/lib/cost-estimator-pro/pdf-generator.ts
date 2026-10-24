import { jsPDF } from "jspdf";
import { ICEPEstimate } from "@/models/cost-estimator-pro/cep-estimate.model";

export function generateEstimatePDF(estimate: ICEPEstimate): Buffer {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  let currentY = 15;

  // Helper for adding footer with page numbers
  const addFooter = (pageNum: number) => {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(120, 120, 120);
    doc.text(
      `HF Design & Engineering Solutions — Cost Estimator Pro Report | Ref: ${estimate.estimateNumber}`,
      15,
      pageHeight - 10
    );
    doc.text(`Page ${pageNum}`, pageWidth - 25, pageHeight - 10);
  };

  // Header Banner
  doc.setFillColor(11, 42, 74); // Deep Navy #0B2A4A
  doc.rect(0, 0, pageWidth, 28, "F");

  doc.setFillColor(242, 169, 0); // Warm Gold #F2A900
  doc.rect(0, 27, pageWidth, 2, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(255, 255, 255);
  doc.text("HF DESIGN & ENGINEERING SOLUTIONS", 15, 12);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(240, 240, 240);
  doc.text("Civil Engineering · Structural Analysis · Building Estimation & Consultancy", 15, 18);
  doc.text("Aysha Monjil, House 14/05, Ward 01, Noyabari, Savar Radio Colony, Dhaka | Tel: 01778-506500", 15, 23);

  currentY = 38;

  // Report Title Box
  doc.setFont("helvetica", "bold");
  doc.setFontSize(15);
  doc.setTextColor(11, 42, 74);
  doc.text("OFFICIAL BILL OF QUANTITIES (BOQ) & ESTIMATE", 15, currentY);

  doc.setFontSize(9);
  doc.setTextColor(100, 100, 100);
  doc.text(`Generated on ${new Date(estimate.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" })}`, 15, currentY + 5);

  // Status Badge
  doc.setFillColor(242, 169, 0);
  doc.roundedRect(pageWidth - 45, currentY - 5, 30, 8, 2, 2, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(11, 42, 74);
  doc.text(`REV-${estimate.revision} · ${estimate.status.toUpperCase()}`, pageWidth - 42, currentY);

  currentY += 14;

  // Project Info Grid
  doc.setFillColor(245, 247, 250);
  doc.roundedRect(15, currentY, pageWidth - 30, 28, 3, 3, "F");
  doc.setDrawColor(220, 225, 230);
  doc.roundedRect(15, currentY, pageWidth - 30, 28, 3, 3, "S");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(100, 100, 100);
  doc.text("ESTIMATE NUMBER", 20, currentY + 6);
  doc.text("PROJECT NAME", 75, currentY + 6);
  doc.text("CLIENT NAME", 135, currentY + 6);

  doc.setFontSize(10);
  doc.setTextColor(11, 42, 74);
  doc.text(estimate.estimateNumber, 20, currentY + 12);
  doc.text(estimate.projectName.slice(0, 26), 75, currentY + 12);
  doc.text((estimate.clientName || "Valued Client").slice(0, 22), 135, currentY + 12);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(100, 100, 100);
  doc.text("LOCATION", 20, currentY + 19);
  doc.text("TOTAL BUILT-UP AREA", 75, currentY + 19);
  doc.text("FOUNDATION & FLOORS", 135, currentY + 19);

  doc.setFontSize(9.5);
  doc.setTextColor(11, 42, 74);
  doc.text(estimate.location, 20, currentY + 24);
  doc.text(`${estimate.inputsSnapshot.totalBuiltUpArea.toLocaleString()} Sq.Ft`, 75, currentY + 24);
  doc.text(`${estimate.inputsSnapshot.floors} Floors · ${estimate.inputsSnapshot.foundationType}`, 135, currentY + 24);

  currentY += 34;

  // Grand Total Highlight Banner
  doc.setFillColor(11, 42, 74);
  doc.roundedRect(15, currentY, pageWidth - 30, 22, 3, 3, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(242, 169, 0);
  doc.text("ESTIMATED GRAND TOTAL CONSTRUCTION COST", 22, currentY + 7);

  doc.setFontSize(16);
  doc.setTextColor(255, 255, 255);
  doc.text(`BDT ৳ ${estimate.financials.grandTotalCost.toLocaleString("en-BD")}`, 22, currentY + 16);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(200, 220, 240);
  doc.text(`Unit Rate: ৳ ${estimate.financials.costPerSqFt.toLocaleString()} / Sq.Ft`, pageWidth - 70, currentY + 11);
  doc.text(`Subtotal: ৳ ${estimate.financials.subtotalBaseCost.toLocaleString()} + Margins`, pageWidth - 70, currentY + 16);

  currentY += 28;

  // Financial Breakdown Strip
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.setTextColor(11, 42, 74);
  doc.text("FINANCIAL SUMMARY & COST MARGINS", 15, currentY);
  currentY += 4;

  const finColumns = [
    { label: "Material Base", val: `৳ ${estimate.financials.materialCostTotal.toLocaleString()}` },
    { label: "Labour Base", val: `৳ ${estimate.financials.labourCostTotal.toLocaleString()}` },
    { label: `Wastage (${estimate.financials.wastagePct}%)`, val: `৳ ${estimate.financials.wastageAmount.toLocaleString()}` },
    { label: `Overhead (${estimate.financials.overheadPct}%)`, val: `৳ ${estimate.financials.overheadAmount.toLocaleString()}` },
    { label: `Profit (${estimate.financials.profitPct}%)`, val: `৳ ${estimate.financials.profitAmount.toLocaleString()}` },
  ];

  const colWidth = (pageWidth - 30) / finColumns.length;
  finColumns.forEach((c, idx) => {
    const x = 15 + idx * colWidth;
    doc.setFillColor(248, 249, 250);
    doc.rect(x, currentY, colWidth - 1, 12, "F");
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(120, 120, 120);
    doc.text(c.label, x + 2, currentY + 4);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(11, 42, 74);
    doc.text(c.val, x + 2, currentY + 9);
  });

  currentY += 18;

  // BOQ Table Header
  const renderBOQHeader = (y: number) => {
    doc.setFillColor(11, 42, 74);
    doc.rect(15, y, pageWidth - 30, 7, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(255, 255, 255);
    doc.text("CODE", 17, y + 4.8);
    doc.text("WORK CATEGORY & DESCRIPTION", 38, y + 4.8);
    doc.text("UNIT", 116, y + 4.8);
    doc.text("QTY", 130, y + 4.8);
    doc.text("RATE (৳)", 148, y + 4.8);
    doc.text("AMOUNT (৳)", 172, y + 4.8);
  };

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.setTextColor(11, 42, 74);
  doc.text("ITEMIZED BILL OF QUANTITIES (BOQ)", 15, currentY);
  currentY += 4;

  renderBOQHeader(currentY);
  currentY += 8;

  let pageNum = 1;
  addFooter(pageNum);

  // BOQ Rows
  estimate.boqItems.forEach((item, index) => {
    // Check if we need page break
    if (currentY > pageHeight - 25) {
      doc.addPage();
      pageNum++;
      addFooter(pageNum);
      currentY = 18;
      renderBOQHeader(currentY);
      currentY += 8;
    }

    const isEven = index % 2 === 0;
    if (isEven) {
      doc.setFillColor(248, 250, 252);
      doc.rect(15, currentY - 3.5, pageWidth - 30, 7.5, "F");
    }

    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    doc.setTextColor(11, 42, 74);
    doc.text(item.itemCode, 17, currentY);

    doc.setFont("helvetica", "normal");
    doc.setTextColor(40, 40, 40);
    const descText = item.description.length > 50 ? item.description.slice(0, 48) + "..." : item.description;
    doc.text(descText, 38, currentY);

    doc.text(item.unit, 116, currentY);
    doc.text(item.quantity.toLocaleString(), 130, currentY);
    doc.text(item.unitRate.toLocaleString(), 148, currentY);

    doc.setFont("helvetica", "bold");
    doc.setTextColor(11, 42, 74);
    doc.text(item.amount.toLocaleString(), 172, currentY);

    currentY += 7.5;
  });

  // Check space for Signature & Disclaimer
  if (currentY > pageHeight - 50) {
    doc.addPage();
    pageNum++;
    addFooter(pageNum);
    currentY = 20;
  }

  currentY += 8;
  doc.setDrawColor(210, 215, 220);
  doc.line(15, currentY, pageWidth - 15, currentY);
  currentY += 6;

  // Disclaimer & Signatures
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(110, 110, 110);
  const disclaimerText = doc.splitTextToSize(
    "Disclaimer: This engineering estimate is formulated based on current Bangladesh construction material benchmarks and BNBC 2020 structural provisions. Final expenditure is contingent on local soil geotechnical findings and client-approved architectural finishes.",
    110
  );
  doc.text(disclaimerText, 15, currentY);

  // Engineer Stamp box
  const signX = pageWidth - 65;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(11, 42, 74);
  doc.text("ENGINEERING CERTIFICATION", signX, currentY);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.text("Engr. Md. Hasmot Ali", signX, currentY + 5);
  doc.text("B.Sc. Civil Engr, IEB M-38530", signX, currentY + 9);
  doc.text("Chief Consultant, HF Engineering", signX, currentY + 13);

  const arrayBuffer = doc.output("arraybuffer");
  return Buffer.from(arrayBuffer);
}
