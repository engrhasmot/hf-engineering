import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import PlanStatus from "@/models/plan-status.model";
import Payment from "@/models/payment.model";
import Agreement from "@/models/agreement.model";
import Inspection from "@/models/inspection.model";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id || !id.trim()) {
      return NextResponse.json(
        { success: false, verified: false, error: "Missing document reference ID" },
        { status: 400 }
      );
    }

    await dbConnect();
    const docId = decodeURIComponent(id).trim();

    // Escape regex characters for safe exact matching
    const escapedDocId = docId.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const exactRegex = new RegExp(`^${escapedDocId}$`, "i");
    const isObjectId = docId.length === 24 && /^[0-9a-fA-F]{24}$/.test(docId);

    // 1. Check PlanStatus by fileId or _id
    const plan = await PlanStatus.findOne({
      $or: [
        { fileId: exactRegex },
        ...(isObjectId ? [{ _id: docId }] : []),
      ],
    }).lean();

    if (plan) {
      return NextResponse.json({
        success: true,
        verified: true,
        documentType: "Architectural & Structural Engineering Plan",
        documentId: plan.fileId,
        title: plan.projectTitle,
        clientName: plan.clientName,
        location: plan.location,
        issueDate: plan.submissionDate || plan.createdAt,
        status: plan.currentStatus,
        certifiedBy: "Engr. Hasmot Ali",
        designation: "Chief Structural Consultant, Member IEB",
        authority: "HF Design & Engineering Solutions (RAJUK & Pourashava Enlisted)",
      });
    }

    // 2. Check Agreement by agreementNumber or _id
    const agreement = await Agreement.findOne({
      $or: [
        { agreementNumber: exactRegex },
        ...(isObjectId ? [{ _id: docId }] : []),
      ],
    }).lean();

    if (agreement) {
      return NextResponse.json({
        success: true,
        verified: true,
        documentType: "Official Engineering Consultancy Agreement",
        documentId: agreement.agreementNumber,
        title: agreement.projectTitle,
        clientName: agreement.clientName,
        location: agreement.projectLocation,
        issueDate: agreement.createdAt,
        status: agreement.status === "signed" ? "OFFICIALLY SIGNED & EXECUTED" : agreement.status.toUpperCase(),
        certifiedBy: "HF Legal & Technical Directorate",
        designation: "Authorized Signatory",
        authority: "HF Design & Engineering Solutions",
      });
    }

    // 3. Check Inspection by reportNumber or _id
    const inspection = await Inspection.findOne({
      $or: [
        { reportNumber: exactRegex },
        ...(isObjectId ? [{ _id: docId }] : []),
      ],
    }).lean();

    if (inspection) {
      return NextResponse.json({
        success: true,
        verified: true,
        documentType: "Site Quality & Structural Inspection Report",
        documentId: inspection.reportNumber,
        title: inspection.projectTitle,
        clientName: inspection.clientName,
        location: inspection.projectLocation,
        issueDate: inspection.inspectionDate || inspection.createdAt,
        status: "OFFICIALLY INSPECTED",
        certifiedBy: inspection.inspectorName || "Engr. Hasmot Ali",
        designation: "Certified Site & Structural Inspector",
        authority: "HF Design & Engineering Solutions",
      });
    }

    // 4. Check Payment by planFileRef or _id
    const payment = await Payment.findOne({
      $or: [
        { planFileRef: exactRegex },
        ...(isObjectId ? [{ _id: docId }] : []),
      ],
    }).lean();

    if (payment) {
      return NextResponse.json({
        success: true,
        verified: true,
        documentType: "Official Engineering Service Money Receipt & Contract",
        documentId: payment.planFileRef || payment._id.toString(),
        title: payment.projectTitle,
        clientName: payment.clientName,
        serviceType: payment.serviceType,
        totalAmount: payment.totalAmount,
        paidAmount: payment.paidAmount,
        issueDate: payment.createdAt,
        status: payment.status,
        certifiedBy: "HF Accounts & Engineering Authority",
        designation: "Authorized Signatory",
        authority: "HF Design & Engineering Solutions",
      });
    }

    // 5. Check Cost Estimator Pro Estimates (CEPEstimate)
    try {
      const CEPEstimate = (await import("@/models/cost-estimator-pro/cep-estimate.model")).default;
      const estimate = await CEPEstimate.findOne({
        $or: [
          { estimateNumber: exactRegex },
          { shareToken: docId },
          ...(isObjectId ? [{ _id: docId }] : []),
        ],
      }).lean();

      if (estimate) {
        return NextResponse.json({
          success: true,
          verified: true,
          documentType: "Official Building Construction Cost Estimate & BOQ",
          documentId: estimate.estimateNumber,
          title: estimate.projectName,
          clientName: estimate.clientName,
          location: estimate.location,
          issueDate: estimate.createdAt,
          status: estimate.status.toUpperCase(),
          certifiedBy: "Engr. Hasmot Ali",
          designation: "Chief Estimator & Structural Consultant, Member IEB",
          authority: "HF Design & Engineering Solutions",
        });
      }
    } catch {
      // ignore
    }

    // 6. Strict validation: If no matching document was found, DO NOT VERIFY!
    return NextResponse.json(
      {
        success: false,
        verified: false,
        error: "ডকুমেন্ট রেফারেন্স আইডি বা ফাইল নম্বর ডাটাবেজে পাওয়া যায়নি।",
        documentId: docId,
      },
      { status: 404 }
    );
  } catch (error: any) {
    console.error("Verification Error:", error);
    return NextResponse.json(
      { success: false, verified: false, error: error.message || "Failed to verify document" },
      { status: 500 }
    );
  }
}
