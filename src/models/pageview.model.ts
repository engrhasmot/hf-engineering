import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IPageView extends Document {
  path: string;
  referrer?: string;
  userAgent?: string;
  ip?: string;
  timestamp: Date;
  // Extended fields (optional — old documents without these are still valid)
  referrerHost?: string;
  source?: string;
  utmSource?: string;
  country?: string;
  region?: string;
  city?: string;
  device?: string;
  browser?: string;
  os?: string;
}

const PageViewSchema = new Schema<IPageView>(
  {
    path: {
      type: String,
      required: [true, 'Path is required'],
      trim: true,
      index: true,
    },
    referrer: { type: String, trim: true },
    userAgent: { type: String },
    ip: { type: String, index: true },
    timestamp: { type: Date, default: Date.now },
    // Extended optional fields — no defaults so old docs remain valid
    referrerHost: { type: String },
    source:       { type: String },
    utmSource:    { type: String },
    country:      { type: String },
    region:       { type: String },
    city:         { type: String },
    device:       { type: String },
    browser:      { type: String },
    os:           { type: String },
  },
  { timestamps: false }
);

// Automatically expire page views after 60 days to prevent unbounded collection growth.
PageViewSchema.index({ timestamp: 1 }, { expireAfterSeconds: 5184000 });

const PageView: Model<IPageView> =
  mongoose.models.PageView || mongoose.model<IPageView>('PageView', PageViewSchema);

export default PageView;
