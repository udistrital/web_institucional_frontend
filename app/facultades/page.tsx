import type { Metadata } from "next";
import Image from "next/image";
import styles from "./page.module.css";
import BreadCrumbs from "@/components/ui/bread-crumbs/bread-crumbs";

export const metadata: Metadata = {
  title: "Facultades",
};

type FacultyResource = {
  id: string;
  attributes: {
    title?: string;
    field_correo_electronico?: string | null;
    field_direccion?: string | null;
    field_horario?: string | null;
    field_nombre_decano?: string | null;
    field_pagina_web?: { uri?: string | null } | null;
    field_pbx?: { processed?: string | null } | null;
  };
  relationships?: {
    field_imagen_facultad?: {
      data?: { id?: string; meta?: { alt?: string } } | null;
    };
  };
};

type IncludedFile = {
  type?: string;
  id?: string;
  attributes?: { uri?: { url?: string } };
};

type FacultiesResponse = {
  data?: FacultyResource[];
  included?: IncludedFile[];
};

type Faculty = FacultyResource & {
  imageUrl: string | null;
  imageAlt: string;
};

function getServerBaseUrl() {
  const isDocker = Boolean(
    process.env.DRUPAL_BASE_URL &&
      !process.env.NEXT_PUBLIC_DRUPAL_BASE_URL?.includes("localhost"),
  );

  return (
    (isDocker ? process.env.DRUPAL_BASE_URL : process.env.NEXT_PUBLIC_DRUPAL_BASE_URL) ||
    process.env.DRUPAL_BASE_URL ||
    "http://localhost:8080"
  );
}

function resolveImageUrl(path: string | undefined, baseUrl: string) {
  if (!path) return null;

  try {
    return new URL(path, baseUrl).toString();
  } catch {
    return null;
  }
}

function getMapUrl(address: string | null | undefined) {
  if (!address) return null;

  const query = `${address}, Bogotá, Colombia`;
  return `https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed`;
}

function FacultyContactDetails({
  attributes,
}: {
  attributes: FacultyResource["attributes"];
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

async function getFaculties(): Promise<Faculty[]> {
  const apiUrl = new URL("/jsonapi/node/facultades", getServerBaseUrl());
  apiUrl.searchParams.set("filter[status]", "1");
  apiUrl.searchParams.set("include", "field_imagen_facultad");
  apiUrl.searchParams.set("sort", "title");

  try {
    const response = await fetch(
      apiUrl.toString(),
      process.env.NODE_ENV === "development"
        ? { cache: "no-store" }
        : { next: { revalidate: 3600 } },
    );

    if (!response.ok) return [];

    const json = (await response.json()) as FacultiesResponse;
    const included = json.included ?? [];
    const baseUrl = getServerBaseUrl();

    return (json.data ?? []).map((faculty) => {
      const imageReference = faculty.relationships?.field_imagen_facultad?.data;
      const imageFile = included.find(
        (item) => item.type === "file--file" && item.id === imageReference?.id,
      );

      return {
        ...faculty,
        imageUrl: resolveImageUrl(imageFile?.attributes?.uri?.url, baseUrl),
        imageAlt: imageReference?.meta?.alt || faculty.attributes.title || "Facultad",
      };
    });
  } catch {
    return [];
  }
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
              const website = attributes.field_pagina_web?.uri;
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
                      <FacultyContactDetails attributes={attributes} />
                    </div>

                    <details className={styles.infoPanel}>
                      <summary>Ver información de contacto y ubicación</summary>
                      <div className={styles.infoContent}>
                        <FacultyContactDetails attributes={attributes} />
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
                    {website && (
                      <a className={styles.website} href={website}>
                        Visitar sitio web <span aria-hidden="true">↗</span>
                      </a>
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
