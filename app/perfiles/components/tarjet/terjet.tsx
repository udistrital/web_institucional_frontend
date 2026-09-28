import Image from "next/image";
import Link from "next/link";
import type { ServiceProfile } from "@/navegation/audience_services";
import styles from "./tarjet.module.css";

type TarjetProps = {
  service: ServiceProfile;
  className?: string;
};

export default function Tarjet({
  service,
  className = "",
}: TarjetProps) {
  const cardClassName = [styles.card, className].filter(Boolean).join(" ");

  return (
    <Link className={cardClassName} href={service.href}>
      {service.image ? (
        <div className={styles.imageWrapper}>
          <Image
            className={styles.image}
            src={service.image}
            alt={service.label}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </div>
      ) : null}

      <div className={styles.overlay}>
        <h2 className={styles.title}>{service.label}</h2>
        {service.overviewLabel ? (
          <p className={styles.description}>{service.overviewLabel}</p>
        ) : null}
      </div>
    </Link>
  );
}
