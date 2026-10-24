"use client";

import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  HelpCircle,
  Search,
  Phone,
  MessageCircle,
  MapPin,
  CheckCircle2,
  ArrowRight,
  FileText,
  Building2,
  Sparkles,
  Calculator,
  ShieldCheck,
  Layers,
  HardHat,
  X,
  BadgeCheck,
  ChevronDown,
  Clock,
} from "lucide-react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import SEOHead from "@/components/shared/SEOHead";
import { SITE_CONFIG } from "@/lib/constants";

// Comprehensive verified FAQs covering all aspects of HF Design & Engineering Solutions
const DEFAULT_FAQS = [
  // ─── 1. Plan Approval & Legal ───
  {
    id: "doc-requirements",
    category: "Plan Approval & Legal",
    categoryBn: "প্ল্যান অনুমোদন ও কাগজপত্র",
    question: "বাড়ি তৈরির প্ল্যান অনুমোদনের জন্য কী কী কাগজপত্র প্রয়োজন?",
    questionEn: "What documents are required for building plan approval?",
    answer:
      "পৌরসভা বা ইউনিয়ন পরিষদে ভবন নির্মাণের নকশা পাসের জন্য সাধারণত নিম্নোক্ত নথিপত্র প্রয়োজন হয়:\n\n" +
      "• মূল দলিলের ফটোকপি (Title Deed)\n" +
      "• হালনাগাদ নামজারি পরচা ও ডিসিআর (Mutation Khatian & DCR)\n" +
      "• হালনাগাদ ভূমি উন্নয়ন কর বা খাজনা রশিদ (Up-to-date Land Tax / Khajna)\n" +
      "• সিএস, আরএস ও বিএস খতিয়ান এবং মৌজা ম্যাপ (CS/RS/BS Porcha & Mouza Map)\n" +
      "• জমির মালিকের জাতীয় পরিচয়পত্র (NID) ও ছবি\n" +
      "• রেজিস্টার্ড ইঞ্জিনিয়ারিং ফার্মের স্বাক্ষরিত আর্কিটেকচারাল নকশা, স্ট্রাকচারাল ডিজাইন ও সয়েল টেস্ট রিপোর্ট।\n\n" +
      "আমাদের টিম প্রয়োজনীয় সব ড্রয়িং ও টেকনিক্যাল ফাইল প্রস্তুত করে অনুমোদন প্রক্রিয়ায় সম্পূর্ণ সহযোগিতা প্রদান করে।",
    tags: ["কাগজপত্র", "দলিল", "নামজারি", "খাজনা", "অনুমোদন"],
  },
  {
    id: "approval-timeline",
    category: "Plan Approval & Legal",
    categoryBn: "প্ল্যান অনুমোদন ও কাগজপত্র",
    question: "সাভারে ইউনিয়ন পরিষদ ও পৌরসভা প্ল্যান পাসে কতদিন সময় লাগে?",
    questionEn: "How long does Union Parishad and Paurashava plan approval take?",
    answer:
      "জমির কাগজপত্র শতভাগ নির্ভুল থাকলে সাভার ও আশেপাশের ইউনিয়ন পরিষদের প্ল্যান অনুমোদন সাধারণত ১ থেকে ২ সপ্তাহের মধ্যে সম্পন্ন হয়।\n\n" +
      "সাভার পৌরসভা কিংবা বিশেষ উন্নয়ন কর্তৃপক্ষের ক্ষেত্রে ড্রয়িং যাচাই, সাইট ইন্সপেকশন ও বোর্ড মিটিং সাপেক্ষে সাধারণত ৩ থেকে ৬ সপ্তাহ পর্যন্ত সময় লাগতে পারে। এইচএফ ইঞ্জিনিয়ারিং সব নথিপত্র যথাযথভাবে প্রস্তুত করে দ্রুততম সময়ে অনুমোদন নিশ্চিত করতে সহায়তা করে।",
    tags: ["সময়", "ইউনিয়ন পরিষদ", "পৌরসভা", "সাভার"],
  },
  {
    id: "unapproved-risks",
    category: "Plan Approval & Legal",
    categoryBn: "প্ল্যান অনুমোদন ও কাগজপত্র",
    question: "অনুমোদন ছাড়া বাড়ি নির্মাণ করলে কী ধরনের আইনি জটিলতা হতে পারে?",
    questionEn: "What are the risks of constructing a building without plan approval?",
    answer:
      "অনুমোদিত নকশা ছাড়া ভবন নির্মাণ করলে ভবিষ্যতে বিভিন্ন গুরুতর সমস্যার সম্মুখীন হতে হয়:\n\n" +
      "১. বিদ্যুৎ ও ইউটিলিটি সংযোগ পেতে জটিলতা বা অস্বীকৃতি\n" +
      "২. ব্যাংক লোন বা হাউজিং ফাইন্যান্স পাওয়ার অযোগ্যতা\n" +
      "৩. পৌরসভা বা স্থানীয় প্রশাসন কর্তৃক কাজ বন্ধের নোটিশ, জরিমানা কিংবা উচ্ছেদের ঝুঁকি\n" +
      "৪. পাশের জমির সীমানা নিয়ে প্রতিবেশীর সাথে দীর্ঘস্থায়ী মামলা-মোকদ্দমা।\n\n" +
      "তাই নির্মাণ শুরুর পূর্বেই যথাযথ অনুমোদন নেওয়া আপনার আজীবনের বিনিয়োগকে শতভাগ নিরাপদ রাখে।",
    tags: ["ঝুঁকি", "বিদ্যুৎ সংযোগ", "ব্যাংক লোন", "জরিমানা"],
  },
  {
    id: "setback-rules",
    category: "Plan Approval & Legal",
    categoryBn: "প্ল্যান অনুমোদন ও কাগজপত্র",
    question: "সেতব্যাক (Setback) বা জমি ছাড়ার সরকারি নিয়ম কী?",
    questionEn: "What are the setback and open space rules according to building code?",
    answer:
      "বাংলাদেশ ন্যাশনাল বিল্ডিং কোড (BNBC) ও স্থানীয় বিল্ডিং বাই-ল অনুযায়ী রাস্তার প্রশস্ততা ও ভবনের উচ্চতা ভেদে সামনে, পেছনে ও দুই পাশে নির্দিষ্ট পরিমাণ জায়গা খালি রাখতে হয়।\n\n" +
      "সাধারণত আবাসিক প্লটে রাস্তার দিক থেকে ন্যূনতম ৫ ফুট এবং পাশ ও পেছনে ন্যূনতম ৩ থেকে ৫ ফুট বা তদূর্ধ্ব ছাড়তে হয়। সঠিক সেতব্যাক রাখলে ভবনে পর্যাপ্ত আলো-বাতাস প্রবেশ করে, অগ্নি-নিরাপত্তা বজায় থাকে এবং আইনি ঝামেলামুক্ত থাকা যায়।",
    tags: ["সেতব্যাক", "BNBC", "জমি ছাড়া", "আলো বাতাস"],
  },

  // ─── 2. Architectural & Structural Design ───
  {
    id: "arch-vs-struct",
    category: "Design & Structural",
    categoryBn: "ডিজাইন ও স্ট্রাকচারাল ড্রয়িং",
    question: "আর্কিটেকচারাল প্ল্যান ও স্ট্রাকচারাল ডিজাইনের মধ্যে পার্থক্য কী?",
    questionEn: "What is the difference between Architectural and Structural design?",
    answer:
      "আর্কিটেকচারাল প্ল্যান হলো ভবনের বাহ্যিক রূপ, রুমের বিন্যাস, দরজা-জানালার মাপ, আলো-বাতাস চলাচল ও নান্দনিক 3D ভিউ।\n\n" +
      "অন্যদিকে স্ট্রাকচারাল ডিজাইন হলো ভবনের 'হাড়গোড় ও শক্তি'। এতে ভবনের লোড ক্যালকুলেশন করে কোন কলামে কত সুতা রড লাগবে, বিমের গভীরতা কত হবে, ফাউন্ডেশন কত শক্তিশালী হবে তা সফটওয়্যার এনালাইসিসের (ETABS, SAFE) মাধ্যমে নির্ধারণ করা হয় যাতে ভবন ভূমিকম্প ও ঝড় সহনশীল হয়।",
    tags: ["আর্কিটেকচার", "স্ট্রাকচারাল", "রড", "কলাম", "লোডিং"],
  },
  {
    id: "3d-visualization",
    category: "Design & Structural",
    categoryBn: "ডিজাইন ও স্ট্রাকচারাল ড্রয়িং",
    question: "3D ডিজাইন কেন জরুরি? কাজ শুরুর আগেই কি বাড়ি দেখতে পারব?",
    questionEn: "Why is 3D visualization essential before construction?",
    answer:
      "হ্যাঁ, কাজ শুরুর আগেই আপনার বাড়ি বাস্তবিকভাবে কেমন দেখাবে তা আমরা হাই-ডেফিনিশন 3D এক্সটেরিয়র ও ইন্টেরিয়র রেন্ডারের মাধ্যমে উপস্থাপন করি।\n\n" +
      "3D ভিউ দেখে আপনি রঙের কম্বিনেশন, ব্যালকনি ডিজাইন, গ্লাস ও টাইলসের বিন্যাস আগেই পছন্দ করতে পারেন। নির্মাণ চলাকালীন ভাঙচুর বা পরিবর্তন করার প্রয়োজন পড়ে না, যা লাখ লাখ টাকার অপচয় বাঁচিয়ে দেয়।",
    tags: ["3D ডিজাইন", "এলিভেশন", "রেন্ডার", "ইন্টেরিয়র"],
  },
  {
    id: "bnbc-compliance",
    category: "Design & Structural",
    categoryBn: "ডিজাইন ও স্ট্রাকচারাল ড্রয়িং",
    question: "আপনারা কি বিএনবিসি (BNBC 2020) কোড অনুসরণ করে ডিজাইন করেন?",
    questionEn: "Do you design strictly adhering to the BNBC 2020 code?",
    answer:
      "শতভাগ। আমাদের প্রতিটি স্ট্রাকচারাল ডিজাইন বাংলাদেশ ন্যাশনাল বিল্ডিং কোড (BNBC 2020) এবং আমেরিকান কংক্রিট ইনস্টিটিউট (ACI) স্ট্যান্ডার্ড অনুসরণ করে তৈরি করা হয়।\n\n" +
      "সাভার ও ঢাকা অঞ্চলের সিসমিক জোন (Earthquake Zone), উইন্ড স্পিড (Wind Load), ডেড লোড ও লাইভ লোডের বৈজ্ঞানিক হিসাব-নিকাশ করেই আমরা নিরাপদ স্ট্রাকচারাল স্পেসিফিকেশন প্রণয়ন করি।",
    tags: ["BNBC", "ভূমিকম্প", "কোড", "নিরাপত্তা"],
  },

  // ─── 3. Soil Test & Foundation ───
  {
    id: "soil-test-necessity",
    category: "Soil Test & Foundation",
    categoryBn: "সয়েল টেস্ট ও ফাউন্ডেশন",
    question: "সয়েল টেস্ট (মাটি পরীক্ষা) করা কি সত্যিই বাধ্যতামূলক?",
    questionEn: "Is soil testing mandatory before constructing a building?",
    answer:
      "অবশ্যই। মাটির ভারবহন ক্ষমতা (Bearing Capacity) না জেনে ফাউন্ডেশন বানালে ভবন দেবে যাওয়া, হেলে পড়া বা ক্র্যাক ধরার মারাত্মক ঝুঁকি থাকে।\n\n" +
      "সয়েল টেস্ট রিপোর্টের ভিত্তিতেই স্ট্রাকচারাল ইঞ্জিনিয়ার সিদ্ধান্ত নেন অগভীর ফাউন্ডেশন (Isolated/Mat Footing) হবে নাকি গভীর পাইল (Cast-in-situ Pile) প্রয়োজন। সঠিক সয়েল টেস্ট অতিরিক্ত রড-সিমেন্টের অপচয় রোধ করে লাখ লাখ টাকা সাশ্রয় করে।",
    tags: ["সয়েল টেস্ট", "মাটি পরীক্ষা", "ফাউন্ডেশন", "পাইল"],
  },
  {
    id: "borehole-count",
    category: "Soil Test & Foundation",
    categoryBn: "সয়েল টেস্ট ও ফাউন্ডেশন",
    question: "কত কাঠা জমিতে কয়টি বোরহোল (Borehole) টেস্ট করতে হয়?",
    questionEn: "How many boreholes are required for a building plot?",
    answer:
      "সাধারণত ৩ থেকে ৫ কাঠা আয়তনের আবাসিক প্লটে ন্যূনতম ৩টি বোরহোল করা বাধ্যতামূলক, যাতে প্লটের সব প্রান্তের মাটির চরিত্র সঠিকভাবে জানা যায়। প্লটের আয়তন বড় হলে প্রতি অতিরিক্ত ২-৩ কাঠায় আরও বোরহোল যোগ করতে হয়।\n\n" +
      "ভবনের সম্ভাব্য তলার সংখ্যার ওপর নির্ভর করে বোরহোলের গভীরতা ৫০ ফুট থেকে ১০০ ফুট বা তার বেশি নির্ধারিত হয়।",
    tags: ["বোরহোল", "গভীরতা", "কাঠা", "এসপিটি"],
  },
  {
    id: "filled-soil-foundation",
    category: "Soil Test & Foundation",
    categoryBn: "সয়েল টেস্ট ও ফাউন্ডেশন",
    question: "ভরাট বা নরম জমিতে বাড়ি নির্মাণের ক্ষেত্রে কী সতর্কতা প্রয়োজন?",
    questionEn: "What precautions are needed when building on filled or soft soil?",
    answer:
      "ভরাট বা ডোবা-নালা ভরাট করা জমিতে মাটির উপরিভাগ অত্যন্ত নরম থাকে। এমন জমিতে সয়েল টেস্ট ছাড়া অগভীর ফাউন্ডেশন দেওয়া অত্যন্ত ঝুঁকিপূর্ণ।\n\n" +
      "টেস্ট রিপোর্টের ওপর ভিত্তি করে পাইল ফাউন্ডেশন, স্যান্ড পাইলিং অথবা ম্যাট/রাফ্ট ফাউন্ডেশন ডিজাইন করা হয়। ইঞ্জিনিয়ারের তদারকি ছাড়া ভরাট জমিতে কোনোভাবেই কলাম বসানো উচিত নয়।",
    tags: ["ভরাট জমি", "পাইল", "ম্যাট ফাউন্ডেশন", "নরম মাটি"],
  },

  // ─── 4. Cost, BOQ & Estimation ───
  {
    id: "boq-importance",
    category: "Cost & BOQ",
    categoryBn: "বাজেট ও নির্মাণ খরচ (BOQ)",
    question: "BOQ বা কস্ট এস্টিমেশন কেন জরুরি? ঠিকাদাররা কি বেশি বিল করতে পারে?",
    questionEn: "Why is BOQ estimation critical and how does it prevent contractor over-billing?",
    answer:
      "BOQ (Bill of Quantities) হলো পুরো ভবনে মোট কত ব্যাগ সিমেন্ট, কত টন রড, কত সিএফটি বালু ও খোয়া লাগবে তার পাই-টু-পাই নির্ভুল হিসাব।\n\n" +
      "অভিজ্ঞ ইঞ্জিনিয়ারের তৈরি প্রফেশনাল BOQ থাকলে ঠিকাদার কাল্পনিক বা অতিরিক্ত উপাদান দাবি করতে পারে না। কাজের প্রতিটি ধাপের রানিং বিল সঠিকভাবে নিয়ন্ত্রণ করা যায় এবং মোট নির্মাণ ব্যয়ের প্রায় ১৫-২০% অপচয় রোধ হয়।",
    tags: ["BOQ", "এস্টিমেশন", "ঠিকাদার", "খরচ সাশ্রয়"],
  },
  {
    id: "approx-cost-per-sqft",
    category: "Cost & BOQ",
    categoryBn: "বাজেট ও নির্মাণ খরচ (BOQ)",
    question: "সাভার ও ঢাকায় বর্তমানে প্রতি স্কয়ার ফুট ভবন নির্মাণে কত খরচ হয়?",
    questionEn: "What is the approximate building construction cost per sq ft in Savar/Dhaka?",
    answer:
      "মালামালের বর্তমান বাজারদর অনুযায়ী স্ট্যান্ডার্ড কোয়ালিটির আরসিসি ফ্রেম ভবনে ফিনিশিংসহ প্রতি বর্গফুটে আনুমানিক ১,৯০০ থেকে ২,৩০০ টাকা খরচ হয়। প্রিমিয়াম ফিনিশিং বা লিফটসহ বহুতল ভবনে ২,৬০০ থেকে ৩,২০০+ টাকা হতে পারে।\n\n" +
      "আমাদের ওয়েবসাইটের 'Cost Estimator' টুলটি ব্যবহার করে অথবা আপনার জমির মাপ নিয়ে অফিসে এসে সম্পূর্ণ বিনামূল্যে বিস্তারিত খরচের প্রাথমিক হিসাব নিতে পারেন।",
    tags: ["স্কয়ার ফুট", "খরচ", "বাজেট", "সাভার"],
  },
  {
    id: "hf-design-fee",
    category: "Cost & BOQ",
    categoryBn: "বাজেট ও নির্মাণ খরচ (BOQ)",
    question: "এইচএফ ইঞ্জিনিয়ারিংয়ের ডিজাইন ও ড্রয়িং ফি কীভাবে নির্ধারণ করা হয়?",
    questionEn: "How are your architectural and structural design fees calculated?",
    answer:
      "আমাদের ডিজাইন ফি ভবনের মোট আয়তন (Total Square Feet), তলার সংখ্যা এবং প্রয়োজনীয় সেবার পরিধির ওপর নির্ভর করে অত্যন্ত সাশ্রয়ী ও প্রতিযোগিতামূলক হারে নির্ধারিত হয়।\n\n" +
      "আমরা লিখিত অ্যাগ্রিমেন্টের মাধ্যমে ফিক্সড কোটেশন প্রদান করি। কোনো গোপন চার্জ বা অনাকাঙ্ক্ষিত বাড়তি খরচ নেই।",
    tags: ["ফি", "রেট", "কোটেশন", "খরচ"],
  },

  // ─── 5. Site Supervision & Quality Control ───
  {
    id: "supervision-checklist",
    category: "Site Supervision",
    categoryBn: "সাইট ভিজিট ও তদারকি",
    question: "সাইট সুপারভিশনে ইঞ্জিনিয়ার কোন কোন বিষয় গভীরভাবে পরীক্ষা করেন?",
    questionEn: "What specific items do civil engineers inspect during on-site supervision?",
    answer:
      "আমাদের সাইট ভিজিটে অভিজ্ঞ সিভিল ইঞ্জিনিয়ার নিম্নলিখিত বিষয়গুলো পুঙ্খানুপুঙ্খভাবে চেক করেন:\n\n" +
      "• রডের সাইজ, গ্রেড, স্পেসিং ও ল্যাপিং লেন্থ (Lapping Length & Clear Cover)\n" +
      "• কলাম ও বিমের সংযোগস্থলে টাই রডের সঠিক বিন্যাস\n" +
      "• সেন্টারিং ও সাটারিংয়ের লেভেল ও স্ট্যাবিলিটি\n" +
      "• কংক্রিট মিক্সিং রেশিও (সিমেন্ট:বালু:খোয়া) ও ওয়াটার-সিমেন্ট রেশিও\n" +
      "• সঠিক ভাইব্রেটর প্রয়োগ এবং ঢালাইয়ের কিউরিং (Curing) নির্দেশিকা।",
    tags: ["সুপারভিশন", "রড বাইন্ডিং", "সাটারিং", "কংক্রিট"],
  },
  {
    id: "casting-presence",
    category: "Site Supervision",
    categoryBn: "সাইট ভিজিট ও তদারকি",
    question: "ছাদ ঢালাই বা ফাউন্ডেশনের সময় ইঞ্জিনিয়ারের উপস্থিতি কেন অপরিহার্য?",
    questionEn: "Why is civil engineer supervision critical during roof casting and foundation pouring?",
    answer:
      "ঢালাইয়ের সময় করা একটি মাত্র ছোট ভুল (যেমন রড বাঁকা হওয়া, ক্লিয়ার কভার না থাকা বা অতিরিক্ত পানি মেশানো) সারা জীবনের জন্য ভবনে ফাটল বা ড্যাম তৈরির কারণ হয়। ঢালাই একবার হয়ে গেলে ভেতরের ত্রুটি চোখে দেখা যায় না।\n\n" +
      "অভিজ্ঞ ইঞ্জিনিয়ারের উপস্থিতিতে ঢালাই হলে ডিজাইনের শতভাগ বাস্তবায়ন নিশ্চিত হয় এবং ভবনের স্থায়িত্ব ৫০-১০০ বছর অক্ষুণ্ণ থাকে।",
    tags: ["ছাদ ঢালাই", "ফাউন্ডেশন", "মান নিয়ন্ত্রণ", "ইঞ্জিনিয়ার"],
  },

  // ─── 6. Working Process & Methodology ───
  {
    id: "office-consultation-free",
    category: "Process & Consultation",
    categoryBn: "কাজের প্রক্রিয়া ও পরামর্শ",
    question: "আপনাদের সাভার অফিসে এসে ড্রয়িং নিয়ে পরামর্শ করা কি ফ্রি?",
    questionEn: "Is the initial office consultation free of charge?",
    answer:
      "হ্যাঁ, সম্পূর্ণ ফ্রি! সাভার রেডিও কলোনিতে আমাদের অফিসে জমির খসড়া মাপ বা কাগজপত্র নিয়ে সরাসরি চলে আসতে পারেন।\n\n" +
      "আমাদের প্রিন্সিপাল ইঞ্জিনিয়ার জনাব মোঃ হাসমত আলীর সাথে খোলামেলা আলোচনা করে আপনার বাজেট ও স্বপ্নের বাড়ির জন্য উপযুক্ত পরামর্শ গ্রহণ করতে কোনো ফি দিতে হবে না।",
    tags: ["ফ্রি পরামর্শ", "অফিস ভিজিট", "রেডিও কলোনি", "হাসমত আলী"],
  },
  {
    id: "delivery-timeline",
    category: "Process & Consultation",
    categoryBn: "কাজের প্রক্রিয়া ও পরামর্শ",
    question: "একটি পূর্ণাঙ্গ ড্রয়িং প্যাকেজ হাতে পেতে কতদিন সময় লাগে?",
    questionEn: "How long does a complete design package delivery take?",
    answer:
      "ক্লায়েন্টের সাথে প্রাথমিক আর্কিটেকচারাল ফ্লোর প্ল্যান চূড়ান্ত হওয়ার পর সাধারণত ৭ থেকে ১৪ কর্মদিবসের মধ্যে সম্পূর্ণ ওয়ার্কিং ড্রয়িং (আর্কিটেকচারাল, স্ট্রাকচারাল, ইলেকট্রিক্যাল, প্লাম্বিং ও 3D এক্সটেরিয়র) হস্তান্তর করা হয়। জরুরি প্রয়োজনে দ্রুততম ডেলিভারির বিশেষ সুবিধাও রয়েছে।",
    tags: ["ডেলিভারি", "সময়", "ড্রয়িং প্যাকেজ"],
  },
  {
    id: "payment-milestones",
    category: "Process & Consultation",
    categoryBn: "কাজের প্রক্রিয়া ও পরামর্শ",
    question: "পেমেন্ট কীভাবে পরিশোধ করতে হয়? কিস্তির সুবিধা আছে কি?",
    questionEn: "What are your payment terms and milestone installments?",
    answer:
      "হ্যাঁ, ক্লায়েন্টের সুবিধার্থে আমাদের পেমেন্ট প্রক্রিয়া ৩-৪টি সহজ ধাপে বিভক্ত:\n\n" +
      "১. প্রাথমিক বুকিং ও জমি ভিজিট (অ্যাডভান্স)\n" +
      "২. আর্কিটেকচারাল ফ্লোর প্ল্যান ও 3D ফাইনাল করার পর দ্বিতীয় ধাপ\n" +
      "৩. স্ট্রাকচারাল ও ডিটেইল্ড ইঞ্জিনিয়ারিং ড্রয়িং চলাকালীন তৃতীয় ধাপ\n" +
      "৪. চূড়ান্ত ড্রয়িং বই ও অনুমোদন ফাইল হস্তান্তরের সময় বাকি অংশ।",
    tags: ["পেমেন্ট", "কিস্তি", "বুকিং", "স্বচ্ছতা"],
  },
];

