"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Header en dos etapas:
 * - headerVisible: false al bajar más allá de `hideAfter`, true al subir.
 * - showAudience: true solo cerca del tope (`y <= topEpsilon`).
 * La tolerancia `delta` evita parpadeos con micro-scrolls.
 */
export function useHideOnScroll(
  hideAfter = 120,
  topEpsilon = 8,
  delta = 5,
) {
  const [headerVisible, setHeaderVisible] = useState(true);
  const [showAudience, setShowAudience] = useState(true);
  const lastY = useRef(0);

  useEffect(() => {
    lastY.current = window.scrollY;

    const onScroll = () => {
      const y = window.scrollY;
      const last = lastY.current;

      if (y < hideAfter || y < last - delta) {
        setHeaderVisible(true);
      } else if (y > hideAfter && y > last + delta) {
        setHeaderVisible(false);
      }

      setShowAudience(y <= topEpsilon);
      lastY.current = y;
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [hideAfter, topEpsilon, delta]);

  return { headerVisible, showAudience };
}
