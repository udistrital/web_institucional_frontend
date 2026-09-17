import styles from "./mani-menu.module.css"

type RowsProps = {
  isOpen: boolean
}

export function Rows({ isOpen }: RowsProps) {
  return (
    <svg
      aria-hidden="true"
      className={isOpen ? styles.menuChevronOpen : styles.menuChevron}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  )
}

type FacultyIconProps = {
  label: string
}

export function FacultyIcon({ label }: FacultyIconProps) {
  const normalizedLabel = label.toLocaleLowerCase()
  const isArt = /artes/.test(normalizedLabel)
  const isHealth = /salud/.test(normalizedLabel)
  const isEducation = /educacion|educación/.test(normalizedLabel)
  const isScience = /matematicas|matemáticas|naturales/.test(normalizedLabel)
  const isEnvironment = /medio ambiente/.test(normalizedLabel)

  return (
    <svg
      aria-hidden="true"
      className="h-5 w-5 shrink-0"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {isArt ? (
        <>
          <path d="m14 4 6 6" />
          <path d="m13 5 6 6-7 7-6 1 1-6z" />
          <path d="M5 19c-1.5 1-2.5 1-3 0 0-1 1-2 3-3" />
        </>
      ) : isHealth ? (
        <path d="M20.8 8.7c0 5.3-8.8 10.3-8.8 10.3S3.2 14 3.2 8.7A4.7 4.7 0 0 1 12 6.1a4.7 4.7 0 0 1 8.8 2.6Z" />
      ) : isEducation ? (
        <>
          <path d="m3 9 9-5 9 5-9 5z" />
          <path d="M7 11.5v4c2.8 2 7.2 2 10 0v-4M21 9v6" />
        </>
      ) : isScience ? (
        <>
          <path d="M9 3v6l-4 8a2 2 0 0 0 2 3h10a2 2 0 0 0 2-3l-4-8V3" />
          <path d="M7 13h10M8 3h6" />
        </>
      ) : isEnvironment ? (
        <>
          <path d="M12 17v4M9 21h6" />
          <path d="M12 17c-4 0-6-2-6-5 0-2 1-4 3-5 0-2 1-4 3-5 2 1 3 3 3 5 2 1 3 3 3 5 0 3-2 5-6 5Z" />
        </>
      ) : (
        <>
          <circle cx="12" cy="12" r="3" />
          <path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9 7 7M17 17l2.1 2.1M19.1 4.9 17 7M7 17l-2.1 2.1" />
        </>
      )}
    </svg>
  )
}
