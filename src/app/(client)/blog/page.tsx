"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  CalendarDays,
  User,
  ArrowRight,
  BookOpen,
  Search,
  Clock,
  Sparkles,
  Tag,
  Building2,
  Share2,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { formatDate } from "@/lib/utils";
import SEOHead from "@/components/shared/SEOHead";
import { DEFAULT_BLOG_POSTS, BlogPost } from "@/lib/default-blogs";

export default function BlogPage() {
  const [blogs, setBlogs] = useState<BlogPost[]>(DEFAULT_BLOG_POSTS);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function fetchBlogs() {
      try {
        const res = await fetch("/api/blog");
        const json = await res.json();
        if (json.blogs && Array.isArray(json.blogs) && json.blogs.length > 0) {
          // Merge API blogs with default blogs so the page is always full of content
          const validApiBlogs = json.blogs.filter((b: any) => b.slug && b.slug !== "-");
          setBlogs([...validApiBlogs, ...DEFAULT_BLOG_POSTS]);
        }
      } catch {
        // Fallback to DEFAULT_BLOG_POSTS
      } finally {
        setLoading(false);
      }
    }
    fetchBlogs();
  }, []);

  const categories = useMemo(() => {
    const set = new Set<string>();
    blogs.forEach((b) => {
      if (b.category) set.add(b.category.trim());
    });
    return ["All", ...Array.from(set)];
  }, [blogs]);

  const filteredBlogs = useMemo(() => {
    return blogs.filter((b) => {
      const matchCat =
        activeCategory === "All" ||
        b.category.toLowerCase().includes(activeCategory.toLowerCase());

      if (!searchQuery.trim()) return matchCat;

      const q = searchQuery.toLowerCase();
      const matchSearch =
        b.title.toLowerCase().includes(q) ||
        b.excerpt.toLowerCase().includes(q) ||
        b.category.toLowerCase().includes(q) ||
        (b.tags && b.tags.some((t) => t.toLowerCase().includes(q)));

      return matchCat && matchSearch;
    });
  }, [blogs, activeCategory, searchQuery]);

  return (
    <div className="min-h-screen bg-background selection:bg-accent/20 selection:text-accent">
      <SEOHead
        title="Engineering Blog & Construction Guides"
        description="সাভার ও ঢাকায় বাড়ি নির্মাণ, সয়েল টেস্ট, ছাদ ঢালাই, BNBC 2020 কোড ও পৌরসভা প্ল্যান অনুমোদন সম্পর্কিত নির্ভরযোগ্য কারিগরি নির্দেশিকা।"
      />

      {/* ─── HERO SECTION ─── */}
      <section className="relative bg-primary pt-32 pb-20 overflow-hidden text-primary-foreground border-b border-primary/20">
        <div
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/20 border border-accent/40 text-accent text-sm font-semibold mb-6 shadow-sm"
          >
            <BookOpen className="w-4 h-4 text-accent" />
            HF Engineering Knowledge Hub & Articles
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold font-heading tracking-tight mb-5"
          >
            Engineering <span className="text-accent">Blog & Guides</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="text-lg md:text-xl text-primary-foreground/85 max-w-3xl mx-auto font-normal leading-relaxed mb-8"
          >
            নির্মাণ নিরাপত্তা, স্ট্রাকচারাল ডিজাইন, সয়েল টেস্ট ও খরচের নির্ভুল হিসাব নিয়ে অভিজ্ঞ সিভিল
            ইঞ্জিনিয়ারদের রচিত বিশ্লেষণধর্মী গাইডলাইন।
          </motion.p>

          {/* Search Input */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="max-w-xl mx-auto relative"
          >
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="আর্টিকেল খুঁজুন... (e.g. সয়েল টেস্ট, ছাদ ঢালাই, খরচ)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-4 h-13 rounded-2xl bg-background text-foreground border-2 border-white/20 focus:border-accent shadow-xl"
            />
          </motion.div>
        </div>
      </section>

      {/* ─── MAIN CONTENT ─── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Categories Bar */}
        <div className="flex flex-wrap items-center gap-2 mb-10 pb-4 border-b border-border">
          <span className="text-xs font-bold uppercase text-muted-foreground mr-2">ক্যাটাগরি:</span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`rounded-xl px-4 py-2 text-xs sm:text-sm font-semibold transition-all border ${
                activeCategory === cat
                  ? "bg-primary text-primary-foreground border-primary shadow-sm"
                  : "bg-card text-foreground hover:bg-muted border-border"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Blog Grid */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {filteredBlogs.map((blog, idx) => (
            <motion.article
              key={blog._id || idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.08 }}
              className="bg-card rounded-3xl border border-border hover:border-accent/50 shadow-xs hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between group"
            >
              <div>
                {/* Cover Image */}
                <Link href={`/blog/${blog.slug}`} className="block relative aspect-[16/10] overflow-hidden bg-muted">
                  <Image
                    src={blog.coverImage?.url || "https://images.unsplash.com/photo-1541888946425-d0fbb186156f?q=80&w=1200&auto=format&fit=crop"}
                    alt={blog.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3">
                    <Badge className="bg-primary/90 text-primary-foreground backdrop-blur-sm text-[11px] font-semibold border-none">
                      {blog.category}
                    </Badge>
                  </div>
                  {blog.readingTime && (
                    <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-sm text-white px-2.5 py-1 rounded-full text-[10px] font-medium flex items-center gap-1">
                      <Clock className="w-3 h-3 text-accent" />
                      <span>{blog.readingTime}</span>
                    </div>
                  )}
                </Link>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                    <span className="flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-accent" />
                      {blog.author}
                    </span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <CalendarDays className="w-3.5 h-3.5" />
                      {formatDate(blog.publishedAt)}
                    </span>
                  </div>

                  <Link href={`/blog/${blog.slug}`}>
                    <h3 className="text-lg font-bold font-heading text-foreground group-hover:text-primary transition-colors line-clamp-2 mb-3 leading-snug">
                      {blog.title}
                    </h3>
                  </Link>

                  <p className="text-xs sm:text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                    {blog.excerpt}
                  </p>
                </div>
              </div>

              {/* Card Footer */}
              <div className="px-6 pb-6 pt-3 border-t border-border/60 flex items-center justify-between">
                <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                  <Tag className="w-3 h-3 text-accent" />
                  <span>{blog.tags?.[0] || "ইঞ্জিনিয়ারিং"}</span>
                </div>

                <Link
                  href={`/blog/${blog.slug}`}
                  className="inline-flex items-center gap-1 text-xs font-bold text-accent hover:text-accent/80 transition-colors"
                >
                  <span>সম্পূর্ণ পড়ুন</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.article>
          ))}
        </div>
      </section>
    </div>
  );
}
