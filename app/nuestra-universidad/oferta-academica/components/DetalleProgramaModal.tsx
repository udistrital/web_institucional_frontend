"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { ProgramaAcademico } from "@/services/oferta-academica";
import SelloAcreditacion from "./SelloAcreditacion";
import styles from "../page.module.css";

function normalizar(texto: string | null | undefined): string {
  return (texto ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("es")
    .trim();
}

function esNivelDePregrado(nivel: string | null | undefined): boolean {
  const nivelNormalizado = normalizar(nivel)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return ["pregrado", "profesional", "tecnologia"].includes(nivelNormalizado);
}

function Dato({ etiqueta, valor }: { etiqueta: string; valor: string | null }) {
  if (!valor) return null;
  return (
    <div className={styles.modalDetail}>
      <dt>{etiqueta}</dt>
      <dd>{valor}</dd>
    </div>
  );
}

function DatoDireccion({ direccion }: { direccion: string | null }) {
  if (!direccion) return null;
  const consulta = `${direccion}, Universidad Distrital, Bogotá, Colombia`;
  const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(consulta)}`;

  return (
    <div className={styles.modalDetail}>
      <dt>Dirección</dt>
      <dd>
        <a
          href={url}
          rel="noopener noreferrer"
          target="_blank"
          aria-label={`Buscar ${direccion} en Google Maps; abre en una pestaña nueva`}
        >
          {direccion}
        </a>
      </dd>
    </div>
  );
}

function Documento({
  titulo,
  descripcion,
  url,
}: {
  titulo: string;
  descripcion: string | null;
  url: string | null;
}) {
  if (!url) return null;
  return (
    <div className={styles.modalDocument}>
      <a href={url} rel="noreferrer" target="_blank">
        {titulo}
        <span className={styles.srOnly}> (abre en una pestaña nueva)</span>
      </a>
      {descripcion && <p>{descripcion}</p>}
    </div>
  );
}

export default function DetalleProgramaModal({
  programa,
  imagenUrl,
  imagenAlt,
}: {
  programa: ProgramaAcademico;
  imagenUrl: string | null;
  imagenAlt: string;
}) {
  const [abierto, setAbierto] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const botonAbrirRef = useRef<HTMLButtonElement>(null);
  const esPregrado = esNivelDePregrado(programa.nivel);
  const idTitulo = `programa-modal-${programa.id.replace(/[^a-zA-Z0-9_-]/g, "")}`;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (abierto && !dialog.open) dialog.showModal();
    if (!abierto && dialog.open) dialog.close();
  }, [abierto]);

  useEffect(() => {
    if (!abierto) return;
    const overflowAnterior = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = overflowAnterior;
    };
  }, [abierto]);

  function cerrar() {
    setAbierto(false);
  }

  return (
    <>
      <button
        className={styles.detailsButton}
        onClick={() => setAbierto(true)}
        ref={botonAbrirRef}
        type="button"
      >
        Ver más
      </button>

      <dialog
        aria-labelledby={idTitulo}
        aria-modal="true"
        className={styles.programDialog}
        onCancel={(event) => {
          event.preventDefault();
          cerrar();
        }}
        onClick={(event) => {
          if (event.target === event.currentTarget) cerrar();
        }}
        onClose={() => {
          setAbierto(false);
          botonAbrirRef.current?.focus();
        }}
        ref={dialogRef}
      >
        <div className={styles.modalLayout}>
          <div className={styles.modalImage}>
            <div className={styles.modalImageInner}>
              {imagenUrl ? (
                <Image
                  alt={imagenAlt}
                  fill
                  sizes="(max-width: 760px) 90vw, 38vw"
                  src={imagenUrl}
                />
              ) : (
                <div
                  className={styles.modalImageFallback}
                  role="img"
                  aria-label="Imagen no disponible"
                >
                  UD
                </div>
              )}
            </div>
          </div>

          <div className={styles.modalContent}>
            <button
              aria-label={`Cerrar detalles de ${programa.nombre}`}
              autoFocus
              className={styles.modalClose}
              onClick={cerrar}
              type="button"
            >
              <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="m18 6-12 12M6 6l12 12" />
              </svg>
            </button>

            <p className={styles.programEyebrow}>
              {[programa.facultad, programa.nivel].filter(Boolean).join(" · ") || "Programa académico"}
            </p>
            <div className={styles.modalTitleLine}>
              <h2 id={idTitulo}>{programa.nombre}</h2>
              {programa.snies !== null && (
                <span className={styles.snies}>SNIES {programa.snies}</span>
              )}
            </div>
            {programa.acreditacionAltaCalidad && <SelloAcreditacion />}

            <dl className={styles.modalSummary}>
              <Dato etiqueta="Nivel de formación" valor={programa.nivel} />
              <Dato etiqueta="Modalidad" valor={programa.modalidad} />
              <Dato etiqueta="Jornada" valor={programa.jornada} />
            </dl>

            {(programa.correo || programa.telefono) && (
              <section className={styles.modalContact} aria-label="Contacto del programa">
                <h3>Contacto</h3>
                {programa.telefono && (
                  <p><a href={`tel:${programa.telefono.replace(/[^\d+]/g, "")}`}>{programa.telefono}</a></p>
                )}
                {programa.correo && (
                  <p><a href={`mailto:${programa.correo}`}>{programa.correo}</a></p>
                )}
              </section>
            )}

            <dl className={styles.modalDetails}>
              <Dato etiqueta="Facultad" valor={programa.facultad} />
              <Dato etiqueta="Título otorgado" valor={programa.titulacion} />
              <Dato etiqueta="Coordinación" valor={programa.coordinador} />
              <DatoDireccion direccion={programa.direccion} />
              <Dato etiqueta="Horario de atención" valor={programa.horarioAtencion} />
              {esPregrado && <Dato etiqueta="Puntaje Saber 11" valor={programa.puntajeSaber11} />}
            </dl>

            {(programa.normaInternaUrl || programa.registroCalificadoUrl) && (
              <div className={styles.modalDocuments}>
                <Documento
                  descripcion={programa.normaInternaDescripcion}
                  titulo="Norma interna de creación"
                  url={programa.normaInternaUrl}
                />
                <Documento
                  descripcion={programa.registroCalificadoDescripcion}
                  titulo="Registro calificado"
                  url={programa.registroCalificadoUrl}
                />
              </div>
            )}

            {programa.paginaProgramaUrl && (
              <a className={styles.moreButton} href={programa.paginaProgramaUrl}>
                Conocer más
              </a>
            )}
          </div>
        </div>
      </dialog>
    </>
  );
}
