import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { checkAdmin } from "@/lib/auth-check";
import CEPMaterialRate from "@/models/cost-estimator-pro/cep-material-rate.model";
import CEPAudit from "@/models/cost-estimator-pro/cep-audit.model";
import { ensureCEPDefaults } from "@/lib/cost-estimator-pro/seed-defaults";

export async function GET(req: NextRequest) {
  const admin = await checkAdmin(req);
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    await dbConnect();
    await ensureCEPDefaults();
    const materials = await CEPMaterialRate.find().sort({ category: 1, name: 1 });
    return NextResponse.json({ success: true, data: materials });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const admin = await checkAdmin(req);
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    await dbConnect();
    const body = await req.json();

    const existing = await CEPMaterialRate.findOne({ code: body.code.toUpperCase() });
    if (existing) {
      return NextResponse.json({ error: "Material code already exists" }, { status: 400 });
    }

    const material = await CEPMaterialRate.create({
      code: body.code.toUpperCase(),
      name: body.name,
      category: body.category,
      unit: body.unit,
      unitPrice: Number(body.unitPrice),
      location: body.location || "All",
      supplierNote: body.supplierNote || "",
      effectiveDate: body.effectiveDate || new Date(),
      isActive: body.isActive !== undefined ? body.isActive : true,
      revisionHistory: [{ price: Number(body.unitPrice), changedAt: new Date(), changedBy: admin.email }],
    });

    await CEPAudit.create({
      action: "CREATE_MATERIAL_RATE",
      entityType: "CEPMaterialRate",
      entityId: material.code,
      details: `Added ${material.name} at ৳${material.unitPrice}/${material.unit}`,
      performedBy: admin.email,
    });

    return NextResponse.json({ success: true, data: material });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const admin = await checkAdmin(req);
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    await dbConnect();
    const body = await req.json();
    const { _id, unitPrice, name, category, unit, location, supplierNote, isActive } = body;

    const existing = await CEPMaterialRate.findById(_id);
    if (!existing) return NextResponse.json({ error: "Material not found" }, { status: 404 });

    const priceChanged = existing.unitPrice !== Number(unitPrice);
    if (priceChanged) {
      existing.revisionHistory.push({
        price: Number(unitPrice),
        changedAt: new Date(),
        changedBy: admin.email,
        note: `Rate updated from ৳${existing.unitPrice} to ৳${unitPrice}`,
      });
    }

    existing.name = name ?? existing.name;
    existing.category = category ?? existing.category;
    existing.unit = unit ?? existing.unit;
    existing.unitPrice = Number(unitPrice);
    existing.location = location ?? existing.location;
    existing.supplierNote = supplierNote ?? existing.supplierNote;
    existing.isActive = isActive !== undefined ? isActive : existing.isActive;
    existing.updatedAt = new Date();

    await existing.save();

    await CEPAudit.create({
      action: "UPDATE_MATERIAL_RATE",
      entityType: "CEPMaterialRate",
      entityId: existing.code,
      details: `Updated ${existing.name} rate to ৳${existing.unitPrice}`,
      performedBy: admin.email,
    });

    return NextResponse.json({ success: true, data: existing });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const admin = await checkAdmin(req);
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

    await dbConnect();
    await CEPMaterialRate.findByIdAndDelete(id);

    return NextResponse.json({ success: true, message: "Material deleted" });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
