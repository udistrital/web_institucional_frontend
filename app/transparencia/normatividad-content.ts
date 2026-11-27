export type NormaTransparencia = {
  titulo: string;
  url: string;
  descripcion?: string;
  actualizacion: string;
};

export type GrupoNormativaExterna = {
  id: string;
  entidad: string;
  normas: NormaTransparencia[];
};

export const NORMATIVIDAD_INTERNA: NormaTransparencia[] = [
  {
    titulo: "Acuerdo 02 de 2015",
    url: "http://sgral.udistrital.edu.co/xdata/csu/acu_2015-02.pdf",
    descripcion:
      "Por medio del cual se adoptan políticas de Transparencia y Anticorrupción en la universidad Distrital Francisco José de Caldas",
    actualizacion: "11 de marzo del 2020",
  },
  {
    titulo: "Acuerdo 04 de 2006",
    url: "https://sgral.udistrital.edu.co/xdata/csu/acu_2006-004.pdf",
    descripcion:
      "Por el cual se establece y unifica el régimen de liquidación matriculas para los estudiantes de la Universidad Distrital Francisco José de Caldas",
    actualizacion: "11 de marzo del 2020",
  },
  {
    titulo: "Acuerdo 08 de 2006",
    url: "https://sgral.udistrital.edu.co/xdata/ca/acu_2006-008.pdf",
    descripcion:
      "Por la cual modifica el Acuerdo 004 del 16 de abril de 2002, que creó la Cátedra UNESCO de desarrollo del niño en la Universidad.",
    actualizacion: "11 de marzo del 2020",
  },
  {
    titulo: "Acuerdo 10 de 1996",
    url: "https://sgral.udistrital.edu.co/xdata/csu/acu_1996-010.pdf",
    descripcion:
      "Por el cual se expide el estatuto de Bienestar Institucional de la Universidad Distrital Francisco José de Caldas.",
    actualizacion: "11 de marzo del 2020",
  },
  {
    titulo: "Acuerdo 10 de 2006",
    url: "https://sgral.udistrital.edu.co/xdata/ca/acu_2006-010.pdf",
    descripcion:
      "Por el cual se reglamentan los Artículos 39, 40, 41 y 42 del Acuerdo 004 de enero 25 de 2006, expedido por el Consejo Superior Universitario.",
    actualizacion: "11 de marzo del 2020",
  },
  {
    titulo: "Acuerdo 10 de 2015",
    url: "https://sgral.udistrital.edu.co/xdata/csu/acu_2015-10.pdf",
    descripcion:
      "Por el cual se expide y adopta el Código de Ética y Buen Gobierno de la Universidad Distrital Francisco José de Caldas.",
    actualizacion: "11 de marzo del 2020",
  },
  {
    titulo: "Acuerdo 33 de 2014",
    url: "http://sgral.udistrital.edu.co/xdata/ca/acu_2014-033.pdf",
    descripcion:
      "Por el cual se modifica el Acuerdo 018 de abril 27 de 2011 que creó y unifico los cupos especiales en la Universidad Distrital Francisco José de Caldas",
    actualizacion: "11 de marzo del 2020",
  },
  {
    titulo: "Resolución 026 de 2016",
    url: "http://sgral.udistrital.edu.co/xdata/rec/res_2016-026.pdf",
    descripcion:
      "Por la cual se crea el Comité de Seguimiento a los Índices de Transparencia de la Universidad Distrital Francisco José de Caldas y se definen sus funciones.",
    actualizacion: "11 de marzo del 2020",
  },
];

