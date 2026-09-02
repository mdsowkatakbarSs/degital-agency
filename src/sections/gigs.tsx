"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { SectionWrapper } from "@/components/section-wrapper";
import { GigCard } from "@/components/gig-card";
import { Skeleton } from "@/components/ui/skeleton";
import type { GigWithPackages } from "@/lib/gigs";
import {
  PLATFORMS,
  PLATFORM_LABELS,
  PLATFORM_COLORS,
} from "@/lib/gigs";

const FILTER_OPTIONS = ["all", ...PLATFORMS] as const;

function GigCardSkeleton() {
  return (
    <div className="rounded-2xl border border-border/50 bg-background overflow-hidden">
      <Skeleton className="aspect-video" />
      <div className="p-5 space-y-3">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
        <div className="flex items-center justify-between pt-2">
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-4 w-16" />
        </div>
      </div>
    </div>
  );
}

export function GigsSection() {
  const [gigs, setGigs] = useState<GigWithPackages[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    async function fetchGigs() {
      setLoading(true);
      try {
        const res = await fetch("/api/gigs");
        const data = await res.json();
        setGigs(data.gigs || []);
      } catch {
        setGigs([]);
      }
      setLoading(false);
    }
    fetchGigs();
  }, []);

  const filteredGigs =
    filter === "all" ? gigs : gigs.filter((g) => g.platform === filter);

  return (
    <SectionWrapper id="services">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4"
          >
            Our Services
          </motion.h2>
          <p className="text-lg text-muted-foreground">
            Professional growth &amp; monetization solutions for every major platform.
          </p>
        </div>

        {/* Platform Filter Bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-2 mb-10"
        >
          {FILTER_OPTIONS.map((opt) => {
            const isActive = filter === opt;
            const color = opt === "all" ? undefined : PLATFORM_COLORS[opt];
            return (
              <button
                key={opt}
                onClick={() => setFilter(opt)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border ${
                  isActive
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background text-muted-foreground border-border/50 hover:border-primary/30 hover:text-foreground"
                }`}
                style={
                  isActive && color
                    ? { backgroundColor: color, borderColor: color, color: "#fff" }
                    : undefined
                }
              >
                {opt === "all"
                  ? "All Platforms"
                  : PLATFORM_LABELS[opt] || opt}
              </button>
            );
          })}
        </motion.div>

        {/* Gig Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <GigCardSkeleton key={i} />
            ))}
          </div>
        ) : filteredGigs.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg">
              {filter === "all"
                ? "No services available yet."
                : `No ${PLATFORM_LABELS[filter] || filter} services available yet.`}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredGigs.map((gig, index) => (
              <GigCard key={gig.id} gig={gig} index={index} />
            ))}
          </div>
        )}
      </div>
    </SectionWrapper>
  );
}
