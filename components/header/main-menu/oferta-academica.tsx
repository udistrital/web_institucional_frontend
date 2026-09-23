"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ofertaAcademicaNavigation } from "./navigation";
import { fullWidthMenuVariants } from "../dropdown-motion";
import styles from "./mani-menu.module.css";
import { Rows, FacultyIcon } from "./icons";

type OfertaAcademicaProps = {
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
};

export default function OfertaAcademica({
  isOpen,
  onToggle,
  onClose,
  onMouseEnter,
  onMouseLeave,
}: OfertaAcademicaProps) {
  return (
    <div
      className={`${styles.menuWrapper} ${isOpen ? styles.menuWrapperOpen : ""}`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <button
        type="button"
        aria-expanded={isOpen}
        onClick={onToggle}
        className={styles.menuTrigger}
      >
        OFERTA ACADEMICA
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
              gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
            }}
          >
            {ofertaAcademicaNavigation.children?.map((section, index) => (
              <section
                key={section.href}
                className={
                  index % 2 === 0
                    ? styles.menuColumnGray
                    : styles.menuColumnWhite
                }
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
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
