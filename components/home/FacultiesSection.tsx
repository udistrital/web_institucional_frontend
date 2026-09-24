import Link from "next/link";
import { facultades } from "@/navegation/global";
import styles from "./home.module.css";

export default function FacultiesSection() {
  return (
    <section className={styles["faculties-section"]} aria-labelledby="faculties-title">
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
