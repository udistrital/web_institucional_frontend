import Image from "next/image";
import Button from "@/components/common/button/button";
import styles from "./home.module.css";

export default function EnrollmentSection() {
  return (
    <section className={styles["enrollment-section"]} aria-labelledby="enrollment-title">
      <div className={styles["enrollment-content"]}>
        <div className={styles["enrollment-copy"]}><h2 id="enrollment-title">Inscribete o solicita información</h2><p>Si necesitas más información para estudiar en la UD, selecciona una opción y te enviaremos toda la información que necesites acerca del estudio de tu interés.</p><div className={styles["enrollment-actions"]}><Button href="/perfiles/aspirantes/#tramites" variant="white" className={styles["enrollment-action"]}>Quiero Inscribirme</Button><Button href="#informacion" variant="white" className={styles["enrollment-action"]}>Solicitar Información</Button></div></div>
        <Image className={styles["enrollment-image"]} src="/image/inscripciones-trim.png" alt="Estudiante sonriente con una tableta y una mochila" width={1075} height={1770} sizes="(max-width: 720px) 12rem, (max-width: 1024px) 38vw, 46vw" />
      </div>
    </section>
  );
}
