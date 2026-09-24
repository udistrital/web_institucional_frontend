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
              Sede Administrativa (Aduanilla de Paiba)
              <br />
              Carrera 32 No. 12 - 70
              <br />
              Bogotá D.C., Colombia
              <br />
              PBX: (+57 601) 323 9300
            </p>
            <div className={styles.socialLinks}>
              <a href="#" className={styles.socialLink} aria-label="Facebook">
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                </svg>
              </a>
              <a
                href="#"
                className={styles.socialLink}
                aria-label="X (Twitter)"
              >
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a href="#" className={styles.socialLink} aria-label="Instagram">
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
              </a>
              <a href="#" className={styles.socialLink} aria-label="YouTube">
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
            </div>

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
                  <a href="#" className={footerLinkClass}>
                    Posgrado
                  </a>
                </li>
                <li>
                  <a href="#" className={footerLinkClass}>
                    Pregrado
                  </a>
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
                    <a href={facultad.href} className={footerLinkClass}>
                      {facultad.nombre}
                    </a>
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
