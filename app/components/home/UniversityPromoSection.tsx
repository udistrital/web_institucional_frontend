"use client";

import { useEffect, useRef } from "react";
import styles from "./home.module.css";

export default function UniversityPromoSection() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Reproduce el video solo cuando la sección está visible; lo pausa al salir.
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          void video.play().catch(() => {
            /* Autoplay puede ser bloqueado; se ignora silenciosamente. */
          });
        } else {
          video.pause();
        }
      },
      { threshold: 0.5 },
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  return (
    <section className={styles["university-promo"]} id="video-institucional" aria-labelledby="promo-title">
      <div className={styles["promo-media"]}>
        <video
          ref={videoRef}
          className={styles["promo-video"]}
          poster="/image/hero.jpeg"
          preload="metadata"
          muted
          loop
          playsInline
        >
          <source src="/video/Udistrital.mp4" type="video/mp4" />
          Tu navegador no soporta la reproducción de video.
        </video>
      </div>
      <div className={styles["promo-copy"]}>
        <h2 id="promo-title">Sé parte de la<br />Universidad Distrital</h2>
        <p>
          Nuestra oferta académica está compuesta por carreras en las siguientes áreas de
          conocimiento: artes, comunicación, sistemas, educación, forestal, ambiental,
          electrónica, telecomunicaciones, sanitaria, administración, matemáticas, ciencias
          naturales, civil, bibliotecología, eléctrica, industrial y telemática.
        </p>
      </div>
    </section>
  );
}
