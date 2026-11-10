import type { Metadata } from "next";
import Image from "next/image";
import styles from "./page.module.css";
import BreadCrumbs from "@/components/common/bread-crumbs/bread-crumbs";
import PageHero from "@/components/common/page-hero";
import { getFaculties, type Faculty } from "@/services/facultades";

export const metadata: Metadata = {
  title: "Facultades",
};

/**
 * Icono del encabezado "Encuentra tu facultad". Birrete académico, en el mismo
 * estilo de línea que los iconos de sección de "Sobre Nosotros"
 * (viewBox 24x24, trazo de 2px, sin relleno).
 */
function FacultadesIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
      <path d="M6 12v5c3 3 9 3 12 0v-5" />
    </svg>
  );
}

function getMapUrl(address: string | null | undefined) {
  if (!address) return null;

  const query = `${address}, Bogotá, Colombia`;
  return `https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed`;
}

function FacultyContactDetails({
  attributes,
}: {
  attributes: Faculty["attributes"];
}) {
  return (
    <dl className={styles.details}>
      {attributes.field_direccion && (
        <div>
          <dt>Dirección</dt>
          <dd>{attributes.field_direccion}</dd>
        </div>
      )}
      {attributes.field_correo_electronico && (
        <div>
          <dt>Correo electrónico</dt>
          <dd>
            <a href={`mailto:${attributes.field_correo_electronico}`}>
              {attributes.field_correo_electronico}
            </a>
          </dd>
        </div>
      )}
      {attributes.field_horario && (
        <div>
          <dt>Horario de atención</dt>
          <dd>{attributes.field_horario}</dd>
        </div>
      )}
      {attributes.field_pbx?.processed && (
        <div>
          <dt>Teléfono</dt>
          <dd dangerouslySetInnerHTML={{ __html: attributes.field_pbx.processed }} />
        </div>
      )}
    </dl>
  );
}

export default async function FacultadesPage() {
  const faculties = await getFaculties();

  return (
    <section className={styles.page} aria-label="Facultades">
      <PageHero
        data={{
          title: [{ text: "Facultades", accent: true }],
          imageUrl: "/image/hero.jpeg",
          imageAlt:
            "Campus de la Universidad Distrital Francisco José de Caldas",
        }}
      />

      <BreadCrumbs variant="onDark" />

      <div className={styles.content}>
        <div className={styles.sectionHeading}>
          <div className={styles.sectionHeadingMain}>
            <span className={styles.sectionHeadingIcon} aria-hidden="true">
              <FacultadesIcon />
            </span>
            <div>
              <p className={styles.sectionKicker}>Nuestra comunidad académica</p>
              <h2>Encuentra tu facultad</h2>
            </div>
          </div>
          <p className={styles.resultCount}>
            {faculties.length} {faculties.length === 1 ? "facultad disponible" : "facultades disponibles"}
          </p>
        </div>

        {faculties.length ? (
          <div className={styles.grid}>
            {faculties.map((faculty) => {
              const { attributes } = faculty;
              const mapUrl = getMapUrl(attributes.field_direccion);
              const nombreFacultad = attributes.title || "la facultad";

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
                    </div>

                    {/* Mapa plegable: en todas las resoluciones se abre con el
                        botón "Cómo llegar" para no ocupar espacio por defecto. */}
                    {mapUrl && (
                      <details className={styles.mapPanel}>
                        <summary className={styles.mapToggle}>
                          <span>Cómo llegar</span>
                        </summary>
                        <div className={styles.mapBlock}>
                          <iframe
                            className={styles.map}
                            src={mapUrl}
                            title={`Mapa de ubicación de ${nombreFacultad}`}
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                          />
                        </div>
                      </details>
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
                      <FacultyContactDetails attributes={attributes} />
                    </div>

                    <details className={styles.infoPanel}>
                      <summary>Ver información de contacto</summary>
                      <div className={styles.infoContent}>
                        <FacultyContactDetails attributes={attributes} />
                      </div>
                    </details>

                    <a className={styles.website} href={faculty.href}>
                      Visitar sitio web <span aria-hidden="true">↗</span>
                    </a>
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
