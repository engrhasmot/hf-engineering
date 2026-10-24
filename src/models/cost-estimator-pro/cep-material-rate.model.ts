import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICEPMaterialRate extends Document {
  code: string;
  name: string;
  category: string;
  description?: string;
  unit: string; // 'bag', 'ton', 'kg', 'cft', 'cum', 'piece', 'sft', 'sqm', 'litre'
  unitPrice: number; // in BDT
  location: string; // 'Dhaka', 'Savar', 'Gazipur', 'Narayanganj', 'All'
  supplierNote?: string;
  effectiveDate: Date;
  expiryDate?: Date;
  isActive: boolean;
  revisionHistory: {
    price: number;
    changedAt: Date;
    changedBy?: string;
    note?: string;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const CEPMaterialRateSchema = new Schema<ICEPMaterialRate>(
  {
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    name: { type: String, required: true, trim: true },
    category: { 
      type: String, 
      required: true, 
      enum: [
        "Cement",
        "Reinforcement Steel",
        "Sand",
        "Bricks & Blocks",
        "Aggregates & Stone Chips",
        "Tiles & Stones",
        "Paints & Finishes",
        "Plumbing & Sanitary",
        "Electrical",
        "Doors & Windows",
        "Formwork & Timber",
        "Waterproofing & Chemicals",
        "Miscellaneous"
      ] 
    },
    description: { type: String, default: "" },
    unit: { type: String, required: true, trim: true },
    unitPrice: { type: Number, required: true, min: 0 },
    location: { type: String, default: "All", trim: true },
    supplierNote: { type: String, default: "" },
    effectiveDate: { type: Date, default: Date.now },
    expiryDate: { type: Date },
    isActive: { type: Boolean, default: true },
    revisionHistory: [
      {
        price: { type: Number, required: true },
        changedAt: { type: Date, default: Date.now },
        changedBy: { type: String, default: "admin" },
        note: { type: String, default: "" },
      },
    ],
  },
  { timestamps: true, collection: "cep_material_rates" }
);

CEPMaterialRateSchema.index({ category: 1, location: 1 });
CEPMaterialRateSchema.index({ isActive: 1 });

export const CEPMaterialRate: Model<ICEPMaterialRate> =
  mongoose.models.CEPMaterialRate || mongoose.model<ICEPMaterialRate>("CEPMaterialRate", CEPMaterialRateSchema);
export default CEPMaterialRate;
