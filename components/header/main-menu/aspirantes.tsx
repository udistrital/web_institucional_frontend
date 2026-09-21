import Link from "next/link"
import styles from "./mani-menu.module.css"

type AspirantesProps = {
  href?: string
  onClose?: () => void
}

export default function Aspirantes({
  href = "/aspirantes",
  onClose,
}: AspirantesProps) {
  return (
    <div className={styles.menuWrapper}>
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