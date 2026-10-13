"use client";

import { usePathname } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import Brand from "./brand";
import MainMenu from "./main-menu/main-menu";
import { useHideOnScroll } from "./use-hide-on-scroll";

export default function Header() {
  const { headerVisible } = useHideOnScroll();
  const reduceMotion = useReducedMotion();
  return (
    <motion.header
      className="sticky top-0 z-50 flex w-full flex-col bg-white border-b border-gray-100"
      initial={false}
      animate={{ y: headerVisible ? 0 : "-100%" }}
      transition={
        reduceMotion ? { duration: 0 } : { duration: 0.28, ease: "easeOut" }
      }
    >
      <div className="relative flex w-full mx-auto items-center justify-between gap-2 md:gap-4 px-4 md:px-6 bg-white py-2">
        <div className="shrink-0">
          <Brand />
        </div>

        <div className="flex-1 flex justify-end min-w-0">
          <MainMenu />
        </div>
      </div>
    </motion.header>
  );
}
