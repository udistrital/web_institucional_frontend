import Image from "next/image";
import Link from "next/link";
import type { ServiceProfile } from "@/navegation/audience_services";
import { ProfileIconGlyph } from "./profile-icons";
import styles from "./tarjet.module.css";

type TarjetProps = {
  service: ServiceProfile;
  /** "card" para grillas (perfiles); "carousel" para el carrusel de la home. */
  variant?: "card" | "carousel";
  className?: string;
};

/**
 * Tarjeta de acceso por rol/servicio. Toda la tarjeta es un enlace. Muestra una
 * imagen superior y un panel blanco inferior (título + descripción). Un medallón
 * rojo con el ícono del perfil queda montado entre la imagen y el panel, dando
 * identidad visual inmediata a cada rol. Sigue la identidad institucional
 * (rojo/blanco/dorado): franja dorada sobre la imagen y borde dorado al hover.
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
        {/* Medallón con el ícono del perfil, montado entre imagen y panel. */}
        {service.icon ? (
          <span className={styles.medallion} aria-hidden="true">
            <ProfileIconGlyph name={service.icon} />
          </span>
        ) : null}
      </div>

      <div className={styles.body}>
        <h2 className={styles.title}>{service.label}</h2>
        {service.overviewLabel ? (
          <p className={styles.description}>{service.overviewLabel}</p>
        ) : null}
      </div>
    </Link>
  );
}
