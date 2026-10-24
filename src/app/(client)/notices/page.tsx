"use client";

import { useState, useEffect } from "react";
import {
  Bell,
  Search,
  Pin,
  Flame,
  AlertTriangle,
  Calendar,
  Share2,
  Phone,
  ShieldCheck,
  Loader2,
  ExternalLink,
  MessageCircle,
  FileText
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import Link from "next/link";
import SEOHead from "@/components/shared/SEOHead";

interface NoticeItem {
  _id: string;
  title: string;
  content: string;
  category: "holiday" | "engineering_tips" | "regulatory" | "offer" | "general";
  priority: "urgent" | "important" | "normal";
  isPinned: boolean;
  publishedAt: string;
  author: string;
  createdAt: string;
}

const DEFAULT_NOTICES: NoticeItem[] = [
  {
    _id: "default-notice-1",
    title: "পৌরসভা ও সিটি কর্পোরেশন ভবন অনুমোদন: প্রয়োজনীয় দলিলের পূর্ণাঙ্গ চেকলিস্ট",
    content: `পৌরসভা বা স্থানীয় পরিকল্পনা কর্তৃপক্ষ হতে ইমারত নির্মাণ অনুমোদনের জন্য ক্লায়েন্টদের নিম্নলিখিত কাগজপত্র প্রস্তুত রাখার পরামর্শ দেওয়া হচ্ছে:
১. হালনাগাদ নামজারি (খারিজ) খতিয়ান ও চলতি সনের খাজনা দাখিলা রসিদ
২. রেজিস্ট্রিকৃত মূল দলিলের সত্যায়িত ফটোকপি বা বায়া দলিল
৩. সিএস, এসএ, আরএস ও বিএস মৌজা ম্যাপ (প্রযোজ্য ক্ষেত্রে)
৪. সাইটের সীমানা নির্ধারণী ডিজিটাল সার্ভে ডিমারকেশন রিপোর্ট
৫. অভিজ্ঞ আর্কিটেক্ট ও আইইবি রেজিস্টার্ড স্ট্রাকচারাল ইঞ্জিনিয়ার কর্তৃক স্বাক্ষরিত ব্লু-প্রিন্ট নকশা
৬. সয়েল টেস্ট (মাটি পরীক্ষা) ও সাইট রিপোর্ট

কাগজপত্র প্রস্তুত সংক্রান্ত যেকোনো জটিলতায় আমাদের ইঞ্জিনিয়ারদের সাথে সরাসরি পরামর্শ করতে পারেন।`,
    category: "regulatory",
    priority: "important",
    isPinned: true,
    publishedAt: "2026-10-20T10:00:00.000Z",
    author: "ইঞ্জিনিয়ার মোঃ হাসমত আলী (B.Sc. Engr, IEB M-38530)",
    createdAt: "2026-10-20T10:00:00.000Z",
  },
  {
    _id: "default-notice-2",
    title: "চলতি মৌসুমে ছাদ ঢালাই ও কংক্রিট কিউরিং সংক্রান্ত বিশেষ কারিগরি সতর্কতা",
    content: `ভবন নির্মাণের দীর্ঘস্থায়ী স্থায়িত্ব ও ফাটল (Cracks) প্রতিরোধে ছাদ ঢালাইয়ের সময় নিম্নলিখিত নির্দেশনা কঠোরভাবে অনুসরণের পরামর্শ দেওয়া হলো:
১. ঢালাইয়ের ওয়াটার-সিমেন্ট রেশিও ০.৪৫–০.৫০ এর মধ্যে রাখুন, অতিরিক্ত পানি কংক্রিটের শক্তি মারাত্মকভাবে হ্রাস করে।
২. ঢালাই চলাকালে হাই-ফ্রিকোয়েন্সি নিডল ভাইব্রেটর ব্যবহার করে পর্যাপ্ত কমপ্যাকশন নিশ্চিত করুন।
৩. ছাদ ঢালাইয়ের ২৪ ঘণ্টা পর থেকে টানা ২১ দিন পানি দিয়ে পুকুর বেঁধে (Ponding Method) নিরবচ্ছিন্ন কিউরিং করুন।
৪. শাটারিং খোলার নির্ধারিত সময় (স্ল্যাব ১৪ দিন, বিম ২১ দিন) কোনো অবস্থাতেই সংক্ষেপ করবেন না।`,
    category: "engineering_tips",
    priority: "normal",
    isPinned: false,
    publishedAt: "2026-10-15T09:30:00.000Z",
    author: "টেকনিক্যাল সুপারভিশন উইং, এইচএফ ইঞ্জিনিয়ারিং",
    createdAt: "2026-10-15T09:30:00.000Z",
  },
  {
    _id: "default-notice-3",
    title: "বহুতল ভবনে বিএসআরএম/একেএস ৫০০W রড ও সিমেন্টের ল্যাব টেস্টের বাধ্যবাধকতা",
    content: `বিএনবিসি ২০২০ বিল্ডিং কোড অনুসারে যেকোনো ৪ তলা বা তদূর্ধ্ব আবাসিক ও বাণিজ্যিক ভবনের কাঠামোগত নিরাপত্তার জন্য:
১. ব্যবহৃত রড অবশ্যই ৫০০W / 72.5 Grade এর হাই-ইল্ড ডিফর্মড বার হতে হবে।
২. সাইটে রড নামানোর পর বুয়েট বা অনুমোদিত সরকারি টেস্টিং ল্যাব থেকে ইল্ড স্ট্রেংথ ও ইলংগেশন টেস্ট সার্টিফিকেট নিশ্চিত করুন।
৩. ভূগর্ভস্থ ফাউন্ডেশন ও কলাম বেসে সালফেট প্রতিরোধী পোর্টল্যান্ড কম্পোজিট সিমেন্ট ব্যবহারের পরামর্শ দেওয়া হচ্ছে।`,
    category: "engineering_tips",
    priority: "important",
    isPinned: false,
    publishedAt: "2026-10-10T11:00:00.000Z",
    author: "স্ট্রাকচারাল কনসালটেন্সি টিম",
    createdAt: "2026-10-10T11:00:00.000Z",
  },
  {
    _id: "default-notice-4",
    title: "অফিস ড্রয়িং কনসালটেন্সি ও সাইট পরিদর্শনের অগ্রিম অ্যাপয়েন্টমেন্ট শিডিউলিং",
    content: `সম্মানিত ক্লায়েন্টদের অবগত করা যাচ্ছে যে, শনিবার থেকে বৃহস্পতিবার সকাল ৯:০০ টা থেকে রাত ৮:০০ টা পর্যন্ত আমাদের প্রধান কার্যালয়ে (সাভার রেডিও কলোনি) ড্রয়িং ও প্ল্যানিং কনসালটেন্সি সেবা প্রদান করা হয়।
সরাসরি সাইট পরিদর্শন, মাটি পরীক্ষা বা সয়েল টেস্টের জন্য কমপক্ষে ২৪ ঘণ্টা পূর্বে ওয়েবসাইটের 'Book Appointment' পেজ অথবা সরাসরি হোয়াটসঅ্যাপে শিডিউল বুক করার অনুরোধ করা হলো।`,
    category: "general",
    priority: "normal",
    isPinned: false,
    publishedAt: "2026-10-05T08:00:00.000Z",
    author: "এইচএফ ডিজাইন অ্যান্ড ইঞ্জিনিয়ারিং সলিউশনস",
    createdAt: "2026-10-05T08:00:00.000Z",
  }
];

function safeFormatDate(d: any, fmt: string = "dd MMMM yyyy") {
  if (!d) return "N/A";
  try {
    const obj = new Date(d);
    if (isNaN(obj.getTime())) return "N/A";
    return format(obj, fmt);
  } catch {
    return "N/A";
  }
}

export default function PublicNoticesPage() {
  const [notices, setNotices] = useState<NoticeItem[]>(DEFAULT_NOTICES);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  useEffect(() => {
    fetch("/api/notices?audience=public")
      .then((res) => res.json())
      .then((data) => {
        if (data.notices && Array.isArray(data.notices) && data.notices.length > 0) {
          // Merge API notices with defaults if needed or use API notices
          setNotices(data.notices);
        } else {
          setNotices(DEFAULT_NOTICES);
        }
      })
      .catch(() => {
        setNotices(DEFAULT_NOTICES);
      })
      .finally(() => setLoading(false));
  }, []);

  const categories = [
    { id: "all", label: "সকল বিজ্ঞপ্তি" },
    { id: "regulatory", label: "পৌরসভা ও সরকারি নিয়ম" },
    { id: "engineering_tips", label: "সাইট টিপস ও সতর্কতা" },
    { id: "general", label: "সাধারণ নোটিশ" },
    { id: "holiday", label: "ছুটির তালিকা" },
    { id: "offer", label: "বিশেষ অফার" },
  ];

  const filteredNotices = notices.filter((n) => {
    const matchSearch =
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.content.toLowerCase().includes(search.toLowerCase());
    const matchCat = activeCategory === "all" || n.category === activeCategory;
    return matchSearch && matchCat;
  });

  return (
    <div className="min-h-screen bg-muted/20 py-12 px-4 sm:px-6 lg:px-8">
      <SEOHead
        title="অফিসিয়াল নোটিশ বোর্ড ও কারিগরি নির্দেশনা"
        description="এইচএফ ডিজাইন অ্যান্ড ইঞ্জিনিয়ারিং সলিউশনসের সরকারি প্ল্যান অনুমোদন, বিল্ডিং কোড, ছুটির নোটিশ ও সাইট সতর্কতা।"
      />

      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="flex justify-center mb-2">
            <div className="w-16 h-16 rounded-2xl bg-white border border-border/80 shadow-md p-2 flex items-center justify-center">
              <img src="/images/logo.png" alt="HF Design & Engineering Solutions logo" className="w-full h-full object-contain" />
            </div>
          </div>
          <Badge variant="outline" className="px-3.5 py-1 bg-accent/10 text-accent border-accent/25 text-xs font-bold">
            <Bell className="w-3.5 h-3.5 mr-1" /> HF Design &amp; Engineering Solutions — Official Circulars
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-black text-foreground tracking-tight font-heading">
            অফিসিয়াল নোটিশ বোর্ড ও কারিগরি নির্দেশনা
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            এইচএফ ডিজাইন অ্যান্ড ইঞ্জিনিয়ারিং সলিউশনসের অফিস সময়সূচি, পৌরসভা ও সরকারি প্ল্যান অনুমোদনের নিয়মাবলী এবং ভবন নির্মাণ সাইট সতর্কতা।
          </p>
        </div>

        {/* Search & Categories */}
        <div className="space-y-4 max-w-2xl mx-auto">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-muted-foreground" />
            <Input
              placeholder="নোটিশ বা নির্দেশনা খুঁজুন..."
              className="pl-10 h-11 bg-background rounded-xl shadow-xs text-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap items-center justify-center gap-1.5">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  activeCategory === cat.id
                    ? "bg-accent text-primary-foreground shadow-xs font-bold"
                    : "bg-card border border-border text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Notice List */}
        {loading ? (
          <div className="text-center py-16">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-accent" />
            <p className="text-xs text-muted-foreground mt-2">নোটিশ বোর্ড লোড হচ্ছে...</p>
          </div>
        ) : filteredNotices.length === 0 ? (
          <Card className="text-center py-12 border-dashed max-w-md mx-auto">
            <CardContent className="space-y-3">
              <Bell className="w-12 h-12 text-muted-foreground/50 mx-auto" />
              <h3 className="text-base font-bold">কোনো নোটিশ পাওয়া যায়নি</h3>
              <p className="text-xs text-muted-foreground">বর্তমানে এই ফিল্টারে কোনো সক্রিয় নোটিশ নেই।</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredNotices.map((notice) => (
              <Card
                key={notice._id}
                className={`border-2 transition-all shadow-xs overflow-hidden ${
                  notice.isPinned ? "border-accent/40 bg-card" : "bg-card"
                }`}
              >
                <CardContent className="p-6 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 border-b border-border pb-3.5">
                    <div className="space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2">
                        {notice.isPinned && (
                          <Badge className="bg-accent text-primary-foreground font-bold text-[10px] gap-1">
                            <Pin className="w-3 h-3" /> Pinned
                          </Badge>
                        )}
                        {notice.priority === "urgent" && (
                          <Badge className="bg-rose-600 text-white font-bold text-[10px] gap-1">
                            <Flame className="w-3 h-3" /> জরুরি
                          </Badge>
                        )}
                        {notice.priority === "important" && (
                          <Badge className="bg-amber-600 text-white font-bold text-[10px] gap-1">
                            <AlertTriangle className="w-3 h-3" /> গুরুত্বপূর্ণ
                          </Badge>
                        )}
                        <Badge variant="outline" className="text-[10px] capitalize font-bold">
                          {notice.category?.replace("_", " ")}
                        </Badge>
                      </div>
                      <h2 className="text-lg sm:text-xl font-bold text-foreground pt-0.5 font-heading">
                        {notice.title}
                      </h2>
                    </div>

                    <span className="text-xs text-muted-foreground shrink-0 font-medium">
                      {safeFormatDate(notice.publishedAt || notice.createdAt)}
                    </span>
                  </div>

                  <p className="text-sm text-muted-foreground whitespace-pre-line leading-relaxed bg-muted/20 p-4 rounded-xl border border-border/40 font-normal">
                    {notice.content}
                  </p>

                  <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground pt-1">
                    <span>
                      প্রকাশক: <strong className="text-foreground font-semibold">{notice.author}</strong>
                    </span>

                    <div className="flex items-center gap-3">
                      <a
                        href={`https://wa.me/?text=${encodeURIComponent(`📢 *${notice.title}*\n\n${notice.content}\n\n- ${notice.author}\nএইচএফ ইঞ্জিনিয়ারিং\nhttps://hf-engineering.vercel.app/notices`)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-emerald-600 font-bold hover:underline"
                      >
                        <Share2 className="w-3.5 h-3.5" /> হোয়াটসঅ্যাপে শেয়ার
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Footer Support Banner */}
        <div className="bg-accent/5 border border-accent/20 rounded-2xl p-6 text-center space-y-3">
          <h3 className="text-base font-bold text-foreground font-heading">
            আপনার চলমান প্রজেক্টের লাইভ স্ট্যাটাস দেখতে চান?
          </h3>
          <p className="text-xs text-muted-foreground max-w-xl mx-auto">
            ড্রয়িং ফাইল ডাউনলোড, পেমেন্ট মানি রিসিট ও সাইট পরিদর্শনের রিপোর্ট দেখতে ক্লায়েন্ট পোর্টালে ভিজিট করুন।
          </p>
          <div className="flex flex-wrap justify-center gap-3 pt-1">
            <Link href="/client-portal">
              <Button size="sm" className="bg-accent hover:bg-accent/90 text-primary-foreground font-bold text-xs">
                👤 ক্লায়েন্ট পোর্টাল খুলুন
              </Button>
            </Link>
            <Link href="/track-plan">
              <Button size="sm" variant="outline" className="text-xs font-bold">
                <FileText className="w-3.5 h-3.5 mr-1 text-accent" /> ফাইল স্ট্যাটাস ট্র্যাক
              </Button>
            </Link>
            <a href="tel:+8801778506500">
              <Button size="sm" variant="outline" className="text-xs gap-1.5 font-bold">
                <Phone className="w-3.5 h-3.5" /> 01778-506500
              </Button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
