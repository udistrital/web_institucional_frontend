import type { JsonApiParams } from "next-drupal";
import { drupal } from "../drupal";

const cacheOptions =
  process.env.NODE_ENV === "development"
    ? { cache: "no-store" as const }
    : { next: { revalidate: 3600 } as const };

/**
 * Consulta una colección de recursos en Drupal y devuelve los datos
 * deserializados por NextDrupal, sin transformarlos para ningún componente.
 * Los filtros y relaciones (`include`) se definen en cada getter específico.
 */
export function queryDrupalCollection<T>(
  resourceType: string,
  params: JsonApiParams,
): Promise<T> {
  return drupal.getResourceCollection<T>(resourceType, {
    params,
    ...cacheOptions,
  });
}
