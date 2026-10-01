import mongoose, { Schema, Document, Model } from "mongoose";

export interface IBlueprintBOQ extends Document {
  estimateNo: string;
  clientName: string;
  clientPhone: string;
  blueprintUrl: string;
  buildingType: "residential" | "commercial" | "industrial";
  floors: number;
  aiAnalysis: {
    detectedRooms: string[];
    estimatedAreaPerFloor: number;
    totalArea: number;
    wallLength: number;
    columnCount: number;
    openingPercentage: number;
    aiNotes: string;
    confidence: "high" | "medium" | "low";
  };
  boq: {
    quantities: {
      rod: {
        kg: number;
        ton: number;
        breakdown: { label: string; kg: number; ton: number }[];
      };
      cement: { total: number; casting: number; masonry: number };
      coarseSand: { cft: number };
      fineSand: { cft: number };
      aggregate: { cft: number };
      brick: { pcs: number };
    };
    costs: {
      rod: number;
      cement: number;
      coarseSand: number;
      fineSand: number;
      aggregate: number;
      brick: number;
      totalMaterial: number;
      minTotal: number;
      maxTotal: number;
      perSqft: number;
    };
    bnbcRef: string;
  };
  marketRates: Record<string, any>;
  status: "processing" | "completed" | "failed";
  adminNote?: string;
  createdAt: Date;
  updatedAt: Date;
}

const BlueprintBOQSchema = new Schema<IBlueprintBOQ>(
  {
    estimateNo: { type: String, required: true, unique: true, index: true },
    clientName: { type: String, required: true, trim: true },
    clientPhone: { type: String, required: true, trim: true },
    blueprintUrl: { type: String, required: true },
    buildingType: {
      type: String,
      enum: ["residential", "commercial", "industrial"],
      default: "residential",
    },
    floors: { type: Number, required: true, min: 1, max: 30 },
    aiAnalysis: {
      detectedRooms: [String],
      estimatedAreaPerFloor: Number,
      totalArea: Number,
      wallLength: Number,
      columnCount: Number,
      openingPercentage: Number,
      aiNotes: String,
      confidence: { type: String, enum: ["high", "medium", "low"], default: "medium" },
    },
    boq: {
      quantities: {
        rod: {
          kg: Number,
          ton: Number,
          breakdown: [{ label: String, kg: Number, ton: Number }],
        },
        cement: { total: Number, casting: Number, masonry: Number },
        coarseSand: { cft: Number },
        fineSand: { cft: Number },
        aggregate: { cft: Number },
        brick: { pcs: Number },
      },
      costs: {
        rod: Number,
        cement: Number,
        coarseSand: Number,
        fineSand: Number,
        aggregate: Number,
        brick: Number,
        totalMaterial: Number,
        minTotal: Number,
        maxTotal: Number,
        perSqft: Number,
      },
      bnbcRef: { type: String, default: "BNBC 2020 + RAJUK Building Rules 2023" },
    },
    marketRates: { type: Schema.Types.Mixed },
    status: {
      type: String,
      enum: ["processing", "completed", "failed"],
      default: "processing",
    },
    adminNote: String,
  },
  { timestamps: true }
);

const BlueprintBOQ: Model<IBlueprintBOQ> =
  mongoose.models.BlueprintBOQ ||
  mongoose.model<IBlueprintBOQ>("BlueprintBOQ", BlueprintBOQSchema);

export default BlueprintBOQ;
