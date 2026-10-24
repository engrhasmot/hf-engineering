import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import CEPEstimate from "@/models/cost-estimator-pro/cep-estimate.model";
import CEPAudit from "@/models/cost-estimator-pro/cep-audit.model";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;
    if (!token) {
      return NextResponse.json({ error: "Missing share token" }, { status: 400 });
    }

    await dbConnect();
    const estimate = await CEPEstimate.findOne({ shareToken: token });

    if (!estimate) {
      return NextResponse.json({ error: "Estimate proposal not found or link has expired." }, { status: 404 });
    }

    // Increment client view count and timestamp
    estimate.clientViewCount = (estimate.clientViewCount || 0) + 1;
    estimate.clientLastViewedAt = new Date();
    if (estimate.clientStatus === "pending") {
      estimate.clientStatus = "viewed";
    }
    await estimate.save();

    // Prepare client-facing presentation
    const clientData = {
      company: {
        name: "HF Design & Engineering Solutions",
        tagline: "Architecture • Structural Design • Estimation • Supervision",
        hotline: "+880 1711-000000",
        whatsapp: "8801700000000",
        email: "hfdesignengineering@gmail.com",
        website: "https://hf-engineering.vercel.app",
        address: "Dhaka, Bangladesh",
      },
      estimateNumber: estimate.estimateNumber,
      projectName: estimate.projectName,
      clientName: estimate.clientName,
      location: estimate.location,
      revision: estimate.revision,
      status: estimate.status,
      clientStatus: estimate.clientStatus,
      clientAcceptedAt: estimate.clientAcceptedAt,
      validityDate: estimate.validityDate,
      createdAt: estimate.createdAt,
      inputs: {
        buildingType: estimate.inputsSnapshot?.buildingType || "Residential",
        floors: estimate.inputsSnapshot?.floors || 1,
        totalBuiltUpArea: estimate.inputsSnapshot?.totalBuiltUpArea || 0,
        unitType: estimate.inputsSnapshot?.unitType || "sqft",
        foundationType: estimate.inputsSnapshot?.foundationType || "Isolated Footing",
        structuralSpecs: estimate.inputsSnapshot?.structuralSpecs,
        finishingSpecs: estimate.inputsSnapshot?.finishingSpecs,
      },
      financials: {
        grandTotalCost: estimate.financials.grandTotalCost,
        costPerSqFt: estimate.financials.costPerSqFt,
        costPerSqM: estimate.financials.costPerSqM,
        subtotalBaseCost: estimate.financials.subtotalBaseCost,
        materialCostTotal: estimate.financials.materialCostTotal,
        labourCostTotal: estimate.financials.labourCostTotal,
        categoryTotals: estimate.financials.categoryTotals || [],
        floorWiseCost: estimate.financials.floorWiseCost || [],
      },
      boqItems: estimate.boqItems.map((item) => ({
        itemCode: item.itemCode,
        category: item.category,
        description: item.description,
        unit: item.unit,
        quantity: item.quantity,
        unitRate: item.unitRate,
        amount: item.amount,
      })),
      assumptions: estimate.assumptions || [],
      exclusions: estimate.exclusions || [],
      notes: estimate.notes || "",
      shareToken: estimate.shareToken,
    };

    return NextResponse.json({ success: true, data: clientData });
  } catch (err: any) {
    console.error("Portal API Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;
    const body = await req.json();
    const { action, notes } = body; // action: 'accept' | 'request_revision'

    await dbConnect();
    const estimate = await CEPEstimate.findOne({ shareToken: token });

    if (!estimate) {
      return NextResponse.json({ error: "Estimate not found" }, { status: 404 });
    }

    if (action === "accept") {
      estimate.clientStatus = "accepted";
      estimate.clientAcceptedAt = new Date();
      if (notes) estimate.clientNotes = notes;
      await estimate.save();

      await CEPAudit.create({
        action: "CLIENT_ACCEPT_PROPOSAL",
        entityType: "CEPEstimate",
        entityId: estimate.estimateNumber,
        details: `Client ${estimate.clientName} officially accepted proposal ${estimate.estimateNumber} via Client Portal.`,
        performedBy: `Client: ${estimate.clientName}`,
      });

      return NextResponse.json({
        success: true,
        message: "Thank you! The estimate proposal has been officially accepted.",
        clientStatus: "accepted",
        acceptedAt: estimate.clientAcceptedAt,
      });
    }

    if (action === "request_revision") {
      estimate.clientStatus = "revision_requested";
      if (notes) estimate.clientNotes = notes;
      await estimate.save();

      await CEPAudit.create({
        action: "CLIENT_REVISION_REQUESTED",
        entityType: "CEPEstimate",
        entityId: estimate.estimateNumber,
        details: `Client ${estimate.clientName} requested revision for ${estimate.estimateNumber}. Notes: ${notes || "None"}`,
        performedBy: `Client: ${estimate.clientName}`,
      });

      return NextResponse.json({
        success: true,
        message: "Revision request submitted. Our engineering team will contact you shortly.",
        clientStatus: "revision_requested",
      });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (err: any) {
    console.error("Client action error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
