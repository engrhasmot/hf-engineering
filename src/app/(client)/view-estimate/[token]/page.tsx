"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import {
  Calculator,
  Download,
  Printer,
  CheckCircle2,
  AlertCircle,
  Building2,
  MapPin,
  Calendar,
  Layers,
  Phone,
  Mail,
  ShieldCheck,
  ArrowRight,
  FileText,
  Search,
  MessageSquare,
  Clock,
  Sparkles,
  ExternalLink,
  ChevronDown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";

interface Props {
  params: Promise<{ token: string }>;
}

export default function ClientEstimateViewPage({ params }: Props) {
  const { token } = use(params);

  const [loading, setLoading] = useState(true);
  const [estimate, setEstimate] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // Search & Category filter inside BOQ
  const [boqSearch, setBoqSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Client Action Modals
  const [acceptModalOpen, setAcceptModalOpen] = useState(false);
  const [revisionModalOpen, setRevisionModalOpen] = useState(false);
  const [clientNotes, setClientNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch Estimate Data
  const fetchEstimate = async () => {
    try {
      const res = await fetch(`/api/estimate-portal/${token}`);
      const data = await res.json();
      if (data.success) {
        setEstimate(data.data);
      } else {
        setError(data.error || "Estimate proposal not found.");
      }
    } catch (err: any) {
      setError(err.message || "Failed to load estimate.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEstimate();
  }, [token]);

  // Handle Accept Proposal
  const handleAcceptProposal = async () => {
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/estimate-portal/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "accept", notes: clientNotes }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Proposal successfully accepted!");
        setAcceptModalOpen(false);
        fetchEstimate();
      } else {
        toast.error(data.error || "Failed to submit acceptance.");
      }
    } catch (err: any) {
      toast.error(err.message || "Submission failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Request Revision
  const handleRequestRevision = async () => {
    if (!clientNotes.trim()) {
      toast.error("Please describe what revisions you require.");
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/estimate-portal/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "request_revision", notes: clientNotes }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Revision request received by our engineering team!");
        setRevisionModalOpen(false);
        fetchEstimate();
      } else {
        toast.error(data.error || "Failed to submit revision request.");
      }
    } catch (err: any) {
      toast.error(err.message || "Submission failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 gap-3">
        <div className="w-10 h-10 border-3 border-accent border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-semibold text-muted-foreground animate-pulse">
          Loading Official Engineering Proposal...
        </p>
      </div>
    );
  }

  if (error || !estimate) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center max-w-md mx-auto">
        <div className="w-16 h-16 rounded-full bg-rose-500/10 text-rose-600 flex items-center justify-center mb-4">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold font-heading mb-2">Estimate Not Available</h2>
        <p className="text-xs text-muted-foreground mb-6">
          {error || "This proposal link may have expired or the security token is invalid. Please contact HF Engineering team."}
        </p>
        <Link href="/">
          <Button className="bg-[#0B2A4A] text-white text-xs">Return to Home</Button>
        </Link>
      </div>
    );
  }

  // Filter BOQ Items
  const categories: string[] = ["All", ...Array.from(new Set<string>(estimate.boqItems?.map((i: any) => String(i.category || "")) || []))];
  const filteredBOQ = estimate.boqItems?.filter((item: any) => {
    const matchesCat = selectedCategory === "All" || item.category === selectedCategory;
    const matchesSearch =
      !boqSearch ||
      item.description?.toLowerCase().includes(boqSearch.toLowerCase()) ||
      item.itemCode?.toLowerCase().includes(boqSearch.toLowerCase()) ||
      item.category?.toLowerCase().includes(boqSearch.toLowerCase());
    return matchesCat && matchesSearch;
  }) || [];

  const whatsappMessage = encodeURIComponent(
    `Hello HF Engineering team, I am viewing the Civil Construction Estimate (${estimate.estimateNumber}) for "${estimate.projectName}". I have some inquiries regarding the proposal.`
  );

  return (
    <div className="min-h-screen bg-[#F5F7FA] dark:bg-background text-foreground pb-20 print:bg-white print:p-0">
      {/* Top Engineering Verification Ribbon */}
      <div className="bg-[#0B2A4A] text-white border-b border-[#F2A900]/30 py-2.5 px-4 sticky top-16 md:top-20 z-30 shadow-md print:hidden">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#F2A900] animate-ping" />
            <ShieldCheck className="w-4 h-4 text-[#F2A900]" />
            <span className="font-bold tracking-wide">
              Official Client Estimate Portal • HF Design &amp; Engineering Solutions
            </span>
            <Badge className="bg-[#F2A900] text-[#0B2A4A] text-[10px] font-bold border-none uppercase">
              BNBC 2020 Compliant
            </Badge>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <a href={`/api/estimate-portal/${token}/pdf`} target="_blank" rel="noopener noreferrer">
              <Button size="sm" className="bg-[#F2A900] hover:bg-[#d89600] text-[#0B2A4A] font-bold text-xs h-7 gap-1.5 shadow-xs cursor-pointer">
                <Download className="w-3.5 h-3.5" /> Download PDF
              </Button>
            </a>
            <Button
              size="sm"
              variant="outline"
              onClick={() => window.print()}
              className="bg-white/10 hover:bg-white/20 text-white border-white/20 text-xs h-7 gap-1.5 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" /> Print
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
        {/* Status Callout Banner */}
        {estimate.clientStatus === "accepted" ? (
          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-4 sm:p-5 flex items-center justify-between gap-4 text-emerald-800 dark:text-emerald-300">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-sm">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-sm sm:text-base font-heading">
                  Proposal Officially Accepted by Client
                </h3>
                <p className="text-xs opacity-90">
                  Accepted on {new Date(estimate.clientAcceptedAt || estimate.createdAt).toLocaleDateString("en-US", { dateStyle: "long" })}. Our team is preparing work orders &amp; material mobilization.
                </p>
              </div>
            </div>
            <Badge className="bg-emerald-600 text-white text-xs font-bold px-3 py-1">Accepted</Badge>
          </div>
        ) : estimate.clientStatus === "revision_requested" ? (
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 sm:p-5 flex items-center justify-between gap-4 text-amber-800 dark:text-amber-300">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-sm">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-sm sm:text-base font-heading">
                  Revision Request In Progress
                </h3>
                <p className="text-xs opacity-90">
                  Your revision notes have been submitted to our structural estimation team. We will send an updated proposal shortly.
                </p>
              </div>
            </div>
            <Badge className="bg-amber-500 text-white text-xs font-bold px-3 py-1">In Review</Badge>
          </div>
        ) : (
          <div className="bg-white dark:bg-card border border-border rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#F2A900] bg-[#0B2A4A] px-2 py-0.5 rounded">
                Action Required
              </span>
              <h3 className="text-sm font-bold font-heading text-foreground mt-1.5">
                Ready to review and proceed with this project?
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Accept this estimate online to confirm approval, or submit revision notes if you need alterations.
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Button
                onClick={() => setRevisionModalOpen(true)}
                variant="outline"
                size="sm"
                className="text-xs font-bold h-9 border-border"
              >
                Request Revision
              </Button>
              <Button
                onClick={() => setAcceptModalOpen(true)}
                size="sm"
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold h-9 gap-1.5 shadow-sm"
              >
                <CheckCircle2 className="w-4 h-4" /> Accept Proposal
              </Button>
            </div>
          </div>
        )}

        {/* Main Proposal Document Header */}
        <Card className="border-border shadow-md bg-white dark:bg-card overflow-hidden">
          <div className="bg-[#0B2A4A] text-white p-6 sm:p-8 relative">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 relative z-10">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="bg-[#F2A900] text-[#0B2A4A] text-xs font-black uppercase px-2 py-0.5 rounded">
                    ESTIMATE PROPOSAL
                  </span>
                  <span className="text-xs font-mono text-slate-300">
                    Ref: {estimate.estimateNumber}
                  </span>
                  {estimate.revision > 0 && (
                    <Badge variant="outline" className="text-[10px] text-[#F2A900] border-[#F2A900]/40">
                      Rev {estimate.revision}
                    </Badge>
                  )}
                </div>
                <h1 className="text-2xl sm:text-3xl font-black font-heading tracking-tight">
                  {estimate.projectName}
                </h1>
                <p className="text-xs sm:text-sm text-slate-200 flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-[#F2A900]" />
                  <span>Prepared for: <strong>{estimate.clientName}</strong></span>
                  <span>•</span>
                  <MapPin className="w-4 h-4 text-[#F2A900]" />
                  <span>{estimate.location}</span>
                </p>
              </div>

              {/* Company Header Block */}
              <div className="text-left md:text-right border-t md:border-t-0 border-white/10 pt-4 md:pt-0 space-y-1 text-xs text-slate-200">
                <div className="font-black text-sm text-[#F2A900] tracking-wide font-heading">
                  {estimate.company?.name}
                </div>
                <div>Civil Engineering &amp; Architectural Consultancy</div>
                <div>Dhaka, Bangladesh</div>
                <div className="text-slate-300 font-mono text-[11px]">
                  Date: {new Date(estimate.createdAt).toLocaleDateString("en-US", { dateStyle: "medium" })}
                </div>
                {estimate.validityDate && (
                  <div className="text-[#F2A900] font-semibold text-[11px]">
                    Valid Until: {new Date(estimate.validityDate).toLocaleDateString("en-US", { dateStyle: "medium" })}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Key Project Metrics Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-y sm:divide-y-0 divide-border border-b border-border bg-muted/20 text-xs">
            <div className="p-4 sm:p-5 space-y-1">
              <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
                Total Built-up Area
              </span>
              <div className="text-lg sm:text-xl font-black text-foreground font-heading">
                {estimate.inputs?.totalBuiltUpArea?.toLocaleString()} <span className="text-xs font-normal text-muted-foreground">{estimate.inputs?.unitType || "sqft"}</span>
              </div>
              <p className="text-[11px] text-muted-foreground">
                {estimate.inputs?.floors} Stories ({estimate.inputs?.buildingType})
              </p>
            </div>

            <div className="p-4 sm:p-5 space-y-1">
              <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
                Foundation System
              </span>
              <div className="text-sm sm:text-base font-bold text-foreground truncate">
                {estimate.inputs?.foundationType}
              </div>
              <p className="text-[11px] text-muted-foreground">
                Rebar: {estimate.inputs?.structuralSpecs?.rebarGrade || "500W Grade"}
              </p>
            </div>

            <div className="p-4 sm:p-5 space-y-1">
              <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
                Estimated Rate / Sft
              </span>
              <div className="text-lg sm:text-xl font-black text-foreground font-heading text-accent">
                ৳{Math.round(estimate.financials?.costPerSqFt || 0).toLocaleString()}
              </div>
              <p className="text-[11px] text-muted-foreground">Per square foot of construction</p>
            </div>

            <div className="p-4 sm:p-5 space-y-1 bg-accent/5">
              <span className="text-[10px] uppercase font-bold text-accent tracking-wider">
                Total Estimated Cost
              </span>
              <div className="text-xl sm:text-2xl font-black text-[#0B2A4A] dark:text-[#F2A900] font-heading">
                ৳{Math.round(estimate.financials?.grandTotalCost || 0).toLocaleString()}
              </div>
              <p className="text-[11px] text-muted-foreground">All inclusive engineering budget</p>
            </div>
          </div>

          {/* Financial Category Breakdown Visual */}
          <CardContent className="p-6 space-y-6">
            <div>
              <h3 className="text-sm font-bold font-heading text-foreground mb-3 flex items-center gap-2">
                <Layers className="w-4 h-4 text-accent" /> Work Package Cost Distribution
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {estimate.financials?.categoryTotals?.map((cat: any, idx: number) => (
                  <div key={idx} className="bg-muted/30 border border-border rounded-xl p-3.5 space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-foreground">{cat.category}</span>
                      <span className="font-mono text-muted-foreground text-[11px]">{cat.percentage}%</span>
                    </div>
                    <div className="text-base font-black font-heading text-foreground">
                      ৳{Math.round(cat.cost).toLocaleString()}
                    </div>
                    <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-[#0B2A4A] dark:bg-[#F2A900] h-full rounded-full"
                        style={{ width: `${Math.min(100, Math.max(5, cat.percentage))}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bill of Quantities (BOQ) Interactive Table */}
            <div className="space-y-4 pt-4 border-t border-border">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-bold font-heading text-foreground flex items-center gap-2">
                    <FileText className="w-4 h-4 text-accent" /> Itemized Bill of Quantities (BOQ)
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Detailed engineering quantities, units, and Bangladesh market standard unit rates.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Search items..."
                      value={boqSearch}
                      onChange={(e) => setBoqSearch(e.target.value)}
                      className="pl-8 text-xs h-8 w-full sm:w-48"
                    />
                  </div>

                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="text-xs h-8 border border-input rounded-md px-2 bg-background font-medium"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c === "All" ? "All Categories" : c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Table */}
              <div className="border border-border rounded-xl overflow-hidden bg-background">
                <div className="overflow-x-auto max-h-[460px] scrollbar-thin">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-muted/70 uppercase font-bold text-[10px] text-muted-foreground border-b border-border sticky top-0 z-10 backdrop-blur-xs">
                      <tr>
                        <th className="p-3">Item Code</th>
                        <th className="p-3">Category</th>
                        <th className="p-3">Description &amp; Specifications</th>
                        <th className="p-3 text-center">Unit</th>
                        <th className="p-3 text-right">Quantity</th>
                        <th className="p-3 text-right">Unit Rate (৳)</th>
                        <th className="p-3 text-right">Total Amount (৳)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {filteredBOQ.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="p-8 text-center text-muted-foreground text-xs">
                            No BOQ items match your search criteria.
                          </td>
                        </tr>
                      ) : (
                        filteredBOQ.map((item: any, i: number) => (
                          <tr key={i} className="hover:bg-muted/20">
                            <td className="p-3 font-mono font-bold text-accent">{item.itemCode}</td>
                            <td className="p-3 text-muted-foreground font-medium">{item.category}</td>
                            <td className="p-3 font-semibold text-foreground max-w-sm">{item.description}</td>
                            <td className="p-3 text-center uppercase font-mono text-muted-foreground">{item.unit}</td>
                            <td className="p-3 text-right font-mono font-bold text-foreground">
                              {Number(item.quantity).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                            </td>
                            <td className="p-3 text-right font-mono text-muted-foreground">
                              ৳{Number(item.unitRate).toLocaleString()}
                            </td>
                            <td className="p-3 text-right font-mono font-bold text-foreground">
                              ৳{Math.round(item.amount).toLocaleString()}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                    <tfoot className="bg-muted/50 border-t-2 border-border font-bold">
                      <tr>
                        <td colSpan={6} className="p-3 text-right uppercase text-[11px] font-heading">
                          Total Estimated Construction Cost:
                        </td>
                        <td className="p-3 text-right font-mono text-sm text-accent font-black">
                          ৳{Math.round(estimate.financials?.grandTotalCost || 0).toLocaleString()}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </div>

            {/* Engineering Specifications & Notes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-border text-xs">
              <div className="bg-muted/20 border border-border rounded-xl p-4 space-y-2">
                <h4 className="font-bold text-foreground font-heading flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-accent" /> Key Engineering Standards
                </h4>
                <ul className="space-y-1.5 text-muted-foreground list-disc list-inside">
                  <li>Structural Design &amp; Load Combinations based on <strong>BNBC 2020</strong>.</li>
                  <li>Concrete Grade: <strong>{estimate.inputs?.structuralSpecs?.concreteGrade || "C20 / C25"}</strong>.</li>
                  <li>High-Yield Deformed Steel: <strong>{estimate.inputs?.structuralSpecs?.rebarGrade || "500W Grade"}</strong>.</li>
                  <li>Foundation Type: <strong>{estimate.inputs?.foundationType}</strong>.</li>
                </ul>
              </div>

              <div className="bg-muted/20 border border-border rounded-xl p-4 space-y-2">
                <h4 className="font-bold text-foreground font-heading flex items-center gap-1.5">
                  <MessageSquare className="w-4 h-4 text-accent" /> Contact Engineer / Inquiries
                </h4>
                <p className="text-muted-foreground leading-relaxed">
                  Have questions regarding this estimate or want to schedule a site inspection? Reach out to our consultancy desk.
                </p>
                <div className="pt-1 flex flex-wrap gap-2">
                  <a
                    href={`https://wa.me/8801700000000?text=${whatsappMessage}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button size="sm" className="bg-[#25D366] hover:bg-[#20ba5a] text-white text-xs gap-1.5 font-bold h-8">
                      <MessageSquare className="w-3.5 h-3.5" /> WhatsApp Engineer
                    </Button>
                  </a>
                  <a href={`/api/estimate-portal/${token}/pdf`} target="_blank" rel="noopener noreferrer">
                    <Button size="sm" variant="outline" className="text-xs gap-1.5 font-bold h-8">
                      <Download className="w-3.5 h-3.5" /> Official PDF
                    </Button>
                  </a>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Accept Proposal Modal */}
      <Dialog open={acceptModalOpen} onOpenChange={setAcceptModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold font-heading flex items-center gap-2 text-emerald-600">
              <CheckCircle2 className="w-5 h-5" /> Accept Engineering Proposal
            </DialogTitle>
            <DialogDescription className="text-xs">
              Confirm your approval of the estimate for <strong>{estimate.projectName}</strong>. Total budget: <strong>৳{Math.round(estimate.financials?.grandTotalCost || 0).toLocaleString()}</strong>.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2 text-xs">
            <div className="bg-muted/40 p-3 rounded-lg border border-border space-y-1">
              <p className="font-semibold text-foreground">Terms of Acceptance:</p>
              <ul className="text-muted-foreground list-disc list-inside space-y-0.5">
                <li>Formal acceptance will alert HF Design &amp; Engineering team.</li>
                <li>Work order and stage-wise payment agreement will be drafted.</li>
                <li>Our lead engineer will contact you to schedule site kickoff.</li>
              </ul>
            </div>
            <div className="space-y-1">
              <label className="font-bold text-foreground">Additional Notes / Instructions (Optional):</label>
              <textarea
                placeholder="e.g. Please call me on Sunday to finalize site visit..."
                value={clientNotes}
                onChange={(e) => setClientNotes(e.target.value)}
                className="w-full min-h-[70px] border border-input rounded-md p-2 text-xs bg-background"
              />
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="ghost" size="sm" onClick={() => setAcceptModalOpen(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleAcceptProposal}
              disabled={isSubmitting}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs"
            >
              {isSubmitting ? "Confirming..." : "Confirm & Accept Proposal"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Request Revision Modal */}
      <Dialog open={revisionModalOpen} onOpenChange={setRevisionModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold font-heading flex items-center gap-2 text-amber-600">
              <Clock className="w-5 h-5" /> Request Estimate Revision
            </DialogTitle>
            <DialogDescription className="text-xs">
              Specify what adjustments or dimension changes you would like our engineers to incorporate.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2 text-xs">
            <div className="space-y-1">
              <label className="font-bold text-foreground">Requested Changes *</label>
              <textarea
                placeholder="e.g. We want to change the floor finishes from standard to homogeneous 24x24 tiles, and check if 5 stories is possible instead of 4..."
                value={clientNotes}
                onChange={(e) => setClientNotes(e.target.value)}
                className="w-full min-h-[100px] border border-input rounded-md p-2.5 text-xs bg-background leading-relaxed"
              />
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="ghost" size="sm" onClick={() => setRevisionModalOpen(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleRequestRevision}
              disabled={isSubmitting}
              className="bg-[#0B2A4A] text-white font-bold text-xs"
            >
              {isSubmitting ? "Submitting..." : "Submit Revision Request"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
