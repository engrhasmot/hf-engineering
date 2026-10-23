import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ServicesHero, ServicesList } from "./ServicesContent";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "সেবাসমূহ | HF Design & Engineering Solutions",
  description:
    "২ডি প্ল্যান, ৩ডি ডিজাইন, BOQ হিসাব, সরকারি প্ল্যান পাসিং এবং নির্মাণ তদারকি — সাভার ও ঢাকায় সম্পূর্ণ সিভিল ইঞ্জিনিয়ারিং সেবা।",
  openGraph: {
    title: "সেবাসমূহ | HF Design & Engineering Solutions",
    description: "বিল্ডিং ডিজাইন, ৩ডি এলিভেশন, স্ট্রাকচারাল ড্রয়িং, BOQ এবং প্ল্যান পাসিং সেবা।",
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
            <h2 className="text-3xl font-bold font-heading mb-4">সচরাচর জিজ্ঞাসা (FAQ)</h2>
            <p className="text-muted-foreground">বাংলাদেশে বিল্ডিং প্ল্যান অনুমোদন সম্পর্কে সাধারণ প্রশ্নাবলী।</p>
          </div>

          <Accordion defaultValue={["item-1"]} className="w-full bg-card rounded-xl shadow-sm border border-border px-6">
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-left font-semibold">
                প্ল্যান পাসিংয়ের জন্য কী কী কাগজপত্র লাগে?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                সাধারণত মূল জমির দলিল, নামজারি (মিউটেশন), CS/RS/SA খতিয়ান, হালনাগাদ ভূমি কর রশিদ (খাজনা), মাটি পরীক্ষার রিপোর্ট এবং আমাদের আর্কিটেকচারাল ও স্ট্রাকচারাল ওয়ার্কিং ড্রয়িং প্রয়োজন হয়।
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger className="text-left font-semibold">
                ইউনিয়ন পরিষদের অনুমোদন পেতে কতদিন লাগে?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                সাধারণত ইউনিয়ন পরিষদের অনুমোদন ১ থেকে ২ সপ্তাহ লাগে, যদি জমির সকল কাগজ পরিষ্কার থাকে এবং সীমানা নিয়ে কোনো বিরোধ না থাকে। পৌরসভা বা রাজউকের অনুমোদনে ১–৩ মাস সময় লাগতে পারে।
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger className="text-left font-semibold">
                আপনারা কি সরাসরি নির্মাণ কাজ তদারক করেন?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                হ্যাঁ, আমাদের ইঞ্জিনিয়ারদের সাইট তদারকির জন্য নিয়োগ দেওয়া যায়। ফাউন্ডেশন ঢালাই ও ছাদ ঢালাইয়ের সময় ঠিকাদার আমাদের স্ট্রাকচারাল ডিজাইন মেনে চলছে কিনা নিশ্চিত করতে এটি অত্যন্ত গুরুত্বপূর্ণ।
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4">
              <AccordionTrigger className="text-left font-semibold">
                ৩ডি ডিজাইন কি নির্মাণের আগে দেখতে পাবো?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                অবশ্যই। আমরা নির্মাণ শুরুর আগেই ফটোরিয়েলিস্টিক ৩ডি এক্সটেরিয়র ও ইন্টেরিয়র ভিউ প্রদান করি, যাতে আপনি পরিবর্তন করতে পারেন এবং নিশ্চিত হয়ে নির্মাণ করতে পারেন।
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-5">
              <AccordionTrigger className="text-left font-semibold">
                সার্ভিস ফি কীভাবে পরিশোধ করবো?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                বিকাশ, নগদ, রকেট এবং ব্যাংক ট্রান্সফারের মাধ্যমে পরিশোধ করা যায়। সাধারণত ৫০% অগ্রিম এবং ডেলিভারির পর বাকি ৫০% নেওয়া হয়।
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>
    </div>
  );
}
