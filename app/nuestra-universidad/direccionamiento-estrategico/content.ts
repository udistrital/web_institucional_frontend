/**
 * Contenido estático de la página "Direccionamiento estratégico".
 *
 * Esta información es institucional y de baja frecuencia de cambio (misión,
 * visión, objetivos, políticas y normatividad), por lo que se mantiene en el
 * repositorio en lugar de consumirse desde Drupal. Las rutas de imágenes y de
 * documentos apuntan a los recursos oficiales de la Universidad.
 */

export type SectionId =
  | "mision-vision"
  | "objetivos"
  | "politicas-institucionales"
  | "normatividad";

export type SectionLink = {
  id: SectionId;
  label: string;
};

export const SECTIONS: SectionLink[] = [
  { id: "mision-vision", label: "Misión y visión" },
  { id: "objetivos", label: "Objetivos" },
  { id: "politicas-institucionales", label: "Políticas institucionales" },
  { id: "normatividad", label: "Normatividad" },
];

/* ------------------------------------------------------------------ */
/* 1. Misión y visión                                                 */
/* ------------------------------------------------------------------ */

export type Declaracion = {
  titulo: string;
  texto: string;
  imagen: string;
  imagenAlt: string;
};

export const MISION_VISION_ACTUALIZADO = "Actualizado el 17 de abril del 2026";

export const MISION_VISION: Declaracion[] = [
  {
    titulo: "Misión",
    texto:
      "La Universidad Distrital Francisco José de Caldas, como institución pública de educación superior, apropia saberes, produce conocimiento, forma integralmente a las nuevas generaciones y propugna, en tal calidad, por la transformación de la sociedad y la cultura hacia la vida digna, bajo los principios colectivos de convivencia, de paz, de equidad, de inclusión social y no discriminación, del buen vivir y de la defensa del medio ambiente, en la ciudad región de Bogotá, D. C., y en el territorio nacional, con perspectiva global.",
    imagen: "https://www.udistrital.edu.co/sites/default/files/imagen-sede/6/3.JPG",
    imagenAlt: "Sede de la Universidad Distrital Francisco José de Caldas.",
  },
  {
    titulo: "Visión",
    texto:
      "Para el 2030 la Universidad Distrital Francisco José de Caldas será reconocida, nacional e internacionalmente, como una institución de alta calidad en la formación de ciudadanos responsables y profesionales del mejor nivel, en la producción de conocimiento científico, artístico y de innovación tecnológica; propósitos que desplegará en los campos de la docencia, la investigación y la extensión.",
    imagen: "https://www.udistrital.edu.co/sites/default/files/imagen-sede/3/3.JPG",
    imagenAlt: "Sede de la Universidad Distrital Francisco José de Caldas.",
  },
];

/* ------------------------------------------------------------------ */
/* 2. Objetivos                                                       */
/* ------------------------------------------------------------------ */

export const OBJETIVOS_ACTUALIZADO = "Actualizado el 08 de octubre del 2020";

export const OBJETIVOS: string[] = [
  "Como institución de servicio público, impartir educación superior en las modalidades tecnológica, universitaria y avanzada o de posgrado, como medio eficaz para la realización plena del hombre colombiano, con miras a configurar una sociedad más justa, equilibrada y autónoma, enmarcada dignamente en la comunidad internacional.",
  "Ampliar las oportunidades de acceso a la educación superior, para que los colombianos y particularmente los egresados de los colegios oficiales del Distrito, que cumplan los requisitos, puedan ingresar a ella y beneficiarse de sus programas.",
  "Contribuir a que la Universidad sea factor de desarrollo espiritual y material del Distrito Capital de Bogotá.",
  "En síntesis, la visión de futuro para la Universidad Distrital Francisco José de Caldas es la de una institución de educación superior reconocida por la excelencia en la investigación, en la formación y en el servicio al grupo social, en el contexto de una cultura institucional basada en la eficiencia, la transparencia y la coherencia.",
];

/* ------------------------------------------------------------------ */
/* 3. Políticas institucionales                                       */
/* ------------------------------------------------------------------ */

