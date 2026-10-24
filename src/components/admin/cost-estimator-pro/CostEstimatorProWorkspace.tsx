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
  ChevronDown,
  Edit,
  Pencil,
  X,
  Share2,
  MessageSquare
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";

interface Props {
  initialTab?: string;
}

const MATERIAL_CATEGORIES = [
  "Cement",
  "Reinforcement Steel",
  "Sand",
  "Bricks & Blocks",
  "Aggregates & Stone Chips",
  "Tiles & Stones",
  "Paints & Finishes",
  "Plumbing & Sanitary",
  "Electrical",
  "Doors & Windows",
  "Formwork & Timber",
  "Waterproofing & Chemicals",
  "Miscellaneous"
];

const LABOUR_CATEGORIES = [
  "Head Mason (Rajmistri)",
  "Assistant Mason",
  "Rod Binder (Steel Fixer)",
  "Shuttering Carpenter",
  "Tile & Marble Specialist",
  "Painter",
  "Electrician",
  "Plumber & Pipe Fitter",
  "Excavator & Earthwork Labour",
  "General Construction Helper",
  "Site Supervisor",
  "Other"
];

export default function CostEstimatorProWorkspace({ initialTab = "dashboard" }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Robust, instant local state for tab switching
  const [activeTab, setActiveTab] = useState<string>(() => {
    if (typeof window !== "undefined") {
      const sp = new URLSearchParams(window.location.search);
      const t = sp.get("tab");
      if (t) return t;
    }
    return initialTab || "dashboard";
  });

  // Keep state in sync with URL or prop updates
  useEffect(() => {
    const tabParam = searchParams?.get("tab");
    if (tabParam && tabParam !== activeTab) {
      setActiveTab(tabParam);
    } else if (!tabParam && initialTab && initialTab !== activeTab) {
      setActiveTab(initialTab);
    }
  }, [searchParams, initialTab]);

  // Support browser Back/Forward navigation
  useEffect(() => {
    const handlePopState = () => {
      if (typeof window !== "undefined") {
        const sp = new URLSearchParams(window.location.search);
        const t = sp.get("tab");
        if (t) setActiveTab(t);
      }
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  // Instant tab switcher
  const setTab = (tab: string) => {
    setActiveTab(tab);
    if (typeof window !== "undefined") {
      try {
        const url = new URL(window.location.href);
        url.pathname = "/admin/cost-estimator-pro";
        url.searchParams.set("tab", tab);
        window.history.pushState({}, "", url.toString());
      } catch (e) {
        // fallback
      }
    }
  };

  const currentTab = activeTab;

  // --- GLOBAL STATE ---
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [estimates, setEstimates] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [materials, setMaterials] = useState<any[]>([]);
  const [labour, setLabour] = useState<any[]>([]);
  const [locations, setLocations] = useState<any[]>([]);
  const [boqTemplates, setBoqTemplates] = useState<any[]>([]);
  const [files, setFiles] = useState<any[]>([]);
  const [settings, setSettings] = useState<any>(null);

  // Search & Filter State
  const [matSearch, setMatSearch] = useState("");
  const [matCatFilter, setMatCatFilter] = useState("All");
  const [labSearch, setLabSearch] = useState("");
  const [labCatFilter, setLabCatFilter] = useState("All");
  const [estSearch, setEstSearch] = useState("");
  const [prjSearch, setPrjSearch] = useState("");
  const [docBoqSearch, setDocBoqSearch] = useState("");
  const [docCatFilter, setDocCatFilter] = useState("All");

  // --- MODAL STATES ---
  // Estimate View / Edit Modal
  const [selectedEstimate, setSelectedEstimate] = useState<any>(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editEstimateModalOpen, setEditEstimateModalOpen] = useState(false);
  const [editingEstimateForm, setEditingEstimateForm] = useState<any>(null);

  // Material Modal
  const [materialModalOpen, setMaterialModalOpen] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<any>(null);
  const [materialForm, setMaterialForm] = useState({
    code: "",
    name: "",
    category: "Cement",
    unit: "bag",
    unitPrice: 500,
    location: "All",
    supplierNote: "",
  });

  // Labour Modal
  const [labourModalOpen, setLabourModalOpen] = useState(false);
  const [editingLabour, setEditingLabour] = useState<any>(null);
  const [labourForm, setLabourForm] = useState({
    code: "",
    tradeName: "",
    category: "Head Mason (Rajmistri)",
    unit: "day",
    rate: 1000,
    location: "All",
    sourceNote: "",
  });

  // Location Modal
  const [locationModalOpen, setLocationModalOpen] = useState(false);
  const [editingLocation, setEditingLocation] = useState<any>(null);
  const [locationForm, setLocationForm] = useState({
    code: "",
    name: "",
    parentRegion: "Dhaka Division",
    costMultiplier: 1.0,
    notes: "",
  });

  // Project Modal
  const [projectModalOpen, setProjectModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<any>(null);
  const [projectForm, setProjectForm] = useState({
    name: "",
    clientName: "",
    clientPhone: "",
    clientEmail: "",
    location: "Dhaka",
    buildingType: "Residential",
    estimatedFloors: 4,
    totalBuiltUpArea: 6000,
    status: "active",
    notes: "",
  });

  // --- FETCH DATA ---
  const fetchAll = async () => {
    setLoading(true);
    try {
      const safeFetchJson = async (url: string) => {
        try {
          const res = await fetch(url);
          if (!res.ok) return { success: false };
          return await res.json();
        } catch {
          return { success: false };
        }
      };

      const [dash, est, prj, mat, lab, loc, fil, set, boq] = await Promise.all([
        safeFetchJson("/api/admin/cost-estimator-pro/dashboard"),
        safeFetchJson("/api/admin/cost-estimator-pro/estimates"),
        safeFetchJson("/api/admin/cost-estimator-pro/projects"),
        safeFetchJson("/api/admin/cost-estimator-pro/materials"),
        safeFetchJson("/api/admin/cost-estimator-pro/labour"),
        safeFetchJson("/api/admin/cost-estimator-pro/locations"),
        safeFetchJson("/api/admin/cost-estimator-pro/files"),
        safeFetchJson("/api/admin/cost-estimator-pro/settings"),
        safeFetchJson("/api/admin/cost-estimator-pro/boq-templates"),
      ]);

      if (dash?.success) setDashboardData(dash.data);
      if (est?.success) setEstimates(est.data || []);
      if (prj?.success) setProjects(prj.data || []);
      if (mat?.success) setMaterials(mat.data || []);
      if (lab?.success) setLabour(lab.data || []);
      if (loc?.success) setLocations(loc.data || []);
      if (fil?.success) setFiles(fil.data || []);
      if (set?.success) setSettings(set.data);
      if (boq?.success) setBoqTemplates(boq.data || []);
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
        setWizardStep(6);
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

  // View single estimate in full screen
  const handleViewEstimate = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/cost-estimator-pro/estimates/${id}`);
      const data = await res.json();
      if (data.success) {
        setSelectedEstimate(data.data);
        setTab("estimates");
        if (typeof window !== "undefined") {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      }
    } catch (err: any) {
      toast.error("Failed to load estimate details");
    }
  };

  // Delete estimate
  const handleDeleteEstimate = async (id: string, refNo: string) => {
    if (!confirm(`Are you sure you want to delete estimate ${refNo}?`)) return;
    try {
      const res = await fetch(`/api/admin/cost-estimator-pro/estimates/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        toast.success(`Estimate ${refNo} deleted`);
        fetchAll();
        setSelectedEstimate(null);
      } else {
        toast.error(data.error || "Failed to delete");
      }
    } catch (err: any) {
      toast.error(err.message);
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
        setSelectedEstimate(data.data);
      }
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  // -------------------------------------------------------------
  // MATERIAL CRUD HANDLERS
  // -------------------------------------------------------------
  const handleOpenAddMaterial = () => {
    setEditingMaterial(null);
    setMaterialForm({
      code: `MAT-${Math.floor(100 + Math.random() * 900)}`,
      name: "",
      category: "Cement",
      unit: "bag",
      unitPrice: 500,
      location: "All",
      supplierNote: "",
    });
    setMaterialModalOpen(true);
  };

  const handleOpenEditMaterial = (m: any) => {
    setEditingMaterial(m);
    setMaterialForm({
      code: m.code,
      name: m.name,
      category: m.category,
      unit: m.unit,
      unitPrice: m.unitPrice,
      location: m.location || "All",
      supplierNote: m.supplierNote || "",
    });
    setMaterialModalOpen(true);
  };

  const handleSaveMaterial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!materialForm.name.trim()) {
      toast.error("Material name is required");
      return;
    }
    try {
      const method = editingMaterial ? "PUT" : "POST";
      const payload = editingMaterial
        ? { _id: editingMaterial._id, ...materialForm }
        : materialForm;

      const res = await fetch("/api/admin/cost-estimator-pro/materials", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        toast.success(editingMaterial ? "Material rate updated!" : "Material added!");
        setMaterialModalOpen(false);
        fetchAll();
      } else {
        toast.error(data.error || "Failed to save material");
      }
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleDeleteMaterial = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete material: ${name}?`)) return;
    try {
      const res = await fetch(`/api/admin/cost-estimator-pro/materials?id=${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Material deleted successfully");
        fetchAll();
      } else {
        toast.error(data.error || "Failed to delete");
      }
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  // -------------------------------------------------------------
  // LABOUR CRUD HANDLERS
  // -------------------------------------------------------------
  const handleOpenAddLabour = () => {
    setEditingLabour(null);
    setLabourForm({
      code: `LAB-${Math.floor(100 + Math.random() * 900)}`,
      tradeName: "",
      category: "Head Mason (Rajmistri)",
      unit: "day",
      rate: 1000,
      location: "All",
      sourceNote: "",
    });
    setLabourModalOpen(true);
  };

  const handleOpenEditLabour = (l: any) => {
    setEditingLabour(l);
    setLabourForm({
      code: l.code,
      tradeName: l.tradeName,
      category: l.category,
      unit: l.unit,
      rate: l.rate,
      location: l.location || "All",
      sourceNote: l.sourceNote || "",
    });
    setLabourModalOpen(true);
  };

  const handleSaveLabour = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!labourForm.tradeName.trim()) {
      toast.error("Trade name is required");
      return;
    }
    try {
      const method = editingLabour ? "PUT" : "POST";
      const payload = editingLabour
        ? { _id: editingLabour._id, ...labourForm }
        : labourForm;

      const res = await fetch("/api/admin/cost-estimator-pro/labour", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        toast.success(editingLabour ? "Labour rate updated!" : "Labour trade added!");
        setLabourModalOpen(false);
        fetchAll();
      } else {
        toast.error(data.error || "Failed to save labour");
      }
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleDeleteLabour = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete labour trade: ${name}?`)) return;
    try {
      const res = await fetch(`/api/admin/cost-estimator-pro/labour?id=${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Labour trade deleted");
        fetchAll();
      } else {
        toast.error(data.error || "Failed to delete");
      }
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  // -------------------------------------------------------------
  // LOCATION CRUD HANDLERS
  // -------------------------------------------------------------
  const handleOpenAddLocation = () => {
    setEditingLocation(null);
    setLocationForm({
      code: `LOC-${Math.floor(100 + Math.random() * 900)}`,
      name: "",
      parentRegion: "Dhaka Division",
      costMultiplier: 1.0,
      notes: "",
    });
    setLocationModalOpen(true);
  };

  const handleOpenEditLocation = (loc: any) => {
    setEditingLocation(loc);
    setLocationForm({
      code: loc.code,
      name: loc.name,
      parentRegion: loc.parentRegion || "Dhaka Division",
      costMultiplier: loc.costMultiplier || 1.0,
      notes: loc.notes || "",
    });
    setLocationModalOpen(true);
  };

  const handleSaveLocation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!locationForm.name.trim()) {
      toast.error("Location name is required");
      return;
    }
    try {
      const method = editingLocation ? "PUT" : "POST";
      const payload = editingLocation
        ? { _id: editingLocation._id, ...locationForm }
        : locationForm;

      const res = await fetch("/api/admin/cost-estimator-pro/locations", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        toast.success(editingLocation ? "Location updated!" : "Location added!");
        setLocationModalOpen(false);
        fetchAll();
      } else {
        toast.error(data.error || "Failed to save location");
      }
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleDeleteLocation = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete location: ${name}?`)) return;
    try {
      const res = await fetch(`/api/admin/cost-estimator-pro/locations?id=${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Location deleted");
        fetchAll();
      } else {
        toast.error(data.error || "Failed to delete");
      }
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  // -------------------------------------------------------------
  // PROJECT CRUD HANDLERS
  // -------------------------------------------------------------
  const handleOpenAddProject = () => {
    setEditingProject(null);
    setProjectForm({
      name: "",
      clientName: "",
      clientPhone: "",
      clientEmail: "",
      location: "Dhaka",
      buildingType: "Residential",
      estimatedFloors: 4,
      totalBuiltUpArea: 6000,
      status: "active",
      notes: "",
    });
    setProjectModalOpen(true);
  };

  const handleOpenEditProject = (p: any) => {
    setEditingProject(p);
    setProjectForm({
      name: p.name,
      clientName: p.clientName,
      clientPhone: p.clientPhone || "",
      clientEmail: p.clientEmail || "",
      location: p.location || "Dhaka",
      buildingType: p.buildingType || "Residential",
      estimatedFloors: p.estimatedFloors || 4,
      totalBuiltUpArea: p.totalBuiltUpArea || 0,
      status: p.status || "active",
      notes: p.notes || "",
    });
    setProjectModalOpen(true);
  };

  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectForm.name.trim()) {
      toast.error("Project name is required");
      return;
    }
    try {
      const method = editingProject ? "PUT" : "POST";
      const payload = editingProject
        ? { _id: editingProject._id, ...projectForm }
        : projectForm;

      const res = await fetch("/api/admin/cost-estimator-pro/projects", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        toast.success(editingProject ? "Project updated!" : "Project created!");
        setProjectModalOpen(false);
        fetchAll();
      } else {
        toast.error(data.error || "Failed to save project");
      }
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleDeleteProject = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete project: ${name}?`)) return;
    try {
      const res = await fetch(`/api/admin/cost-estimator-pro/projects?id=${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Project deleted");
        fetchAll();
      } else {
        toast.error(data.error || "Failed to delete");
      }
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  // -------------------------------------------------------------
  // FILE DELETE HANDLER
  // -------------------------------------------------------------
  const handleDeleteFile = async (fileId: string, filename: string) => {
    if (!confirm(`Are you sure you want to delete file: ${filename}?`)) return;
    try {
      const res = await fetch(`/api/admin/cost-estimator-pro/files?id=${fileId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        toast.success("File deleted successfully");
        fetchAll();
      } else {
        toast.error(data.error || "Failed to delete file");
      }
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  // Filtered Lists
  const filteredMaterials = useMemo(() => {
    return materials.filter((m) => {
      const matchSearch = m.name.toLowerCase().includes(matSearch.toLowerCase()) || m.code.toLowerCase().includes(matSearch.toLowerCase());
      const matchCat = matCatFilter === "All" || m.category === matCatFilter;
      return matchSearch && matchCat;
    });
  }, [materials, matSearch, matCatFilter]);

  const filteredLabour = useMemo(() => {
    return labour.filter((l) => {
      const matchSearch = l.tradeName.toLowerCase().includes(labSearch.toLowerCase()) || l.code.toLowerCase().includes(labSearch.toLowerCase());
      const matchCat = labCatFilter === "All" || l.category === labCatFilter;
      return matchSearch && matchCat;
    });
  }, [labour, labSearch, labCatFilter]);

  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      return (
        p.name.toLowerCase().includes(prjSearch.toLowerCase()) ||
        p.clientName.toLowerCase().includes(prjSearch.toLowerCase()) ||
        p.location.toLowerCase().includes(prjSearch.toLowerCase())
      );
    });
  }, [projects, prjSearch]);

  const filteredEstimates = useMemo(() => {
    return estimates.filter((e) => {
      return (
        e.estimateNumber.toLowerCase().includes(estSearch.toLowerCase()) ||
        e.projectName.toLowerCase().includes(estSearch.toLowerCase()) ||
        e.clientName.toLowerCase().includes(estSearch.toLowerCase()) ||
        e.location.toLowerCase().includes(estSearch.toLowerCase())
      );
    });
  }, [estimates, estSearch]);

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
          { id: "locations", label: "Regional Rates", icon: MapPin, count: locations.length },
          { id: "boq", label: "BOQ Templates", icon: Layers, count: boqTemplates.length },
          { id: "files", label: "Files & Reports", icon: HardDrive, count: files.length },
          { id: "backup", label: "Backup & Restore", icon: Download },
          { id: "settings", label: "Engine Settings", icon: Settings },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setTab(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
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
            <Card className="border-border shadow-xs bg-card cursor-pointer hover:border-accent/40" onClick={() => setTab("projects")}>
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

            <Card className="border-border shadow-xs bg-card cursor-pointer hover:border-accent/40" onClick={() => setTab("estimates")}>
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

            <Card className="border-border shadow-xs bg-card cursor-pointer hover:border-accent/40" onClick={() => setTab("materials")}>
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

            <Card className="border-border shadow-xs bg-card cursor-pointer hover:border-accent/40" onClick={() => setTab("labour")}>
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
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDeleteEstimate(est._id, est.estimateNumber)}
                              className="h-7 text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
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
      {/* 3. ESTIMATES LIST & FULL-SCREEN DOCUMENT VIEW TAB */}
      {/* ========================================================================= */}
      {currentTab === "estimates" && (
        selectedEstimate ? (
          <div className="space-y-6 animate-in fade-in-50 duration-200">
            {/* Top Fullscreen Document Header & Actions */}
            <div className="bg-card border border-border rounded-2xl p-4 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setSelectedEstimate(null)}
                    className="h-7 text-xs font-bold gap-1.5 text-muted-foreground hover:text-foreground cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" /> Back to Estimates List
                  </Button>
                  <Badge className="bg-[#0B2A4A] text-[#F2A900] font-mono text-xs">
                    {selectedEstimate.estimateNumber} · Rev-{selectedEstimate.revision}
                  </Badge>
                  <Badge
                    className={`text-[10px] font-bold ${
                      selectedEstimate.status === "issued"
                        ? "bg-emerald-500/10 text-emerald-700 border-emerald-500/20"
                        : "bg-amber-500/10 text-amber-700 border-amber-500/20"
                    }`}
                  >
                    {selectedEstimate.status?.toUpperCase()}
                  </Badge>
                </div>
                <h2 className="text-xl sm:text-2xl font-black font-heading tracking-tight text-foreground">
                  {selectedEstimate.projectName}
                </h2>
                <p className="text-xs text-muted-foreground flex flex-wrap items-center gap-2">
                  <span>Client: <strong className="text-foreground">{selectedEstimate.clientName}</strong></span>
                  <span>•</span>
                  <span>Location: <strong className="text-foreground">{selectedEstimate.location}</strong></span>
                  <span>•</span>
                  <span>Created: {new Date(selectedEstimate.createdAt).toLocaleDateString()}</span>
                  {selectedEstimate.validityDate && (
                    <>
                      <span>•</span>
                      <span className="text-accent font-semibold">Valid Until: {new Date(selectedEstimate.validityDate).toLocaleDateString()}</span>
                    </>
                  )}
                </p>
              </div>

              {/* Action Buttons Toolbar */}
              <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
                <a href={`/api/admin/cost-estimator-pro/export?format=pdf&estimateId=${selectedEstimate._id}`} download>
                  <Button size="sm" className="bg-[#0B2A4A] hover:bg-[#123e6b] text-white text-xs font-bold h-8 gap-1.5 shadow-xs cursor-pointer">
                    <Download className="w-3.5 h-3.5" /> Download PDF
                  </Button>
                </a>
                <a href={`/api/admin/cost-estimator-pro/export?format=excel&estimateId=${selectedEstimate._id}`} download>
                  <Button size="sm" variant="outline" className="text-xs font-bold h-8 gap-1.5 text-emerald-600 border-emerald-500/30 hover:bg-emerald-50 cursor-pointer">
                    <FileSpreadsheet className="w-3.5 h-3.5" /> Export Excel
                  </Button>
                </a>

                {selectedEstimate.status !== "issued" && (
                  <Button
                    size="sm"
                    onClick={() => handleIssueEstimate(selectedEstimate._id)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs h-8 gap-1.5 cursor-pointer shadow-xs"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" /> Issue Officially
                  </Button>
                )}

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleReviseEstimate(selectedEstimate._id)}
                  className="text-xs font-bold h-8 gap-1.5 cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" /> Revise
                </Button>

                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleDeleteEstimate(selectedEstimate._id, selectedEstimate.estimateNumber)}
                  className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 text-xs font-bold h-8 gap-1 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Delete
                </Button>
              </div>
            </div>

            {/* Client Interactive Proposal Portal Bar */}
            {selectedEstimate.shareToken && (
              <div className="bg-card border border-border rounded-2xl p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs flex items-center gap-1.5 text-foreground">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" /> Client View Portal Link
                    </span>
                    {selectedEstimate.clientStatus === "accepted" ? (
                      <Badge className="bg-emerald-600 text-white text-[10px]">Accepted by Client</Badge>
                    ) : selectedEstimate.clientStatus === "revision_requested" ? (
                      <Badge className="bg-amber-600 text-white text-[10px]">Revision Requested</Badge>
                    ) : selectedEstimate.clientStatus === "viewed" ? (
                      <Badge className="bg-blue-600 text-white text-[10px]">Viewed {selectedEstimate.clientViewCount || 1}x</Badge>
                    ) : (
                      <Badge variant="outline" className="text-[10px]">Ready to Share</Badge>
                    )}
                  </div>
                  <p className="text-[11px] text-muted-foreground font-mono truncate max-w-xl">
                    {`${typeof window !== "undefined" ? window.location.origin : ""}/view-estimate/${selectedEstimate.shareToken}`}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      const url = `${window.location.origin}/view-estimate/${selectedEstimate.shareToken}`;
                      navigator.clipboard.writeText(url);
                      toast.success("Client Portal link copied!");
                    }}
                    className="text-xs h-8 font-bold gap-1.5 cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5" /> Copy Link
                  </Button>
                  <a
                    href={(() => {
                      const url = `${typeof window !== "undefined" ? window.location.origin : ""}/view-estimate/${selectedEstimate.shareToken}`;
                      const text = encodeURIComponent(
                        `Assalamu Alaikum ${selectedEstimate.clientName}, Here is the formal Civil Construction Estimate & BOQ for "${selectedEstimate.projectName}" prepared by HF Design & Engineering Solutions.\n\nTotal Estimated Cost: ৳${Math.round(selectedEstimate.financials?.grandTotalCost || 0).toLocaleString()}\n\nView Proposal Online:\n${url}`
                      );
                      return selectedEstimate.clientPhone
                        ? `https://wa.me/${selectedEstimate.clientPhone.replace(/[^0-9]/g, "")}?text=${text}`
                        : `https://wa.me/?text=${text}`;
                    })()}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button size="sm" variant="outline" className="text-xs h-8 font-bold gap-1 text-emerald-600 border-emerald-500/30 hover:bg-emerald-50 cursor-pointer">
                      <MessageSquare className="w-3.5 h-3.5" /> WhatsApp Client
                    </Button>
                  </a>
                  <a
                    href={`/view-estimate/${selectedEstimate.shareToken}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button size="sm" className="bg-[#0B2A4A] text-white text-xs h-8 font-bold gap-1 cursor-pointer">
                      <ExternalLink className="w-3.5 h-3.5" /> Open Client View
                    </Button>
                  </a>
                </div>
              </div>
            )}

            {/* Financial Summary Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
              <Card className="border-border shadow-xs bg-[#0B2A4A] text-white">
                <CardContent className="p-4 space-y-1">
                  <span className="text-[10px] text-[#F2A900] uppercase font-bold tracking-wider">Grand Total Budget</span>
                  <div className="text-xl sm:text-2xl font-black font-mono">
                    ৳{Math.round(selectedEstimate.financials?.grandTotalCost || 0).toLocaleString()}
                  </div>
                  <p className="text-[11px] text-slate-300">All-inclusive construction cost</p>
                </CardContent>
              </Card>

              <Card className="border-border shadow-xs bg-card">
                <CardContent className="p-4 space-y-1">
                  <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Unit Cost / Sqft</span>
                  <div className="text-xl sm:text-2xl font-black font-mono text-accent">
                    ৳{Math.round(selectedEstimate.financials?.costPerSqFt || 0).toLocaleString()}
                  </div>
                  <p className="text-[11px] text-muted-foreground">Per square foot of built-up area</p>
                </CardContent>
              </Card>

              <Card className="border-border shadow-xs bg-card">
                <CardContent className="p-4 space-y-1">
                  <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Base Material Cost</span>
                  <div className="text-xl sm:text-2xl font-black font-mono text-foreground">
                    ৳{Math.round(selectedEstimate.financials?.materialCostTotal || 0).toLocaleString()}
                  </div>
                  <p className="text-[11px] text-muted-foreground">Cement, rebar, sand, bricks, chips</p>
                </CardContent>
              </Card>

              <Card className="border-border shadow-xs bg-card">
                <CardContent className="p-4 space-y-1">
                  <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Base Labour Cost</span>
                  <div className="text-xl sm:text-2xl font-black font-mono text-foreground">
                    ৳{Math.round(selectedEstimate.financials?.labourCostTotal || 0).toLocaleString()}
                  </div>
                  <p className="text-[11px] text-muted-foreground">Masonry, bar-bending, casting trades</p>
                </CardContent>
              </Card>
            </div>

            {/* Category Breakdown Progress Cards */}
            {selectedEstimate.financials?.categoryTotals && selectedEstimate.financials.categoryTotals.length > 0 && (
              <Card className="border-border shadow-xs bg-card">
                <CardHeader className="p-4 border-b border-border">
                  <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground font-heading">
                    Work Package Cost Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {selectedEstimate.financials.categoryTotals.map((cat: any, idx: number) => (
                      <div key={idx} className="bg-muted/30 border border-border rounded-xl p-3 space-y-1">
                        <div className="flex items-center justify-between text-xs font-semibold">
                          <span className="text-foreground">{cat.category}</span>
                          <span className="font-mono text-muted-foreground text-[11px]">{cat.percentage}%</span>
                        </div>
                        <div className="text-base font-black font-mono text-foreground">
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
                </CardContent>
              </Card>
            )}

            {/* Full-Width Detailed BOQ Table */}
            <Card className="border-border shadow-xs bg-card overflow-hidden">
              <CardHeader className="p-5 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <CardTitle className="text-base font-bold font-heading flex items-center gap-2">
                    <FileText className="w-4 h-4 text-accent" /> Itemized Bill of Quantities (BOQ)
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Complete civil engineering quantities, specifications, and unit rates ({selectedEstimate.boqItems?.length || 0} items).
                  </CardDescription>
                </div>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Search BOQ items..."
                      value={docBoqSearch}
                      onChange={(e) => setDocBoqSearch(e.target.value)}
                      className="pl-8 text-xs h-8 w-full sm:w-52"
                    />
                  </div>
                  <select
                    value={docCatFilter}
                    onChange={(e) => setDocCatFilter(e.target.value)}
                    className="text-xs h-8 border border-input rounded-md px-2 bg-background font-medium"
                  >
                    <option value="All">All Categories</option>
                    {Array.from(new Set<string>(selectedEstimate.boqItems?.map((i: any) => String(i.category || "")) || [])).map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto max-h-[600px] scrollbar-thin">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-muted/60 uppercase font-bold text-[10px] text-muted-foreground border-b border-border sticky top-0 z-10 backdrop-blur-xs">
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
                      {selectedEstimate.boqItems
                        ?.filter((item: any) => {
                          const matchesCat = docCatFilter === "All" || item.category === docCatFilter;
                          const matchesSearch =
                            !docBoqSearch ||
                            item.description?.toLowerCase().includes(docBoqSearch.toLowerCase()) ||
                            item.itemCode?.toLowerCase().includes(docBoqSearch.toLowerCase()) ||
                            item.category?.toLowerCase().includes(docBoqSearch.toLowerCase());
                          return matchesCat && matchesSearch;
                        })
                        .map((item: any, idx: number) => (
                          <tr key={idx} className="hover:bg-muted/15 transition-colors">
                            <td className="p-3 font-mono font-bold text-accent">{item.itemCode}</td>
                            <td className="p-3 font-medium text-muted-foreground">{item.category}</td>
                            <td className="p-3 font-semibold text-foreground max-w-md">{item.description}</td>
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
                        ))}
                    </tbody>
                    <tfoot className="bg-muted/60 border-t-2 border-border font-bold">
                      <tr>
                        <td colSpan={6} className="p-3.5 text-right uppercase text-[11px] font-heading">
                          Grand Total Estimated Construction Cost:
                        </td>
                        <td className="p-3.5 text-right font-mono text-base text-accent font-black">
                          ৳{Math.round(selectedEstimate.financials?.grandTotalCost || 0).toLocaleString()}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Technical Specifications & Assumptions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <Card className="border-border shadow-xs bg-card">
                <CardHeader className="p-4 border-b border-border">
                  <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground font-heading">
                    Structural Specifications Snapshot
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 space-y-2">
                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div>
                      <span className="text-muted-foreground">Building Type:</span>
                      <p className="font-bold text-foreground">{selectedEstimate.inputsSnapshot?.buildingType}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Number of Stories:</span>
                      <p className="font-bold text-foreground">{selectedEstimate.inputsSnapshot?.floors} Stories</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Foundation Type:</span>
                      <p className="font-bold text-foreground">{selectedEstimate.inputsSnapshot?.foundationType}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Concrete Grade:</span>
                      <p className="font-bold text-foreground">{selectedEstimate.inputsSnapshot?.structuralSpecs?.concreteGrade || "C20 / C25"}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Rebar Grade:</span>
                      <p className="font-bold text-foreground">{selectedEstimate.inputsSnapshot?.structuralSpecs?.rebarGrade || "500W Grade"}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Total Built-Up Area:</span>
                      <p className="font-bold text-foreground">{selectedEstimate.inputsSnapshot?.totalBuiltUpArea?.toLocaleString()} sqft</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border shadow-xs bg-card">
                <CardHeader className="p-4 border-b border-border">
                  <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground font-heading">
                    Engineering Assumptions &amp; Notes
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 space-y-2 text-[11px] text-muted-foreground">
                  <p>• Standard load combinations in compliance with <strong>BNBC 2020</strong> &amp; <strong>BD PWD Schedule</strong>.</p>
                  <p>• Rates calculated based on current active regional procurement rates for {selectedEstimate.location}.</p>
                  <p>• Contractor overhead ({selectedEstimate.financials?.overheadPct || 5}%) and contingency ({selectedEstimate.financials?.contingencyPct || 3}%) factored in.</p>
                  {selectedEstimate.notes && (
                    <div className="mt-2 pt-2 border-t border-border">
                      <span className="font-bold text-foreground">Internal Engineer Notes:</span>
                      <p className="italic text-foreground mt-0.5">{selectedEstimate.notes}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          <Card className="border-border shadow-xs bg-card">
            <CardHeader className="p-5 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <CardTitle className="text-base font-bold font-heading">Saved Estimates &amp; Revisions</CardTitle>
                <CardDescription className="text-xs">View, issue, export PDF/Excel, and manage revisions.</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative w-48 sm:w-64">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-muted-foreground" />
                  <Input
                    placeholder="Search estimates..."
                    value={estSearch}
                    onChange={(e) => setEstSearch(e.target.value)}
                    className="pl-8 h-8 text-xs bg-background"
                  />
                </div>
                <Button size="sm" onClick={() => setTab("new")} className="bg-[#0B2A4A] text-white text-xs font-bold gap-1.5 h-8">
                  <Plus className="w-4 h-4" /> New Estimate
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {filteredEstimates.length === 0 ? (
                <div className="text-center py-16 text-muted-foreground text-xs space-y-2">
                  <FileText className="w-10 h-10 mx-auto opacity-30" />
                  <p>No saved estimates match your criteria.</p>
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
                      {filteredEstimates.map((est) => (
                        <tr key={est._id} className="hover:bg-muted/20 transition-colors">
                          <td className="p-3.5 font-mono font-bold text-accent">{est.estimateNumber}</td>
                          <td className="p-3.5 font-bold text-foreground">{est.projectName}</td>
                          <td className="p-3.5 text-muted-foreground">{est.clientName}</td>
                          <td className="p-3.5 font-mono">{est.inputsSnapshot?.totalBuiltUpArea?.toLocaleString() || "-"} sft</td>
                          <td className="p-3.5 font-mono font-bold text-foreground">৳{est.financials?.grandTotalCost?.toLocaleString() || "0"}</td>
                          <td className="p-3.5 font-mono text-muted-foreground">৳{est.financials?.costPerSqFt || "-"}</td>
                          <td className="p-3.5 font-bold">Rev-{est.revision}</td>
                          <td className="p-3.5">
                            <div className="flex flex-col gap-1">
                              <Badge
                                className={`text-[10px] font-bold w-fit ${
                                  est.status === "issued"
                                    ? "bg-emerald-500/10 text-emerald-700 border-emerald-500/20"
                                    : "bg-amber-500/10 text-amber-700 border-amber-500/20"
                                }`}
                              >
                                {est.status?.toUpperCase()}
                              </Badge>
                              {est.clientStatus === "accepted" ? (
                                <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-0.5">
                                  <CheckCircle2 className="w-3 h-3" /> Client Accepted
                                </span>
                              ) : est.clientStatus === "revision_requested" ? (
                                <span className="text-[10px] font-bold text-amber-600 flex items-center gap-0.5">
                                  <Clock className="w-3 h-3" /> Revision Req
                                </span>
                              ) : est.clientStatus === "viewed" ? (
                                <span className="text-[10px] text-blue-600 font-medium">
                                  Viewed {est.clientViewCount}x
                                </span>
                              ) : (
                                <span className="text-[10px] text-muted-foreground">Portal Sent</span>
                              )}
                            </div>
                          </td>
                          <td className="p-3.5 text-right space-x-1">
                            <Button size="sm" variant="ghost" onClick={() => handleViewEstimate(est._id)} className="h-7 text-xs" title="View Full Document">
                              <Eye className="w-3.5 h-3.5" />
                            </Button>
                            {est.shareToken && (
                              <>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    const url = `${window.location.origin}/view-estimate/${est.shareToken}`;
                                    navigator.clipboard.writeText(url);
                                    toast.success("Client Portal link copied!");
                                  }}
                                  className="h-7 text-[11px] px-2 font-bold text-[#0B2A4A] dark:text-[#F2A900] gap-1 cursor-pointer"
                                  title="Copy Client Proposal Link"
                                >
                                  <Copy className="w-3 h-3" /> Link
                                </Button>
                                <a
                                  href={(() => {
                                    const url = `${typeof window !== "undefined" ? window.location.origin : ""}/view-estimate/${est.shareToken}`;
                                    const text = encodeURIComponent(
                                      `Assalamu Alaikum ${est.clientName}, Here is the formal Civil Construction Estimate & BOQ for "${est.projectName}" prepared by HF Design & Engineering Solutions.\n\nTotal Estimated Cost: ৳${Math.round(est.financials?.grandTotalCost || 0).toLocaleString()}\n\nView Proposal Online:\n${url}`
                                    );
                                    return est.clientPhone
                                      ? `https://wa.me/${est.clientPhone.replace(/[^0-9]/g, "")}?text=${text}`
                                      : `https://wa.me/?text=${text}`;
                                  })()}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <Button size="sm" variant="outline" className="h-7 text-[11px] px-2 font-bold text-emerald-600 gap-1 cursor-pointer" title="Share via WhatsApp">
                                    <MessageSquare className="w-3 h-3" /> WA
                                  </Button>
                                </a>
                              </>
                            )}
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
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDeleteEstimate(est._id, est.estimateNumber)}
                              className="h-7 text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50"
                              title="Delete Estimate"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        )
      )}

      {/* ========================================================================= */}
      {/* 4. PROJECTS TAB */}
      {/* ========================================================================= */}
      {currentTab === "projects" && (
        <Card className="border-border shadow-xs bg-card">
          <CardHeader className="p-5 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <CardTitle className="text-base font-bold font-heading">Client Projects</CardTitle>
              <CardDescription className="text-xs">Manage engineering projects and client assignments.</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative w-48 sm:w-64">
                <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-muted-foreground" />
                <Input
                  placeholder="Search projects..."
                  value={prjSearch}
                  onChange={(e) => setPrjSearch(e.target.value)}
                  className="pl-8 h-8 text-xs bg-background"
                />
              </div>
              <Button size="sm" onClick={handleOpenAddProject} className="bg-[#0B2A4A] text-white text-xs font-bold gap-1.5 h-8">
                <Plus className="w-4 h-4" /> Add Project
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {filteredProjects.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground text-xs space-y-2">
                <FolderKanban className="w-10 h-10 mx-auto opacity-30" />
                <p>No projects match your search.</p>
                <Button size="sm" onClick={handleOpenAddProject} className="bg-[#0B2A4A] text-white text-xs">
                  Create First Project
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-muted/40 uppercase font-bold text-[10px] text-muted-foreground border-b border-border">
                    <tr>
                      <th className="p-3.5">Project ID</th>
                      <th className="p-3.5">Project Name</th>
                      <th className="p-3.5">Client Info</th>
                      <th className="p-3.5">Location</th>
                      <th className="p-3.5">Type &amp; Stories</th>
                      <th className="p-3.5">Estimates</th>
                      <th className="p-3.5">Status</th>
                      <th className="p-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filteredProjects.map((p) => (
                      <tr key={p._id} className="hover:bg-muted/20 transition-colors">
                        <td className="p-3.5 font-mono font-bold text-accent">{p.projectId}</td>
                        <td className="p-3.5 font-bold text-foreground">{p.name}</td>
                        <td className="p-3.5">
                          <p className="font-semibold text-foreground">{p.clientName}</p>
                          <p className="text-[11px] text-muted-foreground">{p.clientPhone || "-"}</p>
                        </td>
                        <td className="p-3.5 text-muted-foreground">{p.location}</td>
                        <td className="p-3.5">
                          <span>{p.buildingType}</span>
                          <span className="text-muted-foreground ml-1">({p.estimatedFloors} fl)</span>
                        </td>
                        <td className="p-3.5 font-mono font-bold">{p.estimatesCount || 0}</td>
                        <td className="p-3.5">
                          <Badge variant="outline" className="text-[10px] capitalize">
                            {p.status}
                          </Badge>
                        </td>
                        <td className="p-3.5 text-right space-x-1">
                          <Button size="sm" variant="ghost" onClick={() => handleOpenEditProject(p)} className="h-7 text-xs" title="Edit Project">
                            <Pencil className="w-3.5 h-3.5 text-accent" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDeleteProject(p._id, p.name)}
                            className="h-7 text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50"
                            title="Delete Project"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
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
      {/* 5. MATERIAL RATES TAB */}
      {/* ========================================================================= */}
      {currentTab === "materials" && (
        <Card className="border-border shadow-xs bg-card">
          <CardHeader className="p-5 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <CardTitle className="text-base font-bold font-heading">Material Benchmark Rates</CardTitle>
              <CardDescription className="text-xs">Live editable procurement rates in Bangladesh (BDT).</CardDescription>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative w-40 sm:w-56">
                <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-muted-foreground" />
                <Input
                  placeholder="Search materials..."
                  value={matSearch}
                  onChange={(e) => setMatSearch(e.target.value)}
                  className="pl-8 h-8 text-xs bg-background"
                />
              </div>
              <select
                value={matCatFilter}
                onChange={(e) => setMatCatFilter(e.target.value)}
                className="h-8 rounded-md border border-input bg-background px-2 text-xs"
              >
                <option value="All">All Categories</option>
                {MATERIAL_CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <Button size="sm" onClick={handleOpenAddMaterial} className="bg-[#0B2A4A] text-white text-xs font-bold gap-1.5 h-8">
                <Plus className="w-4 h-4" /> Add Material
              </Button>
            </div>
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
                    <th className="p-3.5">Supplier / Note</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredMaterials.map((m) => (
                    <tr key={m._id} className="hover:bg-muted/20">
                      <td className="p-3.5 font-mono font-bold text-accent">{m.code}</td>
                      <td className="p-3.5 font-bold text-foreground">{m.name}</td>
                      <td className="p-3.5 text-muted-foreground">{m.category}</td>
                      <td className="p-3.5 font-mono">{m.unit}</td>
                      <td className="p-3.5 font-mono font-bold text-foreground">৳ {m.unitPrice.toLocaleString()}</td>
                      <td className="p-3.5 text-muted-foreground">{m.location}</td>
                      <td className="p-3.5 text-muted-foreground max-w-xs truncate">{m.supplierNote || "-"}</td>
                      <td className="p-3.5 text-right space-x-1">
                        <Button size="sm" variant="ghost" onClick={() => handleOpenEditMaterial(m)} className="h-7 text-xs" title="Edit Rate">
                          <Pencil className="w-3.5 h-3.5 text-accent" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDeleteMaterial(m._id, m.name)}
                          className="h-7 text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50"
                          title="Delete Material"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
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
      {/* 6. LABOUR RATES TAB */}
      {/* ========================================================================= */}
      {currentTab === "labour" && (
        <Card className="border-border shadow-xs bg-card">
          <CardHeader className="p-5 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <CardTitle className="text-base font-bold font-heading">Labour Rates by Trade</CardTitle>
              <CardDescription className="text-xs">Daily and unit labour charges across Bangladesh construction trades.</CardDescription>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative w-40 sm:w-56">
                <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-muted-foreground" />
                <Input
                  placeholder="Search trades..."
                  value={labSearch}
                  onChange={(e) => setLabSearch(e.target.value)}
                  className="pl-8 h-8 text-xs bg-background"
                />
              </div>
              <select
                value={labCatFilter}
                onChange={(e) => setLabCatFilter(e.target.value)}
                className="h-8 rounded-md border border-input bg-background px-2 text-xs"
              >
                <option value="All">All Trades</option>
                {LABOUR_CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <Button size="sm" onClick={handleOpenAddLabour} className="bg-[#0B2A4A] text-white text-xs font-bold gap-1.5 h-8">
                <Plus className="w-4 h-4" /> Add Trade
              </Button>
            </div>
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
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredLabour.map((l) => (
                    <tr key={l._id} className="hover:bg-muted/20">
                      <td className="p-3.5 font-mono font-bold text-accent">{l.code}</td>
                      <td className="p-3.5 font-bold text-foreground">{l.tradeName}</td>
                      <td className="p-3.5 text-muted-foreground">{l.category}</td>
                      <td className="p-3.5 font-mono">{l.unit}</td>
                      <td className="p-3.5 font-mono font-bold text-foreground">৳ {l.rate.toLocaleString()}</td>
                      <td className="p-3.5 text-muted-foreground">{l.location}</td>
                      <td className="p-3.5 text-right space-x-1">
                        <Button size="sm" variant="ghost" onClick={() => handleOpenEditLabour(l)} className="h-7 text-xs" title="Edit Rate">
                          <Pencil className="w-3.5 h-3.5 text-accent" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDeleteLabour(l._id, l.tradeName)}
                          className="h-7 text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50"
                          title="Delete Labour"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
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
      {/* 7. REGIONAL RATES TAB */}
      {/* ========================================================================= */}
      {currentTab === "locations" && (
        <Card className="border-border shadow-xs bg-card">
          <CardHeader className="p-5 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <CardTitle className="text-base font-bold font-heading">Regional Rate Zones &amp; Multipliers</CardTitle>
              <CardDescription className="text-xs">Adjust construction cost baseline by location across Bangladesh.</CardDescription>
            </div>
            <Button size="sm" onClick={handleOpenAddLocation} className="bg-[#0B2A4A] text-white text-xs font-bold gap-1.5 h-8">
              <Plus className="w-4 h-4" /> Add Location
            </Button>
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
                    <th className="p-3.5 text-right">Actions</th>
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
                      <td className="p-3.5 text-right space-x-1">
                        <Button size="sm" variant="ghost" onClick={() => handleOpenEditLocation(loc)} className="h-7 text-xs" title="Edit Location">
                          <Pencil className="w-3.5 h-3.5 text-accent" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDeleteLocation(loc._id, loc.name)}
                          className="h-7 text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50"
                          title="Delete Location"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
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
      {/* 7.5. BOQ TEMPLATES & WORK ITEMS TAB */}
      {/* ========================================================================= */}
      {currentTab === "boq" && (
        <Card className="border-border shadow-xs bg-card">
          <CardHeader className="p-5 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <CardTitle className="text-base font-bold font-heading flex items-center gap-2">
                <Layers className="w-5 h-5 text-accent" /> BOQ Master Templates &amp; Work Items
              </CardTitle>
              <CardDescription className="text-xs">
                Standard Civil Engineering Bill of Quantities formulas, benchmark rates, and item specifications (BNBC 2020 &amp; BD PWD).
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button size="sm" onClick={fetchAll} variant="outline" className="text-xs gap-1">
                <RefreshCw className="w-3.5 h-3.5" /> Refresh
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-5 space-y-6">
            {boqTemplates.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground text-xs space-y-2">
                <Layers className="w-10 h-10 mx-auto opacity-30" />
                <p>No BOQ templates found. Templates will be seeded automatically on database init.</p>
              </div>
            ) : (
              boqTemplates.map((tpl) => (
                <div key={tpl._id || tpl.code} className="border border-border rounded-xl overflow-hidden bg-background">
                  <div className="bg-muted/40 p-4 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-xs text-accent px-2 py-0.5 rounded-md bg-accent/10 border border-accent/20">
                          {tpl.code}
                        </span>
                        <h3 className="font-bold text-sm text-foreground">{tpl.name}</h3>
                        {tpl.isDefault && (
                          <Badge variant="outline" className="text-[10px] bg-emerald-500/10 text-emerald-600 border-emerald-500/20">
                            Default Standard
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Building Type: <span className="font-semibold text-foreground">{tpl.buildingType}</span> | Foundation: <span className="font-semibold text-foreground">{tpl.foundationType}</span> | Version: <span className="font-mono">{tpl.version || "1.0"}</span>
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-mono font-bold bg-muted px-2.5 py-1 rounded-lg border border-border">
                        {tpl.items?.length || 0} Work Items
                      </span>
                    </div>
                  </div>

                  <div className="overflow-x-auto max-h-[500px] scrollbar-thin">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-muted/60 uppercase font-bold text-[10px] text-muted-foreground border-b border-border sticky top-0 z-10 backdrop-blur-xs">
                        <tr>
                          <th className="p-3">Item Code</th>
                          <th className="p-3">Category</th>
                          <th className="p-3">Description &amp; Specifications</th>
                          <th className="p-3">Unit</th>
                          <th className="p-3">Quantity Formula</th>
                          <th className="p-3 text-right">Default Rate (৳)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {tpl.items?.map((item: any, i: number) => (
                          <tr key={i} className="hover:bg-muted/20">
                            <td className="p-3 font-mono font-bold text-accent">{item.itemCode}</td>
                            <td className="p-3 font-medium text-muted-foreground">{item.category}</td>
                            <td className="p-3 font-bold text-foreground max-w-xs">{item.description}</td>
                            <td className="p-3 font-mono uppercase text-muted-foreground">{item.unit}</td>
                            <td className="p-3 font-mono text-[11px] text-blue-600 dark:text-blue-400 bg-muted/30 px-2 py-1 rounded">
                              {item.quantityFormula || "Direct calculation"}
                            </td>
                            <td className="p-3 text-right font-mono font-bold text-foreground">
                              ৳{Number(item.defaultUnitRate || 0).toLocaleString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      )}

      {/* ========================================================================= */}
      {/* 8. FILES & REPORTS TAB */}
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
                      <th className="p-3.5 text-right">Actions</th>
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
                        <td className="p-3.5 text-right space-x-1">
                          <a href={`/api/admin/cost-estimator-pro/files?id=${f.fileId}`} download>
                            <Button size="sm" variant="outline" className="h-7 text-xs gap-1 font-bold">
                              <Download className="w-3.5 h-3.5" /> Download
                            </Button>
                          </a>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDeleteFile(f.fileId, f.filename)}
                            className="h-7 text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50"
                            title="Delete File"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
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
      {/* 9. BACKUP & RESTORE TAB */}
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
      {/* 10. SETTINGS TAB */}
      {/* ========================================================================= */}
      {currentTab === "settings" && (
        !settings ? (
          <Card className="border-border shadow-xs bg-card max-w-3xl mx-auto p-12 text-center">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto text-accent mb-3" />
            <p className="text-sm font-medium text-muted-foreground">Loading calculation engine settings...</p>
          </Card>
        ) : (
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
        )
      )}

      {/* ========================================================================= */}
      {/* MATERIAL ADD/EDIT DIALOG */}
      {/* ========================================================================= */}
      <Dialog open={materialModalOpen} onOpenChange={setMaterialModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold font-heading">
              {editingMaterial ? "Edit Material Rate" : "Add New Material"}
            </DialogTitle>
            <DialogDescription className="text-xs">
              Configure procurement unit price in BDT and classification.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSaveMaterial} className="space-y-3.5 py-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs font-bold">Code *</Label>
                <Input
                  value={materialForm.code}
                  disabled={!!editingMaterial}
                  onChange={(e) => setMaterialForm({ ...materialForm, code: e.target.value })}
                  placeholder="MAT-001"
                  required
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-bold">Category *</Label>
                <select
                  value={materialForm.category}
                  onChange={(e) => setMaterialForm({ ...materialForm, category: e.target.value })}
                  className="w-full h-9 rounded-md border border-input bg-background px-3 text-xs"
                >
                  {MATERIAL_CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-bold">Material Name *</Label>
              <Input
                value={materialForm.name}
                onChange={(e) => setMaterialForm({ ...materialForm, name: e.target.value })}
                placeholder="e.g. 500W TMT Deformed Rebar"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs font-bold">Unit *</Label>
                <Input
                  value={materialForm.unit}
                  onChange={(e) => setMaterialForm({ ...materialForm, unit: e.target.value })}
                  placeholder="e.g. bag, ton, cft, pc, sft"
                  required
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-bold">Unit Price (BDT) *</Label>
                <Input
                  type="number"
                  step="0.1"
                  value={materialForm.unitPrice}
                  onChange={(e) => setMaterialForm({ ...materialForm, unitPrice: Number(e.target.value) })}
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-bold">Location Scope</Label>
              <Input
                value={materialForm.location}
                onChange={(e) => setMaterialForm({ ...materialForm, location: e.target.value })}
                placeholder="All / Dhaka / Savar"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-bold">Supplier or Specification Note</Label>
              <Input
                value={materialForm.supplierNote}
                onChange={(e) => setMaterialForm({ ...materialForm, supplierNote: e.target.value })}
                placeholder="e.g. BSRM / AKS factory delivery price"
              />
            </div>

            <DialogFooter className="pt-3">
              <Button type="button" variant="outline" onClick={() => setMaterialModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-[#0B2A4A] text-white font-bold">
                {editingMaterial ? "Update Material" : "Save Material"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ========================================================================= */}
      {/* LABOUR ADD/EDIT DIALOG */}
      {/* ========================================================================= */}
      <Dialog open={labourModalOpen} onOpenChange={setLabourModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold font-heading">
              {editingLabour ? "Edit Labour Trade" : "Add New Labour Trade"}
            </DialogTitle>
            <DialogDescription className="text-xs">
              Set trade wage rates and category standards.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSaveLabour} className="space-y-3.5 py-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs font-bold">Code *</Label>
                <Input
                  value={labourForm.code}
                  disabled={!!editingLabour}
                  onChange={(e) => setLabourForm({ ...labourForm, code: e.target.value })}
                  placeholder="LAB-001"
                  required
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-bold">Category *</Label>
                <select
                  value={labourForm.category}
                  onChange={(e) => setLabourForm({ ...labourForm, category: e.target.value })}
                  className="w-full h-9 rounded-md border border-input bg-background px-3 text-xs"
                >
                  {LABOUR_CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-bold">Trade Designation *</Label>
              <Input
                value={labourForm.tradeName}
                onChange={(e) => setLabourForm({ ...labourForm, tradeName: e.target.value })}
                placeholder="e.g. Senior Steel Fixer / Rod Binder"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs font-bold">Unit *</Label>
                <Input
                  value={labourForm.unit}
                  onChange={(e) => setLabourForm({ ...labourForm, unit: e.target.value })}
                  placeholder="day / sft / cft"
                  required
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-bold">Rate (BDT) *</Label>
                <Input
                  type="number"
                  value={labourForm.rate}
                  onChange={(e) => setLabourForm({ ...labourForm, rate: Number(e.target.value) })}
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-bold">Location Scope</Label>
              <Input
                value={labourForm.location}
                onChange={(e) => setLabourForm({ ...labourForm, location: e.target.value })}
                placeholder="All / Dhaka / Savar"
              />
            </div>

            <DialogFooter className="pt-3">
              <Button type="button" variant="outline" onClick={() => setLabourModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-[#0B2A4A] text-white font-bold">
                {editingLabour ? "Update Trade" : "Save Trade"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ========================================================================= */}
      {/* LOCATION ADD/EDIT DIALOG */}
      {/* ========================================================================= */}
      <Dialog open={locationModalOpen} onOpenChange={setLocationModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold font-heading">
              {editingLocation ? "Edit Regional Zone" : "Add Regional Zone"}
            </DialogTitle>
            <DialogDescription className="text-xs">
              Configure cost multiplier factors for different districts.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSaveLocation} className="space-y-3.5 py-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs font-bold">Zone Code *</Label>
                <Input
                  value={locationForm.code}
                  disabled={!!editingLocation}
                  onChange={(e) => setLocationForm({ ...locationForm, code: e.target.value })}
                  placeholder="DHK"
                  required
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-bold">Cost Multiplier *</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={locationForm.costMultiplier}
                  onChange={(e) => setLocationForm({ ...locationForm, costMultiplier: Number(e.target.value) })}
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-bold">Location Name *</Label>
              <Input
                value={locationForm.name}
                onChange={(e) => setLocationForm({ ...locationForm, name: e.target.value })}
                placeholder="e.g. Savar Metro & Radio Colony"
                required
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-bold">Division / Parent Region</Label>
              <Input
                value={locationForm.parentRegion}
                onChange={(e) => setLocationForm({ ...locationForm, parentRegion: e.target.value })}
                placeholder="Dhaka Division"
              />
            </div>

            <DialogFooter className="pt-3">
              <Button type="button" variant="outline" onClick={() => setLocationModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-[#0B2A4A] text-white font-bold">
                {editingLocation ? "Update Location" : "Save Location"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ========================================================================= */}
      {/* PROJECT ADD/EDIT DIALOG */}
      {/* ========================================================================= */}
      <Dialog open={projectModalOpen} onOpenChange={setProjectModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold font-heading">
              {editingProject ? "Edit Project" : "Create New Project"}
            </DialogTitle>
            <DialogDescription className="text-xs">
              Project details, client contact, and building specifications.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSaveProject} className="space-y-3.5 py-2">
            <div className="space-y-1">
              <Label className="text-xs font-bold">Project Title *</Label>
              <Input
                value={projectForm.name}
                onChange={(e) => setProjectForm({ ...projectForm, name: e.target.value })}
                placeholder="e.g. Green Valley Duplex Villa"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs font-bold">Client Name *</Label>
                <Input
                  value={projectForm.clientName}
                  onChange={(e) => setProjectForm({ ...projectForm, clientName: e.target.value })}
                  placeholder="e.g. Alhaj Md. Rashed"
                  required
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-bold">Client Phone</Label>
                <Input
                  value={projectForm.clientPhone}
                  onChange={(e) => setProjectForm({ ...projectForm, clientPhone: e.target.value })}
                  placeholder="017XXXXXXXX"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs font-bold">Location</Label>
                <Input
                  value={projectForm.location}
                  onChange={(e) => setProjectForm({ ...projectForm, location: e.target.value })}
                  placeholder="Savar, Dhaka"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-bold">Building Type</Label>
                <select
                  value={projectForm.buildingType}
                  onChange={(e) => setProjectForm({ ...projectForm, buildingType: e.target.value })}
                  className="w-full h-9 rounded-md border border-input bg-background px-3 text-xs"
                >
                  <option value="Residential">Residential Building</option>
                  <option value="Commercial">Commercial / Market</option>
                  <option value="Industrial">Industrial Shed / Factory</option>
                  <option value="Mixed-use">Mixed-Use Commercial</option>
                  <option value="Duplex Home">Luxury Duplex Villa</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs font-bold">Estimated Floors</Label>
                <Input
                  type="number"
                  value={projectForm.estimatedFloors}
                  onChange={(e) => setProjectForm({ ...projectForm, estimatedFloors: Number(e.target.value) })}
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-bold">Total Built-up Area (sft)</Label>
                <Input
                  type="number"
                  value={projectForm.totalBuiltUpArea}
                  onChange={(e) => setProjectForm({ ...projectForm, totalBuiltUpArea: Number(e.target.value) })}
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-bold">Project Status</Label>
              <select
                value={projectForm.status}
                onChange={(e) => setProjectForm({ ...projectForm, status: e.target.value })}
                className="w-full h-9 rounded-md border border-input bg-background px-3 text-xs"
              >
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="on-hold">On Hold</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            <DialogFooter className="pt-3">
              <Button type="button" variant="outline" onClick={() => setProjectModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-[#0B2A4A] text-white font-bold">
                {editingProject ? "Update Project" : "Create Project"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
