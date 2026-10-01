import { NewsCard } from "@/components/news-card";

import styles from "./news-list.module.css";
import type { NewsListProps } from "./NewsList.types";

/**
 * Grilla de noticias presentacional.
 *
 * Mapea cada `NewsItem` plano recibido por props a una `NewsCard`. No obtiene
 * datos ni accede a estructuras JSON:API; toda la obtención/transformación vive
 * en la Capa_Servicios.
 */
export default function NewsList({ items, className }: NewsListProps) {
  const gridClassName = className
    ? `${styles["news-grid"]} ${className}`
    : styles["news-grid"];

  return (
    <div className={gridClassName}>
      {items.map((item) => (
        <NewsCard key={item.id} item={item} />
      ))}
    </div>
  );
}
