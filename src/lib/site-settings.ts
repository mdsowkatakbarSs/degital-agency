import { createClient } from "@/lib/supabase/server";

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

/** Fetch site settings from Supabase, merged with defaults. Server-side only. */
export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.from("site_settings").select("*");

    if (error || !data) return DEFAULT_SETTINGS;

    const map: Record<string, string> = {};
    for (const row of data) {
      map[row.key] = row.value;
    }

    return {
      announcement_enabled: (map.announcement_enabled ?? "true") === "true",
      hero_badge: map.hero_badge || DEFAULT_SETTINGS.hero_badge,
      hero_title: map.hero_title || DEFAULT_SETTINGS.hero_title,
      hero_subtitle: map.hero_subtitle || DEFAULT_SETTINGS.hero_subtitle,
      hero_description: map.hero_description || DEFAULT_SETTINGS.hero_description,
      stats_platforms: map.stats_platforms || DEFAULT_SETTINGS.stats_platforms,
      stats_services: map.stats_services || DEFAULT_SETTINGS.stats_services,
      stats_safe: map.stats_safe || DEFAULT_SETTINGS.stats_safe,
      stats_support: map.stats_support || DEFAULT_SETTINGS.stats_support,
      footer_tagline: map.footer_tagline || DEFAULT_SETTINGS.footer_tagline,
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

/** Fetch active announcements ordered by sort_order. Server-side only. */
export async function getAnnouncements(): Promise<Announcement[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("announcements")
      .select("*")
      .eq("is_active", true)
      .order("sort_order");

    if (error || !data) return [];
    return data as Announcement[];
  } catch {
    return [];
  }
}
