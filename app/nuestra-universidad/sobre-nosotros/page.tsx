import type { Metadata } from "next";
import type { ReactNode } from "react";
import Image from "next/image";
import styles from "./page.module.css";
import BreadCrumbs from "@/components/common/bread-crumbs/bread-crumbs";
import { getRector } from "@/services/integrantes";
import SectionTabs from "./section-tabs";
import HistoriaTimeline from "./historia-timeline";
import Himno from "./himno";
import { SectionIcon, FUNCION_ICONS } from "./icons";
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
  HIMNO_REPUBLICA_VIDEO_URL,
  HIMNO_REPUBLICA_ESTROFAS,
  HIMNO_BOGOTA_VIDEO_URL,
  HIMNO_BOGOTA_ESTROFAS,
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
        <span className={styles.sectionHeadingIcon} aria-hidden="true">
          <SectionIcon id="funciones-misionales" />
        </span>
        <div>
          <p className={styles.sectionKicker}>Nuestra razón de ser</p>
          <h2 id="funciones-misionales-title">Funciones misionales</h2>
        </div>
      </div>

      <div className={styles.proseCard}>
        {FUNCIONES_INTRO.map((parrafo, index) => (
          <p key={index}>{parrafo}</p>
        ))}
      </div>

      <h3 className={styles.subheading}>Funciones generales</h3>

      <div className={styles.funcionesGrid}>
        {FUNCIONES.map((funcion, index) => {
          const Icono = FUNCION_ICONS[index] ?? FUNCION_ICONS[0];
          return (
            <div className={styles.funcionCard} key={funcion.titulo}>
              <span className={styles.funcionIcon} aria-hidden="true">
                <Icono />
              </span>
              <h3>{funcion.titulo}</h3>
              <p>{funcion.descripcion}</p>
            </div>
          );
        })}
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
        <span className={styles.sectionHeadingIcon} aria-hidden="true">
          <SectionIcon id="directivos" />
        </span>
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
        <span className={styles.sectionHeadingIcon} aria-hidden="true">
          <SectionIcon id="historia" />
        </span>
        <div>
          <p className={styles.sectionKicker}>Más de 70 años de historia</p>
          <h2 id="historia-title">Historia</h2>
        </div>
      </div>

      <div className={styles.proseCard}>
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
        <span className={styles.sectionHeadingIcon} aria-hidden="true">
          <SectionIcon id="simbolos" />
        </span>
        <div>
          <p className={styles.sectionKicker}>Identidad institucional</p>
          <h2 id="simbolos-title">Símbolos</h2>
        </div>
      </div>

      <h3 className={styles.subheading}>Himno institucional</h3>
      <Himno
        videoUrl={HIMNO_VIDEO_URL}
        estrofas={HIMNO_ESTROFAS}
        titulo="Video del Himno Institucional de la Universidad Distrital"
      />

      <h3 className={styles.subheading}>Himno de la República de Colombia</h3>
      <Himno
        videoUrl={HIMNO_REPUBLICA_VIDEO_URL}
        estrofas={HIMNO_REPUBLICA_ESTROFAS}
        titulo="Video del Himno Nacional de la República de Colombia"
      />

      <h3 className={styles.subheading}>Himno de Bogotá</h3>
      <Himno
        videoUrl={HIMNO_BOGOTA_VIDEO_URL}
        estrofas={HIMNO_BOGOTA_ESTROFAS}
        titulo="Video del Himno de Bogotá"
      />

      <div className={styles.graficosGrid}>
        {SIMBOLOS_GRAFICOS.map((simbolo) => (
          <div
            className={`${styles.graficoCard} ${simbolo.id === "escudo" ? styles.escudoCard : styles.banderaCard}`}
            key={simbolo.id}
          >
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
    <section className={styles.page} aria-label="Sobre Nosotros">
      <BreadCrumbs variant="onDark" />

      <SectionTabs sections={SECTIONS} panels={panels} />
    </section>
  );
}
