import Image from "next/image";
import Link from "next/link";
import type { ContentCardItem } from "./types";
import { rutaContenido } from "@/app/noticias-eventos/lib/contenido";
import styles from "./content-card.module.css";

function NewsIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2" />
      <path d="M18 14h-8M15 18h-5M10 6h8v4h-8V6Z" />
    </svg>
  );
}

function EventIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  );
}

type ContentCardProps = {
  item: ContentCardItem;
};

export default function ContentCard({ item }: ContentCardProps) {
  const esEvento = item.kind === "evento";
  const etiqueta = esEvento ? "Evento" : "Noticia";
  const Icono = esEvento ? EventIcon : NewsIcon;

  const media = item.image ? (
    <Image
      src={item.image}
      alt={item.imageAlt || item.title}
      fill
      sizes="(max-width: 720px) 100vw, (max-width: 1100px) 50vw, 33vw"
      className={styles.image}
    />
  ) : (
    <span className={styles.imageFallback} aria-hidden="true">
      <Icono />
    </span>
  );

  return (
    <article className={styles.card}>
      <Link
        href={rutaContenido(item)}
        className={styles.cardTrigger}
        aria-label={`${etiqueta}: ${item.title}`}
      >
        <span className={styles.cardImage}>
          {media}
          <span className={`${styles.badge} ${esEvento ? styles.badgeEvento : ""}`}>
            <Icono />
            {etiqueta}
          </span>
        </span>

        {item.source && (
          <span className={styles.cardBody}>
            <span className={styles.cardSource}>
              <Icono />
              {item.source}
            </span>
          </span>
        )}
      </Link>
    </article>
  );
}
