export type ServiceProfile = {
  label: string
  href: string
  image?: string
  overviewLabel?: string
  layout?: "rows" | "columns"
  children?: ServiceProfile[]
}
export const mainNavigation: ServiceProfile[] = [
  {
    label: "Aspirantes",
    href: "/perfiles/aspirantes",
    image: "/image/soy aspirante.jpg",
    overviewLabel: "Proceso para aspirantes",
    layout: "rows",
    children: [
      { label: "primer ingreso", href: "/perfiles/aspirtantes/primer-ingreso" },
      { label: "resultado admisiones", href: "/perfiles/aspirtantes/resultado-admisiones" },
      { label: "Reingreso", href: "/perfiles/aspirtantes/reingreso" },
      { label: "Tranferencias", href: "/perfiles/aspirtantes/transferencias" },
      { label: "Doble titulacion", href: "/perfiles/aspirtantes/doble-titulacion" },
      { label: "Doble programa", href: "/perfiles/aspirtantes/doble-programa" },
      { label: "Graduacion oportuna", href: "/perfiles/aspirtantes/graduacion-oportuna" },
    ],
  },
  {
    label: "Estudiantes",
    href: "/perfiles/estudiantes",
    image: "/image/soy estudiante.jpeg",
    overviewLabel: "Servicios para estudiantes",
    layout: "columns",
    children: [
      { label: "Sistema de gestion academica", href: "/perfiles/estudiantes/sga" },
      { label: "Salud", href: "/perfiles/estudiantes/salud"},
      { label: "Apoyo alimentario", href: "/perfiles/estudiantes/museos" },
      { label: "Comite institucional de curriculo", href: "/perfiles/estudiantes/apoyo-alimentario"},
      { label: "Deportes", href: "/perfiles/estudiantes/bienestar" },
      { label: "Mesa de dialogo", href: "/perfiles/estudiantes/mesa-de-dialogo" },
      { label: "Distrinautas", href: "/perfiles/estudiantes/distrinautas" },
      { label: "Reliquidacion de matricula", href: "/perfiles/estudiantes/reliquidacion-de-matricula" }
    ],
  },
  {
    label: "Educadores",
    href: "/perfiles/educadores",
    image: "/image/soy docente.jpeg",
    overviewLabel: "Servicios para educadores",
    layout: "columns",
    children: [
      { label: "Movilidad academica", href: "/perfiles/educadores/mobilidad-academica" },
      { label: "Sistema de gestion academica-Acceso docente y administrativos", href: "/perfiles/educadores/sga-admin" },
      { label: "sistema integrado de gestion", href: "/perfiles/educadores/SIGUD" },
      { label: "Sistema de investigacopn SICIUD", href: "/perfiles/educadores/SICIUD" },
      { label: "Aulas virtuales posgrado", href: "/perfiles/educadores/aulas-virtuales-posgrado" },
      { label: "Aulas virtuales pregrado", href: "/perfiles/educadores/aulas-virtuales-pregrado" },
      { label: "Encuestas", href: "/perfiles/educadores/encuestas" },
      { label: "Microsoft", href: "/perfiles/educadores/microsoft" },
      { label: "Catalogo en linea", href: "/perfiles/educadores/catalogo-en-linea" },
      { label: "Grupos de investigacion", href: "/perfiles/educadores/grupos-de-investigacion" },
      { label: "correo institucional", href: "/perfiles/educadores/correo-institucional" },
      { label: "Revistas cientificas", href: "/perfiles/educadores/revistas-cientificas" },
      { label: "instelgencia institucional (BIS)", href: "/perfiles/educadores/BIS" },
      { label: "Biblioteca digital", href: "/perfiles/educadores/b-digital" },
      { label: "Laboratorios", href: "/perfiles/educadores/laboratorios" },
      { label: "Antivirus", href: "/perfiles/educadores/antivirus" },
      { label: "Servicio de descubrimiento", href: "/perfiles/educadores/servicio-de-descubrimiento" },
      { label: "Campus virtual", href: "/perfiles/educadores/campus-virtual" },
      { label: "Sermillero de investigacion", href: "/perfiles/educadores/sermillero-de-investigacion" },
      { label: "Sistema de conceptos legales", href: "/perfiles/educadores/sistema-de-conceptos-legales" }
    ],
  },
  {
    label: "Administrativos",
    href: "/perfiles/administrativos",
    image: "/image/soy funcionario.jpeg",
    overviewLabel: "Servicios para funcionarios",
    layout: "columns",
    children: [
      { label: "Aplicativo para cumplidos CPS GAIA", href: "/perfiles/administrativos/gaia" },
      { label: "Sistema de informacion ICARO", href: "/perfiles/administrativos/icaro" },
      { label: "Escritorio virtual", href: "/perfiles/administrativos/escritorio-virtual" },
      { label: "Sistema de bibliotecas", href: "/perfiles/administrativos/sistema-de-bibliotecas" },
      { label: "Hora legal colombia", href: "/perfiles/administrativos/hora-legal-colombia" },
      { label: "Reforma UD", href: "/perfiles/administrativos/reforma-ud" },
      { label: "Sistema de gestión ambiental", href: "/perfiles/administrativos/gestion-ambiental" },
      { label: "Sistema Agora", href: "/perfiles/administrativos/sistema-agora" },
      { label: "Aulas vrituales - Planestic UD", href: "/perfiles/administrativos/aulas-virtuales-planestic-ud" },
      { label: "Subsistema de gestion de la seguridad y salud en el trabajo", href: "/perfiles/administrativos/sub-sistema-seguridadysalud" },
      { label: "Asamblea universitaria", href: "/perfiles/administrativos/asamblea-universitaria" },
      { label: "Subsisteam de responsabilidad social", href: "/perfiles/administrativos/subsistema-responsabilidad-social" },
    ],
  },
  {
    label: "Egresados",
    href: "/perfiles/egresados",
    image: "/image/soy egresado.jpeg",
    overviewLabel: "Servicios para egresados",
    layout: "rows",
    children: [
      { label: "Sistema de gestion academica (SGA) - Egresados", href: "/perfiles/egresados/sga" },
      { label: "Inteligencia institucional", href: "/perfiles/egresados/inteligencia-institucional" },
      { label: "Acciones judiciales", href: "/perfiles/egresados/acciones-judiciales" },
    ],
  },
    {
    label: "Visitantes",
    href: "/perfiles/visitantes",
    image: "/image/soy visitante.jpg",
    overviewLabel: "Proceso para visitantes",
    layout: "rows",
    children: [
      { label: "Cursos de extension", href: "/perfiles/egresados/cursos-extension" },
      { label: "Cursos de idiomas", href: "/perfiles/egresados/cursos-idiomas" },
      { label: "Editorial UD", href: "/perfiles/egresados/editorial-ud" },
      { label: "Sistema de notificaciones", href: "/perfiles/egresados/sistema-de-notificaciones" },
      { label: "Tramites y procedimientos", href: "/perfiles/egresados/tramites-procedimientos" },
      { label: "Transparencia e informacion publica", href: "/perfiles/egresados/transparencia-publica" },
      { label: "La UD FM", href: "/perfiles/egresados/emisora" },
      { label: "Videos institucionales", href: "/perfiles/egresados/videos-institucionales" },
      { label: "Propcesos contractuales", href: "/perfiles/egresados/procesos-contractuales" },
      { label: "Tienda UD", href: "/perfiles/egresados/tienda-ud" },
      { label: "Bogota te escucha", href: "/perfiles/egresados/bogota-te-escucha" },
      { label: "Sistema de informacion de la secretaria general", href: "/perfiles/egresados/sisgral" },
      { label: "Notificaciones Judiciales", href: "/perfiles/egresados/notificaciones-judiciales" },
      { label: "Participacion Ciudadana", href: "/perfiles/egresados/participacion-ciudadana" },
    ],
  }
]