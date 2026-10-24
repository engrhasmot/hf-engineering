import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { checkAdmin } from "@/lib/auth-check";
import CEPLocation from "@/models/cost-estimator-pro/cep-location.model";

export async function GET(req: NextRequest) {
  const admin = await checkAdmin(req);
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    await dbConnect();
    const locations = await CEPLocation.find().sort({ name: 1 });
    return NextResponse.json({ success: true, data: locations });
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
    const location = await CEPLocation.create({
      code: body.code.toUpperCase(),
      name: body.name,
      parentRegion: body.parentRegion || "Dhaka Division",
      costMultiplier: Number(body.costMultiplier) || 1.0,
      isActive: body.isActive !== undefined ? body.isActive : true,
      notes: body.notes || "",
    });
    return NextResponse.json({ success: true, data: location });
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
    const updated = await CEPLocation.findByIdAndUpdate(_id, rest, { new: true });
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
    await CEPLocation.findByIdAndDelete(id);
    return NextResponse.json({ success: true, message: "Location deleted" });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
