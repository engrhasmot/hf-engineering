"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Loader2,
  X,
  ZoomIn,
  MapPin,
  SlidersHorizontal,
  MessageCircle,
  Search,
  Building2,
  Ruler,
  Layers,
  HardHat,
  Home,
  CheckCircle2,
  ArrowRight,
  Maximize2,
  Calendar,
  Sparkles,
  Phone,
  Compass,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ImageSlider from "@/components/portfolio/ImageSlider";
import dynamic from "next/dynamic";
import SEOHead from "@/components/shared/SEOHead";
import { SITE_CONFIG } from "@/lib/constants";
import Link from "next/link";

const ProjectMap = dynamic(
  () => import("@/components/portfolio/ProjectMap"),
  { ssr: false, loading: () => <div className="h-[420px] bg-muted animate-pulse rounded-2xl" /> }
);

interface ProjectItem {
  _id: string;
  title: string;
  category: "2d-plan" | "3d-exterior" | "3d-interior" | "construction";
  location: string;
  area?: number | string;
  stories?: string;
  client?: string;
  description: string;
  images: { url: string; alt?: string; isBefore?: boolean }[];
  tags: string[];
  featured?: boolean;
}

/* ─── Curated Showcase Projects for Rich Display ─── */
const CURATED_PROJECTS: ProjectItem[] = [
  {
    _id: "c1",
    title: "Modern Duplex Residence",
    category: "3d-exterior",
    location: "Savar Radio Colony, Dhaka",
    area: "3,850",
    stories: "Duplex (G+1)",
    client: "Dr. K. Rahman",
    description: "A contemporary duplex villa featuring expansive double-height glass glazing, cantilevered balconies, natural stone cladding, and lush rooftop gardening. Designed strictly compliant with local setback rules.",
    images: [
      { url: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=1000&auto=format&fit=crop", alt: "Modern Duplex Residence 3D Exterior" },
      { url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1000&auto=format&fit=crop", alt: "Side elevation" },
    ],
    tags: ["Revit 3D", "Photorealistic Lumion", "Setback Compliant", "Modern Villa"],
    featured: true,
  },
  {
    _id: "c2",
    title: "6-Story Mixed-Use Commercial & Residential Tower",
    category: "3d-exterior",
    location: "Dhanmondi, Dhaka",
    area: "14,200",
    stories: "G+5 (6-Storied)",
    client: "Haque Properties Ltd.",
    description: "Ground and 1st floor retail showroom with 4 floors of luxury 3-BHK residential apartments. Features underground parking, dual elevators, emergency fire exit stairs, and RAJUK FAR approval compliance.",
    images: [
      { url: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=1000&auto=format&fit=crop", alt: "Commercial Complex Exterior" },
    ],
    tags: ["RAJUK Approved", "FAR Compliant", "Commercial Facade", "Fire Safety"],
    featured: true,
  },
  {
    _id: "c3",
    title: "Complete 2D Architectural & Structural Plan Passing Sheet",
    category: "2d-plan",
    location: "Noyabari, Savar",
    area: "4,600",
    stories: "G+4 (5-Storied)",
    client: "Al-Haj Rafiqul Islam",
    description: "Detailed AutoCAD architectural floor layout, column-beam schedule, footing depth calculations, electrical/plumbing drafts, and municipal approval certification sheets with engineer signing.",
    images: [
      { url: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=1000&auto=format&fit=crop", alt: "2D Architectural Working Drawing" },
    ],
    tags: ["AutoCAD 2024", "Paurashava Approved", "Column Layout", "Plumbing Draft"],
    featured: true,
  },
  {
    _id: "c4",
    title: "Luxury Penthouse Living & Dining Interior",
    category: "3d-interior",
    location: "Sector 11, Uttara, Dhaka",
    area: "2,400",
    stories: "Penthouse Floor",
    client: "Engr. Tanvir Ahmed",
    description: "High-end contemporary interior featuring concealed warm LED ceiling profiles, Italian marble flooring, custom acoustic fluted wall paneling, and an integrated modular open island kitchen.",
    images: [
      { url: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1000&auto=format&fit=crop", alt: "Luxury Living Room Interior" },
    ],
    tags: ["Luxury Interior", "3D Walkthrough", "Modular Kitchen", "Acoustic Panels"],
    featured: true,
  },
  {
    _id: "c5",
    title: "Mat Foundation & Column Casting Supervision",
    category: "construction",
    location: "Zirabo, Ashulia, Dhaka",
    area: "5,200",
    stories: "G+6 Under Construction",
    client: "Master Textile Ltd.",
    description: "On-site quality audit ensuring proper 72.5 grade rod binding spacing, cover blocks, concrete slump test verification, and ultrasonic cement ratio compliance during heavy foundation pouring.",
    images: [
      { url: "https://images.unsplash.com/photo-1504307651254-35680f356f12?q=80&w=1000&auto=format&fit=crop", alt: "Foundation Casting Supervision" },
    ],
    tags: ["Site Supervision", "Concrete Slump Test", "Mat Foundation", "Rod Inspection"],
    featured: true,
  },
  {
    _id: "c6",
    title: "Eco-Friendly Suburban Family Residence",
    category: "3d-exterior",
    location: "Hemayetpur, Savar",
    area: "3,200",
    stories: "G+2 (3-Storied)",
    client: "Mustafizur Rahman",
    description: "Designed for natural cross-ventilation and maximum daylight. Incorporates terracotta brick jali louvers, rainwater harvesting, solar panel roof racks, and a serene courtyard garden.",
    images: [
      { url: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1000&auto=format&fit=crop", alt: "Suburban Residence Elevation" },
    ],
    tags: ["Green Architecture", "Eco-friendly", "Terracotta Jali", "Cross-Ventilation"],
    featured: false,
  },
  {
    _id: "c7",
    title: "Structural Seismic Reinforcement Plan",
    category: "2d-plan",
    location: "Gazipur Chowrasta",
    area: "8,500",
    stories: "G+7 Industrial Complex",
    client: "Apex Manufacturing",
    description: "Full ETABS structural finite element analysis for earthquake zone-3 resilience. Detail working drawings for shear walls, retrofitting beams, and deep pile cap foundations according to BNBC 2020.",
    images: [
      { url: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=1000&auto=format&fit=crop", alt: "Structural Engineering Blueprint" },
    ],
    tags: ["BNBC 2020", "ETABS Analysis", "Earthquake Safe", "Pile Foundation"],
    featured: false,
  },
  {
    _id: "c8",
    title: "Master Suite & Minimalist Bedroom Design",
    category: "3d-interior",
    location: "Mirpur DOHS, Dhaka",
    area: "850",
    stories: "Master Bedroom Suite",
    client: "Brig. Gen. (Retd.) Tariq",
    description: "Scandinavian minimalist interior styling with natural oak timber veneer, walk-in vanity closet, soundproof insulated windows, and smart home automated scene lighting.",
    images: [
      { url: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=1000&auto=format&fit=crop", alt: "Master Suite Interior Design" },
    ],
    tags: ["Minimalist", "Smart Lighting", "Walk-in Closet", "Oak Wood"],
    featured: false,
  },
  {
    _id: "c9",
    title: "Roof Slab Concrete Pouring & QC Inspection",
    category: "construction",
    location: "Bypile, Ashulia",
    area: "3,600",
    stories: "4th Floor Roof Slab",
    client: "Md. Shahinur Alam",
    description: "Comprehensive site engineering visit during 5-inch thick RCC roof slab casting. Verified negative reinforcement steel chair spacing, electrical conduit placement, and vibrator compaction.",
    images: [
      { url: "https://images.unsplash.com/photo-1541888086925-920a0eb56a11?q=80&w=1000&auto=format&fit=crop", alt: "Roof Slab Casting Site" },
    ],
    tags: ["Roof Casting", "RCC Slab", "Electrical Conduits", "Quality Control"],
    featured: false,
  },
  {
    _id: "c10",
    title: "Modern Minimalist Commercial Office Interior",
    category: "3d-interior",
    location: "Gulshan-1, Dhaka",
    area: "3,500",
    stories: "Full Commercial Floor",
    client: "TechVista Solutions",
    description: "Open-plan corporate workspace with acoustic ceiling baffles, private executive cabins, 16-seat conference room, glass partitions, and ergonomic breakout lounge.",
    images: [
      { url: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1000&auto=format&fit=crop", alt: "Commercial Office Interior" },
    ],
    tags: ["Corporate Interior", "Conference Room", "Acoustic Ceilings", "Ergonomic"],
    featured: false,
  },
  {
    _id: "c11",
    title: "Municipal Approval & Soil Test File Compilation",
    category: "2d-plan",
    location: "Dhamrai Paurashava",
    area: "4,200",
    stories: "G+3 Residential",
    client: "Md. Harun-ur-Rashid",
    description: "Standard municipal plan passing package including 3 bore-hole soil investigation SPT N-value report, structural integrity certificate, setback clearance map, and ownership chain documentation.",
    images: [
      { url: "https://images.unsplash.com/photo-1568992687947-868a62a9f521?q=80&w=1000&auto=format&fit=crop", alt: "Municipal Approval Documents" },
    ],
    tags: ["Soil Test Report", "Municipal Approval", "SPT N-value", "Setback Clearance"],
    featured: false,
  },
  {
    _id: "c12",
    title: "Corner Plot Triple-Facade Apartment Complex",
    category: "3d-exterior",
    location: "Radio Colony, Savar",
    area: "9,600",
    stories: "G+6 (7-Storied)",
    client: "Engr. Hasmot Ali Portfolio",
    description: "Designed for a prominent road corner plot in Savar with three ventilated street-facing facades. Maximizes rental floor plate efficiency while maintaining aesthetic vertical louvers and rooftop community zone.",
    images: [
      { url: "https://images.unsplash.com/photo-1577495508048-b635879837f1?q=80&w=1000&auto=format&fit=crop", alt: "Corner Plot Apartment 3D Exterior" },
    ],
    tags: ["Corner Plot", "Triple Facade", "Community Roof", "Rental Yield"],
    featured: true,
  },
];

const CATEGORIES = [
  { slug: "All", name: "All Projects", icon: Compass },
  { slug: "3d-exterior", name: "3D Exterior", icon: Building2 },
  { slug: "2d-plan", name: "2D Plans & Structural", icon: Ruler },
  { slug: "3d-interior", name: "3D Interior", icon: Layers },
  { slug: "construction", name: "Construction & Sites", icon: HardHat },
] as const;

export default function PortfolioPage() {
  const [dbProjects, setDbProjects] = useState<ProjectItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch("/api/projects");
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          setDbProjects(json.data);
        }
      } catch (err) {
        console.error("Failed to load DB portfolio:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  // Merge DB projects with curated showcase so gallery is always rich and complete
  const allProjects = useMemo(() => {
    const dbIds = new Set(dbProjects.map((p) => p._id));
    const combined = [...dbProjects];
    for (const cp of CURATED_PROJECTS) {
      if (!dbIds.has(cp._id)) {
        combined.push(cp);
      }
    }
    return combined;
  }, [dbProjects]);

  // Compute counts per category
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { All: allProjects.length };
    for (const p of allProjects) {
      counts[p.category] = (counts[p.category] || 0) + 1;
    }
    return counts;
  }, [allProjects]);

  // Filtered list based on active category and search input
  const filteredProjects = useMemo(() => {
    return allProjects.filter((p) => {
      const matchCat = activeCategory === "All" || p.category === activeCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.location.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q)) ||
        (p.stories && p.stories.toLowerCase().includes(q));
      return matchCat && matchSearch;
    });
  }, [allProjects, activeCategory, searchQuery]);

  return (
    <div className="w-full min-h-screen bg-background">
      <SEOHead
        title="Portfolio | HF Design & Engineering Solutions"
        description="Explore 800+ completed 2D architectural drawings, 3D exterior/interior renders, structural analysis, and on-site construction projects across Savar and Dhaka."
      />

      {/* ─── HERO SECTION ─── */}
      <section className="relative bg-primary pt-32 pb-24 text-center px-4 overflow-hidden">
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
            800+ Structures Planned, Designed & Supervised
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-4xl md:text-6xl font-extrabold font-heading text-primary-foreground leading-tight mb-6"
          >
            Our Architecture & <br />
            <span className="text-accent">Engineering Portfolio</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-base md:text-xl text-primary-foreground/80 max-w-3xl mx-auto leading-relaxed mb-10"
          >
            Explore our curated showcase of AutoCAD working drawings, photorealistic 3D elevations, luxury residential interiors, and verified site supervision projects across Bangladesh.
          </motion.p>

          {/* Quick Metrics */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto"
          >
            {[
              { val: "800+", label: "Total Plans", sub: "Designed & Drafted" },
              { val: "500+", label: "Approvals", sub: "RAJUK & Paurashava" },
              { val: "200+", label: "3D Renders", sub: "Exterior & Walkthroughs" },
              { val: "100%", label: "BNBC Safe", sub: "Earthquake Resilient" },
            ].map((stat, i) => (
              <div
                key={i}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/15 text-center"
              >
                <p className="text-2xl md:text-3xl font-extrabold text-accent font-heading">
                  {stat.val}
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

      {/* ─── STICKY FILTER & SEARCH BAR ─── */}
      <section className="py-6 border-b border-border sticky top-16 md:top-20 bg-background/95 backdrop-blur-md z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const count = categoryCounts[cat.slug] || 0;
              const isActive = activeCategory === cat.slug;
              return (
                <button
                  key={cat.slug}
                  onClick={() => setActiveCategory(cat.slug)}
                  className={`px-4 py-2 rounded-full text-xs md:text-sm font-semibold transition-all flex items-center gap-2 ${
                    isActive
                      ? "bg-accent text-primary-foreground shadow-md scale-105"
                      : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{cat.name}</span>
                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full ${
                      isActive
                        ? "bg-primary text-accent font-bold"
                        : "bg-background text-muted-foreground"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search Field */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
            <Input
              type="text"
              placeholder="Search by location, villa, etc..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-10 text-xs bg-muted/50 rounded-full border-border focus:ring-accent"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </section>

      {/* ─── GALLERY GRID ─── */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold font-heading text-foreground">
              {activeCategory === "All"
                ? "All Featured Projects"
                : CATEGORIES.find((c) => c.slug === activeCategory)?.name}
            </h2>
            <p className="text-xs md:text-sm text-muted-foreground">
              Showing {filteredProjects.length} completed & ongoing architectural works
            </p>
          </div>
          {searchQuery && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSearchQuery("")}
              className="text-xs text-accent"
            >
              Clear Search
            </Button>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="w-10 h-10 animate-spin text-accent" />
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="text-center py-24 bg-card rounded-2xl border border-dashed border-border">
            <Building2 className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <h3 className="text-lg font-bold text-foreground">No projects found</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Try adjusting your category filter or search query.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((project, i) => {
                const coverImage =
                  project.images.find((img) => !img.isBefore)?.url ||
                  project.images[0]?.url ||
                  "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&q=80";

                return (
                  <motion.div
                    key={project._id}
                    layout
                    initial={{ opacity: 0, y: 25 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4, delay: i * 0.05 }}
                    className="group rounded-2xl overflow-hidden bg-card border border-border shadow-sm hover:shadow-2xl hover:border-accent/40 transition-all duration-300 flex flex-col cursor-pointer"
                    onClick={() => setSelectedProject(project)}
                  >
                    {/* Image Area */}
                    <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                      {/* Category Badge */}
                      <div className="absolute top-3 left-3 z-20">
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-primary/90 text-primary-foreground backdrop-blur-sm shadow border border-white/10 uppercase tracking-wider text-[11px]">
                          {project.category.replace("-", " ")}
                        </span>
                      </div>

                      {/* Stories / Size Badge */}
                      {project.stories && (
                        <div className="absolute top-3 right-3 z-20">
                          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-accent text-primary-foreground shadow">
                            {project.stories}
                          </span>
                        </div>
                      )}

                      <Image
                        src={coverImage}
                        alt={project.title}
                        width={800}
                        height={600}
                        className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700"
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-5">
                        <span className="text-white text-xs font-bold flex items-center gap-1.5 bg-accent px-3 py-1.5 rounded-full shadow">
                          <ZoomIn className="w-4 h-4" /> View Blueprint & Details
                        </span>
                      </div>
                    </div>

                    {/* Content Details */}
                    <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                      <div>
                        <h3 className="font-bold text-lg text-foreground font-heading group-hover:text-accent transition-colors line-clamp-1">
                          {project.title}
                        </h3>
                        <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-1.5">
                          <MapPin className="w-3.5 h-3.5 text-accent shrink-0" />
                          <span className="line-clamp-1">{project.location}</span>
                        </p>
                        <p className="text-xs text-muted-foreground mt-3 line-clamp-2 leading-relaxed">
                          {project.description}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-border flex items-center justify-between text-xs">
                        {project.area ? (
                          <span className="font-semibold text-foreground">
                            📐 {project.area} Sq.Ft
                          </span>
                        ) : (
                          <span className="text-muted-foreground">HF Engineering</span>
                        )}
                        <span className="text-accent font-bold group-hover:underline flex items-center gap-1">
                          Full Spec <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </section>

      {/* ─── BEFORE / AFTER TRANSFORMATION SECTION ─── */}
      <section className="py-24 bg-muted/30 border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/15 text-accent font-bold text-xs uppercase tracking-widest mb-3">
              <SlidersHorizontal className="w-4 h-4" /> Realistic 3D Visualization
            </div>
            <h2 className="text-3xl md:text-5xl font-bold font-heading text-foreground">
              See the <span className="text-accent">Transformation</span>
            </h2>
            <p className="text-muted-foreground mt-3 text-sm md:text-base leading-relaxed">
              Drag the interactive slider below to see how our engineers transform raw ideas and basic site sketches into photorealistic 3D architectural landmarks.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <div className="rounded-2xl overflow-hidden border border-border shadow-xl bg-card">
                <ImageSlider
                  beforeImage="https://images.unsplash.com/photo-1565183997392-2f6f122e5912?w=800&q=80"
                  afterImage="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80"
                  beforeAlt="Initial Raw Construction Site"
                  afterAlt="Final Modern Duplex 3D Render"
                />
              </div>
              <div className="flex items-center justify-between px-2 text-xs">
                <span className="font-bold text-foreground">Residential Duplex Villa (Savar)</span>
                <span className="text-accent font-medium">← Drag Slider →</span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="rounded-2xl overflow-hidden border border-border shadow-xl bg-card">
                <ImageSlider
                  beforeImage="https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80"
                  afterImage="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80"
                  beforeAlt="Old Building Structure"
                  afterAlt="Luxury Modern Facade & Landscape"
                />
              </div>
              <div className="flex items-center justify-between px-2 text-xs">
                <span className="font-bold text-foreground">Commercial & Apartment Facade (Dhaka)</span>
                <span className="text-accent font-medium">← Drag Slider →</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── INTERACTIVE PROJECT MAP ─── */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/15 text-accent font-bold text-xs uppercase tracking-widest mb-3">
            <MapPin className="w-4 h-4" /> Geographic Footprint
          </div>
          <h2 className="text-3xl md:text-5xl font-bold font-heading text-foreground">
            Where We&apos;ve <span className="text-accent">Built</span>
          </h2>
          <p className="text-muted-foreground mt-3 text-sm md:text-base">
            From Savar Radio Colony and Ashulia to Uttara, Dhanmondi, and Gazipur — our engineering projects span across Bangladesh.
          </p>
        </div>
        <div className="rounded-2xl overflow-hidden border border-border shadow-lg">
          <ProjectMap projects={allProjects} />
        </div>
      </section>

      {/* ─── BOTTOM CONVERSION CTA ─── */}
      <section className="py-20 bg-primary text-primary-foreground text-center relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        <div className="relative z-10 max-w-4xl mx-auto px-4 space-y-6">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/20 border border-accent/30 text-accent text-xs font-bold uppercase tracking-wider">
            <Building2 className="w-4 h-4" /> Start Your Project
          </span>
          <h2 className="text-3xl md:text-5xl font-bold font-heading">
            Inspired by Our Portfolio? Let&apos;s Design Yours.
          </h2>
          <p className="text-base md:text-lg text-primary-foreground/80 max-w-2xl mx-auto leading-relaxed">
            Whether you own a small urban residential plot or a multi-acre commercial development, our engineers deliver custom plans tailored to your exact budget.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Link href="/book-appointment">
              <Button
                size="lg"
                className="bg-accent hover:bg-accent/90 text-primary-foreground font-bold h-14 px-8 text-base shadow-lg shadow-accent/20"
              >
                Book Free Site Visit & Consultation <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <a
              href={`https://wa.me/8801778506500?text=${encodeURIComponent(
                "আসসালামুয়ালাইকুম ইঞ্জিনিয়ার মোঃ হাসমত আলী সাহেব, আমি আপনার ওয়েবসাইটের পোর্টফোলিও দেখেছি। আমার নতুন প্রজেক্টের ডিজাইন ও ড্রয়িং নিয়ে আলোচনা করতে চাই।"
              )}`}
              target="_blank"
              rel="noreferrer"
            >
              <Button
                size="lg"
                className="h-14 px-8 text-base font-bold bg-[#25D366] hover:bg-[#20bd5a] text-white"
              >
                <MessageCircle className="mr-2 w-5 h-5" /> Chat on WhatsApp
              </Button>
            </a>
            <Link href="/cost-estimator">
              <Button
                size="lg"
                className="h-14 px-8 text-base font-bold bg-white/15 border border-white/30 text-white hover:bg-white/25 hover:text-white"
              >
                Estimate Cost Instantly
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ─── MODAL POPUP FOR FULL BLUEPRINT & SPEC ─── */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/90 backdrop-blur-md"
            onClick={() => setSelectedProject(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-card w-full max-w-5xl max-h-[90vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row border border-border relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute top-4 right-4 z-30 p-2.5 bg-black/60 hover:bg-black/90 text-white rounded-full transition-colors shadow-md"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Left Side: High-res image */}
              <div className="w-full md:w-3/5 h-64 md:h-auto bg-muted relative">
                <Image
                  src={
                    selectedProject.images[0]?.url ||
                    "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&q=80"
                  }
                  alt={selectedProject.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute top-4 left-4 z-20">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-primary text-primary-foreground uppercase tracking-wider shadow">
                    {selectedProject.category.replace("-", " ")}
                  </span>
                </div>
              </div>

              {/* Right Side: Specs & Action */}
              <div className="w-full md:w-2/5 p-8 flex flex-col justify-between overflow-y-auto max-h-[85vh]">
                <div>
                  <h2 className="text-2xl font-bold font-heading text-foreground mb-2">
                    {selectedProject.title}
                  </h2>
                  <p className="text-xs text-accent font-semibold uppercase tracking-wider mb-6 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5" /> {selectedProject.location}
                  </p>

                  {/* Metadata Specs Grid */}
                  <div className="grid grid-cols-2 gap-3 p-4 bg-muted/40 rounded-xl border border-border mb-6 text-xs">
                    {selectedProject.stories && (
                      <div>
                        <span className="text-muted-foreground block text-[11px]">Floors:</span>
                        <span className="font-bold text-foreground">
                          {selectedProject.stories}
                        </span>
                      </div>
                    )}
                    {selectedProject.area && (
                      <div>
                        <span className="text-muted-foreground block text-[11px]">Total Area:</span>
                        <span className="font-bold text-foreground">
                          {selectedProject.area} Sq.Ft
                        </span>
                      </div>
                    )}
                    {selectedProject.client && (
                      <div className="col-span-2">
                        <span className="text-muted-foreground block text-[11px]">Client / Authority:</span>
                        <span className="font-semibold text-foreground">
                          {selectedProject.client}
                        </span>
                      </div>
                    )}
                  </div>

                  <h4 className="font-bold text-sm mb-2 text-foreground">
                    Project Overview
                  </h4>
                  <p className="text-muted-foreground text-xs md:text-sm leading-relaxed mb-6">
                    {selectedProject.description}
                  </p>

                  {selectedProject.tags && selectedProject.tags.length > 0 && (
                    <div>
                      <h4 className="font-bold text-xs uppercase tracking-wider text-muted-foreground mb-2">
                        Engineering Scope
                      </h4>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedProject.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2.5 py-1 rounded-md bg-secondary text-secondary-foreground text-[11px] font-medium"
                          >
                            ✓ {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-8 space-y-3">
                  <a
                    href={`https://wa.me/8801778506500?text=${encodeURIComponent(
                      `আসসালামুয়ালাইকুম ইঞ্জিনিয়ার মোঃ হাসমত আলী সাহেব, আমি আপনার ওয়েবসাইটের পোর্টফোলিওতে "${selectedProject.title}" (${selectedProject.location}) প্রজেক্টটি দেখেছি। আমার জমিতে অনুরূপ ডিজাইন ও প্ল্যান সংক্রান্ত পরামর্শ নিতে চাচ্ছি।`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full block"
                  >
                    <Button className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold h-12 text-sm gap-2 shadow-lg">
                      <MessageCircle className="w-4 h-4" /> এই ডিজাইনের ড্রয়িং নিয়ে কথা বলুন
                    </Button>
                  </a>
                  <Link href="/book-appointment" className="w-full block">
                    <Button variant="outline" className="w-full font-bold h-11 text-xs border-border">
                      বুক করুন সাইট ভিজিট <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
