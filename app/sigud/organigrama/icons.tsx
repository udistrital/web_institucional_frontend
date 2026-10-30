import type { SVGProps } from "react";
import type { SectionId } from "./content";

/**
 * Iconos de línea (estilo consistente con el resto del sitio: viewBox 24x24,
 * trazo de 2px, sin relleno) para el menú secundario de "Organización
 * funcional".
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

function GeneralIcon(props: SVGProps<SVGSVGElement>) {
  // Jerarquía / organigrama: un nodo raíz que se ramifica en dependencias.
  return (
    <svg {...base} {...props}>
      <rect x="9" y="2" width="6" height="5" rx="1" />
      <rect x="3" y="17" width="6" height="5" rx="1" />
      <rect x="15" y="17" width="6" height="5" rx="1" />
      <path d="M12 7v4" />
      <path d="M6 17v-2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v2" />
    </svg>
  );
}

function GeneralTransitorioIcon(props: SVGProps<SVGSVGElement>) {
  // Reloj / transición: estructura en etapa de implementación transitoria.
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

function AcademicoIcon(props: SVGProps<SVGSVGElement>) {
  // Birrete académico: el ámbito misional de docencia e investigación.
  return (
    <svg {...base} {...props}>
      <path d="M22 10 12 5 2 10l10 5 10-5Z" />
      <path d="M6 12v5c0 1 2.5 3 6 3s6-2 6-3v-5" />
    </svg>
  );
}

function AdministrativoIcon(props: SVGProps<SVGSVGElement>) {
  // Edificio institucional: el ámbito administrativo y de gestión.
  return (
    <svg {...base} {...props}>
      <path d="M4 22V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v18" />
      <path d="M16 9h3a1 1 0 0 1 1 1v12" />
      <path d="M2 22h20" />
      <path d="M8 7h2M8 11h2M8 15h2" />
    </svg>
  );
}

const ICONOS: Record<SectionId, (props: SVGProps<SVGSVGElement>) => React.ReactNode> = {
  general: GeneralIcon,
  "general-transitorio": GeneralTransitorioIcon,
  academico: AcademicoIcon,
  administrativo: AdministrativoIcon,
};

export function SectionIcon({
  id,
  ...props
}: { id: SectionId } & SVGProps<SVGSVGElement>) {
  const Icono = ICONOS[id];
  return Icono ? <>{Icono(props)}</> : null;
}
