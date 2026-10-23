"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import {
  ArrowRight,
  CheckCircle2,
  Phone,
  MessageCircle,
  PencilRuler,
  Building2,
  Calculator,
  FileCheck2,
  HardHat,
  Clock,
  Star,
  Users,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const services = [
  {
    id: "2d-plan",
    icon: PencilRuler,
    title: "2D Architectural & Structural Plan",
    titleBn: "২ডি আর্কিটেকচারাল ও স্ট্রাকচারাল প্ল্যান",
    image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=900&auto=format&fit=crop",
    badge: "সবচেয়ে জনপ্রিয়",
    badgeColor: "bg-accent text-accent-foreground",
    description:
      "আমাদের মূল সেবা। AutoCAD-এ নিখুঁত ২ডি ফ্লোর প্ল্যান, এলিভেশন এবং স্ট্রাকচারাল ড্রয়িং তৈরি করি যা নির্মাণে শতভাগ নির্ভুল।",
    scope: [
      "ফ্লোর প্ল্যান লেআউট",
      "এলিভেশন ও সেকশন ড্রয়িং",
      "ফাউন্ডেশন ডিটেইলস",
      "কলাম ও বিম লেআউট",
      "প্লাম্বিং ও ইলেকট্রিক্যাল ড্রাফট",
    ],
    deliveryDays: "৭–১৫ দিন",
    startingPrice: "৳ ৫,০০০ থেকে শুরু",
    ctaText: "প্ল্যান বানান",
    ctaHref: "/book-appointment",
  },
  {
    id: "3d-design",
    icon: Building2,
    title: "3D Exterior & Interior Renderings",
    titleBn: "৩ডি এক্সটেরিয়র ও ইন্টেরিয়র ডিজাইন",
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=900&auto=format&fit=crop",
    badge: "ভিজ্যুয়াল",
    badgeColor: "bg-purple-600 text-white",
    description:
      "আপনার স্বপ্নের বাড়ি নির্মাণের আগেই দেখুন। Revit, SketchUp ও Lumion ব্যবহার করে ফটোরিয়েলিস্টিক ৩ডি মডেল ও অ্যানিমেশন তৈরি করি।",
    scope: [
      "ফটোরিয়েলিস্টিক এক্সটেরিয়র ভিউ",
      "ইন্টেরিয়র ডিজাইন ও ম্যাটেরিয়াল সিলেকশন",
      "দিন/রাতের আলো সিমুলেশন",
      "৩ডি ওয়াকথ্রু অ্যানিমেশন",
    ],
    deliveryDays: "৫–১০ দিন",
    startingPrice: "৳ ৩,০০০ থেকে শুরু",
    ctaText: "৩ডি ডিজাইন পান",
    ctaHref: "/book-appointment",
  },
  {
    id: "boq",
    icon: Calculator,
    title: "BOQ Construction Cost Estimation",
    titleBn: "BOQ নির্মাণ খরচ হিসাব",
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=900&auto=format&fit=crop",
    badge: "সাশ্রয়ী",
    badgeColor: "bg-emerald-600 text-white",
    description:
      "বাজেট ঠিক রাখুন। প্রয়োজনীয় সকল নির্মাণসামগ্রীর পরিমাণ ও বর্তমান বাজারমূল্য হিসাব করে সঠিক খরচের প্রাক্কলন দিই।",
    scope: [
      "রড/স্টিল পরিমাণ গণনা",
      "সিমেন্ট, বালু ও ইটের হিসাব",
      "শ্রমিক খরচের প্রজেকশন",
      "ফিনিশিং ম্যাটেরিয়াল বাজেট",
    ],
    deliveryDays: "৩–৫ দিন",
    startingPrice: "৳ ২,০০০ থেকে শুরু",
    ctaText: "খরচ হিসাব করুন",
    ctaHref: "/cost-estimator",
  },
  {
    id: "plan-passing",
    icon: FileCheck2,
    title: "Municipal Plan Passing Approvals",
    titleBn: "সরকারি প্ল্যান পাসিং অনুমোদন",
    image: "https://images.unsplash.com/photo-1568992687947-868a62a9f521?q=80&w=900&auto=format&fit=crop",
    badge: "লিগ্যাল ক্লিয়ারেন্স",
    badgeColor: "bg-blue-600 text-white",
    description:
      "আমরা সব কাগজপত্রের ঝামেলা সামলাই। ইউনিয়ন পরিষদ থেকে পৌরসভা ও রাজউক পর্যন্ত আপনার বিল্ডিং প্ল্যানের আইনি অনুমোদন নিশ্চিত করি।",
    scope: [
      "কাগজপত্র প্রস্তুতি",
      "মাটি পরীক্ষার রিপোর্ট",
      "কর্তৃপক্ষের সাথে যোগাযোগ",
      "রিয়েলটাইম ফাইল ট্র্যাকিং",
    ],
    deliveryDays: "১–৩ মাস",
    startingPrice: "৳ ১০,০০০ থেকে শুরু",
    ctaText: "প্ল্যান পাস করান",
    ctaHref: "/book-appointment",
  },
  {
    id: "supervision",
    icon: HardHat,
    title: "On-site Technical Supervision",
    titleBn: "সাইটে টেকনিক্যাল তদারকি",
    image: "https://images.unsplash.com/photo-1504307651254-35680f356f12?q=80&w=900&auto=format&fit=crop",
    badge: "নির্মাণকালীন",
    badgeColor: "bg-orange-600 text-white",
    description:
      "নির্মাণের গুরুত্বপূর্ণ ধাপে আমাদের ইঞ্জিনিয়াররা আপনার সাইট পরিদর্শন করেন এবং ঠিকাদার ড্রয়িং মতো কাজ করছে কিনা নিশ্চিত করেন।",
    scope: [
      "ফাউন্ডেশন ঢালাই পরিদর্শন",
      "কলাম ও ছাদ ঢালাই তদারকি",
      "নির্মাণসামগ্রীর মান যাচাই",
      "নিরাপত্তা প্রোটোকল বাস্তবায়ন",
    ],
    deliveryDays: "নির্মাণকালীন সময়",
    startingPrice: "চুক্তিভিত্তিক",
    ctaText: "তদারকি বুক করুন",
    ctaHref: "/book-appointment",
  },
];

