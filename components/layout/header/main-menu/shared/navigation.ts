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
      href: "/facultades",
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
    { label: "Calendario académico", href: "/nuestra-universidad/calendario-academico" },
    { label: "Organigrama", href: "/nuestra-universidad/organigrama" },
    { label: "Modelo de operacion", href: "/nuestra-universidad/modelo-de-operacion" },
  ]
}
export const ofertaAcademicaNavigation: NavigationItem = {
  label: "Oferta académica",
  href: "/nuestra-universidad/oferta-academica",
  children: [
    {
      label: "Facultad de Artes ASAB",
      href: "/nuestra-universidad/oferta-academica?facultad=facultad-de-artes-asab",
      children: [
        { label: "Pregrado", href: "/nuestra-universidad/oferta-academica?facultad=facultad-de-artes-asab&nivel=pregrado" },
        { label: "Maestría", href: "/nuestra-universidad/oferta-academica?facultad=facultad-de-artes-asab&nivel=maestria" },
        { label: "Doctorado", href: "/nuestra-universidad/oferta-academica?facultad=facultad-de-artes-asab&nivel=doctorado" },
      ],
    },
    {
      label: "Facultad de Ciencias de la Salud",
      href: "/nuestra-universidad/oferta-academica?facultad=facultad-de-ciencias-de-la-salud",
      children: [
        { label: "Pregrado", href: "/nuestra-universidad/oferta-academica?facultad=facultad-de-ciencias-de-la-salud&nivel=pregrado" },
      ],
    },
    {
      label: "Facultad de Ciencias y Educación",
      href: "/nuestra-universidad/oferta-academica?facultad=facultad-de-ciencias-y-educacion",
      children: [
        { label: "Pregrado", href: "/nuestra-universidad/oferta-academica?facultad=facultad-de-ciencias-y-educacion&nivel=pregrado" },
        { label: "Especialización", href: "/nuestra-universidad/oferta-academica?facultad=facultad-de-ciencias-y-educacion&nivel=especializacion" },
        { label: "Maestría", href: "/nuestra-universidad/oferta-academica?facultad=facultad-de-ciencias-y-educacion&nivel=maestria" },
        { label: "Doctorado", href: "/nuestra-universidad/oferta-academica?facultad=facultad-de-ciencias-y-educacion&nivel=doctorado" },
      ],
    },
    {
      label: "Facultad de Ciencias Matemáticas y Naturales",
      href: "/nuestra-universidad/oferta-academica?facultad=facultad-de-ciencias-matematicas-y-naturales",
      children: [
        { label: "Pregrado", href: "/nuestra-universidad/oferta-academica?facultad=facultad-de-ciencias-matematicas-y-naturales&nivel=pregrado" },
        { label: "Especialización", href: "/nuestra-universidad/oferta-academica?facultad=facultad-de-ciencias-matematicas-y-naturales&nivel=especializacion" },
        { label: "Maestría", href: "/nuestra-universidad/oferta-academica?facultad=facultad-de-ciencias-matematicas-y-naturales&nivel=maestria" },
        { label: "Doctorado", href: "/nuestra-universidad/oferta-academica?facultad=facultad-de-ciencias-matematicas-y-naturales&nivel=doctorado" },
      ],
    },
    {
      label: "Facultad de Ingeniería",
      href: "/nuestra-universidad/oferta-academica?facultad=facultad-de-ingenieria",
      children: [
        { label: "Pregrado", href: "/nuestra-universidad/oferta-academica?facultad=facultad-de-ingenieria&nivel=pregrado" },
        { label: "Especialización", href: "/nuestra-universidad/oferta-academica?facultad=facultad-de-ingenieria&nivel=especializacion" },
        { label: "Maestría", href: "/nuestra-universidad/oferta-academica?facultad=facultad-de-ingenieria&nivel=maestria" },
        { label: "Doctorado", href: "/nuestra-universidad/oferta-academica?facultad=facultad-de-ingenieria&nivel=doctorado" },
      ],
    },
    {
      label: "Facultad de Medio Ambiente y Recursos Naturales",
      href: "/nuestra-universidad/oferta-academica?facultad=facultad-del-medio-ambiente-y-recursos-naturales",
      children: [
        { label: "Pregrado", href: "/nuestra-universidad/oferta-academica?facultad=facultad-del-medio-ambiente-y-recursos-naturales&nivel=pregrado" },
        { label: "Especialización", href: "/nuestra-universidad/oferta-academica?facultad=facultad-del-medio-ambiente-y-recursos-naturales&nivel=especializacion" },
        { label: "Maestría", href: "/nuestra-universidad/oferta-academica?facultad=facultad-del-medio-ambiente-y-recursos-naturales&nivel=maestria" },
        { label: "Doctorado", href: "/nuestra-universidad/oferta-academica?facultad=facultad-del-medio-ambiente-y-recursos-naturales&nivel=doctorado" },
      ],
    },
    {
      label: "Facultad Tecnológica",
      href: "/nuestra-universidad/oferta-academica?facultad=facultad-tecnologica",
      children: [
        { label: "Pregrado", href: "/nuestra-universidad/oferta-academica?facultad=facultad-tecnologica&nivel=pregrado" },
        { label: "Especialización", href: "/nuestra-universidad/oferta-academica?facultad=facultad-tecnologica&nivel=especializacion" },
        { label: "Maestría", href: "/nuestra-universidad/oferta-academica?facultad=facultad-tecnologica&nivel=maestria" },
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
