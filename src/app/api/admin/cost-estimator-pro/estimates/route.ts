import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import dbConnect from "@/lib/db";
import { checkAdmin } from "@/lib/auth-check";
import CEPEstimate from "@/models/cost-estimator-pro/cep-estimate.model";
import CEPProject from "@/models/cost-estimator-pro/cep-project.model";
import CEPMaterialRate from "@/models/cost-estimator-pro/cep-material-rate.model";
import CEPLabourRate from "@/models/cost-estimator-pro/cep-labour-rate.model";
import CEPAudit from "@/models/cost-estimator-pro/cep-audit.model";
import { calculateCostEstimatorPro } from "@/lib/cost-estimator-pro/calculation-engine";

export async function GET(req: NextRequest) {
  const admin = await checkAdmin(req);
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "";
    const projectId = searchParams.get("projectId") || "";

    const filter: any = {};
    if (status) filter.status = status;
    if (projectId) filter.projectId = projectId;
    if (search) {
      filter.$or = [
        { estimateNumber: { $regex: search, $options: "i" } },
        { projectName: { $regex: search, $options: "i" } },
        { clientName: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } },
      ];
    }

    const estimates = await CEPEstimate.find(filter)
      .sort({ createdAt: -1 })
      .select("estimateNumber projectId projectName clientName clientPhone location revision status isImmutable financials shareToken clientStatus clientViewCount clientLastViewedAt clientAcceptedAt createdAt updatedAt");

    // Ensure all estimates have a shareToken for the client portal
    for (const est of estimates) {
      if (!est.shareToken) {
        est.shareToken = "cep_" + crypto.randomBytes(8).toString("hex");
        await CEPEstimate.updateOne(
          { _id: est._id },
          { $set: { shareToken: est.shareToken, clientStatus: est.clientStatus || "pending", clientViewCount: est.clientViewCount || 0 } }
        );
      }
    }

    return NextResponse.json({ success: true, data: estimates });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const admin = await checkAdmin(req);
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const action = searchParams.get("action"); // 'calculate' | 'save'
    const body = await req.json();

    // 1. Fetch live active benchmark rates for snapshot & calculation
    const [activeMaterials, activeLabour] = await Promise.all([
      CEPMaterialRate.find({ isActive: true }),
      CEPLabourRate.find({ isActive: true }),
    ]);

    const materialRatesMap: Record<string, number> = {};
    activeMaterials.forEach((m) => {
      materialRatesMap[m.code] = m.unitPrice;
      if (m.name.includes("PCC")) materialRatesMap.CEMENT_PCC = m.unitPrice;
      if (m.name.includes("OPC")) materialRatesMap.CEMENT_OPC = m.unitPrice;
      if (m.category === "Reinforcement Steel") materialRatesMap.REBAR_500W = m.unitPrice;
      if (m.name.includes("Sylhet")) materialRatesMap.SAND_SYLHET = m.unitPrice;
      if (m.name.includes("Local")) materialRatesMap.SAND_LOCAL = m.unitPrice;
      if (m.name.includes("Bricks")) materialRatesMap.BRICKS_FIRST_CLASS = m.unitPrice;
      if (m.name.includes("Stone Chips")) materialRatesMap.STONE_CHIPS = m.unitPrice;
    });

    const labourRatesMap: Record<string, number> = {};
    activeLabour.forEach((l) => {
      labourRatesMap[l.code] = l.rate;
    });

    // 2. Perform Pure Deterministic Calculation
    const calcOutput = calculateCostEstimatorPro({
      buildingType: body.buildingType || "Residential",
      floors: Number(body.floors) || 4,
      unitType: body.unitType || "sqft",
      groundFloorArea: Number(body.groundFloorArea) || 1200,
      typicalFloorArea: Number(body.typicalFloorArea) || 1200,
      totalBuiltUpArea: Number(body.totalBuiltUpArea) || 0,
      floorWiseDetails: body.floorWiseDetails,
      foundationType: body.foundationType || "Isolated Footing",
      structuralSpecs: body.structuralSpecs,
      finishingSpecs: body.finishingSpecs,
      materialRates: materialRatesMap,
      labourRates: labourRatesMap,
      wastagePct: Number(body.wastagePct ?? 3.0),
      overheadPct: Number(body.overheadPct ?? 5.0),
      contingencyPct: Number(body.contingencyPct ?? 3.0),
      profitPct: Number(body.profitPct ?? 10.0),
      vatTaxPct: Number(body.vatTaxPct ?? 0),
      discountAmount: Number(body.discountAmount ?? 0),
    });

    // If only requesting calculation preview without saving
    if (action === "calculate") {
      return NextResponse.json({ success: true, calculation: calcOutput });
    }

    // 3. Save Estimate to Database
    const count = await CEPEstimate.countDocuments();
    const estimateNumber = `CEP-EST-${new Date().getFullYear()}-${String(count + 1).padStart(3, "0")}`;

    const newEstimate = await CEPEstimate.create({
      estimateNumber,
      projectId: body.projectId || "",
      projectName: body.projectName || `${body.buildingType} Construction Estimate`,
      clientName: body.clientName || "Valued Client",
      clientPhone: body.clientPhone || "",
      clientEmail: body.clientEmail || "",
      location: body.location || "Dhaka",
      revision: 1,
      status: body.status || "draft",
      isImmutable: false,
      inputsSnapshot: {
        buildingType: body.buildingType || "Residential",
        floors: Number(body.floors) || 4,
        unitType: body.unitType || "sqft",
        groundFloorArea: Number(body.groundFloorArea) || 1200,
        typicalFloorArea: Number(body.typicalFloorArea) || 1200,
        totalBuiltUpArea: calcOutput.totalBuiltUpArea,
        floorHeightFt: Number(body.floorHeightFt) || 10,
        floorWiseDetails: body.floorWiseDetails || [],
        foundationType: body.foundationType || "Isolated Footing",
        structuralSpecs: body.structuralSpecs || {},
        finishingSpecs: body.finishingSpecs || {},
      },
      boqItems: calcOutput.boqItems,
      rateSnapshots: {
        materials: activeMaterials.map((m) => ({ code: m.code, name: m.name, unit: m.unit, rate: m.unitPrice })),
        labour: activeLabour.map((l) => ({ code: l.code, tradeName: l.tradeName, unit: l.unit, rate: l.rate })),
      },
      financials: {
        materialCostTotal: calcOutput.materialCostTotal,
        labourCostTotal: calcOutput.labourCostTotal,
        equipmentAndOtherTotal: calcOutput.equipmentAndOtherTotal,
        subtotalBaseCost: calcOutput.subtotalBaseCost,
        wastagePct: calcOutput.wastagePct,
        wastageAmount: calcOutput.wastageAmount,
        overheadPct: calcOutput.overheadPct,
        overheadAmount: calcOutput.overheadAmount,
        contingencyPct: calcOutput.contingencyPct,
        contingencyAmount: calcOutput.contingencyAmount,
        profitPct: calcOutput.profitPct,
        profitAmount: calcOutput.profitAmount,
        vatTaxPct: calcOutput.vatTaxPct,
        vatTaxAmount: calcOutput.vatTaxAmount,
        discountAmount: calcOutput.discountAmount,
        grandTotalCost: calcOutput.grandTotalCost,
        costPerSqFt: calcOutput.costPerSqFt,
        costPerSqM: calcOutput.costPerSqM,
        floorWiseCost: calcOutput.floorWiseCost,
        categoryTotals: calcOutput.categoryTotals,
      },
      assumptions: calcOutput.assumptions,
      exclusions: calcOutput.exclusions,
      notes: body.notes || "",
      formulaVersion: calcOutput.formulaVersion,
      createdBy: admin.email,
      shareToken: "cep_" + crypto.randomBytes(8).toString("hex"),
      clientStatus: "pending",
      clientViewCount: 0,
    });

    // If attached to a project, increment count
    if (body.projectId) {
      await CEPProject.findOneAndUpdate(
        { projectId: body.projectId },
        { $inc: { estimatesCount: 1 }, $set: { latestEstimateNumber: estimateNumber } }
      );
    }

    await CEPAudit.create({
      action: "CREATE_ESTIMATE",
      entityType: "CEPEstimate",
      entityId: newEstimate.estimateNumber,
      details: `Created estimate for ${newEstimate.projectName} (৳${newEstimate.financials.grandTotalCost.toLocaleString()})`,
      performedBy: admin.email,
    });

    return NextResponse.json({ success: true, data: newEstimate });
  } catch (err: any) {
    console.error("Save estimate error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
