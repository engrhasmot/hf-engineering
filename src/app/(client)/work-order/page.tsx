"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { 
  Building2, 
  Mail, 
  MapPin, 
  Phone, 
  User, 
  Loader2, 
  DollarSign, 
  CheckCircle2, 
  ShieldCheck, 
  FileCheck2, 
  Layers, 
  Sparkles,
  ArrowRight,
  MessageCircle,
  Clock,
  Compass
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import SEOHead from "@/components/shared/SEOHead";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";

const formSchema = z.object({
  name: z.string().min(2, "Name is required"),
  phone: z.string().regex(/^(?:\+?880)?\d{10,11}$/, "Invalid Bangladeshi phone number (11 digits)"),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  projectTitle: z.string().min(3, "Project title is required"),
  projectLocation: z.string().min(3, "Project location is required"),
  requirements: z.string().min(10, "Requirements must be at least 10 characters"),
  estimatedBudget: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function WorkOrderPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submittedData, setSubmittedData] = useState<FormValues | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      projectTitle: "",
      projectLocation: "",
      requirements: "",
      estimatedBudget: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/work-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      
      const result = await res.json();
      
      if (!res.ok) {
        throw new Error(result.error || "Failed to submit work order");
      }
      
      setSubmittedData(data);
      setIsSuccess(true);
      form.reset();
      toast.success("ওয়ার্ক অর্ডার রিকোয়েস্ট সফলভাবে জমা হয়েছে!");
    } catch (error: any) {
      toast.error(error.message || "Something went wrong, please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center py-16 px-4 bg-muted/20">
        <SEOHead title="Work Order Received" description="Your engineering work order has been received." />
        <Card className="max-w-xl w-full border-2 border-emerald-500/40 shadow-xl text-center p-8 bg-card space-y-6">
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <Badge className="bg-emerald-600 text-white font-bold text-xs uppercase px-3 py-1">
              Submission Confirmed
            </Badge>
            <h1 className="text-2xl sm:text-3xl font-black text-foreground font-heading">
              ওয়ার্ক অর্ডার সফলভাবে গ্রহণ করা হয়েছে!
            </h1>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-md mx-auto">
              ধন্যবাদ <strong>{submittedData?.name}</strong> সাহেব। আপনার প্রজেক্ট <strong>&ldquo;{submittedData?.projectTitle}&rdquo;</strong> এর বিস্তারিত তথ্য নথিভুক্ত হয়েছে।
            </p>
          </div>

          <div className="bg-muted/40 p-4 rounded-xl border border-border text-left text-xs space-y-2 font-medium">
            <div className="flex justify-between">
              <span className="text-muted-foreground">ফোন নম্বর:</span>
              <span className="font-mono text-foreground">{submittedData?.phone}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">অবস্থান:</span>
              <span className="text-foreground">{submittedData?.projectLocation}</span>
            </div>
            {submittedData?.estimatedBudget && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">সম্ভাব্য বাজেট:</span>
                <span className="text-accent font-bold">{submittedData.estimatedBudget}</span>
              </div>
            )}
          </div>

          <p className="text-xs text-muted-foreground">
            আমাদের সিনিয়র ইঞ্জিনিয়ারিং টিম প্রজেক্টের কারিগরি সম্ভাব্যতা বিশ্লেষণ করে ২৪ ঘণ্টার মধ্যে আপনার সাথে যোগাযোগ করবে।
          </p>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <a
              href={`https://wa.me/8801778506500?text=${encodeURIComponent(
                `আসসালামুয়ালাইকুম ইঞ্জিনিয়ার সাহেব, আমি ওয়েবসাইটে একটি ওয়ার্ক অর্ডার জমা দিয়েছি। প্রজেক্ট: ${submittedData?.projectTitle}, স্থান: ${submittedData?.projectLocation}। দ্রুত আলোচনা করতে চাই।`
              )}`}
              target="_blank"
              rel="noreferrer"
              className="flex-1"
            >
              <Button className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold gap-2">
                <MessageCircle className="w-4 h-4" /> হোয়াটসঅ্যাপে কথা বলুন
              </Button>
            </a>

            <Button variant="outline" onClick={() => setIsSuccess(false)} className="font-bold">
              নতুন আবেদন করুন
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-muted/20">
      <SEOHead
        title="Official Work Order & RFP Request"
        description="Submit project requirements and request a formal engineering work order, drawing contract, or construction proposal."
      />

      <div className="max-w-4xl mx-auto space-y-10">
        {/* Header */}
        <div className="text-center space-y-4">
          <Badge variant="outline" className="px-3.5 py-1.5 bg-accent/10 text-accent border-accent/25 text-xs font-bold gap-1.5 shadow-xs">
            <FileCheck2 className="w-3.5 h-3.5" /> Formal Engineering Engagement &amp; RFP
          </Badge>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-foreground font-heading">
            Request an <span className="text-accent">Official Work Order</span>
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            বিল্ডিং ডিজাইন, প্ল্যান অনুমোদন, স্ট্রাকচারাল এনালাইসিস বা পূর্ণাঙ্গ কন্সট্রাকশন ম্যানেজমেন্টের জন্য প্রজেক্টের বিবরণ জমা দিন। আমাদের কারিগরি টিম আনুষ্ঠানিক প্রপোজাল প্রস্তুত করবে।
          </p>
        </div>

        {/* 4 Trust Pillars */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3.5 bg-card rounded-2xl border border-border text-center shadow-xs">
            <ShieldCheck className="w-6 h-6 text-emerald-600 dark:text-emerald-400 mx-auto mb-1.5" />
            <h4 className="font-bold text-xs text-foreground">IEB Licensed</h4>
            <p className="text-[10px] text-muted-foreground mt-0.5">M-38530 Signoff</p>
          </div>
          <div className="p-3.5 bg-card rounded-2xl border border-border text-center shadow-xs">
            <Building2 className="w-6 h-6 text-accent mx-auto mb-1.5" />
            <h4 className="font-bold text-xs text-foreground">BNBC 2020</h4>
            <p className="text-[10px] text-muted-foreground mt-0.5">Code Compliance</p>
          </div>
          <div className="p-3.5 bg-card rounded-2xl border border-border text-center shadow-xs">
            <DollarSign className="w-6 h-6 text-blue-600 dark:text-blue-400 mx-auto mb-1.5" />
            <h4 className="font-bold text-xs text-foreground">BOQ Transparency</h4>
            <p className="text-[10px] text-muted-foreground mt-0.5">Itemized Estimation</p>
          </div>
          <div className="p-3.5 bg-card rounded-2xl border border-border text-center shadow-xs">
            <Clock className="w-6 h-6 text-purple-600 dark:text-purple-400 mx-auto mb-1.5" />
            <h4 className="font-bold text-xs text-foreground">SLA Timeline</h4>
            <p className="text-[10px] text-muted-foreground mt-0.5">Milestone Delivery</p>
          </div>
        </div>

        {/* Work Order Form Card */}
        <Card className="border-border shadow-xl bg-card overflow-hidden">
          <CardHeader className="bg-muted/40 border-b border-border pb-6">
            <CardTitle className="text-xl font-bold flex items-center gap-2 font-heading">
              <Building2 className="w-5 h-5 text-accent" /> প্রজেক্ট ও ওয়ার্ক অর্ডার ফরম
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              সকল প্রয়োজনীয় তথ্য সঠিকভাবে পূরণ করুন যাতে আমরা দ্রুত প্রযুক্তিগত পর্যালোচনা শেষ করতে পারি।
            </CardDescription>
          </CardHeader>

          <CardContent className="p-6 sm:p-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-accent" /> Full Name / ক্লায়েন্টের নাম <span className="text-rose-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Engr. / Alhaj ..." className="h-11 bg-background" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                          <Phone className="w-3.5 h-3.5 text-accent" /> Phone / WhatsApp <span className="text-rose-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="017XXXXXXXX" className="h-11 font-mono bg-background" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                          <Mail className="w-3.5 h-3.5 text-accent" /> Email Address (Optional)
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="client@example.com" className="h-11 bg-background" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="projectTitle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                          <Building2 className="w-3.5 h-3.5 text-accent" /> Project Title / প্রজেক্টের নাম <span className="text-rose-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="যেমন: ৫-তলা আবাসিক ভবন ডিজাইন বা ডুপ্লেক্স হোম" className="h-11 bg-background" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="projectLocation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-accent" /> Project Location / অবস্থান <span className="text-rose-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="যেমন: সাভার, ঢাকা / মিরপুর ডিওএইচএস" className="h-11 bg-background" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="estimatedBudget"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                          <DollarSign className="w-3.5 h-3.5 text-accent" /> Estimated Budget (Optional)
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="যেমন: ৳ ৫০,০০,০০০ বা আলোচনা সাপেক্ষ" className="h-11 bg-background" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="requirements"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                        <Layers className="w-3.5 h-3.5 text-accent" /> Project Scope &amp; Detailed Requirements <span className="text-rose-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="প্রজেক্টের পরিধি, প্রয়োজনীয় সেবাসমূহ (যেমন: আর্কিটেকচারাল নকশা, স্ট্রাকচারাল ডিজাইন, মাটি পরীক্ষা, পৌরসভা প্ল্যান অনুমোদন, প্লাম্বিং ও ইলেকট্রিক্যাল ডিজাইন) বিস্তারিত লিখুন..." 
                          className="min-h-[140px] resize-y bg-background text-sm leading-relaxed" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button 
                  type="submit" 
                  disabled={isSubmitting} 
                  className="w-full h-12 text-base font-black bg-accent hover:bg-accent/90 text-primary-foreground shadow-lg transition-all"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      ওয়ার্ক অর্ডার জমা হচ্ছে...
                    </>
                  ) : (
                    <>
                      Submit Official Work Order Request <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Quick Contact Box */}
        <div className="p-5 rounded-2xl bg-card border border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="font-bold text-foreground text-sm font-heading">জরুরি ওয়ার্ক অর্ডার বা সরাসরি প্রজেক্ট মিটিং?</h4>
            <p className="text-xs text-muted-foreground mt-0.5">আমাদের প্রধান প্রকৌশলীর সাথে সরাসরি কথা বলে আজই সাইট ভিজিটের তারিখ নির্ধারণ করুন।</p>
          </div>
          <div className="flex gap-2 shrink-0">
            <a href="tel:+8801778506500">
              <Button size="sm" variant="outline" className="font-bold text-xs gap-1.5 h-9">
                <Phone className="w-3.5 h-3.5" /> 01778-506500
              </Button>
            </a>
            <a href="https://wa.me/8801778506500?text=Hello%20HF%20Engineering,%20I%20want%20to%20discuss%20a%20new%20Work%20Order." target="_blank" rel="noreferrer">
              <Button size="sm" className="bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs gap-1.5 h-9">
                <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
              </Button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
