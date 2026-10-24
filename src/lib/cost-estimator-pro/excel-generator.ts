import * as XLSX from "xlsx";
import { ICEPEstimate } from "@/models/cost-estimator-pro/cep-estimate.model";

export function generateEstimateExcel(estimate: ICEPEstimate): Buffer {
  const wb = XLSX.utils.book_new();

  // --- SHEET 1: ESTIMATE SUMMARY ---
  const summaryData = [
    ["HF DESIGN & ENGINEERING SOLUTIONS"],
    ["CONSTRUCTION COST ESTIMATE & BILL OF QUANTITIES (BOQ) SUMMARY"],
    [],
    ["Estimate Reference:", estimate.estimateNumber, "Date:", new Date(estimate.createdAt).toLocaleDateString()],
    ["Project Name:", estimate.projectName, "Revision:", `Rev-${estimate.revision}`],
    ["Client Name:", estimate.clientName, "Status:", estimate.status.toUpperCase()],
    ["Location:", estimate.location, "Building Type:", estimate.inputsSnapshot.buildingType],
    ["Estimated Floors:", `${estimate.inputsSnapshot.floors} Storied`, "Total Built-Up Area:", `${estimate.inputsSnapshot.totalBuiltUpArea.toLocaleString()} Sq.Ft`],
    ["Foundation Type:", estimate.inputsSnapshot.foundationType, "Formula Engine:", estimate.formulaVersion],
    [],
    ["FINANCIAL BREAKDOWN", "AMOUNT (BDT)", "PERCENTAGE OF TOTAL"],
    ["1. Material Base Cost", estimate.financials.materialCostTotal, `${Math.round((estimate.financials.materialCostTotal / estimate.financials.subtotalBaseCost) * 100)}%`],
    ["2. Labour Base Cost", estimate.financials.labourCostTotal, `${Math.round((estimate.financials.labourCostTotal / estimate.financials.subtotalBaseCost) * 100)}%`],
    ["3. Equipment & Ancillary Cost", estimate.financials.equipmentAndOtherTotal, `${Math.round((estimate.financials.equipmentAndOtherTotal / estimate.financials.subtotalBaseCost) * 100)}%`],
    ["SUBTOTAL BASE EXPENDITURE", estimate.financials.subtotalBaseCost, "100%"],
    [],
    ["Wastage Allowance", estimate.financials.wastageAmount, `${estimate.financials.wastagePct}%`],
    ["Overhead & Site Management", estimate.financials.overheadAmount, `${estimate.financials.overheadPct}%`],
    ["Engineering Contingency", estimate.financials.contingencyAmount, `${estimate.financials.contingencyPct}%`],
    ["Contractor / Management Profit", estimate.financials.profitAmount, `${estimate.financials.profitPct}%`],
    ["VAT / Applicable Tax", estimate.financials.vatTaxAmount, `${estimate.financials.vatTaxPct}%`],
    ["Special Discount / Deductions", -estimate.financials.discountAmount, "-"],
    [],
    ["ESTIMATED GRAND TOTAL (BDT)", estimate.financials.grandTotalCost, ""],
    ["ESTIMATED COST PER SQ.FT", estimate.financials.costPerSqFt, "BDT / Sq.Ft"],
    ["ESTIMATED COST PER SQ.M", estimate.financials.costPerSqM, "BDT / Sq.M"],
  ];
  const wsSummary = XLSX.utils.aoa_to_sheet(summaryData);
  XLSX.utils.book_append_sheet(wb, wsSummary, "Estimate Summary");

  // --- SHEET 2: DETAILED BOQ ---
  const boqHeader = ["Item Code", "Work Category", "Description of Work", "Unit", "Quantity", "Unit Rate (BDT)", "Total Amount (BDT)", "Material Cost", "Labour Cost", "Engineering Note"];
  const boqRows = estimate.boqItems.map((item) => [
    item.itemCode,
    item.category,
    item.description,
    item.unit,
    item.quantity,
    item.unitRate,
    item.amount,
    item.materialCost,
    item.labourCost,
    item.formulaNote || "",
  ]);
  const wsBOQ = XLSX.utils.aoa_to_sheet([boqHeader, ...boqRows]);
  XLSX.utils.book_append_sheet(wb, wsBOQ, "Detailed BOQ");

  // --- SHEET 3: MATERIAL RATES SNAPSHOT ---
  const matHeader = ["Material Code", "Material Description", "Unit", "Benchmark Unit Rate (BDT)"];
  const matRows = (estimate.rateSnapshots?.materials || []).map((m) => [
    m.code,
    m.name,
    m.unit,
    m.rate,
  ]);
  const wsMaterials = XLSX.utils.aoa_to_sheet([matHeader, ...matRows]);
  XLSX.utils.book_append_sheet(wb, wsMaterials, "Material Rates");

  // --- SHEET 4: LABOUR RATES SNAPSHOT ---
  const labHeader = ["Trade Code", "Trade Designation", "Unit", "Daily / Unit Rate (BDT)"];
  const labRows = (estimate.rateSnapshots?.labour || []).map((l) => [
    l.code,
    l.tradeName,
    l.unit,
    l.rate,
  ]);
  const wsLabour = XLSX.utils.aoa_to_sheet([labHeader, ...labRows]);
  XLSX.utils.book_append_sheet(wb, wsLabour, "Labour Rates");

  // --- SHEET 5: ASSUMPTIONS & EXCLUSIONS ---
  const notesData = [
    ["PROJECT ASSUMPTIONS"],
    ...(estimate.assumptions || []).map((a) => [a]),
    [],
    ["PROJECT EXCLUSIONS"],
    ...(estimate.exclusions || []).map((e) => [e]),
    [],
    ["LEGAL DISCLAIMER"],
    ["This Bill of Quantities (BOQ) and cost estimation is an engineering calculation based on prevailing BNBC 2020 building code specifications. Actual site costs may differ subject to geotechnical soil discoveries and market material adjustments."],
  ];
  const wsNotes = XLSX.utils.aoa_to_sheet(notesData);
  XLSX.utils.book_append_sheet(wb, wsNotes, "Notes & Disclaimers");

  // Write workbook to buffer
  const buf = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });
  return buf;
}
