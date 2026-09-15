import styles from "./home.module.css";

const studentServices = [
  { icon: "✦", title: "Estudia en la UD", description: "Abre nuevas puertas para tu vida profesional y vive la experiencia de estudiar en la mejor universidad de Bogotá." },
  { icon: "⌂", title: "Capacitaciones, cursos, talleres y diplomados", description: "Sabemos lo importante de complementar tus conocimientos y aumentar tu competitividad." },
  { icon: "◎", title: "Transparencia y acceso a la información pública", description: "Consulta la información que esta entidad genera, en el desarrollo de su misión y funciones." },
  { icon: "▣", title: "Aseguramiento de la calidad", description: "Comprometidos con tu futuro profesional, la UD cuenta con 36 programas con estándares de Alta Calidad." },
];

export default function StudentServicesSection() {
  return <section className={styles["student-services-section"]} aria-labelledby="student-services-title"><h2 id="student-services-title" className="sr-only">Información para estudiantes</h2><div className={styles["student-services-grid"]}>{studentServices.map((service) => <a className={styles["student-service"]} href="#informacion" key={service.title}><span className={styles["student-service-icon"]} aria-hidden="true">{service.icon}</span><h3>{service.title}</h3><p>{service.description}</p></a>)}</div></section>;
}
