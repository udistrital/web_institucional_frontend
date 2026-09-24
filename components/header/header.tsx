"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import AudienceNav from "./audience-nav/audience-nav";
import Brand from "./brand";
import MainMenu from "./main-menu/main-menu";
import { useHideOnScroll } from "./use-hide-on-scroll";

export default function Header() {
  const { headerVisible, showAudience } = useHideOnScroll();
  const reduceMotion = useReducedMotion();
  // Mientras la franja está expandida y quieta, el overflow debe ser
  // visible para no recortar sus dropdowns; durante la animación y
  // colapsado se oculta para el efecto de altura.
  const [audienceSettledOpen, setAudienceSettledOpen] = useState(true);

  return (
    <motion.header
      className="sticky top-0 z-50 flex w-full flex-col md:grid md:grid-cols-[1fr_auto] bg-white"
      initial={false}
      animate={{ y: headerVisible ? "0%" : "-100%" }}
      transition={
        reduceMotion
          ? { duration: 0 }
          : { duration: 0.3, ease: "easeOut" }
      }
    >
      <motion.div
        className="col-span-2 row-start-1"
        initial={false}
        animate={{
          height: showAudience ? "auto" : 0,
          opacity: showAudience ? 1 : 0,
        }}
        transition={
          reduceMotion
            ? { duration: 0 }
            : { duration: 0.25, ease: "easeOut" }
        }
        onAnimationComplete={() => setAudienceSettledOpen(showAudience)}
        style={{
          overflow:
            showAudience && audienceSettledOpen ? "visible" : "hidden",
        }}
      >
        <AudienceNav />
      </motion.div>
      <Brand />
      <MainMenu />
    </motion.header>
  );
}
