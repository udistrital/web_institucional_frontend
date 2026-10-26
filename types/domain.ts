export type Faculty = {
  id: string;
  title: string;
  href: string;
  attributes: {
    title: string;
    field_correo_electronico?: string | null;
    field_direccion?: string | null;
    field_horario?: string | null;
    field_nombre_decano?: string | null;
    field_pagina_web?: { uri?: string | null } | null;
    field_pbx?: { processed?: string | null } | null;
  };
  imageUrl: string | null;
  imageAlt: string;
};

export type HeroSlide = {
  id: string;
  title: string;
  description: string;
  image: string;
  mobileImage: string;
  mobileWidth: number | null;
  mobileHeight: number | null;
  alt: string;
  linkUrl: string | null;
  linkTitle: string | null;
};

export type NewsItem = {
  id: string;
  title: string;
  description: string;
  image: string;
  alt: string;
  publishedAt: string;
  href?: string;
};

export type ActividadAcademica = {
  id: string;
  titulo: string;
  nota: string | null;
  articulo: number | null;
  esFechaLimite: boolean;
  fechaInicio: string | null;
  fechaFin: string | null;
  periodo: string | null;
  categoria: string | null;
  tematica: string | null;
  responsables: string[];
  audiencias: string[];
};

export type FiltrosCalendario = {
  texto: string;
  desde: string;
  hasta: string;
  categoria: string;
  tematica: string;
  audiencia: string;
  semestres: string[];
};

export type TableroPlatform = string;

export type Tablero = {
  id: string;
  title: string;
  embedUrl: string | null;
  linkTitle: string | null;
  platform: TableroPlatform | null;
  order: number;
  categoryTid: number | null;
};

export type CategoryNode = {
  tid: number;
  id: string;
  name: string;
  weight: number;
  parentTid: number | null;
  path: string[];
  children: CategoryNode[];
  tableros: Tablero[];
};
