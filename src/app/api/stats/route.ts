import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Project from "@/models/project.model";
import PlanStatus from "@/models/plan-status.model";
import ClientUser from "@/models/client-user.model";
import CEPProject from "@/models/cost-estimator-pro/cep-project.model";
import CEPEstimate from "@/models/cost-estimator-pro/cep-estimate.model";
import MaterialEstimate from "@/models/material-estimate.model";
import WorkOrder from "@/models/work-order.model";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await dbConnect();

    // 1. Projects Completed:
    // Real completed / published projects from Database
    const [
      publishedProjects,
      approvedPlans,
      completedWorkOrders,
      completedCepProjects,
      totalProjects,
      cepProjectsCount,
      totalEstimatesCEP,
      totalEstimatesMaterial,
      totalClientUsers,
      planStatusClients,
    ] = await Promise.all([
      Project.countDocuments({ status: { $in: ["published", "completed"] } }),
      PlanStatus.countDocuments({ currentStatus: "approved" }),
      WorkOrder.countDocuments({ status: "completed" }),
      CEPProject.countDocuments({ status: "completed" }),
      Project.countDocuments(),
      CEPProject.countDocuments(),
      CEPEstimate.countDocuments(),
      MaterialEstimate.countDocuments(),
      ClientUser.countDocuments(),
      PlanStatus.distinct("phone"),
    ]);

    // Real Completed Projects
    const projectsCompleted = Math.max(
      publishedProjects + approvedPlans + completedWorkOrders + completedCepProjects,
      publishedProjects
    );

    // Real Happy Clients = Total count from Projects + Estimates + Clients
    const projectTotal = totalProjects + cepProjectsCount;
    const estimatesTotal = totalEstimatesCEP + totalEstimatesMaterial;
    const clientsTotal = totalClientUsers + planStatusClients.length;
    const happyClients = projectTotal + estimatesTotal + clientsTotal;

    return NextResponse.json({
      success: true,
      stats: {
        happyClients,
        projectsCompleted,
        yearsExperience: 10,
        clientSatisfaction: 100,
        breakdown: {
          projects: projectTotal,
          estimates: estimatesTotal,
          clients: clientsTotal,
        },
      },
    });
  } catch (error: any) {
    console.error("Stats API error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error?.message || "Failed to fetch stats",
        stats: {
          happyClients: 0,
          projectsCompleted: 0,
          yearsExperience: 10,
          clientSatisfaction: 100,
        },
      },
      { status: 500 }
    );
  }
}
