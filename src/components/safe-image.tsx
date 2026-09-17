"use client";

import { useState } from "react";
import { ImageOff } from "lucide-react";
import { PLATFORM_COLORS, PLATFORM_LABELS } from "@/lib/gigs";

/**
 * Image with graceful fallback.
 *
 * DB-stored Supabase Storage URLs can go stale (object deleted/renamed),
 * which renders as an ugly broken-image box. On load error we swap to a
 * clean platform-tinted placeholder (icon + label) instead.
 */
export function SafeImage({
  src,
  alt,
  platform,
  className = "",
  imgClassName = "",
  eager = false,
}: {
  src: string;
  alt: string;
  platform?: string;
  /** Classes for the wrapper (must establish size, e.g. aspect-video w-full). */
  className?: string;
  /** Extra classes for the <img> itself (e.g. hover scale). */
  imgClassName?: string;
  eager?: boolean;
}) {
  const [failed, setFailed] = useState(false);
  const color = PLATFORM_COLORS[platform || ""] || "var(--primary)";

  if (failed || !src) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`${className} flex flex-col items-center justify-center gap-2`}
        style={{ backgroundColor: `color-mix(in srgb, ${color} 8%, transparent)` }}
      >
        <ImageOff className="w-8 h-8 opacity-30" style={{ color }} />
        <span
          className="text-xs font-medium px-2.5 py-1 rounded-full"
          style={{ backgroundColor: `color-mix(in srgb, ${color} 12%, transparent)`, color }}
        >
          {PLATFORM_LABELS[platform || ""] || "Image unavailable"}
        </span>
      </div>
    );
  }

  return (
    <div className={`${className} overflow-hidden`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        loading={eager ? "eager" : "lazy"}
        onError={() => setFailed(true)}
        className={`w-full h-full object-cover ${imgClassName}`}
      />
    </div>
  );
}
