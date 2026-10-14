# Implementation Plan: Estandarización Global, Remediación y Limpieza

## Overview

Este plan convierte el diseño de remediación por fases en una serie de tareas de código incrementales para el Frontend Next.js (App Router, `output: "export"`, TypeScript, Tailwind + CSS Modules). Cada tarea construye sobre las anteriores respetando el orden de fases (0→6) y, dentro de la Fase 3, el orden hojas→raíces para que las importaciones internas apunten siempre a los barrels nuevos.

El objetivo medible es que `npx eslint .` reporte 0 errores y 0 advertencias, que `tsc --noEmit` compile sin errores y que `next build` genere la build de producción sin errores, preservando el Diseno_Institucional.

Las verificaciones de herramienta (`tsc --noEmit`, `npx eslint .`, `next build`) se ejecutan como línea base y tras cada hito. Las Propiedades 1–6 se implementan como verificaciones deterministas de árbol fuente; las Propiedades 7–9 como pruebas property-based con `fast-check` (mínimo 100 iteraciones), cada test etiquetado `Feature: global-standardization-and-cleanup, Property {N}: {texto}`.

## Tasks

- [x] 1. Fase 0 — Capturar línea base de verificación
  - Ejecutar `tsc --noEmit`, `npx eslint .` y `next build` y registrar el estado inicial (se espera: 0 errores de tsc, 0 errores + 7 advertencias `@next/next/no-img-element`, build correcta)
  - Confirmar que la línea base sirve de referencia para detectar regresiones tras cada fase
  - _Requirements: 11.1, 11.2, 12.3_

- [x] 2. Fase 1 — Eliminación segura del Componente_Ejemplo_Article
  - [x] 2.1 Verificar referencias y eliminar la ruta de ejemplo
    - Buscar (grep) referencias a `components/article`, `services/articles` y `app/[...slug]` en el código fuente activo (excluyendo `.next/` y `node_modules/`)
    - Eliminar `app/[...slug]/page.tsx` y su carpeta `app/[...slug]/` (consumidor, se borra primero)
    - _Requirements: 1.1, 1.2, 1.3, 2.2_

  - [x] 2.2 Eliminar servicio y componente del ejemplo
    - Eliminar `services/articles.ts` y `services/articles.types.ts`
    - Eliminar `components/article/` (`Article.tsx`, `Article.types.ts`, `index.ts`)
    - Eliminar toda importación o referencia residual a los artefactos borrados en el resto del Frontend
    - _Requirements: 2.1, 2.3, 2.4_

  - [x] 2.3 Confirmar compilación tras la eliminación
    - Ejecutar `tsc --noEmit` y confirmar 0 errores (sin módulos no encontrados)
    - _Requirements: 2.5_

- [x] 3. Fase 2 — Convertir `.jsx` de emisoraLive a `.tsx` tipado
  - [x] 3.1 Convertir `LiveBadge.jsx` a `LiveBadge.tsx` tipado
    - Crear `LiveBadge.types.ts` con `LiveBadgeProps` (`isPlaying: boolean`, `label?: string`, `className?: string`)
    - Renombrar/convertir a `LiveBadge.tsx` consumiendo el tipo; preservar clases y comportamiento
    - _Requirements: 4.1, 9.1, 9.2_

  - [x] 3.2 Convertir `PlayButton.jsx` a `PlayButton.tsx` tipado
    - Crear `PlayButton.types.ts` con props derivadas del contrato de `useRadio` (`onToggle: () => void`, `isPlaying: boolean`, `isLoading: boolean`, `className?: string`)
    - Renombrar/convertir a `PlayButton.tsx` consumiendo el tipo
    - _Requirements: 4.1, 9.1, 9.2_

  - [x] 3.3 Convertir `VolumeSlider.jsx` a `VolumeSlider.tsx` tipado
    - Crear `VolumeSlider.types.ts` con props (`volume: number`, `onChange: (v: number) => void`, `isMuted: boolean`, `className?: string`)
    - Renombrar/convertir a `VolumeSlider.tsx` consumiendo el tipo
    - _Requirements: 4.1, 9.1, 9.2_

  - [x] 3.4 Reordenar hooks en `Hooks/useRadio.ts`
    - Mover la declaración `useState(isMuted)` final junto al resto de hooks al inicio del cuerpo, manteniendo llamadas incondicionales y mismo orden de ejecución
    - Confirmar `tsc --noEmit` sin errores tras la conversión
    - _Requirements: 4.2, 9.4, 12.1_

