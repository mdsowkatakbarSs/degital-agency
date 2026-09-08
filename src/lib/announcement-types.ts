/* Client-safe shared types & constants for site settings and announcements.
   NEVER import server-only modules (next/headers, supabase/server) here. */

export interface SiteSettings {
  announcement_enabled: boolean;
  hero_badge: string;
  hero_title: string;
  hero_subtitle: string;
  hero_description: string;
  stats_platforms: string;
  stats_services: string;
  stats_safe: string;
  stats_support: string;
  footer_tagline: string;
}

export const DEFAULT_SETTINGS: SiteSettings = {
  announcement_enabled: true,
  hero_badge: "Welcome To Our Platform",
  hero_title: "Grow Faster. Reach Further. Monetize Smarter.",
  hero_subtitle:
    "Your Trusted Partner For Social Media Growth & Monetization Services",
  hero_description:
    "We provide professional solutions to help creators, influencers, businesses & brands grow their online presence across the world's leading social media platforms.",
  stats_platforms: "4",
  stats_services: "6+",
  stats_safe: "100%",
  stats_support: "24/7",
  footer_tagline: "Grow Faster. Reach Further. Monetize Smarter.",
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
