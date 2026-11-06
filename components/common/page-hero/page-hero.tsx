import Image from "next/image";
import type { ReactNode } from "react";
import UdLogo from "@/components/common/ud-logo";
import styles from "./page-hero.module.css";
import type { PageHeroData, PageHeroTitle, PageHeroVariant } from "./types";

type PageHeroProps = {
  /** Contenido de la mitad derecha; solo lo usa la variante "brand" ("brand-diagonal" lo ignora). */
  aside?: ReactNode;
  data: PageHeroData;
  priority?: boolean;
  variant?: PageHeroVariant;
};

function getTitleText(title: PageHeroTitle): string {
  return typeof title === "string"
    ? title
    : title.map((segment) => segment.text).join("");
}

function PageHeroTitleView({ title }: { title: PageHeroTitle }) {
  if (typeof title === "string") return <h1 className={styles.title}>{title}</h1>;

  return (
    <h1 className={styles.title}>
      {title.map((segment, index) => (
        <span
          className={segment.accent ? styles.titleAccent : undefined}
          key={`${segment.text}-${index}`}
        >
          {segment.text}
        </span>
      ))}
    </h1>
  );
}

function PageHeroMedia({
  data,
  fallbackAlt,
  priority,
  sizes = "(max-width: 768px) 100vw, 42vw",
}: {
  data: PageHeroData;
  /** Texto alternativo cuando `data.imageAlt` está vacío; por defecto, el título. */
  fallbackAlt?: string;
  priority: boolean;
  sizes?: string;
}) {
  const titleText = getTitleText(data.title);
  const imageAlt = data.imageAlt?.trim() || fallbackAlt || titleText;

  return (
    <div className={styles.visual}>
      {data.imageUrl ? (
        <Image
          alt={imageAlt}
          className={styles.image}
          fill
          priority={priority}
          sizes={sizes}
          src={data.imageUrl}
        />
      ) : (
        <div aria-label={imageAlt} className={styles.imageFallback} role="img">
          <span aria-hidden="true">{titleText.charAt(0)}</span>
        </div>
      )}
      <span aria-hidden="true" className={styles.imageAccent} />
    </div>
  );
}

function PageHeroBrandTitle({
  className = styles.lockup,
  data,
}: {
  /** Clase del contenedor; cada variante de marca aporta la suya. */
  className?: string;
  data: PageHeroData;
}) {
  const eyebrow = data.eyebrow?.trim();

  return (
    <div className={className}>
      <UdLogo className={styles.lockupLogo} />
      <h1 className={styles.lockupTitle}>
        {eyebrow ? (
          <>
            <span className={styles.eyebrow}>{eyebrow}</span>{" "}
          </>
        ) : null}
        <span className={styles.lockupName}>{getTitleText(data.title)}</span>
      </h1>
    </div>
  );
}

/** Hero compartido para páginas que necesiten título e imagen destacados. */
export default function PageHero({
  aside,
  data,
  priority = true,
  variant = "default",
}: PageHeroProps) {
  const brandAlt = [data.eyebrow?.trim(), getTitleText(data.title)]
    .filter(Boolean)
    .join(" ");

  if (variant === "brand-diagonal") {
    return (
      <header className={`${styles.hero} ${styles.brandDiagonal}`}>
        <div className={styles.text}>
          <PageHeroBrandTitle className={styles.diagonalCard} data={data} />
        </div>
        <PageHeroMedia
          data={data}
          fallbackAlt={brandAlt}
          priority={priority}
          sizes="(max-width: 1023px) 100vw, 50vw"
        />
      </header>
    );
  }

  if (variant === "brand") {
    return (
      <header className={`${styles.hero} ${styles.brand}`}>
        <div className={styles.text}>
          <PageHeroBrandTitle data={data} />
        </div>
        <PageHeroMedia
          data={data}
          fallbackAlt={brandAlt}
          priority={priority}
          sizes="(max-width: 1023px) 100vw, 50vw"
        />
        {/* Sin `aside`, la mitad derecha muestra solo el fondo institucional. */}
        <div className={styles.brandAside}>{aside}</div>
        <span aria-hidden="true" className={styles.brandDivider} />
      </header>
    );
  }

  return (
    <header className={styles.hero}>
      <div className={styles.text}>
        <PageHeroTitleView title={data.title} />
      </div>
      <PageHeroMedia data={data} priority={priority} />
    </header>
  );
}
