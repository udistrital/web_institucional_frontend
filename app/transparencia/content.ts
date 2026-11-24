/**
 * Contenido estático de la página "Transparencia y acceso a la información
 * pública".
 *
 * Reúne los enlaces exigidos por la Ley 1712 de 2014 (Ley de Transparencia y
 * del Derecho de Acceso a la Información Pública) organizados en las 13
 * categorías del esquema de publicación de la Universidad Distrital Francisco
 * José de Caldas, y el esquema de la Resolución 1519 de 2020 de MinTIC,
 * organizado en 10 secciones. Los títulos y las URLs se transcriben
 * literalmente de las fuentes oficiales; las descripciones cortas de cada
 * categoría se redactan aquí para orientar al ciudadano. Al ser información
 * institucional de baja frecuencia de cambio, se mantiene en el repositorio en
 * lugar de consumirse desde Drupal.
 */

export type EnlaceTransparencia = {
  titulo: string;
  url: string;
};

export type SubseccionTransparencia = {
  numero: string;
  titulo: string;
  enlaces: EnlaceTransparencia[];
};

export type CategoriaId =
  // Ley 1712 de 2014 (13 categorías).
  | "mecanismos-de-contacto"
  | "informacion-de-interes"
  | "estructura-organica"
  | "normatividad"
  | "presupuesto"
  | "planeacion"
  | "control"
  | "contratacion"
  | "tramites-servicios"
  | "instrumentos-gestion"
  | "transparencia-pasiva"
  | "accesibilidad-web"
  | "habeas-data"
  // Resolución 1519 de 2020 de MinTIC (10 secciones).
  | "info-entidad"
  | "res-normativa"
  | "res-contratacion"
  | "planeacion-presupuesto-informes"
  | "tramites"
  | "participa"
  | "datos-abiertos"
  | "grupos-interes"
  | "reporte-info-especifica"
  | "info-tributaria";

export type CategoriaTransparencia = {
  id: CategoriaId;
  numero: number;
  titulo: string;
  descripcion: string;
  subsecciones: SubseccionTransparencia[];
  /**
   * Marca una categoría cuyos enlaces oficiales aún no están publicados. El
   * mosaico la muestra igual, pero el modal despliega un aviso de "información
   * en proceso de publicación" en lugar de tarjetas de enlace.
   */
  pendiente?: boolean;
};

/**
 * Agrupa las categorías de una norma de transparencia junto con los textos de
 * la intro que las acompañan. Permite que el conmutador cambie de forma
 * uniforme entre la Ley 1712 de 2014 y la Resolución 1519 de 2020.
 */
export type LeyTransparencia = {
  id: string;
  etiqueta: string;
  etiquetaCorta?: string;
  kicker: string;
  introText: string;
  categorias: CategoriaTransparencia[];
};

