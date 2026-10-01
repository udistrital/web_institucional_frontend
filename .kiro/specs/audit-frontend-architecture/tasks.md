# Implementation Plan: Auditoría y Remediación de la Arquitectura Frontend

## Overview

El plan se divide en dos mitades que se refuerzan mutuamente. Primero se levanta el **tooling de auditoría** y el **framework de pruebas** (el proyecto no tiene ninguno hoy: `package.json` solo declara `next`/`react`/`eslint`), porque el proceso de auditoría genera el `Informe_Auditoria` que justifica y prioriza la remediación, y las pruebas de propiedad verifican tanto los detectores como los mappers. Después se construye la **Capa_Servicios** (`services/`) y, sobre ella, la **descomposición de componentes** en contenedores/presentacionales con la estructura estándar. Cada tarea de remediación referencia la `Verificacion_Conformidad` (Req 12): `tsc --noEmit` limpio, `eslint` limpio en archivos modificados y chequeo estructural.

El lenguaje de implementación es **TypeScript** (el diseño lo usa de forma explícita: `tsc`, `fast-check`, extensiones `.ts`/`.tsx`).

## Tasks

- [x] 1. Configurar framework de pruebas y estructura del tooling de auditoría
  - [x] 1.1 Instalar y configurar Vitest + fast-check
    - Añadir `vitest`, `fast-check` y `@vitest/coverage` a `devDependencies` en `package.json` con versiones fijadas
    - Crear `vitest.config.ts` (entorno `node` para tooling/servicios, `jsdom` para pruebas de render presentacional)
    - Añadir scripts `"test": "vitest --run"` y `"test:watch": "vitest"` a `package.json`
    - Crear directorio `scripts/audit/` y `tests/` (o colocación `*.test.ts` junto a fuentes) según convención elegida
    - _Requirements: Testing Strategy (Configuración PBT)_

  - [x] 1.2 Definir el modelo de datos del informe de auditoría
    - Crear `scripts/audit/types.ts` con `Severidad`, `ReglaArquitectura`, `Hallazgo`, `Omision`, `ItemInventario`, `InformeAuditoria`
    - Todas las interfaces con tipado explícito, sin `any`
    - _Requirements: 7.1, 7.2, 7.3, 7.4_

- [x] 2. Implementar el recorrido de FS y el inventario del frontend
  - [x] 2.1 Implementar el walker de `app/` y `components/`
    - Crear `scripts/audit/walk.ts`: recolectar `page.tsx` bajo `app/` (con su ruta asociada), y `.tsx`/`.ts` bajo `components/`
    - Manejar `app/` ausente o sin `page.tsx` registrando la ausencia y continuando (no interrumpir)
    - Registrar `Omision` con motivo cuando un archivo no exista/no sea legible/no sea texto válido y continuar
    - _Requirements: 1.1, 1.2, 1.3, 2.5, 5.6_

  - [x] 2.2 Implementar el clasificador de inventario ordenado
    - Crear `scripts/audit/inventory.ts`: aplicar orden estricto módulo-datos → contenedor → presentacional
    - Un elemento con operación de red se clasifica como módulo de datos aunque además componga componentes
    - _Requirements: 1.4, 1.5_

  - [x] 2.3* Prueba de propiedad para la clasificación de inventario
    - **Feature: audit-frontend-architecture, Property 6: Clasificación de inventario mutuamente excluyente y ordenada**
    - **Validates: Requirements 1.5**
    - fast-check, mín. 100 iteraciones, un único test para la propiedad; generar perfiles de elemento (con/sin red, con/sin composición/estado) y verificar categoría única según el orden

