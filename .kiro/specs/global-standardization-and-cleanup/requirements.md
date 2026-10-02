# Requirements Document

## Introduction

Esta especificación define una tarea de estandarización global, remediación y limpieza del frontend Next.js ubicado en `web_institucional_frontend/`. El objetivo es que todo el código fuente cumpla estrictamente las reglas de arquitectura de `AGENTS.md` y la skill de "Estandarización y Refactorización de Componentes UI", sin dejar archivos fuera del cumplimiento arquitectónico, y eliminar de forma segura el código de ejemplo o sin uso.

La tarea abarca tres frentes:

1. **Limpieza de código muerto**: eliminación segura del componente de ejemplo `Article` y, si se verifica que carecen de uso real en la aplicación institucional, de la ruta `app/[...slug]/page.tsx` y el servicio `services/articles.ts` (más sus artefactos asociados).
2. **Estandarización estructural total**: migración de todos los componentes restantes al patrón de carpeta individual con `[Nombre].tsx`, `[Nombre].types.ts` e `index.ts` (patrón barrel).
3. **Remediación global de calidad**: resolución de todas las advertencias de ESLint (variables/importaciones sin uso y etiquetas `<img>` nativas) y tipado estricto en todo el código heredado.

El resultado medible es que `npx eslint .` arroje 0 errores y 0 advertencias en todo el proyecto, preservando el diseño institucional existente sin alteraciones visuales.

**Contexto verificado del estado actual** (base para esta remediación):

- Componentes ya conformes al patrón barrel+tipos: `components/home/**`, `components/news-card/`, `components/news-list/`, `components/article/`.
- Componentes NO conformes (sin `index.ts` barrel y/o sin `[Nombre].types.ts` separado): `components/contact-widget/`, `components/emisoraLive/`, `components/footer/`, `components/header/` (incluyendo subcarpetas `audience-nav/` y `main-menu/`), `components/tarjet/`, `components/ti/`.
- ESLint actual (`npx eslint .`): 0 errores, 7 advertencias `@next/next/no-img-element` localizadas en `components/footer/footer.tsx` (4) y `components/header/brand.tsx` (3).
- El componente `Article` solo se usa dentro de la ruta de ejemplo `app/[...slug]/page.tsx`, que a su vez es el único consumidor de `services/articles.ts`.
- `next.config.ts` usa `output: "export"` con `images.unoptimized: true` y `remotePatterns` derivados de variables de entorno de Drupal; las imágenes de `footer`/`brand` provienen de SVGs locales en `/public`.
- `eslint.config.mjs` extiende `eslint-config-next/core-web-vitals` y `eslint-config-next/typescript`.

## Glossary

- **Frontend**: La aplicación Next.js ubicada en `web_institucional_frontend/`, incluyendo `app/`, `components/`, `services/`, `lib/` y `navegation/`.
- **Agente_Desarrollador**: El sistema responsable de ejecutar la auditoría, remediación y refactorización del Frontend conforme a esta especificación.
- **Reglas_AGENTS**: El conjunto de cinco reglas de arquitectura definidas en `AGENTS.md` (Separación de Responsabilidades, Capa de Servicios, Tipado Estricto, Componentización, Estilos).
- **Skill_Estandarizacion**: La skill "Estandarización y Refactorización de Componentes UI" de `AGENTS.md` que define la estructura obligatoria de cada componente.
- **Estructura_Componente**: La estructura de carpeta obligatoria de un componente visual: un archivo barrel `index.ts`, un archivo de lógica/UI `[NombreComponente].tsx` y un archivo de tipos `[NombreComponente].types.ts`.
- **Patron_Barrel**: El uso de un archivo `index.ts` que re-exporta el componente y sus tipos para mantener importaciones limpias.
- **Componente_Ejemplo_Article**: El conjunto de artefactos de demostración compuesto por `components/article/` (`Article.tsx`, `Article.types.ts`, `index.ts`), la ruta `app/[...slug]/page.tsx` y el servicio `services/articles.ts` con `services/articles.types.ts`.
- **Codigo_Sin_Uso**: Variables, importaciones, funciones o archivos que no son referenciados por ninguna parte activa del Frontend.
- **Advertencia_ESLint**: Cualquier mensaje de nivel `warning` emitido por `npx eslint .`.
- **Error_ESLint**: Cualquier mensaje de nivel `error` emitido por `npx eslint .`.
- **Componente_Imagen_Next**: El componente `<Image />` del módulo `next/image`.
- **Imagen_Nativa**: Una etiqueta HTML `<img>` usada directamente en el código JSX.
- **Diseno_Institucional**: El resultado visual existente del Frontend definido por sus clases Tailwind, módulos CSS y hojas de estilo asociadas.
- **Tipo_Explicito**: Una `interface` o `type` de TypeScript declarado para una prop, estado, parámetro o valor de retorno.
- **Validacion_Final**: La ejecución de `npx eslint .` sobre todo el Frontend al concluir la remediación.

