"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import styles from "./section-tabs.module.css";

/**
 * Enlace de sección para la barra de pestañas. El `id` es genérico (string)
 * para que cada página pueda usar su propia unión de ids sin acoplarse a este
 * componente.
 */
export type SectionLink<Id extends string = string> = {
  id: Id;
  label: string;
  /**
   * Icono opcional de la pestaña, ya renderizado. Se recibe como ReactNode
   * (no como función) para poder pasarlo desde un Server Component sin romper
   * el límite server/client: cada página tiene su propio set de iconos y los
   * renderiza al construir sus secciones.
   */
  icon?: ReactNode;
};

type SectionTabsProps<Id extends string> = {
  /** Secciones a mostrar como pestañas, en orden. */
  sections: SectionLink<Id>[];
  /** Contenido de cada sección, indexado por el id de la sección. */
  panels: Record<Id, ReactNode>;
  /** Etiqueta accesible del tablist (p. ej. "Secciones de Sobre Nosotros"). */
  ariaLabel: string;
  /**
   * Clase opcional para el contenedor de los paneles. Permite que la página
   * siga aplicando su propio layout (ancho máximo, padding) al contenido.
   */
  contentClassName?: string;
};

/**
 * useLayoutEffect emite una advertencia en el render del servidor. Como la
 * restauración de la pestaña solo tiene sentido en el cliente, usamos la
 * versión de layout en el navegador y caemos a useEffect en SSR.
 */
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

/**
 * Lee el alto de la sección fija del header desde la variable CSS --header-h.
 * HeaderContainer la publica en runtime midiendo el header real; si aún no está
 * definida, usamos 72px como valor de reserva (mismo fallback que el CSS).
 */
function getHeaderHeight(): number {
  if (typeof window === "undefined") return 72;
  const raw = getComputedStyle(document.documentElement)
    .getPropertyValue("--header-h")
    .trim();
  const parsed = Number.parseFloat(raw);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 72;
}

/**
 * Navegación tipo pestañas reutilizable.
 *
 * Muestra una barra con las secciones y solo renderiza visible el panel
 * seleccionado. Las demás permanecen ocultas hasta que el usuario las elige.
 * Implementa el patrón WAI-ARIA de tabs (roles tab/tablist/tabpanel y
 * navegación con flechas del teclado). La barra es sticky y se pega justo
 * debajo del header fijo.
 */
