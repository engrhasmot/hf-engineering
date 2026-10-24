import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { checkAdmin } from "@/lib/auth-check";
import CEPLabourRate from "@/models/cost-estimator-pro/cep-labour-rate.model";
import CEPAudit from "@/models/cost-estimator-pro/cep-audit.model";
import { ensureCEPDefaults } from "@/lib/cost-estimator-pro/seed-defaults";

export async function GET(req: NextRequest) {
  const admin = await checkAdmin(req);
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    await dbConnect();
    await ensureCEPDefaults();
    const labour = await CEPLabourRate.find().sort({ category: 1, tradeName: 1 });
    return NextResponse.json({ success: true, data: labour });
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

    const existing = await CEPLabourRate.findOne({ code: body.code.toUpperCase() });
    if (existing) {
      return NextResponse.json({ error: "Labour code already exists" }, { status: 400 });
    }

    const labour = await CEPLabourRate.create({
      code: body.code.toUpperCase(),
      tradeName: body.tradeName,
      category: body.category,
      unit: body.unit || "day",
      rate: Number(body.rate),
      location: body.location || "All",
      sourceNote: body.sourceNote || "",
      effectiveDate: body.effectiveDate || new Date(),
      isActive: body.isActive !== undefined ? body.isActive : true,
      revisionHistory: [{ rate: Number(body.rate), changedAt: new Date(), changedBy: admin.email }],
    });

    await CEPAudit.create({
      action: "CREATE_LABOUR_RATE",
      entityType: "CEPLabourRate",
      entityId: labour.code,
      details: `Added ${labour.tradeName} at ৳${labour.rate}/${labour.unit}`,
      performedBy: admin.email,
    });

    return NextResponse.json({ success: true, data: labour });
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
    const { _id, rate, tradeName, category, unit, location, sourceNote, isActive } = body;

    const existing = await CEPLabourRate.findById(_id);
    if (!existing) return NextResponse.json({ error: "Labour trade not found" }, { status: 404 });

    const rateChanged = existing.rate !== Number(rate);
    if (rateChanged) {
      existing.revisionHistory.push({
        rate: Number(rate),
        changedAt: new Date(),
        changedBy: admin.email,
        note: `Rate updated from ৳${existing.rate} to ৳${rate}`,
      });
    }

    existing.tradeName = tradeName ?? existing.tradeName;
    existing.category = category ?? existing.category;
    existing.unit = unit ?? existing.unit;
    existing.rate = Number(rate);
    existing.location = location ?? existing.location;
    existing.sourceNote = sourceNote ?? existing.sourceNote;
    existing.isActive = isActive !== undefined ? isActive : existing.isActive;
    existing.updatedAt = new Date();

    await existing.save();

    await CEPAudit.create({
      action: "UPDATE_LABOUR_RATE",
      entityType: "CEPLabourRate",
      entityId: existing.code,
      details: `Updated ${existing.tradeName} to ৳${existing.rate}`,
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
    await CEPLabourRate.findByIdAndDelete(id);

    return NextResponse.json({ success: true, message: "Labour trade deleted" });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
