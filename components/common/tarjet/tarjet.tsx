import Image from "next/image";
import Link from "next/link";
import type { ServiceProfile } from "@/navegation/audience_services";
import styles from "./tarjet.module.css";

type TarjetProps = {
  service: ServiceProfile;
  /** "card" para grillas (perfiles); "carousel" para el carrusel de la home. */
  variant?: "card" | "carousel";
  className?: string;
};

/** Flecha de "entrar" que se anima al pasar el cursor por la tarjeta. */
function ArrowIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}

/**
 * Tarjeta de acceso por rol/servicio. Toda la tarjeta es un enlace. Muestra una
 * imagen con un panel de información inferior (título + descripción + flecha)
 * siguiendo la identidad visual institucional (rojo/blanco/dorado).
 */
export default function Tarjet({
  service,
  variant = "card",
  className = "",
}: TarjetProps) {
  const base = variant === "carousel" ? styles.carousel : styles.card;
  const cardClassName = [base, className].filter(Boolean).join(" ");

  return (
    <Link className={cardClassName} href={service.href}>
      <div className={styles.imageWrapper}>
        {service.image ? (
          <Image
            className={styles.image}
            src={service.image}
            alt=""
            fill
            sizes={
              variant === "carousel"
                ? "(max-width: 720px) 88vw, 28vw"
                : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            }
          />
        ) : null}
        {/* Franja dorada: acento institucional sobre la imagen. */}
        <span className={styles.accent} aria-hidden="true" />
      </div>

      <div className={styles.body}>
        <div className={styles.text}>
          <h2 className={styles.title}>{service.label}</h2>
          {service.overviewLabel ? (
            <p className={styles.description}>{service.overviewLabel}</p>
          ) : null}
        </div>
        <span className={styles.arrow} aria-hidden="true">
          <ArrowIcon />
        </span>
      </div>
    </Link>
  );
}
