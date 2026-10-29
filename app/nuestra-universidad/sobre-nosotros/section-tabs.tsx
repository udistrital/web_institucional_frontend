"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import type { SectionLink } from "./content";
import { SectionIcon } from "./icons";
import styles from "./page.module.css";

type SectionTabsProps = {
  sections: SectionLink[];
  /** Contenido de cada sección, indexado por el id de la sección. */
  panels: Record<string, ReactNode>;
};

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
 * Navegación tipo pestañas para "Sobre Nosotros".
 *
 * Muestra una barra con las cuatro secciones y solo renderiza visible el panel
 * seleccionado. Las demás secciones permanecen ocultas hasta que el usuario las
 * elige. Implementa el patrón WAI-ARIA de tabs (roles tab/tablist/tabpanel y
 * navegación con flechas del teclado).
 */
export default function SectionTabs({ sections, panels }: SectionTabsProps) {
  const [activo, setActivo] = useState<string>(sections[0]?.id ?? "");
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

  const seleccionar = (id: string) => {
    // Al elegir una opción el contenido sube hasta pegar la barra bajo el
    // header: la dejamos en negro de inmediato (el listener de scroll la
    // mantiene coherente al volver a subir del todo).
    setStuck(true);

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
        <div
          className={styles.sectionNavList}
          role="tablist"
          aria-label="Secciones de Sobre Nosotros"
        >
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
                <SectionIcon id={section.id} className={styles.sectionNavIcon} />
                {section.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className={styles.content}>
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
