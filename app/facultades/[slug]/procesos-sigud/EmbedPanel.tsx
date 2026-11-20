"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./page.module.css";

interface EmbedPanelProps {
  id: string;
  title: string;
  url: string;
  embeddable: boolean;
}

export default function EmbedPanel({
  id,
  title,
  url,
  embeddable,
}: EmbedPanelProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isVisible) {
            setIsVisible(true);
            setIsLoading(true);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, [isVisible]);

  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  return (
    <div ref={containerRef} className={styles.embedContainer}>
      {!isVisible ? (
        <div />
      ) : isLoading ? (
        <div className={styles.loadingIndicator} />
      ) : embeddable ? (
        <>
          <iframe
            className={styles.iframe}
            src={url}
            title={title}
            referrerPolicy="no-referrer-when-downgrade"
            sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
            onLoad={handleIframeLoad}
          />
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.openInNewTab}
          >
            Abrir en una pestaña nueva
          </a>
        </>
      ) : (
        <>
          <div className={styles.fallbackCard}>
            <h3>{title}</h3>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.fallbackButton}
            >
              Abrir en una pestaña nueva
            </a>
          </div>
        </>
      )}
    </div>
  );
}
