"use client";

import { useEffect, useState, useCallback, useTransition } from "react";
import Link from "next/link";
import {
  Eye, Users, Activity, RefreshCw, Loader2, AlertCircle,
  Globe, Smartphone, Monitor, Tablet, X, TrendingUp, Clock,
  ToggleLeft, ToggleRight, ExternalLink, ChevronDown, ChevronRight,
  Search, UserCheck, User, Layers, ArrowRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { adminFetch } from "@/lib/admin-fetch";

// ── Overview Types ────────────────────────────────────────────────────────
interface Summary { views: number; uniqueVisitors: number; today: number; topSource: string; }
interface DayPoint { date: string; count: number; }
interface PageStat  { path: string; views: number; uniqueVisitors: number; }
interface SourceStat { source: string; count: number; }
interface DomainStat { domain: string; count: number; }
interface CountryStat { country: string; count: number; }
interface CityStat { city: string; count: number; }
interface DeviceStat { device: string; count: number; }
interface BrowserStat { browser: string; count: number; }
interface OSStat { os: string; count: number; }
interface RecentVisit {
  timestamp: string;
  path: string;
  source: string;
  country: string;
  city: string;
  device: string;
}

interface AnalyticsData {
  days: number;
  pathFilter: string;
  summary: Summary;
  dailySeries: DayPoint[];
  topPages: PageStat[];
  sources: SourceStat[];
  referrerDomains: DomainStat[];
  countries: CountryStat[];
  cities: CityStat[];
  devices: DeviceStat[];
  browsers: BrowserStat[];
  os: OSStat[];
  recentVisits: RecentVisit[];
  totalPageViews: number;
  uniqueVisitors: number;
  todayViews: number;
}

// ── Visitors Grouped Types ────────────────────────────────────────────────
interface VisitorPage {
  path: string;
  count: number;
}

interface VisitorRecord {
  id: string;
  type: "registered" | "guest";
  userId: string;
  name: string;
  phone: string;
  clientId: string;
  ip: string;
  country: string;
  city: string;
  device: string;
  browser: string;
  totalViews: number;
  distinctPages: number;
  firstSeen: string;
  lastSeen: string;
  topPages: VisitorPage[];
  topSource: string;
}

interface VisitorsResponse {
  days: number;
  type: string;
  q: string;
  pagination: {
    page: number;
    limit: number;
    totalCount: number;
    totalPages: number;
  };
  totals: {
    registered: number;
    guest: number;
    all: number;
  };
  visitors: VisitorRecord[];
}

// ── Helpers ───────────────────────────────────────────────────────────────
const RANGE_OPTIONS = [
  { label: "আজ",    labelEn: "Today",   days: 1  },
  { label: "৭ দিন",  labelEn: "7 days",  days: 7  },
  { label: "৩০ দিন", labelEn: "30 days", days: 30 },
  { label: "৯০ দিন", labelEn: "90 days", days: 90 },
] as const;

const countryNames = typeof Intl !== "undefined"
  ? new Intl.DisplayNames(["bn"], { type: "region" })
  : null;

function countryFlag(code: string): string {
  if (!code || code.length !== 2) return "🌐";
  return String.fromCodePoint(
    ...code.toUpperCase().split("").map((c) => 0x1f1e6 + c.charCodeAt(0) - 65)
  );
}

function countryName(code: string): string {
  try { return countryNames?.of(code) ?? code; } catch { return code; }
}

function formatDhakaTime(ts: string): string {
  if (!ts) return "—";
  return new Date(ts).toLocaleString("bn-BD", {
    timeZone: "Asia/Dhaka",
    hour12: true,
    dateStyle: "short",
    timeStyle: "short",
  });
}

function sourceColor(source: string): string {
  const map: Record<string, string> = {
    Facebook: "#1877f2", Messenger: "#00b2ff", Instagram: "#e1306c",
    Google: "#34a853", YouTube: "#ff0000", WhatsApp: "#25d366",
    "Twitter/X": "#1da1f2", Bing: "#00809d", LinkedIn: "#0077b5",
    Direct: "#6b7280",
  };
  return map[source] ?? "#8b5cf6";
}

function deviceIcon(device: string) {
  if (device === "mobile")  return <Smartphone className="w-4 h-4" />;
  if (device === "tablet")  return <Tablet className="w-4 h-4" />;
  return <Monitor className="w-4 h-4" />;
}

function MiniBar({ count, max, color = "bg-primary" }: { count: number; max: number; color?: string }) {
  return (
    <div className="flex-1 bg-muted rounded-full h-2 overflow-hidden">
      <div
        className={`${color} h-full rounded-full transition-all duration-500`}
        style={{ width: `${max > 0 ? (count / max) * 100 : 0}%` }}
      />
    </div>
  );
}

// ── Main Page Component ───────────────────────────────────────────────────
export default function AdminAnalyticsPage() {
  const [activeTab, setActiveTab] = useState<"overview" | "visitors">("overview");

  // Overview state
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loadingOverview, setLoadingOverview] = useState(true);
  const [errorOverview, setErrorOverview] = useState<string | null>(null);
  const [days, setDays] = useState(30);
  const [pathFilter, setPathFilter] = useState("");
  const [noTrack, setNoTrack] = useState(false);

  // Visitors view state
  const [visitorsData, setVisitorsData] = useState<VisitorsResponse | null>(null);
  const [loadingVisitors, setLoadingVisitors] = useState(false);
  const [errorVisitors, setErrorVisitors] = useState<string | null>(null);
  const [visitorType, setVisitorType] = useState<"all" | "registered" | "guest">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [expandedVisitors, setExpandedVisitors] = useState<Record<string, boolean>>({});
  const [, startTransition] = useTransition();

  useEffect(() => {
    setNoTrack(localStorage.getItem("hf_no_track") === "1");
  }, []);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch Overview Data
  const fetchOverview = useCallback(async (d: number, pf: string) => {
    setLoadingOverview(true);
    setErrorOverview(null);
    try {
      const params = new URLSearchParams({ days: String(d) });
      if (pf) params.set("path", pf);
      const res = await adminFetch(`/api/admin/analytics?${params}`);
      if (!res.ok) {
        if (res.status === 401) throw new Error("Unauthorized");
        throw new Error("ডেটা লোড করা যায়নি");
      }
      setData(await res.json());
    } catch (err) {
      setErrorOverview(err instanceof Error ? err.message : "কিছু একটা ভুল হয়েছে");
    } finally {
      setLoadingOverview(false);
    }
  }, []);

  // Fetch Visitors Data
  const fetchVisitors = useCallback(async (d: number, type: string, q: string, p: number) => {
    setLoadingVisitors(true);
    setErrorVisitors(null);
    try {
      const params = new URLSearchParams({
        days: String(d),
        type,
        page: String(p),
        limit: "20",
      });
      if (q) params.set("q", q);
      const res = await adminFetch(`/api/admin/analytics/visitors?${params}`);
      if (!res.ok) {
        if (res.status === 401) throw new Error("Unauthorized");
        throw new Error("ভিজিটর ডেটা লোড করা যায়নি");
      }
      const json: VisitorsResponse = await res.json();
      setVisitorsData(json);
    } catch (err) {
      setErrorVisitors(err instanceof Error ? err.message : "কিছু একটা ভুল হয়েছে");
    } finally {
      setLoadingVisitors(false);
    }
  }, []);

  useEffect(() => {
    if (activeTab === "overview") {
      fetchOverview(days, pathFilter);
    } else {
      fetchVisitors(days, visitorType, debouncedSearch, page);
    }
  }, [activeTab, days, pathFilter, visitorType, debouncedSearch, page, fetchOverview, fetchVisitors]);

  const toggleTracking = () => {
    const next = !noTrack;
    setNoTrack(next);
    localStorage.setItem("hf_no_track", next ? "1" : "0");
  };

  const toggleExpand = (id: string) => {
    setExpandedVisitors((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handlePageClick = (path: string) => {
    setPathFilter(path);
    setActiveTab("overview");
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">

      {/* ── Top Header ──────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">ভিজিটর ও অ্যানালিটিক্স</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            ওয়েবসাইটের দর্শক, পেজ ভিউ ও ভিজিটরদের গতিবিধি
          </p>
        </div>

        {/* Global Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Days Range Selector */}
          <div className="flex border rounded-lg overflow-hidden bg-background">
            {RANGE_OPTIONS.map((opt) => (
              <button
                key={opt.days}
                onClick={() => {
                  setDays(opt.days);
                  setPage(1);
                }}
                className={`px-3 py-1.5 text-xs sm:text-sm font-medium transition-colors ${
                  days === opt.days
                    ? "bg-primary text-primary-foreground font-semibold"
                    : "hover:bg-muted text-muted-foreground"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* Refresh Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              if (activeTab === "overview") fetchOverview(days, pathFilter);
              else fetchVisitors(days, visitorType, debouncedSearch, page);
            }}
          >
            <RefreshCw className="w-4 h-4 mr-1" /> রিফ্রেশ
          </Button>

          {/* Opt-out toggle */}
          <Button
            variant={noTrack ? "destructive" : "secondary"}
            size="sm"
            onClick={toggleTracking}
            title="এই ডিভাইস থেকে ট্র্যাকিং চালু বা বন্ধ করুন"
          >
            {noTrack ? <ToggleLeft className="w-4 h-4 mr-1" /> : <ToggleRight className="w-4 h-4 mr-1" />}
            {noTrack ? "আমার ট্র্যাকিং বন্ধ" : "আমার ট্র্যাকিং চালু"}
          </Button>
        </div>
      </div>

      {/* ── Navigation Tabs ─────────────────────────────────────────────── */}
      <div className="flex items-center gap-2 border-b">
        <button
          onClick={() => setActiveTab("overview")}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-all ${
            activeTab === "overview"
              ? "border-primary text-primary font-semibold"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>সারসংক্ষেপ (Overview)</span>
        </button>

        <button
          onClick={() => setActiveTab("visitors")}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-all ${
            activeTab === "visitors"
              ? "border-primary text-primary font-semibold"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Users className="w-4 h-4" />
          <span>ভিজিটর তালিকা (Visitors — কে কী দেখেছে)</span>
          {visitorsData?.totals.all ? (
            <Badge variant="secondary" className="text-xs px-1.5 py-0">
              {visitorsData.totals.all.toLocaleString("bn-BD")}
            </Badge>
          ) : null}
        </button>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* TAB 1: OVERVIEW                                                       */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          {pathFilter && (
            <div className="flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-lg px-3 py-2 w-fit">
              <span className="text-sm font-mono text-primary">{pathFilter}</span>
              <button onClick={() => setPathFilter("")} className="text-primary hover:text-primary/70">
                <X className="w-4 h-4" />
              </button>
              <span className="text-xs text-muted-foreground">— ফিল্টার সক্রিয়</span>
            </div>
          )}

          {loadingOverview ? (
            <div className="flex h-[40vh] items-center justify-center">
              <div className="text-center space-y-2">
                <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
                <p className="text-muted-foreground text-sm">সারসংক্ষেপ লোড হচ্ছে…</p>
              </div>
            </div>
          ) : errorOverview ? (
            <Card className="p-8 text-center max-w-sm mx-auto">
              <AlertCircle className="w-12 h-12 mx-auto text-destructive mb-4" />
              <p className="text-muted-foreground mb-4">{errorOverview}</p>
              <Button onClick={() => fetchOverview(days, pathFilter)}>আবার চেষ্টা করুন</Button>
            </Card>
          ) : data ? (
            <>
              {/* Summary Cards */}
              <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">মোট ভিজিট <span className="text-xs text-muted-foreground block">Total Views</span></CardTitle>
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{data.summary.views.toLocaleString("bn-BD")}</div>
                    <p className="text-xs text-muted-foreground">নির্বাচিত পিরিয়ডে</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">অনন্য ভিজিটর <span className="text-xs text-muted-foreground block">Unique Visitors</span></CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{data.summary.uniqueVisitors.toLocaleString("bn-BD")}</div>
                    <p className="text-xs text-muted-foreground">ভিন্ন ডিভাইস / আইপি</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">আজকের ভিজিট <span className="text-xs text-muted-foreground block">Today</span></CardTitle>
                    <Activity className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{data.summary.today.toLocaleString("bn-BD")}</div>
                    <p className="text-xs text-muted-foreground">ঢাকা সময় অনুযায়ী</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">শীর্ষ সোর্স <span className="text-xs text-muted-foreground block">Top Source</span></CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold truncate">{data.summary.topSource}</div>
                    <p className="text-xs text-muted-foreground">সবচেয়ে বেশি ট্র্যাফিক</p>
                  </CardContent>
                </Card>
              </div>

              {/* Daily Views Bar Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>দৈনিক ভিজিট <span className="text-sm font-normal text-muted-foreground ml-2">Daily Views</span></CardTitle>
                </CardHeader>
                <CardContent>
                  {data.dailySeries.every((d) => d.count === 0) ? (
                    <p className="text-muted-foreground text-center py-8">এখনো কোনো ডেটা নেই</p>
                  ) : (
                    <div className="overflow-x-auto">
                      <div className="flex items-end gap-1 h-40 min-w-[300px]">
                        {data.dailySeries.map((item) => {
                          const maxDaily = Math.max(...data.dailySeries.map((d) => d.count), 1);
                          return (
                            <div key={item.date} className="flex-1 flex flex-col items-center gap-1 min-w-[8px]">
                              {item.count > 0 && (
                                <span className="text-[9px] text-muted-foreground">{item.count}</span>
                              )}
                              <div
                                className="w-full bg-primary/80 rounded-t transition-all duration-500 hover:bg-primary cursor-default"
                                style={{ height: `${(item.count / maxDaily) * 100}%`, minHeight: item.count > 0 ? 4 : 0 }}
                                title={`${item.date}: ${item.count} ভিউ`}
                              />
                              {days <= 30 && (
                                <span className="text-[9px] text-muted-foreground whitespace-nowrap" style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}>
                                  {item.date.slice(5)}
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Page-wise Table & Traffic Sources */}
              <div className="grid gap-4 lg:grid-cols-2">
                {/* Page Table */}
                <Card>
                  <CardHeader>
                    <CardTitle>পেইজ ভিউ <span className="text-sm font-normal text-muted-foreground ml-2">Page Views</span></CardTitle>
                    <p className="text-xs text-muted-foreground">পেইজের নামে ক্লিক করলে ফিল্টার হবে · লিংক আইকনে ক্লিক করলে পেইজ খুলবে</p>
                  </CardHeader>
                  <CardContent>
                    {data.topPages.length === 0 ? (
                      <p className="text-muted-foreground text-center py-8">এখনো কোনো ডেটা নেই</p>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b text-muted-foreground">
                              <th className="text-left pb-2 font-medium">পেইজ / Page URL</th>
                              <th className="text-right pb-2 font-medium w-16">ভিউ</th>
                              <th className="text-right pb-2 font-medium w-20">ভিজিটর</th>
                              <th className="w-16 pb-2"></th>
                            </tr>
                          </thead>
                          <tbody>
                            {data.topPages.map((p) => (
                              <tr
                                key={p.path}
                                className={`border-b hover:bg-muted/50 transition-colors ${pathFilter === p.path ? "bg-primary/10" : ""}`}
                              >
                                <td className="py-2">
                                  <div className="flex flex-col gap-0.5">
                                    <span
                                      className="font-mono text-xs text-primary cursor-pointer hover:underline truncate max-w-[200px] block"
                                      title={p.path}
                                      onClick={() => handlePageClick(p.path)}
                                    >
                                      {p.path}
                                    </span>
                                    <span className="text-[10px] text-muted-foreground font-normal truncate max-w-[200px]">
                                      https://hf-engineering.vercel.app{p.path}
                                    </span>
                                  </div>
                                </td>
                                <td className="py-2 text-right tabular-nums">{p.views}</td>
                                <td className="py-2 text-right tabular-nums text-muted-foreground">{p.uniqueVisitors}</td>
                                <td className="py-2 text-right">
                                  <a
                                    href={`https://hf-engineering.vercel.app${p.path}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={(e) => e.stopPropagation()}
                                    className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors px-2 py-1 rounded hover:bg-muted"
                                    title="নতুন ট্যাবে খুলুন"
                                  >
                                    <ExternalLink className="w-3 h-3" />
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

                {/* Sources Card */}
                <Card>
                  <CardHeader>
                    <CardTitle>ট্র্যাফিক সোর্স <span className="text-sm font-normal text-muted-foreground ml-2">Where visitors come from</span></CardTitle>
                  </CardHeader>
                  <CardContent>
                    {data.sources.length === 0 ? (
                      <p className="text-muted-foreground text-center py-8">এখনো কোনো ডেটা নেই</p>
                    ) : (
                      <div className="space-y-3">
                        {(() => {
                          const maxSource = Math.max(...data.sources.map((s) => s.count), 1);
                          return data.sources.map((s) => (
                            <div key={s.source} className="flex items-center gap-3">
                              <div
                                className="w-2 h-2 rounded-full flex-shrink-0"
                                style={{ backgroundColor: sourceColor(s.source) }}
                              />
                              <span className="text-sm w-28 truncate">{s.source}</span>
                              <div className="flex-1 bg-muted rounded-full h-2 overflow-hidden">
                                <div
                                  className="h-full rounded-full transition-all duration-500"
                                  style={{ width: `${(s.count / maxSource) * 100}%`, backgroundColor: sourceColor(s.source) }}
                                />
                              </div>
                              <span className="text-sm tabular-nums text-muted-foreground w-8 text-right">{s.count}</span>
                            </div>
                          ));
                        })()}

                        {data.referrerDomains.length > 0 && (
                          <div className="pt-3 border-t mt-3">
                            <p className="text-xs text-muted-foreground mb-2">রেফারার ডোমেইন / Referrer domains</p>
                            <div className="space-y-1">
                              {data.referrerDomains.slice(0, 8).map((d) => (
                                <div key={d.domain} className="flex items-center justify-between text-sm">
                                  <span className="font-mono text-xs truncate max-w-[180px]">{d.domain}</span>
                                  <span className="tabular-nums text-muted-foreground">{d.count}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Locations */}
              <div className="grid gap-4 lg:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle><Globe className="inline w-4 h-4 mr-1" />দেশ <span className="text-sm font-normal text-muted-foreground ml-2">Countries</span></CardTitle>
                  </CardHeader>
                  <CardContent>
                    {data.countries.length === 0 ? (
                      <p className="text-muted-foreground text-center py-4 text-sm">এখনো কোনো ডেটা নেই</p>
                    ) : (
                      <div className="space-y-2">
                        {(() => {
                          const maxCountry = Math.max(...data.countries.map((c) => c.count), 1);
                          return data.countries.map((c) => (
                            <div key={c.country} className="flex items-center gap-3">
                              <span className="text-lg w-8">{countryFlag(c.country)}</span>
                              <span className="text-sm flex-1 truncate">{countryName(c.country)}</span>
                              <MiniBar count={c.count} max={maxCountry} />
                              <span className="text-sm tabular-nums text-muted-foreground w-8 text-right">{c.count}</span>
                            </div>
                          ));
                        })()}
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>শহর <span className="text-sm font-normal text-muted-foreground ml-2">Cities</span></CardTitle>
                  </CardHeader>
                  <CardContent>
                    {data.cities.length === 0 ? (
                      <p className="text-muted-foreground text-center py-4 text-sm">এখনো কোনো ডেটা নেই</p>
                    ) : (
                      <div className="space-y-2">
                        {data.cities.map((c) => (
                          <div key={c.city} className="flex items-center gap-3">
                            <span className="text-sm flex-1">{c.city}</span>
                            <span className="text-sm tabular-nums text-muted-foreground">{c.count}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Devices, Browsers, OS */}
              <div className="grid gap-4 md:grid-cols-3">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">ডিভাইস <span className="text-xs font-normal text-muted-foreground">Devices</span></CardTitle>
                  </CardHeader>
                  <CardContent>
                    {data.devices.length === 0 ? (
                      <p className="text-muted-foreground text-center py-4 text-sm">এখনো কোনো ডেটা নেই</p>
                    ) : (
                      <div className="space-y-3">
                        {(() => {
                          const maxDevice = Math.max(...data.devices.map((d) => d.count), 1);
                          return data.devices.map((d) => (
                            <div key={d.device} className="flex items-center gap-3">
                              <span className="text-muted-foreground">{deviceIcon(d.device)}</span>
                              <span className="text-sm capitalize flex-1">{d.device}</span>
                              <MiniBar count={d.count} max={maxDevice} />
                              <span className="text-sm tabular-nums text-muted-foreground w-8 text-right">{d.count}</span>
                            </div>
                          ));
                        })()}
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">ব্রাউজার <span className="text-xs font-normal text-muted-foreground">Browsers</span></CardTitle>
                  </CardHeader>
                  <CardContent>
                    {data.browsers.length === 0 ? (
                      <p className="text-muted-foreground text-center py-4 text-sm">এখনো কোনো ডেটা নেই</p>
                    ) : (
                      <div className="space-y-3">
                        {(() => {
                          const maxBrowser = Math.max(...data.browsers.map((b) => b.count), 1);
                          return data.browsers.map((b) => (
                            <div key={b.browser} className="flex items-center gap-3">
                              <span className="text-sm flex-1 truncate">{b.browser}</span>
                              <MiniBar count={b.count} max={maxBrowser} />
                              <span className="text-sm tabular-nums text-muted-foreground w-8 text-right">{b.count}</span>
                            </div>
                          ));
                        })()}
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">অপারেটিং সিস্টেম <span className="text-xs font-normal text-muted-foreground">OS</span></CardTitle>
                  </CardHeader>
                  <CardContent>
                    {data.os.length === 0 ? (
                      <p className="text-muted-foreground text-center py-4 text-sm">এখনো কোনো ডেটা নেই</p>
                    ) : (
                      <div className="space-y-3">
                        {(() => {
                          const maxOS = Math.max(...data.os.map((o) => o.count), 1);
                          return data.os.map((o) => (
                            <div key={o.os} className="flex items-center gap-3">
                              <span className="text-sm flex-1">{o.os}</span>
                              <MiniBar count={o.count} max={maxOS} />
                              <span className="text-sm tabular-nums text-muted-foreground w-8 text-right">{o.count}</span>
                            </div>
                          ));
                        })()}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Recent Visits Table */}
              <Card>
                <CardHeader>
                  <CardTitle><Clock className="inline w-4 h-4 mr-1" />সাম্প্রতিক ভিজিট <span className="text-sm font-normal text-muted-foreground ml-2">Recent Visits</span></CardTitle>
                </CardHeader>
                <CardContent>
                  {data.recentVisits.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">এখনো কোনো ডেটা নেই</p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm min-w-[600px]">
                        <thead>
                          <tr className="border-b text-muted-foreground text-xs">
                            <th className="text-left pb-2 font-medium">সময় / Time</th>
                            <th className="text-left pb-2 font-medium">পেইজ / Page</th>
                            <th className="text-left pb-2 font-medium">সোর্স / Source</th>
                            <th className="text-left pb-2 font-medium">লোকেশন</th>
                            <th className="text-left pb-2 font-medium">ডিভাইস</th>
                          </tr>
                        </thead>
                        <tbody>
                          {data.recentVisits.map((v, i) => (
                            <tr key={i} className="border-b hover:bg-muted/40 transition-colors">
                              <td className="py-2 text-xs text-muted-foreground whitespace-nowrap">
                                {formatDhakaTime(v.timestamp)}
                              </td>
                              <td className="py-2 max-w-[200px]">
                                <div className="flex flex-col gap-0.5">
                                  <a
                                    href={`https://hf-engineering.vercel.app${v.path}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="font-mono text-xs text-primary hover:underline flex items-center gap-1 truncate"
                                    title={`https://hf-engineering.vercel.app${v.path}`}
                                  >
                                    <span className="truncate">{v.path}</span>
                                    <ExternalLink className="w-3 h-3 flex-shrink-0" />
                                  </a>
                                  <span className="text-[10px] text-muted-foreground truncate">
                                    hf-engineering.vercel.app{v.path}
                                  </span>
                                </div>
                              </td>
                              <td className="py-2">
                                <span
                                  className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium text-white"
                                  style={{ backgroundColor: sourceColor(v.source) }}
                                >
                                  {v.source}
                                </span>
                              </td>
                              <td className="py-2 text-xs">
                                {v.country ? (
                                  <span>{countryFlag(v.country)} {v.city || countryName(v.country)}</span>
                                ) : (
                                  <span className="text-muted-foreground">—</span>
                                )}
                              </td>
                              <td className="py-2">
                                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                  {deviceIcon(v.device)} {v.device}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </>
          ) : null}
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* TAB 2: VISITORS (GROUPED PER VISITOR)                                 */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      {activeTab === "visitors" && (
        <div className="space-y-6">

          {/* Metric Summary Cards for Visitors */}
          {visitorsData && (
            <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">মোট ভিজিটর <span className="text-xs text-muted-foreground block">Total Visitors</span></CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{visitorsData.totals.all.toLocaleString("bn-BD")}</div>
                  <p className="text-xs text-muted-foreground">নির্বাচিত {days} দিনে</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">নিবন্ধিত ক্লায়েন্ট <span className="text-xs text-muted-foreground block">Registered Clients</span></CardTitle>
                  <UserCheck className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">
                    {visitorsData.totals.registered.toLocaleString("bn-BD")}
                  </div>
                  <p className="text-xs text-muted-foreground">লগইন করা ইউজার</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">গেস্ট ভিজিটর <span className="text-xs text-muted-foreground block">Guest Visitors</span></CardTitle>
                  <User className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {visitorsData.totals.guest.toLocaleString("bn-BD")}
                  </div>
                  <p className="text-xs text-muted-foreground">সাধারণ ব্রাউজিং / আইপি</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">পেজ ভিউ ট্র্যাকিং <span className="text-xs text-muted-foreground block">Active Grouping</span></CardTitle>
                  <Layers className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {visitorsData.pagination.totalCount.toLocaleString("bn-BD")}
                  </div>
                  <p className="text-xs text-muted-foreground">ফিল্টারে প্রদর্শিত রেকর্ড</p>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Sub-Filters: Type & Search */}
          <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between bg-muted/30 p-3 rounded-lg border">
            {/* Type buttons */}
            <div className="flex items-center gap-1 bg-background border p-1 rounded-lg">
              <button
                onClick={() => { setVisitorType("all"); setPage(1); }}
                className={`px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-colors ${
                  visitorType === "all"
                    ? "bg-primary text-primary-foreground font-semibold"
                    : "text-muted-foreground hover:bg-muted"
                }`}
              >
                সব ভিজিটর ({visitorsData?.totals.all ?? 0})
              </button>
              <button
                onClick={() => { setVisitorType("registered"); setPage(1); }}
                className={`px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-colors ${
                  visitorType === "registered"
                    ? "bg-primary text-primary-foreground font-semibold"
                    : "text-muted-foreground hover:bg-muted"
                }`}
              >
                নিবন্ধিত ({visitorsData?.totals.registered ?? 0})
              </button>
              <button
                onClick={() => { setVisitorType("guest"); setPage(1); }}
                className={`px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-colors ${
                  visitorType === "guest"
                    ? "bg-primary text-primary-foreground font-semibold"
                    : "text-muted-foreground hover:bg-muted"
                }`}
              >
                গেস্ট / আইপি ({visitorsData?.totals.guest ?? 0})
              </button>
            </div>

            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="নাম, ফোন নম্বর, ক্লায়েন্ট আইডি বা আইপি..."
                className="pl-9 h-9 text-sm"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Visitors Table */}
          {loadingVisitors ? (
            <div className="flex h-[40vh] items-center justify-center">
              <div className="text-center space-y-2">
                <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
                <p className="text-muted-foreground text-sm">ভিজিটরদের ডেটা লোড হচ্ছে…</p>
              </div>
            </div>
          ) : errorVisitors ? (
            <Card className="p-8 text-center max-w-sm mx-auto">
              <AlertCircle className="w-12 h-12 mx-auto text-destructive mb-4" />
              <p className="text-muted-foreground mb-4">{errorVisitors}</p>
              <Button onClick={() => fetchVisitors(days, visitorType, debouncedSearch, page)}>
                আবার চেষ্টা করুন
              </Button>
            </Card>
          ) : !visitorsData || visitorsData.visitors.length === 0 ? (
            <Card className="p-12 text-center">
              <Users className="w-12 h-12 mx-auto text-muted-foreground/50 mb-3" />
              <h3 className="text-lg font-medium">কোনো ভিজিটর তথ্য পাওয়া যায়নি</h3>
              <p className="text-muted-foreground text-sm mt-1">
                {searchQuery
                  ? "আপনার অনুসন্ধানের সাথে মিলে এমন কোনো ভিজিটর পাওয়া যায়নি।"
                  : "এই সময়সীমার মধ্যে কোনো ভিজিটর লগ পাওয়া যায়নি।"}
              </p>
            </Card>
          ) : (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center justify-between">
                  <span>কে কোন পেজ কতবার দেখেছে (Per-Visitor Activity)</span>
                  <span className="text-xs font-normal text-muted-foreground">
                    সারি ক্লিক করে বিস্তারিত পেজ তালিকা দেখুন
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm min-w-[750px]">
                    <thead>
                      <tr className="border-b bg-muted/40 text-muted-foreground text-xs">
                        <th className="w-8 p-3"></th>
                        <th className="text-left p-3 font-medium">ভিজিটর / Visitor</th>
                        <th className="text-left p-3 font-medium">লোকেশন</th>
                        <th className="text-left p-3 font-medium">ডিভাইস ও ব্রাউজার</th>
                        <th className="text-center p-3 font-medium">মোট ভিউ</th>
                        <th className="text-center p-3 font-medium">ভিন্ন পেজ</th>
                        <th className="text-left p-3 font-medium">সর্বশেষ ভিজিট</th>
                      </tr>
                    </thead>
                    <tbody>
                      {visitorsData.visitors.map((v) => {
                        const isExpanded = !!expandedVisitors[v.id];
                        const isRegistered = v.type === "registered";
                        const maxPageCount = v.topPages.length > 0
                          ? Math.max(...v.topPages.map((p) => p.count), 1)
                          : 1;

                        return (
                          <div key={v.id} style={{ display: "contents" }}>
                            <tr
                              onClick={() => toggleExpand(v.id)}
                              className={`border-b cursor-pointer transition-colors hover:bg-muted/50 ${
                                isExpanded ? "bg-muted/30" : ""
                              }`}
                            >
                              {/* Expand Icon */}
                              <td className="p-3 text-center text-muted-foreground">
                                {isExpanded ? (
                                  <ChevronDown className="w-4 h-4 text-primary" />
                                ) : (
                                  <ChevronRight className="w-4 h-4" />
                                )}
                              </td>

                              {/* Visitor Identity */}
                              <td className="p-3">
                                {isRegistered ? (
                                  <div className="flex flex-col gap-0.5">
                                    <div className="flex items-center gap-1.5">
                                      <Badge variant="default" className="bg-green-600 hover:bg-green-700 text-[10px] px-1.5 py-0 flex items-center gap-1">
                                        <UserCheck className="w-3 h-3" /> নিবন্ধিত ক্লায়েন্ট
                                      </Badge>
                                      {v.clientId && (
                                        <span className="font-mono text-xs font-semibold text-primary">
                                          {v.clientId}
                                        </span>
                                      )}
                                    </div>
                                    <span className="font-medium text-foreground">{v.name || "নামহীন ক্লায়েন্ট"}</span>
                                    <span className="text-xs text-muted-foreground font-mono">{v.phone}</span>
                                    {v.ip && (
                                      <span className="text-[10px] text-muted-foreground font-mono mt-0.5">
                                        IP: {v.ip}
                                      </span>
                                    )}
                                  </div>
                                ) : (
                                  <div className="flex flex-col gap-0.5">
                                    <div className="flex items-center gap-1.5">
                                      <Badge variant="outline" className="text-[10px] px-1.5 py-0 text-muted-foreground">
                                        গেস্ট ভিজিটর
                                      </Badge>
                                    </div>
                                    <span className="font-mono text-xs font-semibold text-foreground">
                                      {v.ip}
                                    </span>
                                    <span className="text-[10px] text-muted-foreground">
                                      লগইন ছাড়া ব্রাউজিং
                                    </span>
                                  </div>
                                )}
                              </td>

                              {/* Location */}
                              <td className="p-3 text-xs">
                                {v.country ? (
                                  <div className="flex items-center gap-1.5">
                                    <span className="text-base">{countryFlag(v.country)}</span>
                                    <div>
                                      <div className="font-medium">{v.city || countryName(v.country)}</div>
                                      {v.city && <div className="text-[10px] text-muted-foreground">{countryName(v.country)}</div>}
                                    </div>
                                  </div>
                                ) : (
                                  <span className="text-muted-foreground">—</span>
                                )}
                              </td>

                              {/* Device & Browser */}
                              <td className="p-3 text-xs">
                                <div className="flex items-center gap-1.5">
                                  <span className="text-muted-foreground">{deviceIcon(v.device)}</span>
                                  <div>
                                    <div className="capitalize font-medium">{v.device}</div>
                                    <div className="text-[10px] text-muted-foreground">{v.browser}</div>
                                  </div>
                                </div>
                              </td>

                              {/* Total Views */}
                              <td className="p-3 text-center">
                                <span className="inline-flex items-center justify-center px-2 py-0.5 font-semibold text-xs rounded-full bg-primary/10 text-primary">
                                  {v.totalViews.toLocaleString("bn-BD")}
                                </span>
                              </td>

                              {/* Distinct Pages */}
                              <td className="p-3 text-center">
                                <span className="text-xs font-medium text-muted-foreground">
                                  {v.distinctPages.toLocaleString("bn-BD")} টি
                                </span>
                              </td>

                              {/* Last Seen */}
                              <td className="p-3 text-xs text-muted-foreground whitespace-nowrap">
                                {formatDhakaTime(v.lastSeen)}
                              </td>
                            </tr>

                            {/* Expanded Details Row */}
                            {isExpanded && (
                              <tr className="border-b bg-muted/20">
                                <td colSpan={7} className="p-4 pl-12">
                                  <div className="space-y-4">
                                    {/* Meta bar */}
                                    <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground border-b pb-2">
                                      <div>
                                        <span className="font-medium text-foreground">প্রথম ভিজিট:</span> {formatDhakaTime(v.firstSeen)}
                                      </div>
                                      <div>
                                        <span className="font-medium text-foreground">সর্বশেষ ট্র্যাফিক সোর্স:</span>{" "}
                                        <span
                                          className="inline-flex items-center px-1.5 py-0.2 rounded text-[11px] font-medium text-white ml-1"
                                          style={{ backgroundColor: sourceColor(v.topSource) }}
                                        >
                                          {v.topSource}
                                        </span>
                                      </div>
                                      {isRegistered && (
                                        <Link
                                          href={`/admin/clients`}
                                          className="inline-flex items-center gap-1 text-primary hover:underline font-medium ml-auto"
                                        >
                                          ক্লায়েন্ট প্রোফাইল দেখুন <ArrowRight className="w-3 h-3" />
                                        </Link>
                                      )}
                                    </div>

                                    {/* Pages viewed by this visitor */}
                                    <div>
                                      <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-2">
                                        এই ভিজিটরের দেখা পেইজসমূহ ({v.topPages.length} টি)
                                      </h4>
                                      <div className="space-y-2">
                                        {v.topPages.map((pageItem) => (
                                          <div
                                            key={pageItem.path}
                                            className="flex items-center gap-3 bg-background p-2 rounded-md border text-xs"
                                          >
                                            {/* Path & link */}
                                            <div className="flex-1 min-w-0">
                                              <a
                                                href={`https://hf-engineering.vercel.app${pageItem.path}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="font-mono text-primary hover:underline flex items-center gap-1 truncate"
                                                title={`https://hf-engineering.vercel.app${pageItem.path}`}
                                              >
                                                <span className="truncate">{pageItem.path}</span>
                                                <ExternalLink className="w-3 h-3 flex-shrink-0" />
                                              </a>
                                            </div>

                                            {/* Bar */}
                                            <div className="w-32 hidden sm:block">
                                              <MiniBar count={pageItem.count} max={maxPageCount} />
                                            </div>

                                            {/* Count badge */}
                                            <span className="text-right font-medium font-mono text-muted-foreground w-16">
                                              {pageItem.count.toLocaleString("bn-BD")} বার
                                            </span>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            )}
                          </div>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Pagination Controls */}
                {visitorsData.pagination.totalPages > 1 && (
                  <div className="flex items-center justify-between p-4 border-t text-sm">
                    <span className="text-xs text-muted-foreground">
                      পৃষ্ঠা {visitorsData.pagination.page} এর {visitorsData.pagination.totalPages} (মোট {visitorsData.pagination.totalCount} জন ভিজিটর)
                    </span>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={page <= 1}
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                      >
                        পূর্ববর্তী
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={page >= visitorsData.pagination.totalPages}
                        onClick={() => setPage((p) => p + 1)}
                      >
                        পরবর্তী
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

        </div>
      )}

    </div>
  );
}
