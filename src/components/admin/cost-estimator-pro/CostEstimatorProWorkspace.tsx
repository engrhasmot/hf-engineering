"use client";

import { useState, useEffect, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Calculator,
  Plus,
  FolderKanban,
  FileText,
  Hammer,
  Users,
  MapPin,
  Settings,
  Download,
  Upload,
  RefreshCw,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ArrowRight,
  ArrowLeft,
  Building2,
  Ruler,
  Layers,
  FileSpreadsheet,
  Trash2,
  Eye,
  Copy,
  Printer,
  Sparkles,
  ShieldCheck,
  HardDrive,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Percent,
  DollarSign,
  ChevronDown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { toast } from "sonner";

interface Props {
  initialTab?: string;
}

export default function CostEstimatorProWorkspace({ initialTab = "dashboard" }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentTab = searchParams.get("tab") || initialTab;

  const setTab = (tab: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", tab);
    router.push(`/admin/cost-estimator-pro?${params.toString()}`);
  };

  // --- GLOBAL STATE ---
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [estimates, setEstimates] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [materials, setMaterials] = useState<any[]>([]);
  const [labour, setLabour] = useState<any[]>([]);
  const [locations, setLocations] = useState<any[]>([]);
  const [files, setFiles] = useState<any[]>([]);
  const [settings, setSettings] = useState<any>(null);

  // Selected Estimate Modal
  const [selectedEstimate, setSelectedEstimate] = useState<any>(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);

  // --- FETCH DATA ---
  const fetchAll = async () => {
    setLoading(true);
    try {
      const [dashRes, estRes, prjRes, matRes, labRes, locRes, fileRes, setRes] = await Promise.all([
        fetch("/api/admin/cost-estimator-pro/dashboard"),
        fetch("/api/admin/cost-estimator-pro/estimates"),
        fetch("/api/admin/cost-estimator-pro/projects"),
        fetch("/api/admin/cost-estimator-pro/materials"),
        fetch("/api/admin/cost-estimator-pro/labour"),
        fetch("/api/admin/cost-estimator-pro/locations"),
        fetch("/api/admin/cost-estimator-pro/files"),
        fetch("/api/admin/cost-estimator-pro/settings"),
      ]);

      const [dash, est, prj, mat, lab, loc, fil, set] = await Promise.all([
        dashRes.json(),
        estRes.json(),
        prjRes.json(),
        matRes.json(),
        labRes.json(),
        locRes.json(),
        fileRes.json(),
        setRes.json(),
      ]);

      if (dash.success) setDashboardData(dash.data);
      if (est.success) setEstimates(est.data);
      if (prj.success) setProjects(prj.data);
      if (mat.success) setMaterials(mat.data);
      if (lab.success) setLabour(lab.data);
      if (loc.success) setLocations(loc.data);
      if (fil.success) setFiles(fil.data);
      if (set.success) setSettings(set.data);
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to load Cost Estimator Pro data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  // --- WIZARD FORM STATE ---
  const [wizardStep, setWizardStep] = useState(1);
  const [isCalculating, setIsCalculating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [calcPreview, setCalcPreview] = useState<any>(null);

  const [formProject, setFormProject] = useState({
    projectName: "",
    projectId: "",
    clientName: "",
    clientPhone: "",
    clientEmail: "",
    location: "Dhaka",
    buildingType: "Residential",
    notes: "",
  });

  const [formDimensions, setFormDimensions] = useState({
    floors: 4,
    groundFloorArea: 1500,
    typicalFloorArea: 1500,
    unitType: "sqft" as "sqft" | "sqm",
    floorHeightFt: 10,
  });

  const [formStructure, setFormStructure] = useState({
    foundationType: "Isolated Footing",
    concreteGrade: "C20 (2500 psi)",
    rebarGrade: "500W (72.5 Grade)",
    slabThicknessInch: 5,
    soilBearingCapacity: "Medium Clay / Silt",
  });

  const [formFinishing, setFormFinishing] = useState({
    floorFinish: "Homogeneous Tiles (24x24)",
    paintQuality: "Weather Coat & Plastic Emulsion",
    doorsAndWindows: "Standard Solid Wood & Thai Alum",
    electricalStandard: "BRB / BBS Cable + Modular",
    plumbingStandard: "Standard PVC + Sanitary",
  });

  const [formMargins, setFormMargins] = useState({
    wastagePct: 3.0,
    overheadPct: 5.0,
    contingencyPct: 3.0,
    profitPct: 10.0,
    vatTaxPct: 0,
    discountAmount: 0,
  });

  // Calculate live preview
  const handleCalculatePreview = async () => {
    setIsCalculating(true);
    try {
      const res = await fetch("/api/admin/cost-estimator-pro/estimates?action=calculate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          buildingType: formProject.buildingType,
          floors: formDimensions.floors,
          unitType: formDimensions.unitType,
          groundFloorArea: formDimensions.groundFloorArea,
          typicalFloorArea: formDimensions.typicalFloorArea,
          foundationType: formStructure.foundationType,
          structuralSpecs: formStructure,
          finishingSpecs: formFinishing,
          wastagePct: formMargins.wastagePct,
          overheadPct: formMargins.overheadPct,
          contingencyPct: formMargins.contingencyPct,
          profitPct: formMargins.profitPct,
          vatTaxPct: formMargins.vatTaxPct,
          discountAmount: formMargins.discountAmount,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setCalcPreview(data.calculation);
        setWizardStep(6); // jump to review
      } else {
        toast.error(data.error || "Calculation error");
      }
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsCalculating(false);
    }
  };

  // Save new estimate
  const handleSaveEstimate = async (status: "draft" | "issued" = "draft") => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/admin/cost-estimator-pro/estimates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectName: formProject.projectName || `${formProject.buildingType} Construction Estimate`,
          projectId: formProject.projectId,
          clientName: formProject.clientName || "Valued Client",
          clientPhone: formProject.clientPhone,
          clientEmail: formProject.clientEmail,
          location: formProject.location,
          buildingType: formProject.buildingType,
          floors: formDimensions.floors,
          unitType: formDimensions.unitType,
          groundFloorArea: formDimensions.groundFloorArea,
          typicalFloorArea: formDimensions.typicalFloorArea,
          floorHeightFt: formDimensions.floorHeightFt,
          foundationType: formStructure.foundationType,
          structuralSpecs: formStructure,
          finishingSpecs: formFinishing,
          wastagePct: formMargins.wastagePct,
          overheadPct: formMargins.overheadPct,
          contingencyPct: formMargins.contingencyPct,
          profitPct: formMargins.profitPct,
          vatTaxPct: formMargins.vatTaxPct,
          discountAmount: formMargins.discountAmount,
          notes: formProject.notes,
          status,
        }),
      });

      const data = await res.json();
      if (data.success) {
        toast.success(`Estimate ${data.data.estimateNumber} saved successfully!`);
        fetchAll();
        setTab("estimates");
        // Reset wizard
        setWizardStep(1);
        setCalcPreview(null);
      } else {
        toast.error(data.error || "Failed to save estimate");
      }
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  // View single estimate
  const handleViewEstimate = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/cost-estimator-pro/estimates/${id}`);
      const data = await res.json();
      if (data.success) {
        setSelectedEstimate(data.data);
        setViewModalOpen(true);
      }
    } catch (err: any) {
      toast.error("Failed to load estimate details");
    }
  };

  // Issue estimate (freeze baseline)
  const handleIssueEstimate = async (id: string) => {
    if (!confirm("Are you sure you want to officially ISSUE this estimate? Once issued, its baseline rates and calculations become immutable.")) {
      return;
    }
    try {
      const res = await fetch(`/api/admin/cost-estimator-pro/estimates/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "issue" }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Estimate successfully issued!");
        fetchAll();
        if (selectedEstimate) setSelectedEstimate(data.data);
      }
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  // Create new revision from existing
  const handleReviseEstimate = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/cost-estimator-pro/estimates/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "revise" }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(`New revision ${data.data.estimateNumber} created!`);
        fetchAll();
        setViewModalOpen(false);
      }
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner & Module Branding */}
      <div className="bg-[#0B2A4A] text-white p-6 rounded-2xl shadow-md border-b-4 border-[#F2A900] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge className="bg-[#F2A900] text-[#0B2A4A] font-black text-xs uppercase px-2.5 py-0.5">
              Admin Engineering Module
            </Badge>
            <span className="text-xs text-slate-300 font-mono">BNBC 2020 Compliant Engine</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight font-heading flex items-center gap-2">
            <Calculator className="w-7 h-7 text-[#F2A900]" /> Cost Estimator Pro &amp; BOQ Studio
          </h1>
          <p className="text-xs md:text-sm text-slate-200 mt-1">
            Professional civil &amp; architectural construction estimation, unit rate management, itemized BOQs, and PDF/Excel exports.
          </p>
        </div>

        <div className="flex flex-wrap gap-2.5">
          <Button
            onClick={() => setTab("new")}
            className="bg-[#F2A900] hover:bg-[#d89600] text-[#0B2A4A] font-black gap-2 text-xs shadow-md"
          >
            <Plus className="w-4 h-4" /> New Estimate Wizard
          </Button>
          <a href="/api/admin/cost-estimator-pro/backup" download>
            <Button variant="outline" size="sm" className="bg-white/10 hover:bg-white/20 text-white border-white/20 text-xs gap-1.5">
              <Download className="w-3.5 h-3.5" /> Backup DB
            </Button>
          </a>
          <Button
            variant="ghost"
            size="sm"
            onClick={fetchAll}
            className="text-white hover:bg-white/10 text-xs gap-1.5"
            title="Refresh Data"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} /> Refresh
          </Button>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-border scrollbar-thin">
        {[
          { id: "dashboard", label: "Dashboard", icon: TrendingUp },
          { id: "new", label: "Create Estimate", icon: Plus },
          { id: "estimates", label: "Estimates List", icon: FileText, count: estimates.length },
          { id: "projects", label: "Projects", icon: FolderKanban, count: projects.length },
          { id: "materials", label: "Material Rates", icon: Hammer, count: materials.length },
          { id: "labour", label: "Labour Rates", icon: Users, count: labour.length },
          { id: "locations", label: "Regional Rates", icon: MapPin },
          { id: "files", label: "Files & Reports", icon: HardDrive, count: files.length },
          { id: "backup", label: "Backup & Restore", icon: Download },
          { id: "settings", label: "Engine Settings", icon: Settings },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setTab(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                isActive
                  ? "bg-[#0B2A4A] text-white shadow-xs"
                  : "bg-card hover:bg-muted text-muted-foreground hover:text-foreground border border-border/80"
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? "text-[#F2A900]" : ""}`} />
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${isActive ? "bg-white/20 text-white" : "bg-muted text-muted-foreground"}`}>
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* 1. DASHBOARD TAB */}
      {/* ========================================================================= */}
      {currentTab === "dashboard" && (
        <div className="space-y-6">
          {/* Metric Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
            <Card className="border-border shadow-xs bg-card">
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Total Projects</p>
                  <h3 className="text-2xl font-black text-foreground mt-0.5">{dashboardData?.summary?.totalProjects ?? projects.length}</h3>
                </div>
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center font-bold">
                  <FolderKanban className="w-5 h-5" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-border shadow-xs bg-card">
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Total Estimates</p>
                  <h3 className="text-2xl font-black text-foreground mt-0.5">{dashboardData?.summary?.totalEstimates ?? estimates.length}</h3>
                </div>
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold">
                  <FileText className="w-5 h-5" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-border shadow-xs bg-card">
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Active Materials</p>
                  <h3 className="text-2xl font-black text-foreground mt-0.5">{dashboardData?.summary?.activeMaterials ?? materials.length}</h3>
                </div>
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold">
                  <Hammer className="w-5 h-5" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-border shadow-xs bg-card">
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Active Labour Trades</p>
                  <h3 className="text-2xl font-black text-foreground mt-0.5">{dashboardData?.summary?.activeLabour ?? labour.length}</h3>
                </div>
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center font-bold">
                  <Users className="w-5 h-5" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Benchmark Ticker */}
          <div className="bg-card p-3 rounded-xl border border-border flex items-center justify-between overflow-x-auto gap-4 text-xs">
            <span className="font-bold text-[#0B2A4A] dark:text-amber-400 flex items-center gap-1 shrink-0">
              <TrendingUp className="w-4 h-4 text-[#F2A900]" /> Live Benchmark Rates:
            </span>
            <div className="flex items-center gap-5 text-muted-foreground font-medium shrink-0">
              <span>Cement (PCC): <strong className="text-foreground">৳535/bag</strong></span>
              <span>Rebar (500W): <strong className="text-foreground">৳96,000/ton</strong></span>
              <span>Sylhet Sand: <strong className="text-foreground">৳65/cft</strong></span>
              <span>Auto Bricks: <strong className="text-foreground">৳14.5/pc</strong></span>
              <span>Stone Chips: <strong className="text-foreground">৳215/cft</strong></span>
              <span>Head Mason: <strong className="text-foreground">৳1,100/day</strong></span>
            </div>
            <Button size="sm" variant="ghost" onClick={() => setTab("materials")} className="text-xs font-bold text-accent shrink-0">
              Manage Rates →
            </Button>
          </div>

          {/* Recent Estimates Table */}
          <Card className="border-border shadow-xs bg-card">
            <CardHeader className="p-5 border-b border-border flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold font-heading">Recent Estimates</CardTitle>
                <CardDescription className="text-xs">Latest calculated and issued estimates</CardDescription>
              </div>
              <Button size="sm" variant="outline" onClick={() => setTab("estimates")} className="text-xs font-bold">
                View All ({estimates.length})
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              {estimates.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground text-xs space-y-2">
                  <FileText className="w-8 h-8 mx-auto opacity-40" />
                  <p>No estimates recorded yet.</p>
                  <Button size="sm" onClick={() => setTab("new")} className="bg-[#0B2A4A] text-white text-xs">
                    Create First Estimate
                  </Button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-muted/40 text-muted-foreground border-b border-border uppercase font-bold text-[10px]">
                      <tr>
                        <th className="p-3.5">Ref No</th>
                        <th className="p-3.5">Project &amp; Client</th>
                        <th className="p-3.5">Location</th>
                        <th className="p-3.5">Built-up Area</th>
                        <th className="p-3.5">Grand Total (BDT)</th>
                        <th className="p-3.5">Rate / Sqft</th>
                        <th className="p-3.5">Status</th>
                        <th className="p-3.5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {estimates.slice(0, 5).map((est) => (
                        <tr key={est._id} className="hover:bg-muted/20 transition-colors">
                          <td className="p-3.5 font-mono font-bold text-accent">
                            {est.estimateNumber}
                            {est.revision > 1 && <span className="ml-1 text-[10px] text-muted-foreground">(Rev-{est.revision})</span>}
                          </td>
                          <td className="p-3.5">
                            <p className="font-bold text-foreground">{est.projectName}</p>
                            <p className="text-[11px] text-muted-foreground">{est.clientName}</p>
                          </td>
                          <td className="p-3.5 text-muted-foreground">{est.location}</td>
                          <td className="p-3.5 font-mono">
                            {est.inputsSnapshot?.totalBuiltUpArea?.toLocaleString() || "-"} sft
                          </td>
                          <td className="p-3.5 font-mono font-bold text-foreground">
                            ৳ {est.financials?.grandTotalCost?.toLocaleString() || "0"}
                          </td>
                          <td className="p-3.5 font-mono text-muted-foreground">
                            ৳ {est.financials?.costPerSqFt || "-"}
                          </td>
                          <td className="p-3.5">
                            <Badge
                              className={`text-[10px] font-bold ${
                                est.status === "issued"
                                  ? "bg-emerald-500/10 text-emerald-700 border-emerald-500/20"
                                  : "bg-amber-500/10 text-amber-700 border-amber-500/20"
                              }`}
                            >
                              {est.status?.toUpperCase()}
                            </Badge>
                          </td>
                          <td className="p-3.5 text-right space-x-1.5">
                            <Button size="sm" variant="ghost" onClick={() => handleViewEstimate(est._id)} className="h-7 text-xs">
                              <Eye className="w-3.5 h-3.5" />
                            </Button>
                            <a href={`/api/admin/cost-estimator-pro/export?format=pdf&estimateId=${est._id}`} download>
                              <Button size="sm" variant="outline" className="h-7 text-[11px] px-2 font-bold text-rose-600 gap-1">
                                PDF
                              </Button>
                            </a>
                            <a href={`/api/admin/cost-estimator-pro/export?format=excel&estimateId=${est._id}`} download>
                              <Button size="sm" variant="outline" className="h-7 text-[11px] px-2 font-bold text-emerald-600 gap-1">
                                XLS
                              </Button>
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. NEW ESTIMATE WIZARD TAB */}
      {/* ========================================================================= */}
      {currentTab === "new" && (
        <div className="space-y-6 max-w-4xl mx-auto">
          {/* Stepper Header */}
          <div className="bg-card p-4 rounded-2xl border border-border shadow-xs flex items-center justify-between text-xs">
            {[
              { num: 1, label: "Project Info" },
              { num: 2, label: "Dimensions" },
              { num: 3, label: "Structure" },
              { num: 4, label: "Finishing" },
              { num: 5, label: "Cost Settings" },
              { num: 6, label: "Review & BOQ" },
            ].map((step) => (
              <button
                key={step.num}
                onClick={() => setWizardStep(step.num)}
                className={`flex items-center gap-2 font-bold transition-colors ${
                  wizardStep === step.num
                    ? "text-[#0B2A4A] dark:text-[#F2A900]"
                    : wizardStep > step.num
                    ? "text-emerald-600"
                    : "text-muted-foreground opacity-60"
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                    wizardStep === step.num
                      ? "bg-[#0B2A4A] text-white"
                      : wizardStep > step.num
                      ? "bg-emerald-600 text-white"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {wizardStep > step.num ? <CheckCircle2 className="w-4 h-4" /> : step.num}
                </div>
                <span className="hidden sm:inline">{step.label}</span>
              </button>
            ))}
          </div>

          {/* STEP 1: Project Information */}
          {wizardStep === 1 && (
            <Card className="border-border shadow-md bg-card">
              <CardHeader className="border-b pb-4">
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-accent" /> Step 1: Project &amp; Client Details
                </CardTitle>
                <CardDescription className="text-xs">Specify the basic project parameters and ownership details.</CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold">Project Name *</Label>
                    <Input
                      placeholder="e.g. Modern Duplex Residence or 6-Storied Apartment"
                      value={formProject.projectName}
                      onChange={(e) => setFormProject({ ...formProject, projectName: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold">Building Classification *</Label>
                    <select
                      value={formProject.buildingType}
                      onChange={(e) => setFormProject({ ...formProject, buildingType: e.target.value })}
                      className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm"
                    >
                      <option value="Residential">Residential Building</option>
                      <option value="Commercial">Commercial / Market</option>
                      <option value="Industrial">Industrial Shed / Factory</option>
                      <option value="Mixed-use">Mixed-Use Commercial &amp; Residential</option>
                      <option value="Duplex Home">Luxury Duplex / Triplex Villa</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold">Client Name *</Label>
                    <Input
                      placeholder="e.g. Alhaj Md. Rafiqul Islam"
                      value={formProject.clientName}
                      onChange={(e) => setFormProject({ ...formProject, clientName: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold">Phone Number</Label>
                    <Input
                      placeholder="017XXXXXXXX"
                      value={formProject.clientPhone}
                      onChange={(e) => setFormProject({ ...formProject, clientPhone: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold">Project Location</Label>
                    <Input
                      placeholder="e.g. Savar, Dhaka"
                      value={formProject.location}
                      onChange={(e) => setFormProject({ ...formProject, location: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-bold">Link to Existing Project (Optional)</Label>
                  <select
                    value={formProject.projectId}
                    onChange={(e) => setFormProject({ ...formProject, projectId: e.target.value })}
                    className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm"
                  >
                    <option value="">-- Standalone Estimate (No linked project) --</option>
                    {projects.map((p) => (
                      <option key={p.projectId} value={p.projectId}>
                        {p.projectId} — {p.name} ({p.clientName})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex justify-end pt-4">
                  <Button onClick={() => setWizardStep(2)} className="bg-[#0B2A4A] text-white font-bold gap-2">
                    Next: Dimensions <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* STEP 2: Dimensions */}
          {wizardStep === 2 && (
            <Card className="border-border shadow-md bg-card">
              <CardHeader className="border-b pb-4">
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                  <Ruler className="w-5 h-5 text-accent" /> Step 2: Building Dimensions &amp; Floors
                </CardTitle>
                <CardDescription className="text-xs">Configure floor count, floor areas, and vertical height.</CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold">Number of Floors (Stories) *</Label>
                    <Input
                      type="number"
                      min={1}
                      max={30}
                      value={formDimensions.floors}
                      onChange={(e) => setFormDimensions({ ...formDimensions, floors: Number(e.target.value) })}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold">Ground Floor Built-up Area (Sq.Ft) *</Label>
                    <Input
                      type="number"
                      value={formDimensions.groundFloorArea}
                      onChange={(e) => setFormDimensions({ ...formDimensions, groundFloorArea: Number(e.target.value) })}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold">Typical Floor Area (Sq.Ft) *</Label>
                    <Input
                      type="number"
                      value={formDimensions.typicalFloorArea}
                      onChange={(e) => setFormDimensions({ ...formDimensions, typicalFloorArea: Number(e.target.value) })}
                    />
                  </div>
                </div>

                {/* Live total calculated area banner */}
                <div className="p-4 bg-muted/40 rounded-xl border border-border flex items-center justify-between">
                  <div>
                    <span className="text-xs text-muted-foreground uppercase font-bold">Calculated Built-Up Area</span>
                    <h4 className="text-xl font-mono font-bold text-foreground">
                      {(formDimensions.groundFloorArea + (formDimensions.floors - 1) * formDimensions.typicalFloorArea).toLocaleString()} Sq.Ft
                    </h4>
                  </div>
                  <Badge variant="outline" className="font-mono text-xs">
                    ~{Math.round((formDimensions.groundFloorArea + (formDimensions.floors - 1) * formDimensions.typicalFloorArea) / 10.7639).toLocaleString()} Sq.M
                  </Badge>
                </div>

                <div className="flex justify-between pt-4">
                  <Button variant="outline" onClick={() => setWizardStep(1)}>
                    <ArrowLeft className="w-4 h-4 mr-1" /> Back
                  </Button>
                  <Button onClick={() => setWizardStep(3)} className="bg-[#0B2A4A] text-white font-bold gap-2">
                    Next: Structure <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* STEP 3: Structure */}
          {wizardStep === 3 && (
            <Card className="border-border shadow-md bg-card">
              <CardHeader className="border-b pb-4">
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                  <Layers className="w-5 h-5 text-accent" /> Step 3: Foundation &amp; Structural Specs
                </CardTitle>
                <CardDescription className="text-xs">Select foundation type, concrete grade, and rebar specifications.</CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold">Foundation Substructure *</Label>
                    <select
                      value={formStructure.foundationType}
                      onChange={(e) => setFormStructure({ ...formStructure, foundationType: e.target.value })}
                      className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm"
                    >
                      <option value="Isolated Footing">Isolated Footing (Individual Column Base)</option>
                      <option value="Combined Footing">Combined / Strip Footing</option>
                      <option value="Raft / Mat">Raft / Mat Foundation</option>
                      <option value="Deep Pile Foundation">Deep Cast-in-situ Pile Foundation</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold">Concrete Mix Grade</Label>
                    <select
                      value={formStructure.concreteGrade}
                      onChange={(e) => setFormStructure({ ...formStructure, concreteGrade: e.target.value })}
                      className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm"
                    >
                      <option value="C20 (2500 psi)">C20 / 2500 PSI (1:1.5:3 with stone chips)</option>
                      <option value="C25 (3000 psi)">C25 / 3000 PSI (High strength)</option>
                      <option value="C30 (4000 psi)">C30 / 4000 PSI (Ready-mix commercial)</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold">Reinforcement Steel Grade</Label>
                    <select
                      value={formStructure.rebarGrade}
                      onChange={(e) => setFormStructure({ ...formStructure, rebarGrade: e.target.value })}
                      className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm"
                    >
                      <option value="500W (72.5 Grade)">500W / 72.5 Grade (BSRM / AKS / GPH)</option>
                      <option value="400W (60 Grade)">400W / 60 Grade</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold">RCC Slab Thickness (Inches)</Label>
                    <Input
                      type="number"
                      value={formStructure.slabThicknessInch}
                      onChange={(e) => setFormStructure({ ...formStructure, slabThicknessInch: Number(e.target.value) })}
                    />
                  </div>
                </div>

                <div className="flex justify-between pt-4">
                  <Button variant="outline" onClick={() => setWizardStep(2)}>
                    <ArrowLeft className="w-4 h-4 mr-1" /> Back
                  </Button>
                  <Button onClick={() => setWizardStep(4)} className="bg-[#0B2A4A] text-white font-bold gap-2">
                    Next: Finishes <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* STEP 4: Finishing */}
          {wizardStep === 4 && (
            <Card className="border-border shadow-md bg-card">
              <CardHeader className="border-b pb-4">
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                  <Hammer className="w-5 h-5 text-accent" /> Step 4: Architectural &amp; MEP Finishing
                </CardTitle>
                <CardDescription className="text-xs">Configure interior tiles, paint, electrical, and plumbing standards.</CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold">Flooring Tiles Quality</Label>
                    <select
                      value={formFinishing.floorFinish}
                      onChange={(e) => setFormFinishing({ ...formFinishing, floorFinish: e.target.value })}
                      className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm"
                    >
                      <option value="Homogeneous Tiles (24x24)">Homogeneous Glazed Tiles (24&quot;×24&quot; - DBL/Akij)</option>
                      <option value="Standard Ceramic (16x16)">Standard Ceramic Tiles (16&quot;×16&quot;)</option>
                      <option value="Imported Mirror Polish (32x32)">Imported Mirror Polish Vitrified Tiles (32&quot;×32&quot;)</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold">Paint &amp; Exterior Finishes</Label>
                    <select
                      value={formFinishing.paintQuality}
                      onChange={(e) => setFormFinishing({ ...formFinishing, paintQuality: e.target.value })}
                      className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm"
                    >
                      <option value="Weather Coat & Plastic Emulsion">Weather Coat Exterior + Smooth Plastic Emulsion</option>
                      <option value="Luxury Silk / Illusions">Luxury Silk / Berger BreathEasy / WeatherCoat Supreme</option>
                      <option value="Distemper Standard">Standard Distemper &amp; Lime Wash</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold">Electrical Wiring &amp; Conduit</Label>
                    <select
                      value={formFinishing.electricalStandard}
                      onChange={(e) => setFormFinishing({ ...formFinishing, electricalStandard: e.target.value })}
                      className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm"
                    >
                      <option value="BRB / BBS Cable + Modular">BRB / BBS FR Copper Cable + SuperStar Modular Switches</option>
                      <option value="Premium Schneider / Panasonic">Premium Schneider / Panasonic Modular Accessories</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold">Plumbing &amp; Sanitary Fixtures</Label>
                    <select
                      value={formFinishing.plumbingStandard}
                      onChange={(e) => setFormFinishing({ ...formFinishing, plumbingStandard: e.target.value })}
                      className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm"
                    >
                      <option value="Standard PVC + Sanitary">RFL / Gazi PVC Pipe + Stella/Charu Sanitary Ware</option>
                      <option value="Premium Cotta / Haier">Haier CPVC Hot/Cold Lines + Cotta Luxury Sanitary</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-between pt-4">
                  <Button variant="outline" onClick={() => setWizardStep(3)}>
                    <ArrowLeft className="w-4 h-4 mr-1" /> Back
                  </Button>
                  <Button onClick={() => setWizardStep(5)} className="bg-[#0B2A4A] text-white font-bold gap-2">
                    Next: Cost Settings <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* STEP 5: Cost Margins */}
          {wizardStep === 5 && (
            <Card className="border-border shadow-md bg-card">
              <CardHeader className="border-b pb-4">
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                  <Percent className="w-5 h-5 text-accent" /> Step 5: Financial Margins &amp; Contingencies
                </CardTitle>
                <CardDescription className="text-xs">Configure site wastage, overhead, contractor profit, and taxes.</CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold">Material Wastage (%)</Label>
                    <Input
                      type="number"
                      step="0.5"
                      value={formMargins.wastagePct}
                      onChange={(e) => setFormMargins({ ...formMargins, wastagePct: Number(e.target.value) })}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold">Overhead &amp; Site Mgmt (%)</Label>
                    <Input
                      type="number"
                      step="0.5"
                      value={formMargins.overheadPct}
                      onChange={(e) => setFormMargins({ ...formMargins, overheadPct: Number(e.target.value) })}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold">Contingency (%)</Label>
                    <Input
                      type="number"
                      step="0.5"
                      value={formMargins.contingencyPct}
                      onChange={(e) => setFormMargins({ ...formMargins, contingencyPct: Number(e.target.value) })}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold">Contractor Profit (%)</Label>
                    <Input
                      type="number"
                      step="0.5"
                      value={formMargins.profitPct}
                      onChange={(e) => setFormMargins({ ...formMargins, profitPct: Number(e.target.value) })}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold">VAT / Tax (%)</Label>
                    <Input
                      type="number"
                      step="0.5"
                      value={formMargins.vatTaxPct}
                      onChange={(e) => setFormMargins({ ...formMargins, vatTaxPct: Number(e.target.value) })}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold">Special Discount (BDT)</Label>
                    <Input
                      type="number"
                      value={formMargins.discountAmount}
                      onChange={(e) => setFormMargins({ ...formMargins, discountAmount: Number(e.target.value) })}
                    />
                  </div>
                </div>

                <div className="flex justify-between pt-4">
                  <Button variant="outline" onClick={() => setWizardStep(4)}>
                    <ArrowLeft className="w-4 h-4 mr-1" /> Back
                  </Button>
                  <Button
                    onClick={handleCalculatePreview}
                    disabled={isCalculating}
                    className="bg-[#0B2A4A] text-white font-bold gap-2 shadow-md"
                  >
                    <Sparkles className="w-4 h-4 text-[#F2A900]" />
                    {isCalculating ? "Calculating Engine..." : "Run Calculation Engine →"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* STEP 6: Review, BOQ & Save */}
          {wizardStep === 6 && calcPreview && (
            <div className="space-y-6">
              {/* Grand Total Hero Box */}
              <div className="bg-[#0B2A4A] text-white p-6 rounded-2xl shadow-xl border-l-8 border-[#F2A900] flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                  <span className="text-xs text-[#F2A900] font-bold uppercase tracking-wider">
                    Calculated Construction Grand Total
                  </span>
                  <h2 className="text-3xl sm:text-4xl font-black mt-1">
                    ৳ {calcPreview.grandTotalCost?.toLocaleString("en-BD")}
                  </h2>
                  <p className="text-xs text-slate-300 mt-1">
                    Total Built-up Area: <strong>{calcPreview.totalBuiltUpArea.toLocaleString()} Sq.Ft</strong> | Unit Rate:{" "}
                    <strong>৳ {calcPreview.costPerSqFt.toLocaleString()} / Sq.Ft</strong>
                  </p>
                </div>

                <div className="flex flex-wrap gap-2.5">
                  <Button
                    onClick={() => handleSaveEstimate("draft")}
                    disabled={isSaving}
                    variant="outline"
                    className="bg-white/10 hover:bg-white/20 text-white border-white/20 text-xs font-bold"
                  >
                    Save as Draft
                  </Button>
                  <Button
                    onClick={() => handleSaveEstimate("issued")}
                    disabled={isSaving}
                    className="bg-[#F2A900] hover:bg-[#d89600] text-[#0B2A4A] font-black text-xs gap-1.5 shadow-md"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Save &amp; Issue Baseline
                  </Button>
                </div>
              </div>

              {/* Material & Labour Breakdown */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 bg-card rounded-xl border border-border">
                  <span className="text-[10px] text-muted-foreground uppercase font-bold">Materials Total</span>
                  <p className="text-base font-bold font-mono text-foreground mt-0.5">৳ {calcPreview.materialCostTotal.toLocaleString()}</p>
                </div>
                <div className="p-3.5 bg-card rounded-xl border border-border">
                  <span className="text-[10px] text-muted-foreground uppercase font-bold">Labour Total</span>
                  <p className="text-base font-bold font-mono text-foreground mt-0.5">৳ {calcPreview.labourCostTotal.toLocaleString()}</p>
                </div>
                <div className="p-3.5 bg-card rounded-xl border border-border">
                  <span className="text-[10px] text-muted-foreground uppercase font-bold">Cement &amp; Rebar</span>
                  <p className="text-xs font-mono text-foreground mt-0.5">{calcPreview.keyQuantities.cementBags} bags · {calcPreview.keyQuantities.rebarTons} tons</p>
                </div>
                <div className="p-3.5 bg-card rounded-xl border border-border">
                  <span className="text-[10px] text-muted-foreground uppercase font-bold">Bricks &amp; Sand</span>
                  <p className="text-xs font-mono text-foreground mt-0.5">{calcPreview.keyQuantities.bricksCount.toLocaleString()} pcs · {calcPreview.keyQuantities.sandCft.toLocaleString()} cft</p>
                </div>
              </div>

              {/* Detailed Itemized BOQ Table */}
              <Card className="border-border shadow-md bg-card">
                <CardHeader className="p-4 border-b">
                  <CardTitle className="text-sm font-bold font-heading">Itemized Bill of Quantities (BOQ Preview)</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="overflow-x-auto max-h-[420px] scrollbar-thin">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-muted/50 sticky top-0 uppercase font-bold text-[10px] text-muted-foreground border-b">
                        <tr>
                          <th className="p-3">Code</th>
                          <th className="p-3">Description</th>
                          <th className="p-3">Category</th>
                          <th className="p-3">Unit</th>
                          <th className="p-3">Qty</th>
                          <th className="p-3">Rate</th>
                          <th className="p-3 text-right">Amount (BDT)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {calcPreview.boqItems.map((item: any, idx: number) => (
                          <tr key={idx} className="hover:bg-muted/10">
                            <td className="p-3 font-mono font-bold text-accent">{item.itemCode}</td>
                            <td className="p-3 font-medium text-foreground max-w-xs">{item.description}</td>
                            <td className="p-3 text-muted-foreground">{item.category}</td>
                            <td className="p-3">{item.unit}</td>
                            <td className="p-3 font-mono">{item.quantity.toLocaleString()}</td>
                            <td className="p-3 font-mono">৳{item.unitRate.toLocaleString()}</td>
                            <td className="p-3 font-mono font-bold text-right text-foreground">৳{item.amount.toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setWizardStep(5)}>
                  <ArrowLeft className="w-4 h-4 mr-1" /> Back to Settings
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. ESTIMATES LIST TAB */}
      {/* ========================================================================= */}
      {currentTab === "estimates" && (
        <Card className="border-border shadow-xs bg-card">
          <CardHeader className="p-5 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <CardTitle className="text-base font-bold font-heading">Saved Estimates &amp; Revisions</CardTitle>
              <CardDescription className="text-xs">View, issue, export PDF/Excel, and manage revisions.</CardDescription>
            </div>
            <Button size="sm" onClick={() => setTab("new")} className="bg-[#0B2A4A] text-white text-xs font-bold gap-1.5">
              <Plus className="w-4 h-4" /> New Estimate
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            {estimates.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground text-xs space-y-2">
                <FileText className="w-10 h-10 mx-auto opacity-30" />
                <p>No saved estimates yet.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-muted/40 uppercase font-bold text-[10px] text-muted-foreground border-b border-border">
                    <tr>
                      <th className="p-3.5">Estimate ID</th>
                      <th className="p-3.5">Project Name</th>
                      <th className="p-3.5">Client</th>
                      <th className="p-3.5">Built-up Area</th>
                      <th className="p-3.5">Grand Total (BDT)</th>
                      <th className="p-3.5">Rate / Sqft</th>
                      <th className="p-3.5">Revision</th>
                      <th className="p-3.5">Status</th>
                      <th className="p-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {estimates.map((est) => (
                      <tr key={est._id} className="hover:bg-muted/20 transition-colors">
                        <td className="p-3.5 font-mono font-bold text-accent">{est.estimateNumber}</td>
                        <td className="p-3.5 font-bold text-foreground">{est.projectName}</td>
                        <td className="p-3.5 text-muted-foreground">{est.clientName}</td>
                        <td className="p-3.5 font-mono">{est.inputsSnapshot?.totalBuiltUpArea?.toLocaleString() || "-"} sft</td>
                        <td className="p-3.5 font-mono font-bold text-foreground">৳{est.financials?.grandTotalCost?.toLocaleString() || "0"}</td>
                        <td className="p-3.5 font-mono text-muted-foreground">৳{est.financials?.costPerSqFt || "-"}</td>
                        <td className="p-3.5 font-bold">Rev-{est.revision}</td>
                        <td className="p-3.5">
                          <Badge
                            className={`text-[10px] font-bold ${
                              est.status === "issued"
                                ? "bg-emerald-500/10 text-emerald-700 border-emerald-500/20"
                                : "bg-amber-500/10 text-amber-700 border-amber-500/20"
                            }`}
                          >
                            {est.status?.toUpperCase()}
                          </Badge>
                        </td>
                        <td className="p-3.5 text-right space-x-1.5">
                          <Button size="sm" variant="ghost" onClick={() => handleViewEstimate(est._id)} className="h-7 text-xs">
                            <Eye className="w-3.5 h-3.5" />
                          </Button>
                          <a href={`/api/admin/cost-estimator-pro/export?format=pdf&estimateId=${est._id}`} download>
                            <Button size="sm" variant="outline" className="h-7 text-[11px] px-2 font-bold text-rose-600 gap-1">
                              PDF
                            </Button>
                          </a>
                          <a href={`/api/admin/cost-estimator-pro/export?format=excel&estimateId=${est._id}`} download>
                            <Button size="sm" variant="outline" className="h-7 text-[11px] px-2 font-bold text-emerald-600 gap-1">
                              XLS
                            </Button>
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* ========================================================================= */}
      {/* 4. MATERIAL RATES TAB */}
      {/* ========================================================================= */}
      {currentTab === "materials" && (
        <Card className="border-border shadow-xs bg-card">
          <CardHeader className="p-5 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <CardTitle className="text-base font-bold font-heading">Material Benchmark Rates</CardTitle>
              <CardDescription className="text-xs">Live editable procurement rates in Bangladesh (BDT).</CardDescription>
            </div>
            <Badge variant="outline" className="text-xs">
              {materials.length} Materials Recorded
            </Badge>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-muted/40 uppercase font-bold text-[10px] text-muted-foreground border-b border-border">
                  <tr>
                    <th className="p-3.5">Code</th>
                    <th className="p-3.5">Material Name</th>
                    <th className="p-3.5">Category</th>
                    <th className="p-3.5">Unit</th>
                    <th className="p-3.5">Unit Rate (BDT)</th>
                    <th className="p-3.5">Location</th>
                    <th className="p-3.5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {materials.map((m) => (
                    <tr key={m._id} className="hover:bg-muted/20">
                      <td className="p-3.5 font-mono font-bold text-accent">{m.code}</td>
                      <td className="p-3.5 font-bold text-foreground">{m.name}</td>
                      <td className="p-3.5 text-muted-foreground">{m.category}</td>
                      <td className="p-3.5 font-mono">{m.unit}</td>
                      <td className="p-3.5 font-mono font-bold text-foreground">৳ {m.unitPrice.toLocaleString()}</td>
                      <td className="p-3.5 text-muted-foreground">{m.location}</td>
                      <td className="p-3.5">
                        <Badge variant="outline" className="text-[10px] bg-emerald-500/10 text-emerald-600 border-emerald-500/20">
                          Active
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ========================================================================= */}
      {/* 5. LABOUR RATES TAB */}
      {/* ========================================================================= */}
      {currentTab === "labour" && (
        <Card className="border-border shadow-xs bg-card">
          <CardHeader className="p-5 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <CardTitle className="text-base font-bold font-heading">Labour Rates by Trade</CardTitle>
              <CardDescription className="text-xs">Daily and unit labour charges across Bangladesh construction trades.</CardDescription>
            </div>
            <Badge variant="outline" className="text-xs">
              {labour.length} Trades Recorded
            </Badge>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-muted/40 uppercase font-bold text-[10px] text-muted-foreground border-b border-border">
                  <tr>
                    <th className="p-3.5">Code</th>
                    <th className="p-3.5">Trade Designation</th>
                    <th className="p-3.5">Category</th>
                    <th className="p-3.5">Unit</th>
                    <th className="p-3.5">Rate (BDT)</th>
                    <th className="p-3.5">Location</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {labour.map((l) => (
                    <tr key={l._id} className="hover:bg-muted/20">
                      <td className="p-3.5 font-mono font-bold text-accent">{l.code}</td>
                      <td className="p-3.5 font-bold text-foreground">{l.tradeName}</td>
                      <td className="p-3.5 text-muted-foreground">{l.category}</td>
                      <td className="p-3.5 font-mono">{l.unit}</td>
                      <td className="p-3.5 font-mono font-bold text-foreground">৳ {l.rate.toLocaleString()}</td>
                      <td className="p-3.5 text-muted-foreground">{l.location}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ========================================================================= */}
      {/* 6. REGIONAL RATES TAB */}
      {/* ========================================================================= */}
      {currentTab === "locations" && (
        <Card className="border-border shadow-xs bg-card">
          <CardHeader className="p-5 border-b border-border">
            <CardTitle className="text-base font-bold font-heading">Regional Rate Zones &amp; Multipliers</CardTitle>
            <CardDescription className="text-xs">Adjust construction cost baseline by location across Bangladesh.</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-muted/40 uppercase font-bold text-[10px] text-muted-foreground border-b border-border">
                  <tr>
                    <th className="p-3.5">Zone Code</th>
                    <th className="p-3.5">Location Name</th>
                    <th className="p-3.5">Division / Region</th>
                    <th className="p-3.5">Cost Multiplier</th>
                    <th className="p-3.5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {locations.map((loc) => (
                    <tr key={loc._id} className="hover:bg-muted/20">
                      <td className="p-3.5 font-mono font-bold text-accent">{loc.code}</td>
                      <td className="p-3.5 font-bold text-foreground">{loc.name}</td>
                      <td className="p-3.5 text-muted-foreground">{loc.parentRegion}</td>
                      <td className="p-3.5 font-mono font-bold">{loc.costMultiplier}x</td>
                      <td className="p-3.5">
                        <Badge variant="outline" className="text-[10px] bg-emerald-500/10 text-emerald-600 border-emerald-500/20">
                          Active
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ========================================================================= */}
      {/* 7. FILES & REPORTS TAB */}
      {/* ========================================================================= */}
      {currentTab === "files" && (
        <Card className="border-border shadow-xs bg-card">
          <CardHeader className="p-5 border-b border-border">
            <CardTitle className="text-base font-bold font-heading">Generated Reports &amp; Files Archive</CardTitle>
            <CardDescription className="text-xs">Private PDF reports, Excel spreadsheets, and backup archives.</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {files.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground text-xs space-y-2">
                <HardDrive className="w-10 h-10 mx-auto opacity-30" />
                <p>No generated files yet. Generate a PDF or Excel from any estimate.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-muted/40 uppercase font-bold text-[10px] text-muted-foreground border-b border-border">
                    <tr>
                      <th className="p-3.5">File ID</th>
                      <th className="p-3.5">Filename</th>
                      <th className="p-3.5">Type</th>
                      <th className="p-3.5">Estimate Ref</th>
                      <th className="p-3.5">Size</th>
                      <th className="p-3.5">Date</th>
                      <th className="p-3.5 text-right">Download</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {files.map((f) => (
                      <tr key={f._id} className="hover:bg-muted/20">
                        <td className="p-3.5 font-mono font-bold text-accent">{f.fileId}</td>
                        <td className="p-3.5 font-bold text-foreground">{f.filename}</td>
                        <td className="p-3.5">
                          <Badge variant="outline" className="text-[10px] uppercase font-mono">
                            {f.fileType}
                          </Badge>
                        </td>
                        <td className="p-3.5 font-mono">{f.estimateNumber || "-"}</td>
                        <td className="p-3.5 font-mono text-muted-foreground">{Math.round(f.sizeBytes / 1024)} KB</td>
                        <td className="p-3.5 text-muted-foreground">{new Date(f.createdAt).toLocaleDateString()}</td>
                        <td className="p-3.5 text-right">
                          <a href={`/api/admin/cost-estimator-pro/files?id=${f.fileId}`} download>
                            <Button size="sm" variant="outline" className="h-7 text-xs gap-1 font-bold">
                              <Download className="w-3.5 h-3.5" /> Download
                            </Button>
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* ========================================================================= */}
      {/* 8. BACKUP & RESTORE TAB */}
      {/* ========================================================================= */}
      {currentTab === "backup" && (
        <div className="space-y-6 max-w-2xl mx-auto">
          <Card className="border-border shadow-md bg-card">
            <CardHeader className="border-b pb-4">
              <CardTitle className="text-base font-bold flex items-center gap-2 font-heading">
                <Download className="w-5 h-5 text-accent" /> Cost Estimator Pro — Database Backup
              </CardTitle>
              <CardDescription className="text-xs">
                Export an independent snapshot of all settings, benchmark material/labour rates, BOQ templates, projects, and estimates.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <p className="text-xs text-muted-foreground leading-relaxed">
                This backup package is completely isolated from other admin databases. It contains all active cost calculations, formula templates, and immutable estimate revisions.
              </p>
              <a href="/api/admin/cost-estimator-pro/backup" download className="inline-block">
                <Button className="bg-[#0B2A4A] text-white font-bold gap-2">
                  <Download className="w-4 h-4 text-[#F2A900]" /> Download Full Module Backup (JSON)
                </Button>
              </a>
            </CardContent>
          </Card>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 9. SETTINGS TAB */}
      {/* ========================================================================= */}
      {currentTab === "settings" && settings && (
        <Card className="border-border shadow-md bg-card max-w-3xl mx-auto">
          <CardHeader className="border-b pb-4">
            <CardTitle className="text-base font-bold flex items-center gap-2 font-heading">
              <Settings className="w-5 h-5 text-accent" /> Calculation Engine &amp; Report Settings
            </CardTitle>
            <CardDescription className="text-xs">Default financial percentages, company branding, and formula versioning.</CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-bold">Default Wastage (%)</Label>
                <Input
                  type="number"
                  step="0.5"
                  value={settings.defaultWastagePct}
                  onChange={(e) => setSettings({ ...settings, defaultWastagePct: Number(e.target.value) })}
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-bold">Default Overhead (%)</Label>
                <Input
                  type="number"
                  step="0.5"
                  value={settings.defaultOverheadPct}
                  onChange={(e) => setSettings({ ...settings, defaultOverheadPct: Number(e.target.value) })}
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-bold">Default Contingency (%)</Label>
                <Input
                  type="number"
                  step="0.5"
                  value={settings.defaultContingencyPct}
                  onChange={(e) => setSettings({ ...settings, defaultContingencyPct: Number(e.target.value) })}
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-bold">Default Profit (%)</Label>
                <Input
                  type="number"
                  step="0.5"
                  value={settings.defaultProfitPct}
                  onChange={(e) => setSettings({ ...settings, defaultProfitPct: Number(e.target.value) })}
                />
              </div>
            </div>

            <div className="space-y-1.5 pt-2">
              <Label className="text-xs font-bold">Formula Engine Version</Label>
              <Input
                value={settings.formulaVersion}
                onChange={(e) => setSettings({ ...settings, formulaVersion: e.target.value })}
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-bold">Report Disclaimer Text</Label>
              <textarea
                value={settings.disclaimer}
                onChange={(e) => setSettings({ ...settings, disclaimer: e.target.value })}
                className="w-full min-h-[90px] rounded-md border border-input bg-background p-3 text-xs leading-relaxed"
              />
            </div>

            <div className="flex justify-end pt-2">
              <Button
                onClick={async () => {
                  try {
                    const res = await fetch("/api/admin/cost-estimator-pro/settings", {
                      method: "PUT",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify(settings),
                    });
                    if (res.ok) toast.success("Settings updated successfully!");
                  } catch (err: any) {
                    toast.error(err.message);
                  }
                }}
                className="bg-[#0B2A4A] text-white font-bold"
              >
                Save Settings
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ========================================================================= */}
      {/* VIEW ESTIMATE DETAIL MODAL */}
      {/* ========================================================================= */}
      <Dialog open={viewModalOpen} onOpenChange={setViewModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedEstimate && (
            <div className="space-y-6">
              <DialogHeader className="border-b pb-4">
                <div className="flex items-center justify-between">
                  <Badge className="bg-[#0B2A4A] text-[#F2A900] font-mono text-xs">
                    {selectedEstimate.estimateNumber} · Rev-{selectedEstimate.revision}
                  </Badge>
                  <div className="flex gap-2">
                    <a href={`/api/admin/cost-estimator-pro/export?format=pdf&estimateId=${selectedEstimate._id}`} download>
                      <Button size="sm" variant="outline" className="text-xs font-bold text-rose-600 gap-1">
                        Download PDF
                      </Button>
                    </a>
                    <a href={`/api/admin/cost-estimator-pro/export?format=excel&estimateId=${selectedEstimate._id}`} download>
                      <Button size="sm" variant="outline" className="text-xs font-bold text-emerald-600 gap-1">
                        Download Excel
                      </Button>
                    </a>
                  </div>
                </div>
                <DialogTitle className="text-xl font-bold font-heading mt-2">
                  {selectedEstimate.projectName}
                </DialogTitle>
                <DialogDescription className="text-xs">
                  Client: {selectedEstimate.clientName} | Location: {selectedEstimate.location} | Status:{" "}
                  <strong className="uppercase text-foreground">{selectedEstimate.status}</strong>
                </DialogDescription>
              </DialogHeader>

              {/* Financial Summary */}
              <div className="p-5 bg-[#0B2A4A] text-white rounded-2xl flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-[#F2A900] uppercase font-bold">Grand Total Construction Cost</span>
                  <h3 className="text-2xl font-black font-mono">৳ {selectedEstimate.financials?.grandTotalCost?.toLocaleString("en-BD")}</h3>
                </div>
                <div className="text-right">
                  <span className="text-[11px] text-slate-300">Unit Construction Rate</span>
                  <p className="text-lg font-bold text-[#F2A900]">৳ {selectedEstimate.financials?.costPerSqFt} / Sq.Ft</p>
                </div>
              </div>

              {/* Action Buttons: Issue / Revise */}
              <div className="flex justify-end gap-2.5">
                {selectedEstimate.status !== "issued" && (
                  <Button
                    size="sm"
                    onClick={() => handleIssueEstimate(selectedEstimate._id)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs gap-1"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Issue Officially (Freeze Baseline)
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleReviseEstimate(selectedEstimate._id)}
                  className="text-xs font-bold gap-1"
                >
                  <Copy className="w-4 h-4" /> Create New Revision
                </Button>
              </div>

              {/* BOQ Table */}
              <div className="border rounded-xl overflow-hidden">
                <div className="bg-muted/40 p-3 font-bold text-xs border-b">
                  Itemized Bill of Quantities ({selectedEstimate.boqItems?.length || 0} items)
                </div>
                <div className="overflow-x-auto max-h-64 scrollbar-thin">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-muted/60 uppercase font-bold text-[10px] text-muted-foreground border-b">
                      <tr>
                        <th className="p-2.5">Code</th>
                        <th className="p-2.5">Description</th>
                        <th className="p-2.5">Unit</th>
                        <th className="p-2.5">Qty</th>
                        <th className="p-2.5">Rate</th>
                        <th className="p-2.5 text-right">Amount (BDT)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {selectedEstimate.boqItems?.map((item: any, idx: number) => (
                        <tr key={idx} className="hover:bg-muted/10">
                          <td className="p-2.5 font-mono font-bold text-accent">{item.itemCode}</td>
                          <td className="p-2.5 font-medium">{item.description}</td>
                          <td className="p-2.5">{item.unit}</td>
                          <td className="p-2.5 font-mono">{item.quantity?.toLocaleString()}</td>
                          <td className="p-2.5 font-mono">৳{item.unitRate?.toLocaleString()}</td>
                          <td className="p-2.5 font-mono font-bold text-right">৳{item.amount?.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
