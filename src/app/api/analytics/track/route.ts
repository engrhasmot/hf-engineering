import { NextRequest, NextResponse } from 'next/server';
import { createHash } from 'crypto';
import dbConnect from '@/lib/db';
import PageView from '@/models/pageview.model';

// ── Bot / crawler detection ────────────────────────────────────────────────
const BOT_PATTERNS = [
  /googlebot/i,
  /bingbot/i,
  /slurp/i,
  /duckduckbot/i,
  /baidu/i,
  /yandex/i,
  /facebookexternalhit/i,
  /whatsapp/i,
  /twitterbot/i,
  /linkedinbot/i,
  /rogerbot/i,
  /embedly/i,
  /quora link preview/i,
  /showyoubot/i,
  /outbrain/i,
  /pinterest/i,
  /slackbot/i,
  /vkshare/i,
  /w3c_validator/i,
  /curl/i,
  /python-requests/i,
  /wget/i,
  /go-http-client/i,
  /java\//i,
  /headlesschrome/i,
  /phantomjs/i,
  /lighthouse/i,
  /chrome-lighthouse/i,
  /pagespeed/i,
  /ahrefs/i,
  /semrush/i,
  /mj12bot/i,
  /dotbot/i,
];

function isBot(ua: string): boolean {
  return BOT_PATTERNS.some((p) => p.test(ua));
}

// ── Source classification ──────────────────────────────────────────────────
function classifySource(referrerHost: string, utmSource: string): string {
  if (utmSource) return utmSource;
  if (!referrerHost) return 'Direct';
  const h = referrerHost.toLowerCase();
  if (h.includes('facebook.com') || h.includes('fb.com') || h.includes('l.facebook') || h.includes('m.facebook'))
    return 'Facebook';
  if (h.includes('messenger.com')) return 'Messenger';
  if (h.includes('instagram.com')) return 'Instagram';
  if (h.includes('google.')) return 'Google';
  if (h.includes('bing.com')) return 'Bing';
  if (h.includes('youtube.com')) return 'YouTube';
  if (h.includes('whatsapp.com') || h.includes('wa.me')) return 'WhatsApp';
  if (h.includes('t.co') || h.includes('twitter.com') || h.includes('x.com')) return 'Twitter/X';
  if (h.includes('linkedin.com')) return 'LinkedIn';
  return referrerHost;
}

// ── User-Agent parsing ─────────────────────────────────────────────────────
interface ParsedUA {
  device: string;
  browser: string;
  os: string;
}

function parseUserAgent(ua: string): ParsedUA {
  const u = ua.toLowerCase();

  // Device
  let device = 'desktop';
  if (/ipad|tablet|kindle|silk|playbook/.test(u)) {
    device = 'tablet';
  } else if (/mobile|iphone|ipod|android.*mobile|windows phone|blackberry|opera mini|iemobile/.test(u)) {
    device = 'mobile';
  }

  // Browser (order matters — check in-app browsers first)
  let browser = 'Other';
  if (/fban|fbav|instagram|instagram\.com/.test(u) && /instagram/.test(u)) {
    browser = 'Instagram App';
  } else if (/fban|fbav/.test(u)) {
    browser = 'Facebook App';
  } else if (/edg\//.test(u)) {
    browser = 'Edge';
  } else if (/opr\/|opera/.test(u)) {
    browser = 'Opera';
  } else if (/samsungbrowser/.test(u)) {
    browser = 'Samsung Browser';
  } else if (/ucbrowser/.test(u)) {
    browser = 'UC Browser';
  } else if (/chrome\//.test(u) && !/chromium/.test(u)) {
    browser = 'Chrome';
  } else if (/firefox\//.test(u)) {
    browser = 'Firefox';
  } else if (/safari\//.test(u)) {
    browser = 'Safari';
  } else if (/msie|trident/.test(u)) {
    browser = 'Internet Explorer';
  }

  // OS
  let os = 'Other';
  if (/windows nt/.test(u)) {
    os = 'Windows';
  } else if (/iphone|ipad|ipod/.test(u)) {
    os = 'iOS';
  } else if (/android/.test(u)) {
    os = 'Android';
  } else if (/mac os x|macos/.test(u)) {
    os = 'macOS';
  } else if (/linux/.test(u)) {
    os = 'Linux';
  }

  return { device, browser, os };
}

// ── Extract referrer host safely ───────────────────────────────────────────
function extractHost(referrer: string): string {
  if (!referrer) return '';
  try {
    return new URL(referrer).hostname.replace(/^www\./, '');
  } catch {
    return '';
  }
}

// ── Route handler ──────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const ua = req.headers.get('user-agent') || '';

    // Skip bots
    if (isBot(ua)) {
      return NextResponse.json({ success: true });
    }

    const body = await req.json();
    const { referrer, referrerHost: clientReferrerHost, utmSource } = body as {
      path?: string;
      referrer?: string;
      referrerHost?: string;
      utmSource?: string;
    };

    // Validate and clean path
    let rawPath: string = typeof body.path === 'string' ? body.path : '';
    if (!rawPath) {
      return NextResponse.json({ error: 'Path is required' }, { status: 400 });
    }

    // Strip query string and hash; skip admin/api/_next paths
    try {
      const url = new URL(rawPath, 'http://localhost');
      rawPath = url.pathname;
    } catch {
      rawPath = rawPath.split('?')[0].split('#')[0];
    }

    if (
      rawPath.startsWith('/admin') ||
      rawPath.startsWith('/api') ||
      rawPath.startsWith('/_next')
    ) {
      return NextResponse.json({ success: true });
    }

    // IP hash (privacy — never store raw IP)
    const ipRaw =
      req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      req.headers.get('x-real-ip') ||
      '127.0.0.1';
    const ipHash = createHash('sha256').update(ipRaw).digest('hex');

    // Geo from Vercel headers (empty locally — that's fine)
    const country = req.headers.get('x-vercel-ip-country') || '';
    const region = req.headers.get('x-vercel-ip-country-region') || '';
    const cityEncoded = req.headers.get('x-vercel-ip-city') || '';
    let city = '';
    try { city = cityEncoded ? decodeURIComponent(cityEncoded) : ''; } catch { city = cityEncoded; }

    // Resolve referrer host
    const referrerHost = clientReferrerHost || extractHost(referrer || '');

    // Classify source
    const source = classifySource(referrerHost, utmSource || '');

    // Parse UA
    const { device, browser, os } = parseUserAgent(ua);

    await dbConnect();
    await PageView.create({
      path: rawPath,
      referrer: referrer || '',
      userAgent: ua,
      ip: ipHash,
      timestamp: new Date(),
      referrerHost,
      source,
      utmSource: utmSource || '',
      country,
      region,
      city,
      device,
      browser,
      os,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Analytics Track Error:', error);
    return NextResponse.json({ error: 'Failed to track page view' }, { status: 500 });
  }
}
