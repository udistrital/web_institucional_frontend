export type ServiceProfile = {
  label: string
  href: string
  overviewLabel?: string
  layout?: "rows" | "columns"
  children?: ServiceProfile[]
}
export const mainNavigation: ServiceProfile[] = [
  {
    label: "Aspirantes",
    href: "/aspirantes",
    overviewLabel: "Proceso para aspirantes",
    layout: "rows",
    children: [
      { label: "primer ingreso", href: "/aspirtantes/primer-ingreso" },
      { label: "resultado admisiones", href: "/aspirtantes/resultado-admisiones" },
      { label: "Reingreso", href: "/aspirtantes/reingreso" },
      { label: "Tranferencias", href: "/aspirtantes/transferencias" },
      { label: "Doble titulacion", href: "/aspirtantes/doble-titulacion" },
      { label: "Doble programa", href: "/aspirtantes/doble-programa" },
      { label: "Graduacion oportuna", href: "/aspirtantes/graduacion-oportuna" },
    ],
  },
  {
    label: "Estudiantes",
    href: "/estudiantes",
    overviewLabel: "Servicios para estudiantes",
    layout: "columns",
    children: [
      { label: "Sistema de gestion academica", href: "/estudiantes/sga" },
      { label: "Salud", href: "/estudiantes/salud"},
      { label: "Apoyo alimentario", href: "/estudiantes/museos" },
      { label: "Comite institucional de curriculo", href: "/estudiantes/apoyo-alimentario"},
      { label: "Deportes", href: "/estudiantes/bienestar" },
      { label: "Mesa de dialogo", href: "/estudiantes/mesa-de-dialogo" },
      { label: "Distrinautas", href: "/estudiantes/distrinautas" },
      { label: "Reliquidacion de matricula", href: "/estudiantes/reliquidacion-de-matricula" }
    ],
  },
  {
    label: "Educadores",
    href: "/educadores",
    overviewLabel: "Servicios para educadores",
    layout: "columns",
    children: [
      { label: "Movilidad academica", href: "/educadores/mobilidad-academica" },
      { label: "Sistema de gestion academica-Acceso docente y administrativos", href: "/educadores/sga-admin" },
      { label: "sistema integrado de gestion", href: "/educadores/SIGUD" },
      { label: "Sistema de investigacopn SICIUD", href: "/educadores/SICIUD" },
      { label: "Aulas virtuales posgrado", href: "/educadores/aulas-virtuales-posgrado" },
      { label: "Aulas virtuales pregrado", href: "/educadores/aulas-virtuales-pregrado" },
      { label: "Encuestas", href: "/educadores/encuestas" },
      { label: "Microsoft", href: "/educadores/microsoft" },
      { label: "Catalogo en linea", href: "/educadores/catalogo-en-linea" },
      { label: "Grupos de investigacion", href: "/educadores/grupos-de-investigacion" },
      { label: "correo institucional", href: "/educadores/correo-institucional" },
      { label: "Revistas cientificas", href: "/educadores/revistas-cientificas" },
      { label: "instelgencia institucional (BIS)", href: "/educadores/BIS" },
      { label: "Biblioteca digital", href: "/educadores/b-digital" },
      { label: "Laboratorios", href: "/educadores/laboratorios" },
      { label: "Antivirus", href: "/educadores/antivirus" },
      { label: "Servicio de descubrimiento", href: "/educadores/servicio-de-descubrimiento" },
      { label: "Campus virtual", href: "/educadores/campus-virtual" },
      { label: "Sermillero de investigacion", href: "/educadores/sermillero-de-investigacion" },
      { label: "Sistema de conceptos legales", href: "/educadores/sistema-de-conceptos-legales" }
    ],
  },
  {
    label: "Administrativos",
    href: "/administrativos",
    overviewLabel: "Servicios para funcionarios",
    layout: "columns",
    children: [
      { label: "Aplicativo para cumplidos CPS GAIA", href: "/administrativos/gaia" },
      { label: "Sistema de informacion ICARO", href: "/administrativos/icaro" },
      { label: "Escritorio virtual", href: "/administrativos/escritorio-virtual" },
      { label: "Sistema de bibliotecas", href: "/administrativos/sistema-de-bibliotecas" },
      { label: "Hora legal colombia", href: "/administrativos/hora-legal-colombia" },
      { label: "Reforma UD", href: "/administrativos/reforma-ud" },
      { label: "Sistema de gestión ambiental", href: "/administrativos/gestion-ambiental" },
      { label: "Sistema Agora", href: "/administrativos/sistema-agora" },
      { label: "Aulas vrituales - Planestic UD", href: "/administrativos/aulas-virtuales-planestic-ud" },
      { label: "Subsistema de gestion de la seguridad y salud en el trabajo", href: "/administrativos/sub-sistema-seguridadysalud" },
      { label: "Asamblea universitaria", href: "/administrativos/asamblea-universitaria" },
      { label: "Subsisteam de responsabilidad social", href: "/administrativos/subsistema-responsabilidad-social" },
    ],
  },
]