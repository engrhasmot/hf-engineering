"use client";

import { useState } from "react";
import { format } from "date-fns";
import { DayPicker } from "react-day-picker";
import {
  MapPin,
  Building2,
  User,
  Phone,
  Mail,
  Loader2,
  Calendar,
  CheckCircle2,
  Clock,
  ArrowRight,
  ArrowLeft,
  FileText,
  HardHat,
  Compass,
  AlertCircle,
  MessageCircle,
  Sparkles,
} from "lucide-react";
import WhatsAppIcon from "@/components/shared/WhatsAppIcon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { SITE_CONFIG } from "@/lib/constants";
import "react-day-picker/style.css";

type ConsultationType = "consultation" | "site-visit" | "urgent-casting";
type ProjectCategory = "Residential Apartment" | "Commercial Complex" | "Duplex Villa" | "Industrial / Factory";

interface TimeSlotGroup {
  period: string;
  periodBn: string;
  slots: string[];
}

const TIME_SLOT_GROUPS: TimeSlotGroup[] = [
  {
    period: "Morning",
    periodBn: "সকাল",
    slots: ["10:00 AM", "11:30 AM"],
  },
  {
    period: "Afternoon",
    periodBn: "দুপুর / বিকেল",
    slots: ["02:30 PM", "04:00 PM"],
  },
  {
    period: "Evening",
    periodBn: "সন্ধ্যা",
    slots: ["05:30 PM", "07:00 PM"],
  },
];

