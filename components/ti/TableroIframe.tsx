"use client";

import { useState } from "react";

type TableroIframeProps = {
  src: string;
  title: string;
  /** Si el tablero está visible (activo). Se mantiene montado aunque esté oculto. */
  isActive: boolean;
};

/**
 * Incrusta un tablero (dashboard) en un iframe.
 *
 * Los iframes se apilan dentro de un contenedor posicionado (en el explorador)
 * y SIEMPRE conservan sus dimensiones reales, incluso los inactivos. En lugar
 * de ocultarlos con `display: none` (que da tamaño 0 y hace que apps como
 * Metabase calculen alturas negativas, p. ej. "-24"), los inactivos se ocultan
 * con opacidad + z-index + pointer-events. Así solo se cargan una vez y al
 * reseleccionarlos aparecen al instante, sin recargar y sin romper su layout.
 */
export default function TableroIframe({ src, title, isActive }: TableroIframeProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div
      className={[
        "absolute inset-0 overflow-hidden rounded-lg border border-black/10 bg-neutral-50 transition-opacity duration-200",
        isActive
          ? "z-10 opacity-100"
          : "pointer-events-none z-0 opacity-0",
      ].join(" ")}
      // Se oculta a lectores de pantalla cuando no está activo (sin colapsar tamaño).
      aria-hidden={isActive ? undefined : true}
      inert={!isActive}
    >
      {!isLoaded && (
        <div
          className="absolute inset-0 flex items-center justify-center bg-neutral-50"
          aria-hidden="true"
        >
          <span className="h-8 w-8 animate-spin rounded-full border-3 border-neutral-300 border-t-[color:var(--institutional-red)]" />
        </div>
      )}
      <iframe
        src={src}
        title={title}
        onLoad={() => setIsLoaded(true)}
        className="h-[calc(100%-2.75rem)] w-full border-0"
        allowFullScreen
        referrerPolicy="no-referrer-when-downgrade"
        sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
      />
      <div className="flex h-11 items-center justify-end border-t border-black/10 bg-white px-4">
        <a
          href={src}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-semibold text-[color:var(--institutional-red)] hover:underline"
        >
          Abrir en una pestaña nueva
        </a>
      </div>
    </div>
  );
}
