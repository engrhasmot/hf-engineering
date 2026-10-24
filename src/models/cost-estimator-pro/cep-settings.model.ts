import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICEPSettings extends Document {
  moduleTitle: string;
  defaultCurrency: string;
  defaultUnits: "sqft" | "sqm";
  defaultLocation: string;
  estimatePrefix: string;
  defaultValidityDays: number;
  
  // Calculation Margins
  defaultWastagePct: number;
  defaultOverheadPct: number;
  defaultContingencyPct: number;
  defaultProfitPct: number;
  roundingDecimals: number;
  formulaVersion: string;

  // Report & Company Branding
  companyName: string;
  companyTagline: string;
  companyPhone: string;
  companyEmail: string;
  companyAddress: string;
  disclaimer: string;
  headerLogoUrl?: string;

  updatedAt: Date;
  updatedBy?: string;
}

const CEPSettingsSchema = new Schema<ICEPSettings>(
  {
    moduleTitle: { type: String, default: "Cost Estimator Pro & BOQ Engine" },
    defaultCurrency: { type: String, default: "BDT (৳)" },
    defaultUnits: { type: String, enum: ["sqft", "sqm"], default: "sqft" },
    defaultLocation: { type: String, default: "Dhaka" },
    estimatePrefix: { type: String, default: "CEP-EST" },
    defaultValidityDays: { type: Number, default: 30 },

    defaultWastagePct: { type: Number, default: 3.0 },
    defaultOverheadPct: { type: Number, default: 5.0 },
    defaultContingencyPct: { type: Number, default: 3.0 },
    defaultProfitPct: { type: Number, default: 10.0 },
    roundingDecimals: { type: Number, default: 2 },
    formulaVersion: { type: String, default: "BNBC-2020-v1.0" },

    companyName: { type: String, default: "HF Design & Engineering Solutions" },
    companyTagline: { type: String, default: "Civil Engineering, Architecture & Structural Consultancy" },
    companyPhone: { type: String, default: "+880 1778-506500" },
    companyEmail: { type: String, default: "contact@hf-engineering.com" },
    companyAddress: { type: String, default: "Aysha Monjil, House 14/05, Ward 01, Noyabari, Savar Radio Colony, Dhaka" },
    disclaimer: { 
      type: String, 
      default: "This document is a professional engineering Bill of Quantities (BOQ) and cost estimation prepared by HF Design & Engineering Solutions. Actual construction expenditure may fluctuate based on real-time market material variations, soil geotechnical discoveries, and client-requested architectural alterations." 
    },
    headerLogoUrl: { type: String, default: "/images/logo.png" },
    updatedBy: { type: String, default: "admin" },
  },
  { timestamps: true, collection: "cep_settings" }
);

export const CEPSettings: Model<ICEPSettings> =
  mongoose.models.CEPSettings || mongoose.model<ICEPSettings>("CEPSettings", CEPSettingsSchema);
export default CEPSettings;
