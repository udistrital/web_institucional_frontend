import Link from "next/link"
import styles from "../main-menu.module.css"
import type { InternacionalizacionProps } from "./Internacionalizacion.types"

export default function Internacionalizacion({
  href = "/internacionalizacion",
  onClose,
  className,
}: InternacionalizacionProps) {
  const trimmedClassName = className?.trim()
  const rootClassName = trimmedClassName
    ? `${styles.menuWrapper} ${trimmedClassName}`
    : styles.menuWrapper

  return (
    <div className={rootClassName}>
      <Link
        href={href}
        onClick={onClose}
        className={styles.menuTrigger}
      >
        INTERNACIONZALIZACIÓN
      </Link>
    </div>
  )
}
