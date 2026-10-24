import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { checkAdmin } from "@/lib/auth-check";
import CEPProject from "@/models/cost-estimator-pro/cep-project.model";
import CEPEstimate from "@/models/cost-estimator-pro/cep-estimate.model";
import CEPAudit from "@/models/cost-estimator-pro/cep-audit.model";

export async function GET(req: NextRequest) {
  const admin = await checkAdmin(req);
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    await dbConnect();
    const projects = await CEPProject.find().sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: projects });
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

    const count = await CEPProject.countDocuments();
    const projectId = body.projectId || `CEP-PRJ-${new Date().getFullYear()}-${String(count + 1).padStart(3, "0")}`;

    const project = await CEPProject.create({
      projectId,
      name: body.name,
      clientName: body.clientName,
      clientPhone: body.clientPhone || "",
      clientEmail: body.clientEmail || "",
      location: body.location || "Dhaka",
      buildingType: body.buildingType || "Residential",
      estimatedFloors: Number(body.estimatedFloors) || 4,
      totalBuiltUpArea: Number(body.totalBuiltUpArea) || 0,
      unitType: body.unitType || "sqft",
      status: body.status || "active",
      notes: body.notes || "",
      createdBy: admin.email,
    });

    await CEPAudit.create({
      action: "CREATE_PROJECT",
      entityType: "CEPProject",
      entityId: project.projectId,
      details: `Created project "${project.name}" for ${project.clientName}`,
      performedBy: admin.email,
    });

    return NextResponse.json({ success: true, data: project });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const admin = await checkAdmin(req);
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    await dbConnect();
    const { _id, ...rest } = await req.json();
    const updated = await CEPProject.findByIdAndUpdate(_id, rest, { new: true });
    return NextResponse.json({ success: true, data: updated });
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
    await dbConnect();
    await CEPProject.findByIdAndDelete(id);
    return NextResponse.json({ success: true, message: "Project deleted" });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
