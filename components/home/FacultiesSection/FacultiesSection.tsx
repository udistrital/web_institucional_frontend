import Link from "next/link";

import { facultades } from "@/navegation/global";

import styles from "../home.module.css";
import type { FacultiesSectionProps } from "./FacultiesSection.types";

export default function FacultiesSection({ className }: FacultiesSectionProps) {
  const sectionClassName = className
    ? `${styles["faculties-section"]} ${className}`
    : styles["faculties-section"];

  return (
    <section className={sectionClassName} aria-labelledby="faculties-title">
      <div className={styles["faculties-content"]}>
        <div className={styles["faculties-intro"]}>
          <h2 id="faculties-title">Nuestras<br />Facultades</h2>
          <Link className={styles["faculties-link"]} href="/facultades">Ver facultades</Link>
        </div>
        <ul className={styles["faculties-list"]}>
          {facultades.map((facultad) => (
            <li key={facultad.href}>
              <Link href={facultad.href}>{facultad.nombre}</Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