export default function BookingForm() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);

  // Form Fields
  const [consultationType, setConsultationType] = useState<ConsultationType>("consultation");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [location, setLocation] = useState("");
  const [projectCategory, setProjectCategory] = useState<ProjectCategory>("Residential Apartment");
  const [landOrFloors, setLandOrFloors] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [timeSlot, setTimeSlot] = useState("");
  const [notes, setNotes] = useState("");
  const [appointmentId, setAppointmentId] = useState<string>("");

  // Disable past days and today (minimum booking tomorrow, except for emergency hotline)
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const disabledDays = { before: new Date(today.getTime() + 86400000) };

  // Validate Step 1
  const handleProceedToStep2 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("অনুগ্রহ করে আপনার পুরো নাম লিখুন (Please enter your full name)");
      return;
    }
    const cleanPhone = phone.replace(/[\s-]/g, "");
    if (!cleanPhone || cleanPhone.length < 10) {
      toast.error("অনুগ্রহ করে সঠিক মোবাইল নম্বর দিন (e.g. 017XXXXXXXX)");
      return;
    }
    setStep(2);
  };

  // Submit Booking to API
  const handleSubmitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate) {
      toast.error("অনুগ্রহ করে সাক্ষাতের তারিখ নির্বাচন করুন (Please select a date)");
      return;
    }
    if (!timeSlot) {
      toast.error("অনুগ্রহ করে সময় নির্ধারণ করুন (Please select a time slot)");
      return;
    }

    setLoading(true);

    // Map internal type to API schema: 'site-visit' | 'consultation' | 'follow-up'
    const apiType = consultationType === "consultation" ? "consultation" : "site-visit";
    const combinedNotes = [
      consultationType === "urgent-casting" ? "[URGENT CASTING INSPECTION]" : "",
      `Project Category: ${projectCategory}`,
      landOrFloors ? `Scale: ${landOrFloors}` : "",
      notes ? `Client Notes: ${notes}` : "",
    ]
      .filter(Boolean)
      .join(" | ");

    try {
      const response = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          email: email.trim() || undefined,
          appointmentType: apiType,
          date: format(selectedDate, "yyyy-MM-dd"),
          timeSlot,
          location: location.trim() || "Savar / Dhaka Area",
          notes: combinedNotes,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "অ্যাপয়েন্টমেন্ট বুকিং করতে সমস্যা হয়েছে");
      }

      setAppointmentId(data.data?.appointmentId || "");
      setSuccess(true);
      toast.success("অ্যাপয়েন্টমেন্ট বুকিং সফল হয়েছে! আমাদের টিম শীঘ্রই যোগাযোগ করবে।");
    } catch (error: any) {
      toast.error(error.message || "Something went wrong. Please call directly.");
    } finally {
      setLoading(false);
    }
  };

  // WhatsApp confirmation deep link
  const getWhatsAppConfirmationLink = () => {
    const typeLabel =
      consultationType === "consultation"
        ? "অফিস পরামর্শ (Office Consultation)"
        : consultationType === "urgent-casting"
        ? "জরুরি ছাদ/ফাউন্ডেশন ঢালাই তদারকি (Urgent Casting)"
        : "সাইট ও জমি পরিদর্শন (Site Visit)";

    const msg =
      `আসসালামু আলাইকুম HF Design & Engineering Solutions,\n` +
      `আমি ওয়েবসাইট থেকে অ্যাপয়েন্টমেন্ট বুক করেছি।\n\n` +
      `• নাম: ${name}\n` +
      `• ফোন: ${phone}\n` +
      `• সেবার ধরন: ${typeLabel}\n` +
      `• প্রজেক্ট এরিয়া: ${location || "সাভার / ঢাকা"}\n` +
      `• ধরন: ${projectCategory} ${landOrFloors ? `(${landOrFloors})` : ""}\n` +
      `• প্রস্তাবিত তারিখ: ${selectedDate ? format(selectedDate, "dd MMMM, yyyy") : ""}\n` +
      `• সময়: ${timeSlot}\n\n` +
      `অনুগ্রহ করে অ্যাপয়েন্টমেন্টটি কনফার্ম করবেন।`;

    return `https://wa.me/${SITE_CONFIG.whatsapp}?text=${encodeURIComponent(msg)}`;
  };

  const handleReset = () => {
    setSuccess(false);
    setStep(1);
    setName("");
    setPhone("");
    setEmail("");
    setLocation("");
    setSelectedDate(undefined);
    setTimeSlot("");
    setNotes("");
    setLandOrFloors("");
  };

  return (
    <div className="bg-card text-card-foreground shadow-xl rounded-3xl p-6 sm:p-9 border border-border transition-all">
      {/* ─── SUCCESS SCREEN ─── */}
      {success ? (
        <div className="py-6 text-center animate-in fade-in zoom-in-95 duration-400">
          <div className="w-20 h-20 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center mx-auto mb-5 border-2 border-emerald-500/30">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <Badge className="mb-3 bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 text-xs px-3 py-1">
            বুকিং সফলভাবে গৃহীত হয়েছে · Request Received
          </Badge>

          <h3 className="text-2xl sm:text-3xl font-extrabold font-heading text-foreground mb-3">
            ধন্যবাদ, {name}!
          </h3>

          <p className="text-muted-foreground text-sm sm:text-base max-w-lg mx-auto mb-8 leading-relaxed">
            আপনার অ্যাপয়েন্টমেন্টের অনুরোধটি আমাদের ইঞ্জিনিয়ারিং টিমের কাছে পৌঁছেছে। আমাদের প্রধান ইঞ্জিনিয়ার
            জনাব মোঃ হাসমত আলী অথবা প্রতিনিধি খুব দ্রুত আপনার ফোনে কল করে সময়টি নিশ্চিত করবেন।
          </p>

          {/* Appointment Summary Box */}
          <div className="bg-muted/40 rounded-2xl p-5 sm:p-6 border border-border/80 text-left max-w-md mx-auto mb-8 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-border/60 text-xs text-muted-foreground">
              <span>অ্যাপয়েন্টমেন্ট ধরন</span>
              <span className="font-bold text-foreground">
                {consultationType === "consultation"
                  ? "অফিস পরামর্শ (Office Visit)"
                  : consultationType === "urgent-casting"
                  ? "জরুরি ঢালাই তদারকি (Casting)"
                  : "সাইট পরিদর্শন (Site Visit)"}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>নির্ধারিত তারিখ</span>
              <span className="font-bold text-foreground">
                {selectedDate ? format(selectedDate, "dd MMMM, yyyy") : ""}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>সময়</span>
              <span className="font-bold text-foreground">{timeSlot}</span>
            </div>

            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>স্থান</span>
              <span className="font-bold text-foreground">{location || "সাভার রেডিও কলোনি অফিস"}</span>
            </div>

            {appointmentId && (
              <div className="flex items-center justify-between pt-2 border-t border-border/60 text-xs text-muted-foreground">
                <span>রেফারেন্স আইডি</span>
                <span className="font-mono text-accent font-bold">#{appointmentId.slice(-6).toUpperCase()}</span>
              </div>
            )}
          </div>

          {/* Immediate WhatsApp Confirmation Button */}
          <div className="max-w-md mx-auto space-y-3">
            <a href={getWhatsAppConfirmationLink()} target="_blank" rel="noopener noreferrer" className="block">
              <Button className="w-full h-13 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-base gap-2.5 shadow-lg shadow-emerald-600/20">
                <WhatsAppIcon className="w-5 h-5" />
                <span>তাৎক্ষণিক হোয়াটসঅ্যাপে কনফার্ম করুন</span>
              </Button>
            </a>

            <button
              onClick={handleReset}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors pt-2 block mx-auto underline underline-offset-4"
            >
              আরেকটি অ্যাপয়েন্টমেন্ট বুক করুন (Book Another)
            </button>
          </div>
        </div>
      ) : (
        /* ─── MULTI-STEP BOOKING FORM ─── */
        <div>
          {/* Form Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-accent flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                ধাপ {step} এর ২ · Step {step} of 2
              </span>
              <span className="text-xs text-muted-foreground">
                {step === 1 ? "কন্টাক্ট ও প্রজেক্ট তথ্য" : "তারিখ ও সময় নির্ধারণ"}
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-foreground tracking-tight">
              {step === 1 ? "পরামর্শের ধরন ও তথ্য দিন" : "তারিখ ও সময় নির্বাচন করুন"}
            </h2>
            <p className="text-muted-foreground text-sm mt-1 leading-relaxed">
              {step === 1
                ? "আপনার সুবিধাজনক পরামর্শের ধরন নির্বাচন করে প্রাথমিক তথ্য পূরণ করুন।"
                : "ইঞ্জিনিয়ারের সাথে সাক্ষাত বা সাইট ভিজিটের জন্য উপযুক্ত তারিখ ও সময় বেছে নিন।"}
            </p>
          </div>

          {/* Step 1: Mode & Details */}
          {step === 1 && (
            <form onSubmit={handleProceedToStep2} className="space-y-6 animate-in fade-in duration-300">
              {/* Consultation Type Selector (3 Cards) */}
              <div className="space-y-2.5">
                <Label className="text-sm font-bold text-foreground">
                  ১. পরামর্শের ধরন নির্বাচন করুন *
                </Label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Option 1: Office Consultation */}
                  <div
                    onClick={() => setConsultationType("consultation")}
                    className={`cursor-pointer rounded-2xl p-4 border-2 transition-all flex flex-col justify-between ${
                      consultationType === "consultation"
                        ? "border-primary bg-primary/5 shadow-md shadow-primary/10"
                        : "border-border hover:border-border/80 bg-background"
                    }`}
                  >
                    <div>
                      <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-3">
                        <Building2 className="w-4 h-4" />
                      </div>
                      <p className="text-sm font-bold text-foreground">অফিস কনসালটেশন</p>
                      <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                        সাভার রেডিও কলোনি অফিসে বসে ড্রয়িং ও বাজেট আলোচনা।
                      </p>
                    </div>
                    <span className="mt-3 inline-block text-[11px] font-bold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-md self-start">
                      ১০০% ফ্রি পরামর্শ
                    </span>
                  </div>

                  {/* Option 2: On-site Land Visit */}
                  <div
                    onClick={() => setConsultationType("site-visit")}
                    className={`cursor-pointer rounded-2xl p-4 border-2 transition-all flex flex-col justify-between ${
                      consultationType === "site-visit"
                        ? "border-primary bg-primary/5 shadow-md shadow-primary/10"
                        : "border-border hover:border-border/80 bg-background"
                    }`}
                  >
                    <div>
                      <div className="w-9 h-9 rounded-xl bg-accent/20 text-accent flex items-center justify-center mb-3">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <p className="text-sm font-bold text-foreground">সাইট ও জমি ভিজিট</p>
                      <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                        জমির মাপ, রাস্তা, মাটি ও সীমানা সরাসরি ইঞ্জিনিয়ার দ্বারা পরিদর্শন।
                      </p>
                    </div>
                    <span className="mt-3 inline-block text-[11px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-md self-start">
                      সাইট পরিমাপ
                    </span>
                  </div>

                  {/* Option 3: Urgent Casting */}
                  <div
                    onClick={() => setConsultationType("urgent-casting")}
                    className={`cursor-pointer rounded-2xl p-4 border-2 transition-all flex flex-col justify-between ${
                      consultationType === "urgent-casting"
                        ? "border-rose-500 bg-rose-500/5 shadow-md shadow-rose-500/10"
                        : "border-border hover:border-border/80 bg-background"
                    }`}
                  >
                    <div>
                      <div className="w-9 h-9 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center mb-3">
                        <HardHat className="w-4 h-4" />
                      </div>
                      <p className="text-sm font-bold text-foreground">ঢালাই তদারকি</p>
                      <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                        ছাদ বা ফাউন্ডেশন ঢালাইয়ের সময় রড, সাটারিং ও কংক্রিট চেকিং।
                      </p>
                    </div>
                    <span className="mt-3 inline-block text-[11px] font-bold text-rose-600 bg-rose-500/10 px-2 py-0.5 rounded-md self-start">
                      জরুরি সাইট পরিদর্শন
                    </span>
                  </div>
                </div>
              </div>

              {/* Name & Phone Number */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-xs font-bold text-foreground flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-accent" />
                    আপনার পুরো নাম *
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="e.g. মোঃ আশরাফুল ইসলাম"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="h-12 rounded-xl bg-background border-border"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-xs font-bold text-foreground flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-accent" />
                    মোবাইল নম্বর (হোয়াটসঅ্যাপ সহ) *
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="017XXXXXXXX"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    className="h-12 rounded-xl bg-background border-border"
                  />
                </div>
              </div>

              {/* Location & Optional Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="location" className="text-xs font-bold text-foreground flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-accent" />
                    প্রজেক্ট বা জমির লোকেশন
                  </Label>
                  <Input
                    id="location"
                    type="text"
                    placeholder="e.g. রেডিও কলোনি, সাভার / আশুলিয়া"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="h-12 rounded-xl bg-background border-border"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-xs font-bold text-foreground flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-muted-foreground" />
                    ইমেইল ঠিকানা (ঐচ্ছিক)
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="yourname@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-12 rounded-xl bg-background border-border"
                  />
                </div>
              </div>

              {/* Project Category */}
              <div className="space-y-2">
                <Label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-accent" />
                  ভবন বা প্রজেক্টের ক্যাটাগরি
                </Label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(
                    [
                      "Residential Apartment",
                      "Commercial Complex",
                      "Duplex Villa",
                      "Industrial / Factory",
                    ] as ProjectCategory[]
                  ).map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setProjectCategory(cat)}
                      className={`py-2.5 px-2 text-xs font-semibold rounded-xl border transition-all text-center ${
                        projectCategory === cat
                          ? "bg-primary text-primary-foreground border-primary shadow-xs"
                          : "bg-background hover:bg-muted text-foreground border-border"
                      }`}
                    >
                      {cat === "Residential Apartment"
                        ? "আবাসিক ভবন"
                        : cat === "Commercial Complex"
                        ? "বাণিজ্যিক ভবন"
                        : cat === "Duplex Villa"
                        ? "ডুপ্লেক্স বাড়ি"
                        : "কারখানা / ফ্যাক্টরি"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Land / Floor Scale */}
              <div className="space-y-2">
                <Label htmlFor="scale" className="text-xs font-bold text-foreground flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5 text-muted-foreground" />
                  জমির পরিমাণ বা তলার সংখ্যা (সংক্ষেপে)
                </Label>
                <Input
                  id="scale"
                  type="text"
                  placeholder="e.g. ৩.৫ কাঠা জমি, ৬ তলা ভবন প্রস্তাবিত"
                  value={landOrFloors}
                  onChange={(e) => setLandOrFloors(e.target.value)}
                  className="h-11 rounded-xl bg-background border-border text-sm"
                />
              </div>

              {/* Next Step Button */}
              <Button type="submit" className="w-full h-13 rounded-2xl text-base font-bold gap-2 shadow-lg">
                <span>তারিখ ও সময় নির্বাচন করুন</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </form>
          )}

          {/* Step 2: Date & Time Picker */}
          {step === 2 && (
            <form onSubmit={handleSubmitBooking} className="space-y-6 animate-in fade-in duration-300">
              {/* DayPicker Interactive Calendar */}
              <div className="space-y-2">
                <Label className="text-xs font-bold text-foreground flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-accent" />
                    সাক্ষাতের তারিখ বেছে নিন *
                  </span>
                  {selectedDate && (
                    <span className="text-primary font-bold text-xs">
                      নির্বাচিত: {format(selectedDate, "dd MMMM, yyyy")}
                    </span>
                  )}
                </Label>

                <div className="flex justify-center bg-background p-3 sm:p-5 rounded-2xl border border-border shadow-inner">
                  <DayPicker
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={disabledDays}
                    className="!m-0 text-foreground"
                  />
                </div>
              </div>

              {/* Time Slots Categorized */}
              <div className="space-y-3">
                <Label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-accent" />
                  উপযুক্ত সময় স্লট বেছে নিন *
                </Label>

                <div className="space-y-3">
                  {TIME_SLOT_GROUPS.map((group) => (
                    <div key={group.period} className="space-y-1.5">
                      <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                        {group.periodBn} ({group.period})
                      </p>
                      <div className="grid grid-cols-2 gap-2">
                        {group.slots.map((slot) => {
                          const isSelected = timeSlot === slot;
                          return (
                            <button
                              key={slot}
                              type="button"
                              onClick={() => setTimeSlot(slot)}
                              className={`py-3 px-4 rounded-xl border text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
                                isSelected
                                  ? "bg-accent text-primary-foreground border-accent shadow-md shadow-accent/20 scale-[1.01]"
                                  : "bg-background hover:bg-muted text-foreground border-border"
                              }`}
                            >
                              <Clock className={`w-3.5 h-3.5 ${isSelected ? "text-primary-foreground" : "text-muted-foreground"}`} />
                              <span>{slot}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Optional Notes */}
              <div className="space-y-2">
                <Label htmlFor="notes" className="text-xs font-bold text-foreground flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-muted-foreground" />
                  অতিরিক্ত কোনো নোট বা বিশেষ জিজ্ঞাসা (ঐচ্ছিক)
                </Label>
                <Textarea
                  id="notes"
                  rows={3}
                  placeholder="e.g. জমির দলিল ও নামজারি সাথে নিয়ে আসব / রাস্তার ওয়াইথ কম আছে সেতব্যাক কেমন হবে?"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="rounded-xl bg-background border-border text-sm"
                />
              </div>

              {/* Navigation Actions */}
              <div className="flex items-center gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep(1)}
                  className="w-1/3 h-13 rounded-2xl font-bold border-border gap-1.5"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>পেছনে</span>
                </Button>

                <Button
                  type="submit"
                  disabled={loading || !selectedDate || !timeSlot}
                  className="w-2/3 h-13 rounded-2xl font-bold text-base bg-primary hover:bg-primary/95 text-primary-foreground gap-2 shadow-lg"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>প্রসেসিং হচ্ছে...</span>
                    </>
                  ) : (
                    <>
                      <span>কনফার্ম করুন</span>
                      <CheckCircle2 className="w-5 h-5 text-accent" />
                    </>
                  )}
                </Button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
