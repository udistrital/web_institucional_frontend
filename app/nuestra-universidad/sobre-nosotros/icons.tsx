import type { SVGProps } from "react";
import type { SectionId } from "./content";

/**
 * Iconos de línea (estilo consistente con el resto del sitio: viewBox 24x24,
 * trazo de 2px, sin relleno) para el menú secundario de "Sobre Nosotros".
 */

const base: SVGProps<SVGSVGElement> = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
  focusable: false,
};

function FuncionesIcon(props: SVGProps<SVGSVGElement>) {
  // Diana / objetivo: la misión y los fines institucionales.
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  );
}

function DirectivosIcon(props: SVGProps<SVGSVGElement>) {
  // Edificio institucional con columnas: órganos de gobierno y dirección.
  return (
    <svg {...base} {...props}>
      <path d="M3 21h18" />
      <path d="M3 10h18" />
      <path d="M5 6l7-3 7 3" />
      <path d="M4 10v11M20 10v11" />
      <path d="M8 14v3M12 14v3M16 14v3" />
    </svg>
  );
}

function HistoriaIcon(props: SVGProps<SVGSVGElement>) {
  // Libro abierto: la reseña y la historia de la Universidad.
  return (
    <svg {...base} {...props}>
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  );
}

function SimbolosIcon(props: SVGProps<SVGSVGElement>) {
  // Estandarte / bandera: la identidad y los símbolos institucionales.
  return (
    <svg {...base} {...props}>
      <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V4s-1 1-4 1-5-2-8-2-4 1-4 1z" />
      <line x1="4" y1="22" x2="4" y2="15" />
    </svg>
  );
}

const ICONOS: Record<SectionId, (props: SVGProps<SVGSVGElement>) => React.ReactNode> = {
  "funciones-misionales": FuncionesIcon,
  directivos: DirectivosIcon,
  historia: HistoriaIcon,
  simbolos: SimbolosIcon,
};

export function SectionIcon({
  id,
  ...props
}: { id: SectionId } & SVGProps<SVGSVGElement>) {
  const Icono = ICONOS[id];
  return Icono ? <>{Icono(props)}</> : null;
}

/* ---- Iconos de las funciones generales ---- */

export function FormacionIcon(props: SVGProps<SVGSVGElement>) {
  // Birrete académico.
  return (
    <svg {...base} {...props}>
      <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
      <path d="M6 12v5c3 3 9 3 12 0v-5" />
    </svg>
  );
}

export function InvestigacionIcon(props: SVGProps<SVGSVGElement>) {
  // Lupa.
  return (
    <svg {...base} {...props}>
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

export function ExtensionIcon(props: SVGProps<SVGSVGElement>) {
  // Globo / proyección social.
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
}

export const FUNCION_ICONS = [FormacionIcon, InvestigacionIcon, ExtensionIcon];
