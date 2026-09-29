import HeroCarousel from "./HeroCarousel";
import { getHeroSlides } from "./heroData";

export default async function HeroSection() {
  const slides = await getHeroSlides();

  return <HeroCarousel slides={slides} />;
}
