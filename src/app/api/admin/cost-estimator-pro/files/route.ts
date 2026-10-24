import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { checkAdmin } from "@/lib/auth-check";
import CEPFile from "@/models/cost-estimator-pro/cep-file.model";

export async function GET(req: NextRequest) {
  const admin = await checkAdmin(req);
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { searchParams } = new URL(req.url);
    const fileId = searchParams.get("id");

    await dbConnect();

    // If ID requested: download/serve file
    if (fileId) {
      const file = await CEPFile.findOne({ fileId });
      if (!file) return NextResponse.json({ error: "File not found" }, { status: 404 });

      if (file.storagePathOrData.startsWith("data:")) {
        const base64Data = file.storagePathOrData.split(",")[1];
        const buffer = Buffer.from(base64Data, "base64");
        return new Response(buffer, {
          headers: {
            "Content-Type": file.mimeType,
            "Content-Disposition": `attachment; filename="${file.filename}"`,
            "Content-Length": buffer.length.toString(),
          },
        });
      }

      return NextResponse.json({ error: "Unsupported file storage" }, { status: 500 });
    }

    // List files
    const files = await CEPFile.find().sort({ createdAt: -1 }).select("-storagePathOrData");
    return NextResponse.json({ success: true, data: files });
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
    await CEPFile.findOneAndDelete({ fileId: id });
    return NextResponse.json({ success: true, message: "File removed" });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
