"use client";

import { motion, useReducedMotion } from "framer-motion";
import Brand from "./brand";
import MainMenu from "./main-menu/main-menu";
import { useHideOnScroll } from "./use-hide-on-scroll";

export default function Header() {
  const { headerVisible } = useHideOnScroll();
  const reduceMotion = useReducedMotion();

  return (
    <motion.header
      className="sticky top-0 z-50 flex w-full flex-col bg-white"
      initial={false}
      animate={{ y: headerVisible ? 0 : "-100%" }}
      transition={
        reduceMotion
          ? { duration: 0 }
          : { duration: 0.28, ease: "easeOut" }
      }
    >
      <div className="relative flex w-full items-center justify-between gap-2 border-b border-gray-100 px-4 md:px-6 bg-white">
        <Brand />
        <MainMenu />
      </div>
    </motion.header>
  );
}
