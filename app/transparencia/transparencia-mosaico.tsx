"use client";

import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import DocumentCard from "@/components/common/document-card/document-card";
import type { CategoriaTransparencia, LeyTransparencia } from "./content";
import { CategoriaIcon } from "./icons";
import styles from "./page.module.css";

type TransparenciaMosaicoProps = {
  leyes: LeyTransparencia[];
};

// Selector de elementos enfocables para el focus-trap del modal.
const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input, textarea, select, [tabindex]:not([tabindex="-1"])';

/**
 * Normaliza un texto para comparar de forma insensible a mayúsculas y a
 * acentos/diacríticos: descompone en NFD, elimina los marcadores combinantes
 * (rango \u0300-\u036f) y pasa a minúsculas. Así "informacion" encuentra
 * "información".
 */
const normalizar = (texto: string) =>
  texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

/** Resultado del buscador: un enlace con el rastro de su ubicación. */
type ResultadoBusqueda = {
  enlace: { titulo: string; url: string };
  categoriaNumero: number;
  categoriaTitulo: string;
  subseccionNumero: string;
  subseccionTitulo: string;
};

/**
 * Intro, conmutador de ley y mosaico de categorías de "Transparencia y acceso
 * a la información pública".
 *
 * El componente recibe los dos esquemas de publicación disponibles
 * (Resolución 3564 de 2015 y Resolución 1519 de 2020) y mantiene en el cliente
 * el esquema activo. La intro (kicker + párrafo) cambia con el esquema
 * seleccionado y vive en un panel blanco. El conmutador es un segmented
 * control (botones en escritorio, select en móvil) que calca el patrón de
 * normatividad.
 *
 * Cada tarjeta del mosaico es un botón con icono, título y descripción breve.
 * Al activarlo se abre un modal con las subsecciones de la categoría y, bajo
 * cada una, los enlaces oficiales (DocumentCard). Cuando la categoría está
 * pendiente (Resolución 1519, sin enlaces publicados aún) el modal muestra un
 * aviso de información en proceso de publicación. El modal replica el patrón de
 * accesibilidad del sitio (role="dialog", aria-modal, cierre con Escape y por
 * overlay, bloqueo del scroll del body, respeto de movimiento reducido) y
 * añade un focus-trap: al abrir enfoca el modal y cicla Tab/Shift+Tab solo
 * entre sus elementos; al cerrar devuelve el foco al disparador.
 */
