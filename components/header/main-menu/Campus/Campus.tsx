"use client"

import Link from "next/link"
import { AnimatePresence, motion } from "framer-motion"
import { campusNavigation } from "../navigation"
import { fullWidthMenuVariants } from "../../dropdown-motion"
import styles from "../main-menu.module.css"
import { Rows } from "../icons"
import MenuIcon from "../menu-icon"
import type { CampusProps } from "./Campus.types"

export default function Campus({ isOpen, onToggle, onClose, onMouseEnter, onMouseLeave, className }: CampusProps) {
  const trimmedClassName = className?.trim()
  const rootClassName = `${styles.menuWrapper} ${isOpen ? styles.menuWrapperOpen : ""}${
    trimmedClassName ? ` ${trimmedClassName}` : ""
  }`

  return (
    <div className={rootClassName}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}>
      <button
        type="button"
        aria-expanded={isOpen}
        onClick={onToggle}
        className={styles.menuTrigger}
      >
        CAMPUS
        <Rows isOpen={isOpen} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className={styles.menuFullWidth}
            variants={fullWidthMenuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            style={{ transformOrigin: "top center" }}
          >
          <div
            className={styles.menuColumns}
            style={{
              gridTemplateColumns: `repeat(${campusNavigation.children?.length ?? 1}, minmax(0, 1fr))`,
            }}
          >
            {campusNavigation.children?.map((section, index) => (
              <section
                key={section.href}
                className={index % 2 === 0 ? styles.menuColumnGray : styles.menuColumnWhite}
              >
                <Link
                  href={section.href}
                  onClick={onClose}
                  className={styles.menuSectionLink}
                >
                  <MenuIcon label={section.label} />
                  {section.label}
                </Link>

                {section.children?.length ? (
                  <ul className={styles.menuChildList}>
                    {section.children.map((child) => (
                      <li key={child.href}>
                        <Link
                          href={child.href}
                          onClick={onClose}
                          className={`${styles.menuItemLink}`}
                        >
                          {child.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </section>
            ))}
          </div>
                    <Link
            href={campusNavigation.href}
            onClick={onClose}
            className={styles.menuFeaturedLink}
          >
            Campus virtual
          </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
