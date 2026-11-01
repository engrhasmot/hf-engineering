"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Eye, Users, Activity, RefreshCw, Loader2, AlertCircle,
  Globe, Smartphone, Monitor, Tablet, X, TrendingUp, Clock,
  ToggleLeft, ToggleRight, ExternalLink,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { adminFetch } from "@/lib/admin-fetch";

// ── Types ─────────────────────────────────────────────────────────────────
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
  // legacy
  totalPageViews: number;
  uniqueVisitors: number;
  todayViews: number;
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
  return new Date(ts).toLocaleString("bn-BD", { timeZone: "Asia/Dhaka", hour12: true, dateStyle: "short", timeStyle: "short" });
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

// ── Mini bar component ────────────────────────────────────────────────────
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

// ── Main Page ─────────────────────────────────────────────────────────────
export default function AdminAnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [days, setDays] = useState(30);
  const [pathFilter, setPathFilter] = useState("");
  const [noTrack, setNoTrack] = useState(false);

  useEffect(() => {
    setNoTrack(localStorage.getItem("hf_no_track") === "1");
  }, []);

  const fetchAnalytics = useCallback(async (d: number, pf: string) => {
    setLoading(true);
    setError(null);
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
      setError(err instanceof Error ? err.message : "কিছু একটা ভুল হয়েছে");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAnalytics(days, pathFilter); }, [fetchAnalytics, days, pathFilter]);

  const handleRangeChange = (d: number) => { setDays(d); };
  const handlePageClick = (path: string) => { setPathFilter(path); };
  const clearFilter = () => { setPathFilter(""); };

  const toggleTracking = () => {
    const next = !noTrack;
    setNoTrack(next);
    localStorage.setItem("hf_no_track", next ? "1" : "0");
  };

  // ── Loading ───────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="text-center space-y-2">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground text-sm">ডেটা লোড হচ্ছে…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Card className="p-8 text-center max-w-sm">
          <AlertCircle className="w-12 h-12 mx-auto text-destructive mb-4" />
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={() => fetchAnalytics(days, pathFilter)}>আবার চেষ্টা করুন</Button>
        </Card>
      </div>
    );
  }

  if (!data) return null;

  const maxDaily   = Math.max(...data.dailySeries.map((d) => d.count), 1);
  const maxSource  = Math.max(...data.sources.map((s) => s.count), 1);
  const maxCountry = Math.max(...data.countries.map((c) => c.count), 1);
  const maxDevice  = Math.max(...data.devices.map((d) => d.count), 1);
  const maxBrowser = Math.max(...data.browsers.map((b) => b.count), 1);
  const maxOS      = Math.max(...data.os.map((o) => o.count), 1);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">

      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">ভিজিটর লগ</h1>
          <p className="text-muted-foreground mt-1 text-sm">Analytics — পেইজ ভিউ ও ভিজিটর তথ্য</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {/* Range selector */}
          <div className="flex border rounded-lg overflow-hidden">
            {RANGE_OPTIONS.map((opt) => (
              <button
                key={opt.days}
                onClick={() => handleRangeChange(opt.days)}
                className={`px-3 py-1.5 text-sm font-medium transition-colors ${
                  days === opt.days
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted text-muted-foreground"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
          <Button variant="outline" size="sm" onClick={() => fetchAnalytics(days, pathFilter)}>
            <RefreshCw className="w-4 h-4 mr-1" /> রিফ্রেশ
          </Button>
          {/* Tracking toggle */}
          <Button
            variant={noTrack ? "destructive" : "secondary"}
            size="sm"
            onClick={toggleTracking}
            title="Toggle tracking for this device"
          >
            {noTrack ? <ToggleLeft className="w-4 h-4 mr-1" /> : <ToggleRight className="w-4 h-4 mr-1" />}
            {noTrack ? "ট্র্যাকিং বন্ধ" : "ট্র্যাকিং চালু"}
          </Button>
        </div>
      </div>

      {/* Path filter chip */}
      {pathFilter && (
        <div className="flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-lg px-3 py-2 w-fit">
          <span className="text-sm font-mono text-primary">{pathFilter}</span>
          <button onClick={clearFilter} className="text-primary hover:text-primary/70">
            <X className="w-4 h-4" />
          </button>
          <span className="text-xs text-muted-foreground">— ফিল্টার সক্রিয়</span>
        </div>
      )}

      {/* ── Summary Cards ─────────────────────────────────────────────────── */}
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
            <p className="text-xs text-muted-foreground">ভিন্ন ডিভাইস</p>
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

      {/* ── Daily Chart ───────────────────────────────────────────────────── */}
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
                {data.dailySeries.map((item) => (
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
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* ── Page Table + Sources ──────────────────────────────────────────── */}
      <div className="grid gap-4 lg:grid-cols-2">

        {/* Page-wise Table */}
        <Card>
          <CardHeader>
            <CardTitle>পেইজ ভিউ <span className="text-sm font-normal text-muted-foreground ml-2">Page Views</span></CardTitle>
            <p className="text-xs text-muted-foreground">ফিল্টার আইকনে ক্লিক করলে ফিল্টার হবে · লিংক আইকনে ক্লিক করলে পেইজ খুলবে</p>
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

        {/* Traffic Sources */}
        <Card>
          <CardHeader>
            <CardTitle>ট্র্যাফিক সোর্স <span className="text-sm font-normal text-muted-foreground ml-2">Where visitors come from</span></CardTitle>
          </CardHeader>
          <CardContent>
            {data.sources.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">এখনো কোনো ডেটা নেই</p>
            ) : (
              <div className="space-y-3">
                {data.sources.map((s) => (
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
                ))}

                {/* Referrer domains */}
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

      {/* ── Locations ─────────────────────────────────────────────────────── */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle><Globe className="inline w-4 h-4 mr-1" />দেশ <span className="text-sm font-normal text-muted-foreground ml-2">Countries</span></CardTitle>
          </CardHeader>
          <CardContent>
            {data.countries.length === 0 ? (
              <p className="text-muted-foreground text-center py-4 text-sm">এখনো কোনো ডেটা নেই (Vercel-এ Deploy করলে দেখা যাবে)</p>
            ) : (
              <div className="space-y-2">
                {data.countries.map((c) => (
                  <div key={c.country} className="flex items-center gap-3">
                    <span className="text-lg w-8">{countryFlag(c.country)}</span>
                    <span className="text-sm flex-1 truncate">{countryName(c.country)}</span>
                    <MiniBar count={c.count} max={maxCountry} />
                    <span className="text-sm tabular-nums text-muted-foreground w-8 text-right">{c.count}</span>
                  </div>
                ))}
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

      {/* ── Devices / Browsers / OS ───────────────────────────────────────── */}
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
                {data.devices.map((d) => (
                  <div key={d.device} className="flex items-center gap-3">
                    <span className="text-muted-foreground">{deviceIcon(d.device)}</span>
                    <span className="text-sm capitalize flex-1">{d.device}</span>
                    <MiniBar count={d.count} max={maxDevice} />
                    <span className="text-sm tabular-nums text-muted-foreground w-8 text-right">{d.count}</span>
                  </div>
                ))}
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
                {data.browsers.map((b) => (
                  <div key={b.browser} className="flex items-center gap-3">
                    <span className="text-sm flex-1 truncate">{b.browser}</span>
                    <MiniBar count={b.count} max={maxBrowser} />
                    <span className="text-sm tabular-nums text-muted-foreground w-8 text-right">{b.count}</span>
                  </div>
                ))}
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
                {data.os.map((o) => (
                  <div key={o.os} className="flex items-center gap-3">
                    <span className="text-sm flex-1">{o.os}</span>
                    <MiniBar count={o.count} max={maxOS} />
                    <span className="text-sm tabular-nums text-muted-foreground w-8 text-right">{o.count}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* ── Recent Visits ─────────────────────────────────────────────────── */}
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

    </div>
  );
}
