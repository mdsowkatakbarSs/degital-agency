/* Client-safe shared types & constants for site settings and announcements.
   NEVER import server-only modules (next/headers, supabase/server) here. */

export interface WhyUsFeature {
  title: string;
  description: string;
  icon: string;
}

export interface SiteSettings {
  announcement_enabled: boolean;
  hero_badge: string;
  hero_title: string;
  hero_subtitle: string;
  hero_description: string;
  footer_tagline: string;
  /* Site identity */
  site_name: string;
  site_description: string;
  /* Services section headings */
  services_title: string;
  services_subtitle: string;
  /* Why Us section */
  why_us_title: string;
  why_us_subtitle: string;
  why_us_features: WhyUsFeature[];
  /* Order / How It Works section */
  order_title: string;
  order_subtitle: string;
  order_description: string;
  /* Live activity ticker (footer) */
  ticker_enabled: boolean;
  activity_feed: string[];
  /* Contact details (admin-editable) */
  contact_email: string;
  contact_whatsapp: string;
  service_country: string;
  /* Payment details (admin-editable, shown at checkout only) */
  payment_zelle_email: string;
  payment_cashapp_cashtag: string;
  payment_cashapp_qr: string;
  /* Footer columns */
  footer_quick_links_title: string;
  footer_platforms_title: string;
  footer_popular_title: string;
  footer_popular_services: string[];
}

export const DEFAULT_SETTINGS: SiteSettings = {
  announcement_enabled: true,
  hero_badge: "Welcome To Our Platform",
  hero_title: "Grow Faster. Reach Further. Monetize Smarter.",
  hero_subtitle:
    "Your Trusted Partner For Social Media Growth & Monetization Services",
  hero_description:
    "We provide professional solutions to help creators, influencers, businesses & brands grow their online presence across the world's leading social media platforms.",
  footer_tagline: "Grow Faster. Reach Further. Monetize Smarter.",
  site_name: "ytgrowthgear.shop",
  site_description:
    "Your trusted partner for social media growth and monetization services.",
  services_title: "Our Services",
  services_subtitle:
    "Professional growth & monetization solutions for every major platform.",
  why_us_title: "Why Choose Us",
  why_us_subtitle: "Trusted service, safe methods and support you can rely on.",
  why_us_features: [
    { title: "Real & Reliable Growth", description: "High-quality services across YouTube, Facebook, Instagram and TikTok with delivery you can count on.", icon: "TrendingUp" },
    { title: "Monetization Experts", description: "Dedicated monetization packages for YouTube and Facebook that help you unlock earnings faster.", icon: "BadgeDollarSign" },
    { title: "Fast Delivery Start", description: "Orders begin processing quickly after confirmation so your growth starts without delay.", icon: "Zap" },
    { title: "Safe & Secure", description: "No password required. Our methods are safe for your accounts and follow platform-friendly practices.", icon: "ShieldCheck" },
    { title: "Affordable Pricing", description: "Competitive rates for creators, influencers, businesses and brands of every size.", icon: "Wallet" },
    { title: "Dedicated Support", description: "Friendly support to help you pick the right service, place your order and track progress.", icon: "Headset" },
  ],
  order_title: "Place Your Order",
  order_subtitle: "Pick a package, complete the payment, upload your screenshot -- we handle the rest.",
  order_description: "Payment details (Zelle email & CashApp QR) are shown at checkout, right after you confirm your purchase -- so everything you need is in one place.",
  ticker_enabled: true,
  activity_feed: [
    "Order #1042 Completed - YouTube 5K Views Delivered",
    "Order #1041 Completed - YouTube Monetization Support Delivered",
    "Order #1040 Completed - YouTube 1K Views Delivered",
    "New orders are being processed right now...",
    "500+ orders delivered to creators worldwide",
  ],
  contact_email: "ytgrowthgear2026@gmail.com",
  contact_whatsapp: "+8801761391880",
  service_country: "Bangladesh",
  payment_zelle_email: "prakashauzee15@gmail.com",
  payment_cashapp_cashtag: "$AimeeKhuu",
  payment_cashapp_qr: "/payments/cashapp-qr.jpg",
  footer_quick_links_title: "Quick Links",
  footer_platforms_title: "Platform Services",
  footer_popular_title: "Popular Services",
  footer_popular_services: [
    "YouTube Monetization Package",
    "Facebook Monetization Package",
    "YouTube Watch Time",
    "Instagram Followers",
    "TikTok Followers",
  ],
};

export interface Announcement {
  id: string;
  title: string;
  message: string;
  type: "info" | "offer" | "promo" | "urgent";
  link_url: string | null;
  link_label: string | null;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export const ANNOUNCEMENT_TYPES = ["info", "offer", "promo", "urgent"] as const;

export const TYPE_STYLES: Record<
  Announcement["type"],
  { label: string; bg: string; text: string; border: string; icon: string }
> = {
  info: {
    label: "Info",
    bg: "bg-blue-500/10",
    text: "text-blue-600 dark:text-blue-400",
    border: "border-blue-500/30",
    icon: "ℹ️",
  },
  offer: {
    label: "Offer",
    bg: "bg-green-500/10",
    text: "text-green-600 dark:text-green-400",
    border: "border-green-500/30",
    icon: "🎁",
  },
  promo: {
    label: "Promo",
    bg: "bg-purple-500/10",
    text: "text-purple-600 dark:text-purple-400",
    border: "border-purple-500/30",
    icon: "📢",
  },
  urgent: {
    label: "Urgent",
    bg: "bg-red-500/10",
    text: "text-red-600 dark:text-red-400",
    border: "border-red-500/30",
    icon: "🔥",
  },
};
