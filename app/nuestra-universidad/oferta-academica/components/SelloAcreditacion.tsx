import styles from "../page.module.css";

export default function SelloAcreditacion() {
  return (
    <span className={styles.accreditation}>
      <svg
        aria-hidden="true"
        className={styles.medalIcon}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="8" r="5" />
        <path d="m8.5 12-1 9 4.5-2.5 4.5 2.5-1-9" />
        <path d="m10 8 1.3 1.3L14 6.7" />
      </svg>
      <span className={styles.accreditationText}>
        Acreditación de alta calidad CNA
      </span>
    </span>
  );
}
