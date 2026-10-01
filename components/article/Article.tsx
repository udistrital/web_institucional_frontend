import Image from "next/image";

import type { ArticleProps } from "./Article.types";

/**
 * Componente presentacional de un artículo.
 *
 * Renderiza exclusivamente a partir de las props recibidas: no realiza
 * peticiones de red ni conoce la estructura de JSON:API.
 */
export default function Article({ articulo, className }: ArticleProps) {
  return (
    <article className={className}>
      <h1>{articulo.title}</h1>
      <time>{new Date(articulo.createdAt).toLocaleDateString("es-CO")}</time>

      {articulo.posterUrl && (
        <div className="relative aspect-video w-full">
          <Image
            src={articulo.posterUrl}
            alt={articulo.posterAlt}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 768px"
            unoptimized
          />
        </div>
      )}

      {articulo.bodyHtml && (
        <div dangerouslySetInnerHTML={{ __html: articulo.bodyHtml }} />
      )}
    </article>
  );
}
