import Image from "next/image";
import type { Faculty } from "@/services/facultades";
import type { ProgramaAcademico } from "@/services/oferta-academica";
import DetalleProgramaModal from "./DetalleProgramaModal";
import SelloAcreditacion from "./SelloAcreditacion";
import styles from "../page.module.css";

function Dato({ etiqueta, valor }: { etiqueta: string; valor: string | null }) {
  if (!valor) return null;
  return (
    <div className={styles.programDetail}>
      <dt>{etiqueta}</dt>
      <dd>{valor}</dd>
    </div>
  );
}

export default function FichaPrograma({
  programa,
  facultadImagen,
}: {
  programa: ProgramaAcademico;
  facultadImagen: Faculty | null;
}) {
  const imagenUrl = programa.imagenUrl ?? facultadImagen?.imageUrl ?? null;
  const imagenAlt = programa.imagenUrl
    ? programa.imagenAlt
    : facultadImagen?.imageAlt ?? programa.nombre;

  return (
    <article className={styles.programCard}>
      <div className={styles.programMedia}>
        {imagenUrl ? (
          <Image
            alt={imagenAlt}
            fill
            sizes="(max-width: 760px) 100vw, 280px"
            src={imagenUrl}
          />
        ) : (
          <div
            aria-label="Imagen no disponible"
            className={styles.programImageFallback}
            role="img"
          >
            <span aria-hidden="true">UD</span>
          </div>
        )}
      </div>

      <div className={styles.programContent}>
        <div className={styles.programHeading}>
          <div>
            <div className={styles.titleLine}>
              <h3>{programa.nombre}</h3>
              {programa.snies !== null && (
                <span className={styles.snies}>SNIES {programa.snies}</span>
              )}
            </div>
          </div>
          {programa.acreditacionAltaCalidad && <SelloAcreditacion />}
        </div>

        <dl className={styles.programSummary}>
          <Dato etiqueta="Nivel de formación" valor={programa.nivel} />
          <Dato etiqueta="Modalidad" valor={programa.modalidad} />
          <Dato etiqueta="Jornada" valor={programa.jornada} />
        </dl>

        {(programa.correo || programa.telefono) && (
          <div className={styles.programContact}>
            <span className={styles.contactLabel}>Contacto</span>
            <div className={styles.contactLinks}>
              {programa.telefono && (
                <a href={`tel:${programa.telefono.replace(/[^\d+]/g, "")}`}>
                  {programa.telefono}
                </a>
              )}
              {programa.correo && (
                <a href={`mailto:${programa.correo}`}>{programa.correo}</a>
              )}
            </div>
          </div>
        )}

        <div className={styles.programActions}>
          <DetalleProgramaModal
            imagenAlt={imagenAlt}
            imagenUrl={imagenUrl}
            programa={programa}
          />
          {programa.paginaProgramaUrl && (
            <a className={styles.moreButton} href={programa.paginaProgramaUrl}>
              Conocer más
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
