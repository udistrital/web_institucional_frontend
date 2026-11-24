import type { SVGProps } from "react";
import type { CategoriaId } from "./content";

/**
 * Iconos de línea (estilo consistente con el resto del sitio: viewBox 24x24,
 * trazo de 2px, sin relleno) para el mosaico de categorías de la sección
 * "Transparencia y acceso a la información pública". Cada icono representa una
 * de las 13 categorías de la Ley 1712 de 2014.
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

function MecanismosContactoIcon(props: SVGProps<SVGSVGElement>) {
  // Auricular telefónico: los canales de contacto con la ciudadanía.
  return (
    <svg {...base} {...props}>
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

function InformacionInteresIcon(props: SVGProps<SVGSVGElement>) {
  // Bombilla: la información de interés y los recursos de consulta.
  return (
    <svg {...base} {...props}>
      <path d="M9 18h6" />
      <path d="M10 22h4" />
      <path d="M12 2a7 7 0 0 0-4 12.74c.6.5 1 1.2 1 1.96V18h6v-1.3c0-.76.4-1.46 1-1.96A7 7 0 0 0 12 2z" />
    </svg>
  );
}

function EstructuraOrganicaIcon(props: SVGProps<SVGSVGElement>) {
  // Organigrama: nodos conectados que representan la estructura orgánica.
  return (
    <svg {...base} {...props}>
      <rect x="9" y="2" width="6" height="5" rx="1" />
      <rect x="2" y="17" width="6" height="5" rx="1" />
      <rect x="16" y="17" width="6" height="5" rx="1" />
      <path d="M12 7v5" />
      <path d="M5 17v-2a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v2" />
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

function PresupuestoIcon(props: SVGProps<SVGSVGElement>) {
  // Moneda con gráfico: el presupuesto y la información financiera.
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M14.5 9a2.5 2 0 0 0-2.5-1.5c-1.4 0-2.5.9-2.5 2s1.1 2 2.5 2 2.5.9 2.5 2-1.1 2-2.5 2a2.5 2 0 0 1-2.5-1.5" />
      <path d="M12 6v1.5" />
      <path d="M12 16.5V18" />
    </svg>
  );
}

function PlaneacionIcon(props: SVGProps<SVGSVGElement>) {
  // Diana / objetivo: los planes, metas e indicadores de gestión.
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  );
}

function ControlIcon(props: SVGProps<SVGSVGElement>) {
  // Escudo con check: el control, la vigilancia y la auditoría.
  return (
    <svg {...base} {...props}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function ContratacionIcon(props: SVGProps<SVGSVGElement>) {
  // Documento firmado: la contratación y la adquisición de bienes y servicios.
  return (
    <svg {...base} {...props}>
      <path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
      <path d="M14 3v6h6" />
      <path d="M8 16c1-1.5 2.5-1.5 3.5 0s2.5 1.5 3.5 0" />
    </svg>
  );
}

function TramitesServiciosIcon(props: SVGProps<SVGSVGElement>) {
  // Portapapeles con check: los trámites y servicios al ciudadano.
  return (
    <svg {...base} {...props}>
      <rect x="8" y="3" width="8" height="4" rx="1" />
      <path d="M8 5H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
      <path d="m9 14 2 2 4-4" />
    </svg>
  );
}

function InstrumentosGestionIcon(props: SVGProps<SVGSVGElement>) {
  // Archivador de carpetas: los instrumentos de gestión documental.
  return (
    <svg {...base} {...props}>
      <rect x="3" y="3" width="18" height="7" rx="1" />
      <rect x="3" y="14" width="18" height="7" rx="1" />
      <path d="M7 6.5h2" />
      <path d="M7 17.5h2" />
    </svg>
  );
}

function TransparenciaPasivaIcon(props: SVGProps<SVGSVGElement>) {
  // Sobre / bandeja de solicitudes: el seguimiento a las PQRS.
  return (
    <svg {...base} {...props}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  );
}

function AccesibilidadWebIcon(props: SVGProps<SVGSVGElement>) {
  // Figura de accesibilidad: las medidas de accesibilidad del sitio web.
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="7.5" r="1" />
      <path d="M7 10h10" />
      <path d="M12 10v4" />
      <path d="m9 18 3-4 3 4" />
    </svg>
  );
}

function HabeasDataIcon(props: SVGProps<SVGSVGElement>) {
  // Candado: la protección y el tratamiento de datos personales.
  return (
    <svg {...base} {...props}>
      <rect x="4" y="11" width="16" height="10" rx="2" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
      <circle cx="12" cy="16" r="1" />
    </svg>
  );
}

const ICONOS: Record<
  CategoriaId,
  (props: SVGProps<SVGSVGElement>) => React.ReactNode
> = {
  "mecanismos-de-contacto": MecanismosContactoIcon,
  "informacion-de-interes": InformacionInteresIcon,
  "estructura-organica": EstructuraOrganicaIcon,
  normatividad: NormatividadIcon,
  presupuesto: PresupuestoIcon,
  planeacion: PlaneacionIcon,
  control: ControlIcon,
  contratacion: ContratacionIcon,
  "tramites-servicios": TramitesServiciosIcon,
  "instrumentos-gestion": InstrumentosGestionIcon,
  "transparencia-pasiva": TransparenciaPasivaIcon,
  "accesibilidad-web": AccesibilidadWebIcon,
  "habeas-data": HabeasDataIcon,
};

export function CategoriaIcon({
  id,
  ...props
}: { id: CategoriaId } & SVGProps<SVGSVGElement>) {
  const Icono = ICONOS[id];
  return Icono ? <>{Icono(props)}</> : null;
}
