"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  ExternalLink,
  Mail,
  Phone,
  MapPin,
  Loader2,
  Users,
  Compass,
  Award,
  ShieldCheck,
  Building2,
  Layers,
  HardHat,
  Sparkles,
  CheckCircle2,
  Calendar,
  MessageCircle,
  FileCheck2,
  Cpu,
} from "lucide-react";
import SEOHead from "@/components/shared/SEOHead";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { SITE_CONFIG } from "@/lib/constants";
import WhatsAppIcon from "@/components/shared/WhatsAppIcon";

interface TeamMember {
  _id: string;
  name: string;
  designation: string;
  bio: string;
  image?: { url: string; publicId: string };
  email?: string;
  phone?: string;
  expertise: string[];
  socialLinks: { platform: string; url: string }[];
  order: number;
  isActive: boolean;
}

// Fallback verified team data if database is still updating
const DEFAULT_MEMBERS: TeamMember[] = [
  {
    _id: "hasmot-ali",
    name: "Engr. Md. Hasmot Ali",
    designation: "Founder & Lead Structural Consultant",
    bio: "Passionate Civil Engineer dedicated to turning architectural concepts into safe, structural realities. Over 10 years of professional practice across Savar and greater Dhaka. Highly proficient in computational structural analysis, BNBC 2020 seismic & wind load detailing, AutoCAD (2D/3D), and Autodesk Revit modeling. Combines advanced engineering design with hands-on site management for foundation and roof casting quality control.",
    image: {
      url: "https://res.cloudinary.com/fcpqnule/image/upload/v1789671142/triple-h/uploads/nuno0wr0ihmfw2oxs3k3.png",
      publicId: "triple-h/uploads/nuno0wr0ihmfw2oxs3k3",
    },
    email: "engr.hasu18@gmail.com",
    phone: "01778-506500",
    expertise: [
      "Structural Engineering",
      "BNBC 2020 Standard",
      "AutoCAD 2D/3D",
      "Revit Architecture & Structure",
      "BOQ & Cost Estimation",
      "Site Quality Supervision",
    ],
    socialLinks: [
      {
        platform: "facebook",
        url: "https://www.facebook.com/profile.php?id=61592186641331",
      },
    ],
    order: 1,
    isActive: true,
  },
  {
    _id: "asraful-islam",
    name: "Engr. Md. Asraful Islam",
    designation: "Senior Civil Engineer & GIS Specialist",
    bio: "B.Sc. in Civil Engineering and certified GIS & ArcGIS Specialist with extensive field experience in geospatial analysis, topographical mapping, digital land surveying, and municipal civil engineering projects. Skilled in transforming complex spatial data into accurate, constructible boundary drawings and structural grading layouts.",
    image: {
      url: "https://res.cloudinary.com/fcpqnule/image/upload/v1789671844/triple-h/uploads/gkfrh2ifjhpl4mudyzmb.png",
      publicId: "triple-h/uploads/gkfrh2ifjhpl4mudyzmb",
    },
    email: "asrafulislam48@gmail.com",
    phone: "01745-125848",
    expertise: [
      "ArcGIS & Spatial Mapping",
      "Digital Land Survey",
      "AutoCAD Civil",
      "Site Grading & Drainage",
      "Structural Layout Detailing",
    ],
    socialLinks: [],
    order: 2,
    isActive: true,
  },
];

