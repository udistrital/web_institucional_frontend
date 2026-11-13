import SocialLinks from "@/components/common/social-links";
import { getMapUrl } from "@/lib/maps";
import type { Faculty } from "@/services/facultades";
import FacultyContactDetails from "./FacultyContactDetails";
import styles from "./faculty-contact.module.css";

type FacultyContactProps = {
  attributes: Faculty["attributes"];
  title: string;
};

export default function FacultyContact({ attributes, title }: FacultyContactProps) {
  const mapUrl = getMapUrl(attributes.field_direccion);

  return (
    <section aria-labelledby="facultad-contacto" className={styles.contact}>
      <div className={`${styles.inner} ${mapUrl ? "" : styles.noMap}`}>
        <div className={styles.column}>
          <h2 className={styles.title} id="facultad-contacto">
            Contacto
          </h2>
          <FacultyContactDetails
            attributes={attributes}
            className={styles.details}
          />
        </div>

        {mapUrl && (
          <div className={styles.column}>
            <h3 className={styles.subtitle}>Ubicación</h3>
            <iframe
              className={styles.map}
              src={mapUrl}
              title={`Mapa de ubicación de ${title || "la facultad"}`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        )}

        <div className={styles.column}>
          <h3 className={styles.subtitle}>Redes sociales</h3>
          <SocialLinks
            className={styles.socialLinks}
            linkClassName={styles.socialLink}
          />
        </div>
      </div>
    </section>
  );
}