export type Politica = {
  titulo: string;
  documentoUrl: string;
  /** Descripción o considerando oficial opcional del acuerdo. */
  descripcion?: string;
};

export const POLITICAS: Politica[] = [
  {
    titulo: "Política de Comunicaciones",
    documentoUrl: "https://sgral.udistrital.edu.co/xdata/csu/acu_2024-008.pdf",
  },
  {
    titulo: "Política de Egresados",
    documentoUrl: "https://sgral.udistrital.edu.co/xdata/csu/acu_2024-004.pdf",
  },
  {
    titulo: "Política de Derechos Humanos",
    documentoUrl: "https://sgral.udistrital.edu.co/xdata/csu/acu_2024-003.pdf",
  },
  {
    titulo: "Política de Gestión Documental",
    documentoUrl: "https://sgral.udistrital.edu.co/xdata/csu/acu_2023-016.pdf",
    descripcion:
      "Por el cual se adopta la Política de Gestión Documental de la Universidad Distrital Francisco José de Caldas.",
  },
  {
    titulo: "Política de Interinstitucionalización e Internacionalización",
    documentoUrl: "https://sgral.udistrital.edu.co/xdata/csu/acu_2023-009.pdf",
    descripcion:
      "Por el cual se adopta la Política de Interinstitucionalización e Internacionalización de la Universidad Distrital Francisco José de Caldas.",
  },
  {
    titulo: "Política Institucional de Educación Superior Incluyente y Accesible",
    documentoUrl: "https://sgral.udistrital.edu.co/xdata/csu/acu_2023-008.pdf",
    descripcion:
      "Por el cual se adopta la Política Institucional de Educación Superior Incluyente y Accesible de la Universidad Distrital Francisco José de Caldas.",
  },
  {
    titulo: "Acuerdo No. 004 de 2023",
    documentoUrl: "https://sgral.udistrital.edu.co/xdata/csu/acu_2023-004.pdf",
    descripcion:
      "Por medio del cual se expiden el Régimen Financiero y el Estatuto Financiero y Presupuestal de la Universidad Distrital Francisco José de Caldas.",
  },
  {
    titulo: "Política de Género y Diversidades Sexuales",
    documentoUrl: "https://sgral.udistrital.edu.co/xdata/csu/acu_2022-004.pdf",
    descripcion:
      "Por medio del cual se adopta la Política de Género y Diversidades Sexuales de la Universidad Distrital Francisco José de Caldas.",
  },
  {
    titulo: "Políticas de Transparencia y Anticorrupción",
    documentoUrl: "https://sgral.udistrital.edu.co/xdata/csu/acu_2015-02.pdf",
    descripcion:
      "Por medio del cual se adoptan políticas de Transparencia y Anticorrupción en la Universidad Distrital Francisco José de Caldas.",
  },
];

/* ------------------------------------------------------------------ */
/* 4. Normatividad                                                    */
/* ------------------------------------------------------------------ */

export type Norma = {
  titulo: string;
  url: string;
  /** Considerando o nota oficial opcional de la norma. */
  descripcion?: string;
  /** Fecha de actualización publicada por la Universidad. */
  actualizado?: string;
};

export type GrupoNormativo = {
  titulo: string;
  normas: Norma[];
};

