export const SITE_CONFIG = {
  name: "ViralScale",
  tagline: "Dominate Social Media. Multiply Your Reach.",
  description: "Premium social media growth agency specializing in Facebook, TikTok, YouTube, and Instagram marketing. We turn followers into customers.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  ogImage: "/og-image.jpg",
  links: {
    facebook: "https://facebook.com/viralscale",
    instagram: "https://instagram.com/viralscale",
    twitter: "https://twitter.com/viralscale",
    linkedin: "https://linkedin.com/company/viralscale",
  },
  contact: {
    email: "hello@viralscale.agency",
    phone: "+1 (555) 123-4567",
    address: "123 Marketing Ave, Suite 500, New York, NY 10001",
  },
} as const;

export const PLATFORMS = [
  {
    name: "Facebook",
    icon: "Facebook",
    color: "#1877F2",
    description: "Precision-targeted ad campaigns that convert scrollers into buyers.",
    features: ["Lookalike Audiences", "Retargeting Funnels", "A/B Testing", "Pixel Tracking"],
  },
  {
    name: "TikTok",
    icon: "Music2",
    color: "#000000",
    description: "Viral content strategies that make your brand impossible to ignore.",
    features: ["Trend Hijacking", "Creator Partnerships", "Spark Ads", "Hashtag Challenges"],
  },
  {
    name: "YouTube",
    icon: "Youtube",
    color: "#FF0000",
    description: "SEO-optimized video content that ranks and retains viewers.",
    features: ["Channel Optimization", "Thumbnail Design", "SEO Strategy", "Monetization"],
  },
  {
    name: "Instagram",
    icon: "Instagram",
    color: "#E4405F",
    description: "Aesthetic feeds and Reels that build loyal communities.",
    features: ["Reels Strategy", "Influencer Collabs", "Story Funnels", "Shop Integration"],
  },
] as const;

export const SERVICES = [
  {
    title: "Paid Advertising",
    description: "High-ROI ad campaigns across all major platforms with precise targeting.",
    icon: "Target",
    stats: "4.2x Average ROAS",
  },
  {
    title: "Content Creation",
    description: "Scroll-stopping visuals and copy that captures attention in 3 seconds.",
    icon: "Palette",
    stats: "300% Engagement Boost",
  },
  {
    title: "Influencer Marketing",
    description: "Strategic partnerships with creators who align with your brand values.",
    icon: "Users",
    stats: "2.5M+ Reach Monthly",
  },
  {
    title: "Analytics & Reporting",
    description: "Real-time dashboards and weekly insights to track every metric that matters.",
    icon: "BarChart3",
    stats: "100% Transparency",
  },
  {
    title: "Community Management",
    description: "24/7 engagement, moderation, and growth hacking for your communities.",
    icon: "MessageCircle",
    stats: "50K+ Daily Interactions",
  },
  {
    title: "Brand Strategy",
    description: "Complete brand positioning, voice development, and market differentiation.",
    icon: "Lightbulb",
    stats: "90% Client Retention",
  },
] as const;

export const PRICING = [
  {
    name: "Starter",
    price: 999,
    description: "Perfect for small businesses testing social waters.",
    features: [
      "2 Platform Management",
      "8 Posts/Month per Platform",
      "Basic Analytics Dashboard",
      "Community Management",
      "Monthly Strategy Call",
    ],
    cta: "Get Started",
    popular: false,
  },
  {
    name: "Growth",
    price: 2499,
    description: "For brands ready to scale their social presence aggressively.",
    features: [
      "4 Platform Management",
      "20 Posts/Month per Platform",
      "Advanced Analytics + Reporting",
      "Influencer Outreach (5/mo)",
      "Ad Spend Management ($5K)",
      "Bi-weekly Strategy Calls",
      "Priority Support",
    ],
    cta: "Scale Now",
    popular: true,
  },
  {
    name: "Enterprise",
    price: 5999,
    description: "Full-service domination for established brands.",
    features: [
      "All Platform Management",
      "Unlimited Content Creation",
      "Custom Analytics Suite",
      "Influencer Management (20/mo)",
      "Ad Spend Management ($20K)",
      "Weekly Strategy Calls",
      "Dedicated Account Manager",
      "24/7 Community Management",
      "Crisis Management",
    ],
    cta: "Contact Sales",
    popular: false,
  },
] as const;

export const TESTIMONIALS = [
  {
    name: "Sarah Chen",
    role: "CMO, TechFlow Inc",
    content: "ViralScale transformed our TikTok from 2K to 200K followers in 4 months. The ROI speaks for itself.",
    avatar: "SC",
    platform: "TikTok",
  },
  {
    name: "Marcus Johnson",
    role: "Founder, FitLife Pro",
    content: "Our Facebook ad CPA dropped by 60% within the first month. These guys know their targeting.",
    avatar: "MJ",
    platform: "Facebook",
  },
  {
    name: "Elena Rodriguez",
    role: "Brand Director, Glow Beauty",
    content: "The content quality is unmatched. Our Instagram engagement rate tripled and sales followed.",
    avatar: "ER",
    platform: "Instagram",
  },
  {
    name: "David Park",
    role: "CEO, EduStream",
    content: "YouTube SEO strategy got us ranking #1 for our key terms. Organic traffic up 400%.",
    avatar: "DP",
    platform: "YouTube",
  },
] as const;

export const STATS = [
  { value: "500+", label: "Clients Served" },
  { value: "10M+", label: "Followers Gained" },
  { value: "$50M+", label: "Ad Spend Managed" },
  { value: "98%", label: "Client Retention" },
] as const;
