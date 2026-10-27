import type { Metadata } from "next";
import type { ReactNode } from "react";
import Image from "next/image";
import styles from "./page.module.css";
import BreadCrumbs from "@/components/common/bread-crumbs/bread-crumbs";
import { getRector } from "@/services/integrantes";
import SectionTabs from "./section-tabs";
import HistoriaTimeline from "./historia-timeline";
import {
  SECTIONS,
  FUNCIONES,
  FUNCIONES_INTRO,
  FUNCIONES_FUENTE,
  ORGANOS_DIRECCION,
  HISTORIA_INTRO,
  HITOS,
  HIMNO_VIDEO_URL,
  HIMNO_ESTROFAS,
  OTROS_HIMNOS,
  SIMBOLOS_GRAFICOS,
} from "./content";

export const metadata: Metadata = {
  title: "Sobre Nosotros",
  description:
    "Conoce las funciones misionales, los directivos, la historia y los símbolos de la Universidad Distrital Francisco José de Caldas.",
};

function getIniciales(nombre: string) {
  const palabras = nombre.trim().split(/\s+/);
  return palabras.slice(0, 2).map((p) => p.charAt(0)).join("").toUpperCase() || "UD";
}

function toParrafos(texto: string) {
  return texto
    .split(/\r?\n/)
    .map((linea) => linea.trim())
    .filter(Boolean);
}

