import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import PageView from '@/models/pageview.model';
import { verifyToken, getTokenFromRequest } from '@/lib/auth';
import { hasPermission } from '@/lib/permissions';

// ── Timezone helpers (Asia/Dhaka = UTC+6) ────────────────────────────────
const DHAKA_OFFSET_MS = 6 * 60 * 60 * 1000;

function dhakaDateBoundary(daysAgo: number): Date {
  const now = new Date();
  const dhakaMs = now.getTime() + DHAKA_OFFSET_MS;
  const dhakaNow = new Date(dhakaMs);
  const startOfToday = Date.UTC(dhakaNow.getUTCFullYear(), dhakaNow.getUTCMonth(), dhakaNow.getUTCDate());
  const startOfTargetDay = startOfToday - daysAgo * 86400000;
  return new Date(startOfTargetDay - DHAKA_OFFSET_MS);
}

function dhakaStartOfToday(): Date {
  return dhakaDateBoundary(0);
}

// Fill in missing days in a daily series with 0-count entries
function fillDailySeries(
  raw: { date: string; count: number }[],
  days: number
): { date: string; count: number }[] {
  const map = new Map(raw.map((r) => [r.date, r.count]));
  const result: { date: string; count: number }[] = [];
  const now = new Date();
  const dhakaMs = now.getTime() + DHAKA_OFFSET_MS;
  const dhakaNow = new Date(dhakaMs);
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(
      Date.UTC(dhakaNow.getUTCFullYear(), dhakaNow.getUTCMonth(), dhakaNow.getUTCDate()) -
        i * 86400000
    );
    const key = d.toISOString().slice(0, 10);
    result.push({ date: key, count: map.get(key) ?? 0 });
  }
  return result;
}

// ── Extract referrer host from raw referrer string (for old documents) ────
// Used inside MongoDB $addFields so we must replicate in aggregation with $regexFind.
// We handle it at JS level for simplicity after fetch.

