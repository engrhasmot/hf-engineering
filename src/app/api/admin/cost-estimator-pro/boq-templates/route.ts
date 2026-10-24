import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { checkAdmin } from "@/lib/auth-check";
import CEPBOQTemplate from "@/models/cost-estimator-pro/cep-boq-template.model";

export async function GET(req: NextRequest) {
  const admin = await checkAdmin(req);
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    await dbConnect();
    const templates = await CEPBOQTemplate.find().sort({ isDefault: -1, name: 1 });
    return NextResponse.json({ success: true, data: templates });
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
    const template = await CEPBOQTemplate.create({
      code: body.code.toUpperCase(),
      name: body.name,
      description: body.description || "",
      buildingType: body.buildingType || "Residential",
      foundationType: body.foundationType || "Isolated Footing",
      items: body.items || [],
      isDefault: !!body.isDefault,
      isActive: body.isActive !== undefined ? body.isActive : true,
      version: body.version || "1.0",
    });
    return NextResponse.json({ success: true, data: template });
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
    const updated = await CEPBOQTemplate.findByIdAndUpdate(_id, rest, { new: true });
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
    await CEPBOQTemplate.findByIdAndDelete(id);
    return NextResponse.json({ success: true, message: "Template deleted" });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
