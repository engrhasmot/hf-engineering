import { Suspense } from "react";
import CostEstimatorProWorkspace from "@/components/admin/cost-estimator-pro/CostEstimatorProWorkspace";
import { Loader2 } from "lucide-react";

export const metadata = {
  title: "Cost Estimator Pro & BOQ Studio | HF Admin",
  description: "Independent engineering cost estimation and BOQ management workspace.",
};

export default function CostEstimatorProPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-accent" />
          <p className="text-xs text-muted-foreground font-medium">Loading Cost Estimator Pro Studio...</p>
        </div>
      }
    >
      <CostEstimatorProWorkspace initialTab="dashboard" />
    </Suspense>
  );
}
