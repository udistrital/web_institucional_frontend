import type { Metadata } from "next";
import Image from "next/image";
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
        <div className={styles.heroText}>
          <p className={styles.eyebrow}>Encuentra lo que necesitas</p>
          <h1 className={styles.heroTitle}>Actividades del calendario</h1>
          <p className={styles.heroLead}>
            Consulta y filtra las actividades académicas, culturales y
            administrativas de la Universidad.
          </p>
        </div>
        <div className={styles.heroVisual}>
          <Image
            alt=""
            className={styles.heroImage}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 42vw"
            src="/image/calendario-academico/header-calendario.jpg"
          />
          <span aria-hidden="true" className={styles.heroAccent} />
        </div>
      </header>

      <div className={styles.body}>
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
      </div>
    </div>
  );
}