## Requirements

### Requirement 1: Verificación de uso del Componente_Ejemplo_Article antes de eliminar

**User Story:** Como mantenedor del Frontend, quiero que el uso real de los artefactos del ejemplo Article sea verificado antes de eliminarlos, para no borrar código que la aplicación institucional sí utiliza.

#### Acceptance Criteria

1. WHEN la remediación comienza, THE Agente_Desarrollador SHALL buscar en todo el Frontend las referencias a `components/article`, `app/[...slug]/page.tsx` y `services/articles.ts`.
2. WHERE la ruta `app/[...slug]/page.tsx` y `services/articles.ts` no son referenciados por ningún archivo activo fuera del propio Componente_Ejemplo_Article, THE Agente_Desarrollador SHALL clasificar esos artefactos como Codigo_Sin_Uso elegible para eliminación.
3. IF algún archivo activo del Frontend distinto del Componente_Ejemplo_Article referencia `services/articles.ts` o la ruta `app/[...slug]/page.tsx`, THEN THE Agente_Desarrollador SHALL conservar el artefacto referenciado y registrar la dependencia encontrada.

### Requirement 2: Eliminación segura del Componente_Ejemplo_Article

**User Story:** Como mantenedor del Frontend, quiero eliminar por completo el componente de ejemplo Article y sus artefactos asociados sin uso, para mantener la base de código libre de demostraciones.

#### Acceptance Criteria

1. THE Agente_Desarrollador SHALL eliminar el directorio `components/article/` junto con `Article.tsx`, `Article.types.ts` e `index.ts`.
2. WHERE la verificación del Requirement 1 clasifica `app/[...slug]/page.tsx` como Codigo_Sin_Uso, THE Agente_Desarrollador SHALL eliminar el archivo `app/[...slug]/page.tsx` y su directorio contenedor `app/[...slug]/`.
3. WHERE la verificación del Requirement 1 clasifica `services/articles.ts` como Codigo_Sin_Uso, THE Agente_Desarrollador SHALL eliminar `services/articles.ts` y `services/articles.types.ts`.
4. WHEN la eliminación del Componente_Ejemplo_Article concluye, THE Agente_Desarrollador SHALL eliminar toda importación o referencia restante hacia los artefactos borrados en el resto del Frontend.
5. WHEN la eliminación del Componente_Ejemplo_Article concluye, THE Frontend SHALL compilar con `tsc --noEmit` sin errores.

### Requirement 3: Estandarización estructural de los componentes de navegación

**User Story:** Como desarrollador del Frontend, quiero que los componentes de navegación Header, Footer y menús sigan la Estructura_Componente, para alinearlos con la Skill_Estandarizacion.

#### Acceptance Criteria

1. THE Agente_Desarrollador SHALL migrar `components/footer/` a la Estructura_Componente con `Footer.tsx`, `Footer.types.ts` e `index.ts`.
2. THE Agente_Desarrollador SHALL migrar `components/header/` a la Estructura_Componente con `Header.tsx`, `Header.types.ts` e `index.ts`.
3. THE Agente_Desarrollador SHALL migrar cada componente de las subcarpetas `components/header/audience-nav/` y `components/header/main-menu/` a la Estructura_Componente con su `[Nombre].tsx`, `[Nombre].types.ts` e `index.ts` correspondientes.
4. WHEN un componente de navegación se migra a la Estructura_Componente, THE Agente_Desarrollador SHALL exportarlo mediante el Patron_Barrel desde su `index.ts`.
5. WHEN un componente de navegación cambia de ruta o nombre de archivo, THE Agente_Desarrollador SHALL actualizar todas las importaciones que lo referencian en el Frontend.

