import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { checkAdmin } from "@/lib/auth-check";
import CEPEstimate from "@/models/cost-estimator-pro/cep-estimate.model";
import CEPAudit from "@/models/cost-estimator-pro/cep-audit.model";
import { calculateCostEstimatorPro } from "@/lib/cost-estimator-pro/calculation-engine";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await checkAdmin(req);
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await params;
    await dbConnect();

    const estimate = await CEPEstimate.findOne({
      $or: [{ _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }, { estimateNumber: id.toUpperCase() }],
    });

    if (!estimate) {
      return NextResponse.json({ error: "Estimate not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: estimate });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await checkAdmin(req);
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await params;
    await dbConnect();
    const body = await req.json();

    const existing = await CEPEstimate.findById(id);
    if (!existing) {
      return NextResponse.json({ error: "Estimate not found" }, { status: 404 });
    }

    const { action } = body; // 'issue' | 'revise' | 'update' | 'archive'

    if (action === "issue") {
      // Finalize and freeze estimate
      existing.status = "issued";
      existing.isImmutable = true;
      existing.updatedAt = new Date();
      await existing.save();

      await CEPAudit.create({
        action: "ISSUE_ESTIMATE",
        entityType: "CEPEstimate",
        entityId: existing.estimateNumber,
        details: `Issued estimate ${existing.estimateNumber} as immutable baseline`,
        performedBy: admin.email,
      });

      return NextResponse.json({ success: true, data: existing, message: "Estimate officially issued" });
    }

    if (action === "revise" || existing.isImmutable) {
      // Create new revision from existing immutable estimate
      const newRevisionNum = existing.revision + 1;
      const revised = await CEPEstimate.create({
        ...existing.toObject(),
        _id: undefined,
        estimateNumber: `${existing.estimateNumber.split("-R")[0]}-R${newRevisionNum}`,
        revision: newRevisionNum,
        parentEstimateId: existing._id.toString(),
        status: "draft",
        isImmutable: false,
        notes: body.notes || `Revised from ${existing.estimateNumber}`,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      await CEPAudit.create({
        action: "REVISE_ESTIMATE",
        entityType: "CEPEstimate",
        entityId: revised.estimateNumber,
        details: `Created revision ${revised.estimateNumber} from ${existing.estimateNumber}`,
        performedBy: admin.email,
      });

      return NextResponse.json({ success: true, data: revised, message: "New revision created" });
    }

    // Normal draft update: recalculate if dimensions changed
    if (body.inputsSnapshot) {
      const calcOutput = calculateCostEstimatorPro({
        buildingType: body.inputsSnapshot.buildingType,
        floors: body.inputsSnapshot.floors,
        unitType: body.inputsSnapshot.unitType || "sqft",
        groundFloorArea: body.inputsSnapshot.groundFloorArea,
        typicalFloorArea: body.inputsSnapshot.typicalFloorArea,
        totalBuiltUpArea: body.inputsSnapshot.totalBuiltUpArea,
        floorWiseDetails: body.inputsSnapshot.floorWiseDetails,
        foundationType: body.inputsSnapshot.foundationType,
        structuralSpecs: body.inputsSnapshot.structuralSpecs,
        finishingSpecs: body.inputsSnapshot.finishingSpecs,
        wastagePct: body.financials?.wastagePct,
        overheadPct: body.financials?.overheadPct,
        contingencyPct: body.financials?.contingencyPct,
        profitPct: body.financials?.profitPct,
        vatTaxPct: body.financials?.vatTaxPct,
        discountAmount: body.financials?.discountAmount,
      });

      existing.inputsSnapshot = body.inputsSnapshot;
      existing.boqItems = calcOutput.boqItems;
      existing.financials = {
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
      };
    }

    if (body.projectName) existing.projectName = body.projectName;
    if (body.clientName) existing.clientName = body.clientName;
    if (body.clientPhone !== undefined) existing.clientPhone = body.clientPhone;
    if (body.location) existing.location = body.location;
    if (body.status) existing.status = body.status;
    if (body.notes !== undefined) existing.notes = body.notes;
    existing.updatedAt = new Date();

    await existing.save();

    await CEPAudit.create({
      action: "UPDATE_ESTIMATE",
      entityType: "CEPEstimate",
      entityId: existing.estimateNumber,
      details: `Updated estimate ${existing.estimateNumber}`,
      performedBy: admin.email,
    });

    return NextResponse.json({ success: true, data: existing });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await checkAdmin(req);
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await params;
    await dbConnect();

    const existing = await CEPEstimate.findById(id);
    if (!existing) return NextResponse.json({ error: "Estimate not found" }, { status: 404 });

    await CEPEstimate.findByIdAndDelete(id);

    await CEPAudit.create({
      action: "DELETE_ESTIMATE",
      entityType: "CEPEstimate",
      entityId: existing.estimateNumber,
      details: `Deleted estimate ${existing.estimateNumber}`,
      performedBy: admin.email,
    });

    return NextResponse.json({ success: true, message: "Estimate deleted" });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
