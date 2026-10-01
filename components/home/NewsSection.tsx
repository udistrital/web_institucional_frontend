import Image from "next/image";
import styles from "./home.module.css";
import { getNews } from "@/services/news";
import type { NewsItem } from "@/services/news.types";

const fallbackNews: NewsItem[] = [
  {
    id: "fallback-1",
    title: "Prepárate para la VIII edición de ‘La Noche y las Lunecirnagas’",
    description: "Conoce todos los detalles de esta actividad cultural de la Universidad Distrital.",
    image: "/image/vida universitaria.jpeg",
    alt: "Afiche de una actividad cultural universitaria",
    href: null,
  },
  {
    id: "fallback-2",
    title: "La Universidad Distrital fortalece su compromiso social",
    description: "Consulta las novedades y actividades de nuestra comunidad universitaria.",
    image: "/image/compromiso social.jpeg",
    alt: "Comunidad universitaria participando en una actividad",
    href: null,
  },
  {
    id: "fallback-3",
    title: "La investigación impulsa nuevas soluciones para la sociedad",
    description: "Conoce los proyectos y avances que nacen de la investigación universitaria.",
    image: "/image/investigacion.jpeg",
    alt: "Estudiante consultando material de investigación",
    href: null,
  },
];

export default async function NewsSection() {
  const { items, hasError } = await getNews();
  const news = hasError || items.length === 0 ? fallbackNews : items;

  return (
    <section className={styles["news-section"]} id="noticias" aria-labelledby="news-title">
      <div className={styles["news-content"]}>
        <h2 id="news-title">Noticias</h2>
        <div className={styles["news-grid"]}>
          {news.map((item) => (
            <article className={styles["news-card"]} key={item.id}>
              <Image src={item.image} alt={item.alt} width={640} height={360} />
              <div className={styles["news-card-content"]}>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                <a href="#noticias">Leer la noticia: {item.title}</a>
              </div>
            </article>
          ))}
        </div>
        <a className={styles["news-more-link"]} href="#noticias">Ver todas las noticias</a>
      </div>
    </section>
  );
}
