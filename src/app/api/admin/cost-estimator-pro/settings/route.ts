import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { checkAdmin } from "@/lib/auth-check";
import CEPSettings from "@/models/cost-estimator-pro/cep-settings.model";
import CEPAudit from "@/models/cost-estimator-pro/cep-audit.model";
import { ensureCEPDefaults } from "@/lib/cost-estimator-pro/seed-defaults";

export async function GET(req: NextRequest) {
  const admin = await checkAdmin(req);
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    await dbConnect();
    await ensureCEPDefaults();
    let settings = await CEPSettings.findOne();
    if (!settings) {
      settings = await CEPSettings.create({});
    }
    return NextResponse.json({ success: true, data: settings });
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

    const updated = await CEPSettings.findOneAndUpdate(
      {},
      { ...body, updatedBy: admin.email, updatedAt: new Date() },
      { new: true, upsert: true }
    );

    await CEPAudit.create({
      action: "UPDATE_SETTINGS",
      entityType: "CEPSettings",
      entityId: "CONFIG",
      details: "Updated Cost Estimator Pro settings and margins",
      performedBy: admin.email,
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
