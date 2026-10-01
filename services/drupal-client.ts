import "server-only";

/**
 * Cliente Drupal centralizado de la Capa_Servicios.
 *
 * Consolida la lógica de acceso a Drupal que hoy está duplicada en
 * `components/ti/tableros.ts`, `components/home/heroData.ts` y
 * `components/home/NewsSection.tsx`:
 *
 * - `resolveServerBaseUrl()`: resuelve la URL base del backend según el
 *   entorno (desarrollo / dentro de Docker), con reserva a localhost.
 * - `getFetchOptions()`: opciones de caché para `fetch` según el entorno
 *   (sin caché en desarrollo, revalidación por hora en el resto).
 * - `resolvePublicAssetUrl()`: convierte una ruta relativa de un asset de
 *   Drupal en una URL pública absoluta.
 */

/**
 * URL base del backend de Drupal usada en el servidor para construir las
 * peticiones JSON:API. Dentro de Docker se prefiere `DRUPAL_BASE_URL`; en
 * otros entornos, la URL pública. Reserva a `http://localhost:8080`.
 */
export function resolveServerBaseUrl(): string {
  const isServerInsideDocker = Boolean(
    process.env.DRUPAL_BASE_URL &&
      !process.env.NEXT_PUBLIC_DRUPAL_BASE_URL?.includes("localhost"),
  );

  return (
    (isServerInsideDocker
      ? process.env.DRUPAL_BASE_URL
      : process.env.NEXT_PUBLIC_DRUPAL_BASE_URL) ||
    process.env.DRUPAL_BASE_URL ||
    "http://localhost:8080"
  );
}

/**
 * Opciones de `fetch` según el entorno: en desarrollo se desactiva la caché
 * para ver cambios inmediatos; en el resto se revalida cada hora.
 */
export function getFetchOptions(): RequestInit {
  const isDev = process.env.NODE_ENV === "development";
  return isDev ? { cache: "no-store" } : { next: { revalidate: 3600 } };
}

/**
 * Resuelve la URL pública absoluta de un asset de Drupal a partir de su ruta
 * relativa. Si la ruta no se puede resolver, devuelve la ruta original.
 */
export function resolvePublicAssetUrl(relativePath: string): string {
  const publicBaseUrl =
    process.env.NEXT_PUBLIC_DRUPAL_BASE_URL || "http://localhost:8080";

  try {
    return new URL(relativePath, publicBaseUrl).toString();
  } catch {
    return relativePath;
  }
}