- [x] 3. Implementar los detectores de análisis estático
  - [x] 3.1 Implementar el detector de red
    - Crear `scripts/audit/detectors/network.ts`: detectar `fetch(`, `XMLHttpRequest` e imports de clientes HTTP, con archivo + número de línea de cada ocurrencia
    - _Requirements: 2.1_

  - [x] 3.2* Prueba de propiedad para el detector de red
    - **Feature: audit-frontend-architecture, Property 4: El detector de red identifica toda ocurrencia con su línea**
    - **Validates: Requirements 2.1, 2.3**
    - fast-check, mín. 100 iteraciones, un único test; generar contenido sintético con N ocurrencias en líneas conocidas y verificar conteo exacto y líneas correctas (0 hallazgos cuando no hay ninguna)

  - [x] 3.3 Implementar el detector JSON:API
    - Crear `scripts/audit/detectors/jsonapi.ts`: detectar acceso a `.data`/`.attributes`/`.relationships`/`.included` con archivo + número de línea
    - _Requirements: 2.2_

  - [x] 3.4 Implementar la evaluación de hallazgos y severidad de separación de responsabilidades
    - Crear `scripts/audit/detectors/separation.ts`: registrar hallazgo (regla separación de responsabilidades) con archivo + línea de la primera ocurrencia
    - Asignar severidad: alta si hay petición HTTP directa, media si hay acceso JSON:API sin petición directa, baja en otro caso del alcance del Req 2
    - _Requirements: 2.3, 2.4_

  - [x] 3.5* Prueba de propiedad para la asignación de severidad
    - **Feature: audit-frontend-architecture, Property 5: Asignación de severidad consistente con la regla**
    - **Validates: Requirements 2.4**
    - fast-check, mín. 100 iteraciones, un único test; generar perfiles de componente visual y verificar exactamente una severidad de {alta, media, baja} según la regla

- [x] 4. Checkpoint - Detectores e inventario
  - Ensure all tests pass, ask the user if questions arise.

- [~] 5. Implementar los chequeos de conformidad restantes del Sistema_Auditoria
  - [x] 5.1 Implementar el chequeo de la Capa_Servicios
    - Crear `scripts/audit/checks/services-layer.ts`: verificar existencia de `services/` o `lib/api/`; si faltan ambos, hallazgo severidad alta con lista de directorios esperados
    - Marcar módulos de datos fuera de la capa (severidad media) con ruta actual y ruta destino recomendada
    - Marcar funciones que devuelvan JSON:API sin transformar (severidad media) con su ubicación
    - Registrar imposibilidad de completar el chequeo preservando resultados si el directorio raíz es inaccesible
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

  - [x] 5.2 Implementar el chequeo de tipado estricto
    - Crear `scripts/audit/checks/typing.ts`: ejecutar `tsc --noEmit`, leer `tsconfig.compilerOptions.strict`, detectar `any` explícito/implícito y props sin `interface`/`type`, con archivo + línea
    - Registrar hallazgo si `strict` no es `true` (con ruta del archivo de config) y por cada `any`/prop sin tipo
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_

  - [x] 5.3 Implementar el chequeo estructural de componentes
    - Crear `scripts/audit/checks/structure.ts`: verificar por componente `[Name].tsx` (PascalCase = nombre de carpeta), `[Name].types.ts`, `index.ts` que exporte el componente y prop `className?: string` opcional
    - Registrar un hallazgo por cada elemento incumplido con ruta y criterio; registrar omisiones y continuar
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6_

  - [x] 5.4 Implementar el chequeo de estados de carga/error
    - Crear `scripts/audit/checks/client-state.ts`: en archivos con `'use client'`, detectar obtención asíncrona en cliente (promesa cuyo resultado llega al estado renderizado)
    - Registrar hallazgo por Estado_Carga o Estado_Error ausente indicando el tipo; excluir componentes cliente sin datos asíncronos
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

  - [x] 5.5* Pruebas de ejemplo para los chequeos estructural y de tipado
    - Casos de ejemplo: componente conforme vs no conforme (falta `types.ts`, falta barrel, falta `className`); `strict: true` presente vs ausente
    - _Requirements: 4.3, 5.1, 5.2, 5.3, 5.4_

