export type ProgramaAcademico = {
  id: string;
  nombre: string;
  paginaProgramaUrl: string | null;
  facultad: string | null;
  nivel: string | null;
  nivelFiltro: string | null;
  jornada: string | null;
  modalidad: string | null;
  titulacion: string | null;
  acreditacionAltaCalidad: boolean;
  coordinador: string | null;
  correo: string | null;
  direccion: string | null;
  horarioAtencion: string | null;
  imagenUrl: string | null;
  imagenAlt: string;
  normaInternaUrl: string | null;
  normaInternaDescripcion: string | null;
  registroCalificadoUrl: string | null;
  registroCalificadoDescripcion: string | null;
  puntajeSaber11: string | null;
  snies: number | null;
  telefono: string | null;
};

export type ResultadoOfertaAcademica = {
  programas: ProgramaAcademico[];
  nivelesFormacion: string[];
  nivelesFiltro: string[];
  modalidades: string[];
  jornadas: string[];
  noDisponible: boolean;
};

function claveNivel(nombre: string): string {
  return nombre
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("es")
    .trim();
}

export function nivelParaFiltro(nombre: string | null | undefined): string | null {
  const clave = claveNivel(nombre ?? "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  if (["pregrado", "ingenieria", "profesional", "tecnologia"].includes(clave)) {
    return "Pregrado";
  }
  if (clave === "especializacion") return "Especialización";
  if (clave === "maestria") return "Maestría";
  if (clave === "doctorado") return "Doctorado";
  if (clave === "posgrado" || !nombre?.trim()) return null;

  return nombre.trim();
}

export function crearNivelesFiltro(nombres: string[]): string[] {
  const unicos = new Map<string, string>();
  for (const nombre of nombres) {
    const etiqueta = nivelParaFiltro(nombre);
    if (etiqueta) unicos.set(claveNivel(etiqueta), etiqueta);
  }
  return [...unicos.values()].sort((a, b) => a.localeCompare(b, "es"));
}
