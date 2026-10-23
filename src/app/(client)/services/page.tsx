import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ServicesHero, ServicesList } from "./ServicesContent";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Services | HF Design & Engineering Solutions",
  description:
    "2D plans, 3D design, BOQ estimation, government plan passing and on-site supervision — complete civil engineering services in Savar & Dhaka.",
  openGraph: {
    title: "Services | HF Design & Engineering Solutions",
    description:
      "Building design, 3D elevation, structural drawing, BOQ and plan passing services in Bangladesh.",
  },
};

export default function ServicesPage() {
  return (
    <div className="w-full">
      <ServicesHero />
      <ServicesList />

      {/* FAQ Section */}
      <section className="py-24 bg-muted/30 border-t border-border">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold font-heading mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-muted-foreground">
              Common questions about building plan approvals and our services in Bangladesh.
            </p>
          </div>

          <Accordion
            defaultValue={["item-1"]}
            className="w-full bg-card rounded-xl shadow-sm border border-border px-6"
          >
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-left font-semibold">
                What documents are needed for Plan Passing?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                Generally, you need the original land deed (Dalil), Mutation (Namjari),
                CS/RS/SA Khatian, up-to-date land tax receipt (Khajna), a soil test report,
                and our Architectural & Structural working drawings.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger className="text-left font-semibold">
                How long does Union Parishad approval take?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                Typically, Union Parishad approvals take 1 to 2 weeks, provided all your
                land documents are clear and there are no boundary disputes. Paurashava or
                RAJUK approvals take longer — usually 1 to 3 months.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger className="text-left font-semibold">
                Do you supervise the construction directly?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                Yes, our engineers can be hired for on-site technical supervision. We highly
                recommend this for foundation pouring and roof casting to ensure the
                contractor strictly follows our structural design.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4">
              <AccordionTrigger className="text-left font-semibold">
                Can I see a 3D design before construction starts?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                Absolutely. We provide photorealistic 3D exterior and interior views before
                construction begins, so you can request changes and build with full
                confidence.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-5">
              <AccordionTrigger className="text-left font-semibold">
                How do I make payment for your services?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                We accept bKash, Nagad, Rocket, and bank transfer. Typically, 50% is paid
                in advance and the remaining 50% upon delivery of the final files.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>
    </div>
  );
}
