import Image from "next/image";
import Link from "next/link";
import styles from "./home.module.css";

const faculties = [
  { title: "Facultad de Ingeniería", href: "/facultades/ingenieria", image: "/image/facultad ingenieria.jpg", alt: "Edificio de la Facultad de Ingeniería" },
  { title: "Facultad ASAB", href: "/facultades/artes-asab", image: "/image/facultad de artes.jpeg", alt: "Edificio de la Facultad de Artes ASAB" },
  { title: "Facultad de Tecnológica", href: "/facultades/tecnologica", image: "/image/facultad tecnologica.jpeg", alt: "Edificio de la Facultad Tecnológica" },
  { title: "Facultad de Ciencias y Educación", href: "/facultades/ciencias-educacion", image: "/image/facultad ciencias y educacion.jpeg", alt: "Edificio de la Facultad de Ciencias y Educación" },
  { title: "Facultad de Ciencias de la Salud", href: "/facultades/ciencias-salud", image: "/image/facultad de ciencias de la salud.jpeg", alt: "Facultad de Ciencias de la Salud" },
  { title: "Facultad del Medio Ambiente", href: "/facultades/medio-ambiente-recursos-naturales", image: "/image/facultad de medio ambiente.jpeg", alt: "Facultad del Medio Ambiente y Recursos Naturales" },
  { title: "Facultad de Ciencias Matemáticas y Naturales", href: "/facultades/ciencias-matematicas-naturales", image: "/image/facultad de matematicas y ciencias.jpeg", alt: "Facultad de Ciencias Matemáticas y Naturales" },
];

export default function FacultyCurtainSection() {
  return (
    <section className={styles["faculty-curtain"]} aria-labelledby="faculty-curtain-title">
      <h2 id="faculty-curtain-title" className="sr-only">Facultades de la Universidad Distrital</h2>
      <div className={styles["faculty-curtain-track"]}>
        {faculties.map((faculty) => (
          <Link className={styles["faculty-curtain-panel"]} href={faculty.href} key={faculty.title}>
            <Image src={faculty.image} alt={faculty.alt} fill sizes="(max-width: 720px) 72vw, 17vw" />
            <span className={styles["faculty-curtain-shade"]} />
            <span className={styles["faculty-curtain-title"]}>{faculty.title}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
