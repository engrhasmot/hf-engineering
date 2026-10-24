import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import CEPEstimate from "@/models/cost-estimator-pro/cep-estimate.model";
import { generateEstimatePDF } from "@/lib/cost-estimator-pro/pdf-generator";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;
    if (!token) {
      return NextResponse.json({ error: "Missing token" }, { status: 400 });
    }

    await dbConnect();
    const estimate = await CEPEstimate.findOne({ shareToken: token });
    if (!estimate) {
      return NextResponse.json({ error: "Estimate not found" }, { status: 404 });
    }

    const buffer = generateEstimatePDF(estimate);
    const filename = `${estimate.estimateNumber}_Official_Proposal_${estimate.projectName.replace(/\s+/g, "_")}.pdf`;

    return new Response(new Uint8Array(buffer), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Content-Length": buffer.length.toString(),
      },
    });
  } catch (err: any) {
    console.error("Portal PDF Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
