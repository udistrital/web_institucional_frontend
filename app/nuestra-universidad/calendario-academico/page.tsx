import type { Metadata } from "next";
import CalendarioAcademico from "./components/calendario-academico/CalendarioAcademico";
import { cargarActividadesAcademicas } from "@/services/actividades";
import { fechaHoyBogota } from "@/lib/calendario";
import BreadCrumbs from "@/components/common/bread-crumbs/bread-crumbs";
import PageHero from "@/components/common/page-hero";
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
      <PageHero
        data={{
          title: [
            { text: "Calendario ", accent: false },
            { text: "académico", accent: true },
          ],
          imageUrl: "/image/calendario-academico/header-calendario.jpg",
          imageAlt:
            "Estudiantes de la Universidad Distrital Francisco José de Caldas",
        }}
      />

      <BreadCrumbs variant="onDark" />

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
