/**
 * Contenido estático de la página "Sistema Integrado de Gestión (SIGUD)".
 *
 * Reúne la presentación del SIGUD, los formatos y documentos de interés, el
 * modelo de operación por procesos (video y accesos a plataforma) y la
 * normatividad del Subsistema de Gestión de Calidad. La información es
 * institucional y de baja frecuencia de cambio, por lo que se mantiene en el
 * repositorio en lugar de consumirse desde Drupal. Las rutas de los documentos
 * y accesos apuntan a los recursos oficiales de la Universidad.
 */

export type SectionId = "presentacion" | "formatos" | "modelo" | "normatividad";

export type SectionLink = {
  id: SectionId;
  label: string;
};

export const SECTIONS: SectionLink[] = [
  { id: "presentacion", label: "Presentación" },
  { id: "formatos", label: "Formatos y documentos" },
  { id: "modelo", label: "Modelo de operación" },
  { id: "normatividad", label: "Normatividad" },
];

/* ------------------------------------------------------------------ */
/* Presentación del SIGUD                                             */
/* ------------------------------------------------------------------ */

export const PRESENTACION = {
  kicker: "Sistema Integrado de Gestión",
  titulo: "Sistema Integrado de Gestión (SIGUD)",
  parrafos: [
    "El Sistema Integrado de Gestión de la Universidad Distrital Francisco José de Caldas - SIGUD, es el conjunto de políticas, normas, procesos, recursos, información e instancias, cuyo objeto es garantizar un desempeño institucional articulado y armónico, para el cumplimiento de su misión, así como la consecución de resultados para la satisfacción de la Comunidad Universitaria y los Grupos de Valor.",
  ],
};

/* ------------------------------------------------------------------ */
/* Formatos y documentos de interés                                   */
/* ------------------------------------------------------------------ */

export type Documento = {
  /** Etiqueta visible del enlace. */
  label: string;
  url: string;
  /** Formato del recurso; determina el icono mostrado. */
  tipo: "enlace" | "pdf" | "doc";
};

export type GrupoDocumentos = {
  titulo: string;
  descripcion?: string;
  documentos: Documento[];
};

export const GRUPOS_DOCUMENTOS: GrupoDocumentos[] = [
  {
    titulo: "Formatos más usados",
    documentos: [
      {
        label: "GIT-FR-010, Formato Acta de Reunión",
        url: "https://udistrital.darumasoftware.com/app.php/staff/document/viewPublic?index=213",
        tipo: "enlace",
      },
      {
        label: "GIT-FR-011, Formato Planilla de Asistencia",
        url: "https://udistrital.darumasoftware.com/app.php/staff/document/viewPublic?index=214",
        tipo: "enlace",
      },
      {
        label: "GIT-FR-020, Formato Acta de Reunión de Consejos y/o Comités",
        url: "https://udistrital.darumasoftware.com/app.php/staff/document/viewPublic?index=220",
        tipo: "enlace",
      },
      {
        label: "Formato Actos Administrativos",
        url: "https://planeacionud.udistrital.edu.co/sites/planeacion/files/archivos2023-06/Formato%20acto%20administrativo%202019.doc",
        tipo: "doc",
      },
    ],
  },
  {
    titulo:
      "Caracterización Grupos de Valor de la Universidad Distrital Francisco José de Caldas",
    documentos: [
      {
        label: "Documento Caracterización Grupos de Valor",
        url: "https://planeacionud.udistrital.edu.co/sites/planeacion/files/archivos2023-06/Caracterizacion_Grupos_de_Valor_UD.pdf",
        tipo: "pdf",
      },
    ],
  },
];

/* ------------------------------------------------------------------ */
/* Modelo de operación por procesos                                   */
/* ------------------------------------------------------------------ */

export const MODELO_VIDEO = {
  titulo: "Mapa de Procesos SIGUD",
  descripcion:
    "Video explicativo del Modelo de Operación por Procesos del Sistema Integrado de Gestión.",
  /** URL de inserción (embed) del video de YouTube. */
  embedUrl: "https://www.youtube.com/embed/VTreebWFViU",
};

export type AccesoPlataforma = {
  label: string;
  descripcion: string;
  url: string;
};

export const ACCESOS_PLATAFORMA: AccesoPlataforma[] = [
  {
    label: "Mapa de Operación por Procesos (MOP)",
    descripcion:
      "Consulta el mapa de procesos institucional en la plataforma Daruma.",
    url: "https://udistrital.darumasoftware.com/app.php/staff/process/showMap/id/1",
  },
  {
    label: "Acceso a Daruma",
    descripcion:
      "Ingresa a la plataforma de gestión documental y de procesos Daruma.",
    url: "https://udistrital.darumasoftware.com/app.php/staff/",
  },
];

/* ------------------------------------------------------------------ */
/* Normatividad del Subsistema de Gestión de Calidad (SGC)            */
/* ------------------------------------------------------------------ */

export type Norma = {
  label: string;
  url: string;
  descripcion: string;
};

export const NORMATIVIDAD: Norma[] = [
  {
    label: "Resolución 215 de 2014",
    url: "https://planeacionud.udistrital.edu.co/sites/planeacion/files/archivos/2025-01/Res%202015%20de%202014.pdf",
    descripcion:
      "«Por la cual se ajusta y conforma el Sistema Integrado de Gestión de la Universidad Distrital Francisco José de Caldas, SIGUD, y se establecen las funciones a los equipos del Sistema Integrado de Gestión, SIGUD, en los Niveles Ejecutivo, Técnico, Operativo y Evaluador y se establecen otras disposiciones».",
  },
];
