"use client";

import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Loader2,
  Upload,
  FileImage,
  X,
  Sparkles,
  Building2,
  HardHat,
  Factory,
  ChevronDown,
  ChevronUp,
  Download,
  CheckCircle2,
  AlertCircle,
  LayoutGrid,
  Layers,
  Ruler,
  FlaskConical,
  Hammer,
  Boxes,
  PhoneCall,
  RefreshCcw,
  Shield,
  Info,
} from "lucide-react";
import WhatsAppIcon from "@/components/shared/WhatsAppIcon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { SITE_CONFIG } from "@/lib/constants";

// ─── Types ───────────────────────────────────────────────────────────────────
type BuildingType = "residential" | "commercial" | "industrial";
type ConfidenceLevel = "high" | "medium" | "low";

interface RodBreakdown {
  label: string;
  kg: number;
  ton: number;
}

interface BOQResult {
  estimateNo: string;
  blueprintUrl: string;
  aiAnalysis: {
    detectedRooms: string[];
    estimatedAreaPerFloor: number;
    totalArea: number;
    wallLength: number;
    columnCount: number;
    openingPercentage: number;
    notes: string;
    confidence: ConfidenceLevel;
  };
  boq: {
    quantities: {
      rod: { kg: number; ton: number; breakdown: RodBreakdown[] };
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
    rates: Record<string, { unit: string; ratePerKg?: number; ratePerBag?: number; ratePerCft?: number; ratePerPcs?: number; desc: string }>;
    bnbcRef: string;
  };
}

// ─── Config ──────────────────────────────────────────────────────────────────
const BUILDING_TYPES: { key: BuildingType; label: string; labelBn: string; icon: React.ReactNode; desc: string }[] = [
  {
    key: "residential",
    label: "Residential",
    labelBn: "আবাসিক",
    icon: <Building2 className="w-6 h-6" />,
    desc: "বাড়ি, ফ্ল্যাট, অ্যাপার্টমেন্ট",
  },
  {
    key: "commercial",
    label: "Commercial",
    labelBn: "বাণিজ্যিক",
    icon: <HardHat className="w-6 h-6" />,
    desc: "দোকান, শপিংমল, অফিস",
  },
  {
    key: "industrial",
    label: "Industrial",
    labelBn: "শিল্প/কারখানা",
    icon: <Factory className="w-6 h-6" />,
    desc: "কারখানা, গুদামঘর",
  },
];

const CONFIDENCE_CONFIG: Record<ConfidenceLevel, { label: string; color: string; icon: React.ReactNode }> = {
  high: { label: "উচ্চ নির্ভুলতা", color: "text-green-500", icon: <CheckCircle2 className="w-4 h-4" /> },
  medium: { label: "মধ্যম নির্ভুলতা", color: "text-yellow-500", icon: <AlertCircle className="w-4 h-4" /> },
  low: { label: "প্রাথমিক অনুমান", color: "text-orange-500", icon: <AlertCircle className="w-4 h-4" /> },
};

// ─── Helpers ─────────────────────────────────────────────────────────────────
function formatBDT(value: number): string {
  if (value >= 10_000_000) return `৳${(value / 10_000_000).toFixed(2)} কোটি`;
  if (value >= 100_000) return `৳${(value / 100_000).toFixed(2)} লক্ষ`;
  return `৳${value.toLocaleString("en-BD")}`;
}

function formatNum(n: number): string {
  return n.toLocaleString("en-BD");
}

// ─── Upload Zone ──────────────────────────────────────────────────────────────
function UploadZone({
  file,
  preview,
  onFile,
  onClear,
}: {
  file: File | null;
  preview: string | null;
  onFile: (f: File) => void;
  onClear: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      const dropped = e.dataTransfer.files[0];
      if (dropped && (dropped.type.startsWith("image/") || dropped.type === "application/pdf")) {
        onFile(dropped);
      } else {
        toast.error("শুধুমাত্র Image (JPG/PNG) বা PDF ফাইল আপলোড করুন।");
      }
    },
    [onFile]
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) onFile(f);
  };

  if (file && preview) {
    return (
      <div className="relative rounded-2xl overflow-hidden border-2 border-accent/50 bg-accent/5">
        <img src={preview} alt="Blueprint preview" className="w-full max-h-72 object-contain py-4 px-4" />
        <div className="absolute top-3 right-3 flex gap-2">
          <button
            type="button"
            onClick={onClear}
            className="w-8 h-8 rounded-full bg-destructive text-white flex items-center justify-center hover:bg-destructive/80 transition-colors shadow-lg"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="bg-accent/10 px-4 py-2 flex items-center gap-2 text-sm text-muted-foreground border-t border-accent/20">
          <FileImage className="w-4 h-4 text-accent" />
          <span className="font-medium text-foreground truncate max-w-xs">{file.name}</span>
          <span className="ml-auto">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`relative rounded-2xl border-2 border-dashed transition-all duration-200 cursor-pointer min-h-52 flex flex-col items-center justify-center gap-4 p-8 ${
        dragging
          ? "border-accent bg-accent/10 scale-[1.02]"
          : "border-border bg-secondary/30 hover:border-accent/60 hover:bg-accent/5"
      }`}
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*,application/pdf"
        className="hidden"
        onChange={handleFileChange}
      />
      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-colors ${dragging ? "bg-accent text-primary-foreground" : "bg-accent/10 text-accent"}`}>
        <Upload className="w-8 h-8" />
      </div>
      <div className="text-center">
        <p className="font-bold text-lg text-foreground">ফ্লোর প্ল্যান আপলোড করুন</p>
        <p className="text-sm text-muted-foreground mt-1">ড্র্যাগ করুন অথবা ক্লিক করে বেছে নিন</p>
        <p className="text-xs text-muted-foreground/70 mt-2">সাপোর্টেড ফরম্যাট: JPG, PNG, PDF • সর্বোচ্চ ১০ MB</p>
      </div>
      <div className="flex flex-wrap justify-center gap-2">
        {["2D Floor Plan", "Architectural Drawing", "AutoCAD Export", "Hand Sketch"].map((tag) => (
          <span key={tag} className="text-xs px-3 py-1 rounded-full bg-secondary text-muted-foreground border border-border">
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── BOQ Result Card ──────────────────────────────────────────────────────────
function BOQResultView({ result, name, phone }: { result: BOQResult; name: string; phone: string }) {
  const [expandRod, setExpandRod] = useState(false);
  const [expandRates, setExpandRates] = useState(false);
  const { aiAnalysis, boq, estimateNo } = result;
  const conf = CONFIDENCE_CONFIG[aiAnalysis.confidence];

  const materials = [
    {
      icon: <Hammer className="w-5 h-5" />,
      label: "রড (Steel)",
      value: `${boq.quantities.rod.ton} টন`,
      sub: `${formatNum(boq.quantities.rod.kg)} কেজি`,
      cost: boq.costs.rod,
      color: "bg-red-500/10 text-red-600 border-red-200 dark:border-red-900",
      iconColor: "text-red-500",
    },
    {
      icon: <FlaskConical className="w-5 h-5" />,
      label: "সিমেন্ট",
      value: `${formatNum(boq.quantities.cement.total)} ব্যাগ`,
      sub: `কাস্টিং: ${formatNum(boq.quantities.cement.casting)} + রাজমিস্ত্রি: ${formatNum(boq.quantities.cement.masonry)}`,
      cost: boq.costs.cement,
      color: "bg-gray-500/10 text-gray-600 border-gray-200 dark:border-gray-700",
      iconColor: "text-gray-500",
    },
    {
      icon: <Layers className="w-5 h-5" />,
      label: "মোটা বালি (Coarse Sand)",
      value: `${formatNum(boq.quantities.coarseSand.cft)} CFT`,
      sub: "সিলেট মোটা বালি",
      cost: boq.costs.coarseSand,
      color: "bg-yellow-500/10 text-yellow-700 border-yellow-200 dark:border-yellow-900",
      iconColor: "text-yellow-500",
    },
    {
      icon: <Layers className="w-5 h-5" />,
      label: "মিহি বালি (Fine Sand)",
      value: `${formatNum(boq.quantities.fineSand.cft)} CFT`,
      sub: "রাজমিস্ত্রি ও প্লাস্টার",
      cost: boq.costs.fineSand,
      color: "bg-amber-500/10 text-amber-700 border-amber-200 dark:border-amber-900",
      iconColor: "text-amber-500",
    },
    {
      icon: <Boxes className="w-5 h-5" />,
      label: "পাথর (Stone Aggregate)",
      value: `${formatNum(boq.quantities.aggregate.cft)} CFT`,
      sub: "২০মিমি স্টোন চিপস",
      cost: boq.costs.aggregate,
      color: "bg-slate-500/10 text-slate-600 border-slate-200 dark:border-slate-700",
      iconColor: "text-slate-500",
    },
    {
      icon: <LayoutGrid className="w-5 h-5" />,
      label: "ইট (Brick)",
      value: `${formatNum(boq.quantities.brick.pcs)} পিস`,
      sub: "প্রথম শ্রেণির পোড়া ইট",
      cost: boq.costs.brick,
      color: "bg-orange-500/10 text-orange-700 border-orange-200 dark:border-orange-900",
      iconColor: "text-orange-500",
    },
  ];

  const waMsg = `আমার Blueprint BOQ বিশ্লেষণ রেফারেন্স নম্বর: *${estimateNo}*\n\nবিস্তারিত পরামর্শের জন্য যোগাযোগ করছি।\n\nনাম: ${name}\nফোন: ${phone}`;
  const waUrl = `https://wa.me/${SITE_CONFIG.whatsapp}?text=${encodeURIComponent(waMsg)}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      {/* Header Summary */}
      <Card className="overflow-hidden border-accent/30 shadow-xl">
        <div className="bg-gradient-to-br from-accent/15 via-accent/5 to-transparent p-6 md:p-8 border-b border-border">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="w-5 h-5 text-accent" />
                <span className="text-xs font-bold uppercase tracking-widest text-accent">AI BOQ বিশ্লেষণ সম্পন্ন</span>
              </div>
              <h3 className="text-2xl md:text-3xl font-extrabold text-primary font-heading">
                {formatBDT(boq.costs.minTotal)} – {formatBDT(boq.costs.maxTotal)}
              </h3>
              <p className="text-sm text-muted-foreground mt-1">প্রাথমিক মালামাল খরচের পরিসর (BDT)</p>
            </div>
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-sm font-semibold ${conf.color} bg-current/5 border-current/20`}>
              {conf.icon}
              {conf.label}
            </div>
          </div>

          {/* Key Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
            {[
              { label: "মোট এলাকা", value: `${formatNum(aiAnalysis.totalArea)} বর্গফুট` },
              { label: "রুম সংখ্যা", value: `${aiAnalysis.detectedRooms.length}টি রুম` },
              { label: "কলাম", value: `${aiAnalysis.columnCount}টি` },
              { label: "প্রতি বর্গফুট", value: `৳${formatNum(boq.costs.perSqft)}` },
            ].map((stat) => (
              <div key={stat.label} className="bg-background/70 backdrop-blur rounded-xl p-3 border border-border text-center">
                <div className="text-lg font-extrabold text-primary">{stat.value}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        <CardContent className="p-6 md:p-8 space-y-6">
          {/* Detected Rooms */}
          <div>
            <h4 className="font-bold text-sm uppercase tracking-wide text-muted-foreground mb-3 flex items-center gap-2">
              <LayoutGrid className="w-4 h-4" /> AI-তে শনাক্তকৃত রুমসমূহ
            </h4>
            <div className="flex flex-wrap gap-2">
              {aiAnalysis.detectedRooms.map((room, i) => (
                <span key={i} className="px-3 py-1 rounded-full bg-accent/10 text-accent text-sm font-medium border border-accent/20">
                  {room}
                </span>
              ))}
            </div>
          </div>

          {/* Structural Details */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {[
              { label: "ওয়াল লেন্থ", value: `${formatNum(aiAnalysis.wallLength)} RFT` },
              { label: "দরজা/জানালা", value: `${aiAnalysis.openingPercentage}%` },
              { label: "রেফারেন্স", value: estimateNo },
            ].map((item) => (
              <div key={item.label} className="bg-secondary/40 rounded-xl p-3 border border-border">
                <div className="text-xs text-muted-foreground">{item.label}</div>
                <div className="text-sm font-bold mt-0.5 truncate">{item.value}</div>
              </div>
            ))}
          </div>

          {/* AI Notes */}
          {aiAnalysis.notes && (
            <div className="flex gap-3 p-4 rounded-xl bg-blue-500/5 border border-blue-500/20">
              <Info className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs font-bold text-blue-600 mb-1">AI পর্যবেক্ষণ</p>
                <p className="text-sm text-muted-foreground">{aiAnalysis.notes}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Material Cards */}
      <div>
        <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
          <Ruler className="w-5 h-5 text-accent" /> মালামালের পরিমাণ ও খরচ
          <span className="text-xs font-normal text-muted-foreground ml-2">({boq.bnbcRef})</span>
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {materials.map((mat, i) => (
            <motion.div
              key={mat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className={`p-4 rounded-xl border ${mat.color} bg-card`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className={mat.iconColor}>{mat.icon}</span>
                  <div>
                    <div className="font-bold text-sm">{mat.label}</div>
                    <div className="text-xs text-muted-foreground">{mat.sub}</div>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="font-extrabold text-lg text-primary">{mat.value}</div>
                  <div className="text-xs text-muted-foreground">৳{formatNum(mat.cost)}</div>
                </div>
              </div>

              {/* Rod breakdown toggle */}
              {mat.label.includes("রড") && (
                <div className="mt-3">
                  <button
                    onClick={() => setExpandRod(!expandRod)}
                    className="flex items-center gap-1 text-xs font-semibold text-accent hover:underline"
                  >
                    {expandRod ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                    ডায়ামিটার অনুযায়ী বিভাজন
                  </button>
                  <AnimatePresence>
                    {expandRod && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden mt-2 space-y-1"
                      >
                        {result.boq.quantities.rod.breakdown.map((r) => (
                          <div key={r.label} className="flex justify-between text-xs text-muted-foreground bg-background/60 px-3 py-1.5 rounded-lg">
                            <span>{r.label}</span>
                            <span className="font-bold text-foreground">{r.ton} টন ({formatNum(r.kg)} কেজি)</span>
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Total Cost Summary */}
      <Card className="border-accent/40 bg-gradient-to-br from-accent/5 to-transparent">
        <CardContent className="p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm text-muted-foreground font-medium">মোট মালামাল খরচ (অনুমানিক)</p>
              <p className="text-3xl font-extrabold text-primary mt-1">
                {formatBDT(boq.costs.minTotal)} – {formatBDT(boq.costs.maxTotal)}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                প্রতি বর্গফুট: ৳{formatNum(boq.costs.perSqft)} | মোট: {formatNum(aiAnalysis.totalArea)} বর্গফুট
              </p>
            </div>
            <div className="flex flex-col items-end gap-1">
              <span className="text-xs px-2 py-1 bg-accent/10 text-accent rounded-full border border-accent/20 font-semibold">
                BNBC 2020 মান
              </span>
              <span className="text-xs px-2 py-1 bg-green-500/10 text-green-600 rounded-full border border-green-200 font-semibold">
                RAJUK ২০২৩
              </span>
            </div>
          </div>

          {/* Market rates toggle */}
          <button
            onClick={() => setExpandRates(!expandRates)}
            className="mt-4 w-full flex items-center justify-between p-3 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors border border-border text-sm font-semibold"
          >
            <span className="flex items-center gap-2">
              <FlaskConical className="w-4 h-4 text-accent" /> বর্তমান বাজারদর (২০২৪-২০২৫)
            </span>
            {expandRates ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          <AnimatePresence>
            {expandRates && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-2">
                  {Object.entries(boq.rates).map(([key, rate]) => (
                    <div key={key} className="flex justify-between items-center text-xs bg-background/60 px-3 py-2 rounded-lg border border-border">
                      <span className="text-muted-foreground">{rate.desc}</span>
                      <span className="font-bold text-foreground ml-2 flex-shrink-0">
                        ৳{(rate.ratePerKg || rate.ratePerBag || rate.ratePerCft || rate.ratePerPcs || 0).toLocaleString()}/{rate.unit}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>

      {/* Disclaimer */}
      <div className="flex gap-3 p-4 rounded-xl bg-yellow-500/5 border border-yellow-500/20">
        <Shield className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" />
        <div className="text-xs text-muted-foreground leading-relaxed">
          <strong className="text-foreground">দাবিত্যাগ:</strong> এই BOQ হলো BNBC 2020 এবং RAJUK বিল্ডিং নির্মাণ বিধিমালা ২০২৩ অনুযায়ী AI-সহায়তায় তৈরি প্রাথমিক অনুমান।
          নির্ভুল পরিমাণের জন্য সার্টিফাইড স্ট্রাকচারাল ইঞ্জিনিয়ার কর্তৃক বিস্তারিত Structural Design ও BOQ প্রণয়ন অপরিহার্য।
          বাজারদর দৈনিক পরিবর্তনশীল। এই রিপোর্ট কোনো চুক্তি দলিল নয়।
        </div>
      </div>

      {/* CTAs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <a href={waUrl} target="_blank" rel="noopener noreferrer">
          <Button className="w-full h-14 text-base font-bold bg-[#25D366] hover:bg-[#20bd5a] text-white">
            <WhatsAppIcon className="w-5 h-5 mr-3" />
            বিস্তারিত BOQ-এর জন্য যোগাযোগ
          </Button>
        </a>
        <a href={`tel:${SITE_CONFIG.phone}`}>
          <Button variant="outline" className="w-full h-14 text-base font-bold border-accent text-accent hover:bg-accent hover:text-primary-foreground">
            <PhoneCall className="w-5 h-5 mr-3" />
            ইঞ্জিনিয়ারকে সরাসরি কল করুন
          </Button>
        </a>
      </div>

      <p className="text-center text-xs text-muted-foreground">রেফারেন্স নম্বর: <strong>{estimateNo}</strong> • স্ক্রিনশট নিন বা সেভ করুন</p>
    </motion.div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function BlueprintBOQAnalyzer() {
  const [step, setStep] = useState<"form" | "analyzing" | "result">("form");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [buildingType, setBuildingType] = useState<BuildingType>("residential");
  const [floors, setFloors] = useState(1);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<BOQResult | null>(null);
  const [analysisStage, setAnalysisStage] = useState(0);

  const STAGES = [
    "ফাইল আপলোড হচ্ছে Cloudinary-তে...",
    "Gemini AI ড্রয়িং বিশ্লেষণ করছে...",
    "রুম, ওয়াল ও কলাম শনাক্ত করা হচ্ছে...",
    "BNBC 2020 অনুযায়ী BOQ তৈরি হচ্ছে...",
    "বাজারদর প্রজেকশন তৈরি হচ্ছে...",
  ];

  const handleFile = useCallback((f: File) => {
    setFile(f);
    if (f.type.startsWith("image/")) {
      const url = URL.createObjectURL(f);
      setPreview(url);
    } else {
      setPreview("/pdf-placeholder.png");
    }
  }, []);

  const handleClear = () => {
    setFile(null);
    setPreview(null);
  };

  const handleReset = () => {
    setStep("form");
    setResult(null);
    setFile(null);
    setPreview(null);
    setAnalysisStage(0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      toast.error("আপনার নাম ও ফোন নম্বর দিন।");
      return;
    }
    if (!/^(?:\+?880)?[0-9]{10,11}$/.test(phone.replace(/[\s-]/g, ""))) {
      toast.error("সঠিক বাংলাদেশি মোবাইল নম্বর দিন।");
      return;
    }
    if (!file) {
      toast.error("অনুগ্রহ করে ফ্লোর প্ল্যান বা ড্রয়িং আপলোড করুন।");
      return;
    }

    setStep("analyzing");
    setAnalysisStage(0);

    // Animate through stages
    const stageTimer = setInterval(() => {
      setAnalysisStage((prev) => (prev < STAGES.length - 1 ? prev + 1 : prev));
    }, 2500);

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("phone", phone);
      formData.append("buildingType", buildingType);
      formData.append("floors", String(floors));
      formData.append("blueprint", file);

      const res = await fetch("/api/blueprint-boq", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "বিশ্লেষণ করতে ব্যর্থ হয়েছে।");

      clearInterval(stageTimer);
      setResult(data);
      setStep("result");
      toast.success("AI BOQ বিশ্লেষণ সম্পন্ন হয়েছে! 🎉");
    } catch (err: any) {
      clearInterval(stageTimer);
      toast.error(err.message);
      setStep("form");
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <AnimatePresence mode="wait">
        {/* ── FORM ── */}
        {step === "form" && (
          <motion.div
            key="form"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
          >
            <Card className="shadow-xl border-border overflow-hidden">
              <CardContent className="p-6 md:p-10">
                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Client Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="bp-name" className="text-sm font-bold">পূর্ণ নাম *</Label>
                      <Input
                        id="bp-name"
                        placeholder="যেমন: মোঃ আনিসুর রহমান"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="h-12 text-base"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bp-phone" className="text-sm font-bold">মোবাইল নম্বর *</Label>
                      <Input
                        id="bp-phone"
                        type="tel"
                        placeholder="017XXXXXXXX"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                        className="h-12 text-base"
                      />
                    </div>
                  </div>

                  {/* Building Type */}
                  <div className="space-y-3">
                    <Label className="text-sm font-bold">ভবনের ধরণ *</Label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {BUILDING_TYPES.map((bt) => (
                        <button
                          key={bt.key}
                          type="button"
                          onClick={() => setBuildingType(bt.key)}
                          className={`relative p-4 rounded-xl border-2 text-left transition-all duration-200 ${
                            buildingType === bt.key
                              ? "border-accent bg-accent/5 shadow-lg scale-[1.02]"
                              : "border-border hover:border-muted-foreground/30 hover:shadow-md"
                          }`}
                        >
                          {buildingType === bt.key && (
                            <CheckCircle2 className="absolute top-2.5 right-2.5 w-4 h-4 text-accent" />
                          )}
                          <div className={`mb-2 ${buildingType === bt.key ? "text-accent" : "text-muted-foreground"}`}>
                            {bt.icon}
                          </div>
                          <div className="font-bold text-sm">{bt.labelBn}</div>
                          <div className="text-xs text-muted-foreground mt-0.5">{bt.desc}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Floors */}
                  <div className="space-y-2">
                    <Label className="text-sm font-bold">মোট তলার সংখ্যা *</Label>
                    <div className="flex items-center gap-4">
                      <button
                        type="button"
                        onClick={() => setFloors((p) => Math.max(1, p - 1))}
                        disabled={floors <= 1}
                        className="w-12 h-12 rounded-xl border border-border flex items-center justify-center hover:bg-secondary disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      >
                        <span className="text-xl font-bold">−</span>
                      </button>
                      <div className="flex-1 text-center bg-secondary/30 rounded-xl py-3 border border-border">
                        <span className="text-3xl font-extrabold text-primary">{floors}</span>
                        <span className="text-sm text-muted-foreground ml-2">তলা</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setFloors((p) => Math.min(20, p + 1))}
                        disabled={floors >= 20}
                        className="w-12 h-12 rounded-xl border border-border flex items-center justify-center hover:bg-secondary disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      >
                        <span className="text-xl font-bold">+</span>
                      </button>
                    </div>
                  </div>

                  {/* Upload Zone */}
                  <div className="space-y-2">
                    <Label className="text-sm font-bold">ফ্লোর প্ল্যান / আর্কিটেকচারাল ড্রয়িং *</Label>
                    <UploadZone file={file} preview={preview} onFile={handleFile} onClear={handleClear} />
                  </div>

                  {/* Submit */}
                  <Button type="submit" className="w-full h-14 text-lg font-bold" disabled={!file}>
                    <Sparkles className="w-5 h-5 mr-3" />
                    AI দিয়ে BOQ বিশ্লেষণ করুন
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* ── ANALYZING ── */}
        {step === "analyzing" && (
          <motion.div
            key="analyzing"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            <Card className="shadow-xl border-accent/30">
              <CardContent className="p-10 md:p-16 flex flex-col items-center justify-center gap-8 min-h-96 text-center">
                {/* Animated brain/sparkle */}
                <div className="relative">
                  <div className="w-24 h-24 rounded-full bg-accent/10 flex items-center justify-center">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                    >
                      <Sparkles className="w-12 h-12 text-accent" />
                    </motion.div>
                  </div>
                  <motion.div
                    className="absolute inset-0 rounded-full border-2 border-accent/30"
                    animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                  />
                </div>

                <div className="space-y-2">
                  <h3 className="text-xl font-extrabold">AI বিশ্লেষণ চলছে...</h3>
                  <motion.p
                    key={analysisStage}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-muted-foreground text-sm"
                  >
                    {STAGES[analysisStage]}
                  </motion.p>
                </div>

                <div className="w-full max-w-sm space-y-2">
                  {STAGES.map((stage, i) => (
                    <div key={i} className="flex items-center gap-3 text-xs">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
                        i < analysisStage
                          ? "bg-accent text-primary-foreground"
                          : i === analysisStage
                          ? "border-2 border-accent"
                          : "border-2 border-border"
                      }`}>
                        {i < analysisStage ? <CheckCircle2 className="w-3 h-3" /> : i === analysisStage ? <Loader2 className="w-3 h-3 animate-spin text-accent" /> : null}
                      </div>
                      <span className={i <= analysisStage ? "text-foreground font-medium" : "text-muted-foreground/50"}>
                        {stage}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* ── RESULT ── */}
        {step === "result" && result && (
          <motion.div key="result" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <BOQResultView result={result} name={name} phone={phone} />
            <div className="mt-6 text-center">
              <Button variant="ghost" onClick={handleReset} className="text-muted-foreground">
                <RefreshCcw className="w-4 h-4 mr-2" /> নতুন প্ল্যান বিশ্লেষণ করুন
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
