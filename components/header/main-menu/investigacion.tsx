import Link from "next/link"
import styles from "./mani-menu.module.css"

type AnvestigacionProps = {
  href?: string
  onClose?: () => void
}

export default function Investigacion({
  href = "/investigacion",
  onClose,
}: AnvestigacionProps) {
  return (
    <div className={styles.menuWrapper}>
      <Link
        href={href}
        onClick={onClose}
        className={styles.menuTrigger}
      >
        INVESTIGACION
      </Link>
    </div>
  )
}