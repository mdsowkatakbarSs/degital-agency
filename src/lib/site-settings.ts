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
      footer_tagline: map.footer_tagline || DEFAULT_SETTINGS.footer_tagline,
      services_title: map.services_title || DEFAULT_SETTINGS.services_title,
      services_subtitle:
        map.services_subtitle || DEFAULT_SETTINGS.services_subtitle,
      ticker_enabled: (map.ticker_enabled ?? "true") === "true",
      activity_feed: map.activity_feed
        ? map.activity_feed
            .split("\n")
            .map((line) => line.trim())
            .filter(Boolean)
        : DEFAULT_SETTINGS.activity_feed,
      contact_email: map.contact_email || DEFAULT_SETTINGS.contact_email,
      contact_whatsapp:
        map.contact_whatsapp || DEFAULT_SETTINGS.contact_whatsapp,
      service_country: map.service_country || DEFAULT_SETTINGS.service_country,
      payment_zelle_email:
        map.payment_zelle_email || DEFAULT_SETTINGS.payment_zelle_email,
      payment_cashapp_cashtag:
        map.payment_cashapp_cashtag || DEFAULT_SETTINGS.payment_cashapp_cashtag,
      payment_cashapp_qr:
        map.payment_cashapp_qr || DEFAULT_SETTINGS.payment_cashapp_qr,
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
