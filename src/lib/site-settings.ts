import { createClient } from "@/lib/supabase/server";
import type { Announcement, SiteSettings } from "@/lib/announcement-types";
import { DEFAULT_SETTINGS } from "@/lib/announcement-types";

export type { Announcement, SiteSettings };

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
      hero_description:
        map.hero_description || DEFAULT_SETTINGS.hero_description,
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
