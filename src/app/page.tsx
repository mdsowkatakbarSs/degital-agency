import { HeroSection, DEFAULT_HERO } from "@/sections/hero";
import { GigsSection } from "@/sections/gigs";
import { WhyUsSection } from "@/sections/why-us";
import { OrderSection } from "@/sections/order";
import { getSiteSettings } from "@/lib/site-settings";

export const dynamic = "force-dynamic";

export default async function Home() {
  const settings = await getSiteSettings();

  const heroContent = {
    ...DEFAULT_HERO,
    badge: settings.hero_badge,
    title: settings.hero_title,
    subtitle: settings.hero_subtitle,
    description: settings.hero_description,
  };

  return (
    <>
      <HeroSection content={heroContent} />
      <GigsSection settings={{ title: settings.services_title, subtitle: settings.services_subtitle }} />
      <WhyUsSection />
      <OrderSection />
    </>
  );
}
