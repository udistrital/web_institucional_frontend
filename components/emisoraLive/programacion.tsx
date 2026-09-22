import styles from "./emisoraLive.module.css";

export default function Programacion() {
  return (
    <div className={styles.ProgramacionContent}>
      <span>Programacion de la UD</span>
      <button
        type="button"
        className={styles.ProgramacionButton}
      >
        Mas programacion
      </button>
    </div>
  );
}
