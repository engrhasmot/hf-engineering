import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import PageView from '@/models/pageview.model';
import { verifyToken, getTokenFromRequest } from '@/lib/auth';
import { hasPermission } from '@/lib/permissions';

// ── Timezone helper (Asia/Dhaka = UTC+6) ───────────────────────────────────
const DHAKA_OFFSET_MS = 6 * 60 * 60 * 1000;

function dhakaDateBoundary(daysAgo: number): Date {
  const now = new Date();
  const dhakaMs = now.getTime() + DHAKA_OFFSET_MS;
  const dhakaNow = new Date(dhakaMs);
  const startOfToday = Date.UTC(dhakaNow.getUTCFullYear(), dhakaNow.getUTCMonth(), dhakaNow.getUTCDate());
  const startOfTargetDay = startOfToday - daysAgo * 86400000;
  return new Date(startOfTargetDay - DHAKA_OFFSET_MS);
}

export async function GET(req: NextRequest) {
  // ── 1. Auth & Permission Check ──────────────────────────────────────────
  const token = getTokenFromRequest(req);
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const session = await verifyToken(token);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (!hasPermission((session as any).role, 'canViewAnalytics')) {
    return NextResponse.json({ error: 'Forbidden: insufficient permissions' }, { status: 403 });
  }

  // ── 2. Query Parameters ──────────────────────────────────────────────────
  const searchParams = req.nextUrl.searchParams;
  const daysParam = Number(searchParams.get('days') ?? '30');
  const days = [1, 7, 30, 90].includes(daysParam) ? daysParam : 30;

  const typeParam = searchParams.get('type') ?? 'all';
  const typeFilter = ['registered', 'guest'].includes(typeParam) ? typeParam : 'all';

  const q = (searchParams.get('q') ?? '').trim();
  const page = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10) || 1);
  const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') ?? '20', 10) || 20));

  const since = dhakaDateBoundary(days);

  await dbConnect();

  // ── 3. Aggregation Pipeline ──────────────────────────────────────────────
  const addVisitorKeyStage = {
    $addFields: {
      visitorKey: {
        $cond: {
          if: { $and: [{ $ne: ['$userId', null] }, { $ne: ['$userId', ''] }] },
          then: { $concat: ['user_', '$userId'] },
          else: {
            $cond: {
              if: { $and: [{ $ne: ['$ipRaw', null] }, { $ne: ['$ipRaw', ''] }] },
              then: { $concat: ['ip_', '$ipRaw'] },
              else: { $concat: ['hash_', { $ifNull: ['$ip', 'unknown'] }] },
            },
          },
        },
      },
    },
  };

  // Group by visitor + path to calculate counts per page per visitor
  const groupByVisitorPathStage = {
    $group: {
      _id: { visitorKey: '$visitorKey', path: '$path' },
      pathCount: { $sum: 1 },
      firstSeen: { $min: '$timestamp' },
      lastSeen: { $max: '$timestamp' },
      userId: { $last: '$userId' },
      userName: { $last: '$userName' },
      userPhone: { $last: '$userPhone' },
      userClientId: { $last: '$userClientId' },
      ipRaw: { $last: '$ipRaw' },
      ipHash: { $last: '$ip' },
      country: { $last: '$country' },
      city: { $last: '$city' },
      device: { $last: '$device' },
      browser: { $last: '$browser' },
      source: { $last: '$source' },
    },
  };

  // Sort paths desc within visitor
  const sortByPathCountStage = { $sort: { pathCount: -1 as const } };

  // Group by visitor to roll up all pages
  const groupByVisitorStage = {
    $group: {
      _id: '$_id.visitorKey',
      totalViews: { $sum: '$pathCount' },
      distinctPages: { $sum: 1 },
      firstSeen: { $min: '$firstSeen' },
      lastSeen: { $max: '$lastSeen' },
      userId: { $first: '$userId' },
      userName: { $first: '$userName' },
      userPhone: { $first: '$userPhone' },
      userClientId: { $first: '$userClientId' },
      ipRaw: { $first: '$ipRaw' },
      ipHash: { $first: '$ipHash' },
      country: { $first: '$country' },
      city: { $first: '$city' },
      device: { $first: '$device' },
      browser: { $first: '$browser' },
      topSource: { $first: '$source' },
      pages: { $push: { path: '$_id.path', count: '$pathCount' } },
    },
  };

  const addVisitorMetadataStage = {
    $addFields: {
      type: {
        $cond: {
          if: { $and: [{ $ne: ['$userId', null] }, { $ne: ['$userId', ''] }] },
          then: 'registered',
          else: 'guest',
        },
      },
      topPages: { $slice: ['$pages', 20] },
      ipDisplay: {
        $cond: {
          if: { $and: [{ $ne: ['$ipRaw', null] }, { $ne: ['$ipRaw', ''] }] },
          then: '$ipRaw',
          else: 'পুরনো রেকর্ড (Old Record)',
        },
      },
    },
  };

  // Build filtering criteria for type and search term
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const filterCriteria: Record<string, any> = {};
  if (typeFilter === 'registered') {
    filterCriteria.type = 'registered';
  } else if (typeFilter === 'guest') {
    filterCriteria.type = 'guest';
  }

  if (q) {
    const escapedQ = q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    filterCriteria.$or = [
      { userName: { $regex: escapedQ, $options: 'i' } },
      { userPhone: { $regex: escapedQ, $options: 'i' } },
      { userClientId: { $regex: escapedQ, $options: 'i' } },
      { ipRaw: { $regex: escapedQ, $options: 'i' } },
      { ipDisplay: { $regex: escapedQ, $options: 'i' } },
    ];
  }

  const matchFilterStage = Object.keys(filterCriteria).length > 0
    ? [{ $match: filterCriteria }]
    : [];

  const facetStage = {
    $facet: {
      metadata: [{ $count: 'total' }],
      visitors: [
        { $sort: { totalViews: -1 as const, lastSeen: -1 as const } },
        { $skip: (page - 1) * limit },
        { $limit: limit },
        {
          $project: {
            _id: 0,
            id: '$_id',
            type: 1,
            userId: { $ifNull: ['$userId', ''] },
            name: { $ifNull: ['$userName', ''] },
            phone: { $ifNull: ['$userPhone', ''] },
            clientId: { $ifNull: ['$userClientId', ''] },
            ip: '$ipDisplay',
            country: { $ifNull: ['$country', ''] },
            city: { $ifNull: ['$city', ''] },
            device: { $ifNull: ['$device', 'desktop'] },
            browser: { $ifNull: ['$browser', 'Other'] },
            totalViews: 1,
            distinctPages: 1,
            firstSeen: 1,
            lastSeen: 1,
            topPages: 1,
            topSource: { $ifNull: ['$topSource', 'Direct'] },
          },
        },
      ],
    },
  };

  // ── 4. Execute aggregation & total counts in parallel ─────────────────────
  const [visitorResults, overallCounts] = await Promise.all([
    PageView.aggregate([
      { $match: { timestamp: { $gte: since } } },
      addVisitorKeyStage,
      groupByVisitorPathStage,
      sortByPathCountStage,
      groupByVisitorStage,
      addVisitorMetadataStage,
      ...matchFilterStage,
      facetStage,
    ]),

    // Fast count breakdown for registered vs guest in period
    PageView.aggregate([
      { $match: { timestamp: { $gte: since } } },
      addVisitorKeyStage,
      {
        $group: {
          _id: '$visitorKey',
          userId: { $first: '$userId' },
        },
      },
      {
        $group: {
          _id: {
            $cond: {
              if: { $and: [{ $ne: ['$userId', null] }, { $ne: ['$userId', ''] }] },
              then: 'registered',
              else: 'guest',
            },
          },
          count: { $sum: 1 },
        },
      },
    ]),
  ]);

  const facetResult = visitorResults[0] ?? { metadata: [], visitors: [] };
  const totalCount = facetResult.metadata[0]?.total ?? 0;
  const visitors = facetResult.visitors ?? [];
  const totalPages = Math.ceil(totalCount / limit) || 1;

  let totalRegistered = 0;
  let totalGuest = 0;
  for (const item of overallCounts) {
    if (item._id === 'registered') totalRegistered = item.count;
    if (item._id === 'guest') totalGuest = item.count;
  }

  return NextResponse.json({
    days,
    type: typeFilter,
    q,
    pagination: {
      page,
      limit,
      totalCount,
      totalPages,
    },
    totals: {
      registered: totalRegistered,
      guest: totalGuest,
      all: totalRegistered + totalGuest,
    },
    visitors,
  });
}
