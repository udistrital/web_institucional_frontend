import type { SVGProps } from "react";
import type { SectionId } from "./content";

/**
 * Iconos de línea (estilo consistente con el resto del sitio: viewBox 24x24,
 * trazo de 2px, sin relleno) para el menú secundario de la página "Sistema
 * Integrado de Gestión (SIGUD)".
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

function PresentacionIcon(props: SVGProps<SVGSVGElement>) {
  // Engranajes articulados: el sistema integrado de gestión.
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M19.1 4.9 17 7M7 17l-2.1 2.1" />
    </svg>
  );
}

function FormatosIcon(props: SVGProps<SVGSVGElement>) {
  // Documentos apilados: formatos y plantillas de interés.
  return (
    <svg {...base} {...props}>
      <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
      <path d="M14 3v5h5" />
      <path d="M9 13h6M9 17h4" />
    </svg>
  );
}

function ModeloIcon(props: SVGProps<SVGSVGElement>) {
  // Flujo de procesos: nodos encadenados del modelo de operación.
  return (
    <svg {...base} {...props}>
      <rect x="3" y="4" width="6" height="5" rx="1" />
      <rect x="15" y="15" width="6" height="5" rx="1" />
      <path d="M9 6.5h4a2 2 0 0 1 2 2v9" />
    </svg>
  );
}

function NormatividadIcon(props: SVGProps<SVGSVGElement>) {
  // Balanza: normatividad y marco legal del subsistema de calidad.
  return (
    <svg {...base} {...props}>
      <path d="M12 3v18M7 21h10" />
      <path d="M5 7h14" />
      <path d="M5 7 2 13h6zM19 7l-3 6h6z" />
    </svg>
  );
}

const ICONOS: Record<
  SectionId,
  (props: SVGProps<SVGSVGElement>) => React.ReactNode
> = {
  presentacion: PresentacionIcon,
  formatos: FormatosIcon,
  modelo: ModeloIcon,
  normatividad: NormatividadIcon,
};

export function SectionIcon({
  id,
  ...props
}: { id: SectionId } & SVGProps<SVGSVGElement>) {
  const Icono = ICONOS[id];
  return Icono ? <>{Icono(props)}</> : null;
}
