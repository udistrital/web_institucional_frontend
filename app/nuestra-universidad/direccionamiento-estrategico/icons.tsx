import type { SVGProps } from "react";
import type { SectionId } from "./content";

/**
 * Iconos de línea (estilo consistente con el resto del sitio: viewBox 24x24,
 * trazo de 2px, sin relleno) para el menú secundario de "Direccionamiento
 * estratégico".
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

function MisionVisionIcon(props: SVGProps<SVGSVGElement>) {
  // Brújula: la misión y la visión que orientan el rumbo institucional.
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="10" />
      <path d="m16.24 7.76-2.12 6.36-6.36 2.12 2.12-6.36z" />
    </svg>
  );
}

function ObjetivosIcon(props: SVGProps<SVGSVGElement>) {
  // Diana / objetivo: los fines y propósitos institucionales.
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  );
}

function PoliticasIcon(props: SVGProps<SVGSVGElement>) {
  // Documento con sello: las políticas institucionales adoptadas.
  return (
    <svg {...base} {...props}>
      <path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
      <path d="M14 3v6h6" />
      <circle cx="12" cy="15" r="2" />
    </svg>
  );
}

function NormatividadIcon(props: SVGProps<SVGSVGElement>) {
  // Balanza: el marco normativo y legal de la Universidad.
  return (
    <svg {...base} {...props}>
      <path d="M12 3v18" />
      <path d="M5 7h14" />
      <path d="M7 7l-3 6a3 3 0 0 0 6 0z" />
      <path d="M17 7l-3 6a3 3 0 0 0 6 0z" />
      <path d="M8 21h8" />
    </svg>
  );
}

const ICONOS: Record<SectionId, (props: SVGProps<SVGSVGElement>) => React.ReactNode> = {
  "mision-vision": MisionVisionIcon,
  objetivos: ObjetivosIcon,
  "politicas-institucionales": PoliticasIcon,
  normatividad: NormatividadIcon,
};

export function SectionIcon({
  id,
  ...props
}: { id: SectionId } & SVGProps<SVGSVGElement>) {
  const Icono = ICONOS[id];
  return Icono ? <>{Icono(props)}</> : null;
}
