"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Calculator,
  ShieldCheck,
  MapPin,
  Search,
  Phone,
  MessageCircle,
  PencilRuler,
  Building2,
  FileCheck2,
  HardHat,
  BarChart3,
  CheckCircle2,
  Star,
  Clock,
  Award,
  Users,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { SITE_CONFIG } from "@/lib/constants";
import SEOHead from "@/components/shared/SEOHead";
import dynamic from "next/dynamic";

const TestimonialCarousel = dynamic(
  () => import("@/components/testimonials/TestimonialCarousel"),
  {
    loading: () => (
      <div className="flex justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    ),
  }
);

function AnimatedCounter({ value, suffix = "" }: { value: string; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const [inView, setInView] = useState(false);
  const target = parseInt(value.replace(/[^0-9]/g, ""), 10) || 0;
  const isText = isNaN(parseInt(value, 10));

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) { setInView(true); observer.disconnect(); }
      },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!inView || isText) return;
    let start = 0;
    const duration = 1500;
    const step = Math.ceil(target / (duration / 16));
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(start);
    }, 16);
    return () => clearInterval(timer);
  }, [inView, target, isText]);

  if (isText) return <>{value}</>;
  return <span ref={ref}>{count}{suffix}</span>;
}

const services = [
  {
    icon: PencilRuler,
    title: "2D Architectural & Structural Plan",
    desc: "Precision AutoCAD drafting with meticulous floor plans, elevations, and structural drawings.",
    href: "/services#2d-plan",
    color: "bg-blue-50 text-blue-600 border-blue-100",
  },
  {
    icon: Building2,
    title: "3D Exterior & Interior Renderings",
    desc: "Photorealistic 3D models in Revit & SketchUp — see your home before it's built.",
    href: "/services#3d-design",
    color: "bg-purple-50 text-purple-600 border-purple-100",
  },
  {
    icon: BarChart3,
    title: "BOQ Construction Cost Estimation",
    desc: "Accurate Bill of Quantities with current market rates so you never go over budget.",
    href: "/services#boq",
    color: "bg-emerald-50 text-emerald-600 border-emerald-100",
  },
  {
    icon: FileCheck2,
    title: "Municipal Plan Passing Approvals",
    desc: "We handle RAJUK, Paurashava & Union Parishad paperwork — hassle-free approvals.",
    href: "/services#plan-passing",
    color: "bg-blue-50 text-blue-700 border-blue-100",
  },
  {
    icon: HardHat,
    title: "On-site Technical Supervision",
    desc: "Expert engineers overseeing foundation pouring, concrete casting & material quality.",
    href: "/services#supervision",
    color: "bg-orange-50 text-orange-600 border-orange-100",
  },
  {
    icon: Calculator,
    title: "Free Cost Estimation Tool",
    desc: "Use our online calculator to instantly estimate your construction budget.",
    href: "/cost-estimator",
    color: "bg-accent/10 text-accent border-accent/20",
  },
];

const processSteps = [
  { step: "01", title: "Free Consultation", desc: "Share your land details and building requirements with our engineers." },
  { step: "02", title: "Design & Drawing", desc: "We create your 2D plan and 3D rendering within the agreed timeline." },
  { step: "03", title: "Plan Approval", desc: "Our team handles all government authority paperwork for legal clearance." },
  { step: "04", title: "Site Supervision", desc: "Engineers visit your site to ensure quality construction throughout." },
];

const whyUs = [
  { icon: Award, title: "10+ Years Experience", desc: "A decade of trusted engineering solutions across Savar and Dhaka." },
  { icon: CheckCircle2, title: "100% Legal Compliance", desc: "All designs adhere to Bangladesh National Building Code (BNBC)." },
  { icon: Clock, title: "On-time Delivery", desc: "We commit to deadlines. 98% of our projects are delivered on schedule." },
  { icon: Users, title: "500+ Happy Clients", desc: "Homeowners and businesses who built their dreams with HF." },
  { icon: Star, title: "RAJUK Registered", desc: "Officially registered with RAJUK and local municipal authorities." },
  { icon: ShieldCheck, title: "Transparent Pricing", desc: "No hidden charges. Fixed quotation before work begins." },
];

