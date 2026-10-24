"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  CalendarDays,
  User,
  ArrowLeft,
  Tag,
  BookOpen,
  Loader2,
  Share2,
  Phone,
  Calendar,
  CheckCircle2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import { setClientMeta } from "@/lib/seo";
import { DEFAULT_BLOG_POSTS, BlogPost } from "@/lib/default-blogs";
import { SITE_CONFIG } from "@/lib/constants";
import WhatsAppIcon from "@/components/shared/WhatsAppIcon";

export default function BlogDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const [blog, setBlog] = useState<BlogPost | null>(null);
  const [related, setRelated] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    async function fetchBlog() {
      if (!slug) return;
      setLoading(true);
      setNotFound(false);

      try {
        const res = await fetch(`/api/blog/${slug}`);
        if (res.ok) {
          const json = await res.json();
          if (json.blog) {
            setBlog(json.blog);
            setClientMeta({
              title: json.blog.title,
              description: json.blog.excerpt?.slice(0, 160),
              ogImage: json.blog.coverImage?.url,
            });

            // Fetch related
            const relatedRes = await fetch(
              `/api/blog?category=${encodeURIComponent(json.blog.category || "")}&limit=4`
            );
            const relatedJson = await relatedRes.json();
            const rel = (relatedJson.blogs || []).filter((b: BlogPost) => b._id !== json.blog._id);
            if (rel.length > 0) {
              setRelated(rel.slice(0, 3));
            } else {
              setRelated(DEFAULT_BLOG_POSTS.filter((b) => b.slug !== slug).slice(0, 3));
            }
            return;
          }
        }

        // Fallback to DEFAULT_BLOG_POSTS
        const localMatch = DEFAULT_BLOG_POSTS.find((b) => b.slug === slug);
        if (localMatch) {
          setBlog(localMatch);
          setClientMeta({
            title: localMatch.title,
            description: localMatch.excerpt?.slice(0, 160),
            ogImage: localMatch.coverImage?.url,
          });
          setRelated(DEFAULT_BLOG_POSTS.filter((b) => b.slug !== slug).slice(0, 3));
          return;
        }

        setNotFound(true);
      } catch {
        const localMatch = DEFAULT_BLOG_POSTS.find((b) => b.slug === slug);
        if (localMatch) {
          setBlog(localMatch);
          setRelated(DEFAULT_BLOG_POSTS.filter((b) => b.slug !== slug).slice(0, 3));
        } else {
          setNotFound(true);
        }
      } finally {
        setLoading(false);
      }
    }
    fetchBlog();
  }, [slug]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (notFound || !blog) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-center px-4 py-20">
        <BookOpen className="mb-4 h-16 w-16 text-muted-foreground/40" />
        <h2 className="mb-2 text-2xl font-bold font-heading">আর্টিকেলটি পাওয়া যায়নি</h2>
        <p className="mb-6 text-sm text-muted-foreground max-w-md">
          আপনি যে আর্টিকেলটি খুঁজছেন তা মুছে ফেলা হয়েছে অথবা লিংকটি পরিবর্তিত হয়েছে।
        </p>
        <Link href="/blog">
          <Button className="rounded-xl">
            <ArrowLeft className="mr-2 h-4 w-4" /> ব্লগে ফিরে যান
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <article>
        {/* Cover Header Banner */}
        {blog.coverImage?.url && (
          <div className="relative h-72 sm:h-96 w-full overflow-hidden bg-primary">
            <Image
              src={blog.coverImage.url}
              alt={blog.title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
          </div>
        )}

        <div className="mx-auto max-w-4xl px-4 sm:px-6 py-10">
          <Link
            href="/blog"
            className="mb-8 inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-muted-foreground hover:text-primary transition-colors bg-card border border-border px-3.5 py-1.5 rounded-full"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> সকল আর্টিকেলে ফিরে যান
          </Link>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <Badge className="bg-primary text-primary-foreground font-semibold text-xs">
                {blog.category}
              </Badge>
              {blog.tags?.map((tag) => (
                <Badge key={tag} variant="outline" className="flex items-center gap-1 text-xs">
                  <Tag className="h-3 w-3 text-accent" />
                  {tag}
                </Badge>
              ))}
            </div>

            <h1 className="mb-6 text-3xl sm:text-4xl md:text-5xl font-black font-heading tracking-tight text-foreground leading-tight">
              {blog.title}
            </h1>

            {/* Author Meta Box */}
            <div className="flex flex-wrap items-center gap-4 py-4 border-y border-border text-xs sm:text-sm text-muted-foreground mb-8">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-accent/20 text-accent font-bold flex items-center justify-center text-xs">
                  HF
                </div>
                <div>
                  <span className="font-bold text-foreground block">{blog.author}</span>
                  <span className="text-[11px] text-muted-foreground">HF Design & Engineering Solutions</span>
                </div>
              </div>

              <span>·</span>

              <div className="flex items-center gap-1.5">
                <CalendarDays className="h-4 w-4 text-accent" />
                <span>{formatDate(blog.publishedAt)}</span>
              </div>
            </div>

            {/* Excerpt Callout */}
            {blog.excerpt && (
              <div className="p-5 rounded-2xl bg-accent/10 border-l-4 border-accent mb-8 text-foreground/90 font-medium text-base sm:text-lg leading-relaxed">
                {blog.excerpt}
              </div>
            )}

            {/* Main Content Body */}
            <div
              className="prose prose-base sm:prose-lg max-w-none text-foreground/85 leading-relaxed space-y-4 [&>h2]:text-2xl [&>h2]:font-bold [&>h2]:font-heading [&>h2]:text-foreground [&>h2]:mt-8 [&>h2]:mb-3 [&>p]:mb-4 [&>p]:leading-relaxed"
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />

            {/* Author Expert Consultation Box */}
            <div className="mt-14 p-6 sm:p-8 rounded-3xl bg-muted/40 border-2 border-border shadow-xs flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="space-y-2 text-center sm:text-left">
                <span className="text-xs font-bold uppercase text-accent tracking-wider">
                  অভিজ্ঞ সিভিল ইঞ্জিনিয়ারের পরামর্শ
                </span>
                <h3 className="text-xl font-bold font-heading text-foreground">
                  এই বিষয়ে আপনার কোনো প্রশ্ন আছে?
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground max-w-md">
                  আপনার জমির অবস্থান ও ড্রয়িং নিয়ে সরাসরি আমাদের প্রধান ইঞ্জিনিয়ারের সাথে কথা বলুন।
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto shrink-0">
                <a
                  href={`https://wa.me/${SITE_CONFIG.whatsapp}?text=${encodeURIComponent(
                    `আসসালামু আলাইকুম HF Engineering, আমি আপনার "${blog.title}" আর্টিকেলটি পড়েছি এবং এই বিষয়ে আরও জানতে চাই।`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto"
                >
                  <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold gap-2 rounded-xl">
                    <WhatsAppIcon className="w-4 h-4" />
                    <span>WhatsApp-এ জানুন</span>
                  </Button>
                </a>

                <Link href="/book-appointment" className="w-full sm:w-auto">
                  <Button variant="outline" className="w-full font-bold gap-2 rounded-xl">
                    <Calendar className="w-4 h-4" />
                    <span>অ্যাপয়েন্টমেন্ট নিন</span>
                  </Button>
                </Link>
              </div>
            </div>

            {/* Related Articles */}
            {related.length > 0 && (
              <div className="mt-16 pt-10 border-t border-border">
                <h3 className="text-2xl font-bold font-heading text-foreground mb-6">
                  সম্পর্কিত আরও আর্টিকেল
                </h3>
                <div className="grid gap-6 sm:grid-cols-3">
                  {related.map((item) => (
                    <Link
                      key={item._id}
                      href={`/blog/${item.slug}`}
                      className="group rounded-2xl border border-border bg-card p-4 hover:border-accent/50 hover:shadow-md transition-all flex flex-col justify-between"
                    >
                      <div>
                        <Badge variant="secondary" className="text-[10px] mb-2">
                          {item.category}
                        </Badge>
                        <h4 className="font-bold text-sm text-foreground group-hover:text-primary transition-colors line-clamp-2 mb-2 leading-snug">
                          {item.title}
                        </h4>
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {item.excerpt}
                        </p>
                      </div>
                      <span className="text-xs font-bold text-accent mt-3 block group-hover:underline">
                        পড়ুন →
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </article>
    </div>
  );
}