- [x] 4. Fase 3 (hojas) — Estandarizar hijos de `main-menu/` y `audience-nav/`
  - [x] 4.1 Mover lógica no visual de `main-menu/` a archivos dedicados
    - Conservar/consolidar `navigation.ts` (datos + tipo `NavigationItem`), `icons.tsx` y `menu-icon.tsx` como archivos de soporte separados (no Estructura_Componente)
    - _Requirements: 4.2_

  - [x] 4.2 Estandarizar componentes individuales de `main-menu/`
    - Para `MainMenu`, `Aspirantes`, `Buscador`, `Campus`, `Internacionalizacion`, `NuestraUniversidad`, `OfertaAcademica`, `SearchResults`: crear `[Nombre].tsx`, `[Nombre].types.ts` (con `className?: string`) e `index.ts` barrel (PascalCase)
    - Renombrar `mani-menu.module.css` → `main-menu.module.css` y actualizar sus importaciones
    - Aplicar el patrón de merge de `className` al elemento raíz de cada componente
    - Actualizar todas las importaciones internas al nuevo barrel/nombre
    - _Requirements: 3.3, 3.4, 3.5, 4.3, 4.4, 5.1, 5.2, 5.3, 10.3_

  - [x] 4.3 Estandarizar componentes de `audience-nav/`
    - Para `AudienceNav` y `AudienceButton`: crear `[Nombre].tsx`, `[Nombre].types.ts` (con `className?: string`) e `index.ts` barrel
    - Aplicar el patrón de merge de `className`; actualizar importaciones
    - _Requirements: 3.3, 3.4, 3.5, 5.1, 5.2, 5.3_

  - [x] 4.4 Verificar compilación de las hojas de navegación
    - Ejecutar `tsc --noEmit` y confirmar 0 errores de módulo
    - _Requirements: 3.5, 9.4_

- [x] 5. Fase 3 (raíz de navegación) — Estandarizar `Header` y `Brand`
  - [x] 5.1 Estandarizar `Brand`
    - Crear `Brand.tsx`, `Brand.types.ts` (con `className?: string`) e `index.ts` barrel en `components/header/`
    - Aplicar patrón de merge de `className`; actualizar importaciones
    - _Requirements: 3.2, 3.4, 3.5, 5.1, 5.2, 5.3_

  - [x] 5.2 Estandarizar `Header` e integrar hijos
    - Crear `Header.tsx`, `Header.types.ts` (con `className?: string`) e `index.ts` barrel
    - Integrar `Brand`, `AudienceNav`, `MainMenu` vía sus barrels nuevos
    - Conservar `use-hide-on-scroll.ts` y `dropdown-motion.ts` como archivos de soporte dedicados; revisar imports relativos tras renombrados
    - Actualizar todas las importaciones de `Header` en el Frontend
    - _Requirements: 3.2, 3.4, 3.5, 4.2, 5.1, 5.2, 5.3_

  - [x] 5.3 Verificar compilación tras la raíz de navegación
    - Ejecutar `tsc --noEmit` y confirmar 0 errores
    - _Requirements: 3.5, 9.4_

- [x] 6. Fase 3 (independientes) — Estandarizar `Footer`, `ContactWidget`, `Tarjet`, `Ti`, `EmisoraLive`
  - [x] 6.1 Estandarizar `Footer`
    - Crear `Footer.tsx`, `Footer.types.ts` (con `className?: string`) e `index.ts` barrel; conservar `footer.module.css`
    - Aplicar patrón de merge de `className`; actualizar importaciones
    - _Requirements: 3.1, 3.4, 3.5, 5.1, 5.2, 5.3_

  - [x] 6.2 Estandarizar `ContactWidget`
    - Crear `ContactWidget.tsx`, `ContactWidget.types.ts` (con `className?: string`) e `index.ts` barrel
    - Aplicar patrón de merge de `className`; actualizar importaciones
    - _Requirements: 4.1, 4.3, 4.4, 4.5, 5.1, 5.2, 5.3_

  - [x] 6.3 Estandarizar `Tarjet`
    - Crear `Tarjet.tsx` (o nombre semántico equivalente), `Tarjet.types.ts` (con `className?: string`) e `index.ts` barrel
    - Aplicar patrón de merge de `className`; actualizar importaciones
    - _Requirements: 4.1, 4.3, 4.4, 4.5, 5.1, 5.2, 5.3_

  - [x] 6.4 Estandarizar `Ti` (`TableroIframe`, `TablerosExplorer`)
    - Añadir `[Nombre].types.ts` (con `className?: string`) e `index.ts` barrel; conservar lógica ya tipada
    - Aplicar patrón de merge de `className`; actualizar importaciones
    - _Requirements: 4.1, 4.3, 4.4, 4.5, 5.1, 5.2, 5.3_

  - [x] 6.5 Estandarizar `EmisoraLive`
    - Crear `EmisoraLive.tsx`, `EmisoraLive.types.ts` (con `className?: string`), `index.ts` barrel; incluir `Programacion`, y los convertidos `LiveBadge`/`PlayButton`/`VolumeSlider`
    - Conservar `Hooks/useRadio.ts` como archivo dedicado
    - Exponer visualmente `isLoading` (indicador de carga) y el estado de error de reproducción en `EmisoraLive`/`PlayButton`
    - Aplicar patrón de merge de `className`; actualizar importaciones
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 5.1, 5.2, 5.3, 6.1, 6.2_

  - [x] 6.6 Verificar compilación tras la Fase 3
    - Ejecutar `tsc --noEmit` y confirmar 0 errores
    - _Requirements: 3.5, 4.5, 9.4_

