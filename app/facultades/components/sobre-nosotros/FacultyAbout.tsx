import Image from "next/image";
import { getAboutCopy } from "./faculty-about-copy";
import styles from "./faculty-about.module.css";

type FacultyAboutProps = {
  facultyName: string;
  aboutVariant?: "default" | "health";
  /** Slug de la ruta de la facultad: define el texto y la variante visual. */
  facultyRouteSlug?: string;
};

export default function FacultyAbout({
  facultyName,
  facultyRouteSlug = "",
  aboutVariant = "health",
}: FacultyAboutProps) {
  const copy = getAboutCopy(facultyRouteSlug);
  const isHealth = aboutVariant === "health";

  return (
    <section
      className={`${styles.about} ${isHealth ? styles.aboutHealth : ""}`}
      aria-labelledby="faculty-about-title"
    >
      <div
        className={
          isHealth ? `${styles.inner} ${styles.innerHealth}` : styles.inner
        }
      >
        <div className={styles.copyPanel}>
          <div className={styles.copy}>
            <p className={styles.eyebrow}>Sobre nosotros</p>
            <h2 id="faculty-about-title">Conoce la {facultyName}</h2>
            <p className={styles.description}>{copy.description}</p>
            {copy.hook && <p className={styles.hook}>{copy.hook}</p>}
          </div>
        </div>
        <div className={styles.media}>
          <Image
            alt={`Edificio de la ${facultyName}`}
            fill
            sizes={
              isHealth
                ? "(max-width: 768px) 100vw, 60vw"
                : "(max-width: 768px) 100vw, 50vw"
            }
            src="/image/calendario-academico/header-calendario.jpg"
          />
        </div>
      </div>
    </section>
  );
}
