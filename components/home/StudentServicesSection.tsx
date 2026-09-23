import Image from "next/image";
import type { ReactNode } from "react";
import styles from "./home.module.css";

const iconProps = {
  width: 40,
  height: 40,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

const GraduationIcon = () => (
  <svg {...iconProps}><path d="M22 10 12 5 2 10l10 5 10-5Z" /><path d="M6 12v5c0 1 2.7 2.5 6 2.5s6-1.5 6-2.5v-5" /><path d="M22 10v6" /></svg>
);
const BookIcon = () => (
  <svg {...iconProps}><path d="M12 6.5C10.5 5.3 8.4 4.8 6 5c-.9 0-1.7.1-2.5.3v13c.8-.2 1.6-.3 2.5-.3 2.4-.2 4.5.3 6 1.5" /><path d="M12 6.5c1.5-1.2 3.6-1.7 6-1.5.9 0 1.7.1 2.5.3v13c-.8-.2-1.6-.3-2.5-.3-2.4-.2-4.5.3-6 1.5Z" /><path d="M12 6.5v13" /></svg>
);
const SearchInfoIcon = () => (
  <svg {...iconProps}><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /><path d="M11 8h.01" /><path d="M11 11v3" /></svg>
);
const ShieldCheckIcon = () => (
  <svg {...iconProps}><path d="M12 3 5 6v5c0 4.5 3 8 7 10 4-2 7-5.5 7-10V6l-7-3Z" /><path d="m9 12 2 2 4-4" /></svg>
);

const studentServices: { icon: ReactNode; title: string; description: string }[] = [
  { icon: <GraduationIcon />, title: "Estudia en la UD", description: "Abre nuevas puertas para tu vida profesional y vive la experiencia de estudiar en la mejor universidad de Bogotá." },
  { icon: <BookIcon />, title: "Capacitaciones, cursos, talleres y diplomados", description: "Sabemos lo importante de complementar tus conocimientos y aumentar tu competitividad." },
  { icon: <SearchInfoIcon />, title: "Transparencia y acceso a la información pública", description: "Consulta la información que esta entidad genera, en el desarrollo de su misión y funciones." },
  { icon: <ShieldCheckIcon />, title: "Aseguramiento de la calidad", description: "Comprometidos con tu futuro profesional, la UD cuenta con 36 programas con estándares de Alta Calidad." },
];

export default function StudentServicesSection() {
  return <section className={styles["student-services-section"]} aria-labelledby="student-services-title"><Image className={styles["services-lead-image"]} src="/image/inscripciones-trim.png" alt="" aria-hidden="true" width={1075} height={1770} sizes="34vw" /><h2 id="student-services-title" className="sr-only">Información para estudiantes</h2><div className={styles["student-services-grid"]}>{studentServices.map((service) => <a className={styles["student-service"]} href="#informacion" key={service.title}><span className={styles["student-service-icon"]} aria-hidden="true">{service.icon}</span><h3>{service.title}</h3><p>{service.description}</p></a>)}</div></section>;
}
