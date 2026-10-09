// TODO: Update CANONICAL_SITE_URL if your production domain differs from hfengineeringbd.com
export const CANONICAL_SITE_URL = 'https://hfengineeringbd.com';

export function getSiteUrl(): string {
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (envUrl && !envUrl.includes('localhost') && !envUrl.includes('127.0.0.1')) {
    try {
      const urlToParse = envUrl.startsWith('http://') || envUrl.startsWith('https://')
        ? envUrl
        : `https://${envUrl}`;
      const parsed = new URL(urlToParse);
      // Strictly extract the origin
      if (parsed.hostname && parsed.hostname.includes('.')) {
        return parsed.origin;
      }
    } catch {
      // fallback if URL parsing fails
    }
  }
  return CANONICAL_SITE_URL;
}

export const SITE_CONFIG = {
  name: 'HF Design & Engineering Solutions',
  shortName: 'HF',
  fullName: 'HF Design & Engineering Solutions',
  nameBn: 'এইচএফ ডিজাইন অ্যান্ড ইঞ্জিনিয়ারিং সলিউশনস',
  slogan: 'পরিকল্পিত নকশা, নিরাপদ নির্মাণ',
  sloganEn: 'Planned Design, Safe Construction',
  description:
    'Building design, 3D elevation, structural drawing, BOQ and plan approval in Savar, Dhaka.',
  url: getSiteUrl(),
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '8801631186218',
  // TODO: Verify exact Facebook page URL once configured
  facebook: 'https://www.facebook.com/profile.php?id=61592186641331',
  facebookPageName: 'HF Design & Engineering Solutions',
  // TODO: Verify official domain & email address
  email: 'info@hfengineeringbd.com',
  phone: '01631-186218',
  phoneSecondary: '01778-506500',
  phoneDisplay: '01631-186218, 01778-506500',
  address: 'আয়শা মঞ্জিল, বাড়ি ১৪/০৫, ওয়ার্ড নং ১, নয়াবাড়ি, সাভার রেডিও কলোনি, ঢাকা',
  addressEn: 'Aysha Monjil, House 14/05, Ward No 1, Noyabari, Savar Radio Colony, Dhaka',
  colors: {
    navy: '#0B2A4A',
    gold: '#F2A900',
  },
} as const;

export const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Services', href: '/services' },
  { label: 'Portfolio', href: '/portfolio' },
  { label: 'Cost Estimator', href: '/cost-estimator' },
  { label: 'Track Plan', href: '/track-plan' },
  { label: 'Book Appointment', href: '/book-appointment' },
  { label: 'Contact', href: '/contact' },
] as const;

export const SERVICES = [
  {
    id: '2d-drafting',
    title: '2D Architectural & Structural Drafting',
    description:
      'Precise floor plans, elevations, sections, and structural drawings compliant with local building codes.',
    icon: 'Ruler',
  },
  {
    id: '3d-design',
    title: '3D Exterior & Interior Design',
    description:
      'Photorealistic 3D renders of building exteriors and interior spaces for client visualization.',
    icon: 'Box',
  },
  {
    id: 'boq-estimation',
    title: 'BOQ & Cost Estimation',
    description:
      'Detailed Bill of Quantities and cost breakdowns for construction budget planning.',
    icon: 'Calculator',
  },
  {
    id: 'plan-passing',
    title: 'Plan Passing & Approval',
    description:
      'End-to-end assistance with RAJUK and local authority plan submission and approval process.',
    icon: 'FileCheck',
  },
  {
    id: 'site-supervision',
    title: 'Site Supervision',
    description:
      'On-site quality monitoring and construction supervision to ensure structural integrity.',
    icon: 'HardHat',
  },
  {
    id: 'consultation',
    title: 'Engineering Consultation',
    description:
      'Expert advice on structural feasibility, material selection, and construction planning.',
    icon: 'MessageSquare',
  },
] as const;

/**
 * Construction cost rates per sq. ft. (in BDT) for the BOQ estimator.
 * These are approximate ranges used for initial client estimates.
 */
export const COST_RATES = {
  standard: {
    foundation: { min: 350, max: 450 },
    structural: { min: 800, max: 1000 },
    finishing: { min: 450, max: 600 },
  },
  premium: {
    foundation: { min: 450, max: 600 },
    structural: { min: 1000, max: 1400 },
    finishing: { min: 700, max: 1000 },
  },
  luxury: {
    foundation: { min: 600, max: 800 },
    structural: { min: 1400, max: 2000 },
    finishing: { min: 1000, max: 1600 },
  },
} as const;

export const PROJECT_CATEGORIES = [
  { value: '2d-plan', label: '2D Plans' },
  { value: '3d-exterior', label: '3D Exterior' },
  { value: '3d-interior', label: '3D Interior' },
  { value: 'construction', label: 'Construction Sites' },
] as const;
