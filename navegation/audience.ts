export const audienceProfiles = [
  { label: "Aspirantes", href: "/aspirantes" },
  { label: "Estudiantes", href: "/estudiantes" },
  { label: "Profesores", href: "/profesores" },
  { label: "Funcionarios", href: "/funcionarios" },
]

export const institutionalLinks = [
  { label: "Índices de transparencia", href: "/transparencia" },
  { label: "Atención al ciudadano", href: "/atencion-al-ciudadano" },
]

export type NavigationItem = {
  label: string
  href: string
  overviewLabel?: string
  layout?: "rows" | "columns"
  children?: NavigationItem[]
}

const faculties: NavigationItem[] = [
  { label: "Facultad de Artes ASAB", href: "/facultades/artes-asab" },
  { label: "Facultad de Ciencias de la Salud", href: "/facultades/ciencias-salud" },
  { label: "Facultad de Ciencias y Educación", href: "/facultades/ciencias-educacion" },
  { label: "Facultad de Ciencias Matemáticas y Naturales", href: "/facultades/ciencias-matematicas-naturales" },
  { label: "Facultad de Ingeniería", href: "/facultades/ingenieria" },
  { label: "Facultad de Medio Ambiente y Recursos Naturales", href: "/facultades/medio-ambiente-recursos-naturales" },
  { label: "Facultad Tecnológica", href: "/facultades/tecnologica" },
]

export const mainNavigation: NavigationItem[] = [
  {
    label: "Nuestra Universidad",
    href: "/universidad",
    overviewLabel: "Conoce toda nuestra universidad",
    layout: "rows",
    children: [
      { label: "Quiénes somos", href: "/universidad/quienes-somos" },
      { label: "Direccionamiento estratégico", href: "/universidad/direccionamiento-estrategico" },
      { label: "Información institucional", href: "/universidad/informacion-institucional" },
    ],
  },
  {
    label: "Campus",
    href: "/campus",
    overviewLabel: "Conoce todo nuestro campus",
    layout: "columns",
    children: [
      {
        label: "Sedes",
        href: "/campus/sedes",
        overviewLabel: "Conoce todas nuestras sedes",
        children: [
          { label: "Aduanilla de Paiba", href: "/campus/sedes/aduanilla-de-paiba" },
          { label: "Sede de Ingeniería", href: "/campus/sedes/ingenieria" },
          { label: "Macarena A", href: "/campus/sedes/macarena-a" },
          { label: "Macarena B", href: "/campus/sedes/macarena-b" },
          { label: "Ciudadela Universitaria Porvenir", href: "/campus/sedes/ciudadela-porvenir" },
          { label: "Sede Tecnológica", href: "/campus/sedes/tecnologica" },
          { label: "Sede Vivero", href: "/campus/sedes/vivero" },
          { label: "Sede Artes La Capuchina", href: "/campus/sedes/artes-capuchina" },
          { label: "ILUD", href: "/campus/sedes/ilud" },
        ],
      },
      { label: "Facultades", href: "/campus/facultades", overviewLabel: "Conoce todas nuestras facultades", children: faculties },
      {
        label: "Museos",
        href: "/campus/museos",
        overviewLabel: "Conoce todos nuestros museos",
        children: [
          { label: "Artes", href: "/campus/museos/artes" },
          { label: "Astronomía", href: "/campus/museos/astronomia" },
          { label: "Ciencias naturales", href: "/campus/museos/ciencias-naturales" },
        ],
      },
      {
        label: "Bibliotecas",
        href: "/campus/bibliotecas",
        overviewLabel: "Conoce todas nuestras bibliotecas",
        children: [
          { label: "Bibliotecas", href: "/campus/bibliotecas" },
          { label: "Biblioteca digital", href: "/campus/biblioteca-digital" },
          { label: "Repositorio institucional", href: "/campus/repositorio-institucional" },
          { label: "Repositorio de datos de investigación", href: "/campus/repositorio-datos" },
          { label: "Centro de documentos", href: "/campus/centro-documentos" },
        ],
      },
      {
        label: "Bienestar",
        href: "/campus/bienestar",
        overviewLabel: "Conoce todo nuestro bienestar",
        children: [
          { label: "Apoyo alimentario", href: "/campus/bienestar/apoyo-alimentario" },
          { label: "Reliquidación de matrícula", href: "/campus/bienestar/reliquidacion" },
          { label: "Deportes", href: "/campus/bienestar/deportes" },
          { label: "Desarrollo humano y salud", href: "/campus/bienestar/desarrollo-humano-salud" },
          { label: "Derechos humanos", href: "/campus/bienestar/derechos-humanos" },
        ],
      },
    ],
  },
  {
    label: "Oferta academica",
    href: "/programas",
    overviewLabel: "Conoce todos nuestros programas",
    layout: "columns",
    children: [
      { label: "Pregrado", href: "/programas/pregrado", overviewLabel: "Conoce nuestros programas de pregrado", children: faculties },
      { label: "Posgrado", href: "/programas/posgrado", overviewLabel: "Conoce nuestros programas de posgrado", children: faculties },
    ],
  },
  {
    label: "Academia",
    href: "/academia",
    overviewLabel: "Conoce toda nuestra academia",
    layout: "columns",
    children: [
      {
        label: "Unidad de extensión",
        href: "/academia/extension",
        overviewLabel: "Conoce nuestra unidad de extensión",
        children: [
          { label: "Cursos", href: "/academia/extension/cursos" },
          { label: "Servicios", href: "/academia/extension/servicios" },
          { label: "Convocatorias", href: "/academia/extension/convocatorias" },
        ],
      },
      {
        label: "Instituto de idiomas ILUD",
        href: "/academia/ilud",
        overviewLabel: "Conoce nuestro Instituto de Idiomas ILUD",
        children: [
          { label: "Estudia en ILUD", href: "/academia/ilud/estudia" },
          { label: "Academia", href: "/academia/ilud/academia" },
          { label: "Trámites", href: "/academia/ilud/tramites" },
          { label: "Formadores", href: "/academia/ilud/formadores" },
        ],
      },
      {
        label: "Aulas virtuales",
        href: "/academia/aulas-virtuales",
        overviewLabel: "Conoce nuestras aulas virtuales",
        children: [
          { label: "Aulas virtuales pregrado", href: "/academia/aulas-virtuales/pregrado" },
          { label: "Aulas virtuales posgrado", href: "/academia/aulas-virtuales/posgrado" },
        ],
      },
    ],
  },
  { label: "Admisiones", href: "/admisiones" },
  {
    label: "Investigación",
    href: "/investigacion",
    overviewLabel: "Conoce toda nuestra investigación",
    layout: "rows",
    children: [
      { label: "Revistas científicas", href: "/investigacion/revistas" },
      { label: "Libros de investigación", href: "/investigacion/libros" },
      { label: "Certificaciones", href: "/investigacion/certificaciones" },
      { label: "Cursos", href: "/investigacion/cursos" },
      { label: "Convocatorias", href: "/investigacion/convocatorias" },
    ],
  },
]

export const nuestraUniversidad = mainNavigation[0]
export const campus = mainNavigation[1]
export const ofertaAcademica = mainNavigation[2]
export const academia = mainNavigation[3]
export const admisiones = mainNavigation[4]
export const investigacion = mainNavigation[5]

export const menuButtons = [
  nuestraUniversidad,
  campus,
  ofertaAcademica,
  academia,
  admisiones,
  investigacion,
]
