/**
 * CALCULATION ENGINE AUTOMATED TESTS
 * Tests area conversions, quantities, BOQ aggregation, financial margins, and edge cases.
 */

import { calculateCostEstimatorPro, UnitConverter } from "../calculation-engine";

export function runCalculationTests() {
  const results: { test: string; passed: boolean; details?: string }[] = [];

  // Test 1: Unit Converter
  try {
    const sqft = UnitConverter.sqmToSqft(100);
    const sqm = UnitConverter.sqftToSqm(sqft);
    const passed = Math.abs(sqm - 100) < 0.1;
    results.push({ test: "UnitConverter sqm <-> sqft", passed, details: `100 sqm => ${sqft} sqft => ${sqm} sqm` });
  } catch (err: any) {
    results.push({ test: "UnitConverter sqm <-> sqft", passed: false, details: err.message });
  }

  // Test 2: Standard 4-Storied Residential Building
  try {
    const output = calculateCostEstimatorPro({
      buildingType: "Residential",
      floors: 4,
      unitType: "sqft",
      groundFloorArea: 1500,
      typicalFloorArea: 1500,
      totalBuiltUpArea: 6000,
      foundationType: "Isolated Footing",
    });

    const hasBoq = output.boqItems.length > 5;
    const hasTotal = output.grandTotalCost > 0;
    const mathCheck = output.grandTotalCost > output.subtotalBaseCost; // due to overhead & profit
    const costPerSqFtCheck = output.costPerSqFt > 1500 && output.costPerSqFt < 4500; // standard BD residential benchmark ~1800-3000/sft

    results.push({
      test: "Standard 4-Storied Residential Estimation",
      passed: hasBoq && hasTotal && mathCheck && costPerSqFtCheck,
      details: `Total: ৳${output.grandTotalCost.toLocaleString()}, Cost/SqFt: ৳${output.costPerSqFt}`,
    });
  } catch (err: any) {
    results.push({ test: "Standard 4-Storied Residential Estimation", passed: false, details: err.message });
  }

  // Test 3: Duplex Home with Raft Foundation
  try {
    const output = calculateCostEstimatorPro({
      buildingType: "Duplex Home",
      floors: 2,
      unitType: "sqft",
      groundFloorArea: 2000,
      typicalFloorArea: 2000,
      totalBuiltUpArea: 4000,
      foundationType: "Raft / Mat",
      finishingSpecs: {
        floorFinish: "Imported Homogeneous (24x24)",
        paintQuality: "Luxury Silk",
        electricalStandard: "Premium Modular",
      },
    });

    // Premium duplex + Raft foundation rate is higher than standard residential
    const passed = output.costPerSqFt > 2000 && output.boqItems.length > 0;
    results.push({
      test: "Luxury Duplex with Raft Foundation",
      passed,
      details: `Cost/SqFt: ৳${output.costPerSqFt}, Materials: ৳${output.materialCostTotal.toLocaleString()}, Labour: ৳${output.labourCostTotal.toLocaleString()}`,
    });
  } catch (err: any) {
    results.push({ test: "Luxury Duplex with Raft Foundation", passed: false, details: err.message });
  }

  // Test 4: Financial Margin Verification
  try {
    const output = calculateCostEstimatorPro({
      buildingType: "Residential",
      floors: 1,
      unitType: "sqft",
      groundFloorArea: 1000,
      typicalFloorArea: 1000,
      totalBuiltUpArea: 1000,
      foundationType: "Isolated Footing",
      wastagePct: 5.0,
      overheadPct: 10.0,
      profitPct: 15.0,
      vatTaxPct: 7.5,
    });

    const expectedWastage = Math.round((output.materialCostTotal * 5.0) / 100);
    const passed = output.wastageAmount === expectedWastage && output.grandTotalCost > 0;
    results.push({
      test: "Financial Margins Application",
      passed,
      details: `Wastage: ৳${output.wastageAmount}, Overhead: ৳${output.overheadAmount}, Profit: ৳${output.profitAmount}, VAT: ৳${output.vatTaxAmount}`,
    });
  } catch (err: any) {
    results.push({ test: "Financial Margins Application", passed: false, details: err.message });
  }

  return results;
}


