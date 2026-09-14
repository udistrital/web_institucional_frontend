import styles from "./header.module.css";
import Link from "next/link";

export default function Brand() {
  return (
    <Link
    href="/"
    aria-label="Ir a la pagina principal"
    >
    <div className={styles.logo}>
      <img
        src="/Escudos/escudo-ud-black.svg"
        alt="Escudo Universidad Distrital"
        className={styles.shield}
      />
      <div className={styles.nameBox}>
        <img
          src="/Escudos/letter-ud-black.svg"
          alt="Universidad Distrital Fransisco Jose de Caldas"
          className={styles.letter}
        />
      </div>
      <div>
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
