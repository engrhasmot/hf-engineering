import { Suspense } from "react";
import CostEstimatorProWorkspace from "@/components/admin/cost-estimator-pro/CostEstimatorProWorkspace";
import { Loader2 } from "lucide-react";

export const metadata = {
  title: "Labour Rates | Cost Estimator Pro",
  description: "Cost Estimator Pro workspace module.",
};

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-accent" />
          <p className="text-xs text-muted-foreground font-medium">Loading Labour Rates...</p>
        </div>
      }
    >
      <CostEstimatorProWorkspace initialTab="labour" />
    </Suspense>
  );
}
