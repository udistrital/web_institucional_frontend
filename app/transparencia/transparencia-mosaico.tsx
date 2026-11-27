"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import DocumentCard from "@/components/common/document-card/document-card";
import type { CategoriaTransparencia, LeyTransparencia } from "./content";
import { CategoriaIcon } from "./icons";
import styles from "./page.module.css";

type TransparenciaMosaicoProps = {
  leyes: LeyTransparencia[];
};

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
 * Al activarla, su detalle se despliega en la misma página, en un panel a
 * ancho completo situado debajo del mosaico (no un modal), con una animación
 * suave de apertura. El detalle lista las subsecciones como un sub-acordeón:
 * cada subsección arranca cerrada y, al abrirla, muestra sus enlaces oficiales
 * (DocumentCard) en una lista de una tarjeta por fila.
 * Cuando la categoría está pendiente (Resolución 1519, sin enlaces publicados
 * aún) el detalle muestra un aviso de información en proceso de publicación.
 */
export default function TransparenciaMosaico({
  leyes,
}: TransparenciaMosaicoProps) {
  const reduceMotion = useReducedMotion();
  const duracion = reduceMotion ? 0 : 0.3;
  const [activaLey, setActivaLey] = useState(0);
  // Categoría/sección desplegada en la página. null = ninguna abierta.
  const [activa, setActiva] = useState<CategoriaTransparencia | null>(null);
  // Subsección abierta dentro del detalle (sub-acordeón). null = todas cerradas.
  const [subseccionAbierta, setSubseccionAbierta] = useState<string | null>(
    null,
  );
  const [scrollTargetId, setScrollTargetId] = useState<string | null>(null);
  const [termino, setTermino] = useState("");
  const selectId = useId();
  const buscadorId = useId();

  // Al abrir una categoría se lleva la vista hasta el buscador, de modo que el
  // detalle que lo sustituye quede visible sin que el usuario tenga que
  // desplazarse.
  const buscadorRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!activa) return;

    const frame = window.requestAnimationFrame(() => {
      buscadorRef.current?.scrollIntoView({
        behavior: reduceMotion ? "auto" : "smooth",
        block: "start",
      });
    });

    return () => window.cancelAnimationFrame(frame);
  }, [activa, reduceMotion]);

  useEffect(() => {
    if (!activa || !subseccionAbierta) return;

    let frame = 0;
    const timeout = window.setTimeout(() => {
      frame = window.requestAnimationFrame(() => {
        const heading = document.getElementById(
          `subseccion-${activa.id}-${subseccionAbierta}-heading`,
        );
        if (!heading) return;

        setScrollTargetId(heading.id);
      });
    }, duracion * 1000);

    return () => {
      window.clearTimeout(timeout);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [activa, duracion, reduceMotion, subseccionAbierta]);

  useEffect(() => {
    if (!scrollTargetId) return;

    const frame = window.requestAnimationFrame(() => {
      const heading = document.getElementById(scrollTargetId);
      if (!heading) return;

      const margenSuperior = Number.parseFloat(
        getComputedStyle(heading).scrollMarginTop,
      );
      const destino =
        heading.getBoundingClientRect().top +
        window.scrollY -
        (Number.isFinite(margenSuperior) ? margenSuperior : 0);

      window.scrollTo({
        top: Math.max(0, destino),
        behavior: reduceMotion ? "auto" : "smooth",
      });
    });

    return () => window.cancelAnimationFrame(frame);
  }, [reduceMotion, scrollTargetId]);

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

  // Abre el detalle de una categoría en la página (o lo cierra si ya estaba
  // abierta). Al abrir una nueva, reinicia el sub-acordeón de subsecciones.
  const alternarCategoria = (categoria: CategoriaTransparencia) => {
    const cerrando = activa?.id === categoria.id;
    setSubseccionAbierta(null);
    setScrollTargetId(null);
    setActiva(cerrando ? null : categoria);
  };

  const cambiarLey = (indice: number) => {
    setActivaLey(indice);
    // Al cambiar de ley, limpiar la búsqueda (volver al mosaico de la nueva
    // ley) y cerrar cualquier detalle abierto.
    setTermino("");
    setActiva(null);
    setSubseccionAbierta(null);
    setScrollTargetId(null);
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
      <div className={styles.buscador} ref={buscadorRef}>
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
              <span className={styles.avisoPendienteIcono} aria-hidden="true">
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
              <ul className={styles.resultadosGrid}>
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
                      hideArrowOnMobile
                      kind={
                        resultado.enlace.url.toLowerCase().endsWith(".pdf")
                          ? "pdf"
                          : "enlace"
                      }
                      description={`${resultado.categoriaNumero} · ${resultado.categoriaTitulo} › ${resultado.subseccionNumero} ${resultado.subseccionTitulo}`}
                    />
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      ) : (
        // El mosaico y el detalle son mutuamente excluyentes: al elegir una
        // categoría, el mosaico se oculta y en su lugar aparece solo el detalle
        // de esa categoría; "Volver" regresa al mosaico.
        <AnimatePresence mode="wait" initial={false}>
          {!activa ? (
            <motion.ul
              key="mosaico"
              className={styles.mosaico}
              id="ley-mosaico"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: duracion, ease: "easeInOut" }}
            >
              {leyActiva.categorias.map((categoria) => (
                <li key={categoria.id}>
                  <button
                    type="button"
                    className={styles.tarjeta}
                    onClick={() => alternarCategoria(categoria)}
                    aria-controls="detalle-categoria"
                  >
                    <span className={styles.tarjetaIcono} aria-hidden="true">
                      <CategoriaIcon id={categoria.id} />
                    </span>
                    <span className={styles.tarjetaTitulo}>
                      <span className={styles.tarjetaNumero}>
                        {categoria.numero}.
                      </span>{" "}
                      {categoria.titulo}
                    </span>
                    <span className={styles.tarjetaDescripcion}>
                      {categoria.descripcion}
                    </span>
                    <span className={styles.tarjetaVerMas} aria-hidden="true">
                      Ver información
                      <svg
                        className={styles.tarjetaVerMasIcono}
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
            </motion.ul>
          ) : (
            <motion.div
              id="detalle-categoria"
              key={activa.id}
              className={styles.detalle}
              initial={{ opacity: 0, y: reduceMotion ? 0 : 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: reduceMotion ? 0 : 8 }}
              transition={{ duration: duracion, ease: "easeInOut" }}
            >
              <div className={styles.detalleInner}>
                <div className={styles.detalleHeader}>
                  <button
                    type="button"
                    className={styles.detalleVolver}
                    onClick={() => setActiva(null)}
                  >
                    <svg
                      className={styles.detalleVolverIcono}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M19 12H5" />
                      <path d="m12 19-7-7 7-7" />
                    </svg>
                    Volver
                  </button>
                  <span
                    className={styles.detalleHeaderIcono}
                    aria-hidden="true"
                  >
                    <CategoriaIcon id={activa.id} />
                  </span>
                  <h3 className={styles.detalleTitulo}>
                    <span className={styles.detalleNumero}>
                      {activa.numero}.
                    </span>{" "}
                    {activa.titulo}
                  </h3>
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
                    <div className={styles.subsecciones}>
                      {activa.subsecciones.map((subseccion) => {
                        const subAbierta =
                          subseccionAbierta === subseccion.numero;
                        const panelId = `subseccion-${activa.id}-${subseccion.numero}`;
                        return (
                          <section
                            className={styles.subseccion}
                            key={subseccion.numero}
                          >
                            <h4
                              className={styles.subseccionTitulo}
                              id={`${panelId}-heading`}
                            >
                              <button
                                type="button"
                                className={styles.subseccionToggle}
                                aria-expanded={subAbierta}
                                aria-controls={panelId}
                                onClick={() => {
                                  setScrollTargetId(null);
                                  setSubseccionAbierta(
                                    subAbierta ? null : subseccion.numero,
                                  );
                                }}
                              >
                                <span className={styles.subseccionToggleTexto}>
                                  {subseccion.numero}. {subseccion.titulo}
                                </span>
                                <svg
                                  className={styles.subseccionChevron}
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  aria-hidden="true"
                                >
                                  <polyline points="6 9 12 15 18 9" />
                                </svg>
                              </button>
                            </h4>
                            <AnimatePresence initial={false}>
                              {subAbierta && (
                                <motion.div
                                  id={panelId}
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: "auto", opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{
                                    duration: duracion,
                                    ease: "easeInOut",
                                  }}
                                  style={{ overflow: "hidden" }}
                                >
                                  <ul
                                    className={styles.documentos}
                                  >
                                    {subseccion.enlaces.map((enlace) => (
                                      <li key={enlace.url + enlace.titulo}>
                                        <DocumentCard
                                          label={enlace.titulo}
                                          href={enlace.url}
                                          hideArrowOnMobile
                                          kind={
                                            enlace.url
                                              .toLowerCase()
                                              .endsWith(".pdf")
                                              ? "pdf"
                                              : "enlace"
                                          }
                                        />
                                      </li>
                                    ))}
                                  </ul>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </section>
                        );
                      })}
                    </div>
                  )}
                </div>
              </motion.div>
          )}
        </AnimatePresence>
      )}
    </>
  );
}