export default function TransparenciaMosaico({
  leyes,
}: TransparenciaMosaicoProps) {
  const reduceMotion = useReducedMotion();
  const [activaLey, setActivaLey] = useState(0);
  const [activa, setActiva] = useState<CategoriaTransparencia | null>(null);
  const [termino, setTermino] = useState("");
  const titleId = useId();
  const selectId = useId();
  const buscadorId = useId();

  const modalRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  const leyActiva = leyes[activaLey];

  // Cuando la ley activa no tiene enlaces publicados (Resolución 1519, todas
  // sus categorías están pendientes), no hay contenido buscable: el input se
  // deshabilita y se muestra un aviso en lugar del estado vacío genérico.
  const leySinContenido = useMemo(
    () =>
      leyActiva.categorias.every(
        (categoria) =>
          categoria.pendiente ||
          categoria.subsecciones.every(
            (subseccion) => subseccion.enlaces.length === 0,
          ),
      ),
    [leyActiva],
  );

  // Término efectivo de búsqueda: se recorta y, si queda vacío, no hay búsqueda
  // activa (se muestra el mosaico).
  const terminoLimpio = termino.trim();
  const busquedaActiva = terminoLimpio.length > 0;

  // Resultados derivados del término + ley activa. Recorre solo la resolución
  // activa y filtra por el título del enlace. Decisión de match: se exige que
  // TODAS las palabras del término aparezcan como substring en el título
  // normalizado (AND de palabras), de modo que "estados financieros" encuentre
  // el enlace aunque el usuario invierta o separe las palabras. La
  // normalización (NFD + minúsculas) hace la comparación insensible a
  // mayúsculas y a acentos.
  const resultados = useMemo<ResultadoBusqueda[]>(() => {
    if (!busquedaActiva) return [];
    const palabras = normalizar(terminoLimpio)
      .split(/\s+/)
      .filter(Boolean);
    if (palabras.length === 0) return [];

    const encontrados: ResultadoBusqueda[] = [];
    for (const categoria of leyActiva.categorias) {
      for (const subseccion of categoria.subsecciones) {
        for (const enlace of subseccion.enlaces) {
          const tituloNormalizado = normalizar(enlace.titulo);
          if (palabras.every((palabra) => tituloNormalizado.includes(palabra))) {
            encontrados.push({
              enlace,
              categoriaNumero: categoria.numero,
              categoriaTitulo: categoria.titulo,
              subseccionNumero: subseccion.numero,
              subseccionTitulo: subseccion.titulo,
            });
          }
        }
      }
    }
    return encontrados;
  }, [busquedaActiva, terminoLimpio, leyActiva]);

  const rotuloCategoria = leyActiva.id === "res-1519" ? "Sección" : "Categoría";

  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  // Bloquear el scroll del body mientras el modal está abierto.
  useEffect(() => {
    if (!activa) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [activa]);

  // Cerrar con Escape.
  useEffect(() => {
    if (!activa) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActiva(null);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activa]);

  // Focus-trap: al abrir enfoca el modal; al cerrar devuelve el foco al
  // elemento que lo abrió (guardado en triggerRef al pulsar la tarjeta).
  useEffect(() => {
    if (!activa) return;
    const nodo = modalRef.current;
    if (!nodo) return;

    const trigger = triggerRef.current;
    nodo.focus();

    return () => {
      // Al cerrar, devolver el foco al disparador si sigue en el documento.
      if (trigger && document.contains(trigger)) {
        trigger.focus();
      }
      triggerRef.current = null;
    };
  }, [activa]);

  // Interceptar Tab/Shift+Tab para ciclar el foco dentro del modal.
  useEffect(() => {
    if (!activa) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Tab") return;
      const nodo = modalRef.current;
      if (!nodo) return;

      const enfocables = Array.from(
        nodo.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
      ).filter((el) => el.offsetParent !== null || el === document.activeElement);

      if (enfocables.length === 0) {
        // Sin enfocables internos: mantener el foco en el contenedor.
        event.preventDefault();
        nodo.focus();
        return;
      }

      const primero = enfocables[0];
      const ultimo = enfocables[enfocables.length - 1];
      const activo = document.activeElement;

      if (event.shiftKey) {
        if (activo === primero || activo === nodo) {
          event.preventDefault();
          ultimo.focus();
        }
      } else if (activo === ultimo) {
        event.preventDefault();
        primero.focus();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activa]);

  const abrir = (
    categoria: CategoriaTransparencia,
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    triggerRef.current = event.currentTarget;
    setActiva(categoria);
  };

  const cambiarLey = (indice: number) => {
    setActivaLey(indice);
    // Al cambiar de ley, limpiar la búsqueda (volver al mosaico de la nueva
    // ley) y cerrar cualquier modal abierto.
    setTermino("");
    setActiva(null);
  };

  const limpiarBusqueda = () => setTermino("");

  return (
    <>
      {/* Conmutador entre leyes. */}
      <div className={styles.leyBrowser}>
        {/* Móvil: select nativo. */}
        <div className={styles.leySelectWrap}>
          <label className={styles.leySelectLabel} htmlFor={selectId}>
            Esquema de publicación
          </label>
          <select
            id={selectId}
            className={styles.leySelect}
            value={activaLey}
            onChange={(event) => cambiarLey(Number(event.target.value))}
          >
            {leyes.map((ley, index) => (
              <option key={ley.id} value={index}>
                {ley.etiqueta}
              </option>
            ))}
          </select>
        </div>

        {/* Escritorio: botones tipo segmented control. */}
        <div
          className={styles.leyFiltros}
          role="tablist"
          aria-label="Esquema de publicación"
        >
          {leyes.map((ley, index) => {
            const esActivo = index === activaLey;
            return (
              <button
                key={ley.id}
                type="button"
                role="tab"
                id={`ley-tab-${index}`}
                aria-selected={esActivo}
                aria-controls="ley-mosaico"
                tabIndex={esActivo ? 0 : -1}
                className={`${styles.leyFiltro} ${
                  esActivo ? styles.leyFiltroActivo : ""
                }`}
                onClick={() => cambiarLey(index)}
              >
                {ley.etiqueta}
              </button>
            );
          })}
        </div>
      </div>

      {/* Panel de la resolución activa, junto a sus categorías. Refleja la
          ley activa y ocupa el ancho completo del área de contenido. */}
      <div className={styles.introResolucion}>
        <p className={styles.introKicker}>{leyActiva.kicker}</p>
        <p className={styles.introText}>{leyActiva.introText}</p>
      </div>

      {/* Buscador por título de enlace sobre la resolución activa. Filtra en
          memoria; no modifica el contenido. */}
      <div className={styles.buscador}>
        <label className={styles.buscadorLabel} htmlFor={buscadorId}>
          Buscar información
        </label>
        <div className={styles.buscadorCampo}>
          <span className={styles.buscadorIcono} aria-hidden="true">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m21 21-4.3-4.3" />
            </svg>
          </span>
          <input
            id={buscadorId}
            type="search"
            className={styles.buscadorInput}
            value={termino}
            onChange={(event) => setTermino(event.target.value)}
            disabled={leySinContenido}
            placeholder={
              leySinContenido
                ? "Esta resolución aún no tiene contenido buscable"
                : "Busca un documento o enlace (ej. presupuesto, estados financieros)"
            }
            autoComplete="off"
          />
          {busquedaActiva && (
            <button
              type="button"
              className={styles.buscadorLimpiar}
              onClick={limpiarBusqueda}
              aria-label="Limpiar búsqueda"
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {busquedaActiva ? (
        <div className={styles.resultados}>
          {leySinContenido ? (
            // Resolución pendiente: aviso específico en lugar del estado vacío.
            <div className={styles.avisoPendiente} role="status">
              <span
                className={styles.avisoPendienteIcono}
                aria-hidden="true"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 8h.01" />
                  <path d="M11 12h1v4h1" />
                </svg>
              </span>
              <div>
                <p className={styles.avisoPendienteTitulo}>
                  Contenido en proceso de publicación
                </p>
                <p className={styles.avisoPendienteTexto}>
                  Los enlaces oficiales de esta resolución aún se están cargando
                  y actualizando, por eso la búsqueda no arroja resultados.
                  Vuelve a consultar más adelante.
                </p>
              </div>
            </div>
          ) : resultados.length === 0 ? (
            // Estado vacío accesible, con opción para volver al mosaico.
            <div className={styles.resultadosVacio} role="status">
              <p className={styles.resultadosVacioTexto}>
                No se encontraron resultados para{" "}
                <strong>&ldquo;{terminoLimpio}&rdquo;</strong>. Prueba con otras
                palabras o revisa las categorías.
              </p>
              <button
                type="button"
                className={styles.resultadosVacioBoton}
                onClick={limpiarBusqueda}
              >
                Limpiar búsqueda
              </button>
            </div>
          ) : (
            <>
              <p className={styles.resultadosContador} role="status">
                {resultados.length}{" "}
                {resultados.length === 1 ? "resultado" : "resultados"} para{" "}
                <strong>&ldquo;{terminoLimpio}&rdquo;</strong>
              </p>
              <ul className={styles.enlacesGrid}>
                {resultados.map((resultado) => (
                  <li
                    key={
                      resultado.enlace.url +
                      resultado.enlace.titulo +
                      resultado.subseccionNumero
                    }
                  >
                    <DocumentCard
                      label={resultado.enlace.titulo}
                      href={resultado.enlace.url}
                      kind={
                        resultado.enlace.url.toLowerCase().endsWith(".pdf")
                          ? "pdf"
                          : "enlace"
                      }
                      description={`${rotuloCategoria} ${resultado.categoriaNumero} · ${resultado.categoriaTitulo} › ${resultado.subseccionNumero} ${resultado.subseccionTitulo}`}
                      className={styles.documentCardWhite}
                    />
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      ) : (
        <ul className={styles.mosaico} id="ley-mosaico">
          {leyActiva.categorias.map((categoria) => (
            <li key={categoria.id}>
              <button
                type="button"
                className={styles.tarjeta}
                onClick={(event) => abrir(categoria, event)}
                aria-haspopup="dialog"
              >
                <span className={styles.tarjetaIcono} aria-hidden="true">
                  <CategoriaIcon id={categoria.id} />
                </span>
                <span className={styles.tarjetaNumero}>
                  {rotuloCategoria} {categoria.numero}
                </span>
                <span className={styles.tarjetaTitulo}>{categoria.titulo}</span>
                <span className={styles.tarjetaDescripcion}>
                  {categoria.descripcion}
                </span>
                <span className={styles.tarjetaVerMas} aria-hidden="true">
                  Ver información
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 12h14" />
                    <path d="m12 5 7 7-7 7" />
                  </svg>
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}

      {mounted &&
        createPortal(
          <AnimatePresence>
            {activa && (
              <motion.div
                className={styles.overlay}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: reduceMotion ? 0 : 0.2 }}
                onClick={() => setActiva(null)}
              >
                <motion.div
                  ref={modalRef}
                  className={styles.modal}
                  role="dialog"
                  aria-modal="true"
                  aria-labelledby={titleId}
                  tabIndex={-1}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: reduceMotion ? 0 : 0.25 }}
                  onClick={(event) => event.stopPropagation()}
                >
                  <button
                    type="button"
                    className={styles.modalClose}
                    onClick={() => setActiva(null)}
                    aria-label="Cerrar"
                  >
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M18 6 6 18" />
                      <path d="m6 6 12 12" />
                    </svg>
                  </button>

                  <div className={styles.modalBody}>
                    <div className={styles.modalHeader}>
                      <span className={styles.modalHeaderIcono} aria-hidden="true">
                        <CategoriaIcon id={activa.id} />
                      </span>
                      <div>
                        <p className={styles.modalKicker}>
                          {rotuloCategoria} {activa.numero}
                        </p>
                        <h3 id={titleId} className={styles.modalTitulo}>
                          {activa.titulo}
                        </h3>
                      </div>
                    </div>

                    {activa.pendiente || activa.subsecciones.length === 0 ? (
                      <div className={styles.avisoPendiente} role="status">
                        <span
                          className={styles.avisoPendienteIcono}
                          aria-hidden="true"
                        >
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <circle cx="12" cy="12" r="10" />
                            <path d="M12 8h.01" />
                            <path d="M11 12h1v4h1" />
                          </svg>
                        </span>
                        <div>
                          <p className={styles.avisoPendienteTitulo}>
                            Información en proceso de publicación
                          </p>
                          <p className={styles.avisoPendienteTexto}>
                            La Universidad está cargando y actualizando los
                            enlaces oficiales de esta sección. Vuelve a
                            consultarla más adelante.
                          </p>
                        </div>
                      </div>
                    ) : (
                      activa.subsecciones.map((subseccion) => (
                        <section
                          className={styles.subseccion}
                          key={subseccion.numero}
                        >
                          <h4 className={styles.subseccionTitulo}>
                            {subseccion.numero}. {subseccion.titulo}
                          </h4>
                          <ul className={styles.enlacesGrid}>
                            {subseccion.enlaces.map((enlace) => (
                              <li key={enlace.url + enlace.titulo}>
                                <DocumentCard
                                  label={enlace.titulo}
                                  href={enlace.url}
                                  kind={
                                    enlace.url.toLowerCase().endsWith(".pdf")
                                      ? "pdf"
                                      : "enlace"
                                  }
                                  className={styles.documentCardWhite}
                                />
                              </li>
                            ))}
                          </ul>
                        </section>
                      ))
                    )}
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </>
  );
}
