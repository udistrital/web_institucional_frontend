import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.css";
import BreadCrumbs from "@/components/common/bread-crumbs/bread-crumbs";
import { slugFiltro } from "@/lib/filtros";
import { getMapUrl } from "@/lib/maps";
import { facultades as rutasFacultades } from "@/navegation/global";
import { getFaculties } from "@/services/facultades";
import FacultyContactDetails from "./components/FacultyContactDetails";

export const metadata: Metadata = {
  title: "Facultades",
};

function getLocalFacultyHref(title: string) {
  const titleSlug = slugFiltro(title);

  return (
    rutasFacultades.find((faculty) => slugFiltro(faculty.nombre) === titleSlug)
      ?.href ?? null
  );
}

export default async function FacultadesPage() {
  const faculties = await getFaculties();

  return (
    <section className={styles.page} aria-labelledby="facultades-title">
      <header className={styles.hero}>
        <div className={styles.heroContent}>
          <p className={styles.eyebrow}>Universidad Distrital</p>
          <h1 id="facultades-title">Facultades</h1>
          <p className={styles.heroLead}>
            Conoce nuestras facultades, sus equipos directivos y los canales de atención.
          </p>
        </div>
        <span className={styles.heroNumber} aria-hidden="true">01</span>
      </header>
      
      <BreadCrumbs />

      <div className={styles.content}>
        <div className={styles.sectionHeading}>
          <div>
            <p className={styles.sectionKicker}>Nuestra comunidad académica</p>
            <h2>Encuentra tu facultad</h2>
          </div>
          <p className={styles.resultCount}>
            {faculties.length} {faculties.length === 1 ? "facultad disponible" : "facultades disponibles"}
          </p>
        </div>

        {faculties.length ? (
          <div className={styles.grid}>
            {faculties.map((faculty) => {
              const { attributes } = faculty;
              const facultyHref = getLocalFacultyHref(attributes.title);
              const mapUrl = getMapUrl(attributes.field_direccion);

              return (
                <article className={styles.card} key={faculty.id}>
                  <div className={styles.mediaColumn}>
                    <div className={styles.cardImage}>
                      {faculty.imageUrl ? (
                        <Image
                          src={faculty.imageUrl}
                          alt={faculty.imageAlt}
                          fill
                          sizes="(max-width: 720px) 100vw, 40vw"
                          className={styles.image}
                        />
                      ) : (
                        <span className={styles.imageFallback} aria-hidden="true">UD</span>
                      )}
                      <span className={styles.cardLabel}>Facultad</span>
                    </div>

                    {mapUrl && (
                      <div className={`${styles.mapBlock} ${styles.desktopMap}`}>
                        <p className={styles.mapTitle}>Ubicación</p>
                        <iframe
                          className={styles.map}
                          src={mapUrl}
                          title={`Mapa de ubicación de ${attributes.title || "la facultad"}`}
                          loading="lazy"
                          referrerPolicy="no-referrer-when-downgrade"
                        />
                      </div>
                    )}
                  </div>

                  <div className={styles.cardBody}>
                    <h3>{attributes.title || "Facultad"}</h3>
                    {attributes.field_nombre_decano && (
                      <p className={styles.dean}>
                        <span>Decanatura</span>
                        {attributes.field_nombre_decano}
                      </p>
                    )}

                    <div className={styles.desktopInfo}>
                      <FacultyContactDetails
                        attributes={attributes}
                        className={styles.details}
                      />
                    </div>

                    <details className={styles.infoPanel}>
                      <summary>Ver información de contacto y ubicación</summary>
                      <div className={styles.infoContent}>
                        <FacultyContactDetails
                          attributes={attributes}
                          className={styles.details}
                        />
                        {mapUrl && (
                          <div className={`${styles.mapBlock} ${styles.mobileMap}`}>
                            <p className={styles.mapTitle}>Ubicación</p>
                            <iframe
                              className={styles.map}
                              src={mapUrl}
                              title={`Mapa de ubicación de ${attributes.title || "la facultad"}`}
                              loading="lazy"
                              referrerPolicy="no-referrer-when-downgrade"
                            />
                          </div>
                        )}
                      </div>
                    </details>
                    {facultyHref && (
                      <Link className={styles.website} href={facultyHref}>
                        Ir a la página de la facultad <span aria-hidden="true">↗</span>
                      </Link>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <h2>Información no disponible</h2>
            <p>En este momento no pudimos cargar las facultades. Intenta nuevamente más tarde.</p>
          </div>
        )}
      </div>
    </section>
  );
}
