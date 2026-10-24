"use client";

import { use, useEffect, useState } from "react";
import { 
  ShieldCheck, 
  CheckCircle2, 
  Building2, 
  Calendar, 
  User, 
  FileText, 
  MapPin, 
  Award, 
  Loader2, 
  ArrowLeft,
  Share2,
  FileX
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import Link from "next/link";
import { toast } from "sonner";
import SEOHead from "@/components/shared/SEOHead";

export default function DocumentVerificationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/verify/${encodeURIComponent(id)}`)
      .then((res) => res.json())
      .then((json) => {
        if (json.verified) setData(json);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-10 h-10 animate-spin text-accent" />
        <p className="text-sm text-muted-foreground font-medium">অফিসিয়াল ডকুমেন্ট ক্রেডেনশিয়াল যাচাই করা হচ্ছে...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/20 py-12 px-4 sm:px-6 lg:px-8">
      <SEOHead
        title={`Verification - ${id}`}
        description="Official document credential verification for HF Design & Engineering Solutions."
      />

      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <Link href="/verify">
            <Button variant="ghost" size="sm" className="gap-2 text-xs font-bold">
              <ArrowLeft className="w-4 h-4" /> অন্য ডকুমেন্ট খুঁজুন
            </Button>
          </Link>
          <Button
            variant="outline"
            size="sm"
            className="gap-2 text-xs font-bold"
            onClick={() => {
              if (typeof window !== "undefined" && navigator.clipboard) {
                navigator.clipboard.writeText(window.location.href);
                toast.success("ভেরিফিকেশন লিংক কপি করা হয়েছে!");
              }
            }}
          >
            <Share2 className="w-3.5 h-3.5" /> শেয়ার লিংক
          </Button>
        </div>

        {/* Certificate Card */}
        {data ? (
          <Card className="border-2 border-emerald-500/40 shadow-xl overflow-hidden bg-card">
            {/* Top Green Banner */}
            <div className="bg-emerald-600 px-6 py-4 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-full">
                  <ShieldCheck className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-black tracking-wide uppercase">Officially Verified Document</h1>
                  <p className="text-xs text-emerald-100">HF Design &amp; Engineering Solutions Digital Seal</p>
                </div>
              </div>
              <Badge className="bg-white text-emerald-800 font-extrabold uppercase text-xs">
                Active &amp; Valid
              </Badge>
            </div>

            <CardContent className="p-6 sm:p-8 space-y-6 text-foreground">
              {/* Seal & Intro */}
              <div className="flex items-center gap-4 pb-6 border-b border-border">
                <img src="/images/logo.png" alt="HF Design & Engineering Solutions logo" className="w-16 h-16 object-contain shrink-0" />
                <div>
                  <h2 className="text-xl font-black tracking-tight text-foreground font-heading">
                    HF Design &amp; Engineering Solutions
                  </h2>
                  <p className="text-xs font-bold text-accent uppercase tracking-wider">Civil Engineering &amp; Consultancy</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    Civil Engineering · Structural Design · Municipality &amp; Planning Authority Approvals
                  </p>
                </div>
              </div>

              {/* Document Details */}
              <div className="space-y-3 text-sm">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-muted/40 rounded-xl border border-border">
                  <div>
                    <span className="text-xs text-muted-foreground uppercase font-semibold">Document Reference</span>
                    <p className="font-mono font-bold text-base text-accent mt-0.5">{data?.documentId || id}</p>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground uppercase font-semibold">Document Classification</span>
                    <p className="font-semibold text-foreground mt-0.5">{data?.documentType}</p>
                  </div>
                </div>

                <div className="p-4 bg-muted/20 rounded-xl border border-border space-y-2.5">
                  <div className="flex justify-between items-start">
                    <span className="text-xs text-muted-foreground">Project Title:</span>
                    <span className="font-bold text-foreground text-right">{data?.title}</span>
                  </div>
                  <div className="flex justify-between items-start">
                    <span className="text-xs text-muted-foreground">Client Name:</span>
                    <span className="font-bold text-foreground text-right">{data?.clientName}</span>
                  </div>
                  {data?.location && (
                    <div className="flex justify-between items-start">
                      <span className="text-xs text-muted-foreground">Location:</span>
                      <span className="font-medium text-foreground text-right">{data?.location}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-start">
                    <span className="text-xs text-muted-foreground">Issue / Recorded Date:</span>
                    <span className="font-medium text-foreground text-right">
                      {data?.issueDate ? format(new Date(data.issueDate), "dd MMMM yyyy") : "Recorded on file"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Authenticated Signatory */}
              <div className="p-4 rounded-xl border-2 border-emerald-500/20 bg-emerald-500/5 flex items-center gap-4">
                <div className="p-3 bg-emerald-500/10 text-emerald-600 rounded-full shrink-0">
                  <Award className="w-8 h-8" />
                </div>
                <div className="space-y-0.5">
                  <p className="text-xs font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider">Certified Authority</p>
                  <p className="font-bold text-base text-foreground">{data?.certifiedBy}</p>
                  <p className="text-xs text-muted-foreground">{data?.designation}</p>
                  <p className="text-[11px] text-muted-foreground italic mt-1">
                    Enlisted Engineering Consultant · Registered with IEB &amp; Statutory Planning Authorities
                  </p>
                </div>
              </div>

              {/* Legal Notice */}
              <p className="text-[11px] text-center text-muted-foreground leading-relaxed pt-2">
                This digital certificate verifies that the referenced engineering drawing, bill, or plan document was lawfully prepared and sanctioned under the authority of HF Design &amp; Engineering Solutions.
              </p>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-2 border-dashed border-border p-8 text-center bg-card space-y-4">
            <div className="w-14 h-14 rounded-full bg-rose-500/10 text-rose-600 flex items-center justify-center mx-auto">
              <FileX className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-foreground">ডকুমেন্ট রেকর্ড পাওয়া যায়নি</h2>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                রেফারেন্স আইডি <strong>{id}</strong> দিয়ে কোনো সক্রিয় অফিসিয়াল ডকুমেন্ট ডাটাবেজে পাওয়া যায়নি।
              </p>
            </div>
            <div className="pt-2">
              <Link href="/verify">
                <Button className="bg-accent hover:bg-accent/90 text-primary-foreground font-bold text-xs">
                  পুনরায় রেফারেন্স আইডি লিখুন
                </Button>
              </Link>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
