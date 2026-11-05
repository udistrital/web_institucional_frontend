import Image from "next/image";
import UdLogo from "@/components/common/ud-logo";
import styles from "./page-hero.module.css";
import type { PageHeroData, PageHeroTitle, PageHeroVariant } from "./types";

type PageHeroProps = {
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
  priority,
}: {
  data: PageHeroData;
  priority: boolean;
}) {
  const titleText = getTitleText(data.title);
  const imageAlt = data.imageAlt?.trim() || titleText;

  return (
    <div className={styles.visual}>
      {data.imageUrl ? (
        <Image
          alt={imageAlt}
          className={styles.image}
          fill
          priority={priority}
          sizes="(max-width: 768px) 100vw, 42vw"
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

function PageHeroBrandTitle({ data }: { data: PageHeroData }) {
  const eyebrow = data.eyebrow?.trim();

  return (
    <div className={styles.lockup}>
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
  data,
  priority = true,
  variant = "default",
}: PageHeroProps) {
  if (variant === "brand") {
    return (
      <header className={`${styles.hero} ${styles.brand}`}>
        <div className={styles.text}>
          <PageHeroBrandTitle data={data} />
        </div>
        <PageHeroMedia data={data} priority={priority} />
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