const CATEGORIES = [
  { id: "all", labelEn: "All Questions", labelBn: "সবগুলো প্রশ্ন", icon: Sparkles },
  { id: "Plan Approval & Legal", labelEn: "Plan Approval", labelBn: "প্ল্যান অনুমোদন ও আইন", icon: FileText },
  { id: "Design & Structural", labelEn: "Design & Structural", labelBn: "ডিজাইন ও স্ট্রাকচারাল", icon: Building2 },
  { id: "Soil Test & Foundation", labelEn: "Soil & Foundation", labelBn: "সয়েল টেস্ট ও ফাউন্ডেশন", icon: Layers },
  { id: "Cost & BOQ", labelEn: "Cost & BOQ", labelBn: "বাজেট ও খরচ হিসাব", icon: Calculator },
  { id: "Site Supervision", labelEn: "Site Supervision", labelBn: "সাইট ভিজিট ও ঢালাই", icon: HardHat },
  { id: "Process & Consultation", labelEn: "Process & Timeline", labelBn: "প্রক্রিয়া ও পরামর্শ", icon: Clock },
];

const QUICK_CHIPS = [
  { label: "প্ল্যান অনুমোদন", query: "অনুমোদন" },
  { label: "কাগজপত্র", query: "কাগজপত্র" },
  { label: "সয়েল টেস্ট", query: "সয়েল টেস্ট" },
  { label: "নির্মাণ খরচ (BOQ)", query: "খরচ" },
  { label: "3D ডিজাইন", query: "3D" },
  { label: "ছাদ ঢালাই", query: "ঢালাই" },
  { label: "BNBC কোড", query: "BNBC" },
];