- [x] 7. Checkpoint — Verificar estado tras estandarización estructural
  - Ensure all tests pass, ask the user if questions arise.
  - Ejecutar `tsc --noEmit`, `npx eslint .` y `next build`; confirmar que no hay regresiones respecto a la línea base
  - _Requirements: 11.1, 12.3_

- [x] 8. Fase 4 — Migrar `<img>` a `next/image`
  - [x] 8.1 Migrar imágenes de `footer.tsx`
    - Reemplazar cada `<img>` por `<Image/>` de `next/image` con `width`/`height` o `fill`, mapeando clases Tailwind/CSS existentes (p. ej. `h-10 w-auto`) y usando `unoptimized` para SVGs locales
    - Para `fill`, envolver en contenedor `relative` dimensionado para no alterar posición ni espaciado
    - _Requirements: 8.1, 8.2, 8.3, 12.2_

  - [x] 8.2 Migrar imágenes de `header/brand.tsx`
    - Reemplazar las 3 `<img>` por `<Image/>` con dimensiones explícitas o `fill`, preservando clases y layout; `unoptimized` para SVGs locales
    - _Requirements: 8.1, 8.2, 8.3, 12.2_

  - [x] 8.3 Verificar ausencia de advertencias de imagen
    - Ejecutar `npx eslint .` y confirmar 0 advertencias `@next/next/no-img-element`; confirmar que no se requieren `remotePatterns` nuevos (imágenes locales en `/public`)
    - _Requirements: 8.4, 8.5_

- [x] 9. Fase 5 — Tipado estricto global y limpieza de código sin uso
  - [x] 9.1 Eliminar usos de `any` y tipar props/estado/variables
    - Sustituir `: any`, `as any`, `<any>` por el Tipo_Explicito correcto o `unknown` con estrechamiento en todo el Frontend
    - Asignar Tipo_Explicito a cada prop, estado y variable heredada aún sin tipar
    - _Requirements: 9.1, 9.2, 9.3_

  - [x] 9.2 Eliminar variables e importaciones sin uso
    - Eliminar todo Codigo_Sin_Uso identificado preservando el comportamiento funcional de cada archivo
    - _Requirements: 7.1, 7.2, 7.3_

  - [x] 9.3 Verificar tipado y limpieza
    - Ejecutar `tsc --noEmit` (0 errores) y `npx eslint .` (0 advertencias `@typescript-eslint/no-unused-vars`)
    - _Requirements: 7.3, 9.4_

- [x] 10. Pruebas deterministas de árbol fuente (Propiedades 1–6)
  - [x]* 10.1 Verificación determinista de estructura de componente
    - **Property 1: Estructura de componente completa** (cada dir. de componente tiene 1 `index.ts` barrel + `[Nombre].types.ts`)
    - **Validates: Requirements 3.3, 3.4, 4.3, 4.4**

  - [x]* 10.2 Verificación determinista de integridad de importaciones
    - **Property 2: Integridad de importaciones tras renombrar** (sin imports a rutas/nombres antiguos; `tsc --noEmit` sin errores de módulo)
    - **Validates: Requirements 3.5, 4.5**

  - [x]* 10.3 Verificación determinista de ausencia de referencias a artefactos eliminados
    - **Property 3: Ausencia de referencias a artefactos eliminados** (sin referencias a `components/article`, `services/articles`, `services/articles.types`, `app/[...slug]`)
    - **Validates: Requirements 2.4**

  - [x]* 10.4 Verificación determinista de ausencia de `<img>` nativas
    - **Property 4: Ausencia de imágenes nativas** (ningún `.tsx` activo contiene `<img>`)
    - **Validates: Requirements 8.1, 8.4**

  - [x]* 10.5 Verificación determinista de ausencia del tipo `any`
    - **Property 5: Ausencia del tipo `any`** (ningún `.ts`/`.tsx` usa `: any`, `as any`, `<any>`)
    - **Validates: Requirements 9.2**

  - [x]* 10.6 Verificación determinista de ausencia de `.jsx`
    - **Property 6: Ausencia de archivos sin tipar** (ningún archivo `.jsx` bajo `components/`)
    - **Validates: Requirements 4.1, 9.1**

