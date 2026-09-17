"use client"

import Link from "next/link"
import { ofertaAcademicaNavigation } from "./navigation"
import styles from "./mani-menu.module.css"
import { Rows, FacultyIcon } from "./icons"

type OfertaAcademicaProps = {
  isOpen: boolean
  onToggle: () => void
  onClose: () => void
}

export default function OfertaAcademica({ isOpen, onToggle, onClose }: OfertaAcademicaProps) {

  return (
    <div className={styles.menuWrapper}>
      <button
        type="button"
        aria-expanded={isOpen}
        onClick={onToggle}
        className={styles.menuTrigger}
      >
        OFERTA ACADEMICA
        <Rows isOpen={isOpen} />
      </button>

      {isOpen && (
        <div className={styles.menuFullWidth}>
          <div
            className={styles.menuColumns}
            style={{
              gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
            }}
          >
            {ofertaAcademicaNavigation.children?.map((section, index) => (
              <section
                key={section.href}
                className={index % 2 === 0 ? styles.menuColumnGray : styles.menuColumnWhite}
              >
                <Link
                  href={section.href}
                  onClick={onClose}
                  className={styles.menuSectionLink}
                >
                  <FacultyIcon label={section.label} />
                  {section.label}
                </Link>

                {section.children?.length ? (
                  <ul className={styles.menuChildList}>
                    {section.children.map((child) => (
                      <li key={`${section.href}-${child.href}`}>
                        <Link
                          href={child.href}
                          onClick={onClose}
                          className={styles.menuItemLink}
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
            href={ofertaAcademicaNavigation.href}
            onClick={onClose}
            className={styles.menuFeaturedLink}
          >
            Conoce todos los programas
          </Link>
        </div>
      )}
    </div>
  )
}