export default function FaqPage() {
  const [faqs, setFaqs] = useState(DEFAULT_FAQS);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Fetch dynamic FAQs from DB and merge seamlessly
  useEffect(() => {
    fetch("/api/faqs")
      .then((res) => res.json())
      .then((json) => {
        if (json && json.faqs && Array.isArray(json.faqs) && json.faqs.length > 0) {
          const dynamicItems: typeof DEFAULT_FAQS = [];
          json.faqs.forEach((group: { category: string; items: Array<{ _id: string; question: string; answer: string; category?: string }> }) => {
            if (group.items && Array.isArray(group.items)) {
              group.items.forEach((item) => {
                dynamicItems.push({
                  id: item._id,
                  category: group.category || "General",
                  categoryBn: group.category || "সাধারণ",
                  question: item.question,
                  questionEn: item.question,
                  answer: item.answer,
                  tags: [group.category || "General"],
                });
              });
            }
          });
          if (dynamicItems.length > 0) {
            // Put custom admin items at top, followed by default verified items
            setFaqs([...dynamicItems, ...DEFAULT_FAQS]);
          }
        }
      })
      .catch(() => {
        // Fallback gracefully to default FAQs
      });
  }, []);

  // Filter items by category and search keyword
  const filteredFaqs = useMemo(() => {
    return faqs.filter((item) => {
      const matchCategory =
        activeCategory === "all" ||
        item.category.toLowerCase() === activeCategory.toLowerCase();

      if (!search.trim()) return matchCategory;

      const q = search.toLowerCase();
      const matchSearch =
        item.question.toLowerCase().includes(q) ||
        (item.questionEn && item.questionEn.toLowerCase().includes(q)) ||
        item.answer.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        (item.categoryBn && item.categoryBn.toLowerCase().includes(q)) ||
        (item.tags && item.tags.some((tag) => tag.toLowerCase().includes(q)));

      return matchCategory && matchSearch;
    });
  }, [faqs, activeCategory, search]);

  // Count by category
  const getCategoryCount = (catId: string) => {
    if (catId === "all") return faqs.length;
    return faqs.filter(
      (f) => f.category.toLowerCase() === catId.toLowerCase()
    ).length;
  };

  const createWhatsAppInquiryUrl = (question: string) => {
    const text = `আসসালামু আলাইকুম HF Engineering, আমি FAQ থেকে জানতে চাইছি: "${question}" — এ বিষয়ে বিস্তারিত পরামর্শ প্রয়োজন।`;
    return `https://wa.me/${SITE_CONFIG.whatsapp}?text=${encodeURIComponent(text)}`;
  };

  return (
    <div className="w-full min-h-screen bg-background selection:bg-accent/20 selection:text-accent">
      <SEOHead
        title="FAQ - Frequently Asked Questions"
        description="ভবন নির্মাণের প্ল্যান অনুমোদন, স্ট্রাকচারাল ডিজাইন, সয়েল টেস্ট, BOQ ও সাইট তদারকি সংক্রান্ত প্রয়োজনীয় প্রশ্নোত্তর। HF Design & Engineering Solutions, Savar."
      />

      {/* Structured JSON-LD Schema for Google Rich Snippets */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: DEFAULT_FAQS.slice(0, 10).map((f) => ({
              "@type": "Question",
              name: f.question,
              acceptedAnswer: {
                "@type": "Answer",
                text: f.answer.replace(/\n+/g, " "),
              },
            })),
          }),
        }}
      />

      {/* ─── HERO SECTION ─── */}
      <section className="relative bg-primary pt-32 pb-20 overflow-hidden text-primary-foreground border-b border-primary/20">
        {/* Subtle Engineering Grid */}
        <div
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        {/* Ambient Gradient Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-accent/20 blur-[130px] rounded-full pointer-events-none" />

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Top Pill Badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/20 border border-accent/40 text-accent text-sm font-semibold mb-6 shadow-sm"
          >
            <HelpCircle className="w-4 h-4 text-accent" />
            HF Knowledge Base & Help Center
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold font-heading tracking-tight mb-5"
          >
            Frequently Asked <span className="text-accent">Questions</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="text-lg md:text-xl text-primary-foreground/85 max-w-3xl mx-auto font-normal leading-relaxed mb-10"
          >
            পরিকল্পিত ও নিরাপদ ভবন নির্মাণের প্রয়োজনীয় সব প্রশ্নের সুস্পষ্ট উত্তর। প্ল্যান অনুমোদন,
            স্ট্রাকচারাল ডিজাইন, সয়েল টেস্ট ও নির্মাণ ব্যয়ের পেশাদার সমাধান।
          </motion.p>

          {/* Interactive Search Bar in Hero */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="max-w-2xl mx-auto"
          >
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-accent transition-colors" />
              <Input
                type="text"
                placeholder="প্রশ্ন বা বিষয় লিখে খুঁজুন... (e.g. প্ল্যান অনুমোদন, সয়েল টেস্ট, খরচ)"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-12 pr-10 h-14 bg-background text-foreground text-base rounded-2xl shadow-xl border-2 border-white/20 focus:border-accent focus:ring-4 focus:ring-accent/20 transition-all placeholder:text-muted-foreground"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1 rounded-full hover:bg-muted transition-colors"
                  aria-label="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Quick Keyword Chips */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
              <span className="text-xs text-primary-foreground/60 font-medium">জনপ্রিয় বিষয়:</span>
              {QUICK_CHIPS.map((chip) => (
                <button
                  key={chip.label}
                  onClick={() => setSearch(chip.query)}
                  className={`text-xs px-3 py-1 rounded-full transition-all border ${
                    search === chip.query
                      ? "bg-accent text-primary font-semibold border-accent"
                      : "bg-white/10 hover:bg-white/20 text-primary-foreground/90 border-white/15"
                  }`}
                >
                  {chip.label}
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── CREDENTIALS & STATS BAR ─── */}
      <section className="bg-card border-b border-border shadow-xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-y md:divide-y-0 md:divide-x divide-border">
            <div className="pt-2 md:pt-0">
              <p className="text-2xl sm:text-3xl font-extrabold font-heading text-primary">১০+ বছর</p>
              <p className="text-xs sm:text-sm text-muted-foreground font-medium mt-0.5">সাভার ও ঢাকায় অভিজ্ঞতা</p>
            </div>
            <div className="pt-2 md:pt-0">
              <p className="text-2xl sm:text-3xl font-extrabold font-heading text-accent">৫০০+ প্ল্যান</p>
              <p className="text-xs sm:text-sm text-muted-foreground font-medium mt-0.5">সফল ডিজাইন ও পাস</p>
            </div>
            <div className="pt-2 md:pt-0">
              <p className="text-2xl sm:text-3xl font-extrabold font-heading text-primary">১০০% BNBC</p>
              <p className="text-xs sm:text-sm text-muted-foreground font-medium mt-0.5">কোড অনুযায়ী স্ট্রাকচার</p>
            </div>
            <div className="pt-2 md:pt-0">
              <p className="text-2xl sm:text-3xl font-extrabold font-heading text-emerald-600">ফ্রি কনসালটেশন</p>
              <p className="text-xs sm:text-sm text-muted-foreground font-medium mt-0.5">অফিস ভিজিটে ফ্রি পরামর্শ</p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── MAIN CONTENT AREA ─── */}
      <section className="py-16 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Category Tabs */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold font-heading text-foreground flex items-center gap-2">
              <BadgeCheck className="w-5 h-5 text-accent" />
              ক্যাটাগরি অনুযায়ী প্রশ্নসমূহ
            </h2>
            <span className="text-sm text-muted-foreground">
              মোট <strong className="text-foreground">{filteredFaqs.length}</strong> টি উত্তর প্রদর্শিত
            </span>
          </div>

          <div className="flex flex-wrap gap-2.5">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const isActive = activeCategory.toLowerCase() === cat.id.toLowerCase();
              const count = getCategoryCount(cat.id);

              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    setActiveCategory(cat.id);
                  }}
                  className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all border ${
                    isActive
                      ? "bg-primary text-primary-foreground border-primary shadow-md shadow-primary/20 scale-[1.02]"
                      : "bg-card text-foreground hover:bg-muted/80 border-border"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-accent" : "text-muted-foreground"}`} />
                  <span>{cat.labelBn}</span>
                  <span
                    className={`ml-1 px-2 py-0.5 rounded-full text-xs font-bold ${
                      isActive ? "bg-accent text-primary" : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Search Active Notification */}
        {search && (
          <div className="mb-6 p-4 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-between">
            <p className="text-sm text-foreground">
              অনুসন্ধান ফিল্টার: <strong>&ldquo;{search}&rdquo;</strong> সম্পর্কিত{" "}
              <strong>{filteredFaqs.length}</strong> টি ফলাফল পাওয়া গেছে।
            </p>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSearch("")}
              className="text-xs h-8 text-muted-foreground hover:text-foreground"
            >
              ফিল্টার মুছুন
            </Button>
          </div>
        )}

        {/* ─── FAQ ACCORDION LIST ─── */}
        <AnimatePresence mode="wait">
          {filteredFaqs.length > 0 ? (
            <motion.div
              key={`${activeCategory}-${search}`}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <Accordion defaultValue={["item-0"]} className="space-y-4">
                {filteredFaqs.map((faq, idx) => (
                  <AccordionItem
                    key={faq.id || idx}
                    value={`item-${idx}`}
                    className="border border-border/80 rounded-2xl bg-card overflow-hidden shadow-xs hover:border-accent/50 transition-all data-[state=open]:border-accent data-[state=open]:shadow-md"
                  >
                    <AccordionTrigger className="px-6 py-5 text-left hover:no-underline hover:bg-muted/30 transition-colors group">
                      <div className="flex flex-col items-start gap-2 pr-4 text-left">
                        <div className="flex items-center gap-2">
                          <Badge
                            variant="secondary"
                            className="text-[11px] font-semibold bg-muted text-foreground/80 border border-border/50"
                          >
                            {faq.categoryBn || faq.category}
                          </Badge>
                          {faq.tags && faq.tags[0] && (
                            <span className="text-[11px] text-muted-foreground hidden sm:inline">
                              #{faq.tags[0]}
                            </span>
                          )}
                        </div>
                        <span className="text-base sm:text-lg font-bold font-heading text-foreground group-hover:text-primary transition-colors leading-snug">
                          {faq.question}
                        </span>
                      </div>
                    </AccordionTrigger>

                    <AccordionContent className="px-6 pb-6 pt-2 text-foreground/85 border-t border-border/50 bg-card/60">
                      <div className="prose prose-sm max-w-none text-muted-foreground leading-relaxed whitespace-pre-line text-sm sm:text-base mb-6">
                        {faq.answer}
                      </div>

                      {/* Bottom Action Footer for Each FAQ */}
                      <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-border/40">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span>যাচাইকৃত তথ্য · HF Engineering কারিগরি টিম</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <a
                            href={createWhatsAppInquiryUrl(faq.question)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600/10 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-600/20 border border-emerald-600/20 transition-all"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                            <span>এই বিষয়ে হোয়াটসঅ্যাপে কথা বলুন</span>
                          </a>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </motion.div>
          ) : (
            /* Search Zero State */
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-16 px-6 bg-card rounded-2xl border-2 border-dashed border-border"
            >
              <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4 text-accent">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold font-heading text-foreground mb-2">
                কোনো ফলাফল পাওয়া যায়নি
              </h3>
              <p className="text-muted-foreground max-w-md mx-auto mb-6 text-sm">
                আপনার খোঁজা &ldquo;{search}&rdquo; সম্পর্কিত প্রশ্ন পাওয়া যায়নি। সরাসরি আমাদের সিভিল
                ইঞ্জিনিয়ারের সাথে কথা বলে আপনার উত্তর জেনে নিন।
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <Button variant="outline" onClick={() => setSearch("")} className="rounded-xl">
                  সব প্রশ্ন দেখুন
                </Button>
                <a
                  href={`https://wa.me/${SITE_CONFIG.whatsapp}?text=${encodeURIComponent(
                    `আসসালামু আলাইকুম, আমি এই বিষয়ে জানতে চাই: ${search}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white gap-2">
                    <MessageCircle className="w-4 h-4" />
                    হোয়াটসঅ্যাপে সরাসরি প্রশ্ন করুন
                  </Button>
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* ─── "STILL HAVE QUESTIONS?" SUPPORT SECTION ─── */}
      <section className="bg-muted/40 py-20 border-t border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-accent text-sm font-bold uppercase tracking-wider mb-2 block">
              সরাসরি যোগাযোগ
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-foreground mb-4">
              নির্দিষ্ট কোনো প্রশ্ন বা কৌতূহল আছে?
            </h2>
            <p className="text-muted-foreground text-base">
              আপনার জমির কাগজপত্র, প্ল্যান অনুমোদন বা বাজেট নিয়ে সরাসরি আমাদের অভিজ্ঞ ইঞ্জিনিয়ারের সাথে কথা বলুন।
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* 1. Direct Phone Call */}
            <div className="bg-card rounded-2xl p-7 border border-border shadow-xs hover:border-accent/40 transition-all flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-5">
                  <Phone className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold font-heading text-foreground mb-2">সরাসরি ফোন কল</h3>
                <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                  জরুরি পরামর্শ ও সাইট ভিজিটের জন্য সরাসরি আমাদের প্রধান ইঞ্জিনিয়ারকে কল করুন।
                </p>
              </div>
              <div className="space-y-2">
                <a
                  href="tel:01778506500"
                  className="block w-full py-3 px-4 rounded-xl text-center text-sm font-bold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  কল করুন: 01778-506500
                </a>
                <p className="text-center text-xs text-muted-foreground">সকাল ৯টা - রাত ৯টা (সপ্তাহে ৭ দিন)</p>
              </div>
            </div>

            {/* 2. WhatsApp Direct Chat */}
            <div className="bg-card rounded-2xl p-7 border-2 border-emerald-500/30 shadow-xs hover:border-emerald-500/60 transition-all flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-3 right-3">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-600/10 text-emerald-600 border border-emerald-600/20">
                  দ্রুত রিপ্লাই
                </span>
              </div>
              <div>
                <div className="w-12 h-12 rounded-xl bg-emerald-600/10 text-emerald-600 flex items-center justify-center mb-5">
                  <MessageCircle className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold font-heading text-foreground mb-2">হোয়াটসঅ্যাপ চ্যাট</h3>
                <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                  জমির মাপ বা ড্রয়িংয়ের ছবি হোয়াটসঅ্যাপে পাঠিয়ে তাৎক্ষণিক পরামর্শ ও মতামত নিন।
                </p>
              </div>
              <div>
                <a
                  href={`https://wa.me/${SITE_CONFIG.whatsapp}?text=${encodeURIComponent(
                    "আসসালামু আলাইকুম HF Engineering, আমি বাড়ি নির্মাণের ব্যাপারে পরামর্শ নিতে চাই।"
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full py-3 px-4 rounded-xl text-center text-sm font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition-colors shadow-sm"
                >
                  WhatsApp-এ চ্যাট করুন
                </a>
                <p className="text-center text-xs text-muted-foreground mt-2">সাধারণত ১০ মিনিটের মধ্যে উত্তর দেওয়া হয়</p>
              </div>
            </div>

            {/* 3. Office Visit */}
            <div className="bg-card rounded-2xl p-7 border border-border shadow-xs hover:border-accent/40 transition-all flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-accent/20 text-accent flex items-center justify-center mb-5">
                  <MapPin className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold font-heading text-foreground mb-2">অফিসে ফ্রি কনসালটেশন</h3>
                <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                  জমির কাগজপত্র সাথে নিয়ে সরাসরি আমাদের সাভার অফিসে এসে সামনাসামনি ড্রয়িং নিয়ে আলোচনা করুন।
                </p>
              </div>
              <div>
                <Link
                  href="/contact"
                  className="block w-full py-3 px-4 rounded-xl text-center text-sm font-bold border border-border bg-background hover:bg-muted text-foreground transition-colors"
                >
                  অফিস লোকেশন ও ম্যাপ দেখুন
                </Link>
                <p className="text-center text-xs text-muted-foreground mt-2">
                  রেডিও কলোনি নয়াবাড়ি, সাভার, ঢাকা
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── BOTTOM CTA BANNER ─── */}
      <section className="bg-primary text-primary-foreground py-16 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.2) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold font-heading mb-4">
            স্বপ্নের বাড়ির নির্মাণ খরচ হিসাব করতে চান?
          </h2>
          <p className="text-primary-foreground/80 text-base sm:text-lg max-w-2xl mx-auto mb-8">
            আমাদের ইন্টারেক্টিভ কস্ট এস্টিমেটর দিয়ে মাত্র ২ মিনিটে রড, সিমেন্ট, বালু ও মোট খরচের
            প্রাথমিক হিসাব পেয়ে যান।
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link href="/cost-estimator">
              <Button size="lg" className="bg-accent hover:bg-accent/90 text-primary font-bold rounded-xl px-8 h-12 shadow-lg">
                <Calculator className="w-5 h-5 mr-2" />
                খরচ ক্যালকুলেট করুন
              </Button>
            </Link>
            <Link href="/track-plan">
              <Button
                size="lg"
                variant="outline"
                className="bg-white/10 hover:bg-white/20 text-white border-white/25 font-bold rounded-xl px-8 h-12"
              >
                <FileText className="w-5 h-5 mr-2" />
                চলমান প্ল্যানের স্ট্যাটাস ট্র্যাক করুন
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
