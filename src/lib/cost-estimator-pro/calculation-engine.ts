/**
 * COST ESTIMATOR PRO — INDEPENDENT CALCULATION ENGINE
 * HF Design & Engineering Solutions
 * 
 * Strict Isolation: Does NOT import or reference any public estimator code.
 * Follows BNBC 2020 & PWD Bangladesh civil engineering standards.
 */

export interface CalculationInput {
  buildingType: string; // 'Residential', 'Commercial', 'Industrial', 'Mixed-use', 'Duplex Home'
  floors: number;
  unitType: "sqft" | "sqm";
  groundFloorArea: number;
  typicalFloorArea: number;
  totalBuiltUpArea: number;
  floorHeightFt?: number;
  floorWiseDetails?: {
    floorName: string;
    areaSqFt: number;
    purpose?: string;
  }[];
  foundationType: string; // 'Isolated Footing', 'Combined Footing', 'Raft / Mat', 'Deep Pile Foundation'
  structuralSpecs?: {
    concreteGrade?: string;
    rebarGrade?: string;
    slabThicknessInch?: number;
  };
  finishingSpecs?: {
    floorFinish?: string;
    paintQuality?: string;
    doorsAndWindows?: string;
    electricalStandard?: string;
    plumbingStandard?: string;
  };
  
  // Custom rate overrides (optional; if not provided, standard defaults are used)
  materialRates?: Record<string, number>;
  labourRates?: Record<string, number>;

  // Financial Margins
  wastagePct?: number;
  overheadPct?: number;
  contingencyPct?: number;
  profitPct?: number;
  vatTaxPct?: number;
  discountAmount?: number;
}

export interface BOQCalculatedItem {
  itemCode: string;
  category: string;
  description: string;
  unit: string;
  quantity: number;
  unitRate: number;
  amount: number;
  materialCost: number;
  labourCost: number;
  formulaNote: string;
}

export interface CalculationOutput {
  totalBuiltUpArea: number;
  unitType: "sqft" | "sqm";
  boqItems: BOQCalculatedItem[];
  materialCostTotal: number;
  labourCostTotal: number;
  equipmentAndOtherTotal: number;
  subtotalBaseCost: number;
  
  wastagePct: number;
  wastageAmount: number;
  overheadPct: number;
  overheadAmount: number;
  contingencyPct: number;
  contingencyAmount: number;
  profitPct: number;
  profitAmount: number;
  
  vatTaxPct: number;
  vatTaxAmount: number;
  discountAmount: number;

  grandTotalCost: number;
  costPerSqFt: number;
  costPerSqM: number;

  categoryTotals: { category: string; cost: number; percentage: number }[];
  floorWiseCost: { floorName: string; cost: number; costPerSqFt: number }[];
  keyQuantities: {
    cementBags: number;
    rebarTons: number;
    sandCft: number;
    bricksCount: number;
    stoneChipsCft: number;
    tilesSqFt: number;
  };
  assumptions: string[];
  exclusions: string[];
  formulaVersion: string;
}

// Unit conversions
export const UnitConverter = {
  sqmToSqft: (sqm: number) => Math.round(sqm * 10.7639 * 100) / 100,
  sqftToSqm: (sqft: number) => Math.round((sqft / 10.7639) * 100) / 100,
  cumToCft: (cum: number) => Math.round(cum * 35.3147 * 100) / 100,
  cftToCum: (cft: number) => Math.round((cft / 35.3147) * 100) / 100,
  tonToKg: (ton: number) => ton * 1000,
  kgToTon: (kg: number) => Math.round((kg / 1000) * 1000) / 1000,
};

// Default benchmark rates in BDT (Bangladesh market)
export const DEFAULT_BENCHMARK_RATES: {
  materials: Record<string, number>;
  labour: Record<string, number>;
} = {
  materials: {
    CEMENT_OPC: 560, // per bag
    CEMENT_PCC: 530, // per bag
    REBAR_500W: 96000, // per ton (৳96/kg)
    SAND_SYLHET: 65, // per cft
    SAND_LOCAL: 32, // per cft
    BRICKS_FIRST_CLASS: 14.5, // per piece
    STONE_CHIPS: 215, // per cft
    TILES_HOMOGENEOUS: 95, // per sft
    TILES_CERAMIC: 68, // per sft
    PAINT_WEATHER_COAT: 480, // per litre
    PAINT_PLASTIC_EMULSION: 340, // per litre
  },
  labour: {
    HEAD_MASON: 1100, // per day
    MASON: 950, // per day
    ROD_BINDER: 950, // per day
    CARPENTER: 1000, // per day
    HELPER: 750, // per day
    ELECTRICIAN: 1000, // per day
    PLUMBER: 1000, // per day
    PAINTER: 900, // per day
  },
};

