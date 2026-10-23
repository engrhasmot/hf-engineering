import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  AboutHero,
  AboutStory,
  AboutLeadership,
  AboutWhyChoose,
  AboutTimeline,
  AboutCTA,
} from "./AboutContent";
import type { Metadata } from "next";
import { Phone, MessageCircle, ArrowRight, MapPin } from "lucide-react";
import { SITE_CONFIG } from "@/lib/constants";

export const metadata: Metadata = {
  title: "About Us | HF Design & Engineering Solutions",
  description:
    "Learn about HF Design & Engineering Solutions, founded by Engr. Md. Hasmot Ali in Savar, Dhaka. 10+ years of civil engineering excellence, 800+ projects planned, RAJUK & municipal approvals.",
  openGraph: {
    title: "About Us | HF Design & Engineering Solutions",
    description:
      "Premier civil engineering consultancy in Bangladesh. 2D/3D design, structural analysis, BOQ estimation, and building plan passing.",
  },
};

export default function AboutPage() {
  return (
    <div className="w-full">
      <AboutHero />
      <AboutStory />
      <AboutLeadership />
      <AboutWhyChoose />
      <AboutTimeline />
      <AboutCTA>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link href="/book-appointment">
            <Button
              size="lg"
              className="bg-accent hover:bg-accent/90 text-primary-foreground font-bold h-14 px-8 text-base shadow-lg shadow-accent/20"
            >
              Book Free Consultation <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
          <a
            href="https://wa.me/8801778506500"
            target="_blank"
            rel="noreferrer"
          >
            <Button
              size="lg"
              className="h-14 px-8 text-base font-bold bg-[#25D366] hover:bg-[#20b858] text-white"
            >
              <MessageCircle className="mr-2 w-5 h-5" /> WhatsApp Us
            </Button>
          </a>
          <a href="tel:+8801778506500">
            <Button
              size="lg"
              className="h-14 px-8 text-base font-bold bg-white/15 border border-white/30 text-white hover:bg-white/25 hover:text-white"
            >
              <Phone className="mr-2 w-5 h-5" /> 01778-506500
            </Button>
          </a>
        </div>
      </AboutCTA>
    </div>
  );
}
