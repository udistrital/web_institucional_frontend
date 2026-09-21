import type { SVGProps } from "react"
import type { NavigationItem } from "@/navegation/navigation"

interface MenuIconProps extends SVGProps<SVGSVGElement> {
  item?: NavigationItem
  href?: string
  label?: string
  className?: string
}

function resolveIconKey(href: string = "", label: string = ""): string {
  const cleanHref = href.toLowerCase()
  const cleanLabel = label
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")

  // --- SECCIONES DE CAMPUS ---
  if (cleanHref.includes("/campus/sedes") || cleanLabel.includes("sedes")) return "sedes"
  if (cleanHref.includes("/campus/bibliotecas") || cleanLabel.includes("biblioteca")) return "bibliotecas"
  if (cleanHref.includes("/campus/museos") || cleanLabel.includes("museo")) return "museos"
  if (cleanHref.includes("/campus/bienestar") || cleanLabel.includes("bienestar")) return "bienestar"

  // --- OFERTA ACADÉMICA Y FACULTADES ---
  if (cleanHref.includes("artes-asab") || cleanLabel.includes("artes")) return "artes"
  if (cleanHref.includes("ciencias-salud") || cleanLabel.includes("salud")) return "salud"
  if (cleanHref.includes("ciencias-educacion") || cleanLabel.includes("educacion")) return "educacion"
  if (cleanHref.includes("ciencias-matematicas") || cleanLabel.includes("matematicas")) return "ciencias"
  if (cleanHref.includes("ingenieria")) return "ingenieria"
  if (cleanHref.includes("medio-ambiente") || cleanLabel.includes("ambiente")) return "medio-ambiente"
  if (cleanHref.includes("tecnologica")) return "tecnologica"
  if (cleanHref.includes("externos") || cleanHref.includes("ilud") || cleanHref.includes("extension")) return "externos"

  // --- NIVELES DE FORMACIÓN ---
  if (cleanLabel.includes("doctorado") || cleanLabel.includes("maestria") || cleanLabel.includes("especializacion")) return "posgrado"
  if (cleanLabel.includes("pregrado")) return "pregrado"
  if (cleanHref.includes("/campus/facultades") || cleanLabel.includes("facultad")) return "facultades"

  return "default"
}

export default function MenuIcon({
  item,
  href,
  label,
  className = "h-5 w-5",
  ...props
}: MenuIconProps) {
  const targetHref = item?.href || href || ""
  const targetLabel = item?.label || label || ""
  const iconKey = resolveIconKey(targetHref, targetLabel)

  const commonProps = {
    className,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
    ...props,
  }

  switch (iconKey) {
    case "sedes":
      return (
        <svg {...commonProps}>
          <rect width="16" height="20" x="4" y="2" rx="2" ry="2" />
          <path d="M9 22v-4h6v4" />
          <path d="M8 6h.01M16 6h.01M8 10h.01M16 10h.01M8 14h.01M16 14h.01" />
        </svg>
      )

    case "bibliotecas":
      return (
        <svg {...commonProps}>
          <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
          <path d="M6 6h10M6 10h10" />
        </svg>
      )

    case "museos":
      return (
        <svg {...commonProps}>
          <line x1="3" x2="21" y1="22" y2="22" />
          <line x1="6" x2="6" y1="18" y2="11" />
          <line x1="10" x2="10" y1="18" y2="11" />
          <line x1="14" x2="14" y1="18" y2="11" />
          <line x1="18" x2="18" y1="18" y2="11" />
          <polygon points="12 2 20 7 4 7" />
        </svg>
      )

    case "bienestar":
      return (
        <svg {...commonProps}>
          <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
        </svg>
      )

    case "artes":
      return (
        <svg {...commonProps}>
          <circle cx="13.5" cy="6.5" r=".5" fill="currentColor" />
          <circle cx="17.5" cy="10.5" r=".5" fill="currentColor" />
          <circle cx="8.5" cy="7.5" r=".5" fill="currentColor" />
          <circle cx="6.5" cy="12.5" r=".5" fill="currentColor" />
          <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.563-2.512 5.563-5.563C22 6.5 17.5 2 12 2Z" />
        </svg>
      )

    case "salud":
      return (
        <svg {...commonProps}>
          <path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3" />
          <path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4" />
          <circle cx="20" cy="10" r="2" />
        </svg>
      )

    case "educacion":
      return (
        <svg {...commonProps}>
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
        </svg>
      )

    case "ciencias":
      return (
        <svg {...commonProps}>
          <path d="M10 2v7.31L4.75 18.1A2 2 0 0 0 6.46 21h11.08a2 2 0 0 0 1.71-2.9L14 9.31V2" />
          <path d="M8.5 2h7" />
          <path d="M7 16h10" />
        </svg>
      )

    case "ingenieria":
      return (
        <svg {...commonProps}>
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
      )

    case "medio-ambiente":
      return (
        <svg {...commonProps}>
          <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
          <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
        </svg>
      )

    case "tecnologica":
      return (
        <svg {...commonProps}>
          <rect width="18" height="18" x="3" y="3" rx="2" />
          <path d="m9 8 4 4-4 4" />
          <path d="M15 16h2" />
        </svg>
      )

    case "externos":
      return (
        <svg {...commonProps}>
          <circle cx="12" cy="12" r="10" />
          <line x1="2" x2="22" y1="12" y2="12" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
      )

    case "posgrado":
      return (
        <svg {...commonProps}>
          <path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z" />
          <path d="M22 10v6" />
          <path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5" />
        </svg>
      )

    case "pregrado":
    case "facultades":
    default:
      return (
        <svg {...commonProps}>
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      )
  }
}