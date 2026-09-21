import styles from "./home.module.css";

const faculties = [
  "Facultad de Artes - ASAB",
  "Facultad de Ciencias de la Salud",
  "Facultad de Tecnológica",
  "Facultad de Ingeniería",
  "Facultad de Ciencias Matemáticas y Naturales",
  "Facultad de Ciencias y Educación",
  "Facultad del Medio Ambiente y Recursos Naturales",
];

export default function FacultiesSection() {
  return (
    <section className={styles["faculties-section"]} aria-labelledby="faculties-title">
      <div className={styles["faculties-content"]}>
        <div className={styles["faculties-intro"]}>
          <h2 id="faculties-title">Nuestras<br />Facultades</h2>
          <a className={styles["faculties-link"]} href="#noticias">Ver programas académicos por facultad</a>
        </div>
        <ul className={styles["faculties-list"]}>
          {faculties.map((faculty) => <li key={faculty}><a href="#noticias">{faculty}</a></li>)}
        </ul>
      </div>
    </section>
  );
}