### Requirement 4: Estandarización estructural de los componentes restantes

**User Story:** Como desarrollador del Frontend, quiero que todos los componentes restantes sigan la Estructura_Componente, para que ningún archivo quede fuera del cumplimiento arquitectónico.

#### Acceptance Criteria

1. THE Agente_Desarrollador SHALL migrar `components/contact-widget/`, `components/emisoraLive/`, `components/tarjet/` y `components/ti/` a la Estructura_Componente con su `[Nombre].tsx`, `[Nombre].types.ts` e `index.ts` correspondientes.
2. WHERE un componente contiene lógica reutilizable no visual como hooks o utilidades (por ejemplo `components/emisoraLive/Hooks/useRadio.ts`), THE Agente_Desarrollador SHALL conservar esa lógica en un archivo dedicado separado del archivo `[NombreComponente].tsx`.
3. WHEN la migración estructural concluye, THE Agente_Desarrollador SHALL asegurar que cada directorio de componente bajo `components/` contiene un archivo `index.ts` que aplica el Patron_Barrel.
4. WHEN la migración estructural concluye, THE Agente_Desarrollador SHALL asegurar que cada componente bajo `components/` posee un archivo `[NombreComponente].types.ts` que contiene sus Tipo_Explicito.
5. WHEN un componente cambia de ruta o nombre de archivo, THE Agente_Desarrollador SHALL actualizar todas las importaciones que lo referencian en el Frontend.

### Requirement 5: Soporte de composición mediante className

**User Story:** Como desarrollador del Frontend, quiero que cada componente estandarizado acepte una prop `className`, para permitir la composición en layouts mayores conforme a la Skill_Estandarizacion.

#### Acceptance Criteria

1. THE Agente_Desarrollador SHALL definir en el archivo `[NombreComponente].types.ts` de cada componente estandarizado una prop opcional `className` de tipo `string`.
2. WHEN se provee un valor a la prop `className`, THE componente estandarizado SHALL aplicar ese valor a su elemento raíz.
3. WHEN no se provee la prop `className`, THE componente estandarizado SHALL renderizar con su Diseno_Institucional sin alterar su apariencia.

### Requirement 6: Estados de carga y error en datos asíncronos de cliente

**User Story:** Como usuario del Frontend, quiero que los componentes que cargan datos asíncronos en el cliente muestren estados de carga y error, para recibir retroalimentación visual conforme a la Skill_Estandarizacion.

#### Acceptance Criteria

1. WHERE un componente estandarizado depende de datos asíncronos obtenidos en el cliente, THE componente SHALL implementar un estado de carga visible mientras los datos están pendientes.
2. IF la obtención de datos asíncronos en el cliente falla, THEN THE componente SHALL mostrar un estado de error visible al usuario.
3. WHERE un componente no obtiene datos asíncronos en el cliente, THE Agente_Desarrollador SHALL omitir la implementación de estados de carga y error para ese componente.

### Requirement 7: Eliminación de variables e importaciones sin uso

**User Story:** Como mantenedor del Frontend, quiero que no existan variables ni importaciones sin uso en el código heredado, para eliminar las advertencias `@typescript-eslint/no-unused-vars`.

#### Acceptance Criteria

1. THE Agente_Desarrollador SHALL eliminar toda variable e importación identificada como Codigo_Sin_Uso en el Frontend.
2. WHEN se elimina una variable o importación sin uso, THE Agente_Desarrollador SHALL preservar el comportamiento funcional existente del archivo modificado.
3. WHEN la limpieza de código sin uso concluye, THE Validacion_Final SHALL reportar 0 advertencias de la regla `@typescript-eslint/no-unused-vars`.

### Requirement 8: Migración de Imagen_Nativa a Componente_Imagen_Next

**User Story:** Como desarrollador del Frontend, quiero reemplazar las etiquetas `<img>` nativas por el componente `<Image />` de `next/image`, para eliminar las advertencias `@next/next/no-img-element`.

#### Acceptance Criteria

