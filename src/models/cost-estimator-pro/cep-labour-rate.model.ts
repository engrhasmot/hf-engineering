import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICEPLabourRate extends Document {
  code: string;
  tradeName: string;
  category: string;
  unit: string; // 'day', 'sft', 'cft', 'point', 'job'
  rate: number; // in BDT
  location: string;
  sourceNote?: string;
  effectiveDate: Date;
  isActive: boolean;
  revisionHistory: {
    rate: number;
    changedAt: Date;
    changedBy?: string;
    note?: string;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const CEPLabourRateSchema = new Schema<ICEPLabourRate>(
  {
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    tradeName: { type: String, required: true, trim: true },
    category: {
      type: String,
      required: true,
      enum: [
        "Head Mason (Rajmistri)",
        "Assistant Mason",
        "Rod Binder (Steel Fixer)",
        "Shuttering Carpenter",
        "Tile & Marble Specialist",
        "Painter",
        "Electrician",
        "Plumber & Pipe Fitter",
        "Excavator & Earthwork Labour",
        "General Construction Helper",
        "Site Supervisor",
        "Other"
      ]
    },
    unit: { type: String, default: "day" },
    rate: { type: Number, required: true, min: 0 },
    location: { type: String, default: "All", trim: true },
    sourceNote: { type: String, default: "" },
    effectiveDate: { type: Date, default: Date.now },
    isActive: { type: Boolean, default: true },
    revisionHistory: [
      {
        rate: { type: Number, required: true },
        changedAt: { type: Date, default: Date.now },
        changedBy: { type: String, default: "admin" },
        note: { type: String, default: "" },
      },
    ],
  },
  { timestamps: true, collection: "cep_labour_rates" }
);

CEPLabourRateSchema.index({ category: 1, location: 1 });

export const CEPLabourRate: Model<ICEPLabourRate> =
  mongoose.models.CEPLabourRate || mongoose.model<ICEPLabourRate>("CEPLabourRate", CEPLabourRateSchema);
export default CEPLabourRate;