export const NORMATIVIDAD: GrupoNormativo[] = [
  {
    titulo: "Estatutos",
    normas: [
      {
        titulo: "Política de Interinstitucionalización e Internacionalización",
        url: "https://sgral.udistrital.edu.co/xdata/csu/acu_2023-009.pdf",
        descripcion:
          "Por el cual se adopta la Política de Interinstitucionalización e Internacionalización de la Universidad Distrital Francisco José de Caldas.",
        actualizado: "12 de junio del 2026",
      },
      {
        titulo: "Política de Gestión Documental",
        url: "https://sgral.udistrital.edu.co/xdata/csu/acu_2023-016.pdf",
        descripcion:
          "Por el cual se adopta la Política de Gestión Documental de la Universidad Distrital Francisco José de Caldas.",
        actualizado: "12 de junio del 2026",
      },
      {
        titulo: "Política Institucional de Educación Superior Incluyente y Accesible",
        url: "https://sgral.udistrital.edu.co/xdata/csu/acu_2023-008.pdf",
        descripcion:
          "Por el cual se adopta la Política Institucional de Educación Superior Incluyente y Accesible de la Universidad Distrital Francisco José de Caldas.",
        actualizado: "12 de junio del 2026",
      },
      {
        titulo: "Política de Género y Diversidades Sexuales",
        url: "https://sgral.udistrital.edu.co/xdata/csu/acu_2022-004.pdf",
        descripcion:
          "Por medio del cual se adopta la Política de Género y Diversidades Sexuales de la Universidad Distrital Francisco José de Caldas.",
        actualizado: "12 de junio del 2026",
      },
      {
        titulo: "Acuerdo No. 004 de 2023",
        url: "https://sgral.udistrital.edu.co/xdata/csu/acu_2023-004.pdf",
        descripcion:
          "Por medio del cual se expiden el Régimen Financiero y el Estatuto Financiero y Presupuestal de la Universidad Distrital Francisco José de Caldas.",
        actualizado: "12 de junio del 2026",
      },
      {
        titulo: "Políticas de Transparencia y Anticorrupción",
        url: "https://sgral.udistrital.edu.co/xdata/csu/acu_2015-02.pdf",
        descripcion:
          "Por medio del cual se adoptan políticas de Transparencia y Anticorrupción en la Universidad Distrital Francisco José de Caldas.",
        actualizado: "12 de junio del 2026",
      },
      {
        titulo: "Régimen de liquidación matrículas",
        url: "http://sgral.udistrital.edu.co/xdata/csu/acu_2006-004.pdf",
        actualizado: "03 de marzo del 2020",
      },
      {
        titulo: "Estatuto General de Contratación",
        url: "http://sgral.udistrital.edu.co/xdata/csu/acu_2015-03.pdf",
        actualizado: "03 de marzo del 2020",
      },
      {
        titulo: "Reglamento Consejo de Participación Universitaria",
        url: "http://sgral.udistrital.edu.co/xdata/csu/acu_2012-005.pdf",
        actualizado: "03 de marzo del 2020",
      },
      {
        titulo: "Estatuto de Propiedad Intelectual",
        url: "http://sgral.udistrital.edu.co/xdata/csu/acu_2012-004.pdf",
        actualizado: "03 de marzo del 2020",
      },
      {
        titulo: "Reglamentación del Sistema de Investigaciones",
        url: "http://sgral.udistrital.edu.co/xdata/csu/acu_1994-014.pdf",
        actualizado: "03 de marzo del 2020",
      },
      {
        titulo: "Estatuto de Investigaciones",
        url: "http://sgral.udistrital.edu.co/xdata/csu/acu_1996-009.pdf",
        actualizado: "03 de marzo del 2020",
      },
      {
        titulo: "Estatuto Estudiantil",
        url: "http://sgral.udistrital.edu.co/xdata/csu/acu_1993-027.pdf",
        actualizado: "13 de marzo del 2020",
      },
      {
        titulo: "Estatuto Académico",
        url: "http://sgral.udistrital.edu.co/xdata/csu/acu_1996-004.pdf",
        actualizado: "13 de marzo del 2020",
      },
      {
        titulo: "Estatuto Docente",
        url: "http://sgral.udistrital.edu.co/xdata/csu/acu_2002-011.pdf",
        actualizado: "13 de marzo del 2020",
      },
      {
        titulo: "Estatuto General",
        url: "https://sgral.udistrital.edu.co/xdata/csu/acu_2025-004.pdf",
        actualizado: "22 de mayo del 2025",
      },
      {
        titulo:
          "Reglamentación devolución de saldos por concepto de matrículas y derechos pecuniarios",
        url: "http://sgral.udistrital.edu.co/xdata/ca/res_2017-132.pdf",
        descripcion:
          "Resolución N° 132 de 2017. Expedida por el Consejo Académico, por medio de la cual se reglamenta la devolución de saldos por concepto de matrículas y derechos pecuniarios en la Universidad Distrital.",
        actualizado: "03 de marzo del 2020",
      },
      {
        titulo: "Resolución 426 de 2018",
        url: "https://sgral.udistrital.edu.co/xdata/rec/res_2018-426.pdf",
        descripcion:
          "Por la cual se adopta el Protocolo para la Prevención y Atención de Casos de Violencia basada en género y violencia sexual de la Universidad Distrital Francisco José de Caldas.",
        actualizado: "03 de marzo del 2020",
      },
    ],
  },
  {
    titulo: "Planes",
    normas: [
      {
        titulo: "Plan de Desarrollo U.D. 2018 - 2030",
        url: "https://sgral.udistrital.edu.co/xdata/csu/acu_2018-09.pdf",
        actualizado: "13 de agosto del 2021",
      },
      {
        titulo: "Plan de Mejoramiento",
        url: "http://www1.udistrital.edu.co:8080/web/oficina-asesora-de-control-interno/informes",
        actualizado: "03 de marzo del 2020",
      },
      {
        titulo: "Proyectos de Inversión",
        url: "http://planeacion.udistrital.edu.co:8080/banco-de-proyectos",
        actualizado: "03 de marzo del 2020",
      },
      {
        titulo: "Plan Anticorrupción y Atención al Ciudadano",
        url: "http://planeacion.udistrital.edu.co:8080/plan-anticorrupcion-y-de-atencion-al-ciudadano",
        actualizado: "03 de marzo del 2020",
      },
      {
        titulo: "Plan Institucional de Gestión Ambiental PIGA",
        url: "https://sga.udistrital.edu.co/plan_institucional_de_gesti%C3%B3n_ambiental",
        actualizado: "01 de septiembre del 2021",
      },
      {
        titulo: "Proyecto Universitario Institucional - Acuerdo 11 de 2018",
        url: "http://sgral.udistrital.edu.co/xdata/csu/acu_2018-09.pdf",
        actualizado: "03 de marzo del 2020",
      },
      {
        titulo: "Proyecto Universitario Institucional - PUI",
        url: "https://sgral.udistrital.edu.co/xdata/csu/acu_2018-11.pdf",
        actualizado: "29 de julio del 2021",
      },
      {
        titulo: "Plan Institucional de Archivos PINAR",
        url: "http://sigud.udistrital.edu.co/vision/filesSIGUD/SIGUD%202018/Gestion%20Documental/GD-PG-002.pdf",
        actualizado: "03 de marzo del 2020",
      },
    ],
  },
  {
    titulo: "Distrital",
    normas: [
      {
        titulo: "Decreto 352 de 2002",
        url: "http://www.alcaldiabogota.gov.co/sisjur/normas/Norma1.jsp?i=5437",
        actualizado: "03 de marzo del 2020",
      },
      {
        titulo: "Estatuto Tributario Distrital",
        url: "http://www.alcaldiabogota.gov.co/sisjur/normas/Norma1.jsp?i=1637",
        actualizado: "03 de marzo del 2020",
      },
      {
        titulo: "Estatuto de Protección Ambiental",
        url: "http://www.alcaldiabogota.gov.co/sisjur/normas/Norma1.jsp?i=506",
        actualizado: "03 de marzo del 2020",
      },
      {
        titulo: "Estatuto de Planeación Local",
        url: "http://www.alcaldiabogota.gov.co/sisjur/normas/Norma1.jsp?i=524",
        actualizado: "03 de marzo del 2020",
      },
      {
        titulo: "Código de Policía",
        url: "http://www.alcaldiabogota.gov.co/sisjur/normas/Norma1.jsp?i=6671",
        actualizado: "03 de marzo del 2020",
      },
      {
        titulo: "Código del Buen Gobierno",
        url: "http://www.alcaldiabogota.gov.co/sisjur/normas/Norma1.jsp?i=5829",
        actualizado: "03 de marzo del 2020",
      },
    ],
  },
  {
    titulo: "Nacional",
    normas: [
      {
        titulo: "Resolución 1519 del 2020",
        url: "https://normograma.mintic.gov.co/mintic/docs/resolucion_mintic_1519_2020.htm",
        actualizado: "05 de octubre del 2021",
      },
      {
        titulo: "Circular 018 de 2021",
        url: "https://www.procuraduria.gov.co/portal/media/file/Circular%20No_%20018%20de%20septiembre%2022%20de%202021.pdf",
        actualizado: "05 de octubre del 2021",
      },
      {
        titulo: "Código Civil",
        url: "http://www.alcaldiabogota.gov.co/sisjur/normas/Norma1.jsp?i=39535",
        actualizado: "03 de marzo del 2020",
      },
      {
        titulo:
          "Ley de moralidad en la Administración Pública y erradicación de la corrupción administrativa",
        url: "https://www.alcaldiabogota.gov.co/sisjur/normas/Norma1.jsp?i=321",
        actualizado: "03 de marzo del 2020",
      },
      {
        titulo: "Estatuto Tributario Nacional",
        url: "http://www.alcaldiabogota.gov.co/sisjur/normas/Norma1.jsp?i=6533",
        actualizado: "03 de marzo del 2020",
      },
      {
        titulo: "Estatuto Nacional Contra el Secuestro",
        url: "http://www.alcaldiabogota.gov.co/sisjur/normas/Norma1.jsp?i=16061",
        actualizado: "03 de marzo del 2020",
      },
      {
        titulo: "Estatuto Financiero",
        url: "http://www.alcaldiabogota.gov.co/sisjur/normas/Norma1.jsp?i=1348",
        actualizado: "03 de marzo del 2020",
      },
      {
        titulo: "Estatuto de Contratación",
        url: "http://www.alcaldiabogota.gov.co/sisjur/normas/Norma1.jsp?i=304",
        actualizado: "03 de marzo del 2020",
      },
      {
        titulo: "Estatuto de Ciencia y Tecnología",
        url: "http://www.alcaldiabogota.gov.co/sisjur/normas/Norma1.jsp?i=1298",
        actualizado: "03 de marzo del 2020",
      },
      {
        titulo: "Estatuto Antitrámites",
        url: "http://www.alcaldiabogota.gov.co/sisjur/normas/Norma1.jsp?i=1208",
        actualizado: "03 de marzo del 2020",
      },
      {
        titulo: "Estatuto Anticorrupción",
        url: "http://www.alcaldiabogota.gov.co/sisjur/normas/Norma1.jsp?i=321",
        actualizado: "03 de marzo del 2020",
      },
      {
        titulo: "Código Sustantivo del Trabajo",
        url: "http://www.alcaldiabogota.gov.co/sisjur/normas/Norma1.jsp?i=33104",
        actualizado: "03 de marzo del 2020",
      },
      {
        titulo: "Código Penal",
        url: "http://www.alcaldiabogota.gov.co/sisjur/normas/Norma1.jsp?i=6388",
        actualizado: "03 de marzo del 2020",
      },
      {
        titulo: "Código Disciplinario Único",
        url: "http://www.alcaldiabogota.gov.co/sisjur/normas/Norma1.jsp?i=4589",
        actualizado: "03 de marzo del 2020",
      },
      {
        titulo:
          "Código de Procedimiento Administrativo y de lo Contencioso Administrativo",
        url: "http://www.alcaldiabogota.gov.co/sisjur/normas/Norma1.jsp?i=41249",
        actualizado: "03 de marzo del 2020",
      },
      {
        titulo: "Código de la Educación",
        url: "http://www.alcaldiabogota.gov.co/sisjur/normas/Norma1.jsp?i=292",
        actualizado: "03 de marzo del 2020",
      },
      {
        titulo: "Código Contencioso Administrativo",
        url: "http://www.alcaldiabogota.gov.co/sisjur/normas/Norma1.jsp?i=6543",
        actualizado: "03 de marzo del 2020",
      },
    ],
  },
];
