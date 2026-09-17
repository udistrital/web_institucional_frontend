"use client"

import Link from "next/link"
import { nuestraUniversidadNavigation} from "./navigation"
import styles from "./mani-menu.module.css"
import { Rows, FacultyIcon } from "./icons"

type NuestraUniversidadProps = {
  isOpen: boolean
  onToggle: () => void
  onClose: () => void
}

export default function NuestraUniversidad({ isOpen, onToggle, onClose }: NuestraUniversidadProps) {

  return (
    <div className={styles.menuWrapper}>
      <button
        type="button"
        aria-expanded={isOpen}
        onClick={onToggle}
        className={styles.menuTrigger}
      >
        NUESTRA UNIVERSIDAD
        <Rows isOpen={isOpen} />
      </button>

      {isOpen && (
        <div className={styles.menuCompact}>
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
        </div>
      )}
    </div>
  )
}