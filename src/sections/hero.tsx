"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform, type MotionValue } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Rocket, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export interface HeroContent {
  badge: string;
  title: string;
  subtitle: string;
  description: string;
}

export const DEFAULT_HERO: HeroContent = {
  badge: "Welcome To Our Platform",
  title: "Grow Faster. Reach Further. Monetize Smarter.",
  subtitle:
    "Your Trusted Partner For Social Media Growth & Monetization Services",
  description:
    "We provide professional solutions to help creators, influencers, businesses & brands grow their online presence across the world's leading social media platforms.",
};

interface FloatingIcon {
  label: string;
  /** Tailwind position classes — desktop (sm+) matches the original design; mobile tucks icons to the edges so all four fit the first screen. */
  position: string;
  /** Parallax depth 0–1: nearer icons are larger and drift more. */
  depth: number;
  wrapper: string;
  size: string;
  svgClass: string;
  /** SVG fill for the brand color ("currentColor" follows the theme). */
  fill: string;
  /** Per-icon float loop duration so the icons never move in lockstep. */
  floatDuration: string;
  delay: number;
  paths: React.ReactNode;
}

/**
 * Floating platform icons orbiting the hero — the original desktop design,
 * visible on every screen size (scaled down on phones) so mobile shows the
 * same composition as the web version.
 */
const FLOATING_ICONS: FloatingIcon[] = [
  {
    label: "Facebook",
    position: "top-24 left-3 sm:top-20 sm:left-10",
    depth: 0.55,
    wrapper: "bg-[#1877F2]/10 border border-[#1877F2]/20",
    size: "w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16",
    svgClass: "w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8",
    fill: "#1877F2",
    floatDuration: "4s",
    delay: 1,
    paths: (
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    ),
  },
  {
    label: "TikTok",
    position: "top-32 right-3 sm:right-16",
    depth: 0.25,
    wrapper: "bg-foreground/5 border border-border",
    size: "w-9 h-9 sm:w-10 sm:h-10 lg:w-12 lg:h-12",
    svgClass: "w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6",
    fill: "currentColor",
    floatDuration: "5s",
    delay: 1.2,
    paths: (
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
    ),
  },
  {
    label: "YouTube",
    position: "top-[46%] left-3 sm:top-auto sm:bottom-40 sm:left-20",
    depth: 0.5,
    wrapper: "bg-[#FF0000]/10 border border-[#FF0000]/20",
    size: "w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16",
    svgClass: "w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8",
    fill: "#FF0000",
    floatDuration: "4.4s",
    delay: 1.4,
    paths: (
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    ),
  },
  {
    label: "Instagram",
    position: "top-[50%] right-3 sm:top-auto sm:bottom-32 sm:right-24",
    depth: 0.3,
    wrapper:
      "bg-gradient-to-br from-[#833AB4]/10 via-[#FD1D1D]/10 to-[#F77737]/10 border border-[#E4405F]/20",
    size: "w-9 h-9 sm:w-10 sm:h-10 lg:w-12 lg:h-12",
    svgClass: "w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6",
    fill: "#E4405F",
    floatDuration: "5.6s",
    delay: 1.6,
    paths: (
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
    ),
  },
];

/**
 * One orbiting icon with depth-aware mouse parallax: the pointer-driven
 * springs are shared per hero, but each icon multiplies them by its depth,
 * so near icons drift further (and tilt slightly) while far icons lag —
 * a subtle 3D feel.
 */
function FloatingPlatformIcon({
  icon,
  index,
  parallaxOn,
  sx,
  sy,
}: {
  icon: FloatingIcon;
  index: number;
  parallaxOn: boolean;
  sx: MotionValue<number>;
  sy: MotionValue<number>;
}) {
  const x = useTransform(sx, (v) => v * 40 * icon.depth);
  const y = useTransform(sy, (v) => v * 40 * icon.depth);
  const rotate = useTransform(sx, (v) => v * 8 * icon.depth);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: icon.delay, type: "spring", stiffness: 200, damping: 15 }}
      className={`absolute ${icon.position} pointer-events-none`}
      style={parallaxOn ? { x, y, rotate } : undefined}
    >
      <div
        className={`${icon.size} ${icon.wrapper} rounded-2xl flex items-center justify-center animate-float opacity-60 sm:opacity-100`}
        style={{
          animationDelay: `${index * 0.7}s`,
          animationDuration: icon.floatDuration,
        }}
      >
        <svg className={icon.svgClass} viewBox="0 0 24 24" fill={icon.fill} aria-hidden="true">
          {icon.paths}
        </svg>
      </div>
    </motion.div>
  );
}