export default function SectionTabs<Id extends string>({
  sections,
  panels,
  ariaLabel,
  contentClassName,
}: SectionTabsProps<Id>) {
  const esIdValido = useCallback(
    (id: string): id is Id => sections.some((s) => s.id === id),
    [sections],
  );

  const [activo, setActivo] = useState<Id | "">(sections[0]?.id ?? "");
  // Indica si la barra de pestañas está "pegada" bajo el header (sticky activo).
  // Cuando lo está, cambia a fondo oscuro para diferenciarse del header.
  const [stuck, setStuck] = useState(false);
  // Ancla estática (no sticky) ubicada justo antes de la barra de pestañas.
  // Nos da la posición real donde empieza el bloque en la página.
  const anclaRef = useRef<HTMLSpanElement>(null);
  // Barra de pestañas sticky: la medimos para descontar su alto al desplazar
  // y para detectar cuándo queda pegada bajo el header.
  const navRef = useRef<HTMLDivElement>(null);
  // Indica si el cambio de pestaña vino de una interacción del usuario, para
  // desplazar el scroll solo entonces (no en el render inicial).
  const debeDesplazar = useRef(false);

  /**
   * Lleva el scroll al inicio del bloque de pestañas.
   *
   * Usamos un ancla estática (no la barra sticky, que al estar pegada arriba
   * siempre reporta top ≈ 0 y dejaba el scroll sin moverse al venir desde abajo
   * de la barra). Descontamos el alto del header fijo para que el bloque quede
   * justo bajo él (la barra de pestañas se pega debajo); así el título no queda
   * tapado por el header pero tampoco sube de más.
   */
  const desplazarAlBloque = useCallback(() => {
    const ancla = anclaRef.current;
    if (!ancla) return;

    const headerH = getHeaderHeight();
    const top = window.scrollY + ancla.getBoundingClientRect().top - headerH;
    window.scrollTo({ top: Math.max(top, 0), behavior: "smooth" });
  }, []);

  /**
   * Al cambiar de pestaña, el scroll se reacomoda en un efecto (después de que
   * React pinte el panel nuevo) porque el alto de la página cambia al alternar
   * secciones. Cuando se reoprime la pestaña ya activa, `activo` no cambia y
   * este efecto no corre: ese caso lo resuelve `seleccionar` directamente.
   */
  useEffect(() => {
    if (!debeDesplazar.current) return;
    debeDesplazar.current = false;
    desplazarAlBloque();
  }, [activo, desplazarAlBloque]);

  /**
   * Restaura la pestaña activa desde el hash de la URL (p. ej. `#objetivos`)
   * al montar y cuando cambia por el historial (atrás/adelante). Así, al
   * recargar o volver a la página, se abre la misma sección en la que estaba
   * el usuario en lugar de la primera. No desplazamos el scroll a propósito:
   * dejamos que el navegador restaure la posición que ya tenía guardada.
   */
  useIsomorphicLayoutEffect(() => {
    const aplicarHash = () => {
      const id = window.location.hash.replace("#", "");
      if (id && esIdValido(id)) {
        setActivo(id);
      }
    };

    aplicarHash();
    window.addEventListener("hashchange", aplicarHash);
    return () => window.removeEventListener("hashchange", aplicarHash);
  }, [esIdValido]);

  /**
   * Detecta cuándo la barra de pestañas queda pegada bajo el header. Cuando su
   * borde superior alcanza (o sube más allá de) la altura del header fijo, se
   * considera "pegada" y aplicamos el estilo oscuro.
   */
  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;

    const actualizar = () => {
      const headerH = getHeaderHeight();
      // +1px de tolerancia para evitar parpadeo en el punto exacto.
      setStuck(nav.getBoundingClientRect().top <= headerH + 1);
    };

    actualizar();
    window.addEventListener("scroll", actualizar, { passive: true });
    window.addEventListener("resize", actualizar);
    return () => {
      window.removeEventListener("scroll", actualizar);
      window.removeEventListener("resize", actualizar);
    };
  }, []);

  const seleccionar = (id: Id) => {
    // Al elegir una opción el contenido sube hasta pegar la barra bajo el
    // header: la dejamos en negro de inmediato (el listener de scroll la
    // mantiene coherente al volver a subir del todo).
    setStuck(true);

    // Reflejamos la pestaña en el hash de la URL para que persista al recargar
    // o volver a la página. Usamos replaceState (no un hash directo) para no
    // apilar una entrada de historial por clic ni provocar el salto brusco
    // nativo del navegador: el desplazamiento lo controla desplazarAlBloque.
    if (typeof window !== "undefined") {
      window.history.replaceState(null, "", `#${id}`);
    }

    if (id === activo) {
      // La pestaña ya está activa: `activo` no cambia, así que el efecto no
      // se dispara. Reacomodamos el scroll aquí mismo para que se comporte
      // igual que al seleccionar una pestaña distinta.
      desplazarAlBloque();
      return;
    }

    debeDesplazar.current = true;
    setActivo(id);
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    const indiceActual = sections.findIndex((s) => s.id === activo);
    if (indiceActual === -1) return;

    let siguiente = indiceActual;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      siguiente = (indiceActual + 1) % sections.length;
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      siguiente = (indiceActual - 1 + sections.length) % sections.length;
    } else if (event.key === "Home") {
      siguiente = 0;
    } else if (event.key === "End") {
      siguiente = sections.length - 1;
    } else {
      return;
    }

    event.preventDefault();
    const nuevoId = sections[siguiente].id;
    seleccionar(nuevoId);
    document.getElementById(`tab-${nuevoId}`)?.focus();
  };

  return (
    <>
      <span ref={anclaRef} aria-hidden="true" className={styles.tabsAnchor} />
      <div
        ref={navRef}
        className={`${styles.sectionNav} ${stuck ? styles.sectionNavStuck : ""}`}
      >
        <div className={styles.sectionNavList} role="tablist" aria-label={ariaLabel}>
          {sections.map((section) => {
            const esActivo = activo === section.id;
            return (
              <button
                key={section.id}
                type="button"
                id={`tab-${section.id}`}
                role="tab"
                aria-selected={esActivo}
                aria-controls={`panel-${section.id}`}
                tabIndex={esActivo ? 0 : -1}
                className={`${styles.sectionNavLink} ${esActivo ? styles.sectionNavLinkActive : ""}`}
                onClick={() => seleccionar(section.id)}
                onKeyDown={onKeyDown}
              >
                {section.icon ? (
                  <span className={styles.sectionNavIcon} aria-hidden="true">
                    {section.icon}
                  </span>
                ) : null}
                {section.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className={contentClassName}>
        {sections.map((section) => {
          const esActivo = activo === section.id;
          return (
            <div
              key={section.id}
              id={`panel-${section.id}`}
              role="tabpanel"
              aria-labelledby={`tab-${section.id}`}
              hidden={!esActivo}
              tabIndex={0}
            >
              {panels[section.id]}
            </div>
          );
        })}
      </div>
    </>
  );
}
