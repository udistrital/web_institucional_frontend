import type { ComponentType } from "react";

export interface Etapa {
  id: number;
  titulo: string;
  subtitulo: string;
  Content: ComponentType;
}

export interface Tramite {
  id: string;
  nombreTab: string;
  tituloFicha: string;
  /** Imagen de fondo de la ficha derecha (ruta dentro de /public). */
  imagen: string;
  quienPuedeAplicar: string;
  QuienPuedeContent?: ComponentType;
  fechas: string[];
  etapas: Etapa[];
}
