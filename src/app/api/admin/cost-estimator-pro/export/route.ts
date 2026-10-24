import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { checkAdmin } from "@/lib/auth-check";
import CEPEstimate from "@/models/cost-estimator-pro/cep-estimate.model";
import CEPFile from "@/models/cost-estimator-pro/cep-file.model";
import CEPAudit from "@/models/cost-estimator-pro/cep-audit.model";
import { generateEstimatePDF } from "@/lib/cost-estimator-pro/pdf-generator";
import { generateEstimateExcel } from "@/lib/cost-estimator-pro/excel-generator";

export async function GET(req: NextRequest) {
  const admin = await checkAdmin(req);
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { searchParams } = new URL(req.url);
    const estimateId = searchParams.get("estimateId");
    const format = searchParams.get("format") || "pdf"; // 'pdf' | 'excel'

    if (!estimateId) {
      return NextResponse.json({ error: "estimateId parameter is required" }, { status: 400 });
    }

    await dbConnect();
    const estimate = await CEPEstimate.findById(estimateId);
    if (!estimate) {
      return NextResponse.json({ error: "Estimate not found" }, { status: 404 });
    }

    if (format === "excel" || format === "xlsx") {
      const buffer = generateEstimateExcel(estimate);
      const filename = `${estimate.estimateNumber}_BOQ_${estimate.projectName.replace(/\s+/g, "_")}.xlsx`;

      // Save file record
      const fileRecord = await CEPFile.create({
        fileId: `FILE-${Date.now()}`,
        filename,
        fileType: "excel",
        estimateNumber: estimate.estimateNumber,
        projectId: estimate.projectId,
        sizeBytes: buffer.length,
        mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        storagePathOrData: `data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,${buffer.toString("base64")}`,
        createdBy: admin.email,
      });

      estimate.generatedFiles.push({
        fileType: "excel",
        filename,
        fileUrl: `/api/admin/cost-estimator-pro/files?id=${fileRecord.fileId}`,
        sizeBytes: buffer.length,
        createdAt: new Date(),
      });
      await estimate.save();

      await CEPAudit.create({
        action: "EXPORT_EXCEL",
        entityType: "CEPEstimate",
        entityId: estimate.estimateNumber,
        details: `Exported Excel workbook ${filename} (${buffer.length} bytes)`,
        performedBy: admin.email,
      });

      return new Response(new Uint8Array(buffer), {
        status: 200,
        headers: {
          "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          "Content-Disposition": `attachment; filename="${filename}"`,
          "Content-Length": buffer.length.toString(),
        },
      });
    }

    // Default: PDF Generation
    const buffer = generateEstimatePDF(estimate);
    const filename = `${estimate.estimateNumber}_BOQ_${estimate.projectName.replace(/\s+/g, "_")}.pdf`;

    // Save file record
    const fileRecord = await CEPFile.create({
      fileId: `FILE-${Date.now()}`,
      filename,
      fileType: "pdf",
      estimateNumber: estimate.estimateNumber,
      projectId: estimate.projectId,
      sizeBytes: buffer.length,
      mimeType: "application/pdf",
      storagePathOrData: `data:application/pdf;base64,${buffer.toString("base64")}`,
      createdBy: admin.email,
    });

    estimate.generatedFiles.push({
      fileType: "pdf",
      filename,
      fileUrl: `/api/admin/cost-estimator-pro/files?id=${fileRecord.fileId}`,
      sizeBytes: buffer.length,
      createdAt: new Date(),
    });
    await estimate.save();

    await CEPAudit.create({
      action: "EXPORT_PDF",
      entityType: "CEPEstimate",
      entityId: estimate.estimateNumber,
      details: `Generated official PDF ${filename} (${buffer.length} bytes)`,
      performedBy: admin.email,
    });

    return new Response(new Uint8Array(buffer), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Content-Length": buffer.length.toString(),
      },
    });
  } catch (err: any) {
    console.error("Export error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
