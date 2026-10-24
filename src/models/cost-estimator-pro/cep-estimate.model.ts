import mongoose, { Schema, Document, Model } from "mongoose";

export interface IEstimatedBOQItem {
  itemCode: string;
  category: string;
  description: string;
  unit: string;
  quantity: number;
  unitRate: number;
  amount: number;
  materialCost: number;
  labourCost: number;
  formulaNote?: string;
}

export interface ICEPEstimate extends Document {
  estimateNumber: string; // e.g. "CEP-EST-2026-001"
  projectId?: string;
  projectName: string;
  clientName: string;
  clientPhone?: string;
  clientEmail?: string;
  location: string;
  revision: number;
  parentEstimateId?: string; // If this is a revised version of an earlier estimate
  status: "draft" | "calculated" | "reviewed" | "issued" | "archived";
  isImmutable: boolean; // Once issued, cannot be edited in place (creates new revision)
  
  // Building & Dimension Inputs
  inputsSnapshot: {
    buildingType: string;
    floors: number;
    unitType: "sqft" | "sqm";
    groundFloorArea: number;
    typicalFloorArea: number;
    totalBuiltUpArea: number;
    floorHeightFt: number;
    floorWiseDetails: {
      floorName: string;
      lengthFt: number;
      widthFt: number;
      areaSqFt: number;
      heightFt: number;
      purpose: string;
    }[];
    foundationType: string; // "Isolated Footing", "Combined Footing", "Raft / Mat", "Deep Pile Foundation"
    structuralSpecs: {
      concreteGrade: string; // e.g. "C20 (2500 psi)", "C25 (3000 psi)"
      rebarGrade: string; // e.g. "500W (72.5 Grade)"
      slabThicknessInch: number;
      soilBearingCapacity?: string;
    };
    finishingSpecs: {
      floorFinish: string; // "Local Tiles (16x16)", "Imported Homogeneous (24x24)", "Mirror Polish"
      paintQuality: string; // "Standard Plastic Emulsion", "Luxury Silk / Weather Coat"
      doorsAndWindows: string; // "Standard Teak Wood & Thai Alum", "Premium Wood & 1.2mm Alum"
      electricalStandard: string; // "BRB / BBS Cable + Standard Fixtures", "Premium Modular"
      plumbingStandard: string; // "Standard PVC + Local Sanitary", "RFL / Haier + Cotta / Stella"
    };
  };

  // Detailed Calculated BOQ Items
  boqItems: IEstimatedBOQItem[];

  // Snapshots of rates used for calculation
  rateSnapshots: {
    materials: { code: string; name: string; unit: string; rate: number }[];
    labour: { code: string; tradeName: string; unit: string; rate: number }[];
  };

  // Financial Breakdown & Margins
  financials: {
    materialCostTotal: number;
    labourCostTotal: number;
    equipmentAndOtherTotal: number;
    subtotalBaseCost: number;
    
    // Percentages applied
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

    grandTotalCost: number; // in BDT
    costPerSqFt: number;
    costPerSqM: number;
    floorWiseCost: { floorName: string; cost: number; costPerSqFt: number }[];
    categoryTotals: { category: string; cost: number; percentage: number }[];
  };

  assumptions: string[];
  exclusions: string[];
  notes?: string;
  validityDate?: Date;
  formulaVersion: string;

  generatedFiles: {
    fileType: "pdf" | "excel";
    filename: string;
    fileUrl: string;
    sizeBytes: number;
    createdAt: Date;
  }[];

  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

const EstimatedBOQItemSchema = new Schema<IEstimatedBOQItem>(
  {
    itemCode: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String, required: true },
    unit: { type: String, required: true },
    quantity: { type: Number, required: true },
    unitRate: { type: Number, required: true },
    amount: { type: Number, required: true },
    materialCost: { type: Number, default: 0 },
    labourCost: { type: Number, default: 0 },
    formulaNote: { type: String, default: "" },
  },
  { _id: false }
);

