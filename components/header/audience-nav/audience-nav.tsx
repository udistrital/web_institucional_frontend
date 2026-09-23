"use client"

import { useState, useRef, useEffect } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { audienceProfiles, institutionalLinks } from "@/navegation/audience"
import { mainNavigation } from "@/navegation/audience_services"
import { audienceDropdownVariants } from "../dropdown-motion"
import styles from "./audience-nav.module.css"
import AudienceButton from "./audience-button"

export default function AudienceNav() {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    function handleScroll() {
      setOpen(false)
    }
    if (open) document.addEventListener("mousedown", handleClick)
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => {
      document.removeEventListener("mousedown", handleClick)
      window.removeEventListener("scroll", handleScroll)
    }
  }, [open])

  return (
    <nav
      aria-label="Servicios para usuarios"
      className={`${styles.audienceNav} col-span-2 row-start-1`}
    >
      {/* Desktop: original layout */}
      <div className={`${styles.audienceProfiles} hidden md:flex`}>
        {mainNavigation.map((profile) => (
          <AudienceButton key={profile.href} profile={profile} />
        ))}
      </div>

      <div className={`${styles.institutionalLinks} hidden md:flex`}>
        {institutionalLinks.map((link) => (
          <a key={link.href} href={link.href}>
            {link.label}
          </a>
        ))}
      </div>

      {/* Mobile: institutional links + Perfiles dropdown */}
      <div className={`${styles.institutionalLinks} flex md:hidden`}>
        {institutionalLinks.map((link) => (
          <a key={link.href} href={link.href}>
            {link.label}
          </a>
        ))}
      </div>

      <div className="relative flex md:hidden" ref={ref}>
        <button
          className={styles.audienceButton}
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
        >
          Perfiles
          <svg
            aria-hidden="true"
            className={styles.chevronIcon}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </button>

        <AnimatePresence>
          {open && (
            <motion.ul
              className={`${styles.dropdown} ${styles.dropdownRight}`}
              variants={audienceDropdownVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              style={{ transformOrigin: "top right" }}
            >
              {audienceProfiles.map((profile, i) => (
                <li
                  key={profile.href}
                  className={i % 2 === 0 ? styles.rowGray : styles.rowWhite}
                >
                  <a href={profile.href}>{profile.label}</a>
                </li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>
      </div>
    </nav>
  )
}
