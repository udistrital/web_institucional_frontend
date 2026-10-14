import styles from "../header.module.css";
import Image from "next/image";
import Link from "next/link";
import type { BrandProps } from "./Brand.types";

export default function Brand({ className }: BrandProps) {
  const rootClassName = [
    "col-start-1 row-start-2 inline-block w-fit mx-auto py-2 md:mx-0 md:ml-17 md:py-0 bg-white",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <Link
    href="/"
    aria-label="Ir a la pagina principal"
    className={rootClassName}
    >
    <div className={`${styles.logo} flex-col md:flex-row`}>
      <Image
        src="/escudos/escudo-ud-black.svg"
        alt="Escudo Universidad Distrital"
        width={100}
        height={157}
        className={styles.shield}
        unoptimized
      />
      <div className={styles.nameBox}>
        <Image
          src="/escudos/letter-ud-black.svg"
          alt="Universidad Distrital Fransisco Jose de Caldas"
          fill
          className={styles.letter}
          unoptimized
        />
      </div>
      <div className="hidden md:block">
        <Image
          src="/logotipos-ud/UDred.svg"
          alt="Logotipo Universidad Distrital Fransisco Jose de Caldas"
          width={247}
          height={61}
          className={styles.logoSwap}
          unoptimized
        />
      </div>
    </div>
    </Link>
  );
}
