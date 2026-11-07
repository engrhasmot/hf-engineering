"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  Phone,
  Globe,
  User,
  ChevronDown,
  Building2,
  Search,
  UploadCloud,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useLanguage } from "@/context/LanguageContext";
import { SITE_CONFIG } from "@/lib/constants";
import WhatsAppIcon from "@/components/shared/WhatsAppIcon";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [aboutDropdownOpen, setAboutDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const pathname = usePathname();
  const { locale, toggleLocale, t } = useLanguage();
  const isBn = locale === "bn";

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isDesktop) setIsOpen(false);
  }, [isDesktop]);

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Prevent background scrolling when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setAboutDropdownOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
        setAboutDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // About dropdown items
  const aboutItems = [
    {
      title: isBn ? "প্রতিষ্ঠান পরিচিতি" : "About Our Firm",
      desc: isBn ? "আমাদের লক্ষ্য, দর্শন ও অভিজ্ঞতা" : "Our mission, philosophy & vision",
      href: "/about",
      icon: Building2,
    },
    {
      title: isBn ? "আমাদের ইঞ্জিনিয়ার প্যানেল" : "Our Engineering Team",
      desc: isBn ? "সিভিল ইঞ্জিনিয়ার ও স্ট্রাকচারাল টিম" : "Lead consultants & structural engineers",
      href: "/team",
      icon: Users,
    },
  ];

  const isAboutActive = pathname === "/about" || pathname === "/team";

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-background/95 backdrop-blur-md shadow-sm border-b border-border/70 py-0"
          : "bg-background/85 backdrop-blur-sm border-b border-border/40 py-1"
      }`}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20 gap-2">
          {/* ─── Brand Logo & Identity ─── */}
          <Link href="/" className="shrink-0 group flex items-center gap-1.5 sm:gap-2.5 min-w-0">
            <Image
              src="/images/logo.png"
              alt="HF Design & Engineering Solutions logo"
              width={140}
              height={140}
              className="h-8.5 sm:h-10 md:h-13 w-auto object-contain group-hover:opacity-90 transition-opacity shrink-0"
              priority
            />
            <div className="flex flex-col leading-tight min-w-0">
              <span className="text-base sm:text-lg md:text-xl font-black tracking-tight text-accent group-hover:text-accent/90 transition-colors uppercase leading-none">
                HF
              </span>
              <span className="text-[7.5px] sm:text-[9px] md:text-[10px] font-semibold tracking-wider text-muted-foreground uppercase whitespace-nowrap mt-0.5">
                Design &amp; Engineering
              </span>
            </div>
          </Link>

          {/* ─── Desktop Navigation Menu ─── */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {/* Home */}
            <Link
              href="/"
              prefetch={true}
              className={`px-3 py-2 text-sm font-semibold transition-colors hover:text-accent rounded-lg hover:bg-secondary/70 ${
                pathname === "/" ? "text-accent bg-secondary/50 font-bold" : "text-foreground"
              }`}
            >
              {t("nav.home")}
            </Link>

            {/* Services */}
            <Link
              href="/services"
              prefetch={true}
              className={`px-3 py-2 text-sm font-semibold transition-colors hover:text-accent rounded-lg hover:bg-secondary/70 ${
                pathname === "/services" ? "text-accent bg-secondary/50 font-bold" : "text-foreground"
              }`}
            >
              {t("nav.services")}
            </Link>

            {/* Portfolio */}
            <Link
              href="/portfolio"
              prefetch={true}
              className={`px-3 py-2 text-sm font-semibold transition-colors hover:text-accent rounded-lg hover:bg-secondary/70 ${
                pathname === "/portfolio" ? "text-accent bg-secondary/50 font-bold" : "text-foreground"
              }`}
            >
              {t("nav.portfolio")}
            </Link>

            {/* Cost Estimator */}
            <Link
              href="/cost-estimator"
              prefetch={true}
              className={`px-3 py-2 text-sm font-semibold transition-colors hover:text-accent rounded-lg hover:bg-secondary/70 ${
                pathname === "/cost-estimator"
                  ? "text-accent bg-secondary/50 font-bold"
                  : "text-foreground"
              }`}
            >
              {t("nav.costEstimator")}
            </Link>

            {/* About dropdown (About + Team) */}
            <div
              ref={dropdownRef}
              className="relative"
              onMouseEnter={() => setAboutDropdownOpen(true)}
              onMouseLeave={() => setAboutDropdownOpen(false)}
            >
              <button
                onClick={() => setAboutDropdownOpen(!aboutDropdownOpen)}
                className={`px-3 py-2 text-sm font-semibold transition-colors hover:text-accent rounded-lg hover:bg-secondary/70 flex items-center gap-1 ${
                  isAboutActive ? "text-accent bg-secondary/50 font-bold" : "text-foreground"
                }`}
                aria-expanded={aboutDropdownOpen}
              >
                <span>{t("nav.about")}</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    aboutDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {aboutDropdownOpen && (
                <div className="absolute left-0 top-full pt-1.5 w-72 z-50 animate-in fade-in-0 zoom-in-95 duration-150">
                  <div className="bg-popover text-popover-foreground border border-border rounded-xl shadow-xl p-2 space-y-1">
                    {aboutItems.map((item) => {
                      const Icon = item.icon;
                      const active = pathname === item.href;
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          prefetch={true}
                          onClick={() => setAboutDropdownOpen(false)}
                          className={`flex items-start gap-3 p-2.5 rounded-lg transition-all ${
                            active
                              ? "bg-accent/15 text-accent"
                              : "hover:bg-secondary text-foreground"
                          }`}
                        >
                          <div
                            className={`p-2 rounded-md shrink-0 ${
                              active
                                ? "bg-accent text-primary-foreground"
                                : "bg-muted text-foreground"
                            }`}
                          >
                            <Icon className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-sm font-bold leading-snug">{item.title}</p>
                            <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                              {item.desc}
                            </p>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Contact */}
            <Link
              href="/contact"
              prefetch={true}
              className={`px-3 py-2 text-sm font-semibold transition-colors hover:text-accent rounded-lg hover:bg-secondary/70 ${
                pathname === "/contact" ? "text-accent bg-secondary/50 font-bold" : "text-foreground"
              }`}
            >
              {t("nav.contact")}
            </Link>
          </nav>

          {/* ─── Desktop Right Actions ─── */}
          <div className="hidden lg:flex items-center gap-2 xl:gap-2.5">
            {/* Track Plan status */}
            <Link href="/track-plan" prefetch={true}>
              <Button
                variant="ghost"
                size="sm"
                className="text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-secondary/80 gap-1.5 h-9"
              >
                <Search className="w-3.5 h-3.5 text-accent" />
                <span className="hidden xl:inline">{isBn ? "প্ল্যান ট্র্যাকিং" : "Track Plan"}</span>
              </Button>
            </Link>

            {/* Language Switcher */}
            <button
              onClick={toggleLocale}
              className="px-2.5 py-1 text-xs font-bold rounded-lg border border-border bg-secondary/60 hover:bg-secondary text-foreground transition-all flex items-center gap-1.5 shadow-xs"
              title={isBn ? "Switch to English" : "বাংলায় পরিবর্তন করুন"}
            >
              <Globe className="w-3.5 h-3.5 text-accent" />
              <span>{isBn ? "🇧🇩 বাংলা" : "🇬🇧 EN"}</span>
            </button>

            {/* Primary Action Button: Send Sketch */}
            <Link href="/sketch-upload">
              <Button
                size="sm"
                className="bg-accent hover:bg-accent/90 text-primary-foreground font-bold shadow-sm rounded-lg text-xs h-9 px-3.5 gap-1.5"
              >
                <UploadCloud className="w-4 h-4" />
                <span>{isBn ? "নকশা পাঠান" : "Send Sketch"}</span>
              </Button>
            </Link>

            {/* Direct Phone Contact */}
            <a href="tel:01778506500" className="hidden xl:block">
              <Button
                variant="outline"
                size="sm"
                className="border-primary/20 hover:border-accent hover:text-accent font-bold text-xs h-9 px-3 gap-1.5"
              >
                <Phone className="w-3.5 h-3.5 text-accent" />
                <span>01778-506500</span>
              </Button>
            </a>
          </div>

          {/* ─── Mobile Action Controls ─── */}
          <div className="lg:hidden flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Quick Sketch upload button */}
            <Link href="/sketch-upload" title={isBn ? "নকশা পাঠান" : "Send Sketch"}>
              <Button
                size="sm"
                className="bg-accent hover:bg-accent/90 text-primary-foreground font-bold text-xs h-8 px-2 sm:px-2.5 gap-1 shadow-xs rounded-lg shrink-0"
              >
                <UploadCloud className="w-3.5 h-3.5 shrink-0" />
                <span className="hidden min-[480px]:inline">{isBn ? "নকশা পাঠান" : "Send Sketch"}</span>
                <span className="min-[480px]:hidden hidden min-[360px]:inline">{isBn ? "নকশা" : "Sketch"}</span>
              </Button>
            </Link>

            {/* Lang toggle */}
            <button
              onClick={toggleLocale}
              className="px-1.5 sm:px-2 py-1 text-xs font-bold rounded-lg border border-border bg-secondary/80 hover:bg-secondary text-foreground transition-colors shrink-0 flex items-center gap-1 active:scale-95"
              title={isBn ? "Switch to English" : "বাংলায় পরিবর্তন করুন"}
            >
              <span>{isBn ? "🇧🇩 BN" : "🇬🇧 EN"}</span>
            </button>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-foreground p-1.5 sm:p-2 rounded-lg hover:bg-secondary focus:outline-none transition-colors shrink-0 flex items-center justify-center"
              aria-label={isOpen ? "Close menu" : "Open menu"}
              aria-expanded={isOpen}
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* ─── Mobile Slide-down Navigation Menu ─── */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 top-16 bg-black/50 backdrop-blur-xs z-40 lg:hidden animate-in fade-in-0 duration-200"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />

          <div className="lg:hidden bg-background/98 backdrop-blur-md border-b border-border absolute top-full left-0 right-0 w-full z-50 shadow-2xl animate-in slide-in-from-top-2 max-h-[calc(100dvh-4rem)] overflow-y-auto overscroll-contain">
            <div className="px-4 pt-3 pb-8 space-y-4">
              {/* Language Switch inside menu for convenience */}
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-secondary/60 border border-border">
                <span className="text-xs font-semibold text-muted-foreground">
                  {isBn ? "ভাষা নির্বাচন করুন" : "Select Language"}
                </span>
                <button
                  onClick={toggleLocale}
                  className="px-2.5 py-1 text-xs font-bold rounded-lg border border-border bg-background hover:bg-secondary text-foreground transition-all flex items-center gap-1.5 shadow-xs"
                >
                  <Globe className="w-3.5 h-3.5 text-accent" />
                  <span>{isBn ? "🇧🇩 বাংলা" : "🇬🇧 English"}</span>
                </button>
              </div>
            {/* Direct Call / WhatsApp strip */}
            <div className="grid grid-cols-2 gap-2 pt-1 pb-2">
              <a
                href="tel:01778506500"
                className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold shadow-xs"
              >
                <Phone className="w-3.5 h-3.5 text-accent" />
                <span>01778-506500</span>
              </a>
              <a
                href={`https://wa.me/${SITE_CONFIG.whatsapp}?text=${encodeURIComponent(
                  isBn
                    ? "আসসালামু আলাইকুম, আমি বিল্ডিং ডিজাইন ও প্ল্যান সংক্রান্ত তথ্য জানতে চাই।"
                    : "Hello HF Engineering, I would like to inquire about building design and plan consultancy."
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold shadow-xs"
              >
                <WhatsAppIcon className="w-3.5 h-3.5" />
                <span>{isBn ? "WhatsApp চ্যাট" : "WhatsApp Chat"}</span>
              </a>
            </div>

            {/* Main Navigation Links */}
            <div>
              <p className="px-2 text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                {isBn ? "মূল নেভিগেশন" : "Main Navigation"}
              </p>
              <div className="space-y-1">
                <Link
                  href="/"
                  prefetch={true}
                  onClick={() => setIsOpen(false)}
                  className={`block px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                    pathname === "/" ? "bg-accent/15 text-accent font-bold" : "text-foreground hover:bg-secondary"
                  }`}
                >
                  {t("nav.home")}
                </Link>

                <Link
                  href="/services"
                  prefetch={true}
                  onClick={() => setIsOpen(false)}
                  className={`block px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                    pathname === "/services" ? "bg-accent/15 text-accent font-bold" : "text-foreground hover:bg-secondary"
                  }`}
                >
                  {t("nav.services")}
                </Link>

                <Link
                  href="/portfolio"
                  prefetch={true}
                  onClick={() => setIsOpen(false)}
                  className={`block px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                    pathname === "/portfolio" ? "bg-accent/15 text-accent font-bold" : "text-foreground hover:bg-secondary"
                  }`}
                >
                  {t("nav.portfolio")}
                </Link>

                <Link
                  href="/cost-estimator"
                  prefetch={true}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                    pathname === "/cost-estimator"
                      ? "bg-accent/15 text-accent font-bold"
                      : "text-foreground hover:bg-secondary"
                  }`}
                >
                  <span>{t("nav.costEstimator")}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-accent/20 text-accent">
                    {isBn ? "জনপ্রিয়" : "Popular"}
                  </span>
                </Link>

                <Link
                  href="/about"
                  prefetch={true}
                  onClick={() => setIsOpen(false)}
                  className={`block px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                    pathname === "/about" ? "bg-accent/15 text-accent font-bold" : "text-foreground hover:bg-secondary"
                  }`}
                >
                  {t("nav.about")}
                </Link>

                <Link
                  href="/team"
                  prefetch={true}
                  onClick={() => setIsOpen(false)}
                  className={`block px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                    pathname === "/team" ? "bg-accent/15 text-accent font-bold" : "text-foreground hover:bg-secondary"
                  }`}
                >
                  {t("nav.team")}
                </Link>

                <Link
                  href="/contact"
                  prefetch={true}
                  onClick={() => setIsOpen(false)}
                  className={`block px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                    pathname === "/contact" ? "bg-accent/15 text-accent font-bold" : "text-foreground hover:bg-secondary"
                  }`}
                >
                  {t("nav.contact")}
                </Link>
              </div>
            </div>

            {/* Quick Client Utilities Cards */}
            <div className="pt-2 border-t border-border">
              <p className="px-2 text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-2">
                {isBn ? "ক্লায়েন্ট সার্ভিস" : "Client Services"}
              </p>
              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/track-plan"
                  onClick={() => setIsOpen(false)}
                  className="p-3 rounded-xl bg-card border border-border hover:border-accent/40 text-left transition-colors flex flex-col justify-between"
                >
                  <Search className="w-4 h-4 text-accent mb-1" />
                  <span className="text-xs font-bold text-foreground">
                    {isBn ? "প্ল্যান ট্র্যাকিং" : "Track Plan"}
                  </span>
                  <span className="text-[10px] text-muted-foreground mt-0.5">
                    {isBn ? "ফাইলের অগ্রগতি দেখুন" : "Check File Status"}
                  </span>
                </Link>

                <Link
                  href="/client-portal"
                  onClick={() => setIsOpen(false)}
                  className="p-3 rounded-xl bg-card border border-border hover:border-accent/40 text-left transition-colors flex flex-col justify-between"
                >
                  <User className="w-4 h-4 text-accent mb-1" />
                  <span className="text-xs font-bold text-foreground">
                    {isBn ? "ক্লায়েন্ট পোর্টাল" : "Client Portal"}
                  </span>
                  <span className="text-[10px] text-muted-foreground mt-0.5">
                    {isBn ? "ড্রয়িং ও স্ট্যাটাস" : "Drawings & Files"}
                  </span>
                </Link>
              </div>
            </div>

            {/* Bottom Primary CTA */}
            <div className="pt-2">
              <Link href="/sketch-upload" onClick={() => setIsOpen(false)}>
                <Button className="w-full bg-accent hover:bg-accent/90 text-primary-foreground font-bold h-11 rounded-xl shadow-md gap-2">
                  <UploadCloud className="w-4 h-4" />
                  <span>
                    {isBn ? "নকশা পাঠান (ফ্রি পরামর্শ ও কোটেশন)" : "Send Sketch (Free Quote & Advice)"}
                  </span>
                </Button>
              </Link>
            </div>
            </div>
          </div>
        </>
      )}
    </header>
  );
}
