/* Client-safe shared types & constants for site settings and announcements.
   NEVER import server-only modules (next/headers, supabase/server) here. */

export interface SiteSettings {
  announcement_enabled: boolean;
  hero_badge: string;
  hero_title: string;
  hero_subtitle: string;
  hero_description: string;
  footer_tagline: string;
  /* Services section headings */
  services_title: string;
  services_subtitle: string;
  /* Live activity ticker (footer) */
  ticker_enabled: boolean;
  activity_feed: string[];
  /* Contact details (admin-editable) */
  contact_email: string;
  contact_whatsapp: string;
  service_country: string;
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
  services_title: "Our Services",
  services_subtitle:
    "Professional growth & monetization solutions for every major platform.",
  ticker_enabled: true,
  activity_feed: [
    "Order #1042 Completed – YouTube 5K Views Delivered",
    "Order #1041 Completed – YouTube Monetization Support Delivered",
    "Order #1040 Completed – YouTube 1K Views Delivered",
    "New orders are being processed right now ✅",
    "500+ orders delivered to creators worldwide",
  ],
  contact_email: "ytgrowthgear2026@gmail.com",
  contact_whatsapp: "+8801761391880",
  service_country: "Bangladesh",
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
