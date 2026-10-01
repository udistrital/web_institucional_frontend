import Image from "next/image";

import styles from "./news-card.module.css";
import type { NewsCardProps } from "./NewsCard.types";

/**
 * Tarjeta de noticia presentacional.
 *
 * Renderiza una `NewsItem` ya plana recibida por props. No obtiene datos ni
 * accede a estructuras JSON:API; toda la obtención/transformación vive en la
 * Capa_Servicios.
 */
export default function NewsCard({ item, className }: NewsCardProps) {
  const cardClassName = className
    ? `${styles["news-card"]} ${className}`
    : styles["news-card"];

  return (
    <article className={cardClassName}>
      <Image src={item.image} alt={item.alt} width={640} height={360} />
      <div className={styles["news-card-content"]}>
        <h3>{item.title}</h3>
        <p>{item.description}</p>
        <a href={item.href ?? "#noticias"}>Leer la noticia: {item.title}</a>
      </div>
    </article>
  );
}
