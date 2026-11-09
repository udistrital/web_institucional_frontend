import styles from "./document-card.module.css";

/** Formato del documento. Determina el ícono/badge y el texto por defecto. */
export type DocumentKind = "pdf" | "pptx" | "doc" | "enlace";

type DocumentCardProps = {
  /** Título visible del documento. */
  label: string;
  /** URL del recurso oficial (se abre en una pestaña nueva). */
  href: string;
  /** Formato del documento. Por defecto "pdf". */
  kind?: DocumentKind;
  /** Descripción o considerando oficial opcional. */
  description?: string;
  /**
   * Texto secundario en mayúsculas (p. ej. "Actualizado el …" o el tipo de
   * documento). Si se omite, se usa la etiqueta del formato.
   */
  meta?: string;
  className?: string;
};

const TIPO_LABEL: Record<DocumentKind, string> = {
  pdf: "Documento PDF",
  pptx: "Presentación PowerPoint",
  doc: "Documento Word",
  enlace: "Enlace externo",
};

/** Ícono de enlace externo. */
function ExternalLinkIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15 3h6v6" />
      <path d="M10 14 21 3" />
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    </svg>
  );
}

/** Ícono representativo del formato del documento. */
function DocumentIcon({ kind }: { kind: DocumentKind }) {
  if (kind === "enlace") {
    return <ExternalLinkIcon />;
  }
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
      <path d="M14 3v6h6" />
      {kind === "pdf" ? (
        <path d="M8 13h8M8 17h5" />
      ) : kind === "pptx" ? (
        <path d="M9 13h3a1.5 1.5 0 0 1 0 3H9zM9 13v6" />
      ) : (
        <path d="M8 13h8M8 17h5M8 9h2" />
      )}
    </svg>
  );
}

/**
 * Tarjeta de documento compartida para recursos externos. Toda la tarjeta es
 * un enlace que abre el documento oficial en una pestaña nueva. Unifica la
 * presentación de documentos en organigrama, SIGUD, políticas y normatividad.
 */
export default function DocumentCard({
  label,
  href,
  kind = "pdf",
  description,
  meta,
  className = "",
}: DocumentCardProps) {
  return (
    <a
      className={[styles.card, className].filter(Boolean).join(" ")}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
    >
      <span className={`${styles.icon} ${styles[kind]}`} aria-hidden="true">
        <DocumentIcon kind={kind} />
      </span>
      <span className={styles.body}>
        <span className={styles.label}>{label}</span>
        {description && (
          <span className={styles.description}>{description}</span>
        )}
        <span className={styles.meta}>{meta ?? TIPO_LABEL[kind]}</span>
      </span>
      <span className={styles.arrow} aria-hidden="true">
        <ExternalLinkIcon />
      </span>
    </a>
  );
}
