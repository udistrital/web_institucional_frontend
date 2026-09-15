import Image from "next/image";
import styles from "./home.module.css";

const services = [
  { title: "Vida Universitaria", description: "En la Universidad Distrital te ofrecemos diferentes líneas del conocimiento y de bienestar donde te brindaremos apoyo integral, servicios de orientación y desarrollo personal para apoyar el aprendizaje y la investigación.", image: "/image/vida universitaria.jpeg", alt: "Estudiante sonriente con material de estudio" },
  { title: "Investigación", description: "Te ofrece servicios de investigación que incluyen acceso a laboratorios especializados, apoyo en proyectos de investigación, asesorías metodológicas, y recursos digitales para fomentar el desarrollo académico y la innovación.", image: "/image/investigacion.jpeg", alt: "Estudiante consultando un libro en una biblioteca" },
  { title: "Compromiso Social", description: "La Universidad te brinda servicios de extensión que conectan la educación continua con proyectos sociales, consultorías, y promueve el intercambio de conocimientos y el desarrollo comunitario.", image: "/image/compromiso social.jpeg", alt: "Estudiantes colaborando en una actividad académica" },
];

export default function ServicesSection() {
  return <section className={styles["services-section"]} id="servicios" aria-labelledby="services-title"><div className={styles["services-content"]}><header className={styles["services-heading"]}><h2 id="services-title">Gestión de Servicios</h2><p>Encuentra en un solo lugar los servicios, recursos y soluciones que tenemos disponibles para ti. Consulta información, accede fácilmente a cada servicio y gestiona tus solicitudes de manera rápida y sencilla.</p></header><div className={styles["services-list"]}>{services.map((service) => <article className={styles["service-card"]} key={service.title}><Image src={service.image} alt={service.alt} width={640} height={360} /><div className={styles["service-card-content"]}><h3>{service.title}</h3><p>{service.description}</p><a href="#servicios">Ver más</a></div></article>)}</div></div></section>;
}