export async function GET(req: NextRequest) {
  // ── Auth ────────────────────────────────────────────────────────────────
  const token = getTokenFromRequest(req);
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const session = await verifyToken(token);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (!hasPermission((session as any).role, 'canViewAnalytics')) {
    return NextResponse.json({ error: 'Forbidden: insufficient permissions' }, { status: 403 });
  }

  // ── Query params ─────────────────────────────────────────────────────────
  const searchParams = req.nextUrl.searchParams;
  const daysParam = Number(searchParams.get('days') ?? '30');
  const days = [1, 7, 30, 90].includes(daysParam) ? daysParam : 30;
  const pathFilter = searchParams.get('path') ?? '';

  const since = dhakaDateBoundary(days);
  const todayStart = dhakaStartOfToday();

  // Base match for range
  const rangeMatch: Record<string, unknown> = { timestamp: { $gte: since } };
  // Filtered match (adds path filter when provided)
  const filteredMatch: Record<string, unknown> = pathFilter
    ? { ...rangeMatch, path: pathFilter }
    : { ...rangeMatch };

  // Aggregation expression: resolve source for old documents that may only have `referrer`
  const sourceExpr = {
    $cond: {
      if: { $and: [{ $ne: ['$source', null] }, { $ne: ['$source', ''] }] },
      then: '$source',
      else: {
        $cond: {
          if: { $and: [{ $ne: ['$referrer', null] }, { $ne: ['$referrer', ''] }] },
          then: { $literal: 'Direct' }, // old doc without source — classify as Direct
          else: { $literal: 'Direct' },
        },
      },
    },
  };

  await dbConnect();

  const [
    summaryArr,
    dailyRaw,
    topPages,
    sourcesArr,
    referrerDomainsArr,
    countriesArr,
    citiesArr,
    devicesArr,
    browsersArr,
    osArr,
    recentVisits,
    // Legacy compat: total alltime + unique all-time
    totalPageViewsAll,
    uniqueVisitorsAllArr,
    pageViewsByPath,
  ] = await Promise.all([
    // ── Summary (within range, filtered if path set) ──────────────────
    PageView.aggregate([
      { $match: filteredMatch },
      {
        $group: {
          _id: null,
          views: { $sum: 1 },
          uniqueVisitors: { $addToSet: '$ip' },
        },
      },
      {
        $project: {
          _id: 0,
          views: 1,
          uniqueVisitors: { $size: '$uniqueVisitors' },
        },
      },
    ]),

    // ── Daily series (within range, filtered) ────────────────────────
    PageView.aggregate([
      { $match: filteredMatch },
      {
        $group: {
          _id: {
            $dateToString: {
              format: '%Y-%m-%d',
              date: '$timestamp',
              timezone: 'Asia/Dhaka',
            },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
      { $project: { date: '$_id', count: 1, _id: 0 } },
    ]),

    // ── Top Pages — NOT filtered by path, always top 25 in range ────
    PageView.aggregate([
      { $match: rangeMatch },
      {
        $group: {
          _id: '$path',
          views: { $sum: 1 },
          uniqueVisitors: { $addToSet: '$ip' },
        },
      },
      { $sort: { views: -1 } },
      { $limit: 25 },
      {
        $project: {
          _id: 0,
          path: '$_id',
          views: 1,
          uniqueVisitors: { $size: '$uniqueVisitors' },
        },
      },
    ]),

    // ── Sources (filtered) ────────────────────────────────────────────
    PageView.aggregate([
      { $match: filteredMatch },
      {
        $group: {
          _id: sourceExpr,
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $project: { source: { $ifNull: ['$_id', 'Direct'] }, count: 1, _id: 0 } },
    ]),

    // ── Referrer domains (filtered) ───────────────────────────────────
    PageView.aggregate([
      { $match: { ...filteredMatch, referrerHost: { $exists: true, $nin: ['', null] } } },
      { $group: { _id: '$referrerHost', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 20 },
      { $project: { domain: '$_id', count: 1, _id: 0 } },
    ]),

    // ── Countries (filtered) ──────────────────────────────────────────
    PageView.aggregate([
      { $match: { ...filteredMatch, country: { $ne: '', $exists: true } } },
      { $group: { _id: '$country', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 30 },
      { $project: { country: '$_id', count: 1, _id: 0 } },
    ]),

    // ── Cities (filtered) ─────────────────────────────────────────────
    PageView.aggregate([
      { $match: { ...filteredMatch, city: { $ne: '', $exists: true } } },
      { $group: { _id: '$city', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 20 },
      { $project: { city: '$_id', count: 1, _id: 0 } },
    ]),

    // ── Devices (filtered) ────────────────────────────────────────────
    PageView.aggregate([
      { $match: { ...filteredMatch, device: { $ne: '', $exists: true } } },
      { $group: { _id: '$device', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $project: { device: '$_id', count: 1, _id: 0 } },
    ]),

    // ── Browsers (filtered) ───────────────────────────────────────────
    PageView.aggregate([
      { $match: { ...filteredMatch, browser: { $ne: '', $exists: true } } },
      { $group: { _id: '$browser', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $project: { browser: '$_id', count: 1, _id: 0 } },
    ]),

    // ── OS (filtered) ─────────────────────────────────────────────────
    PageView.aggregate([
      { $match: { ...filteredMatch, os: { $ne: '', $exists: true } } },
      { $group: { _id: '$os', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $project: { os: '$_id', count: 1, _id: 0 } },
    ]),

    // ── Recent visits 40 — NO raw UA or IP ───────────────────────────
    PageView.aggregate([
      { $match: filteredMatch },
      { $sort: { timestamp: -1 } },
      { $limit: 40 },
      {
        $project: {
          _id: 0,
          timestamp: 1,
          path: 1,
          source: { $ifNull: ['$source', 'Direct'] },
          country: { $ifNull: ['$country', ''] },
          city: { $ifNull: ['$city', ''] },
          device: { $ifNull: ['$device', ''] },
        },
      },
    ]),

    // ── Backward-compat: total all-time page views ────────────────────
    PageView.countDocuments(),

    // ── Backward-compat: unique all-time visitors ─────────────────────
    PageView.distinct('ip'),

    // ── Backward-compat: top paths by views (top 10) ─────────────────
    PageView.aggregate([
      { $group: { _id: '$path', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
      { $project: { path: '$_id', count: 1, _id: 0 } },
    ]),
  ]);

  // ── Today's views (filtered) ─────────────────────────────────────────────
  const todayMatch = pathFilter
    ? { timestamp: { $gte: todayStart }, path: pathFilter }
    : { timestamp: { $gte: todayStart } };
  const todayViews = await PageView.countDocuments(todayMatch);

  // ── Build legacy pageViewsByDate (30-day, no filter) for compat ──────────
  const legacyDateRaw = await PageView.aggregate([
    { $match: { timestamp: { $gte: dhakaDateBoundary(30) } } },
    {
      $group: {
        _id: {
          $dateToString: { format: '%Y-%m-%d', date: '$timestamp', timezone: 'Asia/Dhaka' },
        },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
    { $project: { date: '$_id', count: 1, _id: 0 } },
  ]);

  // ── Assemble response ─────────────────────────────────────────────────────
  const summary = summaryArr[0] ?? { views: 0, uniqueVisitors: 0 };
  const topSource = sourcesArr[0]?.source ?? 'Direct';

  return NextResponse.json({
    // ── New fields ──────────────────────────────────────────────────────
    days,
    pathFilter,
    summary: {
      views: summary.views,
      uniqueVisitors: summary.uniqueVisitors,
      today: todayViews,
      topSource,
    },
    dailySeries: fillDailySeries(dailyRaw, days),
    topPages,
    sources: sourcesArr,
    referrerDomains: referrerDomainsArr,
    countries: countriesArr,
    cities: citiesArr,
    devices: devicesArr,
    browsers: browsersArr,
    os: osArr,
    recentVisits,

    // ── Backward-compat fields (keep existing consumers working) ────────
    totalPageViews: totalPageViewsAll,
    uniqueVisitors: uniqueVisitorsAllArr.length,
    pageViewsByPath,
    pageViewsByDate: legacyDateRaw,
    todayViews,
  });
}
