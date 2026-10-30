/**
 * Contenido estático de la página "Organización funcional".
 *
 * Reúne los organigramas institucionales publicados por la Oficina Asesora de
 * Planeación (General, General Transitorio, Académico y Administrativo). La
 * información es institucional y de baja frecuencia de cambio, por lo que se
 * mantiene en el repositorio en lugar de consumirse desde Drupal. Las rutas de
 * los documentos apuntan a los recursos oficiales de la Universidad.
 */

export type SectionId =
  | "general"
  | "general-transitorio"
  | "academico"
  | "administrativo";

export type SectionLink = {
  id: SectionId;
  label: string;
};

export const SECTIONS: SectionLink[] = [
  { id: "general", label: "General" },
  { id: "general-transitorio", label: "General Transitorio" },
  { id: "academico", label: "Académico" },
  { id: "administrativo", label: "Administrativo" },
];

/* ------------------------------------------------------------------ */
/* Enlaces de descarga/visualización de cada organigrama              */
/* ------------------------------------------------------------------ */

export type DocumentoOrganigrama = {
  /** Etiqueta visible del enlace. */
  label: string;
  url: string;
  /** Formato del recurso; determina el icono mostrado. */
  tipo: "pdf" | "pptx";
};

export type Organigrama = {
  id: SectionId;
  /** Antetítulo corto en mayúsculas sobre el encabezado. */
  kicker: string;
  titulo: string;
  /** Párrafos descriptivos opcionales del organigrama. */
  descripcion?: string[];
  documentos: DocumentoOrganigrama[];
};

export const ORGANIGRAMAS: Organigrama[] = [
  {
    id: "general",
    kicker: "Estructura institucional",
    titulo: "Organigrama General",
    documentos: [
      {
        label: "Ver Organigrama General (PDF)",
        url: "/pdf/Organigrama%20General%20-%201_1.pdf",
        tipo: "pdf",
      },
      {
        label: "Descargar Organigrama General (PPTX)",
        url: "https://planeacionud.udistrital.edu.co/sites/planeacion/files/archivos2025-08/Organigrama%20General%20-%201_1.pptx",
        tipo: "pptx",
      },
    ],
  },
  {
    id: "general-transitorio",
    kicker: "Etapa de transición",
    titulo: "Organigrama General Transitorio",
    descripcion: [
      "Interpretado del Acuerdo 04 del CSU de 2025.",
      "Teniendo en cuenta el Acuerdo 04 de CSU del 5 de mayo del 2025 «Por el cual se expide el Estatuto General de la Universidad Distrital Francisco José de Caldas», desde la Oficina Asesora de Planeación se realiza la propuesta de Organigrama General, el cual, de acuerdo a la etapa de transición establecida para la implementación del Estatuto General, podrá ser objeto de modificación en relación con lo que se determine en los diferentes estatutos que se encuentran en discusión y concertación.",
    ],
    documentos: [
      {
        label: "Ver Organigrama General Transitorio (PDF)",
        url: "https://planeacionud.udistrital.edu.co/sites/planeacion/files/archivos2025-08/Organigrama%20General%20-%202_1.pdf",
        tipo: "pdf",
      },
    ],
  },
  {
    id: "academico",
    kicker: "Ámbito académico",
    titulo: "Organigrama Académico",
    documentos: [
      {
        label: "Ver Organigrama Académico (PDF)",
        url: "https://planeacionud.udistrital.edu.co/sites/planeacion/files/archivos2025-08/Organigrama%20Acad%C3%A9mico%20-%20V04_1.pdf",
        tipo: "pdf",
      },
      {
        label: "Descargar Organigrama Académico (PPTX)",
        url: "https://planeacionud.udistrital.edu.co/sites/planeacion/files/archivos2025-08/Organigrama%20Acad%C3%A9mico%20-%20V04_1.pptx",
        tipo: "pptx",
      },
    ],
  },
  {
    id: "administrativo",
    kicker: "Ámbito administrativo",
    titulo: "Organigrama Administrativo",
    documentos: [
      {
        label: "Ver Organigrama Administrativo (PDF)",
        url: "https://planeacionud.udistrital.edu.co/sites/planeacion/files/archivos2025-08/Organigrama%20Administrativo%20-%20V03%20_1.pdf",
        tipo: "pdf",
      },
      {
        label: "Descargar Organigrama Administrativo (PPTX)",
        url: "https://planeacionud.udistrital.edu.co/sites/planeacion/files/archivos2025-08/Organigrama%20Administrativo%20-%20V03%20_1.pptx",
        tipo: "pptx",
      },
    ],
  },
];

/* ------------------------------------------------------------------ */
/* Directorio institucional (nota común a todas las secciones)        */
/* ------------------------------------------------------------------ */

export const DIRECTORIO_INSTITUCIONAL = {
  texto:
    "Para visualizar la información de contacto de cada una de las dependencias, remítase al Directorio Institucional y busque la dependencia de interés.",
  label: "Ir al Directorio Institucional",
  url: "https://www.udistrital.edu.co/directorio",
};
