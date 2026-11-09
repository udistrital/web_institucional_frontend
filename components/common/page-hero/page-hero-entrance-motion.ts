import {
  stagger,
  type Transition,
  type Variants,
  useReducedMotion,
} from "framer-motion";

/**
 * Tiempos (en segundos) de la entrada del panel izquierdo del hero
 * "brand-diagonal". Todo termina antes de 1.2 s:
 * tarjeta 0–0.5, logo 0.2–0.6, texto 0.3–0.7, botones 0.45–1.13.
 */
export const HERO_ENTRANCE = {
  /** Ease-out suave, el mismo de RevealSection. */
  ease: [0.22, 1, 0.36, 1],
  cardDuration: 0.5,
  /** Opacidad con la que la tarjeta empieza a entrar. */
  cardFrom: 0.5,
  /** Retardo del logo; el texto entra un escalón después. */
  innerDelay: 0.2,
  innerStagger: 0.1,
  innerDuration: 0.4,
  /** Desplazamiento vertical inicial del texto, en px. */
  titleRise: 8,
  logoScaleFrom: 0.9,
  linksDelay: 0.45,
  linksStagger: 0.07,
  linksDuration: 0.4,
} as const;

/** Variantes "hidden" → "visible" de cada parte animada del panel izquierdo. */
export type HeroEntranceVariants = Record<
  "card" | "logo" | "title" | "links" | "link",
  Variants
>;

function getHeroEntranceVariants(reduceMotion: boolean): HeroEntranceVariants {
  const t = HERO_ENTRANCE;
  /*
   * Con movimiento reducido solo cambian las transiciones (instantáneas): el
   * estado "hidden" es el mismo en servidor y cliente para no romper la
   * hidratación, y el CSS ya muestra el estado final desde el HTML estático.
   */
  const tween = (duration: number): Transition =>
    reduceMotion ? { duration: 0 } : { duration, ease: t.ease };
  const children = (startDelay: number, interval: number): Transition =>
    reduceMotion ? {} : { delayChildren: stagger(interval, { startDelay }) };

  return {
    card: {
      hidden: { opacity: t.cardFrom, x: "-100%" },
      visible: {
        opacity: 1,
        x: 0,
        transition: {
          ...tween(t.cardDuration),
          ...children(t.innerDelay, t.innerStagger),
        },
      },
    },
    logo: {
      hidden: { opacity: 0, scale: t.logoScaleFrom },
      visible: { opacity: 1, scale: 1, transition: tween(t.innerDuration) },
    },
    title: {
      hidden: { opacity: 0, y: t.titleRise },
      visible: { opacity: 1, y: 0, transition: tween(t.innerDuration) },
    },
    links: {
      hidden: {},
      visible: { transition: children(t.linksDelay, t.linksStagger) },
    },
    link: {
      hidden: { opacity: 0, x: "-100%" },
      visible: { opacity: 1, x: 0, transition: tween(t.linksDuration) },
    },
  };
}

/** Variantes de la entrada según la preferencia de movimiento reducido. */
export function useHeroEntranceVariants(): HeroEntranceVariants {
  return getHeroEntranceVariants(useReducedMotion() ?? false);
}
