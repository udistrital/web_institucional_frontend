import type { Etapa, Tramite } from "@/content/admisiones/types";
import Preregistro from "./etapas/preregistro.mdx";
import GenerarRecibo from "./etapas/generar-recibo.mdx";
import Inscripcion from "./etapas/inscripcion.mdx";
import Resultados from "./primer-ingreso/resultados.mdx";
import Matricula from "./primer-ingreso/matricula.mdx";
import InscripcionDoblePrograma from "./doble-programa/inscripcion-extra.mdx";
import QuienPuedeDoblePrograma from "./doble-programa/quien-puede-inscribirse.mdx";
import { periodo } from "./periodo";

const etapasComunes: Etapa[] = [
  { id: 1, titulo: "Etapa 1", subtitulo: "Pre-registro", Content: Preregistro },
  { id: 2, titulo: "Etapa 2", subtitulo: "Generar recibo", Content: GenerarRecibo },
  { id: 3, titulo: "Etapa 3", subtitulo: "Inscripción", Content: Inscripcion },
];

const fechasComunes = [
  `Pre-registro: Del ${periodo.preregistro.desde} al ${periodo.preregistro.hasta}`,
  `Inscripción: Del ${periodo.inscripcion.desde} al ${periodo.inscripcion.hasta}`,
];

function crearTramite(
  datos: Omit<Tramite, "etapas" | "fechas"> & Partial<Pick<Tramite, "fechas">>,
  etapas: Etapa[] = etapasComunes,
): Tramite {
  return {
    ...datos,
    fechas: datos.fechas ?? fechasComunes,
    etapas,
  };
}

export const tramitesData: Tramite[] = [
  crearTramite(
    {
      id: "primer-ingreso",
      nombreTab: "Primer ingreso",
      tituloFicha: "Primer ingreso",
      quienPuedeAplicar: "Aspirantes bachilleres que desean iniciar su formación universitaria en la Universidad Distrital.",
      fechas: [...fechasComunes, `Resultados opción N.° 1: ${periodo.resultadosOpcion1}`],
    },
    [...etapasComunes, { id: 4, titulo: "Etapa 4", subtitulo: "Resultados", Content: Resultados }, { id: 5, titulo: "Etapa 5", subtitulo: "Matrícula", Content: Matricula }],
  ),
  crearTramite({
    id: "reingreso",
    nombreTab: "Reingreso",
    tituloFicha: "Reingreso",
    quienPuedeAplicar: "Estudiantes que desean retomar sus estudios en la Universidad Distrital.",
  }),
  crearTramite({
    id: "transferencias",
    nombreTab: "Transferencias",
    tituloFicha: "Transferencias",
    quienPuedeAplicar: "Aspirantes que solicitan transferencia interna o externa conforme a los requisitos de la convocatoria.",
  }),
  crearTramite(
    {
      id: "doble-programa",
      nombreTab: "Doble programa",
      tituloFicha: "Doble programa",
      quienPuedeAplicar: "Estudiantes, egresados y graduados de los programas definidos en la convocatoria.",
      QuienPuedeContent: QuienPuedeDoblePrograma,
    },
    etapasComunes.map((etapa) => etapa.id === 3 ? { ...etapa, Content: InscripcionDoblePrograma } : etapa),
  ),
  crearTramite({
    id: "doble-titulacion",
    nombreTab: "Doble titulación",
    tituloFicha: "Doble titulación",
    quienPuedeAplicar: "Aspirantes que cumplen los requisitos académicos e institucionales de la convocatoria.",
  }),
];
