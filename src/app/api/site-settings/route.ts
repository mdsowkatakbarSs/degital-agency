import { NextResponse } from "next/server";
import { getSiteSettings } from "@/lib/site-settings";

export const dynamic = "force-dynamic";

/**
 * Public read-only site settings (text content, contact + payment details).
 * Safe to expose — contains only what the site already renders publicly.
 */
export async function GET() {
  const settings = await getSiteSettings();
  return NextResponse.json(settings, {
    headers: { "Cache-Control": "no-store" },
  });
}