const CEPEstimateSchema = new Schema<ICEPEstimate>(
  {
    estimateNumber: { type: String, required: true, unique: true, uppercase: true, trim: true },
    projectId: { type: String, default: "" },
    projectName: { type: String, required: true, trim: true },
    clientName: { type: String, required: true, trim: true },
    clientPhone: { type: String, default: "" },
    clientEmail: { type: String, default: "" },
    location: { type: String, default: "Dhaka", trim: true },
    revision: { type: Number, default: 1 },
    parentEstimateId: { type: String, default: "" },
    status: {
      type: String,
      enum: ["draft", "calculated", "reviewed", "issued", "archived"],
      default: "draft",
    },
    isImmutable: { type: Boolean, default: false },

    inputsSnapshot: {
      buildingType: { type: String, default: "Residential" },
      floors: { type: Number, default: 4 },
      unitType: { type: String, enum: ["sqft", "sqm"], default: "sqft" },
      groundFloorArea: { type: Number, default: 0 },
      typicalFloorArea: { type: Number, default: 0 },
      totalBuiltUpArea: { type: Number, default: 0 },
      floorHeightFt: { type: Number, default: 10 },
      floorWiseDetails: [
        {
          floorName: { type: String, required: true },
          lengthFt: { type: Number, default: 0 },
          widthFt: { type: Number, default: 0 },
          areaSqFt: { type: Number, required: true },
          heightFt: { type: Number, default: 10 },
          purpose: { type: String, default: "Residential" },
        },
      ],
      foundationType: { type: String, default: "Isolated Footing" },
      structuralSpecs: {
        concreteGrade: { type: String, default: "C20 (2500 psi)" },
        rebarGrade: { type: String, default: "500W (72.5 Grade)" },
        slabThicknessInch: { type: Number, default: 5 },
        soilBearingCapacity: { type: String, default: "Normal Clay / Silt" },
      },
      finishingSpecs: {
        floorFinish: { type: String, default: "Homogeneous Tiles (24x24)" },
        paintQuality: { type: String, default: "Weather Coat & Plastic Emulsion" },
        doorsAndWindows: { type: String, default: "Standard Solid Wood & Thai Alum" },
        electricalStandard: { type: String, default: "BRB / BBS Cable + Modular" },
        plumbingStandard: { type: String, default: "Standard PVC + Sanitary" },
      },
    },

    boqItems: [EstimatedBOQItemSchema],

    rateSnapshots: {
      materials: [
        {
          code: { type: String },
          name: { type: String },
          unit: { type: String },
          rate: { type: Number },
        },
      ],
      labour: [
        {
          code: { type: String },
          tradeName: { type: String },
          unit: { type: String },
          rate: { type: Number },
        },
      ],
    },

    financials: {
      materialCostTotal: { type: Number, default: 0 },
      labourCostTotal: { type: Number, default: 0 },
      equipmentAndOtherTotal: { type: Number, default: 0 },
      subtotalBaseCost: { type: Number, default: 0 },

      wastagePct: { type: Number, default: 3.0 },
      wastageAmount: { type: Number, default: 0 },
      overheadPct: { type: Number, default: 5.0 },
      overheadAmount: { type: Number, default: 0 },
      contingencyPct: { type: Number, default: 3.0 },
      contingencyAmount: { type: Number, default: 0 },
      profitPct: { type: Number, default: 10.0 },
      profitAmount: { type: Number, default: 0 },

      vatTaxPct: { type: Number, default: 0 },
      vatTaxAmount: { type: Number, default: 0 },
      discountAmount: { type: Number, default: 0 },

      grandTotalCost: { type: Number, default: 0 },
      costPerSqFt: { type: Number, default: 0 },
      costPerSqM: { type: Number, default: 0 },
      floorWiseCost: [
        {
          floorName: { type: String },
          cost: { type: Number },
          costPerSqFt: { type: Number },
        },
      ],
      categoryTotals: [
        {
          category: { type: String },
          cost: { type: Number },
          percentage: { type: Number },
        },
      ],
    },

    assumptions: { type: [String], default: [] },
    exclusions: { type: [String], default: [] },
    notes: { type: String, default: "" },
    validityDate: { type: Date },
    formulaVersion: { type: String, default: "BNBC-2020-v1.0" },

    generatedFiles: [
      {
        fileType: { type: String, enum: ["pdf", "excel"] },
        filename: { type: String },
        fileUrl: { type: String },
        sizeBytes: { type: Number, default: 0 },
        createdAt: { type: Date, default: Date.now },
      },
    ],

    createdBy: { type: String, default: "admin" },
  },
  { timestamps: true, collection: "cep_estimates" }
);

CEPEstimateSchema.index({ projectId: 1 });
CEPEstimateSchema.index({ clientPhone: 1 });
CEPEstimateSchema.index({ status: 1 });

export const CEPEstimate: Model<ICEPEstimate> =
  mongoose.models.CEPEstimate || mongoose.model<ICEPEstimate>("CEPEstimate", CEPEstimateSchema);
export default CEPEstimate;
