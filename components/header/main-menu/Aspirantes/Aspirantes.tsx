import Link from "next/link"
import styles from "../main-menu.module.css"
import type { AspirantesProps } from "./Aspirantes.types"

export default function Aspirantes({
  href = "/aspirantes",
  onClose,
  className,
}: AspirantesProps) {
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
          ESTUDIA EN LA UD
      </Link>
    </div>
  )
}
