import HeroCarousel from "./HeroCarousel";
import type { HeroSlide } from "@/types/domain";

export default function HeroSection({ slides }: { slides: HeroSlide[] }) {
  return <HeroCarousel slides={slides} />;
}
