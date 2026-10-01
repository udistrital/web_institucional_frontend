import { getHeroSlides } from "@/services/hero";

import { HeroCarousel } from "../HeroCarousel";
import type { HeroSectionProps } from "./HeroSection.types";

/**
 * Contenedor de la sección de banner principal (server component).
 *
 * Obtiene los banners desde la Capa_Servicios (`getHeroSlides`) y delega el
 * render en el presentacional `HeroCarousel` con datos ya planos
 * (`HeroSlide[]`). No realiza peticiones de red directas ni conoce la
 * estructura JSON:API.
 */
export default async function HeroSection({ className }: HeroSectionProps) {
  const slides = await getHeroSlides();

  return <HeroCarousel slides={slides} className={className} />;
}
