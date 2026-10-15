import Image from "next/image";
import Link from "next/link";
import type { ServiceProfile } from "@/navegation/audience_services";
import styles from "./tarjet.module.css";

type TarjetProps = {
  service: ServiceProfile;
  variant?: "card" | "carousel" | "bento";
  className?: string;
};

export default function Tarjet({
  service,
  variant = "card",
  className = "",
}: TarjetProps) {
  const base =
    variant === "carousel"
      ? styles.carousel
      : variant === "bento"
        ? styles.bento
        : styles.card;
  const cardClassName = [base, className].filter(Boolean).join(" ");

  return (
    <Link className={cardClassName} href={service.href}>
      {service.image ? (
        <div className={styles.imageWrapper}>
          <Image
            className={styles.image}
            src={service.image}
            alt={service.label}
            fill
            sizes={
              variant === "carousel"
                ? "(max-width: 720px) 88vw, 28vw"
                : variant === "bento"
                  ? "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            }
          />
        </div>
      ) : null}

      <div className={`${styles.overlay} ${variant === "bento" ? styles.overlayRed : ""}`}>
        <h2 className={styles.title}>{service.label}</h2>
        {service.overviewLabel ? (
          <p className={styles.description}>{service.overviewLabel}</p>
        ) : null}
      </div>
    </Link>
  );
}
