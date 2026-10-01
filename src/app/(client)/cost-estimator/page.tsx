"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Calculator, BarChart3, Headset, ShieldCheck, Scan, FileImage, Brain, Cpu } from "lucide-react";
import WhatsAppIcon from "@/components/shared/WhatsAppIcon";
import dynamic from "next/dynamic";
import SEOHead from "@/components/shared/SEOHead";

const CostEstimator = dynamic(() => import("@/components/estimator/CostEstimator"), {
  loading: () => (
    <div className="flex justify-center py-20">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
    </div>
  ),
});

const BlueprintBOQAnalyzer = dynamic(() => import("@/components/estimator/BlueprintBOQAnalyzer"), {
  loading: () => (
    <div className="flex justify-center py-20">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-accent border-t-transparent" />
    </div>
  ),
});

const TABS = [
  {
    id: "estimator",
    label: "খরচ ক্যালকুলেটর",
    labelEn: "Cost Estimator",
    icon: <Calculator className="w-4 h-4" />,
    desc: "এলাকা ও তলা সংখ্যা দিয়ে নির্মাণ খরচ",
    badge: null,
  },
  {
    id: "boq",
    label: "AI Blueprint BOQ",
    labelEn: "AI BOQ Analyzer",
    icon: <Sparkles className="w-4 h-4" />,
    desc: "ড্রয়িং আপলোড করে AI-তে মালামালের হিসাব",
    badge: "নতুন ✨",
  },
] as const;

type TabId = (typeof TABS)[number]["id"];

const AI_FEATURES = [
  {
    icon: <Scan className="w-5 h-5" />,
    title: "স্বয়ংক্রিয় ড্রয়িং রিডিং",
    desc: "Gemini AI আপনার ফ্লোর প্ল্যানের রুম, ওয়াল ও কলাম স্বয়ংক্রিয়ভাবে শনাক্ত করে",
  },
  {
    icon: <Brain className="w-5 h-5" />,
    title: "BNBC 2020 মান অনুসরণ",
    desc: "বাংলাদেশ ন্যাশনাল বিল্ডিং কোড ও RAJUK বিধিমালা অনুযায়ী পরিমাণ নির্ধারণ",
  },
  {
    icon: <BarChart3 className="w-5 h-5" />,
    title: "বিস্তারিত BOQ শিট",
    desc: "রড (ডায়ামিটার ভেদে), সিমেন্ট, বালি, পাথর ও ইটের পরিমাণ আলাদাভাবে",
  },
  {
    icon: <Cpu className="w-5 h-5" />,
    title: "বর্তমান বাজারদর",
    desc: "২০২৪-২০২৫ সালের সর্বশেষ বাজারদর অনুযায়ী খরচের প্রজেকশন",
  },
];

const trustBadges = [
  { icon: BarChart3, label: "BNBC 2020 মান" },
  { icon: Headset, label: "বিনামূল্যে পরামর্শ" },
  { icon: ShieldCheck, label: "তাৎক্ষণিক রিপোর্ট" },
  { icon: FileImage, label: "PDF/Image সাপোর্ট" },
];

