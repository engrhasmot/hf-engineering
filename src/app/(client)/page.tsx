"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight, Calculator, ShieldCheck, Search, Phone,
  MessageCircle, PencilRuler, Building2, FileCheck2,
  HardHat, BarChart3, CheckCircle2, Star, Clock,
  Award, Users, ChevronLeft, ChevronRight, MapPin,
  Layers, Ruler, Home, ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { SITE_CONFIG } from "@/lib/constants";
import SEOHead from "@/components/shared/SEOHead";
import dynamic from "next/dynamic";

const TestimonialCarousel = dynamic(
  () => import("@/components/testimonials/TestimonialCarousel"),
  { loading: () => <div className="h-40 flex items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" /></div> }
);

/* ─── Animated Counter ─── */
function AnimatedCounter({ value, suffix = "" }: { value: string; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const [inView, setInView] = useState(false);
  const target = parseInt(value.replace(/[^0-9]/g, ""), 10) || 0;
  const isText = isNaN(parseInt(value, 10));
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect(); } }, { threshold: 0.5 });
    obs.observe(el); return () => obs.disconnect();
  }, []);
  useEffect(() => {
    if (!inView || isText) return;
    let s = 0; const step = Math.ceil(target / (1500 / 16));
    const t = setInterval(() => { s += step; if (s >= target) { setCount(target); clearInterval(t); } else setCount(s); }, 16);
    return () => clearInterval(t);
  }, [inView, target, isText]);
  if (isText) return <>{value}</>;
  return <span ref={ref}>{count}{suffix}</span>;
}

