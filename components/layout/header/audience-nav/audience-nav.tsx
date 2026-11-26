"use client"

import { useState, useRef, useEffect } from "react"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"

import { mainNavigation } from "@/navegation/audience_services"

import { ProfileIconGlyph } from "@/components/common/tarjet/profile-icons"
import { audienceDropdownVariants } from "../dropdown-motion"
import styles from "./audience-nav.module.css"

/**
 * Barra institucional superior. Cumple la Resolución MinTIC 1519 de 2020
 * (Anexo 2, Cap. 2.1 "Barra GOV.CO"): publica al inicio de la página el
 * vínculo al portal único del Estado (https://www.gov.co) y da acceso visible
 * a Transparencia, Atención a la Ciudadanía y Participa.
 *
 * Los perfiles se agrupan en un botón desplegable con patrón maestro–detalle:
 * al abrir se ve solo el listado de roles y, al seleccionar uno, su panel de
 * servicios aparece con una animación. Así solo se muestra un bloque de
 * información a la vez y el menú se mantiene limpio e intuitivo.
 */

// Opciones exigidas por GOV.CO (Gobierno en Línea). Se muestra una etiqueta
// corta para no saturar la barra; el nombre oficial completo se conserva en
// `fullLabel` para lectores de pantalla y como tooltip (title).
const govcoLinks = [
  {
    label: "Transparencia",
    fullLabel: "Transparencia y Acceso a la Información Pública",
    href: "/transparencia",
    icon: "transparencia" as const,
  },
  {
    label: "Atención",
    fullLabel: "Atención y Servicios a la Ciudadanía",
    href: "/atencion-al-ciudadano",
    icon: "atencion" as const,
  },
  {
    label: "Participa",
    fullLabel: "Participa",
    href: "/participa",
    icon: "participa" as const,
  },
]

type GovIconName = "transparencia" | "atencion" | "participa"

/**
 * Iconos alusivos a cada opción GOV (solo visibles en el dropdown móvil):
 * - transparencia: lupa sobre documento (acceso a la información).
 * - atencion: auricular de soporte (atención a la ciudadanía).
 * - participa: manos/personas (participación ciudadana).
 */
function GovIcon({ name }: { name: GovIconName }) {
  const common = {
    "aria-hidden": true as const,
    className: styles.govLinkIcon,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  }

  if (name === "transparencia") {
    return (
      <svg {...common}>
        <path d="M14 3v4a1 1 0 0 0 1 1h4" />
        <path d="M15 3H6a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8Z" />
        <circle cx="11.5" cy="13.5" r="2.5" />
        <path d="m15 17-1.6-1.6" />
      </svg>
    )
  }

  if (name === "atencion") {
    return (
      <svg {...common}>
        <path d="M3 12a9 9 0 0 1 18 0" />
        <path d="M21 16a2 2 0 0 1-2 2h-1v-6h1a2 2 0 0 1 2 2Z" />
        <path d="M3 16a2 2 0 0 0 2 2h1v-6H5a2 2 0 0 0-2 2Z" />
        <path d="M19 18a4 4 0 0 1-4 3h-1" />
      </svg>
    )
  }

  // participa: bocadillos de diálogo (voz / opinión ciudadana).
  return (
    <svg {...common}>
      <path d="M8 13a1 1 0 0 1-1 1H6l-2 2v-3a2 2 0 0 1-1-1.7V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1" />
      <path d="M11 9h7a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-2l-2 2v-2h-1a2 2 0 0 1-2-2Z" />
    </svg>
  )
}

// Encuesta de satisfacción ciudadana (canal virtual, medición de servicio).
const surveyLabel = "Encuesta de satisfacción y experiencia ciudadana"
const surveyUrl =
  "https://medicionservicio.alcaldiabogota.gov.co/f/USSPUKyo7g5wBR0wgofvcPUsfZXIb9Z?st=WqD7yoLZRrFBIVrIjJaL95jMmWPN!t1B3tvPJdy0Jfi180wSRZcyhSpGKp8eRLdU&d[/data/mod1/gp0/p0]=2&d[/data/mod1/gp0/p00]=7&d[/data/mod1/gp1/p3]=4&d[/data/mod1/gp1/p4]=70&d[/data/mod1/gp1/p01]=&d[/data/mod1/gp1/c5]=19"

