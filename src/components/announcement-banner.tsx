"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import Link from "next/link";
import type { Announcement } from "@/lib/site-settings";
import { TYPE_STYLES } from "@/lib/site-settings";

const DISMISS_KEY = "da_dismissed_announcements";

function getDismissed(): string[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(DISMISS_KEY) || "[]");
  } catch {
    return [];
  }
}

export function AnnouncementBanner({
  announcements,
}: {
  announcements: Announcement[];
}) {
  const [dismissed, setDismissed] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setDismissed(getDismissed());
    setMounted(true);
  }, []);

  const visible = mounted
    ? announcements.filter((a) => !dismissed.includes(a.id))
    : announcements;

  if (!visible.length) return null;
  const announcement = visible[0];

  function dismiss() {
    const next = [...getDismissed(), announcement.id].slice(-10);
    localStorage.setItem(DISMISS_KEY, JSON.stringify(next));
    setDismissed(next);
  }

  const style = TYPE_STYLES[announcement.type] || TYPE_STYLES.info;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: "auto", opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        className={`relative z-40 border-b ${style.border} ${style.bg}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            <span className="shrink-0">{style.icon}</span>
            <p className="text-sm truncate flex-1">
              <span className={`font-semibold ${style.text}`}>
                {announcement.title}:
              </span>{" "}
              <span className="text-muted-foreground">{announcement.message}</span>
            </p>
            <div className="flex items-center gap-2 shrink-0">
              {announcement.link_url && (
                <Link
                  href={announcement.link_url}
                  className="text-xs font-medium underline underline-offset-2 hover:opacity-80 shrink-0"
                >
                  {announcement.link_label || "Learn more"}
                </Link>
              )}
              <button
                onClick={dismiss}
                className="p-1 rounded-full hover:bg-background/50 transition-colors shrink-0"
                aria-label="Dismiss announcement"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
