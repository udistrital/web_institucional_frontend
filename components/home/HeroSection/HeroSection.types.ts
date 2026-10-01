/**
 * Props del componente contenedor `HeroSection`.
 *
 * `HeroSection` es un contenedor (server component): obtiene los banners desde
 * la Capa_Servicios (`getHeroSlides`) y delega el render en el presentacional
 * `HeroCarousel`. No conoce la estructura JSON:API.
 */
export interface HeroSectionProps {
  /** Clase adicional para componer la sección en layouts mayores. */
  className?: string;
}
