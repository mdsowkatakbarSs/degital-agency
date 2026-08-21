import { HeroSection } from "@/sections/hero";
import { ServicesSection } from "@/sections/services";
import { WhyUsSection } from "@/sections/why-us";
import { OrderSection } from "@/sections/order";

export default function Home() {
  return (
    <>
      <HeroSection />
      <ServicesSection />
      <WhyUsSection />
      <OrderSection />
    </>
  );
}
