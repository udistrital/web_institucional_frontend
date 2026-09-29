"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import AudienceNav from "./audience-nav/audience-nav";
import Brand from "./brand";
import MainMenu from "./main-menu/main-menu";
import { useHideOnScroll } from "./use-hide-on-scroll";
import styles from "./header.module.css";

export default function Header() {
  const { headerVisible, audienceVisible } = useHideOnScroll();
  const reduceMotion = useReducedMotion();

  const headerRef = useRef<HTMLDivElement>(null);
  const [headerHeight, setHeaderHeight] = useState(0);

  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;

    setHeaderHeight(el.getBoundingClientRect().height);

    const ro = new ResizeObserver(([entry]) => {
      setHeaderHeight(entry.contentRect.height);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [audienceVisible]);

  return (
    <motion.header
      ref={headerRef}
      className="sticky top-0 z-50 flex w-full flex-col md:grid md:grid-cols-[1fr_auto] bg-white"
      initial={false}
      animate={{ y: headerVisible ? 0 : -headerHeight }}
      transition={
        reduceMotion
          ? { duration: 0 }
          : { duration: 0.28, ease: "easeOut" }
      }
    >
      <div className={`col-span-2 row-start-1 ${styles.audienceRow} ${audienceVisible ? styles.audienceRowOpen : ""}`}>
        <AudienceNav />
      </div>
      <Brand />
      <MainMenu />
    </motion.header>
  );
}
