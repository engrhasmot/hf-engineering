"use client";

import { useState } from "react";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  CalendarDays,
  CheckCircle2,
  X,
  MessageCircle,
  ExternalLink,
  Navigation,
  Compass,
  HardHat,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Contact2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { format } from "date-fns";
import SEOHead from "@/components/shared/SEOHead";
import Link from "next/link";
import { SITE_CONFIG } from "@/lib/constants";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    appointmentType: "site-visit",
    date: "",
    timeSlot: "",
    location: "",
    notes: "",
  });
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [minDate] = useState(() => format(new Date(Date.now() + 86400000), "yyyy-MM-dd"));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const json = await res.json();

      if (res.ok && json.success) {
        setShowSuccess(true);
        setFormData({
          name: "",
          phone: "",
          email: "",
          appointmentType: "site-visit",
          date: "",
          timeSlot: "",
          location: "",
          notes: "",
        });
      } else {
        toast.error(json.error || "Failed to book appointment");
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-background">
      <SEOHead
        title="Contact Us | HF Design & Engineering Solutions"
        description="Connect with Engr. Md. Hasmot Ali's engineering team in Savar, Dhaka. Book site visits, plan consultations, or call our direct hotline."
      />

      {/* ─── HERO SECTION ─── */}
      <section className="relative bg-primary pt-32 pb-24 text-center px-4 overflow-hidden">
        {/* Blueprint background grid */}
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        <div className="relative z-10 max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/20 border border-accent/30 text-accent text-xs md:text-sm font-semibold mb-6">
            <Sparkles className="w-4 h-4" />
            Direct Engineering Hotline & Office Consultation
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold font-heading text-primary-foreground leading-tight mb-6">
            Get In Touch With <br />
            <span className="text-accent">Our Engineering Team</span>
          </h1>

          <p className="text-base md:text-xl text-primary-foreground/80 max-w-3xl mx-auto leading-relaxed mb-10">
            Whether you need a complete architectural drawing, RAJUK/Municipal plan approval, or on-site concrete casting supervision — we are ready to guide your project.
          </p>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {[
              { val: "Instant", label: "WhatsApp Support", sub: "Quick Project Guidance" },
              { val: "Savar", label: "Head Office", sub: "Radio Colony, Dhaka" },
              { val: "Sat – Thu", label: "Visiting Hours", sub: "9:00 AM – 8:00 PM" },
              { val: "Free", label: "First Consultation", sub: "No Initial Fee" },
            ].map((stat, i) => (
              <div
                key={i}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/15 text-center"
              >
                <p className="text-xl md:text-2xl font-extrabold text-accent font-heading">
                  {stat.val}
                </p>
                <p className="text-sm font-bold text-primary-foreground mt-0.5">
                  {stat.label}
                </p>
                <p className="text-xs text-primary-foreground/70">{stat.sub}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Diagonal Bottom Cut */}
        <div
          className="absolute bottom-0 w-full h-12 bg-background"
          style={{ clipPath: "polygon(0 100%, 100% 0, 100% 100%)" }}
        />
      </section>

      {/* ─── 4 CHANNELS CARDS ─── */}
      <section className="py-12 -mt-10 relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1: Direct Hotline */}
          <div className="bg-card rounded-2xl p-6 border border-border shadow-sm hover:shadow-xl transition-all flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4">
                <Phone className="w-6 h-6 text-accent" />
              </div>
              <h3 className="font-bold text-lg text-foreground mb-1">Direct Call Hotline</h3>
              <p className="text-xs text-muted-foreground mb-4">
                Speak directly with Engr. Md. Hasmot Ali
              </p>
              <div className="space-y-1 text-sm font-mono font-semibold text-foreground">
                <p>+880 1778-506500</p>
                <p>+880 1631-186218</p>
              </div>
            </div>
            <div className="pt-5 mt-4 border-t border-border">
              <a href="tel:+8801778506500" className="w-full block">
                <Button size="sm" className="w-full font-bold">
                  <Phone className="w-4 h-4 mr-1.5" /> Call Now
                </Button>
              </a>
            </div>
          </div>

          {/* Card 2: Instant WhatsApp */}
          <div className="bg-card rounded-2xl p-6 border border-border shadow-sm hover:shadow-xl transition-all flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 mb-4">
                <MessageCircle className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="font-bold text-lg text-foreground mb-1">Instant WhatsApp</h3>
              <p className="text-xs text-muted-foreground mb-4">
                Send sketches, land details or inquiries
              </p>
              <p className="text-sm font-mono font-semibold text-emerald-600">
                +880 1778-506500
              </p>
              <p className="text-xs text-muted-foreground mt-1">Available 7 days a week</p>
            </div>
            <div className="pt-5 mt-4 border-t border-border">
              <a
                href={`https://wa.me/8801778506500?text=${encodeURIComponent(
                  "আসসালামুয়ালাইকুম ইঞ্জিনিয়ার মোঃ হাসমত আলী সাহেব, আমি আপনার ওয়েবসাইটের কন্টাক্ট পেজ থেকে যোগাযোগ করছি। আমার জমির ড্রয়িং ও প্ল্যান নিয়ে আলোচনা করতে চাই।"
                )}`}
                target="_blank"
                rel="noreferrer"
                className="w-full block"
              >
                <Button size="sm" className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold">
                  <MessageCircle className="w-4 h-4 mr-1.5" /> Chat on WhatsApp
                </Button>
              </a>
            </div>
          </div>

          {/* Card 3: Office Address & Hours */}
          <div className="bg-card rounded-2xl p-6 border border-border shadow-sm hover:shadow-xl transition-all flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-600 mb-4">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-bold text-lg text-foreground mb-1">Office Hours</h3>
              <p className="text-xs text-muted-foreground mb-3">
                Visit our design studio in Savar
              </p>
              <div className="text-xs text-muted-foreground space-y-1.5">
                <p>
                  <strong className="text-foreground">Sat – Thu:</strong> 9:00 AM – 8:00 PM
                </p>
                <p>
                  <strong className="text-foreground">Friday:</strong> By Appointment
                </p>
                <p className="text-[11px] text-accent font-semibold pt-1">
                  Near Savar Radio Colony Bus Stand
                </p>
              </div>
            </div>
            <div className="pt-5 mt-4 border-t border-border">
              <a
                href="https://maps.app.goo.gl/wdBzkKfqCw4Kbggs7"
                target="_blank"
                rel="noreferrer"
                className="w-full block"
              >
                <Button size="sm" variant="outline" className="w-full font-bold">
                  <Navigation className="w-4 h-4 mr-1.5" /> Get Directions
                </Button>
              </a>
            </div>
          </div>

          {/* Card 4: Official Email & Social */}
          <div className="bg-card rounded-2xl p-6 border border-border shadow-sm hover:shadow-xl transition-all flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-600 mb-4">
                <Mail className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-bold text-lg text-foreground mb-1">Email & Social</h3>
              <p className="text-xs text-muted-foreground mb-4">
                Send official tender or proposals
              </p>
              <p className="text-xs font-mono font-semibold text-foreground truncate">
                info@hfengineeringbd.com
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                Facebook: HF Design &amp; Engineering
              </p>
            </div>
            <div className="pt-5 mt-4 border-t border-border">
              <Link href="/card" className="w-full block">
                <Button size="sm" variant="secondary" className="w-full font-bold">
                  <Contact2 className="w-4 h-4 mr-1.5" /> Engineer Smart Card
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── MAIN 2-COLUMN SECTION: OFFICE INFO + BOOKING FORM ─── */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Office Details & Map (5 cols) */}
          <div className="lg:col-span-5 space-y-8">
            <div>
              <span className="inline-flex items-center gap-2 text-accent font-bold text-xs uppercase tracking-widest mb-3">
                <span className="h-px w-8 bg-accent" />
                Office Presence
              </span>
              <h2 className="text-3xl font-bold font-heading text-foreground mb-3">
                Visit Our Design Studio
              </h2>
              <p className="text-muted-foreground text-sm leading-relaxed">
                We warmly welcome you to visit our office with your land deed, mutation khatian, and rough sketches. Our engineers will sit down with you over tea to review feasibility.
              </p>
            </div>

            {/* Address Banner */}
            <div className="p-6 rounded-2xl bg-card border border-border shadow-sm space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-accent/15 flex items-center justify-center shrink-0 mt-0.5">
                  <MapPin className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <h4 className="font-bold text-foreground text-base">Head Office Address</h4>
                  <p className="text-sm text-foreground font-medium mt-1">
                    আয়শা মঞ্জিল, বাড়ি ১৪/০৫, ওয়ার্ড নং ১
                  </p>
                  <p className="text-xs text-muted-foreground">
                    নয়াবাড়ি, সাভার রেডিও কলোনি, ঢাকা
                  </p>
                  <p className="text-xs text-muted-foreground mt-1 font-mono">
                    Aysha Monjil, House 14/05, Noyabari, Savar Radio Colony, Dhaka
                  </p>
                </div>
              </div>

              {/* Landmark Guidance */}
              <div className="pt-4 border-t border-border text-xs text-muted-foreground space-y-2">
                <div className="flex items-center gap-2">
                  <Navigation className="w-4 h-4 text-accent shrink-0" />
                  <span>
                    <strong>Landmark:</strong> সাভার রেডিও কলোনি বাসস্ট্যান্ড থেকে পূর্বে মাত্র ২ মিনিটের দূরত্ব।
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-accent shrink-0" />
                  <span>
                    <strong>Service Area:</strong> সাভার, আশুলিয়া, ধামরাই, ঢাকা সিটি ও গাজীপুর।
                  </span>
                </div>
              </div>
            </div>

            {/* Google Maps Embed */}
            <div className="h-80 rounded-2xl overflow-hidden shadow-md border border-border relative group">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3650.8!2d90.2624181!3d23.8609885!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755e92add9847fd%3A0xdc7dc2fa86128021!2sAyasha%20Manzil!5e0!3m2!1sen!2sbd!4v1700000000000!5m2!1sen!2sbd"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="transition-all duration-300 group-hover:scale-102"
              />
              <a
                href="https://maps.app.goo.gl/wdBzkKfqCw4Kbggs7"
                target="_blank"
                rel="noopener noreferrer"
                className="absolute bottom-3 right-3 bg-primary text-primary-foreground px-4 py-2 rounded-xl text-xs font-bold shadow-lg hover:bg-primary/90 transition-colors flex items-center gap-1.5"
              >
                <MapPin className="w-3.5 h-3.5 text-accent" />
                Open Google Maps <ExternalLink className="w-3 h-3 ml-1" />
              </a>
            </div>
          </div>

          {/* Right Column: Booking Form (7 cols) */}
          <div className="lg:col-span-7">
            <div className="bg-card p-8 md:p-10 rounded-3xl shadow-xl border border-border">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-accent/15 flex items-center justify-center">
                  <CalendarDays className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold font-heading text-foreground">
                    Book an Engineering Appointment
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Reserve an office meeting or request an engineer visit to your construction site.
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="text-xs font-bold text-foreground mb-2 block">
                      Full Name *
                    </label>
                    <Input
                      required
                      placeholder="e.g. Md. Anisur Rahman"
                      className="h-12 bg-muted/40"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-foreground mb-2 block">
                      Phone Number *
                    </label>
                    <Input
                      required
                      placeholder="017XXXXXXXX"
                      className="h-12 bg-muted/40 font-mono"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="text-xs font-bold text-foreground mb-2 block">
                      Email Address (Optional)
                    </label>
                    <Input
                      type="email"
                      placeholder="name@example.com"
                      className="h-12 bg-muted/40"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-foreground mb-2 block">
                      Appointment Purpose *
                    </label>
                    <select
                      className="flex h-12 w-full rounded-md border border-input bg-muted/40 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      value={formData.appointmentType}
                      onChange={(e) =>
                        setFormData({ ...formData, appointmentType: e.target.value })
                      }
                    >
                      <option value="site-visit">On-site Survey &amp; Land Inspection</option>
                      <option value="consultation">Office Blueprint Consultation</option>
                      <option value="plan-passing">RAJUK / Municipal Plan Passing</option>
                      <option value="soil-test">Soil Test &amp; Foundation Advice</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="text-xs font-bold text-foreground mb-2 block">
                      Preferred Date *
                    </label>
                    <Input
                      type="date"
                      required
                      min={minDate}
                      className="h-12 bg-muted/40"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-foreground mb-2 block">
                      Preferred Time Slot *
                    </label>
                    <select
                      required
                      className="flex h-12 w-full rounded-md border border-input bg-muted/40 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      value={formData.timeSlot}
                      onChange={(e) => setFormData({ ...formData, timeSlot: e.target.value })}
                    >
                      <option value="">Select a time...</option>
                      <option value="10:00 AM">10:00 AM (Morning)</option>
                      <option value="11:30 AM">11:30 AM (Late Morning)</option>
                      <option value="02:30 PM">02:30 PM (Afternoon)</option>
                      <option value="04:30 PM">04:30 PM (Evening)</option>
                      <option value="06:30 PM">06:30 PM (Night)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-foreground mb-2 block">
                    Project Location / Plot Address *
                  </label>
                  <Input
                    placeholder="e.g. Noyabari, Savar / Zirabo, Ashulia"
                    className="h-12 bg-muted/40"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-foreground mb-2 block">
                    Project Details &amp; Requirements (Optional)
                  </label>
                  <textarea
                    className="flex w-full rounded-md border border-input bg-muted/40 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring min-h-[110px]"
                    placeholder="Tell us about your plot size (decimal/katha), how many floors you plan to build, or your current construction stage..."
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full h-14 text-base font-bold bg-accent hover:bg-accent/90 text-primary-foreground shadow-lg shadow-accent/20"
                  disabled={loading}
                >
                  {loading ? "Submitting Booking..." : "Confirm Appointment Request"}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* ─── EMERGENCY CONCRETE CASTING BANNER ─── */}
      <section className="py-14 bg-muted/40 border-t border-border">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-card rounded-2xl p-8 border border-border shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/10 flex items-center justify-center shrink-0">
                <HardHat className="w-7 h-7 text-amber-600" />
              </div>
              <div>
                <h4 className="font-bold text-lg text-foreground">
                  Roof or Foundation Casting Scheduled?
                </h4>
                <p className="text-xs md:text-sm text-muted-foreground mt-0.5">
                  Need an expert engineer on-site to inspect rod spacing, cover blocks, and concrete slump test?
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 w-full md:w-auto">
              <a href="tel:+8801778506500" className="flex-1 md:flex-initial">
                <Button className="w-full font-bold bg-accent hover:bg-accent/90 text-primary-foreground">
                  <Phone className="w-4 h-4 mr-2" /> Urgent Site Hotline
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ─── SUCCESS MODAL ─── */}
      {showSuccess && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <div className="bg-card rounded-3xl shadow-2xl p-8 md:p-10 max-w-md w-full text-center border border-border animate-in fade-in zoom-in duration-300 relative">
            <button
              onClick={() => setShowSuccess(false)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-muted transition-colors"
            >
              <X className="w-5 h-5 text-muted-foreground" />
            </button>
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold font-heading mb-2">Appointment Request Received!</h2>
            <p className="text-muted-foreground mb-3 text-sm">
              আপনার অ্যাপয়েন্টমেন্ট সফলভাবে গ্রহণ করা হয়েছে।
            </p>
            <p className="text-muted-foreground text-xs mb-8 leading-relaxed">
              আমাদের ইঞ্জিনিয়ার টিম শীঘ্রই আপনার নম্বরে কল করে সময় ও লোকেশন নিশ্চিত করবে।
            </p>
            <Button
              onClick={() => setShowSuccess(false)}
              className="w-full h-12 bg-accent hover:bg-accent/90 text-primary-foreground font-bold"
            >
              ঠিক আছে
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
