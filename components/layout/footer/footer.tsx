import Link from "next/link";
import SocialLinks from "@/components/common/social-links";
import { facultades } from "@/navegation/global";
import styles from "./footer.module.css";

const footerTitleClass = "mb-2 font-bold text-white";
const footerLinkClass =
  "text-sm text-gray-400 transition-colors hover:text-ud-rojo";

export default function Footer() {
  return (
    <footer className="border-t border-gray-800 bg-black pt-16 pb-8">
      <div className="mx-auto max-w-7xl px-4">
        {/* Grid principal */}
        <div className="mb-8 grid grid-cols-1 gap-12 md:grid-cols-4">
          {/* Info institucional */}
          <div className="flex flex-col items-center text-center">
            <img
              src="/logotipos-ud/UDred.svg"
              alt="UDred footer"
              className="mb-4 h-10 w-auto"
            />
            <p className="mb-6 text-sm leading-6 text-gray-400">
              <span>Sede Administrativa (Aduanilla de Paiba)</span>
              <br />
              <span>Carrera 32 No. 12 - 70</span>
              <br />
              <span>Bogotá D.C., Colombia</span>
              <br />
              <span>{"PBX: (+57 601) 323 9300"}</span>
            </p>
            <SocialLinks
              className={styles.socialLinks}
              linkClassName={styles.socialLink}
            />

            <div className={styles.crestSection}>
              <img
                src="/escudos/escudo-ud-white.svg"
                alt="Escudo Universidad Distrital Francisco José de Caldas"
                className="h-45 opacity-80"
              />
            </div>
          </div>

          {/* Links - Nuestra Universidad */}
          <div className="flex flex-col">
            <div className={styles.accordionItem}>
              <input
                type="checkbox"
                id="acc-programas"
                className={styles.accordionToggle}
              />
              <label
                htmlFor="acc-programas"
                className={`${footerTitleClass} ${styles.accordionTitle}`}
              >
                Programas
              </label>
              <ul className={`${styles.linkList} ${styles.accordionContent}`}>
                <li>
                  <Link
                    href="/oferta-academica?nivel=posgrado"
                    className={footerLinkClass}
                  >
                    Posgrado
                  </Link>
                </li>
                <li>
                  <Link
                    href="/oferta-academica?nivel=pregrado"
                    className={footerLinkClass}
                  >
                    Pregrado
                  </Link>
                </li>
                <li>
                  <a href="#" className={footerLinkClass}>
                    Educación contínua
                  </a>
                </li>
              </ul>
            </div>

            {/* Links - Servicios */}
            <div className={styles.accordionItem}>
              <input
                type="checkbox"
                id="acc-facultades"
                className={styles.accordionToggle}
              />
              <label
                htmlFor="acc-facultades"
                className={`${footerTitleClass} ${styles.accordionTitle}`}
              >
                Facultades
              </label>
              <ul className={`${styles.linkList} ${styles.accordionContent}`}>
                {facultades.map((facultad) => (
                  <li key={facultad.nombre}>
                    <Link href={facultad.href} className={footerLinkClass}>
                      {facultad.nombre}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className={styles.subsection}>
              <h4 className={footerTitleClass}>Atención al ciudadano</h4>
              <a href="#" className={footerLinkClass}>
                atencion@udistrital.edu.co
              </a>
            </div>
          </div>

          <div className="flex flex-col">
            <div className={styles.subsectionWithBorder}>
              <h4 className={`${footerTitleClass} ${styles.underlinedTitle}`}>
                Normativa general
              </h4>
            </div>
            <div className={styles.subsectionWithBorder}>
              <h4 className={`${footerTitleClass} ${styles.underlinedTitle}`}>
                Normatividad académica
              </h4>
            </div>
            <div className={styles.accordionItem}>
              <input
                type="checkbox"
                id="acc-sobre"
                className={styles.accordionToggle}
              />
              <label
                htmlFor="acc-sobre"
                className={`${footerTitleClass} ${styles.accordionTitle}`}
              >
                Sobre nosotros
              </label>
              <p
                className={`text-sm leading-6 text-gray-400 ${styles.accordionContent}`}
              >
                Universidad Distrital Francisco José de Caldas NIT.
                899.999.230.7...
              </p>
            </div>
            <div className={styles.subsection}>
              <h4 className={footerTitleClass}>Notificaciones judiciales</h4>
              <a href="#" className={footerLinkClass}>
                notificacionjudicial@udistrital.edu.co
              </a>
            </div>
          </div>
          <div className="flex flex-col">
            <h4 className={footerTitleClass}>Contacto</h4>

            <div className={styles.accordionItem}>
              <input
                type="checkbox"
                id="acc-legal"
                className={styles.accordionToggle}
              />
              <label
                htmlFor="acc-legal"
                className={`${footerTitleClass} ${styles.accordionTitle}`}
              >
                Representante legal
              </label>
              <div
                className={`${styles.contactBlock} ${styles.accordionContent}`}
              >
                <p>Dr. José Andelfo Lizcano Caro</p>
                <a
                  href="mailto:rectoria@udistrital.edu.co"
                  className={footerLinkClass}
                >
                  rectoria@udistrital.edu.co
                </a>
              </div>
            </div>

            <div className={styles.contactBlock}>
              <p>Calle 13 # 31 -75</p>
              <p>Bogotá D.C. - República de Colombia</p>
              <p>Código Postal: 111611 - 111611537</p>
            </div>

            <div className={styles.accordionItem}>
              <input
                type="checkbox"
                id="acc-atencion"
                className={styles.accordionToggle}
              />
              <label
                htmlFor="acc-atencion"
                className={`${footerTitleClass} ${styles.accordionTitle}`}
              >
                Atención a usuarios
              </label>
              <div
                className={`${styles.contactBlock} ${styles.accordionContent}`}
              >
                <p>(+57) 6013238314</p>
                <p>(+57) 6013239300</p>
                <p className="font-semibold text-white">
                  Lunes a viernes de 8:00 a.m. a 5:00 p.m.
                </p>
              </div>
            </div>

            <a href="#" className={styles.footerTitleLink}>
              Directorio institucional
            </a>
          </div>
        </div>

        {/* Aliados / Cobranding */}
        <div className={styles.alliesSection}>
          <span className="mb-4 text-sm text-gray-500">
            Con el apoyo de / Entidades Aliadas:
          </span>
          <div className={styles.alliesGroups}>
            <div className={styles.alliesRow}>
              {[1, 2, 3, 4, 5, 6].map((number) => (
                <img
                  key={number}
                  src={`/aliados/aliado${number}.svg`}
                  alt={`Entidad aliada ${number}`}
                  className="h-10 w-auto"
                />
              ))}
            </div>
            <div className={styles.alliesRow}>
              {[7, 8, 9, 10, 11].map((number) => (
                <img
                  key={number}
                  src={`/aliados/aliado${number}.svg`}
                  alt={`Entidad aliada ${number}`}
                  className="h-10 w-auto"
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Copyright y links legales - full width */}
      <div className={styles.copyright}>
        <p>&copy; 2026 Universidad Distrital Francisco José de Caldas.</p>
        <div className={styles.legalLinks}>
          <a href="#" className={styles.legalLink}>
            Ingreso publicadores
          </a>
          <a href="#" className={styles.legalLink}>
            SDQR
          </a>
          <a href="#" className={styles.legalLink}>
            Contactenos
          </a>
          <a href="#" className={styles.legalLink}>
            Politicas de privacidad
          </a>
          <a href="#" className={styles.legalLink}>
            Mapa de sitio
          </a>
        </div>
      </div>
    </footer>
  );
}