- [x] 6. Implementar el generador del Informe_Auditoria
  - [x] 6.1 Implementar el generador y el runner de auditoría
    - Crear `scripts/audit/report.ts`: emitir `docs/audit-report.md` agrupado por regla, cada hallazgo con archivo, línea, severidad y remediación; secciones de inventario y omisiones; "Regla cumplida" explícito para reglas sin hallazgos
    - Crear `scripts/audit/index.ts` que orquesta walk → detectores → chequeos → generación, y un script `"audit"` en `package.json`
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_

  - [x] 6.2 Generar el Informe_Auditoria inicial sobre el estado actual
    - Ejecutar el runner de auditoría para producir `docs/audit-report.md` con los hallazgos base (NewsSection, `[...slug]/page.tsx`, ausencia de `services/`, `tableros.ts`/`heroData.ts` mal ubicados, `components/home/` plano)
    - _Requirements: 7.1, 7.5_

- [x] 7. Checkpoint - Tooling de auditoría completo
  - Ensure all tests pass, ask the user if questions arise.

- [x] 8. Crear el cliente Drupal centralizado de la Capa_Servicios
  - [x] 8.1 Implementar `services/drupal-client.ts`
    - Crear `services/drupal-client.ts` con `import "server-only"`, `resolveServerBaseUrl()`, `getFetchOptions()` y `resolvePublicAssetUrl()`, consolidando la lógica hoy duplicada en `tableros.ts`/`heroData.ts`/`NewsSection.tsx`
    - Verificación: `tsc --noEmit` limpio + `eslint` limpio en el archivo modificado (Verificacion_Conformidad, Req 12.3, 12.4)
    - _Requirements: 8.1, 8.3_

  - [x] 8.2* Prueba de propiedad para la resolución de URL de assets
    - **Feature: audit-frontend-architecture, Property 3: Resolución de URL de imagen es determinista y absoluta o nula**
    - **Validates: Requirements 8.3, 9.2**
    - fast-check, mín. 100 iteraciones, un único test; para cualquier ruta relativa/referencia, `resolvePublicAssetUrl` devuelve URL absoluta bien formada o el valor de reserva, y aplicar dos veces produce el mismo resultado (idempotencia)

- [x] 9. Implementar el servicio de noticias
  - [x] 9.1 Crear `services/news.types.ts` e implementar `services/news.ts`
    - Crear `services/news.types.ts` con `NewsItem` plano y `NewsResult { items; hasError }`
    - Crear `services/news.ts` con `import "server-only"`, tipos JSON:API privados, `mapNewsResource` privado puro y `getNews(): Promise<NewsResult>` que usa `drupal-client`; ante fallo devuelve `{ items: [], hasError: true }` sin exponer JSON:API
    - Migrar toda la lógica JSON:API/mapeo/resolución de imagen fuera de `NewsSection.tsx`
    - Verificación: `tsc --noEmit` + `eslint` limpios en archivos modificados (Req 12.3, 12.4)
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 9.4_

  - [x] 9.2* Prueba de propiedad para el mapper de noticias (sin fuga de estructura)
    - **Feature: audit-frontend-architecture, Property 1: El mapeo nunca filtra estructura JSON:API**
    - **Validates: Requirements 8.3, 8.4, 9.2**
    - fast-check, mín. 100 iteraciones, un único test; generar respuestas JSON:API arbitrarias (con `included`/`relationships` variados) y verificar que el `NewsItem` solo contiene las claves de su interface y ninguna de `data`/`attributes`/`relationships`/`included`

  - [x] 9.3* Prueba de propiedad para la señalización de error del servicio de noticias
    - **Feature: audit-frontend-architecture, Property 2: Señalización de error tipada ante fallo**
    - **Validates: Requirements 8.5**
    - fast-check, mín. 100 iteraciones, un único test; con `fetch` mockeado para fallar (red y `!response.ok`), `getNews` devuelve `{ hasError: true }` sin lanzar ni exponer JSON:API

