import { NextRequest, NextResponse } from "next/server";
import { checkAdmin } from "@/lib/auth-check";
import { runCalculationTests } from "@/lib/cost-estimator-pro/__tests__/calculation-engine.test";

export async function GET(req: NextRequest) {
  const admin = await checkAdmin(req);
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const testResults = runCalculationTests();
    const allPassed = testResults.every((t) => t.passed);

    return NextResponse.json({
      success: true,
      allPassed,
      totalTests: testResults.length,
      passedTests: testResults.filter((t) => t.passed).length,
      results: testResults,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
