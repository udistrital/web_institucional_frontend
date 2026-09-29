"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Controla la visibilidad del header y de la franja de audience
 * a partir de la dirección del scroll, con histéresis real y
 * actualizaciones encadenadas por requestAnimationFrame.
 *
 * - headerVisible: true al subir o estar cerca del tope; false al bajar.
 * - audienceVisible: solo visible en el tope absoluto.
 */
export function useHideOnScroll(
  hideAfter = 80,
  topEpsilon = 6,
) {
  const [headerVisible, setHeaderVisible] = useState(true);
  const [audienceVisible, setAudienceVisible] = useState(true);

  const lastY = useRef(0);
  const pendingShow = useRef<boolean | null>(null);
  const rafId = useRef<number>(0);

  const flush = useCallback(() => {
    if (pendingShow.current === null) return;
    const show = pendingShow.current;
    pendingShow.current = null;
    setHeaderVisible(show);
  }, []);

  useEffect(() => {
    lastY.current = window.scrollY;

    const onScroll = () => {
      const y = window.scrollY;
      const goingDown = y > lastY.current + 1;
      const goingUp = y < lastY.current - 1;

      // Histéresis: no reacciona a micro-movimientos
      if (goingDown) {
        pendingShow.current = y <= hideAfter;
      } else if (goingUp) {
        pendingShow.current = true;
      } else {
        // En zona muerta: conserva el estado actual
        pendingShow.current = null;
      }

      // Encadenar por RAF para evitar flicker
      cancelAnimationFrame(rafId.current);
      if (pendingShow.current !== null) {
        rafId.current = requestAnimationFrame(flush);
      }

      // Audience solo en el tope
      setAudienceVisible(y <= topEpsilon);
      lastY.current = y;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(rafId.current);
    };
  }, [hideAfter, topEpsilon, flush]);

  return { headerVisible, audienceVisible };
}