export function calculateCostEstimatorPro(input: CalculationInput): CalculationOutput {
  // 1. Establish Total Built-Up Area in sqft
  let totalArea = input.totalBuiltUpArea || 0;
  if (totalArea <= 0) {
    if (input.floorWiseDetails && input.floorWiseDetails.length > 0) {
      totalArea = input.floorWiseDetails.reduce((sum, f) => sum + (f.areaSqFt || 0), 0);
    } else {
      const gArea = input.groundFloorArea || 1200;
      const tArea = input.typicalFloorArea || gArea;
      const fl = Math.max(1, input.floors || 1);
      totalArea = gArea + (fl - 1) * tArea;
    }
  }

  if (input.unitType === "sqm") {
    totalArea = UnitConverter.sqmToSqft(totalArea);
  }

  const floors = Math.max(1, input.floors || 1);
  const avgFloorArea = totalArea / floors;

  // Rates resolution
  const mRates = { ...DEFAULT_BENCHMARK_RATES.materials, ...(input.materialRates || {}) };
  const lRates = { ...DEFAULT_BENCHMARK_RATES.labour, ...(input.labourRates || {}) };

  // Building type multiplier
  let buildingMultiplier = 1.0;
  if (input.buildingType === "Commercial") buildingMultiplier = 1.15;
  else if (input.buildingType === "Industrial") buildingMultiplier = 0.95;
  else if (input.buildingType === "Duplex Home") buildingMultiplier = 1.22;
  else if (input.buildingType === "Mixed-use") buildingMultiplier = 1.10;

  // Foundation type multiplier
  let foundationCostFactor = 1.0;
  if (input.foundationType === "Raft / Mat") foundationCostFactor = 1.25;
  else if (input.foundationType === "Deep Pile Foundation") foundationCostFactor = 1.65;
  else if (input.foundationType === "Combined Footing") foundationCostFactor = 1.10;

  // Quality multiplier for finishes
  let finishMultiplier = 1.0;
  if (input.finishingSpecs?.floorFinish?.includes("Imported") || input.finishingSpecs?.floorFinish?.includes("Mirror")) {
    finishMultiplier += 0.08;
  }
  if (input.finishingSpecs?.paintQuality?.includes("Luxury") || input.finishingSpecs?.paintQuality?.includes("Silk")) {
    finishMultiplier += 0.04;
  }
  if (input.finishingSpecs?.electricalStandard?.includes("Premium")) {
    finishMultiplier += 0.05;
  }

  // --- ENGINEERING QUANTITY CALCULATIONS ---
  // Sub-structure Earthwork & Footing
  const excavationCft = Math.round(avgFloorArea * 1.8 * foundationCostFactor);
  const sandFillingCft = Math.round(avgFloorArea * 0.8);
  const solingBricks = Math.round(avgFloorArea * 3.2);

  // Concrete Volumes (RCC)
  // Superstructure RCC: ~0.16 cft of concrete per sqft of built-up area
  // Substructure RCC: ~0.06 cft per sqft
  const subRCCCft = Math.round(totalArea * 0.06 * foundationCostFactor);
  const superRCCCft = Math.round(totalArea * 0.16);
  const totalRCCCft = subRCCCft + superRCCCft;

  // Material splits for RCC (Mix 1:1.5:3, dry factor 1.54)
  // Per 100 cft RCC: ~24 bags cement, ~44 cft Sylhet sand, ~88 cft stone chips
  const cementBagsRCC = Math.round((totalRCCCft / 100) * 24.5);
  const sylhetSandCft = Math.round((totalRCCCft / 100) * 44);
  const stoneChipsCft = Math.round((totalRCCCft / 100) * 88);

  // Reinforcement Steel (Rebar 500W)
  // ~4.2 kg per sqft for residential, adjusted by building type
  const rebarKg = Math.round(totalArea * 4.2 * buildingMultiplier);
  const rebarTons = UnitConverter.kgToTon(rebarKg);

  // Masonry (5" Brick walls)
  // Net wall area ~ 0.95 * total built-up area
  const wallAreaSqFt = Math.round(totalArea * 0.95);
  // ~480 bricks per 100 sqft of 5" wall
  const wallBricksCount = Math.round((wallAreaSqFt / 100) * 480);
  const masonryCementBags = Math.round((wallAreaSqFt / 100) * 1.25);
  const masonryLocalSandCft = Math.round((wallAreaSqFt / 100) * 6.5);

  // Plaster Work (Walls & Ceilings)
  // Area = ~2.2 times floor area
  const plasterAreaSqFt = Math.round(totalArea * 2.2);
  const plasterCementBags = Math.round((plasterAreaSqFt / 100) * 0.7);
  const plasterLocalSandCft = Math.round((plasterAreaSqFt / 100) * 2.8);

  // Total Cement, Sand, Bricks
  const totalCementBags = cementBagsRCC + masonryCementBags + plasterCementBags;
  const totalSandCft = sylhetSandCft + masonryLocalSandCft + plasterLocalSandCft;
  const totalBricksCount = solingBricks + wallBricksCount;
  const tilesSqFt = Math.round(totalArea * 0.88 * 1.05); // with 5% cutting wastage

  // --- BOQ LINE ITEMS GENERATION ---
  const boqItems: BOQCalculatedItem[] = [
    // 1. Earthwork
    {
      itemCode: "EW-001",
      category: "Site & Earthwork",
      description: "Earth excavation in foundation trenches including stacking and backfilling",
      unit: "cft",
      quantity: excavationCft,
      unitRate: 14.5,
      amount: Math.round(excavationCft * 14.5),
      materialCost: 0,
      labourCost: Math.round(excavationCft * 14.5),
      formulaNote: "Based on foundation depth and footprint area",
    },
    {
      itemCode: "EW-002",
      category: "Site & Earthwork",
      description: "Local sand filling in foundation trenches and ground floor plinth",
      unit: "cft",
      quantity: sandFillingCft,
      unitRate: 42,
      amount: Math.round(sandFillingCft * 42),
      materialCost: Math.round(sandFillingCft * 32),
      labourCost: Math.round(sandFillingCft * 10),
      formulaNote: "Plinth height and base compaction volume",
    },
    {
      itemCode: "EW-003",
      category: "Site & Earthwork",
      description: "Single layer brick flat soling (BFS) with first class pick bricks",
      unit: "sft",
      quantity: Math.round(avgFloorArea * 1.1),
      unitRate: 58,
      amount: Math.round(avgFloorArea * 1.1 * 58),
      materialCost: Math.round(avgFloorArea * 1.1 * 44),
      labourCost: Math.round(avgFloorArea * 1.1 * 14),
      formulaNote: "Sub-base protection layer",
    },

    // 2. RCC Works
    {
      itemCode: "RCC-001",
      category: "Substructure RCC",
      description: "Reinforced cement concrete (1:1.5:3) in footings, pile caps and short columns",
      unit: "cft",
      quantity: subRCCCft,
      unitRate: 360,
      amount: Math.round(subRCCCft * 360),
      materialCost: Math.round(subRCCCft * 270),
      labourCost: Math.round(subRCCCft * 90),
      formulaNote: "Concrete volume with 19mm down stone chips & OPC cement",
    },
    {
      itemCode: "RCC-002",
      category: "Superstructure RCC",
      description: "RCC (1:1.5:3) in columns, floor beams, lintels and 5-inch thick roof slabs",
      unit: "cft",
      quantity: superRCCCft,
      unitRate: 385,
      amount: Math.round(superRCCCft * 385),
      materialCost: Math.round(superRCCCft * 280),
      labourCost: Math.round(superRCCCft * 105),
      formulaNote: "Includes mechanical hoisting, vibrator compaction and 21-day curing",
    },
    {
      itemCode: "STL-001",
      category: "Reinforcement Steel",
      description: "500W / 72.5 Grade high-yield deformed rebar bending, binding and placement",
      unit: "ton",
      quantity: rebarTons,
      unitRate: mRates.REBAR_500W + 8500, // Material + Labour binding per ton
      amount: Math.round(rebarTons * (mRates.REBAR_500W + 8500)),
      materialCost: Math.round(rebarTons * mRates.REBAR_500W),
      labourCost: Math.round(rebarTons * 8500),
      formulaNote: "Calculated at ~4.2 kg/sft per structural engineering norms",
    },
    {
      itemCode: "FRM-001",
      category: "Superstructure RCC",
      description: "Heavy duty steel & marine plywood shuttering / formwork for slab & beam",
      unit: "sft",
      quantity: Math.round(totalArea * 1.45),
      unitRate: 75,
      amount: Math.round(totalArea * 1.45 * 75),
      materialCost: Math.round(totalArea * 1.45 * 30),
      labourCost: Math.round(totalArea * 1.45 * 45),
      formulaNote: "Formwork surface area for soffit, sides and column faces",
    },

    // 3. Masonry
    {
      itemCode: "MAS-001",
      category: "Masonry & Plaster",
      description: "125mm (5-inch) thick brick wall masonry in cement mortar (1:4)",
      unit: "sft",
      quantity: wallAreaSqFt,
      unitRate: 122,
      amount: Math.round(wallAreaSqFt * 122),
      materialCost: Math.round(wallAreaSqFt * 86),
      labourCost: Math.round(wallAreaSqFt * 36),
      formulaNote: "1st class auto bricks with coarse sand cement mortar",
    },
    {
      itemCode: "PLS-001",
      category: "Masonry & Plaster",
      description: "12mm to 18mm cement plaster (1:4) on internal and external brick walls & ceiling",
      unit: "sft",
      quantity: plasterAreaSqFt,
      unitRate: 46,
      amount: Math.round(plasterAreaSqFt * 46),
      materialCost: Math.round(plasterAreaSqFt * 26),
      labourCost: Math.round(plasterAreaSqFt * 20),
      formulaNote: "Smooth sponge finish plaster with curing",
    },

    // 4. Finishes
    {
      itemCode: "FIN-001",
      category: "Floor & Wall Finishes",
      description: "Homogeneous glazed vitrified floor tiles (24\"x24\") with 4\" skirting",
      unit: "sft",
      quantity: tilesSqFt,
      unitRate: Math.round(145 * finishMultiplier),
      amount: Math.round(tilesSqFt * 145 * finishMultiplier),
      materialCost: Math.round(tilesSqFt * 105 * finishMultiplier),
      labourCost: Math.round(tilesSqFt * 40),
      formulaNote: "Flooring net area with joint sealant & adhesive",
    },
    {
      itemCode: "PNT-001",
      category: "Painting & Waterproofing",
      description: "Internal smooth putty & plastic emulsion paint + External weather coat",
      unit: "sft",
      quantity: plasterAreaSqFt,
      unitRate: Math.round(38 * finishMultiplier),
      amount: Math.round(plasterAreaSqFt * 38 * finishMultiplier),
      materialCost: Math.round(plasterAreaSqFt * 24 * finishMultiplier),
      labourCost: Math.round(plasterAreaSqFt * 14),
      formulaNote: "1 coat primer, 2 coats putty, 2 coats top finish",
    },

    // 5. MEP Services
    {
      itemCode: "ELE-001",
      category: "Electrical & Plumbing",
      description: "Concealed electrical conduit, BRB/BBS copper wiring, DB, switch & fixtures",
      unit: "sft",
      quantity: Math.round(totalArea),
      unitRate: Math.round(115 * finishMultiplier),
      amount: Math.round(totalArea * 115 * finishMultiplier),
      materialCost: Math.round(totalArea * 80 * finishMultiplier),
      labourCost: Math.round(totalArea * 35),
      formulaNote: "Complete concealed electrical installation per sqft",
    },
    {
      itemCode: "PLM-001",
      category: "Electrical & Plumbing",
      description: "Sanitary plumbing, UPVC drainage, CPVC hot/cold lines & standard fixtures",
      unit: "sft",
      quantity: Math.round(totalArea),
      unitRate: Math.round(105 * finishMultiplier),
      amount: Math.round(totalArea * 105 * finishMultiplier),
      materialCost: Math.round(totalArea * 72 * finishMultiplier),
      labourCost: Math.round(totalArea * 33),
      formulaNote: "Per sqft allowance for bathroom, kitchen & pipe ducts",
    },
    {
      itemCode: "WND-001",
      category: "Doors, Windows & External",
      description: "Solid wood door frames, flush door shutters & 1.2mm Thai aluminum sliding windows",
      unit: "sft",
      quantity: Math.round(totalArea),
      unitRate: Math.round(130 * finishMultiplier),
      amount: Math.round(totalArea * 130 * finishMultiplier),
      materialCost: Math.round(totalArea * 100 * finishMultiplier),
      labourCost: Math.round(totalArea * 30),
      formulaNote: "Complete door/window openings per unit area",
    },
    {
      itemCode: "EXT-001",
      category: "Doors, Windows & External",
      description: "Underground water reservoir (RCC), rooftop tank, septic tank & soak well",
      unit: "job",
      quantity: 1,
      unitRate: Math.round(280000 * (floors / 4) * buildingMultiplier),
      amount: Math.round(280000 * (floors / 4) * buildingMultiplier),
      materialCost: Math.round(195000 * (floors / 4) * buildingMultiplier),
      labourCost: Math.round(85000 * (floors / 4) * buildingMultiplier),
      formulaNote: "Water storage capacity based on floor occupant load",
    },
  ];

  // Aggregating Totals
  const subtotalBaseCost = boqItems.reduce((sum, item) => sum + item.amount, 0);
  const materialCostTotal = boqItems.reduce((sum, item) => sum + item.materialCost, 0);
  const labourCostTotal = boqItems.reduce((sum, item) => sum + item.labourCost, 0);
  const equipmentAndOtherTotal = Math.max(0, subtotalBaseCost - materialCostTotal - labourCostTotal);

  // Financial Margins
  const wastagePct = input.wastagePct ?? 3.0;
  const wastageAmount = Math.round((materialCostTotal * wastagePct) / 100);

  const overheadPct = input.overheadPct ?? 5.0;
  const overheadAmount = Math.round((subtotalBaseCost * overheadPct) / 100);

  const contingencyPct = input.contingencyPct ?? 3.0;
  const contingencyAmount = Math.round((subtotalBaseCost * contingencyPct) / 100);

  const profitPct = input.profitPct ?? 10.0;
  const profitBase = subtotalBaseCost + wastageAmount + overheadAmount + contingencyAmount;
  const profitAmount = Math.round((profitBase * profitPct) / 100);

  const vatTaxPct = input.vatTaxPct ?? 0;
  const preTax = profitBase + profitAmount;
  const vatTaxAmount = Math.round((preTax * vatTaxPct) / 100);
  const discountAmount = Math.max(0, input.discountAmount ?? 0);

  const grandTotalCost = preTax + vatTaxAmount - discountAmount;
  const costPerSqFt = Math.round(grandTotalCost / totalArea);
  const costPerSqM = UnitConverter.sqmToSqft(costPerSqFt);

  // Category Totals
  const categoryMap: Record<string, number> = {};
  boqItems.forEach((item) => {
    categoryMap[item.category] = (categoryMap[item.category] || 0) + item.amount;
  });

  const categoryTotals = Object.entries(categoryMap).map(([category, cost]) => ({
    category,
    cost,
    percentage: Math.round((cost / subtotalBaseCost) * 1000) / 10,
  }));

  // Floor-wise Cost Distribution
  const floorWiseCost = (input.floorWiseDetails && input.floorWiseDetails.length > 0)
    ? input.floorWiseDetails.map((f, i) => {
        // Foundation & Ground floor usually take slightly higher share
        const weight = i === 0 ? 1.15 : 1.0;
        const totalWeight = input.floorWiseDetails!.reduce((acc, _, idx) => acc + (idx === 0 ? 1.15 : 1.0), 0);
        const fCost = Math.round((grandTotalCost * weight) / totalWeight);
        return {
          floorName: f.floorName,
          cost: fCost,
          costPerSqFt: Math.round(fCost / (f.areaSqFt || avgFloorArea)),
        };
      })
    : Array.from({ length: floors }, (_, idx) => {
        const fName = idx === 0 ? "Ground Floor" : `Floor ${idx + 1}`;
        const fCost = Math.round(grandTotalCost / floors);
        return {
          floorName: fName,
          cost: fCost,
          costPerSqFt: Math.round(fCost / avgFloorArea),
        };
      });

  return {
    totalBuiltUpArea: totalArea,
    unitType: input.unitType || "sqft",
    boqItems,
    materialCostTotal,
    labourCostTotal,
    equipmentAndOtherTotal,
    subtotalBaseCost,
    wastagePct,
    wastageAmount,
    overheadPct,
    overheadAmount,
    contingencyPct,
    contingencyAmount,
    profitPct,
    profitAmount,
    vatTaxPct,
    vatTaxAmount,
    discountAmount,
    grandTotalCost,
    costPerSqFt,
    costPerSqM,
    categoryTotals,
    floorWiseCost,
    keyQuantities: {
      cementBags: totalCementBags,
      rebarTons,
      sandCft: totalSandCft,
      bricksCount: totalBricksCount,
      stoneChipsCft,
      tilesSqFt,
    },
    assumptions: [
      `Structural calculations are preliminary engineering estimates adhering to BNBC 2020 standards for ${input.buildingType} classification.`,
      `Foundation calculation assumes ${input.foundationType} with average soil bearing capacity of 1.5 tsf.`,
      "Material unit rates are benchmarked to current market procurement rates in Bangladesh.",
      "Electricity and water supply for construction site are assumed to be provided by the client.",
      "Architectural and working drawings approval fees by statutory municipal authorities are excluded.",
    ],
    exclusions: [
      "Land purchase and demarcation survey expenses.",
      "Municipal and statutory plan approval government fees / taxes.",
      "Deep tubewell installation, substation transformer and solar panel installation.",
      "Interior loose furniture, chandeliers, and decorative drapery.",
    ],
    formulaVersion: "BNBC-2020-v1.0",
  };
}
