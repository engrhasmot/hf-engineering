"use client";

import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import Link from "next/link";
import {
  Calendar,
  Clock,
  Phone,
  MapPin,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  MessageCircle,
  ShieldCheck,
  Building2,
  FileText,
  Compass,
  HardHat,
  Award,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import SEOHead from "@/components/shared/SEOHead";
import { SITE_CONFIG } from "@/lib/constants";
import WhatsAppIcon from "@/components/shared/WhatsAppIcon";

const BookingForm = dynamic(() => import("@/components/booking/BookingForm"), {
  loading: () => (
    <div className="flex flex-col items-center justify-center py-24 bg-card rounded-3xl border border-border">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-accent mb-4" />
      <p className="text-sm text-muted-foreground font-medium">
        বুকিং ফর্ম লোড হচ্ছে...
      </p>
    </div>
  ),
});

const BOOKING_FAQS = [
  {
    q: "অফিসে এসে ড্রয়িং নিয়ে কথা বলতে কি কোনো কনসালটেশন ফি দিতে হয়?",
    a: "না, সম্পূর্ণ ফ্রি! সাভার রেডিও কলোনিতে আমাদের অফিসে এসে জমি বা বাড়ি নির্মাণের প্রাথমিক ড্রয়িং, সেতব্যাক ও বাজেট নিয়ে খোলামেলা আলোচনা সম্পূর্ণ বিনামূল্যে করতে পারেন।",
  },
  {
    q: "অনলাইনে অ্যাপয়েন্টমেন্ট সাবমিট করার পর আপনারা কখন যোগাযোগ করেন?",
    a: "অ্যাপয়েন্টমেন্ট রিকোয়েস্ট পাওয়ার সাধারণত ২ ঘণ্টার মধ্যে আমাদের প্রধান ইঞ্জিনিয়ার বা কারিগরি টিম আপনার মোবাইল নম্বরে ফোন করে সাক্ষাত বা সাইট পরিদর্শনের চূড়ান্ত সময় লক করে নেন।",
  },
  {
    q: "জরুরি ছাদ ঢালাই বা ফাউন্ডেশনের জন্য কি সাথে সাথে ইঞ্জিনিয়ার পাওয়া সম্ভব?",
    a: "হ্যাঁ! জরুরি ছাদ ঢালাই বা গভীর ফাউন্ডেশন পরিদর্শনের জন্য ফর্ম পূরণের চেয়ে সরাসরি আমাদের জরুরি হটলাইনে (01778-506500) কল করার অনুরোধ করা হচ্ছে। একই দিনে সাইট ভিজিটের ব্যবস্থা রয়েছে।",
  },
  {
    q: "আপনারা কোন কোন এলাকায় সাইট ভিজিটে যান?",
    a: "আমরা সাভার, আশুলিয়া, ধামরাই, বিরুলিয়া, হেমায়েতপুর, মানিকগঞ্জ, গাবতলী, মিরপুর, উত্তরা সহ সমগ্র ঢাকা ও আশেপাশের যেকোনো লোকেশনে সাইট ভিজিট ও তদারকি সেবা প্রদান করি।",
  },
];

export default function BookAppointmentPage() {
  return (
    <div className="w-full min-h-screen bg-background selection:bg-accent/20 selection:text-accent">
      <SEOHead
        title="Book Appointment - Engineering Consultation & Site Visit"
        description="সাভার ও ঢাকার যেকোনো স্থানে ভবন নির্মাণের ড্রয়িং, প্ল্যান অনুমোদন, সয়েল টেস্ট ও ছাদ ঢালাই তদারকির জন্য অভিজ্ঞ সিভিল ইঞ্জিনিয়ারের সাথে সরাসরি অ্যাপয়েন্টমেন্ট শিডিউল করুন।"
      />

      {/* ─── HERO SECTION ─── */}
      <section className="relative bg-primary pt-32 pb-20 overflow-hidden text-primary-foreground border-b border-primary/20">
        {/* Engineering Blueprint Watermark */}
        <div
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        {/* Ambient Gradient Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-accent/20 blur-[130px] rounded-full pointer-events-none" />

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Top Pill Badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/20 border border-accent/40 text-accent text-sm font-semibold mb-6 shadow-sm"
          >
            <Calendar className="w-4 h-4 text-accent" />
            Engineering Consultation & Site Visit Booking
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold font-heading tracking-tight mb-5"
          >
            Schedule Your <span className="text-accent">Consultation</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="text-lg md:text-xl text-primary-foreground/85 max-w-3xl mx-auto font-normal leading-relaxed mb-8"
          >
            সাভার ও ঢাকার যেকোনো প্রান্তে জমি পরিদর্শন, ড্রয়িং নিয়ে বিস্তারিত আলোচনা, অথবা জরুরি
            ছাদ ঢালাই তদারকির জন্য সরাসরি আমাদের অভিজ্ঞ সিভিল ইঞ্জিনিয়ারের সাথে অ্যাপয়েন্টমেন্ট বুক করুন।
          </motion.p>

          {/* Quick Highlight Metrics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs sm:text-sm font-medium text-primary-foreground/80"
          >
            <span className="flex items-center gap-1.5 bg-white/10 px-3.5 py-1.5 rounded-full border border-white/15">
              <Building2 className="w-4 h-4 text-accent" />
              ১০০% ফ্রি অফিস কনসালটেশন
            </span>
            <span className="flex items-center gap-1.5 bg-white/10 px-3.5 py-1.5 rounded-full border border-white/15">
              <ShieldCheck className="w-4 h-4 text-accent" />
              BNBC ২০২০ কোড অনুযায়ী পরামর্শ
            </span>
            <span className="flex items-center gap-1.5 bg-white/10 px-3.5 py-1.5 rounded-full border border-white/15">
              <Clock className="w-4 h-4 text-accent" />
              ২ ঘণ্টার মধ্যে নিশ্চিতকরণ কল
            </span>
          </motion.div>
        </div>
      </section>

      {/* ─── MAIN BOOKING LAYOUT ─── */}
      <section className="py-16 sm:py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* ─── LEFT COLUMN: THE BOOKING WIZARD (7 Cols) ─── */}
            <div className="lg:col-span-7">
              <BookingForm />
            </div>

            {/* ─── RIGHT COLUMN: TRUST, PREPARATION & DIRECT HOTLINE (5 Cols) ─── */}
            <div className="lg:col-span-5 space-y-6">
              {/* 1. Chief Engineer Spotlight Card */}
              <div className="bg-card rounded-3xl p-6 sm:p-7 border border-border shadow-xs relative overflow-hidden">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-[#0B2A4A] border-2 border-accent flex flex-col items-center justify-center text-accent shrink-0 shadow-md">
                    <Compass className="w-7 h-7" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-accent uppercase tracking-wider block">
                      Lead Structural Consultant
                    </span>
                    <h3 className="text-xl font-bold font-heading text-foreground">
                      ইঞ্জিনিয়ার মোঃ হাসমত আলী
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      B.Sc. in Civil Engineering · ১০+ বছরের অভিজ্ঞতা
                    </p>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-muted-foreground mt-4 leading-relaxed">
                  আপনার জমির অবস্থান, ড্রয়িং প্ল্যান এবং পৌরসভা বা ইউনিয়ন পরিষদ অনুমোদনের কাগজপত্র নিয়ে সরাসরি প্রধান
                  ইঞ্জিনিয়ারের সাথে মুখোমুখি আলোচনা করতে পারবেন।
                </p>

                <div className="mt-4 pt-4 border-t border-border/80 flex items-center justify-between text-xs text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    ব্যক্তিগত পরামর্শ নিশ্চিত
                  </span>
                  <span className="text-accent font-semibold">৫০০+ প্রজেক্ট অভিজ্ঞতা</span>
                </div>
              </div>

              {/* 2. "What to Bring" Client Checklist */}
              <div className="bg-card rounded-3xl p-6 sm:p-7 border border-border shadow-xs">
                <div className="flex items-center gap-2 mb-4">
                  <FileText className="w-5 h-5 text-accent" />
                  <h3 className="text-base font-bold font-heading text-foreground">
                    অফিস সাক্ষাতে সাথে কী কী আনবেন?
                  </h3>
                </div>
                <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
                  সঠিক ও নিখুঁত পরামর্শ পাওয়ার জন্য সম্ভব হলে নিচের নথিপত্রের ফটোকপি বা ছবি সাথে নিয়ে আসুন:
                </p>

                <ul className="space-y-2.5 text-xs sm:text-sm text-foreground/90">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>মূল দলিলের ফটোকপি</strong> (জমির মালিকানা নিশ্চিতকরণে)</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>নামজারি পরচা ও ডিসিআর</strong> (হালনাগাদ খারিজ)</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>খাজনা রশিদ ও মৌজা ম্যাপ</strong> (রাস্তা ও সেতব্যাক যাচাইয়ে)</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>জমির আনুমানিক মাপের স্কেচ</strong> এবং ফ্যামিলির প্রয়োজনীয়তা</span>
                  </li>
                </ul>
              </div>

              {/* 3. Urgent Casting / Emergency Hotline Card */}
              <div className="bg-gradient-to-br from-rose-500/10 via-card to-card rounded-3xl p-6 sm:p-7 border-2 border-rose-500/30 shadow-xs relative overflow-hidden">
                <div className="flex items-center gap-2 text-rose-600 font-bold text-xs uppercase tracking-wider mb-2">
                  <AlertCircle className="w-4 h-4" />
                  <span>জরুরি সাইট পরিদর্শন বা ছাদ ঢালাই</span>
                </div>
                <h3 className="text-lg font-bold font-heading text-foreground mb-2">
                  আজ বা কাল সকালেই ইঞ্জিনিয়ার প্রয়োজন?
                </h3>
                <p className="text-xs text-muted-foreground mb-5 leading-relaxed">
                  ঢালাই চলাকালে কোনো ভুল হলে সারা জীবনের ক্ষতি। জরুরি ভিত্তিতে একই দিনে সাইট ভিজিট ও রড-সাটারিং
                  ইন্সপেকশনের জন্য সরাসরি আমাদের হটলাইনে ফোন দিন।
                </p>

                <div className="space-y-2">
                  <a
                    href="tel:01778506500"
                    className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl font-bold text-sm bg-rose-600 hover:bg-rose-700 text-white transition-colors shadow-md shadow-rose-600/20"
                  >
                    <Phone className="w-4 h-4" />
                    <span>হটলাইন কল: 01778-506500</span>
                  </a>
                  <a
                    href={`https://wa.me/${SITE_CONFIG.whatsapp}?text=${encodeURIComponent(
                      "আসসালামু আলাইকুম, আমার জরুরি সাইট ভিজিট / ছাদ ঢালাই তদারকির প্রয়োজন।"
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-700 text-white transition-colors"
                  >
                    <WhatsAppIcon className="w-4 h-4" />
                    <span>হোয়াটসঅ্যাপে দ্রুত মেসেজ দিন</span>
                  </a>
                </div>
              </div>

              {/* 4. Chamber Address & Visiting Hours */}
              <div className="bg-muted/40 rounded-3xl p-6 border border-border text-xs space-y-3">
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-foreground text-sm">চেম্বার ও প্রধান কার্যালয়:</p>
                    <p className="text-muted-foreground mt-0.5 leading-relaxed">
                      আয়শা মঞ্জিল, বাড়ি ১৪/০৫, ওয়ার্ড নং ১, নয়াবাড়ি, সাভার রেডিও কলোনি, ঢাকা।
                    </p>
                    <a
                      href="https://maps.app.goo.gl/wdBzkKfqCw4Kbggs7"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-accent font-semibold hover:underline mt-1.5"
                    >
                      <span>গুগল ম্যাপসে লোকেশন দেখুন</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>

                <div className="pt-2.5 border-t border-border flex items-center gap-2 text-muted-foreground">
                  <Clock className="w-3.5 h-3.5 text-accent shrink-0" />
                  <span>শনিবার – বৃহস্পতিবার: সকাল ৯:০০ – রাত ৮:০০ (শুক্রবার অ্যাপয়েন্টমেন্ট সাপেক্ষে)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── BOOKING FAQS SECTION ─── */}
      <section className="py-16 bg-muted/30 border-t border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="text-accent text-xs font-bold uppercase tracking-wider block mb-2">
              সাধারণ জিজ্ঞাসা
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-foreground">
              অ্যাপয়েন্টমেন্ট সম্পর্কিত প্রশ্নোত্তর
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {BOOKING_FAQS.map((faq, i) => (
              <div key={i} className="bg-card rounded-2xl p-5 border border-border shadow-xs">
                <h4 className="text-sm font-bold text-foreground mb-2 flex items-start gap-2">
                  <HelpCircle className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                  <span>{faq.q}</span>
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed pl-6">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <p className="text-xs text-muted-foreground">
              আরও কোনো প্রশ্ন থাকলে আমাদের{" "}
              <Link href="/faq" className="text-accent font-bold hover:underline">
                সম্পূর্ণ FAQ পেজ
              </Link>{" "}
              দেখুন অথবা সরাসরি ফোনে যোগাযোগ করুন।
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
