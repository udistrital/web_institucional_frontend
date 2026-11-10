/**
 * Utilidades de formato de fechas para contenidos (noticias y eventos).
 *
 * Las fechas provienen de Drupal como valores "solo fecha" almacenados a
 * medianoche UTC (p. ej. "2026-10-26T00:00:00Z"). Si se formatean con la zona
 * horaria local del navegador, un cliente en America/Bogota (UTC-5) vería el
 * día anterior (25 de octubre), mientras que el servidor (UTC) mostraría el 26.
 * Esa diferencia provoca un error de hidratación de React ("server rendered
 * text didn't match the client").
 *
 * Para que el render del servidor y del cliente sean idénticos —y para que el
 * día mostrado coincida con el día calendario almacenado— todos los
 * formateadores fijan `timeZone: "UTC"`.
 */

const dateFormatterLong = new Intl.DateTimeFormat("es-CO", {
  timeZone: "UTC",
  day: "numeric",
  month: "long",
  year: "numeric",
});

const dateFormatterShort = new Intl.DateTimeFormat("es-CO", {
  timeZone: "UTC",
  day: "numeric",
  month: "short",
  year: "numeric",
});

/** Formatea una fecha ISO como "26 de octubre de 2026". */
export function formatearFechaLarga(value: string): string {
  return dateFormatterLong.format(new Date(value));
}

/** Formatea una fecha ISO como "26 de oct de 2026". */
export function formatearFechaCorta(value: string): string {
  return dateFormatterShort.format(new Date(value));
}
