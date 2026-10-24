import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { checkAdmin } from "@/lib/auth-check";
import CEPEstimate from "@/models/cost-estimator-pro/cep-estimate.model";
import CEPProject from "@/models/cost-estimator-pro/cep-project.model";
import CEPMaterialRate from "@/models/cost-estimator-pro/cep-material-rate.model";
import CEPLabourRate from "@/models/cost-estimator-pro/cep-labour-rate.model";
import CEPBOQTemplate from "@/models/cost-estimator-pro/cep-boq-template.model";
import CEPAudit from "@/models/cost-estimator-pro/cep-audit.model";
import { ensureCEPDefaults } from "@/lib/cost-estimator-pro/seed-defaults";

export async function GET(req: NextRequest) {
  const admin = await checkAdmin(req);
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    await dbConnect();
    await ensureCEPDefaults();

    const [
      totalProjects,
      totalEstimates,
      draftEstimates,
      issuedEstimates,
      activeMaterials,
      activeLabour,
      totalTemplates,
      recentEstimates,
      recentProjects,
      recentAudits,
    ] = await Promise.all([
      CEPProject.countDocuments(),
      CEPEstimate.countDocuments(),
      CEPEstimate.countDocuments({ status: "draft" }),
      CEPEstimate.countDocuments({ status: "issued" }),
      CEPMaterialRate.countDocuments({ isActive: true }),
      CEPLabourRate.countDocuments({ isActive: true }),
      CEPBOQTemplate.countDocuments({ isActive: true }),
      CEPEstimate.find().sort({ createdAt: -1 }).limit(5).select("estimateNumber projectName clientName location financials status createdAt revision"),
      CEPProject.find().sort({ updatedAt: -1 }).limit(5),
      CEPAudit.find().sort({ createdAt: -1 }).limit(8),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        summary: {
          totalProjects,
          totalEstimates,
          draftEstimates,
          issuedEstimates,
          activeMaterials,
          activeLabour,
          totalTemplates,
        },
        recentEstimates,
        recentProjects,
        recentAudits,
      },
    });
  } catch (error: any) {
    console.error("Dashboard error:", error);
    return NextResponse.json({ error: error.message || "Server error" }, { status: 500 });
  }
}
