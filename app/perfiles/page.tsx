import type { Metadata } from "next";
import Tarjet from "@/app/perfiles/components/tarjet/terjet";
import { mainNavigation } from "@/navegation/audience_services";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Servicios - Perfiles",
};

const profileLabels = [
  "Aspirantes",
  "Estudiantes",
  "Educadores",
  "Administrativos",
  "Egresados",
  "Visitantes",
] as const;

export default function ServiciosPerfilesPage() {
  const profiles = profileLabels
    .map((label) => mainNavigation.find((p) => p.label === label))
    .filter(Boolean);

  return (
    <section className={styles.grid}>
      {profiles.map((profile) =>
        profile ? (
          <Tarjet key={profile.href} service={profile} />
        ) : null,
      )}
    </section>
  );
}