const DEPARTMENTS = [
  {
    icon: Building2,
    titleBn: "আর্কিটেকচারাল ও 3D ডিজাইন ইউনিট",
    titleEn: "Architectural & 3D Modeling",
    desc: "আধুনিক ফ্লোর প্ল্যান, স্পেস অপটিমাইজেশন এবং বাস্তবসম্মত 3D এক্সটেরিয়র ও ইন্টেরিয়র রেন্ডারিং।",
  },
  {
    icon: Compass,
    titleBn: "স্ট্রাকচারাল এনালাইসিস ও BNBC উইং",
    titleEn: "Structural Engineering & BNBC 2020",
    desc: "ETABS ও SAFE সফটওয়্যারের মাধ্যমে ভূমিকম্প ও ঝড় সহনশীল কলাম, বিম ও ফাউন্ডেশনের নির্ভুল লোড ক্যালকুলেশন।",
  },
  {
    icon: FileCheck2,
    titleBn: "পৌরসভা ও সরকারি অনুমোদন সেল",
    titleEn: "Municipal & Authority Approvals",
    desc: "পৌরসভা ও ইউনিয়ন পরিষদের বিল্ডিং বাই-ল মেনে সকল ড্রয়িং ও কাগজপত্র চূড়ান্তকরণ।",
  },
  {
    icon: HardHat,
    titleBn: "সাইট কোয়ালিটি ও কাস্টিং ইন্সপেকশন",
    titleEn: "Site Quality & Supervision",
    desc: "ঢালাইয়ের সময় রড বাইন্ডিং, ল্যাপিং, সাটারিং ও কংক্রিট রেশিও পরীক্ষা করে সরাসরি সাইটে তদারকি।",
  },
];

const TECHNICAL_STACK = [
  { name: "AutoCAD 2024", category: "2D/3D Drafting" },
  { name: "Autodesk Revit", category: "BIM & 3D Modeling" },
  { name: "ETABS", category: "Structural Analysis" },
  { name: "SAFE", category: "Foundation Design" },
  { name: "ArcGIS Pro", category: "Geospatial Survey" },
  { name: "Lumion / 3ds Max", category: "Photorealistic Render" },
  { name: "MS Excel BOQ", category: "Precision Costing" },
  { name: "BNBC 2020 Code", category: "National Standards" },
];

