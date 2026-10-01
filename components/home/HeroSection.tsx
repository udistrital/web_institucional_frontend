import HeroCarousel from "./HeroCarousel";
import { getHeroSlides } from "@/services/hero";

export default async function HeroSection() {
  const slides = await getHeroSlides();

  return <HeroCarousel slides={slides} />;
}
