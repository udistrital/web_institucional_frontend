import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import BreadCrumbs from "@/components/common/bread-crumbs/bread-crumbs";
import type { ContentKind } from "@/components/common/content-card";
import {
  cargarContenido,
  buscarContenido,
  ultimosContenidos,
} from "../../lib/datos";
import { rutaContenido, slugContenido } from "../../lib/contenido";
import styles from "./page.module.css";

const TIPOS_VALIDOS: ContentKind[] = ["noticia", "evento"];

const dateFormatter = new Intl.DateTimeFormat("es-CO", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

const dateFormatterShort = new Intl.DateTimeFormat("es-CO", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

const formatDate = (value: string) => dateFormatter.format(new Date(value));
const formatDateShort = (value: string) =>
  dateFormatterShort.format(new Date(value));

function esTipoValido(valor: string): valor is ContentKind {
  return (TIPOS_VALIDOS as string[]).includes(valor);
}

type DetalleParams = { tipo: string; slug: string };

export async function generateStaticParams(): Promise<DetalleParams[]> {
  const items = await cargarContenido();
  return items.map((item) => ({ tipo: item.kind, slug: slugContenido(item) }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<DetalleParams>;
}): Promise<Metadata> {
  const { tipo, slug } = await params;
  if (!esTipoValido(tipo)) return { title: "Contenido no encontrado" };

  const item = await buscarContenido(tipo, slug);
  if (!item) return { title: "Contenido no encontrado" };

  return {
    title: `${item.title} | Universidad Distrital Francisco José de Caldas`,
    description:
      item.description ||
      `${tipo === "evento" ? "Evento" : "Noticia"} de la Universidad Distrital.`,
  };
}

export default async function DetalleContenidoPage({
  params,
}: {
  params: Promise<DetalleParams>;
}) {
  const { tipo, slug } = await params;
  if (!esTipoValido(tipo)) notFound();

  const item = await buscarContenido(tipo, slug);
  if (!item) notFound();

  const ultimos = await ultimosContenidos(item.id, 6);

  const esEvento = item.kind === "evento";
  const etiqueta = esEvento ? "Evento" : "Noticia";
  const tieneRango = Boolean(item.endDate) && item.endDate !== item.date;
  const detalleHtml = item.detail?.trim() || "";
  const enlaceOriginal =
    item.href && item.href !== "#noticias" && item.href !== "#eventos"
      ? item.href
      : null;

  return (
    <main className={styles.page}>
      <BreadCrumbs variant="onDark" />

      <div className={styles.layout}>
        <article className={styles.article}>
          <header className={styles.header}>
            <Link className={styles.back} href="/noticias-eventos">
              <span aria-hidden="true">←</span>
              Volver a noticias y eventos
            </Link>

            <span
              className={`${styles.badge} ${esEvento ? styles.badgeEvento : ""}`}
            >
              {etiqueta}
            </span>

            <h1 className={styles.title}>{item.title}</h1>

            <div className={styles.meta}>
              <p className={styles.metaItem}>
                <span className={styles.metaLabel}>
                  {esEvento ? "Fecha del evento" : "Publicado"}
                </span>
                <span className={styles.metaValue}>
                  <time dateTime={item.date}>{formatDate(item.date)}</time>
                  {tieneRango && item.endDate && (
                    <>
                      <span aria-hidden="true" className={styles.dateArrow}>
                        {" "}
                        →{" "}
                      </span>
                      <time dateTime={item.endDate}>
                        {formatDate(item.endDate)}
                      </time>
                    </>
                  )}
                </span>
              </p>
              {item.source && (
                <p className={styles.metaItem}>
                  <span className={styles.metaLabel}>Fuente</span>
                  <span className={styles.metaValue}>{item.source}</span>
                </p>
              )}
            </div>
          </header>

          {item.image && (
            <figure className={styles.figure}>
              <Image
                src={item.image}
                alt={item.imageAlt || item.title}
                width={0}
                height={0}
                sizes="(max-width: 1024px) 100vw, 40rem"
                className={styles.image}
                priority
              />
              {item.imageAlt && (
                <figcaption className={styles.caption}>
                  {item.imageAlt}
                </figcaption>
              )}
            </figure>
          )}

          <div className={styles.content}>
            {detalleHtml ? (
              <div
                className={styles.body}
                dangerouslySetInnerHTML={{ __html: detalleHtml }}
              />
            ) : item.description ? (
              <div className={styles.body}>
                <p>{item.description}</p>
              </div>
            ) : (
              <p className={styles.empty}>
                Este contenido no tiene una descripción disponible.
              </p>
            )}

            {enlaceOriginal && (
              <a
                className={styles.sourceLink}
                href={enlaceOriginal}
                target="_blank"
                rel="noopener noreferrer"
              >
                {esEvento ? "Ver evento completo" : "Leer noticia completa"}
                <span aria-hidden="true">→</span>
              </a>
            )}
          </div>
        </article>

        {ultimos.length > 0 && (
          <aside className={styles.sidebar} aria-label="Lo más reciente">
            <h2 className={styles.sidebarTitle}>Lo más reciente</h2>
            <ul className={styles.sidebarList}>
              {ultimos.map((reciente) => {
                const recienteEvento = reciente.kind === "evento";
                return (
                  <li key={`${reciente.kind}-${reciente.id}`}>
                    <Link
                      className={styles.recentCard}
                      href={rutaContenido(reciente)}
                    >
                      <span className={styles.recentImage}>
                        {reciente.image ? (
                          <Image
                            src={reciente.image}
                            alt={reciente.imageAlt || reciente.title}
                            fill
                            sizes="96px"
                            className={styles.recentImg}
                          />
                        ) : (
                          <span className={styles.recentImageFallback} aria-hidden="true" />
                        )}
                      </span>
                      <span className={styles.recentBody}>
                        <span
                          className={`${styles.recentBadge} ${
                            recienteEvento ? styles.recentBadgeEvento : ""
                          }`}
                        >
                          {recienteEvento ? "Evento" : "Noticia"}
                        </span>
                        <span className={styles.recentTitle}>
                          {reciente.title}
                        </span>
                        <time
                          className={styles.recentDate}
                          dateTime={reciente.date}
                        >
                          {formatDateShort(reciente.date)}
                        </time>
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </aside>
        )}
      </div>
    </main>
  );
}
