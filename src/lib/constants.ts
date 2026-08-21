export const SITE_CONFIG = {
  name: "Digital Agency & Social Exchange",
  tagline: "Grow Faster. Reach Further. Monetize Smarter.",
  description:
    "Your trusted partner for social media growth and monetization services. We provide professional solutions to help creators, influencers, businesses and brands grow their online presence across the world's leading social media platforms.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  ogImage: "/og-image.jpg",
} as const;

export type ServiceItem = { name: string };
export type ServiceGroup = {
  platform: string;
  color: string;
  items: ServiceItem[];
};

export const SERVICE_GROUPS: ServiceGroup[] = [
  {
    platform: "YouTube",
    color: "#FF0000",
    items: [
      { name: "YouTube Monetization Package" },
      { name: "YouTube Subscribers" },
      { name: "YouTube Watch Time" },
      { name: "YouTube Views" },
      { name: "YouTube Like/Comment" },
    ],
  },
  {
    platform: "Facebook",
    color: "#1877F2",
    items: [
      { name: "Facebook Monetization Package" },
      { name: "Facebook Profile/Page Followers" },
      { name: "Facebook Views" },
      { name: "Facebook Like/Comments" },
      { name: "Facebook Review" },
    ],
  },
  {
    platform: "Instagram",
    color: "#E4405F",
    items: [
      { name: "Instagram Followers" },
      { name: "Instagram Views" },
      { name: "Instagram Like/Comments" },
    ],
  },
  {
    platform: "TikTok",
    color: "#000000",
    items: [
      { name: "TikTok Followers" },
      { name: "TikTok Views" },
      { name: "TikTok Like/Comments" },
    ],
  },
];

export const ALL_SERVICES = SERVICE_GROUPS.flatMap((g) =>
  g.items.map((i) => i.name)
);

export const PAYMENT_METHODS = ["PayPal", "Other"] as const;

export const ORDER_STATUSES = [
  "new",
  "processing",
  "completed",
  "cancelled",
] as const;

export const WHY_US = [
  {
    title: "Real & Reliable Growth",
    description:
      "High-quality services across YouTube, Facebook, Instagram and TikTok with delivery you can count on.",
    icon: "TrendingUp",
  },
  {
    title: "Monetization Experts",
    description:
      "Dedicated monetization packages for YouTube and Facebook that help you unlock earnings faster.",
    icon: "BadgeDollarSign",
  },
  {
    title: "Fast Delivery Start",
    description:
      "Orders begin processing quickly after confirmation so your growth starts without delay.",
    icon: "Zap",
  },
  {
    title: "Safe & Secure",
    description:
      "No password required. Our methods are safe for your accounts and follow platform-friendly practices.",
    icon: "ShieldCheck",
  },
  {
    title: "Affordable Pricing",
    description:
      "Competitive rates for creators, influencers, businesses and brands of every size.",
    icon: "Wallet",
  },
  {
    title: "Dedicated Support",
    description:
      "Friendly support to help you pick the right service, place your order and track progress.",
    icon: "Headset",
  },
] as const;

export const STATS = [
  { value: "4", label: "Major Platforms" },
  { value: "16", label: "Growth Services" },
  { value: "100%", label: "Safe Methods" },
  { value: "24/7", label: "Support" },
] as const;

export const MAX_SCREENSHOT_MB = 3;
