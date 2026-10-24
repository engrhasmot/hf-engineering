import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICEPProject extends Document {
  projectId: string; // e.g. "CEP-PRJ-2026-001"
  name: string;
  clientName: string;
  clientPhone?: string;
  clientEmail?: string;
  location: string;
  buildingType: string; // "Residential", "Commercial", "Industrial", "Mixed-use", "Duplex Home"
  estimatedFloors: number;
  totalBuiltUpArea: number; // in sqft
  unitType: "sqft" | "sqm";
  status: "active" | "completed" | "on-hold" | "archived";
  notes?: string;
  estimatesCount: number;
  latestEstimateNumber?: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

const CEPProjectSchema = new Schema<ICEPProject>(
  {
    projectId: { type: String, required: true, unique: true, uppercase: true, trim: true },
    name: { type: String, required: true, trim: true },
    clientName: { type: String, required: true, trim: true },
    clientPhone: { type: String, default: "" },
    clientEmail: { type: String, default: "" },
    location: { type: String, default: "Dhaka", trim: true },
    buildingType: { type: String, default: "Residential" },
    estimatedFloors: { type: Number, default: 4 },
    totalBuiltUpArea: { type: Number, default: 0 },
    unitType: { type: String, enum: ["sqft", "sqm"], default: "sqft" },
    status: { type: String, enum: ["active", "completed", "on-hold", "archived"], default: "active" },
    notes: { type: String, default: "" },
    estimatesCount: { type: Number, default: 0 },
    latestEstimateNumber: { type: String },
    createdBy: { type: String, default: "admin" },
  },
  { timestamps: true, collection: "cep_projects" }
);

CEPProjectSchema.index({ clientPhone: 1 });
CEPProjectSchema.index({ status: 1 });

export const CEPProject: Model<ICEPProject> =
  mongoose.models.CEPProject || mongoose.model<ICEPProject>("CEPProject", CEPProjectSchema);
export default CEPProject;
