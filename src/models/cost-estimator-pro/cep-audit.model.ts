import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICEPAudit extends Document {
  action: string; // 'CREATE_ESTIMATE', 'UPDATE_RATE', 'REVISE_ESTIMATE', 'ISSUE_ESTIMATE', 'BACKUP_EXPORT', 'RESTORE_DATA', 'EXPORT_PDF', 'EXPORT_EXCEL'
  entityType: string;
  entityId: string;
  details: string;
  performedBy: string;
  createdAt: Date;
}

const CEPAuditSchema = new Schema<ICEPAudit>(
  {
    action: { type: String, required: true },
    entityType: { type: String, required: true },
    entityId: { type: String, required: true },
    details: { type: String, default: "" },
    performedBy: { type: String, default: "admin" },
  },
  { timestamps: true, collection: "cep_audit_logs" }
);

CEPAuditSchema.index({ createdAt: -1 });

export const CEPAudit: Model<ICEPAudit> =
  mongoose.models.CEPAudit || mongoose.model<ICEPAudit>("CEPAudit", CEPAuditSchema);
export default CEPAudit;