export default function TeamPage() {
  const [members, setMembers] = useState<TeamMember[]>(DEFAULT_MEMBERS);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<TeamMember | null>(null);

  useEffect(() => {
    fetch("/api/team")
      .then((res) => res.json())
      .then((json) => {
        if (json && json.data && Array.isArray(json.data) && json.data.length > 0) {
          // Merge API data with default details for high fidelity
          const mapped = json.data.map((m: any) => {
            const def = DEFAULT_MEMBERS.find(
              (d) => d.name.toLowerCase().includes("hasmot") && m.name.toLowerCase().includes("hasmot")
            );
            return {
              ...m,
              expertise: m.expertise?.length > 0 ? m.expertise : def?.expertise || [],
              phone: m.phone || def?.phone || "01778-506500",
            };
          });
          setMembers(mapped);
        }
      })
      .catch(() => {
        // Fallback to DEFAULT_MEMBERS smoothly
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="w-full min-h-screen bg-background selection:bg-accent/20 selection:text-accent">
      <SEOHead
        title="Our Engineering Team - Expert Civil Engineers & Drafters"
        description="Meet the experienced civil engineers, structural consultants, and architectural drafters at HF Design & Engineering Solutions, Savar, Dhaka."
      />

      {/* ─── HERO SECTION ─── */}
      <section className="relative bg-primary pt-32 pb-20 overflow-hidden text-primary-foreground border-b border-primary/20">
        <div
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-accent/20 blur-[130px] rounded-full pointer-events-none" />

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/20 border border-accent/40 text-accent text-sm font-semibold mb-6 shadow-sm"
          >
            <Users className="w-4 h-4 text-accent" />
            Engineering Leadership & Technical Excellence
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold font-heading tracking-tight mb-5"
          >
            Meet Our <span className="text-accent">Engineering Team</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="text-lg md:text-xl text-primary-foreground/85 max-w-3xl mx-auto font-normal leading-relaxed mb-8"
          >
            পরিকল্পিত নকশা ও শতভাগ নিরাপদ ভবন নির্মাণের কারিগর। আধুনিক সফটওয়্যার এনালাইসিস এবং বাস্তব
            অভিজ্ঞতার সমন্বয়ে সাভার ও ঢাকার বিশ্বস্ত সিভিল ইঞ্জিনিয়ারিং প্যানেল।
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs sm:text-sm font-medium text-primary-foreground/80"
          >
            <span className="flex items-center gap-1.5 bg-white/10 px-3.5 py-1.5 rounded-full border border-white/15">
              <Award className="w-4 h-4 text-accent" />
              ১০+ বছর সমন্বিত অভিজ্ঞতা
            </span>
            <span className="flex items-center gap-1.5 bg-white/10 px-3.5 py-1.5 rounded-full border border-white/15">
              <ShieldCheck className="w-4 h-4 text-accent" />
              BNBC ২০২০ কোড স্পেশালিস্ট
            </span>
            <span className="flex items-center gap-1.5 bg-white/10 px-3.5 py-1.5 rounded-full border border-white/15">
              <Building2 className="w-4 h-4 text-accent" />
              ৫০০+ সফল অনুমোদিত প্রজেক্ট
            </span>
          </motion.div>
        </div>
      </section>

      {/* ─── FEATURED LEADERSHIP PROFILES ─── */}
      <section className="py-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-accent text-xs font-bold uppercase tracking-wider block mb-2">
            মূল নেতৃত্ব ও কনসালটেন্ট
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-foreground mb-3">
            Principal Consultants & Engineers
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base">
            আপনার বাড়ি বা প্রজেক্টের প্রতিটি নকশা যাদের প্রত্যক্ষ তত্ত্বাবধানে পুঙ্খানুপুঙ্খভাবে তৈরি হয়।
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
          {members.map((member, idx) => (
            <motion.div
              key={member._id || idx}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.15 }}
              className="bg-card rounded-3xl border border-border hover:border-accent/40 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between group"
            >
              <div>
                {/* Header Banner & Photo */}
                <div className="relative h-32 bg-gradient-to-r from-primary via-[#0B2A4A] to-primary/90 p-6 flex items-end">
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-accent/20 text-accent border border-accent/30 text-[11px] font-semibold">
                      Licensed Civil Engineer
                    </Badge>
                  </div>
                </div>

                <div className="px-6 sm:px-8 pb-4 relative">
                  {/* Avatar */}
                  <div className="relative -mt-16 mb-4 flex items-end justify-between">
                    <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 p-[2.5px] shadow-xl">
                      <div className="w-full h-full rounded-[14px] bg-slate-900 overflow-hidden relative">
                        {member.image?.url ? (
                          <Image
                            src={member.image.url}
                            alt={member.name}
                            fill
                            className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full bg-[#0B2A4A] flex items-center justify-center text-accent">
                            <Compass className="w-10 h-10" />
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mb-2">
                      {member.phone && (
                        <a
                          href={`tel:${member.phone.replace(/[^0-9+]/g, "")}`}
                          className="p-2.5 rounded-xl bg-muted hover:bg-primary hover:text-primary-foreground text-foreground transition-all shadow-xs"
                          title="Call Direct"
                        >
                          <Phone className="w-4 h-4" />
                        </a>
                      )}
                      <a
                        href={`https://wa.me/${SITE_CONFIG.whatsapp}?text=${encodeURIComponent(
                          `আসসালামু আলাইকুম, আমি ${member.name} এর সাথে ড্রয়িং ও প্রজেক্ট নিয়ে কথা বলতে চাই।`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-600 text-emerald-600 hover:text-white transition-all shadow-xs"
                        title="WhatsApp Chat"
                      >
                        <WhatsAppIcon className="w-4 h-4" />
                      </a>
                      {member.email && (
                        <a
                          href={`mailto:${member.email}`}
                          className="p-2.5 rounded-xl bg-muted hover:bg-accent hover:text-primary text-foreground transition-all shadow-xs"
                          title="Send Email"
                        >
                          <Mail className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Name & Designation */}
                  <div>
                    <h3 className="text-2xl font-bold font-heading text-foreground group-hover:text-primary transition-colors">
                      {member.name}
                    </h3>
                    <p className="text-sm font-semibold text-accent mt-0.5">
                      {member.designation}
                    </p>
                    <p className="text-xs text-muted-foreground font-medium mt-1">
                      HF Design & Engineering Solutions · Savar, Dhaka
                    </p>
                  </div>

                  {/* Bio */}
                  <p className="text-xs sm:text-sm text-muted-foreground mt-4 leading-relaxed whitespace-pre-line line-clamp-4">
                    {member.bio}
                  </p>

                  {/* Expertise Badges */}
                  {member.expertise && member.expertise.length > 0 && (
                    <div className="mt-5 pt-4 border-t border-border/60">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-2">
                        বিশেষজ্ঞ স্কিল ও সফটওয়্যার
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {member.expertise.map((skill) => (
                          <span
                            key={skill}
                            className="text-xs px-2.5 py-1 rounded-lg bg-muted text-foreground/80 border border-border/60 font-medium"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom Quick Action */}
              <div className="p-6 sm:px-8 pt-4 bg-muted/20 border-t border-border flex items-center justify-between">
                <span className="text-xs text-muted-foreground flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  সরাসরি কনসালটেশন উপলব্ধ
                </span>

                <Link href="/book-appointment">
                  <Button size="sm" className="rounded-xl gap-1.5 text-xs font-bold shadow-xs">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>অ্যাপয়েন্টমেন্ট নিন</span>
                  </Button>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─── DEPARTMENTAL PILLARS ─── */}
      <section className="py-20 bg-muted/30 border-t border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-accent text-xs font-bold uppercase tracking-wider block mb-2">
              আমাদের কর্মপদ্ধতি
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-foreground mb-3">
              Specialized Engineering Wings
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base">
              একটি নিরাপদ ভবন তৈরির প্রতিটি ধাপ সুচারুভাবে সম্পাদনের জন্য আমাদের ৪টি পৃথক বিশেষজ্ঞ ইউনিট কাজ করে।
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {DEPARTMENTS.map((dept, i) => {
              const Icon = dept.icon;
              return (
                <div
                  key={i}
                  className="bg-card rounded-2xl p-6 border border-border shadow-xs hover:border-accent/40 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-base font-bold font-heading text-foreground mb-1">
                      {dept.titleBn}
                    </h3>
                    <p className="text-[11px] font-semibold text-accent uppercase tracking-wider mb-2">
                      {dept.titleEn}
                    </p>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {dept.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── TECHNICAL ARSENAL & SOFTWARE ─── */}
      <section className="py-16 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <span className="text-accent text-xs font-bold uppercase tracking-wider block mb-2">
            কারিগরি প্রযুক্তি
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-foreground">
            Industry Standard Engineering Tools
          </h2>
          <p className="text-muted-foreground text-sm mt-1">
            আন্তর্জাতিক মানের সফটওয়্যার ও টুলস ব্যবহারের মাধ্যমে আমরা নিখুঁত ড্রয়িং প্রস্তুত করি।
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {TECHNICAL_STACK.map((tech) => (
            <div
              key={tech.name}
              className="p-4 rounded-xl bg-card border border-border text-center hover:border-accent/30 transition-all"
            >
              <p className="font-bold text-sm text-foreground">{tech.name}</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">{tech.category}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── OFFICE CONSULTATION BANNER ─── */}
      <section className="bg-primary text-primary-foreground py-16 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.2) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold font-heading mb-4">
            আমাদের অফিসে এসে সরাসরি পরামর্শ নিতে চান?
          </h2>
          <p className="text-primary-foreground/80 text-base sm:text-lg max-w-2xl mx-auto mb-8">
            জমির কাগজপত্র বা খসড়া ড্রয়িং সাথে নিয়ে সরাসরি চলে আসুন সাভার রেডিও কলোনি অফিসে। আমাদের সিনিয়র ইঞ্জিনিয়ারদের সাথে
            মুখোমুখি বসে ফ্রি আলোচনা করুন।
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link href="/book-appointment">
              <Button size="lg" className="bg-accent hover:bg-accent/90 text-primary font-bold rounded-xl px-8 h-12 shadow-lg">
                <Calendar className="w-5 h-5 mr-2" />
                ফ্রি অ্যাপয়েন্টমেন্ট শিডিউল করুন
              </Button>
            </Link>
            <a
              href={`https://wa.me/${SITE_CONFIG.whatsapp}?text=${encodeURIComponent(
                "আসসালামু আলাইকুম HF Engineering, আমি ইঞ্জিনিয়ারদের সাথে অফিসে দেখা করতে চাই।"
              )}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                size="lg"
                variant="outline"
                className="bg-white/10 hover:bg-white/20 text-white border-white/25 font-bold rounded-xl px-8 h-12"
              >
                <WhatsAppIcon className="w-5 h-5 mr-2" />
                WhatsApp-এ মেসেজ দিন
              </Button>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
