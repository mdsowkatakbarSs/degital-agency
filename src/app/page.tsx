import { HeroSection } from "@/sections/hero";
import { GigsSection } from "@/sections/gigs";
import { WhyUsSection } from "@/sections/why-us";
import { OrderSection } from "@/sections/order";

export default function Home() {
  return (
    <>
      <HeroSection />
      <GigsSection />
      <WhyUsSection />
      <OrderSection />
    </>
  );
}