export function HeroSection({ content = DEFAULT_HERO }: { content?: HeroContent }) {
  // Mouse parallax (desktop enhancement). Disabled under reduced motion and
  // naturally inactive on touch devices.
  const [parallaxOn, setParallaxOn] = useState(false);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 50, damping: 18 });
  const sy = useSpring(my, { stiffness: 50, damping: 18 });

  const glow1X = useTransform(sx, (v) => v * 36);
  const glow1Y = useTransform(sy, (v) => v * 36);
  const glow2X = useTransform(sx, (v) => v * -36);
  const glow2Y = useTransform(sy, (v) => v * -36);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setParallaxOn(!mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const handlePointerMove = (e: React.PointerEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - rect.left) / rect.width - 0.5);
    my.set((e.clientY - rect.top) / rect.height - 0.5);
  };
  const handlePointerLeave = () => {
    mx.set(0);
    my.set(0);
  };

  return (
    <section
      className="relative min-h-svh flex items-center justify-center overflow-hidden pt-20"
      onPointerMove={parallaxOn ? handlePointerMove : undefined}
      onPointerLeave={parallaxOn ? handlePointerLeave : undefined}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-background to-background" />
      <motion.div
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse-glow"
        style={parallaxOn ? { x: glow1X, y: glow1Y } : undefined}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse-glow"
        style={{ animationDelay: "1s", ...(parallaxOn ? { x: glow2X, y: glow2Y } : {}) }}
      />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />

      <div className="relative w-full min-w-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center min-w-0 max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Badge variant="secondary" className="mb-6 max-w-full h-auto whitespace-normal text-center px-4 py-1.5 text-sm font-medium rounded-full leading-relaxed">
              <Rocket className="w-3.5 h-3.5 mr-1.5 text-yellow-500 shrink-0" />
              {content.badge}
            </Badge>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] mb-6 break-words text-balance"
          >
            <span className="gradient-text animate-gradient-shift">
              {content.title}
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-6 leading-relaxed break-words"
          >
            {content.subtitle}
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-base sm:text-lg text-muted-foreground max-w-3xl mx-auto mb-10 leading-relaxed break-words"
          >
            {content.description}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
          >
            <Button asChild size="lg" className="rounded-full px-8 h-14 text-base group">
              <Link href="#order">
                Order Now
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="rounded-full px-8 h-14 text-base">
              <Link href="#services">
                <Sparkles className="mr-2 w-5 h-5" />Our Services
              </Link>
            </Button>
          </motion.div>
        </div>

        {/* Floating Platform Icons — visible on all screens, parallax depth on desktop */}
        {FLOATING_ICONS.map((icon, i) => (
          <FloatingPlatformIcon
            key={icon.label}
            icon={icon}
            index={i}
            parallaxOn={parallaxOn}
            sx={sx}
            sy={sy}
          />
        ))}
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 0.8 }}
        className="absolute bottom-5 left-1/2 -translate-x-1/2"
      >
        <Link
          href="#services"
          aria-label="Scroll to services"
          className="flex flex-col items-center gap-1.5 text-muted-foreground/70 hover:text-foreground transition-colors"
        >
          <span className="text-[10px] uppercase tracking-[0.25em]">Scroll</span>
          <span className="w-5 h-8 rounded-full border border-current flex justify-center pt-1.5">
            <motion.span
              className="w-1 h-1.5 rounded-full bg-current"
              animate={{ y: [0, 9, 0], opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            />
          </span>
        </Link>
      </motion.div>
    </section>
  );
}
