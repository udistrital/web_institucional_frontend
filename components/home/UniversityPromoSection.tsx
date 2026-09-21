"use client";

import { useRef, useState } from "react";
import styles from "./home.module.css";

export default function UniversityPromoSection() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const toggleVideo = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      void videoRef.current.play();
    } else {
      videoRef.current.pause();
    }
  };

  return (
    <section className={styles["university-promo"]} id="video-institucional" aria-labelledby="promo-title">
      <div className={styles["promo-media"]}>
        <video
          ref={videoRef}
          className={styles["promo-video"]}
          poster="/image/hero.jpeg"
          preload="metadata"
          controls
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        >
          <source src="/video/Udistrital.mp4" type="video/mp4" />
          {/* Subtítulos sincronizados (WCAG 2.2 AA §1.2.2 / Protocolo UDFJC §3.5). */}
          <track kind="captions" srcLang="es" label="Español" src="/video/Udistrital.es.vtt" default />
          Tu navegador no soporta la reproducción de video.
        </video>
        <button
          className={`${styles["promo-play"]} ${isPlaying ? styles["is-playing"] : ""}`}
          type="button"
          aria-label={isPlaying ? "Pausar video institucional" : "Reproducir video institucional"}
          aria-pressed={isPlaying}
          onClick={toggleVideo}
        >
          <span aria-hidden="true">{isPlaying ? "Ⅱ" : "▶"}</span>
        </button>
      </div>
      <div className={styles["promo-copy"]}>
        <h2 id="promo-title">Sé parte de la<br />Universidad Distrital</h2>
        <p>
          Nuestra oferta académica está compuesta por carreras en las siguientes áreas de
          conocimiento: artes, comunicación, sistemas, educación, forestal, ambiental,
          electrónica, telecomunicaciones, sanitaria, administración, matemáticas, ciencias
          naturales, civil, bibliotecología, eléctrica, industrial y telemática.
        </p>
        {/* Transcripción textual del video (WCAG 2.2 AA §1.2.1 / Protocolo UDFJC §3.5). */}
        <details className={styles["promo-transcript"]}>
          <summary>Ver transcripción del video institucional</summary>
          <p>
            [Música institucional] Universidad Distrital Francisco José de Caldas.
            Transcripción pendiente de completar con el guion textual real del video,
            identificando hablantes y sonidos contextuales relevantes.
          </p>
        </details>
      </div>
    </section>
  );
}
