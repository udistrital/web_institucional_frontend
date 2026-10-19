"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useAnimationControls, useReducedMotion } from "framer-motion";
import AudienceNav from "./audience-nav/audience-nav";
import Header from "./header";

export default function HeaderContainer() {
  const containerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const floatingRef = useRef(false);
  const isHidingRef = useRef(false);
  const animationTokenRef = useRef(0);
  const animationFrameRef = useRef<number | null>(null);
  const [height, setHeight] = useState(0);
  const [floating, setFloating] = useState(false);
  const controls = useAnimationControls();
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;

    const measure = () => {
      const nextHeight = el.offsetHeight;
      setHeight((current) => (current === nextHeight ? current : nextHeight));
    };
    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let lastY = window.scrollY;

    const onScroll = () => {
      const y = window.scrollY;
      const goingUp = y < lastY - 1;
      const goingDown = y > lastY + 1;
      const container = containerRef.current;

      if (container && floatingRef.current) {
        const originalHeaderHasReturned = container.getBoundingClientRect().top >= 0;

        if (goingUp && originalHeaderHasReturned) {
          if (animationFrameRef.current !== null) {
            cancelAnimationFrame(animationFrameRef.current);
            animationFrameRef.current = null;
          }
          animationTokenRef.current += 1;
          isHidingRef.current = false;
          controls.set({ y: 0 });
          floatingRef.current = false;
          setFloating(false);
        } else if (goingDown && !isHidingRef.current) {
          if (animationFrameRef.current !== null) {
            cancelAnimationFrame(animationFrameRef.current);
            animationFrameRef.current = null;
          }
          isHidingRef.current = true;
          const token = ++animationTokenRef.current;

          void controls
            .start({
              y: "-100%",
              transition: reduceMotion
                ? { duration: 0 }
                : { type: "tween", duration: 0.22, ease: "easeIn" },
            })
            .then(() => {
              if (
                token !== animationTokenRef.current ||
                !isHidingRef.current ||
                !floatingRef.current
              ) {
                return;
              }

              controls.set({ y: 0 });
              isHidingRef.current = false;
              floatingRef.current = false;
              setFloating(false);
            });
        } else if (goingUp && isHidingRef.current) {
          animationTokenRef.current += 1;
          isHidingRef.current = false;
          void controls.start({
            y: 0,
            transition: reduceMotion
              ? { duration: 0 }
              : { type: "spring", stiffness: 300, damping: 30 },
          });
        }
      } else if (
        container &&
        goingUp &&
        container.getBoundingClientRect().bottom <= 0
      ) {
        // Solo se fija al subir y cuando el header normal ya salió por completo.
        controls.set({ y: "-100%" });
        floatingRef.current = true;
        setFloating(true);
        animationFrameRef.current = requestAnimationFrame(() => {
          animationFrameRef.current = null;
          void controls.start({
            y: 0,
            transition: reduceMotion
              ? { duration: 0 }
              : { type: "spring", stiffness: 300, damping: 30 },
          });
        });
      }

      lastY = y;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      animationTokenRef.current += 1;
    };
  }, [controls, reduceMotion]);

  return (
    <div
      ref={containerRef}
      className="relative w-full"
      style={{ height: floating ? height : undefined }}
    >
      <motion.div
        ref={headerRef}
        className="w-full"
        style={
          floating
            ? { position: "fixed", top: 0, left: 0, right: 0, zIndex: 60 }
            : { position: "relative" }
        }
        initial={false}
        animate={controls}
      >
        <AudienceNav />
        <Header />
      </motion.div>
    </div>
  );
}
