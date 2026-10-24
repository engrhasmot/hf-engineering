import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICEPFile extends Document {
  fileId: string;
  filename: string;
  fileType: "pdf" | "excel" | "backup" | "template";
  estimateNumber?: string;
  projectId?: string;
  sizeBytes: number;
  mimeType: string;
  storagePathOrData: string; // Base64 or local relative path or cloud url
  createdAt: Date;
  createdBy: string;
}

const CEPFileSchema = new Schema<ICEPFile>(
  {
    fileId: { type: String, required: true, unique: true },
    filename: { type: String, required: true },
    fileType: { type: String, enum: ["pdf", "excel", "backup", "template"], required: true },
    estimateNumber: { type: String, default: "" },
    projectId: { type: String, default: "" },
    sizeBytes: { type: Number, default: 0 },
    mimeType: { type: String, default: "application/octet-stream" },
    storagePathOrData: { type: String, required: true },
    createdBy: { type: String, default: "admin" },
  },
  { timestamps: true, collection: "cep_files" }
);

export const CEPFile: Model<ICEPFile> =
  mongoose.models.CEPFile || mongoose.model<ICEPFile>("CEPFile", CEPFileSchema);
export default CEPFile;
