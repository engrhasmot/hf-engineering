"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Phone,
  MessageCircle,
  Mail,
  MapPin,
  Share2,
  Download,
  Copy,
  Check,
  QrCode,
  Calendar,
  Calculator,
  Search,
  ExternalLink,
  ShieldCheck,
  Building2,
  Clock,
  Compass,
  ArrowRight,
  Briefcase,
  Award,
  RotateCw,
  Printer,
  Sparkles,
  Layers,
  HardHat,
  FileText,
  BadgeCheck,
  Globe,
  ChevronRight,
  Send,
  X,
} from "lucide-react";
import QRCode from "qrcode";
import { toast } from "sonner";
import { SITE_CONFIG, getSiteUrl } from "@/lib/constants";
import WhatsAppIcon from "@/components/shared/WhatsAppIcon";
import SEOHead from "@/components/shared/SEOHead";

export default function DigitalCardPage() {
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string>("");

  const cardUrl =
    typeof window !== "undefined"
      ? window.location.href
      : `${getSiteUrl()}/card`;

  // Generate High-Res QR Code for the card URL
  useEffect(() => {
    QRCode.toDataURL(cardUrl, {
      width: 480,
      margin: 2,
      color: {
        dark: "#071626",
        light: "#FFFFFF",
      },
    })
      .then((url) => setQrDataUrl(url))
      .catch((err) => console.error("QR Code generation error:", err));
  }, [cardUrl]);

  // vCard (.vcf) download handler in clean English
  const handleDownloadVCard = () => {
    const vCardData = [
      "BEGIN:VCARD",
      "VERSION:3.0",
      "N:Ali;Md. Hasmot;Engr.;;",
      "FN:Engr. Md. Hasmot Ali",
      "ORG:HF Design & Engineering Solutions",
      "TITLE:Founder & Principal Structural Consultant",
      "ROLE:Civil & Structural Engineer",
      "TEL;TYPE=CELL,VOICE,pref:+8801778506500",
      "TEL;TYPE=WORK,VOICE:+8801631186218",
      "EMAIL;TYPE=WORK,INTERNET:info@hfengineeringbd.com",
      "URL;TYPE=WORK:https://hfengineeringbd.com",
      "ADR;TYPE=WORK,POSTAL,PARCEL:;;Aysha Monjil, House 14/05, Ward 01, Noyabari;Savar Radio Colony;Dhaka;1340;Bangladesh",
      "NOTE:Civil Engineer (B.Sc. in Civil Engineering) | Structural Designer, BNBC Standard Detailing, Architectural 2D/3D Design, Soil Investigation, BOQ Estimation & Municipal Plan Approval in Savar, Dhaka.",
      "END:VCARD",
    ].join("\r\n");

    const blob = new Blob([vCardData], { type: "text/vcard;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "Engr_Md_Hasmot_Ali_HF_Engineering.vcf");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast.success("Contact file downloaded! Save directly to your smartphone.");
  };

  // Copy card link
  const handleCopyLink = () => {
    navigator.clipboard.writeText(cardUrl);
    setCopied(true);
    toast.success("Digital Visiting Card URL copied to clipboard!");
    setTimeout(() => setCopied(false), 2500);
  };

  // Share card (Web Share API fallback to copy)
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Engr. Md. Hasmot Ali — Official Digital Business Card",
          text: "Engr. Md. Hasmot Ali | Founder & Principal Structural Consultant at HF Design & Engineering Solutions, Savar, Dhaka.",
          url: cardUrl,
        });
      } catch {
        // User cancelled share
      }
    } else {
      handleCopyLink();
    }
  };

  // Download QR Code image
  const handleDownloadQR = () => {
    if (!qrDataUrl) return;
    const link = document.createElement("a");
    link.href = qrDataUrl;
    link.download = "Engr_Hasmot_Ali_Business_Card_QR.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("High-resolution QR Code image downloaded for printing!");
  };

  // Trigger browser print for physical card stock
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-3 sm:px-6 relative overflow-x-hidden selection:bg-amber-400 selection:text-slate-950">
      <SEOHead
        title="Engr. Md. Hasmot Ali | Official Digital Business Card"
        description="Official Digital Business Card of Engr. Md. Hasmot Ali, Founder & Principal Structural Consultant at HF Design & Engineering Solutions, Savar, Dhaka."
      />

      {/* ─── PRINT-ONLY STYLES ─── */}
      <style jsx global>{`
        @media print {
          body {
            background: white !important;
            color: black !important;
          }
          .no-print {
            display: none !important;
          }
          .print-card-container {
            display: block !important;
            box-shadow: none !important;
            border: 1px solid #ccc !important;
            margin: 0 auto !important;
            page-break-inside: avoid !important;
          }
        }
      `}</style>

      {/* ─── AMBIENT BACKGROUND GLOW & GEOMETRIC GRID ─── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-35 no-print">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-amber-500/20 rounded-full blur-[120px]" />
        <div className="absolute top-1/3 -right-32 w-96 h-96 bg-blue-600/20 rounded-full blur-[140px]" />
        <div className="absolute bottom-10 left-1/3 w-80 h-80 bg-emerald-500/15 rounded-full blur-[110px]" />
      </div>

      <div className="relative max-w-xl mx-auto">
        {/* ─── TOP EXECUTIVE BADGE & ACTIONS ─── */}
        <div className="flex items-center justify-between mb-6 px-1 no-print">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/80 border border-amber-500/30 text-amber-400 text-xs font-semibold shadow-sm backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Available for Project Consultation</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowQR(true)}
              className="p-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-amber-400/50 text-slate-300 hover:text-amber-400 transition-all shadow-sm backdrop-blur-md"
              title="Show QR Code"
              aria-label="Show QR Code"
            >
              <QrCode className="w-4 h-4 text-amber-400" />
            </button>
            <button
              onClick={handleShare}
              className="p-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-amber-400/50 text-slate-300 hover:text-amber-400 transition-all shadow-sm backdrop-blur-md"
              title="Share Card"
              aria-label="Share Card"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={handlePrint}
              className="p-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-amber-400/50 text-slate-300 hover:text-amber-400 transition-all shadow-sm backdrop-blur-md hidden sm:block"
              title="Print Business Card"
              aria-label="Print Business Card"
            >
              <Printer className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ─── 3D INTERACTIVE PHYSICAL BUSINESS CARD SIMULATOR ─── */}
        <div className="mb-4 text-center no-print">
          <button
            onClick={() => setIsFlipped(!isFlipped)}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold text-slate-300 bg-slate-900/90 border border-slate-700/60 hover:border-amber-400/50 hover:text-amber-400 transition-all shadow-md group"
          >
            <RotateCw
              className={`w-3.5 h-3.5 text-amber-400 transition-transform duration-500 ${
                isFlipped ? "rotate-180" : "group-hover:rotate-45"
              }`}
            />
            <span>{isFlipped ? "Flip to Front Side" : "Flip to Back Side (QR & Details)"}</span>
          </button>
        </div>

        {/* 3D Flip Card Container */}
        <div
          className="relative w-full aspect-[1.75/1] min-h-[260px] sm:min-h-[300px] mb-8 cursor-pointer select-none perspective-[1200px]"
          onClick={() => setIsFlipped(!isFlipped)}
          title="Click to flip business card"
        >
          <div
            className="relative w-full h-full transition-transform duration-700 ease-in-out"
            style={{
              transformStyle: "preserve-3d",
              transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
            }}
          >
            {/* ════════ FRONT FACE (Obsidian & Gold Executive Foil) ════════ */}
            <div
              className="absolute inset-0 w-full h-full rounded-2xl sm:rounded-3xl p-6 sm:p-8 flex flex-col justify-between overflow-hidden shadow-2xl border border-amber-500/40 bg-gradient-to-br from-[#071626] via-[#0B2A4A] to-[#040e1a]"
              style={{
                backfaceVisibility: "hidden",
                WebkitBackfaceVisibility: "hidden",
              }}
            >
              {/* Engineering Blueprint Watermark */}
              <div
                className="absolute inset-0 opacity-10 pointer-events-none"
                style={{
                  backgroundImage:
                    "linear-gradient(rgba(242, 169, 0, 0.25) 1px, transparent 1px), linear-gradient(90deg, rgba(242, 169, 0, 0.25) 1px, transparent 1px)",
                  backgroundSize: "24px 24px",
                }}
              />

              {/* Gold Foil Accent Glow */}
              <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-amber-400/20 via-amber-500/5 to-transparent rounded-full blur-2xl pointer-events-none" />

              {/* Front Top: Company Brand & Monogram */}
              <div className="relative z-10 flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shadow-sm shadow-amber-400" />
                    <span className="text-[10px] sm:text-[11px] font-extrabold tracking-[0.2em] text-amber-400 uppercase">
                      HF Design & Engineering
                    </span>
                  </div>
                  <p className="text-[9px] sm:text-[10px] tracking-wider text-slate-300 uppercase font-medium">
                    Civil & Structural Engineering Solutions
                  </p>
                </div>

                {/* Metallic Gold Monogram Emblem */}
                <div className="relative group">
                  <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-amber-300 via-amber-500 to-amber-600 p-[1.5px] shadow-lg shadow-amber-500/20">
                    <div className="w-full h-full rounded-[10px] bg-[#071626] flex items-center justify-center">
                      <span className="font-extrabold text-sm sm:text-base tracking-tighter bg-gradient-to-br from-amber-200 via-amber-400 to-amber-500 bg-clip-text text-transparent font-heading">
                        HF
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Front Center: Executive Name & Title */}
              <div className="relative z-10 my-auto">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-400/10 border border-amber-400/20 text-[10px] font-semibold text-amber-300 uppercase tracking-wider mb-2">
                  <ShieldCheck className="w-3 h-3 text-amber-400" />
                  <span>Licensed Civil Engineer</span>
                </div>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-white font-heading tracking-tight drop-shadow-sm">
                  Engr. Md. Hasmot Ali
                </h2>
                <p className="text-xs sm:text-sm font-semibold text-amber-400 tracking-wide mt-0.5">
                  Founder & Principal Structural Consultant
                </p>
                <p className="text-[10px] sm:text-xs text-slate-300 font-medium mt-1 flex items-center gap-1.5">
                  <span>B.Sc. in Civil Engineering</span>
                  <span className="text-slate-500">·</span>
                  <span>BNBC 2020 Compliant Structural Designer</span>
                </p>
              </div>

              {/* Front Bottom: Coordinates & Flip Prompt */}
              <div className="relative z-10 pt-2 border-t border-slate-700/60 flex items-center justify-between text-[10px] sm:text-[11px] text-slate-300">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1 text-slate-200 font-medium">
                    <Phone className="w-3 h-3 text-amber-400" />
                    +880 1778-506500
                  </span>
                  <span className="hidden sm:flex items-center gap-1 text-slate-300">
                    <MapPin className="w-3 h-3 text-amber-400" />
                    Savar, Dhaka
                  </span>
                </div>

                <div className="flex items-center gap-1 text-amber-400/80 text-[10px] font-medium animate-pulse">
                  <span>Tap to flip</span>
                  <RotateCw className="w-2.5 h-2.5" />
                </div>
              </div>
            </div>

            {/* ════════ BACK FACE (QR Code & Full Coordinates) ════════ */}
            <div
              className="absolute inset-0 w-full h-full rounded-2xl sm:rounded-3xl p-6 sm:p-7 flex flex-col justify-between overflow-hidden shadow-2xl border border-amber-500/40 bg-gradient-to-br from-[#05111e] via-[#081f37] to-[#040e1a]"
              style={{
                backfaceVisibility: "hidden",
                WebkitBackfaceVisibility: "hidden",
                transform: "rotateY(180deg)",
              }}
            >
              {/* Blueprint Grid */}
              <div
                className="absolute inset-0 opacity-10 pointer-events-none"
                style={{
                  backgroundImage:
                    "linear-gradient(rgba(242, 169, 0, 0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(242, 169, 0, 0.2) 1px, transparent 1px)",
                  backgroundSize: "20px 20px",
                }}
              />

              {/* Back Top: Services Headline */}
              <div className="relative z-10 flex items-center justify-between pb-2 border-b border-slate-700/60">
                <div>
                  <p className="text-[10px] sm:text-xs font-bold text-amber-400 uppercase tracking-widest">
                    Core Specializations
                  </p>
                  <p className="text-[9px] text-slate-400">
                    Architectural Design · Structural Analysis · Soil Test · BOQ
                  </p>
                </div>
                <span className="text-[9px] font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                  Scan to Connect
                </span>
              </div>

              {/* Back Center: QR Code & Detailed Coordinates */}
              <div className="relative z-10 grid grid-cols-[auto_1fr] gap-4 sm:gap-6 items-center my-auto">
                {/* Embedded QR Code */}
                <div className="p-2 bg-white rounded-xl shadow-lg border border-amber-400/30 shrink-0">
                  {qrDataUrl ? (
                    <img
                      src={qrDataUrl}
                      alt="Scan Engr. Hasmot Ali's Business Card"
                      className="w-20 h-20 sm:w-24 sm:h-24 object-contain"
                    />
                  ) : (
                    <div className="w-20 h-20 sm:w-24 sm:h-24 bg-slate-200 animate-pulse rounded" />
                  )}
                </div>

                {/* Contact List */}
                <div className="space-y-1.5 text-[11px] sm:text-xs text-slate-200">
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span className="font-bold text-white tracking-wider">
                      +880 1778-506500
                    </span>
                    <span className="text-[10px] text-slate-400 font-normal">
                      (WhatsApp)
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="font-medium text-slate-300 tracking-wider">
                      +880 1631-186218
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span className="text-slate-300 truncate">
                      info@hfengineeringbd.com
                    </span>
                  </div>
                  <div className="flex items-start gap-2 text-slate-300">
                    <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                    <span className="text-[10px] sm:text-[11px] text-slate-400 leading-tight">
                      Aysha Monjil, House 14/05, Ward 01, Noyabari, Savar Radio Colony, Dhaka 1340
                    </span>
                  </div>
                </div>
              </div>

              {/* Back Bottom: Official Website & Tap */}
              <div className="relative z-10 pt-2 border-t border-slate-700/60 flex items-center justify-between text-[10px] text-slate-400">
                <span className="text-amber-400 font-medium">
                  hf-engineering.vercel.app
                </span>
                <span className="text-slate-400 flex items-center gap-1">
                  <span>Tap to flip front</span>
                  <RotateCw className="w-2.5 h-2.5" />
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ─── PRIMARY ACTION BUTTON: SAVE CONTACT (.vcf) ─── */}
        <div className="mb-6 no-print">
          <button
            onClick={handleDownloadVCard}
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black text-sm sm:text-base shadow-xl shadow-amber-500/20 hover:shadow-amber-500/35 flex items-center justify-center gap-3 transition-all duration-200 transform active:scale-[0.98] group"
          >
            <Download className="w-5 h-5 transition-transform group-hover:-translate-y-0.5" />
            <span>Save Contact to Phone (Add to Contacts)</span>
          </button>
          <p className="text-center text-xs text-slate-400 mt-2">
            One-tap direct download · Compatible with iPhone, Android & Outlook
          </p>
        </div>

        {/* ─── QUICK INTERACTION GRID (4 LARGE GLASS CARDS) ─── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6 no-print">
          {/* Direct Call */}
          <a
            href="tel:+8801778506500"
            className="flex flex-col items-center justify-center p-4 rounded-2xl bg-slate-900/90 hover:bg-slate-800/90 border border-slate-800 hover:border-amber-400/50 text-slate-200 hover:text-amber-400 transition-all shadow-md group"
          >
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 group-hover:bg-blue-500/20 flex items-center justify-center mb-2 text-blue-400 transition-colors">
              <Phone className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold">Call Direct</span>
            <span className="text-[10px] text-slate-400 mt-0.5">01778-506500</span>
          </a>

          {/* WhatsApp Direct */}
          <a
            href="https://wa.me/8801778506500?text=Hello%20Engr.%20Hasmot%20Ali%2C%20I%20would%20like%20to%20consult%20with%20you%20regarding%20building%20design%20and%20engineering%20services."
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-center p-4 rounded-2xl bg-slate-900/90 hover:bg-slate-800/90 border border-slate-800 hover:border-emerald-400/50 text-slate-200 hover:text-emerald-400 transition-all shadow-md group"
          >
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 group-hover:bg-emerald-500/20 flex items-center justify-center mb-2 text-emerald-400 transition-colors">
              <WhatsAppIcon className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold">WhatsApp</span>
            <span className="text-[10px] text-emerald-400/80 mt-0.5">Quick Reply</span>
          </a>

          {/* Email */}
          <a
            href="mailto:info@hfengineeringbd.com?subject=Engineering%20Design%20Inquiry%20-%20HF%20Engineering"
            className="flex flex-col items-center justify-center p-4 rounded-2xl bg-slate-900/90 hover:bg-slate-800/90 border border-slate-800 hover:border-amber-400/50 text-slate-200 hover:text-amber-400 transition-all shadow-md group"
          >
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 group-hover:bg-amber-500/20 flex items-center justify-center mb-2 text-amber-400 transition-colors">
              <Mail className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold">Send Email</span>
            <span className="text-[10px] text-slate-400 mt-0.5">Official Mail</span>
          </a>

          {/* Location Map */}
          <a
            href="https://maps.app.goo.gl/wdBzkKfqCw4Kbggs7"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-center p-4 rounded-2xl bg-slate-900/90 hover:bg-slate-800/90 border border-slate-800 hover:border-rose-400/50 text-slate-200 hover:text-rose-400 transition-all shadow-md group"
          >
            <div className="w-12 h-12 rounded-xl bg-rose-500/10 group-hover:bg-rose-500/20 flex items-center justify-center mb-2 text-rose-400 transition-colors">
              <MapPin className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold">Directions</span>
            <span className="text-[10px] text-slate-400 mt-0.5">Savar Office</span>
          </a>
        </div>

        {/* ─── EXECUTIVE CREDENTIALS CARD ─── */}
        <div className="bg-slate-900/85 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-xl mb-6 no-print">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-800 mb-5">
            <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-heading">
                Professional Credentials
              </h3>
              <p className="text-xs text-slate-400">
                A decade of trusted engineering practice in Savar & Dhaka
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center mb-6">
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
              <p className="text-xl font-extrabold text-amber-400 font-heading">10+ Years</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Field Experience</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
              <p className="text-xl font-extrabold text-white font-heading">500+</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Engineered Plans</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
              <p className="text-xl font-extrabold text-blue-400 font-heading">BNBC</p>
              <p className="text-[11px] text-slate-400 mt-0.5">2020 Standard</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
              <p className="text-xl font-extrabold text-emerald-400 font-heading">100%</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Transparent BOQ</p>
            </div>
          </div>

          {/* Core Services Tag Cloud */}
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
              <Layers className="w-3.5 h-3.5 text-amber-400" />
              <span>Full-Spectrum Engineering Services</span>
            </p>
            <div className="flex flex-wrap gap-2">
              {[
                "Architectural 2D Working Drawings",
                "Photorealistic 3D Exterior & Interior",
                "BNBC 2020 Structural Load Calculation",
                "Earthquake & Cyclone Resilient Design",
                "Paurashava & Union Parishad Plan Passing",
                "Soil Investigation & Deep Foundation",
                "Plumbing & Electrical (MEP) Layouts",
                "Accurate BOQ & Material Estimation",
                "On-Site Quality Supervision & Casting Checks",
              ].map((service) => (
                <span
                  key={service}
                  className="text-xs px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700/60 text-slate-200 font-medium"
                >
                  {service}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* ─── ONLINE PORTAL SHORTCUTS ─── */}
        <div className="bg-slate-900/85 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-xl mb-6 no-print">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
            <Globe className="w-3.5 h-3.5 text-amber-400" />
            <span>Interactive Client Tools & Links</span>
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link
              href="/book-appointment"
              className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950/60 hover:bg-slate-800 border border-slate-800 hover:border-amber-400/40 transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-amber-400/10 text-amber-400 flex items-center justify-center">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white group-hover:text-amber-400 transition-colors">
                    Book Consultation
                  </p>
                  <p className="text-[10px] text-slate-400">Schedule office or site appointment</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 transition-colors" />
            </Link>

            <Link
              href="/cost-estimator"
              className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950/60 hover:bg-slate-800 border border-slate-800 hover:border-emerald-400/40 transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                  <Calculator className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white group-hover:text-emerald-400 transition-colors">
                    Construction Estimator
                  </p>
                  <p className="text-[10px] text-slate-400">Calculate materials & budget</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 transition-colors" />
            </Link>

            <Link
              href="/track-plan"
              className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950/60 hover:bg-slate-800 border border-slate-800 hover:border-blue-400/40 transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
                  <Search className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white group-hover:text-blue-400 transition-colors">
                    Track Plan Status
                  </p>
                  <p className="text-[10px] text-slate-400">Live approval file tracker</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-blue-400 transition-colors" />
            </Link>

            <Link
              href="/portfolio"
              className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950/60 hover:bg-slate-800 border border-slate-800 hover:border-purple-400/40 transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center">
                  <Building2 className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white group-hover:text-purple-400 transition-colors">
                    Project Portfolio
                  </p>
                  <p className="text-[10px] text-slate-400">Browse completed buildings</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-purple-400 transition-colors" />
            </Link>
          </div>
        </div>

        {/* ─── CHAMBER / OFFICE LOCATION DETAILS ─── */}
        <div className="bg-slate-900/85 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-xl mb-6 no-print">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center shrink-0 mt-0.5">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-white">Chamber & Head Office</p>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  Aysha Monjil, House 14/05, Ward No. 01, Noyabari, Savar Radio Colony, Savar, Dhaka - 1340, Bangladesh.
                </p>
                <a
                  href="https://maps.app.goo.gl/wdBzkKfqCw4Kbggs7"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-400 hover:underline mt-2"
                >
                  <span>Open in Google Maps Navigation</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800/80 flex items-center gap-3 text-xs text-slate-300">
              <Clock className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Office Hours: Saturday – Thursday: 9:00 AM – 8:00 PM (Friday by appointment)</span>
            </div>
          </div>
        </div>

        {/* ─── SHARE & COPY BAR ─── */}
        <div className="flex items-center gap-2 mb-8 no-print">
          <button
            onClick={handleCopyLink}
            className="flex-1 py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-xs font-semibold text-slate-200 flex items-center justify-center gap-2 transition-colors shadow-sm"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-400">Card Link Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-slate-400" />
                <span>Copy Card Link</span>
              </>
            )}
          </button>

          <button
            onClick={() => setShowQR(true)}
            className="py-3 px-5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-amber-400/50 text-xs font-semibold text-amber-400 flex items-center justify-center gap-2 transition-colors shadow-sm"
          >
            <QrCode className="w-4 h-4" />
            <span>QR Code</span>
          </button>

          <Link
            href="/"
            className="py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-xs font-semibold text-slate-300 flex items-center justify-center gap-1.5 transition-colors shadow-sm"
          >
            <span>Home</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* ─── FOOTER COPYRIGHT ─── */}
        <div className="text-center text-xs text-slate-500 pb-8 no-print">
          <p>© {new Date().getFullYear()} HF Design & Engineering Solutions. All rights reserved.</p>
          <p className="text-[11px] text-slate-600 mt-1">Planned Design · Safe Construction · Savar, Dhaka</p>
        </div>
      </div>

      {/* ─── QR CODE MODAL FOR PRINTING & SHARING ─── */}
      {showQR && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative bg-slate-900 border border-slate-700/80 rounded-3xl p-6 sm:p-7 max-w-sm w-full text-center shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setShowQR(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-10 h-10 rounded-full bg-amber-400/10 text-amber-400 flex items-center justify-center mx-auto mb-3">
              <QrCode className="w-5 h-5" />
            </div>

            <h3 className="font-bold text-lg text-white font-heading mb-1">
              Digital Visiting Card QR Code
            </h3>
            <p className="text-xs text-slate-400 mb-5 leading-relaxed">
              Scan with any mobile camera or QR reader to instantly open this executive profile
            </p>

            {/* QR Box */}
            <div className="bg-white p-4 rounded-2xl inline-block shadow-xl mb-4 border-2 border-amber-400/30">
              {qrDataUrl ? (
                <img
                  src={qrDataUrl}
                  alt="QR Code for Engr. Hasmot Ali's Digital Business Card"
                  className="w-48 h-48 mx-auto"
                />
              ) : (
                <div className="w-48 h-48 flex items-center justify-center text-slate-400 text-xs">
                  Generating QR Code...
                </div>
              )}
            </div>

            <p className="text-xs text-amber-400 font-bold mb-6 tracking-wider">
              hf-engineering.vercel.app/card
            </p>

            {/* Action Buttons */}
            <div className="space-y-2.5">
              <button
                onClick={handleDownloadQR}
                className="w-full py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-lg shadow-amber-500/20"
              >
                <Download className="w-4 h-4" />
                <span>Download High-Res QR (For Print Cards)</span>
              </button>

              <button
                onClick={() => setShowQR(false)}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
