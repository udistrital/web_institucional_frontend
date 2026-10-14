import Link from "next/link"
import styles from "../main-menu.module.css"

type AnvestigacionProps = {
  href?: string
  onClose?: () => void
}

export default function Internacionalizacion({
  href = "/internacionalizacion",
  onClose,
}: AnvestigacionProps) {
  return (
    <div className={styles.menuWrapper}>
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