export const CATEGORIAS_LEY_1712: CategoriaTransparencia[] = [
  {
    id: "mecanismos-de-contacto",
    numero: 1,
    titulo: "Mecanismos de contacto",
    descripcion:
      "Canales, sedes, horarios y correos para comunicarte con la Universidad y presentar tus solicitudes.",
    subsecciones: [
      {
        numero: "1.1",
        titulo: "Mecanismos para la atención al ciudadano",
        enlaces: [
          {
            titulo:
              "Formulario electrónico de solicitudes, peticiones, quejas, reclamos y denuncias - Bogotá Te Escucha",
            url: "http://www.bogota.gov.co/sdqs",
          },
          {
            titulo: "Mecanismos de contacto para la atención al ciudadano",
            url: "http://www.udistrital.edu.co/contacto",
          },
        ],
      },
      {
        numero: "1.2",
        titulo: "Localización física, horarios y días de atención al público",
        enlaces: [
          {
            titulo: "Sedes de la Universidad",
            url: "http://www.udistrital.edu.co/nuestra-universidad/campus/sedes",
          },
          {
            titulo: "Directorio Institucional",
            url: "https://www.udistrital.edu.co/directorio",
          },
        ],
      },
      {
        numero: "1.3",
        titulo: "Correo electrónico para notificaciones judiciales",
        enlaces: [
          {
            titulo: "Notificaciones judiciales",
            url: "https://juridica.udistrital.edu.co/notificaciones-judiciales",
          },
        ],
      },
      {
        numero: "1.4",
        titulo:
          "Políticas de seguridad de la información del sitio web y protección de datos personales",
        enlaces: [
          {
            titulo:
              "Términos,condiciones de uso y política de privacidad (Portal Academico)",
            url: "https://estudiantes.portaloas.udistrital.edu.co/appserv/terminos_y_condiciones.pdf",
          },
          {
            titulo: "Ley 1581 de 2012, Protección de datos personales",
            url: "https://www.funcionpublica.gov.co/eva/gestornormativo/norma.php?i=49981",
          },
          {
            titulo: "Políticas de privacidad del sitio web",
            url: "https://www.udistrital.edu.co/politica-de-privacidad",
          },
          {
            titulo: "Manual de políticas de tratamiento de datos personales",
            url: "http://sgral.udistrital.edu.co/xdata/rec/res_2013-727.pdf",
          },
        ],
      },
    ],
  },
  {
    id: "informacion-de-interes",
    numero: 2,
    titulo: "Información de Interés",
    descripcion:
      "Datos abiertos, publicaciones, convocatorias, noticias y recursos de consulta para la comunidad.",
    subsecciones: [
      {
        numero: "2.1",
        titulo: "Datos abiertos",
        enlaces: [
          {
            titulo:
              "Datos abiertos publicados en la plataforma distrital (Bogotá)",
            url: "http://datosabiertos.bogota.gov.co/organization/universidad-distrital-francisco-jose-de-caldas",
          },
          {
            titulo:
              "Datos abiertos publicados en la plataforma nacional Datos.gov.co",
            url: "https://www.datos.gov.co/browse?Informaci%C3%B3n-de-la-Entidad_Nombre-de-la-Entidad=Universidad+Distrital+Francisco+Jos%C3%A9+de+Caldas&sortBy=newest",
          },
          {
            titulo: "Avance de apertura de datos abiertos en la universidad",
            url: "https://juridica.udistrital.edu.co/datos-abiertos",
          },
        ],
      },
      {
        numero: "2.2",
        titulo: "Estudios, Investigaciones y otras publicaciones",
        enlaces: [
          {
            titulo: "Revistas Científicas",
            url: "https://revistas.udistrital.edu.co/",
          },
          {
            titulo:
              "Publicaciones IEIE - Instituto de Estudios e Investigaciones Educativas",
            url: "http://ieie.udistrital.edu.co/?page_id=105",
          },
          {
            titulo: "Repositorio Institucional - RIUD",
            url: "http://repository.udistrital.edu.co",
          },
          {
            titulo:
              "Centro de Investigaciones y Desarrollo Científico - Grupos de Investigación",
            url: "https://siciud.udistrital.edu.co/PGrupos/",
          },
          {
            titulo:
              "Centro de Investigaciones y Desarrollo Científico - Proyectos de Investigación",
            url: "https://siciud.udistrital.edu.co/PProyectos/",
          },
        ],
      },
      {
        numero: "2.3",
        titulo: "Convocatorias",
        enlaces: [
          {
            titulo:
              "Convocatorias - ODI - Oficina de Investigaciones - Externas Vigentes",
            url: "https://odi.udistrital.edu.co/convocatorias/externas",
          },
          {
            titulo:
              "Convocatorias de investigación del Instituto de Estudios e Investigaciones Educativas - IEIE",
            url: "https://ieie.udistrital.edu.co/investigacion/convocatorias",
          },
          {
            titulo:
              "Admisiones a programas de pregrado - Convocatorias académicas",
            url: "https://www.udistrital.edu.co/admisiones-pregrado",
          },
          {
            titulo:
              "Convocatorias - ODI Oficina de Investigaciones - Internas Vigentes",
            url: "https://odi.udistrital.edu.co/convocatorias/internas/2025",
          },
          {
            titulo:
              "Convocatorias Apoyo alimentario - Conectividad - Deportes y otros - Centro de Bienestar Institucional",
            url: "https://bienestar.udistrital.edu.co/",
          },
          {
            titulo:
              "Convocatoria Movilidad académica - Centro de Relaciones Interinstitucionales",
            url: "https://urelinter.udistrital.edu.co/",
          },
          {
            titulo: "Convocatorias - procesos contractuales",
            url: "http://contratacion.udistrital.edu.co",
          },
        ],
      },
      {
        numero: "2.4",
        titulo: "Preguntas y respuestas frecuentes",
        enlaces: [
          {
            titulo: "Preguntas y respuestas frecuentes",
            url: "/preguntas-frecuentes",
          },
        ],
      },
      {
        numero: "2.5",
        titulo: "Glosario",
        enlaces: [
          {
            titulo: "Glosario Institucional",
            url: "/glosario",
          },
        ],
      },
      {
        numero: "2.6",
        titulo: "Noticias",
        enlaces: [
          {
            titulo: "Noticias",
            url: "https://agencia.udistrital.edu.co/noticias",
          },
        ],
      },
      {
        numero: "2.7",
        titulo: "Calendario Actividades Académicas",
        enlaces: [
          {
            titulo: "Calendario académico posgrados 2025",
            url: "https://sgral.udistrital.edu.co/xdata/ca/res_2024-037.pdf",
          },
          {
            titulo: "Calendario académico de pregrado 2025",
            url: "https://sgral.udistrital.edu.co/xdata/ca/res_2024-050.pdf",
          },
        ],
      },
      {
        numero: "2.8",
        titulo: "Información para niñas, niños y adolescentes",
        enlaces: [
          {
            titulo: "Distrinautas - El sitio web de la UD para niños y niñas",
            url: "http://comunidad.udistrital.edu.co/distrinautas",
          },
        ],
      },
      {
        numero: "2.9",
        titulo: "Información adicional",
        enlaces: [
          {
            titulo: "Informacion Adicional",
            url: "https://www.udistrital.edu.co/inicio",
          },
        ],
      },
    ],
  },
  {
    id: "estructura-organica",
    numero: 3,
    titulo: "Estructura Orgánica y Talento Humano",
    descripcion:
      "Misión, funciones, organigrama y directorios de los servidores públicos y contratistas de la Universidad.",
    subsecciones: [
      {
        numero: "3.1",
        titulo: "Misión y visión",
        enlaces: [
          {
            titulo: "Misión y Visión",
            url: "http://www.udistrital.edu.co/nuestra-universidad/direccionamiento-estrategico/mision-vision",
          },
        ],
      },
      {
        numero: "3.2",
        titulo: "Funciones y deberes",
        enlaces: [
          {
            titulo: "Manual de Funciones y competencias",
            url: "https://sgral.udistrital.edu.co/xdata/rec/res_2002-1101.pdf",
          },
          {
            titulo: "Funciones misionales",
            url: "https://www.udistrital.edu.co/nuestra-universidad/quienes-somos/funciones-misionales",
          },
        ],
      },
      {
        numero: "3.3",
        titulo: "Procesos y procedimientos",
        enlaces: [
          {
            titulo: "Plan de estimulo docente",
            url: "https://sgral.udistrital.edu.co/xdata/csu/acu_2002-011.pdf",
          },
          {
            titulo: "Plan de Capacitacion Institucional",
            url: "https://viceadmin.udistrital.edu.co/talento-humano/index.php",
          },
          {
            titulo: "Procedimiento de vinculación personal (Docente)",
            url: "http://sigud.udistrital.edu.co/vision/filesSIGUD/SIGUD%202018/Gestion%20de%20Docencia/GD-PR-004/#list",
          },
          {
            titulo:
              "Procedimiento de vinculación personal de planta (Administrativo)",
            url: "http://sigud.udistrital.edu.co/vision/filesSIGUD/SIGUD%202018/Gestion%20y%20Desarrollo%20del%20Talento%20Humano/GDTH-PR-010/#list",
          },
          {
            titulo:
              "Procesos - Sistema Integrado de Gestión de la Universidad Distrital, SIGUD",
            url: "https://planeacionud.udistrital.edu.co/sigud",
          },
        ],
      },
      {
        numero: "3.4",
        titulo: "Organigrama",
        enlaces: [
          {
            titulo: "Organización funcional",
            url: "https://planeacionud.udistrital.edu.co/sigud/organizacion-funcional",
          },
        ],
      },
      {
        numero: "3.5",
        titulo:
          "Directorio de información de servidores públicos y contratistas",
        enlaces: [
          {
            titulo: "Directorio Telefónico Contratistas",
            url: "https://juridica.udistrital.edu.co/",
          },
          {
            titulo: "Directorio General",
            url: "http://transparencia.udistrital.edu.co/listado-servidores-publicos-contratistas",
          },
          {
            titulo: "Escalas Salariales",
            url: "http://transparencia.udistrital.edu.co/rangos-salariales",
          },
          {
            titulo: "Directorio de funcionarios y contratistas Sideap",
            url: "https://sideap.serviciocivil.gov.co/sideap/publico/directorio/buscar.xhtml",
          },
        ],
      },
      {
        numero: "3.6",
        titulo: "Directorio de entidades",
        enlaces: [
          {
            titulo: "Directorio de entidades",
            url: "http://transparencia.udistrital.edu.co/sector-educacion",
          },
        ],
      },
      {
        numero: "3.7",
        titulo:
          "Directorio de agremiaciones, asociaciones y otros grupos de interés",
        enlaces: [
          {
            titulo: "Organizaciones sindicales",
            url: "/organizaciones-sindicales",
          },
          {
            titulo:
              "Listado de entidades, agremiaciones, asociaciones y otros grupos de interés",
            url: "http://transparencia.udistrital.edu.co/enlaces-de-interes",
          },
        ],
      },
      {
        numero: "3.8",
        titulo: "Ofertas de empleo",
        enlaces: [
          {
            titulo: "Contratación de Bienes y Servicios Profesionales",
            url: "https://contratacion.udistrital.edu.co/",
          },
        ],
      },
    ],
  },
  {
    id: "normatividad",
    numero: 4,
    titulo: "Normatividad",
    descripcion:
      "Leyes, estatutos y reglamentos que rigen el funcionamiento de la Universidad.",
    subsecciones: [
      {
        numero: "4.1",
        titulo: "Normas Generales y Reglamentarias de la Universidad",
        enlaces: [
          {
            titulo: "Estatuto General de la Universidad",
            url: "https://sgral.udistrital.edu.co/xdata/csu/acu_2025-004.pdf",
          },
          {
            titulo:
              "Sistema de Información de la Secretaría General (estatutos, resoluciones, circulares, estructura, salarios y actos administrativos)",
            url: "http://sgral.udistrital.edu.co/xdata",
          },
          {
            titulo:
              "Normatividad nacional y distrital, estatutos, reglamentos y planes",
            url: "http://www.udistrital.edu.co/nuestra-universidad/direccionamiento-estrategico/normatividad",
          },
          {
            titulo:
              "Ley 30 de 1992 - Servicio Público de la Educación Superior",
            url: "https://www.funcionpublica.gov.co/eva/gestornormativo/norma.php?i=253",
          },
        ],
      },
    ],
  },
  {
    id: "presupuesto",
    numero: 5,
    titulo: "Presupuesto (Información Financiera)",
    descripcion:
      "Presupuesto asignado, ejecución histórica y estados financieros de la Universidad.",
    subsecciones: [
      {
        numero: "5.1",
        titulo: "Presupuesto general asignado",
        enlaces: [
          {
            titulo: "Presupuesto General 2025",
            url: "https://sgral.udistrital.edu.co/xdata/csu/res_2025-004.pdf",
          },
          {
            titulo:
              "Presupuesto General asignado para cada año fiscal y desagredado con modificaciones",
            url: "https://planeacionud.udistrital.edu.co/direccionamiento-estrategico/programacion-presupuestal",
          },
        ],
      },
      {
        numero: "5.2",
        titulo: "Ejecución presupuestal histórica anual",
        enlaces: [
          {
            titulo:
              "Distribución presupuestal de proyectos de inversión junto a los indicadores de gestión",
            url: "https://planeacionud.udistrital.edu.co/direccionamiento-estrategico/banco-proyectos",
          },
          {
            titulo:
              "Información histórica detallada de la ejecución presupuestal aprobada y ejecutada de ingresos y gastos anuales",
            url: "https://viceadmin.udistrital.edu.co/seccion-presupuesto/index.php/ejecuciones-presupuestales",
          },
        ],
      },
      {
        numero: "5.3",
        titulo: "Estados financieros",
        enlaces: [
          {
            titulo: "Estados financieros",
            url: "https://viceadmin.udistrital.edu.co/seccion-de-contabilidad/index.php/estados-financieros",
          },
        ],
      },
    ],
  },
  {
    id: "planeacion",
    numero: 6,
    titulo: "Planeación",
    descripcion:
      "Políticas, planes, programas, proyectos e indicadores que guían la gestión institucional.",
    subsecciones: [
      {
        numero: "6.1",
        titulo: "Políticas, lineamientos y manuales",
        enlaces: [
          {
            titulo: "Programa de Transparencia y Ética Pública 2024",
            url: "https://planeacionud.udistrital.edu.co/direccionamiento-estrategico/ptep",
          },
          {
            titulo: "Plan Maestro de Desarrollo Físico",
            url: "https://planeacionud.udistrital.edu.co/",
          },
          {
            titulo: "PAAC - Plan Antitramites",
            url: "https://planeacionud.udistrital.edu.co/direccionamiento-estrategico/ptep",
          },
          {
            titulo: "PAAC - Plan Rendición de Cuentas",
            url: "https://planeacionud.udistrital.edu.co/direccionamiento-estrategico/ptep",
          },
          {
            titulo: "PAAC - Plan Atención al Ciudadano",
            url: "https://planeacionud.udistrital.edu.co/direccionamiento-estrategico/ptep",
          },
          {
            titulo: "Plan de Mantenimiento Red De Datos - UDNET",
            url: "https://ti.udistrital.edu.co/documentacion#Docudnet",
          },
          {
            titulo: "Programas del Sistema de Gestion Ambiental",
            url: "https://sga.udistrital.edu.co/",
          },
          {
            titulo: "PAI - Plan de Acción Institucional",
            url: "https://planeacionud.udistrital.edu.co/direccionamiento-estrategico/planes-accion",
          },
          {
            titulo: "Plan Indicativo (Trienal)",
            url: "https://planeacionud.udistrital.edu.co/direccionamiento-estrategico/plan-indicativo",
          },
          {
            titulo:
              "Plan Estratégico de las Tecnologías de la Información y las Comunicaciones (PETIC)",
            url: "https://www.udistrital.edu.co/nuestra-universidad/direccionamiento-estrategico/politicas-institucionales/plan-estrategico-las-tecnologias-informacion-las-comunicaciones-petic",
          },
          {
            titulo:
              "Actos administrativos de toda decisión y/o política que haya adoptado y afecte al público",
            url: "http://sgral.udistrital.edu.co/xdata/index.php",
          },
          {
            titulo: "Plan Anticorrupción y de Atención al Ciudadano",
            url: "https://planeacionud.udistrital.edu.co/direccionamiento-estrategico/ptep",
          },
          {
            titulo: "Planes Estratégicos de Desarrollo institucionales",
            url: "https://planeacionud.udistrital.edu.co/plan-estrategico-de-desarrollo",
          },
          {
            titulo: "Manuales",
            url: "https://planeacionud.udistrital.edu.co/sigud/procesos",
          },
          {
            titulo: "Políticas y lineamientos institucionales",
            url: "https://planeacionud.udistrital.edu.co/direccionamiento-estrategico/plan-operativo",
          },
        ],
      },
      {
        numero: "6.2",
        titulo: "Plan de Gasto Público",
        enlaces: [
          {
            titulo: "Plan de Austeridad del Gasto",
            url: "https://viceadmin.udistrital.edu.co/informes/austeridad-del-gasto",
          },
          {
            titulo: "Presupuesto desagregado con modificaciones",
            url: "https://planeacionud.udistrital.edu.co/direccionamiento-estrategico/programacion-presupuestal",
          },
          {
            titulo:
              "Distribución presupuestal proyectos de inversión e indicadores de gestión.",
            url: "https://planeacionud.udistrital.edu.co/direccionamiento-estrategico/banco-proyectos",
          },
          {
            titulo: "Plan Anual de Adquisiciones",
            url: "http://contratacion.udistrital.edu.co/normatividad-contractual",
          },
          {
            titulo: "Planes de Acción",
            url: "https://planeacionud.udistrital.edu.co/direccionamiento-estrategico/plan-operativo",
          },
        ],
      },
      {
        numero: "6.3",
        titulo: "Programas y Proyectos en Ejecución",
        enlaces: [
          {
            titulo:
              "Avance de ejecución de proyectos de inversión (Secretaria de Planeación)",
            url: "https://www.sdp.gov.co/gestion-a-la-inversion/programacion-y-seguimiento-a-la-inversion/proyectos?field_seg_inv_entidad_type_tid=Universidad+Distrital+Francisco+Jos%C3%A9+de+Caldas&field_seg_inv_tag_tid=&field_seg_inv_id_value=",
          },
          {
            titulo: "Banco de Proyectos de la Universidad Distrital",
            url: "https://planeacionud.udistrital.edu.co/direccionamiento-estrategico/banco-proyectos",
          },
        ],
      },
      {
        numero: "6.4",
        titulo: "Metas, objetivos e indicadores de gestión y/o desempeño",
        enlaces: [
          {
            titulo:
              "Indicadores de gestión - Sistema Integrado de Gestión de la Universidad Distrital, SIGUD",
            url: "https://planeacionud.udistrital.edu.co",
          },
          {
            titulo:
              "Plan de Acción Institucional y monitoreo trimestral (metas, objetivos e indicadores de gestión y/o desempeño)",
            url: "https://planeacionud.udistrital.edu.co/direccionamiento-estrategico/planes-accion",
          },
        ],
      },
      {
        numero: "6.5",
        titulo: "Participación en la formulación de políticas",
        enlaces: [
          {
            titulo: "Participación Ciudadana",
            url: "https://reclamos.udistrital.edu.co/participacion-ciudadana",
          },
        ],
      },
      {
        numero: "6.6",
        titulo: "Informes de Empalme",
        enlaces: [
          {
            titulo:
              "Informes de empalme y de gestión para la rendición de cuentas",
            url: "https://comunidad.udistrital.edu.co/rendicioncuentas/",
          },
        ],
      },
    ],
  },
  {
    id: "control",
    numero: 7,
    titulo: "Control",
    descripcion:
      "Informes de gestión, auditoría, control interno y entes que vigilan a la Universidad.",
    subsecciones: [
      {
        numero: "7.1",
        titulo: "Informes de Gestión, Evaluación y Auditoría",
        enlaces: [
          {
            titulo: "Informe de gestión 2024",
            url: "https://planeacionud.udistrital.edu.co/sites/planeacion/files/archivos/2025-03/Informe%20de%20Gestio%CC%81n%20Institucional%202024.pdf",
          },
          {
            titulo:
              "Informe de evaluación del ejercicio de rendición de cuentas vigencia anterior",
            url: "https://cinterno.udistrital.edu.co/informes/informes-internos",
          },
          {
            titulo:
              "Seguimiento al Plan Anticorrupción y Atención al Ciudadano",
            url: "https://cinterno.udistrital.edu.co/informes/informes-internos",
          },
          {
            titulo: "Informes Contraloría",
            url: "https://cinterno.udistrital.edu.co/informes/informes-contraloria",
          },
          {
            titulo: "Informe Rendición de Cuentas a los Ciudadanos",
            url: "https://comunidad.udistrital.edu.co/rendicioncuentas/",
          },
          {
            titulo:
              "Informes de Rendición de la Cuenta Fiscal a la Contraloría de Bogotá",
            url: "https://cinterno.udistrital.edu.co/sites/cinterno/files/informes/2024-09/INFORME%20FINAL%20AEF%20COD%2030%20PAD%202024%20-%20UDFJC.pdf",
          },
        ],
      },
      {
        numero: "7.2",
        titulo: "Reportes de control interno",
        enlaces: [
          {
            titulo:
              "Informes pormenorizados del estado del control interno",
            url: "https://cinterno.udistrital.edu.co/informes/informes-internos",
          },
        ],
      },
      {
        numero: "7.3",
        titulo: "Planes de Mejoramiento",
        enlaces: [
          {
            titulo:
              "Informes de la Contraloría de Bogotá sobre la Universidad",
            url: "http://www.contraloriabogota.gov.co/informes-de-auditor",
          },
          {
            titulo: "Plan de Mejoramiento Contraloría de Bogota",
            url: "https://cinterno.udistrital.edu.co/informes/informes-contraloria",
          },
        ],
      },
      {
        numero: "7.4",
        titulo:
          "Entes de control que vigilan a la entidad y mecanismos de supervisión",
        enlaces: [
          {
            titulo: "Oficina de Control Interno Disciplinario",
            url: "https://disciplinarios.udistrital.edu.co/",
          },
          {
            titulo: "Concejo de Bogotá (Control Político)",
            url: "http://concejodebogota.gov.co/3-1-mision-y-vision/cbogota/2016-05-17/145210.php",
          },
          {
            titulo: "Veeduría Distrital (Control Social)",
            url: "https://www.veeduriadistrital.gov.co/",
          },
          {
            titulo: "Personería de Bogotá (Control Disciplinario)",
            url: "https://www.personeriabogota.gov.co/la-entidad/vision",
          },
          {
            titulo: "Contraloría de Bogotá (Control Fiscal)",
            url: "https://www.contraloriabogota.gov.co/mision_y_vision",
          },
          {
            titulo:
              "Procuraduría General de la Nación (Control Disciplinario)",
            url: "https://www.procuraduria.gov.co/procuraduria/conozca-entidad/Pages/mision-vision.aspx",
          },
          {
            titulo: "Oficina Asesora de Control Interno - UDFJC",
            url: "https://cinterno.udistrital.edu.co/",
          },
        ],
      },
      {
        numero: "7.5",
        titulo: "Información para población vulnerable",
        enlaces: [
          {
            titulo: "Cátedra UNESCO en desarrollo del niño",
            url: "http://comunidad.udistrital.edu.co/catedraunesco/",
          },
          {
            titulo: "Cupos especiales para aspirantes de pregrado",
            url: "https://www.udistrital.edu.co/admisiones/index.php/instructivo/Primer-semestre/cupos-especiales",
          },
        ],
      },
      {
        numero: "7.6",
        titulo: "Defensa judicial",
        enlaces: [
          {
            titulo:
              "Relación de Procesos Judiciales de la Universidad Distrital Francisco José de Caldas",
            url: "https://juridica.udistrital.edu.co/procesos-judiciales",
          },
        ],
      },
    ],
  },
  {
    id: "contratacion",
    numero: 8,
    titulo: "Contratación",
    descripcion:
      "Información y ejecución de contratos, procedimientos de adquisición y plan anual de compras.",
    subsecciones: [
      {
        numero: "8.1",
        titulo: "Publicación de la información contractual",
        enlaces: [
          {
            titulo: "Base de contratacion CPS",
            url: "https://juridica.udistrital.edu.co/",
          },
          {
            titulo: "Colombia Compra Eficiente",
            url: "https://www.colombiacompra.gov.co/colombia-compra/colombia-compra-eficiente",
          },
          {
            titulo:
              "Publicación de información contractual en el SECOP (Para consultar los procesos de la Universidad Distrital Francisco Jose de Caldas en el SECOP, seleccione el nombre de la Entidad en la lista 'Entidad compradora' y luego haga clic en 'Buscar')",
            url: "https://www.contratos.gov.co/consultas/inicioConsulta.do",
          },
        ],
      },
      {
        numero: "8.2",
        titulo: "Publicación de la ejecución de contratos",
        enlaces: [
          {
            titulo:
              "Contratistas - Instituto de Extensión y Educación para el Trabajo y Desarrollo Humano, IDEXUD",
            url: "http://idexud.udistrital.edu.co/idexud/vinculacion.php",
          },
          {
            titulo:
              "Proyectos vigentes - Instituto de Extensión y Educación para el Trabajo y Desarrollo Humano, IDEXUD",
            url: "https://idexud.udistrital.edu.co/inicio/experiencia/",
          },
          {
            titulo: "Informe trimestral ejecución del plan de compras",
            url: "https://viceadmin.udistrital.edu.co/seccion-de-compras/index.php/contratacion/informe-trimestral",
          },
          {
            titulo: "Ejecución de Contratos",
            url: "https://community.secop.gov.co/Public/Tendering/ContractNoticeManagement/Index?currentLanguage=es-CO&Page=login&Country=CO&SkinName=CCE",
          },
          {
            titulo: "Procesos contractuales",
            url: "http://contratacion.udistrital.edu.co/",
          },
        ],
      },
      {
        numero: "8.3",
        titulo:
          "Publicación de procedimientos, lineamientos y políticas en materia de adquisición y compras",
        enlaces: [
          {
            titulo:
              "Manual de contratación, que contiene los procedimientos, lineamientos y políticas en materia de adquisición y compras",
            url: "https://viceadmin.udistrital.edu.co/",
          },
        ],
      },
      {
        numero: "8.4",
        titulo: "Plan Anual de Adquisiciones",
        enlaces: [
          {
            titulo:
              "Plan Anual de Adquisiciones 2025 - SECOP II (Para consultar el PAA de la Universidad Distrital Francisco Jose de Caldas en el SECOP, seleccione el nombre de la Entidad en la lista “Nombre de la Entidad” y luego haga clic en 'Buscar')",
            url: "https://community.secop.gov.co/Public/App/AnnualPurchasingPlanManagementPublic/Index?currentLanguage=es-CO&Page=login&Country=CO&SkinName=CCE",
          },
          {
            titulo: "Planes Anuales de Adquisiciones",
            url: "http://contratacion.udistrital.edu.co/normatividad-contractual",
          },
        ],
      },
    ],
  },
  {
    id: "tramites-servicios",
    numero: 9,
    titulo: "Trámites y Servicios",
    descripcion:
      "Guías, costos y catálogos de los trámites y servicios que ofrece la Universidad.",
    subsecciones: [
      {
        numero: "9.1",
        titulo: "Trámites y Servicios",
        enlaces: [
          {
            titulo: "Derechos Pecuniarios 2026 - Costos",
            url: "https://sgral.udistrital.edu.co/xdata/sgral/cir_2026-002.pdf",
          },
          {
            titulo:
              "Guía de trámites y servicios de la Universidad Distrital Francisco José de Caldas",
            url: "https://bogota.gov.co/servicios/entidad/universidad-distrital-francisco-jose-de-caldas",
          },
          {
            titulo:
              "Trámites y servicios de la Universidad - Sistema Único de Información de Trámites, SUIT",
            url: "http://www.funcionpublica.gov.co/web/suit/buscadortramites?_com_liferay_iframe_web_portlet_IFramePortlet_INSTANCE_MLkB2d7OVwPr_iframe_query=universidad+distrital&x=0&y=0&p_p_id=com_liferay_iframe_web_portlet_IFramePortlet_INSTANCE_MLkB2d7OVwPr&p_p_lifecycle=0&_com_liferay_iframe_web_portlet_IFramePortlet_INSTANCE_MLkB2d7OVwPr_iframe_find=FindNext",
          },
        ],
      },
    ],
  },
  {
    id: "instrumentos-gestion",
    numero: 10,
    titulo: "Instrumentos de la Gestión de Información Pública",
    descripcion:
      "Instrumentos archivísticos, registros de publicaciones y mecanismos de quejas de la gestión documental.",
    subsecciones: [
      {
        numero: "10.1",
        titulo: "Información mínima",
        enlaces: [
          {
            titulo: "Informe de gestión 2024",
            url: "https://planeacionud.udistrital.edu.co/sites/planeacion/files/archivos/2025-03/Informe%20de%20Gestio%CC%81n%20Institucional%202024.pdf",
          },
          {
            titulo:
              "Información mínima de los artículos 9, 10 y 11 de la Ley 1712 de 2014",
            url: "http://transparencia.udistrital.edu.co/",
          },
        ],
      },
      {
        numero: "10.5",
        titulo: "Programa de Gestión Documental",
        enlaces: [
          {
            titulo: "Plan Institucional de Archivos (PINAR)",
            url: "https://planeacionud.udistrital.edu.co/direccionamiento-estrategico/planes-accion",
          },
          {
            titulo: "Aprobación del Programa de Gestión Documental",
            url: "https://saam.udistrital.edu.co/",
          },
          {
            titulo: "Programa de Gestión Documental",
            url: "https://saam.udistrital.edu.co/",
          },
        ],
      },
      {
        numero: "10.6",
        titulo: "Tablas de Retención Documental",
        enlaces: [
          {
            titulo: "Cuadro de clasificación Documental",
            url: "https://saam.udistrital.edu.co/sites/saam/files/instrumento/2022-02/GD-FR-008_Cuadro_Clasificaci%C3%B3n_Documental_CCD.pdf",
          },
          {
            titulo: "Plan de Conservación Documental- Preservación Digital",
            url: "https://saam.udistrital.edu.co/",
          },
          {
            titulo: "Acto Administrativo de Aprobación TDR",
            url: "https://sgral.udistrital.edu.co/xdata/rec/res_2019-153.pdf",
          },
          {
            titulo: "Tablas de Retención Documental",
            url: "https://saam.udistrital.edu.co/documentos/tablas-de-retencion-documental",
          },
        ],
      },
      {
        numero: "10.7",
        titulo: "Registro de publicaciones",
        enlaces: [
          {
            titulo:
              "Registro de publicaciones (documentos publicados de conformidad con la Ley 1712 de 2014)",
            url: "https://transparencia.udistrital.edu.co/",
          },
        ],
      },
      {
        numero: "10.8",
        titulo: "Costos de reproducción",
        enlaces: [
          {
            titulo:
              "Derechos Pecuniarios 2025 (costos de reproducción de la información)",
            url: "https://sgral.udistrital.edu.co/xdata/sgral/cir_2025-001.pdf",
          },
        ],
      },
      {
        numero: "10.9",
        titulo:
          "Mecanismos para presentar quejas y reclamos en relación con omisiones o acciones del sujeto obligado",
        enlaces: [
          {
            titulo:
              "Mecanismos de contacto para la atención al ciuidadano",
            url: "http://www.udistrital.edu.co/contacto",
          },
        ],
      },
      {
        numero: "10.10",
        titulo: "Informes de PQRS",
        enlaces: [
          {
            titulo: "Informes Mensuales de Gestión PQRS",
            url: "https://reclamos.udistrital.edu.co/informes",
          },
        ],
      },
    ],
  },
  {
    id: "transparencia-pasiva",
    numero: 11,
    titulo: "Transparencia pasiva",
    descripcion:
      "Seguimiento a las solicitudes de información y a las peticiones presentadas por la ciudadanía.",
    subsecciones: [
      {
        numero: "11.1",
        titulo: "Seguimiento a PQRS",
        enlaces: [
          {
            titulo:
              "Solicitudes de información publica con identidad reservada - Procuraduría General de la Nación",
            url: "https://www.procuraduria.gov.co/Pages/solicituddeinformacionconidentificacionreservada.aspx",
          },
          {
            titulo: "Costos de reproducción de información 2025",
            url: "https://sgral.udistrital.edu.co/xdata/sgral/cir_2025-001.pdf",
          },
          {
            titulo: "Formulario recepción solicitudes de información",
            url: "https://bogota.gov.co/sdqs/",
          },
          {
            titulo:
              "Medios de seguimiento a solicitudes de información y peticiones.",
            url: "https://bogota.gov.co/sdqs/",
          },
        ],
      },
    ],
  },
  {
    id: "accesibilidad-web",
    numero: 12,
    titulo: "Accesibilidad web",
    descripcion:
      "Medidas de accesibilidad del sitio web para personas con discapacidad visual.",
    subsecciones: [
      {
        numero: "12.1",
        titulo:
          "Accesibilidad en medios electrónicos para la población con situación de discapacidad visual",
        enlaces: [
          {
            titulo: "Cumplimiento de criterios de accesibilidad web nivel A",
            url: "https://www.udistrital.edu.co",
          },
        ],
      },
    ],
  },
  {
    id: "habeas-data",
    numero: 13,
    titulo: "Habeas Data",
    descripcion:
      "Garantías y responsables del tratamiento de los datos personales bajo la Ley 1581 de 2012.",
    subsecciones: [
      {
        numero: "13.1",
        titulo: "Ley 1581 de 2012 Protección de Datos personales",
        enlaces: [
          {
            titulo:
              "Certificado de seguridad de la página web de la Institución",
            url: "https://transparencia.udistrital.edu.co/sites/transparencia/files/certificado/certificado_pagina.pdf",
          },
          {
            titulo:
              "Datos de contacto del responsable del tratamiento de datos personales",
            url: "http://www.udistrital.edu.co/politica-de-privacidad",
          },
          {
            titulo:
              "Inscripción bases de datos ante la Superintendencia de Industria y Comercio",
            url: "https://ti.udistrital.edu.co/sites/default/files/documentacion/2023-12/Certificado%20SIC.pdf",
          },
        ],
      },
    ],
  },
];