1. THE Agente_Desarrollador SHALL reemplazar cada Imagen_Nativa de `components/footer/footer.tsx` y `components/header/brand.tsx` por un Componente_Imagen_Next.
2. WHEN se crea un Componente_Imagen_Next, THE Agente_Desarrollador SHALL definir dimensiones mediante atributos `width` y `height` o mediante el atributo `fill`.
3. WHEN se migra una Imagen_Nativa, THE Agente_Desarrollador SHALL analizar las clases Tailwind y CSS circundantes y aplicarlas al Componente_Imagen_Next de modo que el Diseno_Institucional se mantenga sin alteraciones visuales.
4. WHEN la migración de imágenes concluye, THE Validacion_Final SHALL reportar 0 advertencias de la regla `@next/next/no-img-element`.
5. IF el host de origen de una imagen remota migrada no está declarado en `remotePatterns` de `next.config.ts`, THEN THE Agente_Desarrollador SHALL declarar ese host en `remotePatterns`.

### Requirement 9: Tipado estricto global

**User Story:** Como mantenedor del Frontend, quiero que ninguna prop, estado o variable carezca de tipo explícito y que no exista el tipo `any`, para cumplir la regla de Tipado Estricto de Reglas_AGENTS.

#### Acceptance Criteria

1. THE Agente_Desarrollador SHALL asignar un Tipo_Explicito a cada prop de componente, estado y variable en los componentes heredados.
2. THE Agente_Desarrollador SHALL eliminar todo uso del tipo `any` en el Frontend, reemplazándolo por un Tipo_Explicito.
3. WHEN una respuesta de API se consume en el Frontend, THE Agente_Desarrollador SHALL representarla mediante una `interface` o `type` plano de TypeScript.
4. WHEN el tipado estricto concluye, THE Frontend SHALL compilar con `tsc --noEmit` sin errores.

### Requirement 10: Preservación de la separación de responsabilidades

**User Story:** Como arquitecto del Frontend, quiero que los componentes visuales no realicen peticiones HTTP ni conozcan la estructura JSON:API, para preservar las reglas de Separación de Responsabilidades y Capa de Servicios de Reglas_AGENTS.

#### Acceptance Criteria

1. IF un componente visual realiza una petición HTTP directa o conoce la estructura de JSON:API, THEN THE Agente_Desarrollador SHALL trasladar esa interacción de red a un servicio dentro de `services/` o `lib/api`.
2. THE servicio responsable de una interacción de red SHALL transformar la respuesta anidada de JSON:API en una interface plana de TypeScript antes de entregar los datos al componente.
3. WHEN la estandarización de un componente concluye, THE componente visual SHALL consumir datos únicamente mediante props o mediante servicios de la Capa de Servicios.

### Requirement 11: Validación final sin errores ni advertencias

**User Story:** Como responsable de calidad del Frontend, quiero que la validación final de ESLint arroje cero errores y cero advertencias, para confirmar que todo el proyecto cumple los estándares.

#### Acceptance Criteria

1. WHEN la remediación concluye, THE Agente_Desarrollador SHALL ejecutar la Validacion_Final mediante `npx eslint .` sobre todo el Frontend.
2. WHEN la Validacion_Final se ejecuta, THE Validacion_Final SHALL reportar 0 Error_ESLint en todo el Frontend.
3. WHEN la Validacion_Final se ejecuta, THE Validacion_Final SHALL reportar 0 Advertencia_ESLint en todo el Frontend.
4. IF la Validacion_Final reporta algún Error_ESLint o Advertencia_ESLint, THEN THE Agente_Desarrollador SHALL corregir la causa y repetir la Validacion_Final.

### Requirement 12: Preservación del comportamiento y del Diseno_Institucional

**User Story:** Como usuario del Frontend, quiero que la remediación no altere el comportamiento ni la apariencia visual existentes, para que la experiencia institucional se mantenga intacta.

#### Acceptance Criteria

1. WHEN la remediación de un componente concluye, THE componente SHALL preservar su comportamiento funcional previo a la remediación.
2. WHEN una refactorización de imágenes concluye, THE componente afectado SHALL mantener el Diseno_Institucional sin alteraciones visuales en dimensiones, posición ni espaciado.
3. WHEN la remediación completa concluye, THE Frontend SHALL compilar la build de producción de Next.js sin errores.
