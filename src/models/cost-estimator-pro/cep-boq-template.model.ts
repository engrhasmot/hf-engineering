import mongoose, { Schema, Document, Model } from "mongoose";

export interface IBOQWorkItem {
  itemCode: string;
  category: string;
  subCategory?: string;
  description: string;
  unit: string; // 'cft', 'cum', 'sft', 'sqm', 'kg', 'ton', 'rft', 'nos', 'job'
  quantityFormula: string; // e.g. "totalBuiltUpArea * 0.15" or specific parameter
  defaultUnitRate: number; // in BDT
  materialComponents: {
    materialCode: string;
    ratioOrFactor: number; // consumption per unit of work
    unit: string;
  }[];
  labourComponents: {
    tradeCode: string;
    manDaysPerUnit: number;
  }[];
  order: number;
  isActive: boolean;
}

export interface ICEPBOQTemplate extends Document {
  code: string;
  name: string;
  description?: string;
  buildingType: string; // 'Residential', 'Commercial', 'Industrial', 'Mixed-use', 'Duplex', 'All'
  foundationType: string; // 'Isolated Footing', 'Raft / Mat', 'Pile Foundation', 'All'
  items: IBOQWorkItem[];
  isDefault: boolean;
  isActive: boolean;
  version: string;
  createdAt: Date;
  updatedAt: Date;
}

const BOQWorkItemSchema = new Schema<IBOQWorkItem>(
  {
    itemCode: { type: String, required: true },
    category: { type: String, required: true },
    subCategory: { type: String, default: "" },
    description: { type: String, required: true },
    unit: { type: String, required: true },
    quantityFormula: { type: String, default: "" },
    defaultUnitRate: { type: Number, required: true, default: 0 },
    materialComponents: [
      {
        materialCode: { type: String, required: true },
        ratioOrFactor: { type: Number, required: true },
        unit: { type: String, required: true },
      },
    ],
    labourComponents: [
      {
        tradeCode: { type: String, required: true },
        manDaysPerUnit: { type: Number, required: true },
      },
    ],
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { _id: false }
);

const CEPBOQTemplateSchema = new Schema<ICEPBOQTemplate>(
  {
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    buildingType: { type: String, default: "Residential" },
    foundationType: { type: String, default: "Isolated Footing" },
    items: [BOQWorkItemSchema],
    isDefault: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    version: { type: String, default: "1.0" },
  },
  { timestamps: true, collection: "cep_boq_templates" }
);

export const CEPBOQTemplate: Model<ICEPBOQTemplate> =
  mongoose.models.CEPBOQTemplate || mongoose.model<ICEPBOQTemplate>("CEPBOQTemplate", CEPBOQTemplateSchema);
export default CEPBOQTemplate;