export const NORMATIVIDAD_EXTERNA: GrupoNormativaExterna[] = [
  {
    id: "alcaldia-mayor",
    entidad: "Alcaldía Mayor",
    normas: [
      {
        titulo: "Acuerdo 630 de 2015",
        url: "http://www.alcaldiabogota.gov.co/sisjur/normas/Norma1.jsp?i=64349",
        descripcion:
          "Por medio del cual se establecen unos protocolos para el ejercicio del derecho de petición en cumplimiento de la ley 1755 de 2015 y se dictan otras disposiciones",
        actualizacion: "11 de marzo del 2020",
      },
      {
        titulo: "Circular 030 de 2015",
        url: "http://www.alcaldiabogota.gov.co/sisjur/normas/Norma1.jsp?i=61035",
        descripcion:
          "Implementación de la ley de transparencia (ley 1712 de 2014 y decreto 103 de 2015)",
        actualizacion: "11 de marzo del 2020",
      },
      {
        titulo: "Circular 053 de 2016",
        url: "http://www.alcaldiabogota.gov.co/sisjur/normas/Norma1.jsp?i=66354",
        descripcion:
          "Publicación y divulgación de información obligatoria requerida respecto a servicios, procedimientos y funcionamiento del sujeto obligado, con relación a la atención de peticiones ciudadanas - ley de transparencia y del derecho de acceso a la información pública nacional.",
        actualizacion: "11 de marzo del 2020",
      },
      {
        titulo: "Circular 09 de 2016",
        url: "https://www.alcaldiabogota.gov.co/sisjur/normas/Norma1.jsp?i=65756",
        descripcion:
          "Implementación de la ley de transparencia (ley 1712 de 2014, decreto 103 de 2015 y resolución 3564 de 2015)",
        actualizacion: "11 de marzo del 2020",
      },
      {
        titulo: "Decreto 371 de 2010",
        url: "https://www.alcaldiabogota.gov.co/sisjur/normas/Norma1.jsp?i=40685",
        descripcion:
          "Por el cual se establecen lineamientos para preservar y fortalecer la transparencia y para la prevención de la corrupción en las Entidades y Organismos del Distrito Capital",
        actualizacion: "11 de marzo del 2020",
      },
    ],
  },
  {
    id: "veeduria-distrital",
    entidad: "Veeduría Distrital",
    normas: [
      {
        titulo: "Circular 09 de 2016",
        url: "https://www.veeduriadistrital.gov.co/normatividad/circulares-anos-anteriores",
        descripcion:
          "Cumplimiento del Acuerdo 630 de 2015, Decretos Distritales 371 de 2010 y 197 de 2014, y Circulares 006 y 012 de 2015 de la Veeduría Distrital.",
        actualizacion: "06 de mayo del 2026",
      },
    ],
  },
  {
    id: "procuraduria-general",
    entidad: "Procuraduría General de la Nación",
    normas: [
      {
        titulo: "Circular 18 del 2021",
        url: "https://www.funcionpublica.gov.co/eva/gestornormativo/norma.php?i=171926",
        actualizacion: "15 de diciembre del 2023",
      },
    ],
  },
  {
    id: "presidencia-republica",
    entidad: "Presidencia de la República",
    normas: [
      {
        titulo: "Decreto 103 de 2015",
        url: "https://www.alcaldiabogota.gov.co/sisjur/normas/Norma1.jsp?i=60556",
        descripcion:
          "Por el cual se reglamenta parcialmente la Ley 1712 de 2014 y se dictan otras disposiciones",
        actualizacion: "11 de marzo del 2020",
      },
      {
        titulo: "Decreto 1081 de 2015",
        url: "https://www.funcionpublica.gov.co/eva/gestornormativo/norma.php?i=73593",
        descripcion:
          "Por medio del cual se expide el Decreto Reglamentario Único del Sector Presidencia de la República",
        actualizacion: "01 de septiembre del 2026",
      },
      {
        titulo:
          "Estrategia de Gobierno en Línea - Presidencia de la República de Colombia",
        url: "https://gobiernodigital.mintic.gov.co/portal/",
        actualizacion: "22 de septiembre del 2025",
      },
    ],
  },
  {
    id: "congreso-republica",
    entidad: "Congreso de la República",
    normas: [
      {
        titulo: "Ley 1712 de 2014",
        url: "http://www.alcaldiabogota.gov.co/sisjur/normas/Norma1.jsp?i=56882",
        descripcion:
          "Por medio de la cual se crea la Ley de Transparencia y del Derecho de Acceso a la Información Pública Nacional y se dictan otras disposiciones",
        actualizacion: "11 de marzo del 2020",
      },
    ],
  },
  {
    id: "mintic",
    entidad: "Ministerio de Tecnologías de la Información y las Comunicaciones",
    normas: [
      {
        titulo: "Resolución 1519 de 2020",
        url: "https://normograma.mintic.gov.co/mintic/compilacion/docs/resolucion_mintic_1519_2020.htm",
        descripcion:
          "Por la cual se definen los estándares y directrices para publicar la información señalada en la Ley 1712 del 2014 y se definen los requisitos materia de acceso a la información pública, accesibilidad web, seguridad digital, y datos abiertos.",
        actualizacion: "22 de septiembre del 2025",
      },
      {
        titulo: "Resolución 3564 de 2015",
        url: "https://normograma.mintic.gov.co/mintic/compilacion/docs/resolucion_mintic_3564_2015.htm",
        descripcion:
          "Por la cual se reglamentan los artículos 2.1.1.2.1.1, 2.1.1.2.1.11, 2.1.1.2.22. y el parágrafo 2 del articulo 2.1.1.3.1.1 del Decreto N° 2618 de 2012",
        actualizacion: "22 de septiembre del 2025",
      },
    ],
  },
];
