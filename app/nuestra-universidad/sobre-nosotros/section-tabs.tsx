"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import type { SectionLink } from "./content";
import { SectionIcon } from "./icons";
import styles from "./page.module.css";

type SectionTabsProps = {
  sections: SectionLink[];
  /** Contenido de cada sección, indexado por el id de la sección. */
  panels: Record<string, ReactNode>;
};

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
  // Ancla estática (no sticky) ubicada justo antes de la barra de pestañas.
  // Nos da la posición real donde empieza el bloque en la página.
  const anclaRef = useRef<HTMLSpanElement>(null);
  // Indica si el cambio de pestaña vino de una interacción del usuario, para
  // desplazar el scroll solo entonces (no en el render inicial).
  const debeDesplazar = useRef(false);

  /**
   * Lleva el scroll al inicio del contenido tras cambiar de pestaña.
   *
   * Se ejecuta en un efecto (después de que React pinte el panel nuevo) porque
   * el alto de la página cambia al alternar secciones. Usamos un ancla estática
   * (no la barra sticky, que al estar pegada arriba siempre reporta top ≈ 0 y
   * dejaba el scroll sin moverse al venir desde abajo de la barra).
   */
  useEffect(() => {
    if (!debeDesplazar.current) return;
    debeDesplazar.current = false;

    const ancla = anclaRef.current;
    if (!ancla) return;
    const top = window.scrollY + ancla.getBoundingClientRect().top;
    window.scrollTo({ top, behavior: "smooth" });
  }, [activo]);

  const seleccionar = (id: string) => {
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
      <div className={styles.sectionNav}>
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