- [x] 10. Implementar el servicio de artículos
  - [x] 10.1 Crear `services/articles.types.ts` e implementar `services/articles.ts`
    - Crear `services/articles.types.ts` con `Articulo` plano, unión discriminada `ArticuloResult` (`ok`/`not-found`/`error`) y `ArticuloParam`
    - Crear `services/articles.ts` con `import "server-only"`, tipos JSON:API privados, mapper privado puro, `getArticleBySlug(...)` y `getArticleParams()`; migrar la lógica JSON:API/fetch fuera de `app/[...slug]/page.tsx`
    - Verificación: `tsc --noEmit` + `eslint` limpios en archivos modificados (Req 12.3, 12.4)
    - _Requirements: 8.1, 8.3, 8.4, 8.5, 9.4_

  - [x] 10.2* Prueba de propiedad para el mapper de artículos (sin fuga de estructura)
    - **Feature: audit-frontend-architecture, Property 1: El mapeo nunca filtra estructura JSON:API** (aplicada a `Articulo`)
    - **Validates: Requirements 8.3, 8.4, 9.2**
    - Reutilizar el generador JSON:API arbitrario y verificar el conjunto exacto de claves de `Articulo`; incluir el caso `not-found`/`error` de `ArticuloResult` como señalización tipada
    - Nota: es la misma Property 1 aplicada a otro mapper (no duplica el test único de la 9.2; cubre la superficie de artículos)

- [x] 11. Reubicar los módulos de datos ya conformes a la Capa_Servicios
  - [x] 11.1 Reubicar `tableros.ts` y `heroData.ts` a `services/`
    - Mover `components/ti/tableros.ts` → `services/tableros.ts` y `components/home/heroData.ts` → `services/hero.ts`, preservando comportamiento (`Tablero`, `CategoryNode`, `TablerosData`, `HeroSlide`, `getTablerosData`, `getHeroSlides`)
    - Refactorizar para usar `drupal-client` compartido donde aplique; actualizar todas las importaciones que los referencian
    - Verificación: `tsc --noEmit` + `eslint` limpios en archivos modificados (Req 12.3, 12.4)
    - _Requirements: 8.1, 8.3, 9.4, 10.5_

- [x] 12. Checkpoint - Capa de servicios completa
  - Ensure all tests pass, ask the user if questions arise.

- [~] 13. Descomponer NewsSection en contenedor + presentacionales
  - [x] 13.1 Crear los presentacionales `NewsList` y `NewsCard`
    - Crear `components/news-list/NewsList.tsx` + `NewsList.types.ts` (props tipadas con `items: NewsItem[]` y `className?: string`) + `index.ts` (barrel)
    - Crear `components/news-card/NewsCard.tsx` + `NewsCard.types.ts` (`className?: string`) + `index.ts`; solo render desde props, sin red ni JSON:API
    - Usar estilos consistentes con el Sistema_Diseno sin nuevas dependencias visuales
    - Verificación: `tsc --noEmit` + `eslint` + chequeo estructural (Req 12.3, 12.4, 12.5)
    - _Requirements: 9.1, 9.2, 10.1, 10.2, 10.3, 10.4, 12.1, 12.2_

  - [x] 13.2 Convertir `NewsSection` en contenedor en su carpeta estándar
    - Crear `components/home/NewsSection/NewsSection.tsx` (server component contenedor) + `NewsSection.types.ts` (`className?: string`) + `index.ts`
    - Llamar a `getNews()`, elegir `fallbackNews` cuando `hasError` o lista vacía, y renderizar `NewsList` con datos planos; eliminar el `NewsSection.tsx` plano anterior
    - Verificación: `tsc --noEmit` + `eslint` + chequeo estructural (Req 12.3–12.5)
    - _Requirements: 9.1, 9.3, 10.1, 10.2, 10.3, 10.4, 11.3_

  - [x] 13.3* Pruebas de ejemplo de render para `NewsList`/`NewsCard`
    - Pruebas de ejemplo (jsdom): render con datos, lista vacía y con `className` aplicada
    - _Requirements: 9.1, 9.2_

