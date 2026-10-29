"use client";

import { useEffect, useRef } from "react";
import AudienceNav from "./audience-nav/audience-nav";
import Header from "./header";

export default function HeaderContainer() {
  const headerRef = useRef<HTMLDivElement>(null);

  // Mide el alto real de la sección fija del header (escudo+menú+buscador) y lo
  // publica en la variable CSS --header-h del :root. Así las barras sticky de
  // las páginas (p. ej. .sectionNav de sobre-nosotros) se anclan justo debajo
  // del header sin dejar hueco ni quedar tapadas, en cualquier breakpoint.
  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;

    const apply = () => {
      const h = Math.round(el.getBoundingClientRect().height);
      document.documentElement.style.setProperty("--header-h", `${h}px`);
    };

    apply();
    const observer = new ResizeObserver(apply);
    observer.observe(el);
    window.addEventListener("resize", apply);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", apply);
    };
  }, []);

  return (
    <>
      <AudienceNav />
      <Header ref={headerRef} />
    </>
  );
}
