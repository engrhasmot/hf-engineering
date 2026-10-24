import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { checkAdmin } from "@/lib/auth-check";
import CEPSettings from "@/models/cost-estimator-pro/cep-settings.model";
import CEPMaterialRate from "@/models/cost-estimator-pro/cep-material-rate.model";
import CEPLabourRate from "@/models/cost-estimator-pro/cep-labour-rate.model";
import CEPLocation from "@/models/cost-estimator-pro/cep-location.model";
import CEPBOQTemplate from "@/models/cost-estimator-pro/cep-boq-template.model";
import CEPProject from "@/models/cost-estimator-pro/cep-project.model";
import CEPEstimate from "@/models/cost-estimator-pro/cep-estimate.model";
import CEPAudit from "@/models/cost-estimator-pro/cep-audit.model";
import CEPFile from "@/models/cost-estimator-pro/cep-file.model";

export async function GET(req: NextRequest) {
  const admin = await checkAdmin(req);
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    await dbConnect();

    const [settings, materials, labour, locations, boqTemplates, projects, estimates] = await Promise.all([
      CEPSettings.find(),
      CEPMaterialRate.find(),
      CEPLabourRate.find(),
      CEPLocation.find(),
      CEPBOQTemplate.find(),
      CEPProject.find(),
      CEPEstimate.find(),
    ]);

    const backupPayload = {
      _module: "CostEstimatorPro",
      _version: "1.0",
      _exportedAt: new Date().toISOString(),
      _exportedBy: admin.email,
      settings,
      materials,
      labour,
      locations,
      boqTemplates,
      projects,
      estimates,
    };

    const jsonStr = JSON.stringify(backupPayload, null, 2);
    const filename = `cost_estimator_pro_backup_${new Date().toISOString().split("T")[0]}.json`;

    await CEPAudit.create({
      action: "BACKUP_EXPORT",
      entityType: "SystemBackup",
      entityId: filename,
      details: `Exported Cost Estimator Pro backup package (${estimates.length} estimates, ${materials.length} materials)`,
      performedBy: admin.email,
    });

    return new Response(jsonStr, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const admin = await checkAdmin(req);
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const backupData = await req.json();

    if (backupData._module !== "CostEstimatorPro") {
      return NextResponse.json({ error: "Invalid backup package: Expected CostEstimatorPro archive." }, { status: 400 });
    }

    await dbConnect();

    let restoredMaterials = 0;
    let restoredLabour = 0;
    let restoredProjects = 0;
    let restoredEstimates = 0;

    // Restore materials with upsert
    if (Array.isArray(backupData.materials)) {
      for (const m of backupData.materials) {
        const { _id, ...rest } = m;
        await CEPMaterialRate.findOneAndUpdate({ code: rest.code }, rest, { upsert: true });
        restoredMaterials++;
      }
    }

    // Restore labour with upsert
    if (Array.isArray(backupData.labour)) {
      for (const l of backupData.labour) {
        const { _id, ...rest } = l;
        await CEPLabourRate.findOneAndUpdate({ code: rest.code }, rest, { upsert: true });
        restoredLabour++;
      }
    }

    // Restore projects with upsert
    if (Array.isArray(backupData.projects)) {
      for (const p of backupData.projects) {
        const { _id, ...rest } = p;
        await CEPProject.findOneAndUpdate({ projectId: rest.projectId }, rest, { upsert: true });
        restoredProjects++;
      }
    }

    // Restore estimates with upsert
    if (Array.isArray(backupData.estimates)) {
      for (const e of backupData.estimates) {
        const { _id, ...rest } = e;
        await CEPEstimate.findOneAndUpdate({ estimateNumber: rest.estimateNumber }, rest, { upsert: true });
        restoredEstimates++;
      }
    }

    await CEPAudit.create({
      action: "RESTORE_DATA",
      entityType: "SystemRestore",
      entityId: `RESTORE-${Date.now()}`,
      details: `Restored ${restoredEstimates} estimates, ${restoredProjects} projects, ${restoredMaterials} materials`,
      performedBy: admin.email,
    });

    return NextResponse.json({
      success: true,
      message: "Cost Estimator Pro data restored successfully",
      stats: { restoredMaterials, restoredLabour, restoredProjects, restoredEstimates },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
