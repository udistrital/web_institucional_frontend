export type NavigationItem = {
  label: string
  href: string
  children?: NavigationItem[]
}

export const campusNavigation: NavigationItem = {
  label: "Campus",
  href: "/campus",
  children: [
    {
      label: "Sedes",
      href: "/campus/sedes",
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
    {
      label: "Facultades",
      href: "/campus/facultades",
      children: [
        { label: "Facultad de Artes ASAB", href: "/facultades/artes-asab" },
        { label: "Facultad de Ciencias de la Salud", href: "/facultades/ciencias-salud" },
        { label: "Facultad de Ciencias y Educación", href: "/facultades/ciencias-educacion" },
        { label: "Facultad de Ciencias Matemáticas y Naturales", href: "/facultades/ciencias-matematicas-naturales" },
        { label: "Facultad de Ingeniería", href: "/facultades/ingenieria" },
        { label: "Facultad de Medio Ambiente y Recursos Naturales", href: "/facultades/medio-ambiente-recursos-naturales" },
        { label: "Facultad Tecnológica", href: "/facultades/tecnologica" },
      ],
    },
        {
      label: "Bibliotecas",
      href: "/campus/bibliotecas",
      children: [
        { label: "Bibliotecas", href: "/campus/bibliotecas" },
        { label: "Biblioteca digital", href: "/campus/biblioteca-digital" },
        { label: "Repositorio institucional", href: "/campus/repositorio-institucional" },
        { label: "Repositorio de datos de investigación", href: "/campus/repositorio-datos" },
        { label: "Centro de documentos", href: "/campus/centro-documentos" },
      ],
    },
    {
      label: "Museos",
      href: "/campus/museos",
      children: [
        { label: "Artes", href: "/campus/museos/artes" },
        { label: "Astronomía", href: "/campus/museos/astronomia" },
        { label: "Ciencias naturales", href: "/campus/museos/ciencias-naturales" },
      ],
    },
    {
      label: "Bienestar",
      href: "/campus/bienestar",
      children: [
        { label: "Apoyo alimentario", href: "/campus/bienestar/apoyo-alimentario" },
        { label: "Reliquidación de matrícula", href: "/campus/bienestar/reliquidacion" },
        { label: "Deportes", href: "/campus/bienestar/deportes" },
        { label: "Desarrollo humano y salud", href: "/campus/bienestar/desarrollo-humano-salud" },
        { label: "Derechos humanos", href: "/campus/bienestar/derechos-humanos" },
      ],
    },
  ],
}

export const nuestraUniversidadNavigation: NavigationItem = {
  label: "Nuestra universidad",
  href: "/nuestra-universidad",
  children: [
    { label: "Sobre Nosotros", href: "/nuestra-universidad/sobre-nosotros" },
    { label: "Direccionamiento estrategico", href: "/nuestra-universidad/direccionamiento-estrategico" },
    { label: "Calendario academico", href: "/nuestra-universidad/calendario-academico" },
    { label: "Organigrama", href: "/nuestra-universidad/organigrama" },
    { label: "Modelo de operacion", href: "/nuestra-universidad/modelo-de-operacion" },
  ]
}
export const ofertaAcademicaNavigation: NavigationItem = {
  label: "Oferta académica",
  href: "/oferta-academica",
  children: [
    {
      label: "Facultad de Artes ASAB",
      href: "/oferta-academica/artes-asab",
      children: [
        { label: "Pregrado", href: "/oferta-academica/artes-asab/pregrado" },
        { label: "Maestría", href: "/oferta-academica/artes-asab/maestria" },
        { label: "Doctorado", href: "/oferta-academica/artes-asab/doctorado" },
      ],
    },
    {
      label: "Facultad de Ciencias de la Salud",
      href: "/oferta-academica/ciencias-salud",
      children: [
        { label: "Pregrado", href: "/oferta-academica/ciencias-salud/pregrado" },
      ],
    },
    {
      label: "Facultad de Ciencias y Educación",
      href: "/oferta-academica/ciencias-educacion",
      children: [
        { label: "Pregrado", href: "/oferta-academica/ciencias-educacion/pregrado" },
        { label: "Especialización", href: "/oferta-academica/ciencias-educacion/especializacion" },
        { label: "Maestría", href: "/oferta-academica/ciencias-educacion/maestria" },
        { label: "Doctorado", href: "/oferta-academica/ciencias-educacion/doctorado" },
      ],
    },
    {
      label: "Facultad de Ciencias Matemáticas y Naturales",
      href: "/oferta-academica/ciencias-matematicas-naturales",
      children: [
        { label: "Pregrado", href: "/oferta-academica/ciencias-matematicas-naturales/pregrado" },
        { label: "Especialización", href: "/oferta-academica/ciencias-matematicas-naturales/especializacion" },
        { label: "Maestría", href: "/oferta-academica/ciencias-matematicas-naturales/maestria" },
        { label: "Doctorado", href: "/oferta-academica/ciencias-matematicas-naturales/doctorado" },
      ],
    },
    {
      label: "Facultad de Ingeniería",
      href: "/oferta-academica/ingenieria",
      children: [
        { label: "Pregrado", href: "/oferta-academica/ingenieria/pregrado" },
        { label: "Especialización", href: "/oferta-academica/ingenieria/especializacion" },
        { label: "Maestría", href: "/oferta-academica/ingenieria/maestria" },
        { label: "Doctorado", href: "/oferta-academica/ingenieria/doctorado" },
      ],
    },
    {
      label: "Facultad de Medio Ambiente y Recursos Naturales",
      href: "/oferta-academica/medio-ambiente-recursos-naturales",
      children: [
        { label: "Pregrado", href: "/oferta-academica/medio-ambiente-recursos-naturales/pregrado" },
        { label: "Especialización", href: "/oferta-academica/medio-ambiente-recursos-naturales/especializacion" },
        { label: "Maestría", href: "/oferta-academica/medio-ambiente-recursos-naturales/maestria" },
        { label: "Doctorado", href: "/oferta-academica/medio-ambiente-recursos-naturales/doctorado" },
      ],
    },
    {
      label: "Facultad Tecnológica",
      href: "/oferta-academica/tecnologica",
      children: [
        { label: "Pregrado", href: "/oferta-academica/tecnologica/pregrado" },
        { label: "Especialización", href: "/oferta-academica/tecnologica/especializacion" },
        { label: "Maestría", href: "/oferta-academica/tecnologica/maestria" },
      ],
    },
        {
      label: "Externos",
      href: "/oferta-academica/Externos",
      children: [
        { label: "Instituto de idiomas ILUD", href: "/oferta-academica/ilud" },
        { label: "Insituto de extension", href: "/oferta-academica/extension" },
        { label: "Cursos", href: "/oferta-academica/cursos" },
        { label: "Diplomas", href: "/oferta-academica/diplomas" },
      ],
    },
  ],
}