const stats = [
  { icon: Users, value: "৫০০+", label: "সন্তুষ্ট ক্লায়েন্ট" },
  { icon: Building2, value: "৮০০+", label: "প্রজেক্ট সম্পন্ন" },
  { icon: Star, value: "১০+", label: "বছরের অভিজ্ঞতা" },
  { icon: Clock, value: "৯৮%", label: "সময়মতো ডেলিভারি" },
];

export function ServicesHero() {
  return (
    <section className="bg-primary pt-32 pb-24 text-center px-4 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/20 border border-accent/30 text-accent text-sm font-medium mb-6"
        >
          <PencilRuler className="w-4 h-4" />
          HF Design & Engineering Solutions
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl md:text-6xl font-bold font-heading text-primary-foreground mb-6"
        >
          আমাদের <span className="text-accent">সেবাসমূহ</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-lg text-primary-foreground/80 max-w-2xl mx-auto mb-10"
        >
          প্রথম স্কেচ থেকে চূড়ান্ত ইট পর্যন্ত। HF সম্পূর্ণ সিভিল ইঞ্জিনিয়ারিং সমাধান দেয়।
        </motion.p>

        {/* Quick Nav Pills */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap justify-center gap-2 mb-12"
        >
          {services.map((s) => {
            const Icon = s.icon;
            return (
              <a
                key={s.id}
                href={`#${s.id}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-primary-foreground text-xs font-medium transition-colors border border-white/20"
              >
                <Icon className="w-3.5 h-3.5" />
                {s.titleBn.split(" ").slice(0, 2).join(" ")}
              </a>
            );
          })}
        </motion.div>

        {/* Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto"
        >
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div key={i} className="bg-white/10 rounded-xl p-4 border border-white/15 text-center">
                <Icon className="w-5 h-5 text-accent mx-auto mb-2" />
                <p className="text-2xl font-bold text-primary-foreground font-heading">{stat.value}</p>
                <p className="text-xs text-primary-foreground/70 mt-0.5">{stat.label}</p>
              </div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

export function ServicesList() {
  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      setTimeout(() => {
        document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: "smooth" });
      }, 200);
    }
  }, []);

  return (
    <section className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-28">
        {services.map((svc, idx) => {
          const Icon = svc.icon;
          return (
            <div
              key={svc.id}
              id={svc.id}
              className={`flex flex-col gap-12 scroll-mt-24 lg:items-center ${
                idx % 2 === 1 ? "lg:flex-row-reverse" : "lg:flex-row"
              }`}
            >
              {/* Image Side */}
              <motion.div
                initial={{ opacity: 0, x: idx % 2 === 1 ? 50 : -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.6 }}
                className="w-full lg:w-1/2"
              >
                <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-border group">
                  {/* Badge */}
                  <div className={`absolute top-4 left-4 z-20 px-3 py-1 rounded-full text-xs font-bold ${svc.badgeColor} shadow`}>
                    {svc.badge}
                  </div>

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/60 via-transparent to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  {/* Hover CTA */}
                  <div className="absolute bottom-0 left-0 right-0 z-20 p-5 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                    <Link href={svc.ctaHref}>
                      <Button size="sm" className="w-full font-bold">
                        {svc.ctaText} <ArrowRight className="w-4 h-4 ml-1" />
                      </Button>
                    </Link>
                  </div>

                  <Image
                    src={svc.image}
                    alt={svc.title}
                    width={900}
                    height={500}
                    className="w-full h-[380px] md:h-[440px] object-cover group-hover:scale-105 transition-transform duration-700"
                    priority={idx === 0}
                  />
                </div>

                {/* Delivery & Price Info below image */}
                <div className="mt-4 flex gap-3">
                  <div className="flex-1 flex items-center gap-2 bg-secondary/50 border border-border rounded-xl px-4 py-3">
                    <Clock className="w-4 h-4 text-accent shrink-0" />
                    <div>
                      <p className="text-[10px] text-muted-foreground">ডেলিভারি সময়</p>
                      <p className="text-sm font-semibold text-foreground">{svc.deliveryDays}</p>
                    </div>
                  </div>
                  <div className="flex-1 flex items-center gap-2 bg-secondary/50 border border-border rounded-xl px-4 py-3">
                    <Star className="w-4 h-4 text-accent shrink-0" />
                    <div>
                      <p className="text-[10px] text-muted-foreground">মূল্য</p>
                      <p className="text-sm font-semibold text-foreground">{svc.startingPrice}</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Content Side */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.6, delay: 0.15 }}
                className="w-full lg:w-1/2 space-y-6"
              >
                {/* Service Number + Icon */}
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center">
                    <Icon className="w-6 h-6 text-accent" />
                  </div>
                  <span className="text-5xl font-black text-muted-foreground/15 font-heading select-none">
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                </div>

                <div>
                  <h2 className="text-3xl font-bold font-heading text-foreground mb-1">{svc.titleBn}</h2>
                  <p className="text-sm text-muted-foreground font-mono">{svc.title}</p>
                </div>

                <p className="text-lg text-muted-foreground leading-relaxed">{svc.description}</p>

                {/* Scope */}
                <div className="bg-secondary/40 p-5 rounded-xl border border-border">
                  <h4 className="font-semibold mb-4 text-primary flex items-center gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-accent" />
                    কাজের পরিধি (Scope of Work)
                  </h4>
                  <ul className="space-y-2.5">
                    {svc.scope.map((item, i) => (
                      <li key={i} className="flex items-center gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-accent shrink-0" />
                        <span className="text-foreground text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <Link href={svc.ctaHref} className="flex-1">
                    <Button className="w-full font-bold">
                      {svc.ctaText} <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                  <a
                    href={`https://wa.me/8801778506500?text=${encodeURIComponent(`আমি ${svc.titleBn} সম্পর্কে জানতে চাই।`)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1"
                  >
                    <Button variant="outline" className="w-full font-semibold border-green-500 text-green-600 hover:bg-green-50">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      WhatsApp করুন
                    </Button>
                  </a>
                </div>
              </motion.div>
            </div>
          );
        })}
      </div>

      {/* Bottom CTA Banner */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mt-28 mx-4 sm:mx-6 lg:mx-8 max-w-5xl lg:mx-auto"
      >
        <div className="bg-primary rounded-2xl p-10 md:p-14 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-5" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='1' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E")`,
          }} />
          <div className="relative z-10">
            <h3 className="text-2xl md:text-3xl font-bold font-heading text-primary-foreground mb-4">
              আজই শুরু করুন আপনার স্বপ্নের বাড়ি
            </h3>
            <p className="text-primary-foreground/75 mb-8 max-w-xl mx-auto">
              বিনামূল্যে পরামর্শ নিন। আমাদের অভিজ্ঞ ইঞ্জিনিয়ার দল আপনার প্রজেক্ট নিয়ে কথা বলতে প্রস্তুত।
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/book-appointment">
                <Button size="lg" variant="secondary" className="font-bold px-8">
                  অ্যাপয়েন্টমেন্ট নিন <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <a href="tel:+8801778506500">
                <Button size="lg" variant="outline" className="font-bold px-8 border-white/30 text-primary-foreground hover:bg-white/10">
                  <Phone className="w-5 h-5 mr-2" />
                  01778-506500
                </Button>
              </a>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
