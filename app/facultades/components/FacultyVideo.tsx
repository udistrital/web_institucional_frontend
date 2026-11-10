"use client";

import { useReducedMotion } from "framer-motion";
import { useEffect, useRef } from "react";
import styles from "./faculty-highlights.module.css";

/** Video institucional decorativo (temporalmente el mismo del home). */
export default function FacultyVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const video = videoRef.current;
    // Con "reducir movimiento" no hay reproducción automática: queda el póster.
    if (!video || reduceMotion) return;

    // Reproduce el video solo cuando el bloque está visible; lo pausa al salir.
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
    return () => {
      observer.disconnect();
      video.pause();
    };
  }, [reduceMotion]);

  return (
    <div className={styles.media}>
      <video
        ref={videoRef}
        aria-hidden="true"
        className={styles.video}
        loop
        muted
        playsInline
        poster="/image/hero.jpeg"
        preload="metadata"
        tabIndex={-1}
      >
        <source src="/video/Udistrital.mp4" type="video/mp4" />
      </video>
    </div>
  );
}
