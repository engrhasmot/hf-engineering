"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, Search, ArrowRight, FileCheck, CheckCircle2, Lock, Award, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import SEOHead from "@/components/shared/SEOHead";
import Link from "next/link";

export default function VerifyIndexPage() {
  const [docId, setDocId] = useState("");
  const router = useRouter();

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docId.trim()) return;
    router.push(`/verify/${encodeURIComponent(docId.trim())}`);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-16 px-4 bg-muted/20">
      <SEOHead
        title="ডকুমেন্ট ও ড্রয়িং ভেরিফিকেশন"
        description="এইচএফ ডিজাইন অ্যান্ড ইঞ্জিনিয়ারিং সলিউশনস কর্তৃক ইস্যুকৃত অফিসিয়াল ড্রয়িং, কোটেশন, বিল ও প্ল্যানের সত্যতা যাচাই।"
      />

      <div className="max-w-xl w-full space-y-6 text-center">
        <div className="space-y-3">
          <Badge variant="outline" className="px-3 py-1 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/25 text-xs font-bold">
            <ShieldCheck className="w-3.5 h-3.5 mr-1" /> HF Engineering Authentication Seal
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground font-heading">
            ডকুমেন্ট ও ড্রয়িং ভেরিফিকেশন
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            আপনার ড্রয়িং, কোটেশন, বিল, মানি রিসিট অথবা ইঞ্জিনিয়ারিং রিপোর্টের রেফারেন্স আইডি দিয়ে এর অফিসিয়াল বৈধতা ও ডিজিটাল সিল যাচাই করুন।
          </p>
        </div>

        <Card className="border-2 border-border shadow-md text-left bg-card">
          <CardContent className="p-6 sm:p-8">
            <form onSubmit={handleVerify} className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-accent" /> Document Reference ID / ফাইল নম্বর *
                </label>
                <div className="relative">
                  <FileCheck className="w-5 h-5 absolute left-3.5 top-3.5 text-muted-foreground" />
                  <Input
                    className="pl-11 h-12 text-base font-mono uppercase tracking-wide bg-background"
                    placeholder="যেমন: TH-2026-0001 বা REC-20260908"
                    value={docId}
                    onChange={(e) => setDocId(e.target.value)}
                    required
                  />
                </div>
                <p className="text-[11px] text-muted-foreground">
                  নথির উপরে বা সিল মোহরে মুদ্রিত রেফারেন্স নম্বরটি লিখুন।
                </p>
              </div>

              <Button type="submit" className="w-full h-12 font-black bg-accent hover:bg-accent/90 text-primary-foreground gap-2 text-base shadow-sm">
                যাচাই করুন (Verify Now) <ArrowRight className="w-4 h-4" />
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Security badges */}
        <div className="grid grid-cols-3 gap-3 pt-2 text-xs text-muted-foreground">
          <div className="p-3.5 bg-card rounded-2xl border border-border shadow-xs">
            <Award className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mx-auto mb-1.5" />
            <p className="font-bold text-foreground">IEB Certified</p>
            <p className="text-[10px] text-muted-foreground">Engineer Validation</p>
          </div>
          <div className="p-3.5 bg-card rounded-2xl border border-border shadow-xs">
            <ShieldCheck className="w-5 h-5 text-blue-600 dark:text-blue-400 mx-auto mb-1.5" />
            <p className="font-bold text-foreground">Anti-Fraud</p>
            <p className="text-[10px] text-muted-foreground">Tamper Proof Record</p>
          </div>
          <div className="p-3.5 bg-card rounded-2xl border border-border shadow-xs">
            <Lock className="w-5 h-5 text-accent mx-auto mb-1.5" />
            <p className="font-bold text-foreground">Authority Verified</p>
            <p className="text-[10px] text-muted-foreground">Pauroshova &amp; City Corp</p>
          </div>
        </div>

        {/* Quick link to track plan */}
        <p className="text-xs text-muted-foreground">
          ফাইল স্ট্যাটাস বা কাজের অগ্রগতি দেখতে চান?{" "}
          <Link href="/track-plan" className="text-accent font-bold hover:underline">
            প্ল্যান ট্র্যাকার দেখুন →
          </Link>
        </p>
      </div>
    </div>
  );
}