export default function CostEstimatorPage() {
  const [activeTab, setActiveTab] = useState<TabId>("estimator");

  return (
    <div className="w-full">
      <SEOHead
        title="নির্মাণ খরচ ক্যালকুলেটর ও AI BOQ Analyzer"
        description="ফ্লোর প্ল্যান আপলোড করুন, AI দিয়ে রড, সিমেন্ট, বালি, ইটের পরিমাণ ও খরচ হিসাব করুন। BNBC 2020 ও RAJUK মান অনুযায়ী।"
      />

      {/* ── Hero ── */}
      <section className="bg-primary pt-32 pb-20 text-center px-4 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        <div className="relative z-10 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-accent/20 text-accent px-4 py-1.5 rounded-full text-sm font-bold mb-4 border border-accent/30"
          >
            <Sparkles className="w-4 h-4" /> AI-powered BOQ Analyzer — নতুন সুবিধা
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-5xl font-bold font-heading text-primary-foreground mb-6 leading-tight"
          >
            নির্মাণ খরচ ও{" "}
            <span className="text-accent">AI BOQ</span>{" "}
            বিশ্লেষক
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-base md:text-xl text-primary-foreground/80 max-w-3xl mx-auto"
          >
            আপনার ফ্লোর প্ল্যান আপলোড করুন — AI ইঞ্জিন স্বয়ংক্রিয়ভাবে রড, সিমেন্ট, বালি, পাথর ও ইটের পরিমাণ
            BNBC 2020 ও RAJUK মান অনুযায়ী নিমিষেই হিসাব করে দেবে।
          </motion.p>

          {/* Trust Badges */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="flex flex-wrap justify-center gap-3 mt-8"
          >
            {trustBadges.map((badge, i) => (
              <div
                key={i}
                className="flex items-center gap-2 bg-primary-foreground/10 backdrop-blur-sm px-4 py-2 rounded-full border border-primary-foreground/20"
              >
                <badge.icon className="w-4 h-4 text-accent" />
                <span className="text-xs md:text-sm font-semibold text-primary-foreground">{badge.label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── AI Features Strip (shown when BOQ tab) ── */}
      {activeTab === "boq" && (
        <motion.section
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="bg-accent/5 border-b border-accent/20 py-8 overflow-hidden"
        >
          <div className="max-w-5xl mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {AI_FEATURES.map((f, i) => (
                <div key={i} className="text-center space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-accent/10 text-accent flex items-center justify-center mx-auto">
                    {f.icon}
                  </div>
                  <div className="font-bold text-sm">{f.title}</div>
                  <div className="text-xs text-muted-foreground leading-relaxed">{f.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </motion.section>
      )}

      {/* ── Tab Navigation ── */}
      <section className="bg-background border-b border-border sticky top-[64px] z-30">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-4 text-sm font-bold transition-all border-b-2 ${
                  activeTab === tab.id
                    ? "border-accent text-accent"
                    : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
                }`}
              >
                {tab.icon}
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">{tab.labelEn}</span>
                {tab.badge && (
                  <span className="absolute -top-1 -right-1 text-[10px] bg-accent text-primary-foreground px-1.5 py-0.5 rounded-full font-bold whitespace-nowrap">
                    {tab.badge}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Content ── */}
      <section className="py-16 md:py-24 bg-background">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {activeTab === "estimator" && (
            <motion.div key="estimator" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="text-center mb-12">
                <h2 className="text-2xl md:text-4xl font-bold font-heading mb-4">
                  নির্মাণ খরচ ক্যালকুলেটর
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  আপনার জমির আয়তন ও তলার সংখ্যা দিন — তাৎক্ষণিকভাবে নির্মাণ খরচের বিস্তারিত ব্রেকডাউন পান।
                </p>
              </div>
              <CostEstimator />
            </motion.div>
          )}

          {activeTab === "boq" && (
            <motion.div key="boq" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 bg-accent/10 text-accent px-4 py-1.5 rounded-full text-sm font-bold mb-3 border border-accent/20">
                  <Sparkles className="w-4 h-4" /> Powered by Gemini AI
                </div>
                <h2 className="text-2xl md:text-4xl font-bold font-heading mb-4">
                  AI Blueprint BOQ Analyzer
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  আপনার ২D ফ্লোর প্ল্যান বা আর্কিটেকচারাল ড্রয়িং আপলোড করুন। AI ইঞ্জিন BNBC 2020 ও RAJUK মান
                  অনুযায়ী রড, সিমেন্ট, বালি, পাথর ও ইটের সম্পূর্ণ BOQ তৈরি করবে।
                </p>
              </div>
              <BlueprintBOQAnalyzer />
            </motion.div>
          )}
        </div>
      </section>

      {/* ── Bottom CTA ── */}
      <section className="py-16 bg-muted/30 border-t border-border">
        <div className="max-w-3xl mx-auto px-4 text-center space-y-6">
          <h2 className="text-2xl md:text-3xl font-bold font-heading">
            বিস্তারিত BOQ ও নির্মাণ পরিকল্পনার জন্য
          </h2>
          <p className="text-muted-foreground">
            আমাদের অভিজ্ঞ স্ট্রাকচারাল ইঞ্জিনিয়ার টিম বিনামূল্যে সাইট ভিজিট ও পরামর্শ প্রদান করে।
          </p>
          <a
            href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "8801778506500"}?text=${encodeURIComponent(
              "আমি AI BOQ Analyzer ব্যবহার করেছি এবং বিস্তারিত নির্মাণ পরিকল্পনার জন্য পরামর্শ নিতে চাই।"
            )}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <button className="inline-flex items-center gap-3 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold px-8 py-4 rounded-xl text-lg transition-all hover:shadow-lg hover:scale-105">
              <WhatsAppIcon className="w-6 h-6" />
              ইঞ্জিনিয়ারের সাথে WhatsApp-এ কথা বলুন
            </button>
          </a>
        </div>
      </section>
    </div>
  );
}
