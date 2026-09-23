"use client";

import { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { ServiceProfile } from "@/navegation/audience_services";
import { audienceDropdownVariants } from "../dropdown-motion";
import styles from "./audience-nav.module.css";

type AudienceButtonProps = {
  profile: ServiceProfile;
};

function ProfileIcon({ label }: { label: string }) {
  const key = label.toLowerCase();
  const common = {
    className: styles.profileIcon,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true as const,
  };

  if (key.includes("aspirante")) {
    // Star / aspiring icon
    return (
      <svg {...common}>
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    );
  }

  if (key.includes("estudiante")) {
    // Book icon
    return (
      <svg {...common}>
        <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
        <path d="M8 7h6M8 11h4" />
      </svg>
    );
  }

  if (key.includes("educador")) {
    // Chalkboard / teaching icon
    return (
      <svg {...common}>
        <path d="M12 20h9" />
        <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
      </svg>
    );
  }

  if (key.includes("administrativo")) {
    // Briefcase icon
    return (
      <svg {...common}>
        <rect width="20" height="14" x="2" y="7" rx="2" ry="2" />
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
      </svg>
    );
  }

  // Fallback
  return (
    <svg {...common}>
      <circle cx="12" cy="12" r="10" />
    </svg>
  );
}

export default function AudienceButton({ profile }: AudienceButtonProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click or scroll (same as main-menu)
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function handleScroll() {
      setOpen(false);
    }
    if (open) {
      document.addEventListener("mousedown", handleClick);
      window.addEventListener("scroll", handleScroll, { passive: true });
    }
    return () => {
      document.removeEventListener("mousedown", handleClick);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [open]);

  const preview = (profile.children ?? []).slice(0, 3);

  return (
    <div
      className={`${styles.audienceButtonWrapper} ${open ? styles.audienceButtonWrapperOpen : ""}`}
      ref={ref}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button className={styles.audienceButton} aria-expanded={open}>
        <ProfileIcon label={profile.label} />
        {profile.label}
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            className={styles.dropdown}
            variants={audienceDropdownVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            style={{ transformOrigin: "top left" }}
          >
          {preview.map((child, i) => (
            <li
              key={child.href}
              className={i % 2 === 0 ? styles.rowGray : styles.rowWhite}
            >
              <a href={child.href}>{child.label}</a>
            </li>
          ))}
          <li
            className={
              preview.length % 2 === 0 ? styles.rowGray : styles.rowWhite
            }
          >
            <a href={profile.href} className={styles.viewAll}>
              Ver todos los servicios &rarr;
            </a>
          </li>
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