export default function HomePage() {
  const router = useRouter();
  const [trackQuery, setTrackQuery] = useState("");

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (trackQuery.trim()) {
      router.push(`/track-plan?query=${encodeURIComponent(trackQuery)}`);
    }
  };

  return (
    <main className="flex flex-col w-full">
      <SEOHead
        title="HF DESIGN & ENGINEERING SOLUTIONS"
        description="Building design, 3D elevation, structural drawing, BOQ and plan approval in Savar, Dhaka."
      />

      {/* ─── HERO ─── */}
      <section className="relative w-full min-h-[92vh] flex items-center justify-center overflow-hidden bg-primary">
        {/* Background image */}
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=1800&auto=format&fit=crop"
            alt="Engineering Blueprint"
            fill
            className="object-cover object-center opacity-10"
            priority
          />
        </div>
        {/* Blueprint grid */}
        <div
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center mt-16 md:mt-0">
          {/* Pill badge */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/20 border border-accent/30 text-accent text-sm font-medium mb-8"
          >
            <ShieldCheck className="w-4 h-4" />
            RAJUK Registered · Savar, Dhaka
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl font-extrabold text-primary-foreground font-heading tracking-tight mb-6 bengali-text"
          >
            পরিকল্পিত নকশা,{" "}
            <span className="text-accent">নিরাপদ নির্মাণ</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg md:text-xl text-primary-foreground/80 mb-10 max-w-3xl mx-auto"
          >
            Expert 2D/3D Design, BOQ Estimation, Plan Passing & Site Supervision.
            <br className="hidden md:block" />
            From the first sketch to the final brick — HF has you covered.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14"
          >
            <Link href="/book-appointment" prefetch>
              <Button
                size="lg"
                className="bg-accent hover:bg-accent/90 text-primary-foreground font-bold h-14 px-8 text-lg w-full sm:w-auto shadow-lg shadow-accent/30 transition-transform hover:-translate-y-1"
              >
                Book Free Consultation <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/cost-estimator" prefetch>
              <Button
                size="lg"
                variant="outline"
                className="h-14 px-8 text-lg font-bold border-2 border-primary-foreground/50 text-primary-foreground hover:bg-primary-foreground hover:text-primary w-full sm:w-auto transition-transform hover:-translate-y-1 bg-transparent"
              >
                <Calculator className="mr-2 h-5 w-5" /> Calculate Cost
              </Button>
            </Link>
          </motion.div>

          {/* Quick contact row */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm text-primary-foreground/70"
          >
            <a
              href="tel:+8801778506500"
              className="flex items-center gap-2 hover:text-accent transition-colors"
            >
              <Phone className="w-4 h-4" /> 01778-506500
            </a>
            <span className="hidden sm:block opacity-40">|</span>
            <a
              href={`https://wa.me/8801778506500`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 hover:text-green-400 transition-colors"
            >
              <MessageCircle className="w-4 h-4" /> WhatsApp Us
            </a>
            <span className="hidden sm:block opacity-40">|</span>
            <span className="flex items-center gap-2">
              <MapPin className="w-4 h-4" /> Savar Radio Colony, Dhaka
            </span>
          </motion.div>
        </div>

        {/* Diagonal cut */}
        <div
          className="absolute bottom-0 w-full h-16 bg-background"
          style={{ clipPath: "polygon(0 100%, 100% 0, 100% 100%)" }}
        />
      </section>

      {/* ─── STATS ─── */}
      <section className="py-12 bg-background relative z-20 -mt-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass-panel rounded-2xl p-8 grid grid-cols-2 md:grid-cols-4 gap-8 text-center shadow-xl">
            {[
              { num: "500", label: "Happy Clients", suffix: "+" },
              { num: "800", label: "Projects Completed", suffix: "+" },
              { num: "10", label: "Years Experience", suffix: "+" },
              { num: "100", label: "Client Satisfaction", suffix: "%" },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="space-y-2"
              >
                <h3 className="text-4xl font-extrabold text-accent">
                  <AnimatedCounter value={stat.num} suffix={stat.suffix} />
                </h3>
                <p className="text-sm text-muted-foreground uppercase tracking-wider font-semibold">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── SERVICES GRID ─── */}
      <section className="py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.span
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="inline-block text-accent font-semibold text-sm uppercase tracking-widest mb-3"
            >
              What We Do
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-5xl font-heading font-bold mb-4"
            >
              Engineering Excellence
            </motion.h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Comprehensive solutions from drafting the first line to pouring the final concrete.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((svc, i) => {
              const Icon = svc.icon;
              return (
                <Link href={svc.href} key={i} prefetch>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.08 }}
                    className="h-full glass-panel p-7 rounded-2xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group cursor-pointer border border-border"
                  >
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 border ${svc.color} group-hover:scale-110 transition-transform`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold mb-2 group-hover:text-accent transition-colors">
                      {svc.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{svc.desc}</p>
                    <div className="mt-4 flex items-center text-xs font-semibold text-accent opacity-0 group-hover:opacity-100 transition-opacity">
                      Learn More <ChevronRight className="w-3.5 h-3.5 ml-1" />
                    </div>
                  </motion.div>
                </Link>
              );
            })}
          </div>

          <div className="text-center mt-12">
            <Link href="/services" prefetch>
              <Button
                size="lg"
                variant="outline"
                className="border-primary text-primary hover:bg-primary hover:text-primary-foreground font-bold px-8"
              >
                Explore All Services <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block text-accent font-semibold text-sm uppercase tracking-widest mb-3">
              Simple Process
            </span>
            <h2 className="text-3xl md:text-5xl font-heading font-bold mb-4">How It Works</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              4 straightforward steps from your idea to a completed, legally approved structure.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            {/* Connector line (desktop) */}
            <div className="hidden lg:block absolute top-10 left-[12%] right-[12%] h-px bg-border z-0" />

            {processSteps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12 }}
                className="relative z-10 text-center"
              >
                <div className="w-20 h-20 rounded-2xl bg-primary flex items-center justify-center mx-auto mb-6 shadow-lg shadow-primary/20">
                  <span className="text-3xl font-black text-accent font-heading">{step.step}</span>
                </div>
                <h3 className="text-lg font-bold mb-2">{step.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-14">
            <Link href="/book-appointment">
              <Button size="lg" className="font-bold px-10">
                Start Your Project Today <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ─── WHY CHOOSE US ─── */}
      <section className="py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left: Image */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="relative rounded-2xl overflow-hidden shadow-2xl border border-border"
            >
              <Image
                src="https://images.unsplash.com/photo-1504307651254-35680f356f12?q=80&w=900&auto=format&fit=crop"
                alt="HF Engineering on-site supervision"
                width={900}
                height={600}
                className="w-full h-[420px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/50 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <div className="bg-background/90 backdrop-blur rounded-xl p-4 flex items-center gap-4 border border-border">
                  <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center shrink-0">
                    <Award className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div>
                    <p className="font-bold text-foreground text-sm">RAJUK Registered Firm</p>
                    <p className="text-xs text-muted-foreground">Officially recognized by local authorities</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right: Why us points */}
            <div>
              <span className="inline-block text-accent font-semibold text-sm uppercase tracking-widest mb-3">
                Why Choose Us
              </span>
              <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6">
                Bangladesh's Trusted Engineering Partner
              </h2>
              <p className="text-muted-foreground mb-8 leading-relaxed">
                With over a decade of experience in Savar and greater Dhaka, HF Design & Engineering Solutions
                has become the go-to firm for homeowners who want precision, transparency, and peace of mind.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {whyUs.map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 15 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.08 }}
                      className="flex items-start gap-3 p-4 rounded-xl bg-background border border-border"
                    >
                      <div className="w-9 h-9 rounded-lg bg-accent/10 flex items-center justify-center shrink-0 mt-0.5">
                        <Icon className="w-5 h-5 text-accent" />
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-foreground">{item.title}</p>
                        <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{item.desc}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── TRACK PLAN BANNER ─── */}
      <section className="py-20 bg-primary text-primary-foreground relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=2000")`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-8">
          <ShieldCheck className="w-16 h-16 text-accent mx-auto" />
          <h2 className="text-3xl md:text-5xl font-heading font-bold">
            Track Your Plan Passing File Instantly
          </h2>
          <p className="text-primary-foreground/80 text-lg">
            No more calling the municipality. Enter your File ID to see exactly where your approval is.
          </p>
          <form onSubmit={handleTrack} className="flex flex-col sm:flex-row gap-4 justify-center max-w-xl mx-auto pt-2">
            <div className="relative flex-grow">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Enter File ID (e.g. TH-2026-001)"
                className="w-full h-14 pl-12 pr-4 rounded-lg bg-background text-foreground focus:ring-2 focus:ring-accent outline-none"
                value={trackQuery}
                onChange={(e) => setTrackQuery(e.target.value)}
                required
              />
            </div>
            <Button
              type="submit"
              className="h-14 px-8 bg-accent hover:bg-accent/90 text-primary-foreground font-bold text-lg"
            >
              Track Now
            </Button>
          </form>
        </div>
      </section>

      {/* ─── TESTIMONIALS ─── */}
      <section className="py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block text-accent font-semibold text-sm uppercase tracking-widest mb-3">
              Client Reviews
            </span>
            <h2 className="text-3xl md:text-5xl font-heading font-bold mb-4">What Our Clients Say</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Hear from homeowners and businesses who trusted us with their construction journey.
            </p>
          </div>
          <TestimonialCarousel />
        </div>
      </section>

      {/* ─── FINAL CTA ─── */}
      <section className="py-24 bg-background">
        <div className="max-w-5xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-primary rounded-2xl p-12 md:p-16 text-center relative overflow-hidden"
          >
            <div
              className="absolute inset-0 opacity-5"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='1' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E")`,
              }}
            />
            <div className="relative z-10">
              <h2 className="text-3xl md:text-5xl font-heading font-bold text-primary-foreground mb-4 bengali-text">
                প্রস্তুত আপনার স্বপ্নের বাড়ি নির্মাণ শুরু করতে?
              </h2>
              <p className="text-xl text-primary-foreground/75 mb-10 max-w-2xl mx-auto">
                Contact us today for a free consultation. Let our expert engineers guide your project from design to completion.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/book-appointment" prefetch>
                  <Button
                    size="lg"
                    variant="secondary"
                    className="h-14 px-10 text-lg font-bold"
                  >
                    <MapPin className="mr-2 w-5 h-5" /> Book a Site Visit
                  </Button>
                </Link>
                <a
                  href={`https://wa.me/${SITE_CONFIG.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button
                    size="lg"
                    className="h-14 px-10 text-lg font-bold bg-[#25D366] hover:bg-[#20b858] text-white"
                  >
                    <MessageCircle className="mr-2 w-5 h-5" /> WhatsApp Us
                  </Button>
                </a>
                <a href="tel:+8801778506500">
                  <Button
                    size="lg"
                    className="h-14 px-10 text-lg font-bold bg-white/15 border border-white/30 text-white hover:bg-white/25 hover:text-white"
                  >
                    <Phone className="mr-2 w-5 h-5" /> Call Now
                  </Button>
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
