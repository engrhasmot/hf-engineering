import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICEPLocation extends Document {
  code: string;
  name: string;
  parentRegion: string;
  costMultiplier: number; // e.g. 1.0, 1.05
  isActive: boolean;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const CEPLocationSchema = new Schema<ICEPLocation>(
  {
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    name: { type: String, required: true, trim: true },
    parentRegion: { type: String, default: "Dhaka Division" },
    costMultiplier: { type: Number, default: 1.0 },
    isActive: { type: Boolean, default: true },
    notes: { type: String, default: "" },
  },
  { timestamps: true, collection: "cep_locations" }
);

export const CEPLocation: Model<ICEPLocation> =
  mongoose.models.CEPLocation || mongoose.model<ICEPLocation>("CEPLocation", CEPLocationSchema);
export default CEPLocation;