/**
 * Esquema de publicación de la Resolución 1519 de 2020 de MinTIC, organizado en
 * 10 secciones. Los enlaces oficiales aún no se publican, por lo que cada
 * sección se marca como `pendiente` y no trae subsecciones; el modal mostrará
 * un aviso de información en proceso de publicación. Las descripciones cortas se
 * redactan aquí para orientar al ciudadano.
 */
export const CATEGORIAS_RES_1519: CategoriaTransparencia[] = [
  {
    id: "info-entidad",
    numero: 1,
    titulo: "Información de la entidad",
    descripcion:
      "Datos generales, estructura, directorio y mecanismos de contacto de la Universidad.",
    pendiente: true,
    subsecciones: [],
  },
  {
    id: "res-normativa",
    numero: 2,
    titulo: "Normativa",
    descripcion:
      "Normas, decretos y actos administrativos que rigen a la Universidad.",
    pendiente: true,
    subsecciones: [],
  },
  {
    id: "res-contratacion",
    numero: 3,
    titulo: "Contratación",
    descripcion:
      "Procesos, ejecución y plan anual de adquisiciones de bienes y servicios.",
    pendiente: true,
    subsecciones: [],
  },
  {
    id: "planeacion-presupuesto-informes",
    numero: 4,
    titulo: "Planeación, Presupuesto e Informes",
    descripcion:
      "Planes, presupuesto asignado e informes de gestión y rendición de cuentas.",
    pendiente: true,
    subsecciones: [],
  },
  {
    id: "tramites",
    numero: 5,
    titulo: "Trámites",
    descripcion:
      "Guías y requisitos de los trámites y servicios que ofrece la Universidad.",
    pendiente: true,
    subsecciones: [],
  },
  {
    id: "participa",
    numero: 6,
    titulo: "Participa",
    descripcion:
      "Espacios y mecanismos para participar en la gestión de la Universidad.",
    pendiente: true,
    subsecciones: [],
  },
  {
    id: "datos-abiertos",
    numero: 7,
    titulo: "Datos abiertos",
    descripcion:
      "Conjuntos de datos públicos disponibles para su consulta y reutilización.",
    pendiente: true,
    subsecciones: [],
  },
  {
    id: "grupos-interes",
    numero: 8,
    titulo: "Información Específica para Grupos de Interés",
    descripcion:
      "Información dirigida a la ciudadanía, estudiantes y demás grupos de interés.",
    pendiente: true,
    subsecciones: [],
  },
  {
    id: "reporte-info-especifica",
    numero: 9,
    titulo: "Obligación de Reporte de Información Específica",
    descripcion:
      "Reportes que la Universidad debe publicar según sus obligaciones legales.",
    pendiente: true,
    subsecciones: [],
  },
  {
    id: "info-tributaria",
    numero: 10,
    titulo: "Información Tributaria",
    descripcion:
      "Información sobre tributos y obligaciones tributarias a cargo de la Universidad.",
    pendiente: true,
    subsecciones: [],
  },
];

/**
 * Normas de transparencia disponibles en el conmutador. La Ley 1712 de 2014 es
 * la opción por defecto (primer elemento).
 */
export const LEYES: LeyTransparencia[] = [
  {
    id: "ley-1712",
    etiqueta: "Ley 1712 de 2014",
    etiquetaCorta: "Ley 1712 de 2014",
    kicker: "Ley 1712 de 2014",
    introText:
      "La Universidad Distrital Francisco José de Caldas pone a disposición de la ciudadanía su información pública, organizada en 13 categorías. Selecciona una categoría para ver sus subsecciones y los enlaces a la información oficial.",
    categorias: CATEGORIAS_LEY_1712,
  },
  {
    id: "res-1519",
    etiqueta: "Resolución 1519 de 2020",
    etiquetaCorta: "Resolución 1519 de 2020",
    kicker: "Resolución 1519 de 2020",
    introText:
      "La Resolución 1519 de 2020 de MinTIC define un nuevo esquema de publicación de información pública, organizado en 10 secciones. La Universidad Distrital Francisco José de Caldas está cargando y actualizando su contenido; selecciona una sección para conocer su alcance.",
    categorias: CATEGORIAS_RES_1519,
  },
];
