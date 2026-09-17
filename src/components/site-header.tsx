"use client";

import { useEffect, useState, type ReactNode } from "react";

/**
 * Fixed header stack: announcement banner on top of the navbar.
 * - Banner is visible at the top of the page and smoothly collapses
 *   once the visitor scrolls, leaving only the navbar pinned.
 * - Collapsing uses max-height so it works for any banner height
 *   (including wrapped text) without measuring.
 */
export function SiteHeader({ children }: { children: ReactNode }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      <div
        className={`overflow-hidden transition-all duration-300 ease-out ${
          scrolled ? "max-h-0 opacity-0" : "max-h-24 opacity-100"
        }`}
      >
        {children}
      </div>
    </div>
  );
}
