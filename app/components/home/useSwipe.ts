"use client";

import { useRef } from "react";
import type { TouchEvent } from "react";

/**
 * Detecta gestos de deslizamiento horizontal (swipe) en dispositivos táctiles.
 * Llama a onSwipe(1) al deslizar hacia la izquierda (siguiente) y onSwipe(-1)
 * al deslizar hacia la derecha (anterior).
 */
export function useSwipe(onSwipe: (direction: number) => void, threshold = 40) {
  const startX = useRef<number | null>(null);

  const onTouchStart = (event: TouchEvent) => {
    startX.current = event.touches[0].clientX;
  };

  const onTouchEnd = (event: TouchEvent) => {
    if (startX.current === null) return;
    const deltaX = event.changedTouches[0].clientX - startX.current;
    startX.current = null;
    if (Math.abs(deltaX) < threshold) return;
    onSwipe(deltaX < 0 ? 1 : -1);
  };

  return { onTouchStart, onTouchEnd };
}