// Roles mostrados en el menú de perfiles (se excluye "Visitantes").
const profiles = mainNavigation.filter(
  (profile) => profile.label.toLowerCase() !== "visitantes",
)

/**
 * Icono alusivo a cada servicio. Placeholder genérico (un enlace/acceso)
 * mientras no exista una imagen propia por servicio en los datos.
 */
function ServiceIcon() {
  return (
    <svg
      aria-hidden="true"
      className={styles.quickIcon}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  )
}

export default function AudienceNav() {
  const [open, setOpen] = useState(false)
  // activeHref vacío = aún no se eligió un rol (el panel muestra solo perfiles).
  const [activeHref, setActiveHref] = useState<string>("")
  // En móvil el panel funciona como navegación por pasos (drill-down): el
  // detalle reemplaza la lista de roles en vez de animar su ancho.
  const [isMobile, setIsMobile] = useState(false)
  // Menú GOV móvil (icono que despliega enlaces GOV + encuesta).
  const [govOpen, setGovOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const govRef = useRef<HTMLDivElement>(null)
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 992px)")
    const apply = () => setIsMobile(mq.matches)
    apply()
    mq.addEventListener("change", apply)
    return () => mq.removeEventListener("change", apply)
  }, [])

  // Cierre del menú GOV móvil: click fuera y scroll.
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (govRef.current && !govRef.current.contains(e.target as Node)) {
        setGovOpen(false)
      }
    }
    function handleScroll() {
      setGovOpen(false)
    }
    if (govOpen) document.addEventListener("mousedown", handleClick)
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => {
      document.removeEventListener("mousedown", handleClick)
      window.removeEventListener("scroll", handleScroll)
    }
  }, [govOpen])

  const activeProfile = profiles.find((profile) => profile.href === activeHref)
  // Servicios del rol activo ordenados alfabéticamente (sin mutar los datos
  // originales); locale "es" para acentos y mayúsculas sin distinción.
  const activeChildren = [...(activeProfile?.children ?? [])].sort((a, b) =>
    a.label.localeCompare(b.label, "es", { sensitivity: "base" }),
  )

  // Al abrir, parte sin rol seleccionado (solo la lista de perfiles).
  function toggleOpen() {
    setOpen((prev) => {
      const next = !prev
      if (next) {
        setActiveHref("")
        // Avisa al menú principal para que se cierre si estaba abierto.
        window.dispatchEvent(
          new CustomEvent("header:menu-open", { detail: "audience" }),
        )
      }
      return next
    })
  }

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    function handleScroll() {
      setOpen(false)
    }
    // Cierra Perfiles cuando otro menú del header (p. ej. el principal) se abre.
    function handleOtherMenu(e: Event) {
      const which = (e as CustomEvent<string>).detail
      if (which !== "audience") setOpen(false)
    }
    if (open) document.addEventListener("mousedown", handleClick)
    window.addEventListener("scroll", handleScroll, { passive: true })
    window.addEventListener("header:menu-open", handleOtherMenu)
    return () => {
      document.removeEventListener("mousedown", handleClick)
      window.removeEventListener("scroll", handleScroll)
      window.removeEventListener("header:menu-open", handleOtherMenu)
    }
  }, [open])

  return (
    <nav aria-label="Barra GOV.CO" className={styles.audienceNav}>
      {/* Vínculo obligatorio al portal único del Estado colombiano. */}
      {/* Izquierda: logo GOV.CO + opciones de Gobierno en Línea (prueba de
          visualización con los enlaces junto al logo). */}
      <div className={styles.brandGroup} ref={govRef}>
        <a
          className={styles.logoLink}
          href="https://www.gov.co"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Ir al portal del Estado colombiano GOV.CO (se abre en una nueva pestaña)"
        >
          <img
            className={styles.logo}
            src="/logos/govLogo.png"
            alt="GOV.CO"
            width={150}
            height={40}
          />
        </a>

        {/* Botón + cluster envueltos para que, en móvil, el dropdown se ancle
            justo debajo del icono (y no al borde de la barra). */}
        <div className={styles.govMenuWrapper}>
          {/* Botón que despliega las opciones GOV (solo móvil, a la derecha del
              logo). Icono institucional para distinguirlo del menú principal
              (que usa hamburguesa). En escritorio se oculta. */}
          <button
            type="button"
            className={styles.govMenuButton}
            onClick={() => setGovOpen((v) => !v)}
            aria-expanded={govOpen}
            aria-haspopup="true"
            aria-label="Opciones de Gobierno en Línea"
          >
            <svg
              aria-hidden="true"
              className={styles.govMenuIcon}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 21h18" />
              <path d="M4 10h16" />
              <path d="M5 10V6l7-3 7 3v4" />
              <path d="M6 10v11" />
              <path d="M10 10v11" />
              <path d="M14 10v11" />
              <path d="M18 10v11" />
            </svg>
          </button>

          {/* Cluster de opciones GOV + encuesta. En escritorio: en línea. En
              móvil: dropdown anclado al icono de arriba. */}
          <div
            className={`${styles.govCluster} ${govOpen ? styles.govClusterOpen : ""}`}
          >
          <ul className={styles.govcoLinks}>
            {govcoLinks.map((link) => (
              <li key={link.href}>
                <a
                  className={styles.govcoLink}
                  href={link.href}
                  title={link.fullLabel}
                  aria-label={link.fullLabel}
                  onClick={() => setGovOpen(false)}
                >
                  <span className={styles.govLinkIconWrap}>
                    <GovIcon name={link.icon} />
                  </span>
                  <span className={styles.govLinkText}>{link.label}</span>
                </a>
              </li>
            ))}
          </ul>

          {/* Encuesta de satisfacción ciudadana (canal virtual, sitio externo). */}
          <a
            className={styles.surveyLink}
            href={surveyUrl}
            target="_blank"
            rel="noopener noreferrer"
            title={surveyLabel}
            aria-label={`${surveyLabel} (se abre en una nueva pestaña)`}
            onClick={() => setGovOpen(false)}
          >
            <svg
              aria-hidden="true"
              className={styles.surveyIcon}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 2h6a1 1 0 0 1 1 1v1h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2V3a1 1 0 0 1 1-1Z" />
              <path d="M9 4h6" />
              <path d="m8.5 11.5 1.5 1.5 2.5-2.5" />
              <path d="M8.5 16.5 10 18l2.5-2.5" />
              <path d="M16 11h.5M16 16h.5" />
            </svg>
            <span className={styles.surveyText}>Encuesta</span>
          </a>

          {/* Directorio dentro del dropdown GOV: solo en móvil (en escritorio
              se muestra junto a Perfiles, más abajo). */}
          <a
            className={`${styles.surveyLink} ${styles.directoryInCluster}`}
            href="/directorio"
            title="Directorio"
            aria-label="Directorio"
            onClick={() => setGovOpen(false)}
          >
            <svg
              aria-hidden="true"
              className={styles.surveyIcon}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 2H8a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2Z" />
              <path d="M6 7H4M6 12H4M6 17H4" />
              <circle cx="13" cy="10" r="2" />
              <path d="M10 16a3 3 0 0 1 6 0" />
            </svg>
            <span className={styles.surveyText}>Directorio</span>
          </a>
          </div>
        </div>
      </div>

      <div className={styles.actions}>
        {/* Directorio institucional (enlace interno), junto a Perfiles. Solo en
            escritorio; en móvil aparece dentro del dropdown GOV. */}
        <a
          className={styles.directoryLink}
          href="/directorio"
          title="Directorio"
        >
          <svg
            aria-hidden="true"
            className={styles.directoryIcon}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M18 2H8a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2Z" />
            <path d="M6 7H4M6 12H4M6 17H4" />
            <circle cx="13" cy="10" r="2" />
            <path d="M10 16a3 3 0 0 1 6 0" />
          </svg>
          Directorio
        </a>

        {/* Perfiles de usuario agrupados en un único botón desplegable. */}
        <div className={styles.profilesWrapper} ref={ref}>
          <button
            type="button"
            className={styles.profilesButton}
            onClick={toggleOpen}
            aria-expanded={open}
            aria-haspopup="true"
          >
            <svg
              aria-hidden="true"
              className={styles.profilesIcon}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            Perfiles
            <svg
              aria-hidden="true"
              className={styles.chevronIcon}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </button>

          <AnimatePresence>
            {open && (
              <motion.div
                className={styles.panel}
                variants={audienceDropdownVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={reduceMotion ? { duration: 0 } : undefined}
                style={{ transformOrigin: "top right" }}
              >
                {/* Maestro: listado de roles. En escritorio queda siempre a la
                    vista; en móvil se oculta al entrar al detalle de un rol
                    (navegación por pasos). Seleccionar uno revela sus servicios. */}
                <ul
                  className={styles.roleList}
                  hidden={isMobile && Boolean(activeProfile)}
                >
                  {profiles.map((profile) => {
                    const isActive = profile.href === activeHref
                    return (
                      <li key={profile.href}>
                        <button
                          type="button"
                          className={`${styles.roleItem} ${isActive ? styles.roleItemActive : ""}`}
                          aria-expanded={isActive}
                          onClick={() =>
                            setActiveHref((prev) =>
                              prev === profile.href ? "" : profile.href,
                            )
                          }
                        >
                          {/* Icono del rol (solo visible en el menú móvil). */}
                          <span className={styles.roleIconWrap}>
                            <ProfileIconGlyph name={profile.icon} />
                          </span>
                          <span className={styles.roleLabel}>{profile.label}</span>
                          <span aria-hidden="true" className={styles.roleArrow}>
                            &rsaquo;
                          </span>
                        </button>
                      </li>
                    )
                  })}

                  {/* Acceso autenticado (login institucional). */}
                  <li className={styles.loginItem}>
                    <a className={styles.loginButton} href="/login">
                      <svg
                        aria-hidden="true"
                        className={styles.loginIcon}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                        <polyline points="10 17 15 12 10 7" />
                        <line x1="15" y1="12" x2="3" y2="12" />
                      </svg>
                      Iniciar sesión
                    </a>
                  </li>
                </ul>

                {/* Detalle: aparece animado solo tras elegir un rol. En móvil no
                    anima el ancho (lo controla el CSS a pantalla completa). */}
                <AnimatePresence>
                  {activeProfile && (
                    <motion.div
                      key={activeProfile.href}
                      className={styles.detail}
                      initial={
                        reduceMotion
                          ? false
                          : isMobile
                            ? { opacity: 0, x: 12 }
                            : { opacity: 0, width: 0 }
                      }
                      animate={
                        isMobile
                          ? { opacity: 1, x: 0 }
                          : { opacity: 1, width: "20rem" }
                      }
                      // La salida es instantánea para que al "Volver" los
                      // perfiles reaparezcan sin retardo; la entrada sí anima.
                      exit={
                        reduceMotion || isMobile
                          ? { opacity: 0, transition: { duration: 0 } }
                          : { opacity: 0, width: 0 }
                      }
                      transition={
                        reduceMotion
                          ? { duration: 0 }
                          : isMobile
                            ? { type: "tween", duration: 0.22, ease: "easeOut" }
                            : { type: "spring", stiffness: 420, damping: 38 }
                      }
                    >
                      {/* Capa interna en absoluto: no aporta altura, por lo que
                          el alto del panel lo sigue marcando la lista de roles.
                          Contiene el título fijo y la lista con scroll. */}
                      <div className={styles.detailInner}>
                        {/* En móvil, botón para volver al listado de roles. */}
                        {isMobile && (
                          <button
                            type="button"
                            className={styles.detailBack}
                            onClick={() => setActiveHref("")}
                          >
                            <span aria-hidden="true">&lsaquo;</span>
                            Volver a perfiles
                          </button>
                        )}

                        {/* Encabezado fijo (fuera del área que hace scroll). */}
                        <a href={activeProfile.href} className={styles.detailTitle}>
                          {activeProfile.label}
                          <span aria-hidden="true" className={styles.detailTitleArrow}>
                            &rarr;
                          </span>
                        </a>

                        <div className={styles.detailLinks}>
                          {activeChildren.length > 0 ? (
                          <motion.ul
                            className={styles.quickLinks}
                            initial="hidden"
                            animate="visible"
                            variants={{
                              visible: {
                                transition: reduceMotion
                                  ? {}
                                  : { staggerChildren: 0.035 },
                              },
                            }}
                          >
                            {activeChildren.map((child) => (
                              <motion.li
                                key={child.href}
                                variants={{
                                  hidden: { opacity: 0, x: 8 },
                                  visible: { opacity: 1, x: 0 },
                                }}
                              >
                                <a href={child.href} className={styles.quickLink}>
                                  <span className={styles.quickIconWrap}>
                                    <ServiceIcon />
                                  </span>
                                  {child.label}
                                </a>
                              </motion.li>
                            ))}
                          </motion.ul>
                          ) : (
                            <a href={activeProfile.href} className={styles.quickLink}>
                              Ver la página de {activeProfile.label.toLowerCase()}
                            </a>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </nav>
  )
}
