"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  ShieldCheck,
  Award,
  Users,
  Building2,
  CheckCircle2,
  Compass,
  FileCheck2,
  HardHat,
  Phone,
  MessageCircle,
  MapPin,
  ArrowRight,
  Clock,
  Sparkles,
  Layers,
  GraduationCap,
  Calendar,
  Contact2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SITE_CONFIG } from "@/lib/constants";

export function AboutHero() {
  return (
    <section className="relative bg-primary pt-32 pb-24 text-center px-4 overflow-hidden">
      {/* Background blueprint grid */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/20 border border-accent/30 text-accent text-xs md:text-sm font-semibold mb-6"
        >
          <Sparkles className="w-4 h-4" />
          Founded on Integrity & Engineering Precision · Savar, Dhaka
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-4xl md:text-6xl font-extrabold font-heading text-primary-foreground leading-tight mb-6"
        >
          Crafting Safe, Sustainable & <br />
          <span className="text-accent">Inspiring Structures</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-lg md:text-xl text-primary-foreground/80 max-w-3xl mx-auto leading-relaxed mb-10"
        >
          <span className="font-semibold text-accent">HF Design & Engineering Solutions</span> is a trusted civil engineering consultancy in Bangladesh. From the initial 2D floor sketch to final structural approval and site pouring, we guarantee compliance, safety, and architectural brilliance.
        </motion.p>

        {/* Stats Strip */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto"
        >
          {[
            { value: "10+", label: "Years Experience", sub: "Serving Greater Dhaka" },
            { value: "800+", label: "Projects Planned", sub: "Residential & Commercial" },
            { value: "500+", label: "Legal Approvals", sub: "RAJUK & Paurashava" },
            { value: "100%", label: "BNBC Compliance", sub: "Earthquake & Wind Safe" },
          ].map((stat, i) => (
            <div
              key={i}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/15 text-center"
            >
              <p className="text-2xl md:text-3xl font-extrabold text-accent font-heading">
                {stat.value}
              </p>
              <p className="text-sm font-bold text-primary-foreground mt-0.5">
                {stat.label}
              </p>
              <p className="text-xs text-primary-foreground/70">{stat.sub}</p>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Diagonal Bottom Cut */}
      <div
        className="absolute bottom-0 w-full h-12 bg-background"
        style={{ clipPath: "polygon(0 100%, 100% 0, 100% 100%)" }}
      />
    </section>
  );
}

export function AboutStory() {
  return (
    <section className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: Images Collage */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-border">
              <Image
                src="https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=900&auto=format&fit=crop"
                alt="Architectural Blueprint Drafting"
                width={800}
                height={500}
                className="w-full h-[420px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/70 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <span className="text-xs uppercase tracking-widest text-accent font-bold">
                  Our Legacy
                </span>
                <p className="text-lg font-bold">
                  Bridging traditional craftsmanship with state-of-the-art structural engineering
                </p>
              </div>
            </div>

            {/* Overlapping Badge Card */}
            <div className="hidden sm:flex absolute -bottom-8 -right-6 bg-card border-2 border-accent/40 rounded-2xl p-5 shadow-2xl items-center gap-4 max-w-xs">
              <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-7 h-7 text-accent" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase font-bold tracking-wide">
                  Certified Safety
                </p>
                <p className="text-sm font-extrabold text-foreground">
                  RAJUK & Local Authority Approved
                </p>
              </div>
            </div>
          </motion.div>

          {/* Right: Text Story */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="space-y-6"
          >
            <div>
              <span className="inline-flex items-center gap-2 text-accent font-bold text-xs uppercase tracking-widest mb-2">
                <span className="h-px w-8 bg-accent" />
                Who We Are
              </span>
              <h2 className="text-3xl md:text-5xl font-bold font-heading text-foreground">
                Building Tomorrow with Uncompromising Standards
              </h2>
            </div>

            <p className="text-muted-foreground leading-relaxed text-base md:text-lg">
              Headquartered in Savar, Dhaka, <strong>HF Design & Engineering Solutions</strong> was founded with a singular purpose: to deliver world-class architectural drafting, rigorous structural calculations, and seamless building approval services to property owners across Bangladesh.
            </p>

            <p className="text-muted-foreground leading-relaxed">
              In an era where unauthorized building and poor foundation design lead to costly structural failures, we champion compliance with the <strong>Bangladesh National Building Code (BNBC)</strong>. Every rod calculation, column spacing, and footing specification is simulated and tested to withstand seismic activity and extreme weather.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-border">
              <div className="p-4 rounded-xl bg-muted/40 border border-border">
                <p className="text-accent font-black text-xl font-heading">H</p>
                <p className="font-bold text-sm text-foreground mt-1">Honesty</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Transparent BOQ & zero hidden costs.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-muted/40 border border-border">
                <p className="text-accent font-black text-xl font-heading">F</p>
                <p className="font-bold text-sm text-foreground mt-1">Fortitude</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Durable, earthquake-resilient structures.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-muted/40 border border-border">
                <p className="text-accent font-black text-xl font-heading">S</p>
                <p className="font-bold text-sm text-foreground mt-1">Solutions</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  End-to-end service from 2D to approval.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export function AboutLeadership() {
  return (
    <section className="py-24 bg-muted/30 border-y border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-flex items-center gap-2 text-accent font-bold text-xs uppercase tracking-widest mb-3">
            <span className="h-px w-8 bg-accent" />
            Leadership Spotlight
          </span>
          <h2 className="text-3xl md:text-5xl font-bold font-heading mb-4">
            Meet the Principal Engineer
          </h2>
          <p className="text-muted-foreground">
            The visionary mind steering engineering precision, client trust, and architectural excellence at HF.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="bg-card rounded-3xl border border-border overflow-hidden shadow-xl max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-12"
        >
          {/* Left Column: Profile Card */}
          <div className="md:col-span-5 bg-primary text-primary-foreground p-8 md:p-10 flex flex-col justify-between relative overflow-hidden">
            <div
              className="absolute inset-0 opacity-10 pointer-events-none"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)",
                backgroundSize: "30px 30px",
              }}
            />

            <div className="relative z-10">
              <div className="w-24 h-24 rounded-2xl bg-accent/20 border-2 border-accent flex items-center justify-center mb-6 shadow-lg shadow-accent/20">
                <GraduationCap className="w-12 h-12 text-accent" />
              </div>
              <span className="text-xs uppercase tracking-widest text-accent font-bold">
                Founder & Principal Consultant
              </span>
              <h3 className="text-2xl md:text-3xl font-extrabold font-heading text-white mt-1">
                Engr. Md. Hasmot Ali
              </h3>
              <p className="text-primary-foreground/75 text-sm mt-1 bengali-text">
                ইঞ্জিনিয়ার মোঃ হাসমত আলী
              </p>
              <div className="h-px w-full bg-white/20 my-6" />

              <div className="space-y-3 text-xs text-primary-foreground/80">
                <div className="flex items-center gap-2.5">
                  <Award className="w-4 h-4 text-accent shrink-0" />
                  <span>B.Sc. in Civil Engineering</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-accent shrink-0" />
                  <span>RAJUK & Municipal Plan Passing Specialist</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <MapPin className="w-4 h-4 text-accent shrink-0" />
                  <span>Savar Radio Colony, Dhaka</span>
                </div>
              </div>
            </div>

            <div className="relative z-10 pt-8 flex flex-col gap-3">
              <Link href="/card" className="w-full">
                <Button className="w-full bg-accent hover:bg-accent/90 text-primary-foreground font-bold shadow-md">
                  <Contact2 className="w-4 h-4 mr-2" />
                  View Digital Smart Card
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Column: Bio & Message */}
          <div className="md:col-span-7 p-8 md:p-12 flex flex-col justify-between space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent font-bold text-xs">
                  Principal Engineer&apos;s Message
                </span>
              </div>
              <blockquote className="text-xl md:text-2xl font-serif italic text-foreground leading-relaxed mb-6">
                &ldquo;A home is often a family&apos;s lifetime dream and largest investment. Our mission is to ensure that every pillar, beam, and blueprint is engineered with zero compromise on safety, longevity, and legal certainty.&rdquo;
              </blockquote>
              <p className="text-muted-foreground text-sm md:text-base leading-relaxed mb-4">
                With a decade of hands-on structural design, foundation engineering, and municipal coordination experience, Engr. Md. Hasmot Ali has supervised over 800+ residential and commercial building plans throughout Savar, Manikganj, Gazipur, and Dhaka city.
              </p>
              <p className="text-muted-foreground text-sm leading-relaxed">
                He personally oversees structural drawings, soil test interpretation, and authority liaison to ensure our clients enjoy a seamless journey from municipal filing to finished roof-casting.
              </p>
            </div>

            <div className="pt-6 border-t border-border flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4 text-sm font-semibold">
                <a
                  href="tel:+8801778506500"
                  className="flex items-center gap-2 text-foreground hover:text-accent transition-colors"
                >
                  <Phone className="w-4 h-4 text-accent" />
                  +880 1778-506500
                </a>
                <a
                  href="https://wa.me/8801778506500"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 text-emerald-600 hover:text-emerald-700 transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  WhatsApp
                </a>
              </div>
              <Link href="/book-appointment">
                <Button variant="outline" size="sm" className="font-bold border-primary">
                  Book Consultation <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export function AboutWhyChoose() {
  const pillars = [
    {
      icon: Compass,
      title: "End-to-End Civil Engineering",
      desc: "From initial soil testing and 2D/3D architectural drafts to municipal passing and on-site pouring inspection — all under one unified roof.",
    },
    {
      icon: ShieldCheck,
      title: "BNBC Code & Earthquake Resilience",
      desc: "Every column, beam, and footing is designed strictly following Bangladesh National Building Code (BNBC) seismic and wind standards.",
    },
    {
      icon: FileCheck2,
      title: "Guaranteed Plan Approval Assistance",
      desc: "No bureaucratic headaches. We coordinate directly with Union Parishad, Paurashava, and RAJUK authorities to secure legal building permits.",
    },
    {
      icon: Layers,
      title: "Detailed BOQ & Cost Precision",
      desc: "Comprehensive Bill of Quantities calculating rod, cement, sand, brick, and labor requirements with current Bangladesh market rates.",
    },
    {
      icon: HardHat,
      title: "Physical Site Supervision",
      desc: "Our engineers inspect foundation pouring and roof casting in person so contractors cannot cut corners on cement ratio or rod spacing.",
    },
    {
      icon: Users,
      title: "Client-Centric Integrity",
      desc: "No hidden charges, no sudden price surprises. We provide signed contracts, fixed budgets, and prompt milestone updates.",
    },
  ];

  return (
    <section className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-flex items-center gap-2 text-accent font-bold text-xs uppercase tracking-widest mb-3">
            <span className="h-px w-8 bg-accent" />
            Why Choose HF
          </span>
          <h2 className="text-3xl md:text-5xl font-bold font-heading mb-4">
            The Pillars of Our Excellence
          </h2>
          <p className="text-muted-foreground text-base md:text-lg">
            Why hundreds of homeowners, property developers, and builders trust HF with their foundation and future.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {pillars.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="bg-card p-8 rounded-2xl border border-border shadow-sm hover:shadow-xl hover:border-accent/40 transition-all group"
              >
                <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Icon className="w-6 h-6 text-accent" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-accent transition-colors">
                  {item.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {item.desc}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function AboutTimeline() {
  const milestones = [
    {
      year: "2016",
      title: "HF Engineering Established",
      desc: "Began journey in Savar, Dhaka providing AutoCAD architectural plans and municipal approval consultancy.",
    },
    {
      year: "2019",
      title: "200+ Building Plans Passed",
      desc: "Crossed milestone of 200 legally approved residential and semi-commercial buildings across Savar and Dhaka.",
    },
    {
      year: "2022",
      title: "3D Photorealistic Rendering",
      desc: "Introduced Lumion & Revit 3D exterior and interior walkthroughs for client visualization before foundation work.",
    },
    {
      year: "2024",
      title: "Online Digital Systems",
      desc: "Launched digital Plan Tracking portal and instant BOQ cost estimation tool for seamless client accessibility.",
    },
    {
      year: "2026",
      title: "800+ Structures Supervised",
      desc: "Now recognized as one of the most reliable engineering consultancy firms in Savar with a 98% client satisfaction rate.",
    },
  ];

  return (
    <section className="py-24 bg-muted/30 border-t border-border">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-flex items-center gap-2 text-accent font-bold text-xs uppercase tracking-widest mb-3">
            <span className="h-px w-8 bg-accent" />
            Our Journey
          </span>
          <h2 className="text-3xl md:text-5xl font-bold font-heading mb-4">
            A Decade of Growth & Trust
          </h2>
          <p className="text-muted-foreground">
            A timeline of dedication, precision engineering, and sustained client satisfaction.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 relative">
          {milestones.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-card p-6 rounded-2xl border border-border relative text-center flex flex-col justify-between"
            >
              <div>
                <span className="inline-block px-3 py-1 rounded-full bg-accent/15 text-accent font-black text-sm font-heading mb-3">
                  {m.year}
                </span>
                <h4 className="font-bold text-foreground text-base mb-2">
                  {m.title}
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {m.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function AboutCTA({ children }: { children?: React.ReactNode }) {
  return (
    <section className="py-24 bg-primary text-primary-foreground text-center relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
      <div className="relative z-10 max-w-3xl mx-auto px-4 space-y-6">
        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-accent text-xs font-bold uppercase tracking-wider">
          <Calendar className="w-4 h-4" /> Ready to Build?
        </span>
        <h2 className="text-3xl md:text-5xl font-bold font-heading leading-tight">
          Let&apos;s Build Your Dream Structure Together
        </h2>
        <p className="text-base md:text-lg text-primary-foreground/80 max-w-2xl mx-auto leading-relaxed">
          Book a free consultation with our engineering team or visit our office in Savar. We will guide you from paperwork to key handover.
        </p>
        <div className="pt-4">{children}</div>
      </div>
    </section>
  );
}
