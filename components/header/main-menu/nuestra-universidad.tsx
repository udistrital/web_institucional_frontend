"use client"

import Link from "next/link"
import { AnimatePresence, motion } from "framer-motion"
import { nuestraUniversidadNavigation} from "./navigation"
import { compactMenuVariants } from "../dropdown-motion"
import styles from "./mani-menu.module.css"
import { Rows, FacultyIcon } from "./icons"

type NuestraUniversidadProps = {
  isOpen: boolean
  onToggle: () => void
  onClose: () => void
  onMouseEnter?: () => void
  onMouseLeave?: () => void
}

export default function NuestraUniversidad({ isOpen, onToggle, onClose, onMouseEnter, onMouseLeave }: NuestraUniversidadProps) {

  return (
    <div className={`${styles.menuWrapper} ${isOpen ? styles.menuWrapperOpen : ""}`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}>
      <button
        type="button"
        aria-expanded={isOpen}
        onClick={onToggle}
        className={styles.menuTrigger}
      >
        NUESTRA UNIVERSIDAD
        <Rows isOpen={isOpen} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className={styles.menuCompact}
            variants={compactMenuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            style={{ transformOrigin: "top right" }}
          >
          <div
            className={styles.menuColumns}
            style={{
              gridTemplateColumns: "repeat(1, minmax(0, 1fr))",
            }}
          >
            {nuestraUniversidadNavigation.children?.map((section, index) => (
              <section
                key={section.href}
                className={index % 2 === 0 ? styles.menuColumnGray : styles.menuColumnWhite}
              >
                <Link
                  href={section.href}
                  onClick={onClose}
                  className={styles.menuSectionLink}
                >
                  {section.label}
                </Link>
              </section>
            ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}