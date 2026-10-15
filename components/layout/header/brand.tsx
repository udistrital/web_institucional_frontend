import styles from "./header.module.css";
import Link from "next/link";

export default function Brand() {
  return (
    <Link
    href="/"
    aria-label="Ir a la pagina principal"
    className="inline-block w-fit shrink-0 py-2 md:py-0 bg-white"
    >
    <div className={`${styles.logo} flex-col md:flex-row`}>
      <img
        src="/escudos/escudo-ud-black.svg"
        alt="Escudo Universidad Distrital"
        className={styles.shield}
      />
      <div className={styles.nameBox}>
        <img
          src="/escudos/letter-ud-black.svg"
          alt="Universidad Distrital Fransisco Jose de Caldas"
          className={styles.letter}
        />
      </div>
      <div className="hidden md:block">
        <img
          src="/logotipos-ud/UDred.svg"
          alt="Logotipo Universidad Distrital Fransisco Jose de Caldas"
          className={styles.logoSwap}
        />
      </div>
    </div>
    </Link>
  );
}