/* ─── Hero slides ─── */
const heroSlides = [
  { image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=900&auto=format&fit=crop", label: "Modern Residence" },
  { image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=900&auto=format&fit=crop", label: "3D Interior" },
  { image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=900&auto=format&fit=crop", label: "Commercial Building" },
];

/* ─── Services ─── */
const services = [
  { icon: Ruler, title: "2D Architectural Plan", desc: "Detailed floor plans and working drawings.", href: "/services#2d-plan" },
  { icon: Building2, title: "3D Elevation & Interior", desc: "Realistic 3D exterior visualization and interior design.", href: "/services#3d-design" },
  { icon: Layers, title: "Structural Design", desc: "Structural analysis, design and construction drawings.", href: "/services#2d-plan" },
  { icon: BarChart3, title: "BOQ & Cost Estimation", desc: "Material quantities, cost estimates and project budgeting.", href: "/services#boq" },
  { icon: FileCheck2, title: "Plan Approval", desc: "Drawing preparation and assistance with approval documentation.", href: "/services#plan-passing" },
];

/* ─── Projects ─── */
const projectFilters = ["All", "Residential", "Commercial", "Interior Design", "Structural Design"];
const projects = [
  { title: "Modern Residence", location: "Savar, Dhaka", category: "Residential", image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=600&auto=format&fit=crop" },
  { title: "Commercial Building", location: "Dhanmondi, Dhaka", category: "Commercial", image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=600&auto=format&fit=crop" },
  { title: "Interior Design", location: "Uttara, Dhaka", category: "Interior Design", image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=600&auto=format&fit=crop" },
  { title: "Structural Design", location: "Gazipur, Dhaka", category: "Structural Design", image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=600&auto=format&fit=crop" },
];

/* ─── Process Steps ─── */
const processSteps = [
  { num: "01", title: "Consultation", desc: "Discuss your idea and requirements." },
  { num: "02", title: "Analysis", desc: "Site analysis and feasibility study." },
  { num: "03", title: "Design & Drawing", desc: "2D/3D design and technical drawings." },
  { num: "04", title: "Review & Revision", desc: "Get your feedback and make changes." },
  { num: "05", title: "Final Delivery", desc: "Hand over complete drawings and documents." },
];

/* ─── Why Us ─── */
const whyUs = [
  { icon: Award, title: "Professional Design", desc: "Modern and functional design solutions." },
  { icon: CheckCircle2, title: "Detailed Drawings", desc: "Accurate and professional working drawings." },
  { icon: ShieldCheck, title: "Structural Support", desc: "Safe and durable structures." },
  { icon: BarChart3, title: "Transparent Estimates", desc: "Clear and detailed cost estimation." },
  { icon: MessageCircle, title: "Client Communication", desc: "Always connected, always supportive." },
];

export default function HomePage() {
  const router = useRouter();
  const [trackQuery, setTrackQuery] = useState("");
  const [activeSlide, setActiveSlide] = useState(0);
  const [activeFilter, setActiveFilter] = useState("All");

  /* Hero auto-slide */
  useEffect(() => {
    const t = setInterval(() => setActiveSlide(s => (s + 1) % heroSlides.length), 5000);
    return () => clearInterval(t);
  }, []);

  const prevSlide = () => setActiveSlide(s => (s - 1 + heroSlides.length) % heroSlides.length);
  const nextSlide = () => setActiveSlide(s => (s + 1) % heroSlides.length);

  const filteredProjects = activeFilter === "All"
    ? projects
    : projects.filter(p => p.category === activeFilter);

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (trackQuery.trim()) router.push(`/track-plan?query=${encodeURIComponent(trackQuery)}`);
  };

  return (
    <main className="flex flex-col w-full">
      <SEOHead
        title="HF DESIGN & ENGINEERING SOLUTIONS"
        description="Building design, 3D elevation, structural drawing, BOQ and plan approval in Savar, Dhaka."
      />

      {/* ══════════════════════════════════════════
          HERO — split layout
      ══════════════════════════════════════════ */}
      <section className="relative w-full min-h-[90vh] bg-primary overflow-hidden flex items-center">
        {/* Blueprint grid */}
        <div className="absolute inset-0 opacity-10 pointer-events-none"
          style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.15) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.15) 1px,transparent 1px)", backgroundSize: "40px 40px" }} />

        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16 grid lg:grid-cols-2 gap-12 items-center">

          {/* Left: text */}
          <div>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 mb-6">
              <span className="h-px w-10 bg-accent" />
              <span className="text-accent text-xs font-bold uppercase tracking-widest">Architectural & Engineering Consultancy</span>
            </motion.div>

            <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}
              className="text-5xl md:text-6xl font-extrabold font-heading text-primary-foreground leading-tight mb-6 bengali-text">
              পরিকল্পিত নকশা,<br />
              <span className="text-accent">নিরাপদ নির্মাণ</span>
            </motion.h1>

            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
              className="text-primary-foreground/75 text-base md:text-lg mb-8 max-w-lg bengali-text">
              আপনার ঘরের বাড়ি, অফিস বা যেকোনো স্থাপনার জন্য আমরা দিচ্ছি আধুনিক ডিজাইন ও প্রকৌশল সমাধান।
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
              className="flex flex-wrap gap-4 mb-10">
              <Link href="/book-appointment">
                <Button size="lg" className="bg-accent hover:bg-accent/90 text-primary-foreground font-bold h-12 px-7 shadow-lg shadow-accent/30 hover:-translate-y-0.5 transition-transform">
                  Free Consultation <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
              <Link href="/portfolio">
                <Button size="lg" variant="outline" className="h-12 px-7 font-bold border-2 border-white/40 text-primary-foreground hover:bg-white/10 hover:text-primary-foreground bg-transparent hover:-translate-y-0.5 transition-transform">
                  View Our Projects <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </motion.div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
              className="flex flex-wrap gap-6 text-sm text-primary-foreground/70">
              <a href="tel:+8801631186218" className="flex items-center gap-2 hover:text-accent transition-colors">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                  <Phone className="w-3.5 h-3.5" />
                </div>
                <div>
                  <p className="font-semibold text-primary-foreground text-sm">01631-186218</p>
                  <p className="text-xs">Call Now</p>
                </div>
              </a>
              <div className="w-px bg-white/20" />
              <a href={`https://wa.me/8801778506500`} target="_blank" rel="noreferrer"
                className="flex items-center gap-2 hover:text-green-400 transition-colors">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                  <MessageCircle className="w-3.5 h-3.5" />
                </div>
                <div>
                  <p className="font-semibold text-primary-foreground text-sm">01631-186218</p>
                  <p className="text-xs">WhatsApp</p>
                </div>
              </a>
            </motion.div>
          </div>

          {/* Right: image slider */}
          <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}
            className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/10 h-[420px] md:h-[500px]">

            {/* Cursive watermark */}
            <div className="absolute top-4 right-4 z-20 text-right">
              <p className="text-white/60 text-lg font-serif italic leading-tight">Build Your<br />Dream <span className="text-accent">With Us</span></p>
            </div>

            <AnimatePresence mode="wait">
              <motion.div key={activeSlide} initial={{ opacity: 0, scale: 1.05 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.6 }} className="absolute inset-0">
                <Image src={heroSlides[activeSlide].image} alt={heroSlides[activeSlide].label} fill className="object-cover" priority />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent" />
              </motion.div>
            </AnimatePresence>

            {/* Slide controls */}
            <div className="absolute bottom-5 right-5 z-20 flex items-center gap-3">
              <button onClick={prevSlide} className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/40 flex items-center justify-center transition-colors">
                <ChevronLeft className="w-4 h-4 text-white" />
              </button>
              <span className="text-white text-sm font-medium">{String(activeSlide + 1).padStart(2, "0")} / {String(heroSlides.length).padStart(2, "0")}</span>
              <button onClick={nextSlide} className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/40 flex items-center justify-center transition-colors">
                <ChevronRight className="w-4 h-4 text-white" />
              </button>
            </div>
          </motion.div>
        </div>

        {/* Diagonal cut */}
        <div className="absolute bottom-0 w-full h-12 bg-background" style={{ clipPath: "polygon(0 100%, 100% 0, 100% 100%)" }} />
      </section>

      {/* ══════════════════════════════════════════
          SERVICES — left heading + right grid
      ══════════════════════════════════════════ */}
      <section className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-12 items-start">
            {/* Left */}
            <div className="lg:col-span-1">
              <motion.span initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
                className="inline-flex items-center gap-2 text-accent font-bold text-xs uppercase tracking-widest mb-3">
                <span className="h-px w-8 bg-accent" /> Our Services
              </motion.span>
              <motion.h2 initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                className="text-3xl md:text-4xl font-heading font-bold mb-4">
                Complete Engineering Solutions
              </motion.h2>
              <p className="text-muted-foreground mb-8 leading-relaxed">
                From concept to completion — professional design, engineering and consultancy for your project.
              </p>
              <Link href="/services">
                <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground font-bold">
                  Explore All Services <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </div>

            {/* Right: vertical service list */}
            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
              {services.map((svc, i) => {
                const Icon = svc.icon;
                return (
                  <motion.div key={i} initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
                    <Link href={svc.href}
                      className="flex items-start gap-4 p-5 rounded-xl border border-border hover:border-accent/40 hover:bg-accent/5 hover:shadow-md transition-all group">
                      <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center shrink-0">
                        <Icon className="w-5 h-5 text-accent" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-foreground group-hover:text-accent transition-colors mb-0.5">{svc.title}</h3>
                        <p className="text-muted-foreground text-sm">{svc.desc}</p>
                      </div>
                      <span className="text-accent text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 mt-1 shrink-0">
                        Learn More <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          STATS BAR — dark background
      ══════════════════════════════════════════ */}
      <section className="py-14 bg-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 items-center">
            {[
              { icon: Home, num: "800", suffix: "+", label: "Projects Completed", sub: "Trusted by our clients" },
              { icon: FileCheck2, num: "500", suffix: "+", label: "Approved Plans", sub: "Quality & Compliance" },
              { icon: Building2, num: "200", suffix: "+", label: "3D Elevations", sub: "Modern & Aesthetic" },
              { icon: Users, num: "100", suffix: "%", label: "Client Satisfaction", sub: "Our Priority" },
            ].map((s, i) => {
              const Icon = s.icon;
              return (
                <motion.div key={i} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                  className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                    <Icon className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <p className="text-2xl font-extrabold text-primary-foreground font-heading">
                      <AnimatedCounter value={s.num} suffix={s.suffix} />
                    </p>
                    <p className="text-primary-foreground font-semibold text-sm leading-tight">{s.label}</p>
                    <p className="text-primary-foreground/50 text-xs">{s.sub}</p>
                  </div>
                </motion.div>
              );
            })}
            {/* Decorative text */}
            <div className="hidden lg:block text-right">
              <p className="text-2xl font-serif italic text-accent/80 leading-tight">Better Design<br />Stronger Tomorrow</p>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          RECENT PROJECTS
      ══════════════════════════════════════════ */}
      <section className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div>
              <span className="inline-flex items-center gap-2 text-accent font-bold text-xs uppercase tracking-widest mb-3">
                <span className="h-px w-8 bg-accent" /> Our Featured Projects
              </span>
              <h2 className="text-3xl md:text-4xl font-heading font-bold mb-3">Our Recent Projects</h2>
              <p className="text-muted-foreground max-w-md">
                Explore some of our completed and ongoing projects. Each project reflects our commitment to quality, innovation and client satisfaction.
              </p>
              <Link href="/portfolio" className="mt-4 inline-block">
                <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground font-bold">
                  View All Projects <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </div>
            {/* Filter tabs */}
            <div className="flex flex-wrap gap-2">
              {projectFilters.map(f => (
                <button key={f} onClick={() => setActiveFilter(f)}
                  className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors ${activeFilter === f ? "bg-accent text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}>
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProjects.map((proj, i) => (
              <motion.div key={`${activeFilter}-${i}`} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                className="group rounded-2xl overflow-hidden border border-border shadow-sm hover:shadow-xl transition-all cursor-pointer">
                <div className="relative h-52 overflow-hidden">
                  <div className="absolute top-3 left-3 z-10 px-2.5 py-1 rounded-full bg-accent text-primary-foreground text-xs font-bold">
                    {proj.category}
                  </div>
                  <Image src={proj.image} alt={proj.title} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <button className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-accent flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowRight className="w-4 h-4 text-primary-foreground" />
                  </button>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-foreground group-hover:text-accent transition-colors">{proj.title}</h3>
                  <p className="text-muted-foreground text-sm flex items-center gap-1 mt-1">
                    <MapPin className="w-3.5 h-3.5" /> {proj.location}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          3-COLUMN: WHY US | PROCESS | TESTIMONIALS
      ══════════════════════════════════════════ */}
      <section className="py-24 bg-muted/30 border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-12">

            {/* WHY CHOOSE US */}
            <div>
              <span className="inline-flex items-center gap-2 text-accent font-bold text-xs uppercase tracking-widest mb-3">
                <span className="h-px w-8 bg-accent" /> Why Choose Us
              </span>
              <h2 className="text-2xl font-heading font-bold mb-3">Why Choose HF?</h2>
              <p className="text-muted-foreground text-sm mb-6">We deliver reliable and innovative engineering solutions with a focus on quality, detail and client satisfaction.</p>
              <div className="space-y-4">
                {whyUs.map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <motion.div key={i} initial={{ opacity: 0, x: -15 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                      className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center shrink-0">
                        <Icon className="w-4 h-4 text-accent" />
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-foreground">{item.title}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* PROCESS STEPS */}
            <div>
              <span className="inline-flex items-center gap-2 text-accent font-bold text-xs uppercase tracking-widest mb-3">
                <span className="h-px w-8 bg-accent" /> Our Working Process
              </span>
              <h2 className="text-2xl font-heading font-bold mb-3">Simple Steps to Your Dream</h2>
              <p className="text-muted-foreground text-sm mb-6">A clear and professional process to bring your project to life.</p>
              <div className="space-y-4">
                {processSteps.map((step, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                    className="flex items-start gap-4 relative">
                    {/* Connector */}
                    {i < processSteps.length - 1 && <div className="absolute left-[18px] top-10 w-px h-6 bg-border" />}
                    <div className="w-9 h-9 rounded-full bg-primary border-2 border-accent flex items-center justify-center shrink-0 text-accent font-bold text-xs">
                      {step.num}
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-foreground">{step.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{step.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* TESTIMONIALS */}
            <div>
              <span className="inline-flex items-center gap-2 text-accent font-bold text-xs uppercase tracking-widest mb-3">
                <span className="h-px w-8 bg-accent" /> Testimonials
              </span>
              <h2 className="text-2xl font-heading font-bold mb-3">What Our Clients Say</h2>
              <p className="text-muted-foreground text-sm mb-6">Real feedback from our valued clients.</p>
              <TestimonialCarousel />
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          TRACK PLAN
      ══════════════════════════════════════════ */}
      <section className="py-16 bg-background border-t border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <ShieldCheck className="w-12 h-12 text-accent mx-auto mb-4" />
          <h2 className="text-2xl md:text-3xl font-heading font-bold mb-3">Track Your Plan Passing File</h2>
          <p className="text-muted-foreground mb-7">Enter your File ID to see exactly where your approval stands — no calls needed.</p>
          <form onSubmit={handleTrack} className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
            <div className="relative flex-grow">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input type="text" placeholder="Enter File ID (e.g. TH-2026-001)"
                className="w-full h-12 pl-11 pr-4 rounded-lg border border-border bg-background text-foreground focus:ring-2 focus:ring-accent outline-none text-sm"
                value={trackQuery} onChange={e => setTrackQuery(e.target.value)} required />
            </div>
            <Button type="submit" className="h-12 px-7 bg-accent hover:bg-accent/90 text-primary-foreground font-bold">Track Now</Button>
          </form>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          FINAL CTA BANNER
      ══════════════════════════════════════════ */}
      <section className="relative py-20 bg-primary overflow-hidden">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: `url("https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=1800")`, backgroundSize: "cover", backgroundPosition: "center" }} />
        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="flex items-center justify-center gap-2 mb-4">
              <PencilRuler className="w-6 h-6 text-accent" />
              <span className="text-accent font-semibold text-sm uppercase tracking-widest">Start Your Project</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary-foreground mb-3 bengali-text">
              আপনার স্বপ্নের প্রজেক্ট শুরু হোক সঠিক পরিকল্পনায়
            </h2>
            <p className="text-primary-foreground/70 mb-8 max-w-xl mx-auto">
              আপনার প্রজেক্টের পরিকল্পনা নিয়ে আলোচনা করতে আজই আমাদের সাথে যোগাযোগ করুন।
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/book-appointment">
                <Button size="lg" className="bg-accent hover:bg-accent/90 text-primary-foreground font-bold h-12 px-8">
                  Get a Consultation <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" className="h-12 px-8 font-bold bg-white/15 text-white border border-white/30 hover:bg-white/25">
                  Contact Us
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