export default async function SobreNosotrosPage() {
  const rector = await getRector();
  const rectorParrafos = rector?.descripcion ? toParrafos(rector.descripcion) : [];

  /* 1. Funciones misionales */
  const funcionesPanel: ReactNode = (
    <article className={styles.block} aria-labelledby="funciones-misionales-title">
      <div className={styles.sectionHeading}>
        <div>
          <p className={styles.sectionKicker}>Nuestra razón de ser</p>
          <h2 id="funciones-misionales-title">Funciones misionales</h2>
        </div>
      </div>

      <div className={styles.prose}>
        {FUNCIONES_INTRO.map((parrafo, index) => (
          <p key={index}>{parrafo}</p>
        ))}
      </div>

      <div className={styles.funcionesGrid}>
        {FUNCIONES.map((funcion, index) => (
          <div className={styles.funcionCard} key={funcion.titulo}>
            <span className={styles.funcionNumber} aria-hidden="true">
              {String(index + 1).padStart(2, "0")}
            </span>
            <h3>{funcion.titulo}</h3>
            <p>{funcion.descripcion}</p>
          </div>
        ))}
      </div>

      <p className={styles.fuente}>
        <span>Fuente</span>
        {FUNCIONES_FUENTE}
      </p>
    </article>
  );

  /* 2. Directivos */
  const directivosPanel: ReactNode = (
    <article className={styles.block} aria-labelledby="directivos-title">
      <div className={styles.sectionHeading}>
        <div>
          <p className={styles.sectionKicker}>Equipo de dirección</p>
          <h2 id="directivos-title">Directivos</h2>
        </div>
      </div>

      {rector && (
        <div className={styles.rectorCard}>
          <div className={styles.rectorImage}>
            {rector.imageUrl ? (
              <Image
                src={rector.imageUrl}
                alt={rector.imageAlt}
                fill
                sizes="(max-width: 820px) 100vw, 22rem"
                className={styles.rectorImageInner}
              />
            ) : (
              <span className={styles.rectorFallback} aria-hidden="true">
                {getIniciales(rector.nombre)}
              </span>
            )}
          </div>
          <div className={styles.rectorBody}>
            <p className={styles.rectorRole}>{rector.puesto || "Rector"}</p>
            <h3 className={styles.rectorName}>{rector.nombre}</h3>
            {rectorParrafos.map((parrafo, index) => (
              <p key={index} className={styles.rectorText}>
                {parrafo}
              </p>
            ))}
          </div>
        </div>
      )}

      <div className={styles.organosGrid}>
        {ORGANOS_DIRECCION.map((organo) => (
          <div className={styles.organoCard} key={organo.titulo}>
            <h3>{organo.titulo}</h3>
            <p className={styles.organoDesc}>{organo.descripcion}</p>
            {organo.miembros && (
              <ul className={styles.organoList}>
                {organo.miembros.map((miembro, index) => (
                  <li key={index}>{miembro}</li>
                ))}
              </ul>
            )}
            {organo.enlace && (
              <a className={styles.organoLink} href={organo.enlace.href}>
                {organo.enlace.label} <span aria-hidden="true">↗</span>
              </a>
            )}
          </div>
        ))}
      </div>
    </article>
  );

  /* 3. Historia */
  const historiaPanel: ReactNode = (
    <article className={styles.block} aria-labelledby="historia-title">
      <div className={styles.sectionHeading}>
        <div>
          <p className={styles.sectionKicker}>Más de 70 años de historia</p>
          <h2 id="historia-title">Historia</h2>
        </div>
      </div>

      <div className={styles.prose}>
        {HISTORIA_INTRO.map((parrafo, index) => (
          <p key={index}>{parrafo}</p>
        ))}
      </div>

      <HistoriaTimeline hitos={HITOS} />
    </article>
  );

  /* 4. Símbolos */
  const simbolosPanel: ReactNode = (
    <article className={styles.block} aria-labelledby="simbolos-title">
      <div className={styles.sectionHeading}>
        <div>
          <p className={styles.sectionKicker}>Identidad institucional</p>
          <h2 id="simbolos-title">Símbolos</h2>
        </div>
      </div>

      <div className={styles.himno}>
        <div className={styles.himnoVideo}>
          <iframe
            src={HIMNO_VIDEO_URL}
            title="Video del Himno Institucional de la Universidad Distrital"
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        </div>
        <div className={styles.himnoLetra}>
          <h3>Himno institucional</h3>
          <div className={styles.estrofas}>
            {HIMNO_ESTROFAS.map((estrofa, index) => (
              <p className={styles.estrofa} key={index}>
                {estrofa.map((verso, i) => (
                  <span key={i}>{verso}</span>
                ))}
              </p>
            ))}
          </div>
          <div className={styles.otrosHimnos}>
            <p className={styles.otrosHimnosTitle}>Otros himnos</p>
            <ul>
              {OTROS_HIMNOS.map((himno) => (
                <li key={himno.href}>
                  <a href={himno.href}>{himno.label}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className={styles.graficosGrid}>
        {SIMBOLOS_GRAFICOS.map((simbolo) => (
          <div className={styles.graficoCard} key={simbolo.id}>
            <div className={styles.graficoMedia}>
              {simbolo.id === "escudo" ? (
                <Image
                  src="/escudos/escudo_ud.gif"
                  alt="Escudo de la Universidad Distrital Francisco José de Caldas"
                  width={197}
                  height={217}
                  className={styles.escudoImg}
                  unoptimized
                />
              ) : (
                <Image
                  src="/escudos/bandera_ud.jpg"
                  alt="Bandera de la Universidad Distrital: franja superior amarilla y franja inferior roja con el escudo institucional al centro"
                  width={237}
                  height={169}
                  className={styles.banderaImg}
                />
              )}
            </div>
            <div className={styles.graficoBody}>
              <h3>{simbolo.titulo}</h3>
              {simbolo.parrafos.map((parrafo, index) => (
                <p key={index}>{parrafo}</p>
              ))}
            </div>
          </div>
        ))}
      </div>
    </article>
  );

  const panels: Record<string, ReactNode> = {
    "funciones-misionales": funcionesPanel,
    directivos: directivosPanel,
    historia: historiaPanel,
    simbolos: simbolosPanel,
  };

  return (
    <section className={styles.page} aria-labelledby="sobre-nosotros-title">
      <header className={styles.hero}>
        <div className={styles.heroContent}>
          <p className={styles.eyebrow}>Nuestra Universidad</p>
          <h1 id="sobre-nosotros-title">Sobre Nosotros</h1>
          <p className={styles.heroLead}>
            Funciones misionales, directivos, historia y símbolos de la Universidad
            Distrital Francisco José de Caldas.
          </p>
        </div>
        <span className={styles.heroNumber} aria-hidden="true">01</span>
      </header>

      <BreadCrumbs />

      <SectionTabs sections={SECTIONS} panels={panels} />
    </section>
  );
}
