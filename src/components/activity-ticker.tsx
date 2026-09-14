"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Activity } from "lucide-react";

/**
 * Live activity ticker — subtle social proof line near the footer.
 * Cycles through the admin-managed activity feed entries.
 * Respects prefers-reduced-motion (falls back to a static line).
 */
export function ActivityTicker({ items }: { items: string[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (reducedMotion || items.length <= 1 || paused) return;
    const t = setInterval(
      () => setIndex((i) => (i + 1) % items.length),
      4000
    );
    return () => clearInterval(t);
  }, [items.length, paused, reducedMotion]);

  if (items.length === 0) return null;
  const current = reducedMotion ? items[0] : items[index % items.length];

  return (
    <div
      className="border-t border-border/50 bg-muted/30"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-center gap-2 overflow-hidden">
        <Activity className="w-3.5 h-3.5 text-green-500 shrink-0 animate-pulse" />
        <div className="h-5 overflow-hidden min-w-0">
          <AnimatePresence mode="wait">
            <motion.p
              key={current}
              initial={reducedMotion ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reducedMotion ? undefined : { opacity: 0, y: -12 }}
              transition={{ duration: 0.35 }}
              className="text-xs sm:text-sm text-muted-foreground truncate"
            >
              {current}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