- [x] 11. Pruebas property-based con fast-check (Propiedades 7–9)
  - [x]* 11.1 Property test de composición mediante `className`
    - **Property 7: Composición mediante `className`** (con `className` generada → clase presente junto a clases base; sin `className` → clases base intactas)
    - Usar `fast-check`, mínimo 100 iteraciones; etiqueta `Feature: global-standardization-and-cleanup, Property 7: Composición mediante className`
    - **Validates: Requirements 5.2, 5.3**

  - [x]* 11.2 Property test de mapeo estado→UI en emisoraLive
    - **Property 8: Mapeo de estado a UI en datos asíncronos de cliente** (estado `loading` → indicador de carga visible; estado `error` → indicador de error visible)
    - Usar `fast-check`, mínimo 100 iteraciones; etiqueta `Feature: global-standardization-and-cleanup, Property 8: Mapeo de estado a UI en datos asíncronos de cliente`
    - **Validates: Requirements 6.1, 6.2**

  - [x]* 11.3 Property test de aplanamiento JSON:API
    - **Property 9: Aplanamiento de respuestas JSON:API** (respuesta JSON:API válida → objeto plano conforme a la interfaz, sin exponer `data`/`attributes`/`relationships`)
    - Usar `fast-check`, mínimo 100 iteraciones; etiqueta `Feature: global-standardization-and-cleanup, Property 9: Aplanamiento de respuestas JSON:API`
    - **Validates: Requirements 10.2**

- [x] 12. Fase 6 — Validacion_Final y preservación visual
  - Ejecutar `npx eslint .` y confirmar 0 errores y 0 advertencias; corregir la causa raíz y repetir si aparece algún hallazgo
  - Ejecutar `tsc --noEmit` sin errores y `next build` (`output: "export"`) sin errores
  - Comparar la build de producción para confirmar preservación visual de `footer`/`brand` (dimensiones, posición, espaciado)
  - _Requirements: 11.1, 11.2, 11.3, 11.4, 12.2, 12.3_

- [x] 13. Checkpoint final — Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.
  - _Requirements: 11.1, 11.2, 11.3_

## Notes

- Las tareas marcadas con `*` son opcionales (suites de prueba de Propiedades 1–9). No son estrictamente necesarias para el objetivo central de "0 errores/0 advertencias de ESLint" y la estandarización, que se garantiza con las puertas de herramienta (`tsc`, `eslint`, `next build`) de las tareas no opcionales.
- Cada tarea referencia requisitos específicos para trazabilidad.
- Se respeta el orden de fases (0→6) y, en la Fase 3, el orden hojas→raíces para evitar importaciones rotas.
- Las migraciones son atómicas por componente; ante un fallo de `tsc`/`eslint`/`build` se revierte solo el último componente migrado.
- No se incluyen tareas de despliegue, métricas de usuario ni actividades fuera del alcance de código.

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1"] },
    { "id": 1, "tasks": ["2.1"] },
    { "id": 2, "tasks": ["2.2"] },
    { "id": 3, "tasks": ["2.3", "10.3"] },
    { "id": 4, "tasks": ["3.1", "3.2", "3.3"] },
    { "id": 5, "tasks": ["3.4"] },
    { "id": 6, "tasks": ["4.1"] },
    { "id": 7, "tasks": ["4.2", "4.3"] },
    { "id": 8, "tasks": ["4.4"] },
    { "id": 9, "tasks": ["5.1"] },
    { "id": 10, "tasks": ["5.2"] },
    { "id": 11, "tasks": ["5.3"] },
    { "id": 12, "tasks": ["6.1", "6.2", "6.3", "6.4", "6.5"] },
    { "id": 13, "tasks": ["6.6"] },
    { "id": 14, "tasks": ["8.1", "8.2"] },
    { "id": 15, "tasks": ["8.3"] },
    { "id": 16, "tasks": ["9.1"] },
    { "id": 17, "tasks": ["9.2"] },
    { "id": 18, "tasks": ["9.3"] },
    { "id": 19, "tasks": ["10.1", "10.2", "10.4", "10.5", "10.6", "11.1", "11.2", "11.3"] }
  ]
}
```
