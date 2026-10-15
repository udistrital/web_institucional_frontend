"use client";

import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { useEffect, useRef, useState, type ReactNode } from "react";

interface FooterRevealProps {
  children: ReactNode;
  footer: ReactNode;
}

export default function FooterReveal({ children, footer }: FooterRevealProps) {
  const footerRef = useRef<HTMLDivElement>(null);
  const [footerHeight, setFooterHeight] = useState(0);
  const [viewportHeight, setViewportHeight] = useState(0);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const parallaxY = useTransform(scrollYProgress, [0.85, 1], [32, 0]);

  useEffect(() => {
    const footerElement = footerRef.current;

    if (!footerElement) return;

    const updateViewportHeight = () => setViewportHeight(window.innerHeight);
    const observer = new ResizeObserver(([entry]) => {
      setFooterHeight(entry.contentRect.height);
    });

    updateViewportHeight();
    observer.observe(footerElement);
    window.addEventListener("resize", updateViewportHeight);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateViewportHeight);
    };
  }, []);

  const curtainMode = footerHeight > 0 && footerHeight < viewportHeight;

  return (
    <>
      <div className="relative z-10 bg-white">{children}</div>

      <div
        aria-hidden="true"
        style={{ height: curtainMode ? footerHeight : 0 }}
      />

      <motion.div
        ref={footerRef}
        className={
          curtainMode ? "fixed inset-x-0 bottom-0 z-0" : "relative z-0"
        }
        style={curtainMode && !reduceMotion ? { y: parallaxY } : undefined}
      >
        {footer}
      </motion.div>
    </>
  );
}
