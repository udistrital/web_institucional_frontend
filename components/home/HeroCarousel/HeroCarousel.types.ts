import type { HeroSlide } from "@/services/hero";

/**
 * Props del componente presentacional `HeroCarousel`.
 *
 * Es un componente cliente puramente presentacional: recibe los banners ya
 * planos (`HeroSlide[]`) y gestiona la rotación/interacción local. No realiza
 * peticiones de red ni conoce la estructura JSON:API.
 */
export interface HeroCarouselProps {
  /** Banners planos a renderizar. */
  slides: HeroSlide[];
  /** Clase adicional para componer el carrusel en layouts mayores. */
  className?: string;
}
