import { HeroSection } from "@/sections/hero";
import { PlatformsSection } from "@/sections/platforms";
import { ServicesSection } from "@/sections/services";
import { PricingSection } from "@/sections/pricing";
import { TestimonialsSection } from "@/sections/testimonials";
import { ContactSection } from "@/sections/contact";

export default function Home() {
  return (
    <>
      <HeroSection />
      <PlatformsSection />
      <ServicesSection />
      <PricingSection />
      <TestimonialsSection />
      <ContactSection />
    </>
  );
}
