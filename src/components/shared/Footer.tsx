"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Mail,
  MapPin,
  Phone,
  ArrowRight,
  Calculator,
  Search,
  UploadCloud,
  FileCheck2,
  Calendar,
  CreditCard,
  ShieldCheck,
  Building2,
  Bell,
  HelpCircle,
  BookOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SITE_CONFIG } from "@/lib/constants";
import WhatsAppIcon from "@/components/shared/WhatsAppIcon";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary text-primary-foreground pt-16 pb-8 border-t border-primary/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main 4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8 mb-12">
          {/* ─── Column 1: Brand Info & Socials ─── */}
          <div className="space-y-4">
            <Link href="/" className="inline-block">
              <Image
                src="/images/logo.png"
                alt="HF Design & Engineering Solutions logo"
                width={170}
                height={170}
                className="h-14 md:h-16 w-auto object-contain"
              />
            </Link>
            <p className="text-sm font-semibold text-accent">
              পরিকল্পিত নকশা, নিরাপদ নির্মাণ।
            </p>
            <p className="text-xs text-primary-foreground/80 leading-relaxed">
              সাভার ও বৃহত্তর ঢাকায় আধুনিক আর্কিটেকচারাল নকশা, স্ট্রাকচারাল এনালাইসিস, পৌরসভা প্ল্যান পাস এবং সাইট সুপারভিশনের নির্ভরযোগ্য বিশ্বস্ত প্রতিষ্ঠান।
            </p>

            {/* Quick Contact Buttons */}
            <div className="flex flex-wrap gap-2 pt-2">
              <a
                href={`https://wa.me/${SITE_CONFIG.whatsapp}?text=${encodeURIComponent(
                  "আসসালামু আলাইকুম, আমি বিল্ডিং ডিজাইন ও প্ল্যান সংক্রান্ত তথ্য জানতে চাই।"
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors shadow-xs"
              >
                <WhatsAppIcon className="w-3.5 h-3.5" />
                <span>WhatsApp চ্যাট</span>
              </a>
              <a
                href="tel:01778506500"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-accent" />
                <span>01778-506500</span>
              </a>
            </div>

            {/* Social Media Links */}
            <div className="flex space-x-3 pt-3">
              <a
                href="https://www.facebook.com/profile.php?id=61592186641331"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="HF Design & Engineering Solutions Facebook Page"
                className="w-9 h-9 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-accent hover:text-primary transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </a>
            </div>
          </div>

          {/* ─── Column 2: Our Core Services ─── */}
          <div>
            <h3 className="text-base font-bold mb-5 font-heading text-accent flex items-center gap-2">
              <Building2 className="w-4 h-4 text-accent" />
              আমাদের সেবাসমূহ
            </h3>
            <ul className="space-y-2.5">
              {[
                { label: "2D আর্কিটেকচারাল নকশা", href: "/services#2d-plan" },
                { label: "3D এক্সটেরিয়র ও ইন্টেরিয়র", href: "/services#3d-design" },
                { label: "স্ট্রাকচারাল ও BNBC ডিজাইন", href: "/services#2d-plan" },
                { label: "পৌরসভা ও ইউনিয়ন প্ল্যান পাস", href: "/services#plan-passing" },
                { label: "সাইট সুপারভিশন ও ঢালাই পরীক্ষা", href: "/services#supervision" },
                { label: "নির্মাণ খরচ প্রাক্কলন (BOQ)", href: "/services#boq" },
                { label: "ডিজিটাল সয়েল টেস্ট ও সার্ভে", href: "/services" },
              ].map((service) => (
                <li key={service.label}>
                  <Link
                    href={service.href}
                    prefetch={true}
                    className="text-xs text-primary-foreground/80 hover:text-accent transition-colors flex items-center group"
                  >
                    <ArrowRight className="w-3.5 h-3.5 mr-1.5 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all text-accent" />
                    <span>{service.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ─── Column 3: Client Tools & Tracking ─── */}
          <div>
            <h3 className="text-base font-bold mb-5 font-heading text-accent flex items-center gap-2">
              <Search className="w-4 h-4 text-accent" />
              ক্লায়েন্ট সার্ভিস ও ট্র্যাকিং
            </h3>
            <ul className="space-y-2.5">
              {[
                {
                  label: "নকশা পাঠান (ফ্রি কোটেশন)",
                  href: "/sketch-upload",
                  icon: UploadCloud,
                },
                {
                  label: "কনস্ট্রাকশন খরচ ক্যালকুলেটর",
                  href: "/cost-estimator",
                  icon: Calculator,
                },
                {
                  label: "প্ল্যান অনুমোদন ট্র্যাকিং",
                  href: "/track-plan",
                  icon: Search,
                },
                {
                  label: "ক্লায়েন্ট পোর্টাল লগইন",
                  href: "/client-portal",
                  icon: FileCheck2,
                },
                {
                  label: "অ্যাপয়েন্টমেন্ট ও সাইট ভিজিট",
                  href: "/book-appointment",
                  icon: Calendar,
                },
                {
                  label: "অনলাইন ফি পেমেন্ট",
                  href: "/pay",
                  icon: CreditCard,
                },
                {
                  label: "অনুমোদিত প্ল্যান ও ডকুমেন্ট যাচাই",
                  href: "/verify",
                  icon: ShieldCheck,
                },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      prefetch={true}
                      className="text-xs text-primary-foreground/80 hover:text-accent transition-colors flex items-center gap-2"
                    >
                      <Icon className="w-3.5 h-3.5 text-accent/80 shrink-0" />
                      <span>{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* ─── Column 4: Resources, Team & Support ─── */}
          <div>
            <h3 className="text-base font-bold mb-5 font-heading text-accent flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-accent" />
              রিসোর্স ও তথ্য
            </h3>
            <ul className="space-y-2.5">
              {[
                { label: "প্রতিষ্ঠান পরিচিতি (About Us)", href: "/about" },
                { label: "আমাদের ইঞ্জিনিয়ার প্যানেল (Our Team)", href: "/team" },
                { label: "সম্পূর্ণ প্রজেক্ট গ্যালারি (Portfolio)", href: "/portfolio" },
                {
                  label: "পৌরসভা প্ল্যান অনুমোদন গাইড",
                  href: "/approval-guide",
                },
                { label: "অফিসিয়াল নোটিশ বোর্ড", href: "/notices" },
                { label: "সাধারণ জিজ্ঞাসা ও প্রশ্নোত্তর (FAQ)", href: "/faq" },
                { label: "ইঞ্জিনিয়ারিং ব্লগ ও টিপস", href: "/blog" },
                { label: "যোগাযোগ ও সরাসরি অফিস ভিজিট", href: "/contact" },
              ].map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    prefetch={true}
                    className="text-xs text-primary-foreground/80 hover:text-accent transition-colors flex items-center group"
                  >
                    <ArrowRight className="w-3.5 h-3.5 mr-1.5 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all text-accent" />
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ─── Office Information Banner ─── */}
        <div className="border-t border-primary-foreground/15 pt-8 pb-6 grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-primary-foreground/80">
          <div className="flex items-start gap-2.5">
            <MapPin className="w-4 h-4 text-accent shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-foreground text-primary-foreground">প্রধান অফিস</p>
              <p className="mt-0.5 leading-relaxed">
                {SITE_CONFIG.address}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <Phone className="w-4 h-4 text-accent shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-primary-foreground">সরাসরি কল</p>
              <p className="mt-0.5 space-x-2">
                <a href="tel:01778506500" className="hover:text-accent transition-colors">
                  01778-506500
                </a>
                <span>·</span>
                <a href="tel:01631186218" className="hover:text-accent transition-colors">
                  01631-186218
                </a>
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <Mail className="w-4 h-4 text-accent shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-primary-foreground">ইমেইল পরামর্শ</p>
              <p className="mt-0.5">
                <a
                  href="mailto:info@hfengineeringbd.com"
                  className="hover:text-accent transition-colors"
                >
                  info@hfengineeringbd.com
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* ─── Copyright Bottom ─── */}
        <div className="border-t border-primary-foreground/10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-xs text-primary-foreground/60 text-center sm:text-left">
            &copy; {currentYear} HF Design &amp; Engineering Solutions. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-xs text-primary-foreground/60">
            <Link href="/approval-guide" className="hover:text-accent transition-colors">
              অনুমোদন গাইড
            </Link>
            <span>·</span>
            <Link href="/faq" className="hover:text-accent transition-colors">
              FAQ
            </Link>
            <span>·</span>
            <Link href="/contact" className="hover:text-accent transition-colors">
              যোগাযোগ
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
