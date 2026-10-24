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
    image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=900&auto=format&fit=crop",
    badge: "Most Popular",
    badgeColor: "bg-accent text-accent-foreground",
    description:
      "Our core service. We draft meticulous 2D floor plans, elevations, and structural drawings using AutoCAD, ensuring absolute precision for construction.",
    scope: [
      "Floor Plan Layouts",
      "Elevation & Section Drawings",
      "Foundation Details",
      "Column & Beam Layouts",
      "Plumbing & Electrical Drafts",
    ],
    deliveryDays: "7–15 Days",
    startingPrice: "From ৳5,000",
    ctaText: "Get a Plan",
    ctaHref: "/book-appointment",
    waText: "I am interested in 2D Architectural & Structural Plan.",
  },
  {
    id: "3d-design",
    icon: Building2,
    title: "3D Exterior & Interior Renderings",
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=900&auto=format&fit=crop",
    badge: "Visualization",
    badgeColor: "bg-purple-600 text-white",
    description:
      "Visualize your future building before a single brick is laid. We create highly detailed, photorealistic 3D models and animations using Revit, SketchUp, and Lumion.",
    scope: [
      "Photorealistic Exterior Views",
      "Interior Design & Material Selection",
      "Day / Night Lighting Simulations",
      "3D Walkthrough Animations",
    ],
    deliveryDays: "5–10 Days",
    startingPrice: "From ৳3,000",
    ctaText: "Get 3D Design",
    ctaHref: "/book-appointment",
    waText: "I am interested in 3D Exterior & Interior Renderings.",
  },
  {
    id: "boq",
    icon: Calculator,
    title: "BOQ Construction Cost Estimation",
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=900&auto=format&fit=crop",
    badge: "Budget Smart",
    badgeColor: "bg-emerald-600 text-white",
    description:
      "Never go over budget. We calculate the exact quantities of all materials required and provide current market rates for highly accurate cost prediction.",
    scope: [
      "Rod / Steel Quantity Calculation",
      "Cement, Sand & Brick Estimation",
      "Labor Cost Projections",
      "Finishing Material Budgeting",
    ],
    deliveryDays: "3–5 Days",
    startingPrice: "From ৳2,000",
    ctaText: "Estimate Cost",
    ctaHref: "/cost-estimator",
    waText: "I am interested in BOQ Construction Cost Estimation.",
  },
  {
    id: "plan-passing",
    icon: FileCheck2,
    title: "Municipal Plan Passing Approvals",
    image: "https://images.unsplash.com/photo-1568992687947-868a62a9f521?q=80&w=900&auto=format&fit=crop",
    badge: "Legal Clearance",
    badgeColor: "bg-blue-600 text-white",
    description:
      "We handle all the paperwork and bureaucracy. From Union Parishad to Paurashava and RAJUK, we ensure your building plan receives full legal approval.",
    scope: [
      "Documentation Preparation",
      "Soil Test Reports",
      "Authority Liaison",
      "Real-time File Tracking",
    ],
    deliveryDays: "1–3 Months",
    startingPrice: "From ৳10,000",
    ctaText: "Start Approval",
    ctaHref: "/book-appointment",
    waText: "I am interested in Municipal Plan Passing Approvals.",
  },
  {
    id: "supervision",
    icon: HardHat,
    title: "On-site Technical Supervision",
    image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=900&auto=format&fit=crop",
    badge: "During Construction",
    badgeColor: "bg-orange-600 text-white",
    description:
      "Our engineers visit your site during critical construction phases to ensure the contractor is following the structural design perfectly and materials meet quality standards.",
    scope: [
      "Foundation Pouring Inspection",
      "Column & Roof Casting Supervision",
      "Material Quality Checking",
      "Safety Protocol Enforcement",
    ],
    deliveryDays: "Throughout Construction",
    startingPrice: "Contract-based",
    ctaText: "Book Supervision",
    ctaHref: "/book-appointment",
    waText: "I am interested in On-site Technical Supervision.",
  },
];

const stats = [
  { icon: Users, value: "500+", label: "Happy Clients" },
  { icon: Building2, value: "800+", label: "Projects Completed" },
  { icon: Star, value: "10+", label: "Years Experience" },
  { icon: Clock, value: "98%", label: "On-time Delivery" },
];

export function ServicesHero() {
  return (
    <section className="bg-primary pt-32 pb-24 text-center px-4 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
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
          Our <span className="text-accent">Services</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-lg text-primary-foreground/80 max-w-2xl mx-auto mb-10"
        >
          From the first sketch to the final brick. HF provides complete end-to-end
          civil engineering solutions for your dream project.
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
                {s.title.split(" ").slice(0, 2).join(" ")}
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
              <div
                key={i}
                className="bg-white/10 rounded-xl p-4 border border-white/15 text-center"
              >
                <Icon className="w-5 h-5 text-accent mx-auto mb-2" />
                <p className="text-2xl font-bold text-primary-foreground font-heading">
                  {stat.value}
                </p>
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
                  <div
                    className={`absolute top-4 left-4 z-20 px-3 py-1 rounded-full text-xs font-bold ${svc.badgeColor} shadow`}
                  >
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

                {/* Delivery & Price Info */}
                <div className="mt-4 flex gap-3">
                  <div className="flex-1 flex items-center gap-2 bg-secondary/50 border border-border rounded-xl px-4 py-3">
                    <Clock className="w-4 h-4 text-accent shrink-0" />
                    <div>
                      <p className="text-[10px] text-muted-foreground">Delivery Time</p>
                      <p className="text-sm font-semibold text-foreground">{svc.deliveryDays}</p>
                    </div>
                  </div>
                  <div className="flex-1 flex items-center gap-2 bg-secondary/50 border border-border rounded-xl px-4 py-3">
                    <Star className="w-4 h-4 text-accent shrink-0" />
                    <div>
                      <p className="text-[10px] text-muted-foreground">Starting Price</p>
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

                <h2 className="text-3xl font-bold font-heading text-foreground">{svc.title}</h2>

                <p className="text-lg text-muted-foreground leading-relaxed">{svc.description}</p>

                {/* Scope */}
                <div className="bg-secondary/40 p-5 rounded-xl border border-border">
                  <h4 className="font-semibold mb-4 text-primary flex items-center gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-accent" />
                    Scope of Work
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
                    href={`https://wa.me/8801778506500?text=${encodeURIComponent(svc.waText)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1"
                  >
                    <Button
                      variant="outline"
                      className="w-full font-semibold border-green-500 text-green-600 hover:bg-green-50 hover:text-green-700"
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      WhatsApp Us
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
          <div
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='1' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
          <div className="relative z-10">
            <h3 className="text-2xl md:text-3xl font-bold font-heading text-primary-foreground mb-4">
              Ready to Start Your Dream Project?
            </h3>
            <p className="text-primary-foreground/75 mb-8 max-w-xl mx-auto">
              Get a free consultation today. Our experienced engineering team is ready
              to discuss your project requirements.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/book-appointment">
                <Button size="lg" variant="secondary" className="font-bold px-8">
                  Book an Appointment <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <a href="tel:+8801778506500">
                <Button
                  size="lg"
                  className="font-bold px-8 bg-white/15 border border-white/30 text-white hover:bg-white/25 hover:text-white"
                >
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
