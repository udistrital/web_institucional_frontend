import Image from "next/image";
import styles from "./home.module.css";

export default function EnrollmentSection() {
  return (
    <section className={styles["enrollment-section"]} aria-labelledby="enrollment-title">
      <div className={styles["enrollment-content"]}>
        <div className={styles["enrollment-copy"]}><h2 id="enrollment-title">Inscribe o solicita<br />información</h2><p>Si necesitas más información para estudiar en la UD, selecciona una opción y te enviaremos toda la información que necesites acerca del estudio de tu interés.</p><div className={styles["enrollment-actions"]}><a className={styles["enrollment-primary"]} href="#inscripciones">Quiero Inscribirme</a><a className={styles["enrollment-secondary"]} href="#informacion">Solicitar Información</a></div></div>
        <Image className={styles["enrollment-image"]} src="/image/inscripciones.png" alt="Estudiante sonriente con una tableta y una mochila" width={480} height={0} />
      </div>
    </section>
  );
}
