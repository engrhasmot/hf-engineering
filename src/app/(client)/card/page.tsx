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
  Award
} from "lucide-react";
import QRCode from "qrcode";
import { toast } from "sonner";
import { SITE_CONFIG, getSiteUrl } from "@/lib/constants";
import WhatsAppIcon from "@/components/shared/WhatsAppIcon";

export default function DigitalCardPage() {
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const cardUrl = typeof window !== "undefined" ? window.location.href : `${getSiteUrl()}/card`;

  // Generate QR Code on load
  useEffect(() => {
    QRCode.toDataURL(cardUrl, {
      width: 400,
      margin: 2,
      color: {
        dark: "#0B2A4A",
        light: "#FFFFFF",
      },
    })
      .then((url) => setQrDataUrl(url))
      .catch((err) => console.error("QR Code generation error:", err));
  }, [cardUrl]);

  // vCard (.vcf) download handler
  const handleDownloadVCard = () => {
    const vCardData = [
      "BEGIN:VCARD",
      "VERSION:3.0",
      "N:Ali;Md. Hasmot;Engr.;;",
      "FN:Engr. Md. Hasmot Ali",
      "ORG:HF Design & Engineering Solutions",
      "TITLE:Managing Director & Lead Structural Consultant",
      "TEL;TYPE=CELL,VOICE,pref:+8801778506500",
      "TEL;TYPE=WORK,VOICE:+8801631186218",
      "EMAIL;TYPE=WORK,INTERNET:info@hfengineeringbd.com",
      "URL;TYPE=WORK:https://hfengineeringbd.com",
      "ADR;TYPE=WORK,POSTAL,PARCEL:;;Aysha Monjil, House 14/05, Ward 1, Noyabari;Savar Radio Colony;Dhaka;1340;Bangladesh",
      "NOTE:Civil Engineer, Building Architectural & Structural Design, BNBC Standard Detailing, Pourashabha & Rajuk Plan Approval in Savar, Dhaka.",
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

    toast.success("ইঞ্জিনিয়ার মোঃ হাসমত আলীর কন্টাক্ট ফাইল ডাউনলোড হয়েছে! আপনার ফোনে সেভ করুন।");
  };

  // Copy card link
  const handleCopyLink = () => {
    navigator.clipboard.writeText(cardUrl);
    setCopied(true);
    toast.success("ডিজিটাল কার্ডের লিংক কপি করা হয়েছে!");
    setTimeout(() => setCopied(false), 2500);
  };

  // Share card (Web Share API fallback to copy)
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "ইঞ্জিনিয়ার মোঃ হাসমত আলী — ডিজিটাল ভিজিটিং কার্ড",
          text: "ইঞ্জিনিয়ার মোঃ হাসমত আলী (Managing Director, HF Design & Engineering Solutions) এর অফিসিয়াল ডিজিটাল ভিজিটিং কার্ড।",
          url: cardUrl,
        });
      } catch (err) {
        // User cancelled or share failed
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
    link.download = "Engr_Hasmot_Ali_Visiting_Card_QR.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("QR কোড ছবি ডাউনলোড হয়েছে! ভিজিটিং কার্ড বা পোস্টারে প্রিন্ট করতে পারবেন।");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-6 px-3 sm:px-6 flex items-center justify-center">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-30">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-amber-500/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -right-40 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md mx-auto">
        {/* Main Card Container */}
        <div className="relative bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl shadow-2xl overflow-hidden transition-all duration-300 hover:border-amber-500/30">
          {/* Header Banner */}
          <div className="relative h-36 bg-gradient-to-br from-[#0B2A4A] via-slate-900 to-slate-950 p-4 flex flex-col justify-between overflow-hidden border-b border-slate-800">
            {/* Grid Pattern */}
            <div
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage:
                  "radial-gradient(#F2A900 1px, transparent 1px), radial-gradient(#F2A900 1px, transparent 1px)",
                backgroundSize: "20px 20px",
                backgroundPosition: "0 0, 10px 10px",
              }}
            />

            {/* Top Bar Actions */}
            <div className="relative z-10 flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                পরামর্শের জন্য সক্রিয়
              </span>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setShowQR(true)}
                  className="p-2 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-200 transition-colors shadow-sm"
                  title="QR কোড দেখুন"
                >
                  <QrCode className="w-4 h-4 text-amber-400" />
                </button>
                <button
                  onClick={handleShare}
                  className="p-2 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-200 transition-colors shadow-sm"
                  title="শেয়ার করুন"
                >
                  <Share2 className="w-4 h-4 text-slate-200" />
                </button>
              </div>
            </div>

            {/* Brand Logo & Slogan */}
            <div className="relative z-10 flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold tracking-wider text-amber-400/90 uppercase">
                  HF DESIGN & ENGINEERING
                </p>
                <p className="text-[10px] text-slate-400">পরিকল্পিত নকশা, নিরাপদ নির্মাণ</p>
              </div>
              <div className="w-8 h-8 rounded-lg bg-amber-400/10 border border-amber-400/30 flex items-center justify-center font-bold text-amber-400 text-sm">
                HF
              </div>
            </div>
          </div>

          {/* Profile Section */}
          <div className="relative px-6 pt-0 pb-6">
            {/* Avatar */}
            <div className="relative -mt-14 mb-4 flex items-end justify-between">
              <div className="relative">
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 p-[2px] shadow-xl">
                  <div className="w-full h-full rounded-[14px] bg-slate-900 flex items-center justify-center overflow-hidden">
                    {/* Engr Initials or Profile Image */}
                    <div className="w-full h-full bg-[#0B2A4A] flex flex-col items-center justify-center text-amber-400 font-bold">
                      <Compass className="w-8 h-8 mb-1 text-amber-400" />
                      <span className="text-xs tracking-wider">ENGR</span>
                    </div>
                  </div>
                </div>
                {/* Verified Shield */}
                <div
                  className="absolute -bottom-1 -right-1 bg-amber-500 text-slate-950 p-1 rounded-full shadow-md border-2 border-slate-900"
                  title="যাচাইকৃত সিভিল ইঞ্জিনিয়ার"
                >
                  <ShieldCheck className="w-4 h-4" />
                </div>
              </div>

              {/* Company pill */}
              <Link
                href="/"
                className="text-xs font-semibold text-slate-300 hover:text-amber-400 flex items-center gap-1 transition-colors bg-slate-800/80 px-3 py-1.5 rounded-full border border-slate-700/60"
              >
                <span>মূল ওয়েবসাইট</span>
                <ExternalLink className="w-3 h-3" />
              </Link>
            </div>

            {/* Name & Title */}
            <div className="mb-5">
              <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
                ইঞ্জিনিয়ার মোঃ হাসমত আলী
              </h1>
              <p className="text-xs font-semibold text-amber-400 uppercase tracking-wide mt-0.5">
                Engr. Md. Hasmot Ali
              </p>
              <div className="mt-2 space-y-1">
                <p className="text-sm font-medium text-slate-200 flex items-center gap-1.5">
                  <Briefcase className="w-4 h-4 text-amber-400 shrink-0" />
                  ব্যবস্থাপনা পরিচালক ও প্রধান কনসালটেন্ট
                </p>
                <p className="text-xs text-slate-400 flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-slate-400 shrink-0" />
                  এইচএফ ডিজাইন অ্যান্ড ইঞ্জিনিয়ারিং সলিউশনস
                </p>
                <p className="text-xs text-slate-400 flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-slate-400 shrink-0" />
                  বি.এস.সি ইন সিভিল ইঞ্জিনিয়ারিং | স্ট্রাকচারাল ডিজাইনার
                </p>
              </div>
            </div>

            {/* ⭐ PRIMARY ACTION: SAVE TO CONTACTS (.vcf) ⭐ */}
            <div className="mb-5">
              <button
                onClick={handleDownloadVCard}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 flex items-center justify-center gap-2.5 transition-all duration-200 transform active:scale-[0.98]"
              >
                <Download className="w-5 h-5" />
                <span>ফোনে নম্বর সেভ করুন (Save Contact)</span>
              </button>
            </div>

            {/* 4 Quick Contact Grid */}
            <div className="grid grid-cols-4 gap-2.5 mb-5">
              {/* Call */}
              <a
                href="tel:+8801778506500"
                className="flex flex-col items-center justify-center p-3 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 hover:border-amber-400/40 text-slate-200 hover:text-amber-400 transition-all group"
              >
                <div className="w-10 h-10 rounded-full bg-blue-500/10 group-hover:bg-blue-500/20 flex items-center justify-center mb-1 text-blue-400">
                  <Phone className="w-4 h-4" />
                </div>
                <span className="text-[11px] font-semibold">কল দিন</span>
              </a>

              {/* WhatsApp */}
              <a
                href="https://wa.me/8801778506500?text=%E0%A6%86%E0%A6%B8%E0%A6%B8%E0%A6%BE%E0%A6%B2%E0%A6%BE%E0%A6%AE%E0%A7%81%20%E0%A6%86%E0%A6%B2%E0%A6%BE%E0%A6%87%E0%A6%95%E0%A7%81%E0%A6%AE%2C%20%E0%A6%87%E0%A6%9E%E0%A7%8D%E0%A6%9C%E0%A6%BF%E0%A6%A8%E0%A6%BF%E0%A6%AF%E0%A6%BC%E0%A6%BE%E0%A6%B0%20%E0%A6%B9%E0%A6%BE%E0%A6%B8%E0%A6%AE%E0%A6%A4%20%E0%A6%86%E0%A6%B2%E0%A7%80%E0%A6%B0%20%E0%A6%B8%E0%A6%BE%E0%A6%A5%E0%A7%87%20%E0%A6%AA%E0%A7%8D%E0%A6%B2%E0%A7%8D%E0%A6%AF%E0%A6%BE%E0%A6%A8%20%E0%A6%93%20%E0%A6%A1%E0%A6%BF%E0%A6%9C%E0%A6%BE%E0%A6%87%E0%A6%A8%20%E0%A6%A8%E0%A6%BF%E0%A6%AF%E0%A6%BC%E0%A7%87%20%E0%A6%95%E0%A6%A5%E0%A6%BE%20%E0%A6%AC%E0%A6%B2%E0%A6%A4%E0%A7%87%20%E0%A6%9A%E0%A6%BE%E0%A6%87%E0%A5%A4"
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center justify-center p-3 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 hover:border-emerald-400/40 text-slate-200 hover:text-emerald-400 transition-all group"
              >
                <div className="w-10 h-10 rounded-full bg-emerald-500/10 group-hover:bg-emerald-500/20 flex items-center justify-center mb-1 text-emerald-400">
                  <WhatsAppIcon className="w-4 h-4" />
                </div>
                <span className="text-[11px] font-semibold">WhatsApp</span>
              </a>

              {/* Email */}
              <a
                href="mailto:info@hfengineeringbd.com"
                className="flex flex-col items-center justify-center p-3 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 hover:border-amber-400/40 text-slate-200 hover:text-amber-400 transition-all group"
              >
                <div className="w-10 h-10 rounded-full bg-amber-500/10 group-hover:bg-amber-500/20 flex items-center justify-center mb-1 text-amber-400">
                  <Mail className="w-4 h-4" />
                </div>
                <span className="text-[11px] font-semibold">ইমেইল</span>
              </a>

              {/* Map */}
              <a
                href="https://maps.app.goo.gl/wdBzkKfqCw4Kbggs7"
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center justify-center p-3 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 hover:border-rose-400/40 text-slate-200 hover:text-rose-400 transition-all group"
              >
                <div className="w-10 h-10 rounded-full bg-rose-500/10 group-hover:bg-rose-500/20 flex items-center justify-center mb-1 text-rose-400">
                  <MapPin className="w-4 h-4" />
                </div>
                <span className="text-[11px] font-semibold">ম্যাপ</span>
              </a>
            </div>

            {/* Phone Numbers List */}
            <div className="p-3.5 rounded-xl bg-slate-800/50 border border-slate-800 mb-5 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-amber-400" />
                  প্রধান নম্বর (হোয়াটসঅ্যাপ):
                </span>
                <a
                  href="tel:+8801778506500"
                  className="font-bold text-amber-400 hover:underline tracking-wider"
                >
                  01778-506500
                </a>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  বিকল্প ও বিকাশ/নগদ:
                </span>
                <a
                  href="tel:+8801631186218"
                  className="font-semibold text-slate-200 hover:underline tracking-wider"
                >
                  01631-186218
                </a>
              </div>
            </div>

            {/* Quick Service Links */}
            <div className="mb-5">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2.5">
                প্রয়োজনীয় লিংক ও সেবাসমূহ
              </p>
              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/book-appointment"
                  className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-800/60 hover:bg-slate-800 border border-slate-700/40 text-xs text-slate-200 hover:text-amber-400 transition-colors"
                >
                  <Calendar className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>সাক্ষাতের শিডিউল নিন</span>
                </Link>

                <Link
                  href="/cost-estimator"
                  className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-800/60 hover:bg-slate-800 border border-slate-700/40 text-xs text-slate-200 hover:text-amber-400 transition-colors"
                >
                  <Calculator className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>বাড়ি তৈরির খরচ হিসাব</span>
                </Link>

                <Link
                  href="/track-plan"
                  className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-800/60 hover:bg-slate-800 border border-slate-700/40 text-xs text-slate-200 hover:text-amber-400 transition-colors"
                >
                  <Search className="w-4 h-4 text-blue-400 shrink-0" />
                  <span>প্ল্যান ফাইল ট্র্যাকিং</span>
                </Link>

                <Link
                  href="/portfolio"
                  className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-800/60 hover:bg-slate-800 border border-slate-700/40 text-xs text-slate-200 hover:text-amber-400 transition-colors"
                >
                  <Building2 className="w-4 h-4 text-purple-400 shrink-0" />
                  <span>প্রজেক্ট পোর্টফোলিও</span>
                </Link>
              </div>
            </div>

            {/* Services Tags */}
            <div className="mb-5">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                বিশেষজ্ঞ সেবাসমূহ
              </p>
              <div className="flex flex-wrap gap-1.5">
                {[
                  "আর্কিটেকচারাল ২D/৩D প্ল্যান",
                  "বিএনবিসি স্ট্রাকচারাল ডিজাইন",
                  "রাজউক ও পৌরসভা প্ল্যান পাস",
                  "সয়েল টেস্ট ও পাইল ডিজাইন",
                  "ইলেকট্রিক্যাল ও প্লাম্বিং",
                  "প্রাক্কলন ও ম্যাটেরিয়াল BOQ",
                  "সাইট সুপারভিশন",
                ].map((s) => (
                  <span
                    key={s}
                    className="text-[10px] px-2.5 py-1 rounded-md bg-slate-800/70 border border-slate-700/50 text-slate-300"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Chamber / Office Location Details */}
            <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-800 text-xs space-y-1.5 mb-5">
              <div className="flex items-start gap-2 text-slate-300">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-white">চেম্বার ও প্রধান কার্যালয়:</p>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    আয়শা মঞ্জিল, বাড়ি ১৪/০৫, ওয়ার্ড নং ১, নয়াবাড়ি, সাভার রেডিও কলোনি, ঢাকা।
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-slate-400 text-[11px] pt-1 border-t border-slate-800/80">
                <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>শনিবার – বৃহস্পতিবার: সকাল ৯:০০ – রাত ৮:০০</span>
              </div>
            </div>

            {/* Share & Copy Bar */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyLink}
                className="flex-1 py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 flex items-center justify-center gap-2 transition-colors border border-slate-700/60"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span className="text-emerald-400">লিংক কপি হয়েছে</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-slate-400" />
                    <span>লিংক কপি করুন</span>
                  </>
                )}
              </button>

              <button
                onClick={() => setShowQR(true)}
                className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-amber-400 flex items-center justify-center gap-1.5 transition-colors border border-slate-700/60"
              >
                <QrCode className="w-4 h-4" />
                <span>QR কোড</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer Credit */}
        <p className="text-center text-[11px] text-slate-500 mt-4">
          © {new Date().getFullYear()} HF Design & Engineering Solutions. All rights reserved.
        </p>
      </div>

      {/* QR Code Modal for Physical Visiting Card Print */}
      {showQR && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative bg-slate-900 border border-slate-700 rounded-3xl p-6 max-w-xs w-full text-center shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <h3 className="font-bold text-lg text-white mb-1">ডিজিটাল কার্ড QR কোড</h3>
            <p className="text-xs text-slate-400 mb-4">
              মোবাইল ক্যামেরা দিয়ে স্ক্যান করলেই এই প্রোফাইল ওপেন হবে
            </p>

            {/* QR Image Box */}
            <div className="bg-white p-4 rounded-2xl inline-block shadow-inner mb-4">
              {qrDataUrl ? (
                <img
                  src={qrDataUrl}
                  alt="QR Code"
                  className="w-48 h-48 mx-auto"
                />
              ) : (
                <div className="w-48 h-48 flex items-center justify-center text-slate-400 text-xs">
                  QR কোড লোড হচ্ছে...
                </div>
              )}
            </div>

            <p className="text-[11px] text-amber-400 font-semibold mb-5">
              hfengineeringbd.com/card
            </p>

            {/* Actions */}
            <div className="space-y-2">
              <button
                onClick={handleDownloadQR}
                className="w-full py-2.5 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-md"
              >
                <Download className="w-4 h-4" />
                <span>QR কোড ডাউনলোড (প্রিন্ট করার জন্য)</span>
              </button>

              <button
                onClick={() => setShowQR(false)}
                className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
              >
                বন্ধ করুন
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
