export interface Gig {
  id: string;
  slug: string;
  platform: string;
  title: string;
  short_description: string;
  full_description: string;
  cover_image_url: string;
  starting_price: number;
  delivery_days: number;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface GigPackage {
  id: string;
  gig_id: string;
  tier: "basic" | "standard" | "premium";
  name: string;
  price: number;
  delivery_days: number;
  features: string[];
  sort_order: number;
}

export interface GigWithPackages extends Gig {
  gig_packages: GigPackage[];
}

export const PLATFORM_COLORS: Record<string, string> = {
  youtube: "#FF0000",
  facebook: "#1877F2",
  instagram: "#E4405F",
  tiktok: "#000000",
};

export const PLATFORM_LABELS: Record<string, string> = {
  youtube: "YouTube",
  facebook: "Facebook",
  instagram: "Instagram",
  tiktok: "TikTok",
};

export const TIER_LABELS: Record<string, string> = {
  basic: "Basic",
  standard: "Standard",
  premium: "Premium",
};

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
}

export function formatDeliveryDays(days: number): string {
  if (days === 1) return "1 day";
  return `${days} days`;
}

export const PLATFORMS = ["youtube", "facebook", "instagram", "tiktok"] as const;
export type Platform = (typeof PLATFORMS)[number];
