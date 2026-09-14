"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Check,
  Clock,
  Loader2,
  ShieldCheck,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import type { GigWithPackages, GigPackage } from "@/lib/gigs";
import {
  PLATFORM_COLORS,
  PLATFORM_LABELS,
  formatPrice,
  formatDeliveryDays,
  TIER_LABELS,
} from "@/lib/gigs";
const TIER_COLORS: Record<string, string> = {
  basic: "border-blue-500/50 bg-blue-500/5",
  standard: "border-yellow-500/50 bg-yellow-500/5",
  premium: "border-purple-500/50 bg-purple-500/5",
};

const TIER_BADGE_COLORS: Record<string, string> = {
  basic: "bg-blue-500/10 text-blue-500",
  standard: "bg-yellow-500/10 text-yellow-500",
  premium: "bg-purple-500/10 text-purple-500",
};

/* ── Single-package price card ─────────────────────────────── */
function SinglePackageCard({
  pkg,
  color,
}: {
  pkg: GigPackage;
  color: string;
}) {
  const features: string[] = Array.isArray(pkg.features) ? pkg.features : [];
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 rounded-2xl border-2 shadow-md"
      style={{ borderColor: color, backgroundColor: `${color}08` }}
    >
      <div className="mb-4">
        <span className="text-3xl font-bold">{formatPrice(pkg.price)}</span>
      </div>

      <div className="flex items-center gap-1 text-sm text-muted-foreground mb-5">
        <Clock className="w-4 h-4" />
        {formatDeliveryDays(pkg.delivery_days)} delivery
      </div>

      <ul className="space-y-3">
        {features.map((feature, i) => (
          <li key={i} className="flex items-start gap-2.5 text-sm">
            <Check className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

/* ── Main page ─────────────────────────────────────────────── */
export default function GigDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [gig, setGig] = useState<GigWithPackages | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTier, setSelectedTier] = useState<string>("basic");

  useEffect(() => {
    async function fetchGig() {
      try {
        const res = await fetch(`/api/gigs?platform=all`);
        const data = await res.json();
        const found = data.gigs?.find((g: GigWithPackages) => g.slug === slug);
        if (found) {
          setGig(found);
          const standardPkg = found.gig_packages?.find(
            (p: GigPackage) => p.tier === "standard"
          );
          if (standardPkg) setSelectedTier("standard");
        }
      } catch {
        toast.error("Failed to load gig");
      }
      setLoading(false);
    }
    fetchGig();
  }, [slug]);

  const sortedPackages = [...(gig?.gig_packages || [])].sort(
    (a, b) => a.sort_order - b.sort_order
  );
  const isSinglePackage = sortedPackages.length === 1;

  // For single-package gigs, lock to that package
  const activeTier = isSinglePackage ? sortedPackages[0]?.tier : selectedTier;
  const selectedPackage = gig?.gig_packages?.find(
    (p: GigPackage) => p.tier === activeTier
  );

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <Skeleton className="h-8 w-32 mb-8" />
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Skeleton className="aspect-video w-full rounded-2xl" />
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
            <div className="space-y-4">
              <Skeleton className="h-48 rounded-2xl" />
              <Skeleton className="h-48 rounded-2xl" />
              <Skeleton className="h-48 rounded-2xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!gig) {
    return (
      <div className="min-h-screen pt-24 pb-12 px-4 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Gig not found</h1>
          <Button onClick={() => router.push("/")} className="rounded-full">
            Back to home
          </Button>
        </div>
      </div>
    );
  }

  const color = PLATFORM_COLORS[gig.platform] || "#888";
  const packageCount = sortedPackages.length;
  const packageGridClass =
    packageCount === 1
      ? ""
      : packageCount === 2
        ? "grid sm:grid-cols-2 gap-4"
        : packageCount === 3
          ? "grid gap-4"
          : packageCount === 4
            ? "grid sm:grid-cols-2 gap-4"
            : "grid grid-cols-2 lg:grid-cols-3 gap-4";
  // With 4+ packages, the picker grid lives in the main column (full width);
  // the sidebar just shows the currently selected package.
  const showGridInMain = packageCount >= 4;

  return (
    <div className="min-h-screen pt-24 pb-32 lg:pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Back button */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-6"
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/")}
            className="gap-1 -ml-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to services
          </Button>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2 space-y-8"
          >
            {/* Cover Image */}
            <div className="relative aspect-video rounded-2xl overflow-hidden bg-muted/30">
              {gig.cover_image_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={gig.cover_image_url}
                  alt={gig.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div
                  className="w-full h-full flex items-center justify-center"
                  style={{ backgroundColor: `${color}08` }}
                >
                  <span
                    className="text-6xl font-bold opacity-20"
                    style={{ color }}
                  >
                    {PLATFORM_LABELS[gig.platform]?.slice(0, 1)}
                  </span>
                </div>
              )}
            </div>

            {/* Title & Meta */}
            <div>
              <div className="flex items-center gap-3 mb-3">
                <Badge
                  variant="secondary"
                  style={{ backgroundColor: `${color}15`, color }}
                >
                  {PLATFORM_LABELS[gig.platform]}
                </Badge>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  {formatDeliveryDays(gig.delivery_days)} delivery
                </div>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold mb-3">
                {gig.title}
              </h1>
              <p className="text-lg text-muted-foreground">
                {gig.short_description}
              </p>
            </div>

            {/* Full Description */}
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <h2 className="text-xl font-semibold mb-4">About this service</h2>
              <div className="text-muted-foreground leading-relaxed whitespace-pre-line">
                {gig.full_description}
              </div>
            </div>

            {/* Package Grid — full-width main column for large catalogs */}
            {showGridInMain && (
              <div>
                <h2 className="text-lg font-semibold mb-4">Choose a package</h2>
                <div className={packageGridClass}>
                  {sortedPackages.map((pkg) => {
                    const isSelected = activeTier === pkg.tier;
                    const features: string[] = Array.isArray(pkg.features)
                      ? pkg.features
                      : [];
                    return (
                      <motion.button
                        key={pkg.tier}
                        onClick={() => setSelectedTier(pkg.tier)}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        className={`w-full text-left p-4 sm:p-5 rounded-2xl border-2 transition-all duration-200 ${
                          isSelected
                            ? "shadow-md bg-background"
                            : "border-border/50 bg-background hover:border-border"
                        }`}
                        style={isSelected ? { borderColor: color } : undefined}
                      >
                        {pkg.image_url ? (
                          <div className="relative aspect-video rounded-xl overflow-hidden mb-3 bg-muted/30">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={pkg.image_url}
                              alt={pkg.name}
                              className="w-full h-full object-cover"
                            />
                            {isSelected && (
                              <div
                                className="absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center"
                                style={{ backgroundColor: color }}
                              >
                                <Check className="w-3 h-3 text-white" />
                              </div>
                            )}
                          </div>
                        ) : null}
                        <div className="flex items-center justify-between mb-2 gap-2">
                          <span className="font-semibold text-sm sm:text-base">{pkg.name}</span>
                          {isSelected && !pkg.image_url && (
                            <div
                              className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                              style={{ backgroundColor: color }}
                            >
                              <Check className="w-3 h-3 text-white" />
                            </div>
                          )}
                        </div>
                        <div className="mb-1">
                          <span className="text-xl sm:text-2xl font-bold">
                            {formatPrice(pkg.price)}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground mb-3">
                          <Clock className="w-3.5 h-3.5" />
                          {formatDeliveryDays(pkg.delivery_days)} delivery
                        </div>
                        <ul className="space-y-1.5">
                          {features.map((feature, i) => (
                            <li
                              key={i}
                              className="flex items-start gap-2 text-xs sm:text-sm text-muted-foreground"
                            >
                              <Check className="w-3.5 h-3.5 text-green-500 shrink-0 mt-0.5" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Trust Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                {
                  icon: ShieldCheck,
                  title: "Safe & Secure",
                  desc: "No password needed",
                },
                {
                  icon: Star,
                  title: "Quality Guaranteed",
                  desc: "High-retention results",
                },
                {
                  icon: Clock,
                  title: "Fast Start",
                  desc: "Orders begin quickly",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="flex items-center gap-3 p-4 rounded-xl border border-border/50 bg-muted/20"
                >
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <item.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <div className="text-sm font-medium">{item.title}</div>
                    <div className="text-xs text-muted-foreground">
                      {item.desc}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Sidebar — Package Comparison */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-1"
          >
            <div className="lg:sticky lg:top-28 space-y-4">
              {isSinglePackage ? (
                <>
                  <h2 className="text-lg font-semibold">What you get</h2>
                  <SinglePackageCard pkg={sortedPackages[0]} color={color} />
                </>
              ) : showGridInMain ? (
                <>
                  <h2 className="text-lg font-semibold">Your selection</h2>
                  {selectedPackage ? (
                    <div className="p-5 rounded-2xl border-2 bg-background" style={{ borderColor: color }}>
                      <div className="flex items-center justify-between mb-2 gap-2">
                        <span className="font-semibold">{selectedPackage.name}</span>
                        <span className="text-2xl font-bold">
                          {formatPrice(selectedPackage.price)}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground mb-4">
                        <Clock className="w-3.5 h-3.5" />
                        {formatDeliveryDays(selectedPackage.delivery_days)} delivery
                      </div>
                      <ul className="space-y-1.5">
                        {(Array.isArray(selectedPackage.features) ? selectedPackage.features : []).map(
                          (feature, i) => (
                            <li key={i} className="flex items-start gap-2 text-xs sm:text-sm text-muted-foreground">
                              <Check className="w-3.5 h-3.5 text-green-500 shrink-0 mt-0.5" />
                              {feature}
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  ) : null}
                </>
              ) : (
                <>
                  <h2 className="text-lg font-semibold">Choose a package</h2>
                  <div className="grid gap-4">
                    {sortedPackages.map((pkg) => {
                  const isSelected = activeTier === pkg.tier;
                  const features: string[] = Array.isArray(pkg.features)
                    ? pkg.features
                    : [];

                  return (
                    <motion.button
                      key={pkg.tier}
                      onClick={() => setSelectedTier(pkg.tier)}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                        className={`w-full text-left p-5 rounded-2xl border-2 transition-all duration-200 ${
                          isSelected
                            ? `${TIER_COLORS[pkg.tier] || ""} border-current shadow-md`
                            : "border-border/50 bg-background hover:border-border"
                        }`}
                      style={
                        isSelected ? { borderColor: color } : undefined
                      }
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                              TIER_BADGE_COLORS[pkg.tier] || "bg-muted text-muted-foreground"
                            }`}
                          >
                            {pkg.name || TIER_LABELS[pkg.tier]}
                          </span>
                          <span className="font-semibold">{pkg.name}</span>
                        </div>
                        {isSelected && (
                          <div
                            className="w-5 h-5 rounded-full flex items-center justify-center"
                            style={{ backgroundColor: color }}
                          >
                            <Check className="w-3 h-3 text-white" />
                          </div>
                        )}
                      </div>

                        <div className="mb-3">
                          <span className="text-xl sm:text-2xl font-bold">
                            {formatPrice(pkg.price)}
                          </span>
                        </div>

                      <div className="flex items-center gap-1 text-xs text-muted-foreground mb-3">
                        <Clock className="w-3.5 h-3.5" />
                        {formatDeliveryDays(pkg.delivery_days)} delivery
                      </div>

                      <ul className="space-y-2">
                        {features.map((feature, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-2 text-sm text-muted-foreground"
                          >
                            <Check className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </motion.button>
                  );
                })}
                  </div>
                </>
              )}

              {/* Continue Button — Desktop */}
              {selectedPackage && (
                <div className="hidden lg:block pt-2">
                  <Button
                    onClick={() =>
                      router.push(
                        `/order?gig=${gig.slug}&tier=${activeTier}`
                      )
                    }
                    className="w-full rounded-full h-12 text-base"
                    style={{ backgroundColor: color, borderColor: color }}
                  >
                    Continue — {formatPrice(selectedPackage.price)}
                  </Button>
                  <p className="text-xs text-center text-muted-foreground mt-2">
                    You&apos;ll select quantity &amp; upload payment proof next
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Sticky Bottom Bar — Mobile */}
      {selectedPackage && (
        <div className="fixed bottom-0 left-0 right-0 lg:hidden z-50 border-t border-border/50 bg-background/95 backdrop-blur-xl p-4">
          <div className="max-w-lg mx-auto flex items-center justify-between gap-4">
            <div>
              <div className="text-sm text-muted-foreground">
                {selectedPackage.name}
              </div>
              <div className="text-xl font-bold">
                {formatPrice(selectedPackage.price)}
              </div>
            </div>
            <Button
              onClick={() =>
                router.push(
                  `/order?gig=${gig.slug}&tier=${activeTier}`
                )
              }
              className="rounded-full h-11 px-6"
              style={{ backgroundColor: color, borderColor: color }}
            >
              Continue
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