- [x] 14. Descomponer la ruta de artículo en contenedor + presentacional
  - [x] 14.1 Crear el presentacional `Article` y refactorizar la ruta `[...slug]`
    - Crear `components/article/Article.tsx` + `Article.types.ts` (`articulo: Articulo`, `className?: string`) + `index.ts`; solo render desde props
    - Refactorizar `app/[...slug]/page.tsx` para invocar `getArticleBySlug`/`getArticleParams`, mantener `notFound()` cuando el servicio devuelve `not-found`/`error`, y renderizar `Article` con datos planos
    - Verificación: `tsc --noEmit` + `eslint` + chequeo estructural del nuevo componente (Req 12.3–12.5)
    - _Requirements: 9.1, 9.2, 9.3, 10.1, 10.2, 10.3, 10.4, 11.3_

  - [x] 14.2* Prueba de ejemplo de render para `Article`
    - Render con un `Articulo` plano y con `className`; verificar ausencia de acceso JSON:API
    - _Requirements: 9.2_

- [x] 15. Estandarizar el resto de `components/home/*` al patrón por carpeta
  - [x] 15.1 Migrar las secciones restantes de `components/home/` a carpetas estándar
    - Mover cada sección (`HeroSection`, `EnrollmentSection`, `FacultiesSection`, `FacultyShowcaseSection`, `QuickLinksSection`, `ServicesSection`, `StudentServicesSection`, `UniversityPromoSection`, `HeroCarousel`) a su carpeta con `[Name].tsx`, `[Name].types.ts` (con `className?: string`) e `index.ts`
    - Mantener `useSwipe.ts` y `home.module.css` encapsulados junto a sus consumidores; conservar el barrel `components/home/index.ts` reexportando desde las nuevas carpetas para no romper `@/components/home`
    - Actualizar importaciones directas a archivos; `HeroSection` consume `getHeroSlides` desde `services/hero`
    - Verificación: `tsc --noEmit` + `eslint` + chequeo estructural (Req 12.3–12.5)
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5, 12.1, 12.2_

- [~] 16. Verificación de conformidad y prueba de integración
  - [x] 16.1 Re-ejecutar la auditoría y confirmar la Verificacion_Conformidad
    - Ejecutar el runner de auditoría (`docs/audit-report.md`) tras la remediación y confirmar que las reglas cubiertas figuran como "Regla cumplida"
    - Confirmar `tsc --noEmit` sin errores y `eslint` sin errores en los archivos modificados; confirmar estructura de cada componente remediado
    - _Requirements: 12.3, 12.4, 12.5_

  - [x] 16.2* Pruebas de integración representativas contra Drupal JSON:API
    - 1–3 integration/smoke tests que ejerciten `getNews`/`getArticleBySlug` contra el backend (o un fixture representativo) verificando interfaces planas
    - _Requirements: 8.2, 8.3_

- [x] 17. Checkpoint final - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Las tareas marcadas con `*` son opcionales (pruebas: unitarias, de propiedad, de integración) y pueden omitirse para un MVP más rápido; no deben implementarse automáticamente.
- Cada tarea referencia requisitos específicos para trazabilidad.
- Las 6 propiedades de corrección se implementan con un único test de propiedad cada una (fast-check, mín. 100 iteraciones), etiquetado "Feature: audit-frontend-architecture, Property {n}: {texto}". Property 1 se aplica a las superficies de noticias (9.2) y artículos (10.2); el test único canónico de la propiedad es 9.2.
- El tooling de auditoría y el framework de pruebas van primero porque informan y verifican la remediación; la Capa_Servicios precede a la descomposición de componentes; los tests de mapper acompañan al servicio que cubren.
- La `Verificacion_Conformidad` (Req 12) — `tsc --noEmit` limpio, `eslint` limpio en archivos modificados y chequeo estructural — se aplica en cada tarea de remediación.

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1"] },
    { "id": 1, "tasks": ["1.2", "8.1"] },
    { "id": 2, "tasks": ["2.1", "8.2", "9.1", "10.1", "11.1"] },
    { "id": 3, "tasks": ["2.2", "2.3", "3.1", "3.3", "5.1", "5.2", "9.2", "9.3", "10.2", "13.1", "14.1"] },
    { "id": 4, "tasks": ["3.2", "3.4", "5.3", "5.4", "13.2", "13.3", "14.2", "15.1"] },
    { "id": 5, "tasks": ["3.5", "5.5", "6.1"] },
    { "id": 6, "tasks": ["6.2", "16.1", "16.2"] }
  ]
}
```
