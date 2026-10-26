import type { Metadata } from "next";
import CalendarioAcademico from "./components/calendario-academico/CalendarioAcademico";
import { cargarActividadesAcademicas } from "@/services/actividades";
import { fechaHoyBogota } from "@/lib/calendario";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Calendario académico",
  description:
    "Consulta las fechas, plazos, evaluaciones y demás actividades del calendario académico de la Universidad Distrital Francisco José de Caldas.",
};

export default async function CalendarioAcademicoPage() {
  const { actividades, noDisponible } = await cargarActividadesAcademicas();

  return (
    <div className={styles.page}>
      <header className={styles.hero}>
        <div className={styles.heroContent}>
          <p className={styles.eyebrow}>Nuestra universidad</p>
          <h1>Calendario académico</h1>
          <p className={styles.heroLead}>
            Consulta las fechas, plazos y procesos que marcan el desarrollo de
            los periodos académicos.
          </p>
        </div>
        <span aria-hidden="true" className={styles.heroNumber}>
          02
        </span>
      </header>

      <section
        aria-labelledby="actividades-calendario-title"
        className={styles.content}
      >
        <div className={styles.sectionHeading}>
          <div>
            <p className={styles.sectionKicker}>Programación institucional</p>
            <h2 id="actividades-calendario-title">
              Actividades del calendario
            </h2>
          </div>
        </div>

        {noDisponible ? (
          <div className={styles.unavailable} role="alert">
            <h2>Calendario no disponible</h2>
            <p>
              No fue posible consultar las actividades académicas en este
              momento. Intenta de nuevo más tarde.
            </p>
          </div>
        ) : (
          <CalendarioAcademico
            actividades={actividades}
            hoyInicial={fechaHoyBogota()}
          />
        )}
      </section>
    </div>
  );
}
