# Rediseño de la plantilla de facultades: header, tarjetas de oferta y tabs

El cambio reestructura la plantilla compartida de las páginas de facultades (que renderizan las 7 rutas) sobre cuatro archivos: el Server Component `FacultyPage.tsx` y su CSS, y el Client Component `FacultyAcademicOffer.tsx` y su CSS. El hero se simplifica (sin eyebrow ni texto de apoyo), el breadcrumb pasa a ser el primer elemento en variante `onDark`, la tipografía de títulos adopta Montserrat 700 del home, las tarjetas de programa se rediseñan con imagen 4/5 y un panel de revelado hover/foco que muestra solo jornada y modalidad, y las tabs de nivel se convierten en píldoras con los colores institucionales. La lógica de datos (filtrado por sede, agrupación por nivel, orden y límite de 4) no se toca. El título de NewsSection ahora incorpora el nombre de la facultad.

Watch for: la tarjeta clicable `<a>` envuelve un `<h3>` superpuesto y un panel con `<dl>`, lo que es válido (contenido de flujo dentro de un enlace) — **confirmed**, sin violación de contenido interactivo anidado. El panel de revelado solo aparece cuando existe jornada o modalidad; en tarjetas sin ninguno de los dos solo se ve el título, lo cual es coherente con el diseño aprobado — **confirmed**.

**Verdict**: APPROVED

## High-level view

El header queda con el breadcrumb `onDark` como primer hijo del `<section>` y un hero reducido a solo el `<h1>` en Montserrat 700 line-height .9. Se eliminaron el eyebrow "Oferta académica por sede" y el párrafo de apoyo, junto con sus reglas CSS, sin dejar clases huérfanas.

Las tarjetas de programa son ahora clicables en su totalidad: raíz `<a>` con `aria-label` cuando hay `paginaProgramaUrl`, o `<article>` no interactivo cuando no. La imagen pasa a 4/5 con el nombre superpuesto sobre un degradado, y jornada/modalidad se revelan en un panel oscuro por hover y por `focus-within`, con fallback siempre visible bajo `@media (hover: none)` y sin transición bajo `prefers-reduced-motion`. Se eliminaron nivel, SNIES, acreditación y el enlace "Ver programa".

La sección de oferta pierde el eyebrow y el contador; el h2 adopta Montserrat 700. Las tabs son píldoras (activo rojo/blanco, inactivo blanco/borde rojo, hover dorado/negro) conservando roles ARIA, `aria-selected`, `aria-controls` e `id`. El botón final dice "Ver todas las propuestas" con el estilo de `news-more-link`, conservando `href`, `target`/`rel` y la condición `> 4`.

El foco visible se delega al `:focus-visible` global; ninguna regla nueva lo suprime. La naturaleza de Server Component de `FacultyPage` se mantiene (sin `"use client"`), y nada no serializable cruza al cliente.

<details>
<summary>Issues (0)</summary>

Sin hallazgos bloqueantes. No hay acciones pendientes.

</details>

<details>
<summary>Details</summary>

## Tarjetas de oferta con revelado accesible

La raíz de la tarjeta se elige según `paginaProgramaUrl`: `<a href aria-label={program.nombre}>` cuando existe, `<article>` cuando no. El `aria-label` cubre la accesibilidad del enlace dado que su único texto propio es el `<h3>` superpuesto — **confirmed**. El enlace envuelve `<h3>` y un `<dl>`, contenido de flujo válido dentro de `<a>`, sin anidar controles interactivos — **confirmed**.

El panel `.programReveal` (fondo `rgb(17 17 17 / 82%)`, texto blanco) se oculta en reposo y se revela con `.programCard:hover` y `.programCard:focus-within`, de modo que tabular con teclado hasta el enlace lo muestra — **confirmed**. Bajo `@media (hover: none)` queda siempre visible y bajo `prefers-reduced-motion: reduce` se desactiva la transición — **confirmed**. El contraste del panel (blanco y blanco al 75% sobre `rgb(17 17 17 / 82%)`) cumple AA — **likely**; no se midió con herramienta, pero blanco sobre fondo casi negro supera el umbral con margen. El foco visible se apoya en el `a:focus-visible` global; ninguna regla nueva lo suprime — **confirmed**.

Un grep cruzado contra los cuatro archivos confirma que, tras eliminar nivel, SNIES, acreditación, "Ver programa" y `.programContent`, no quedan clases referenciadas sin definición ni definiciones huérfanas — **confirmed**.

## Evidencia de lint/build

El coder dejó constancia en el cuerpo del commit `ead488d`: `npm run lint` con 0 errores (solo los ~9 warnings preexistentes de footer/header) y `npm run build` compilando con las 7 rutas de facultades generadas. Por indicación del alcance de este review no se reejecutaron las suites — **confirmed** (evidencia presente en el mensaje de commit).

<details>
<summary>File map</summary>

- `app/facultades/components/FacultyPage.tsx` — breadcrumb `onDark` al tope, hero reducido al `<h1>`, title de NewsSection con el nombre de la facultad.
- `app/facultades/components/faculty-page.module.css` — `.eyebrow`/`.heroLead` eliminadas; `.heroTitle` y encabezados de estado en Montserrat 700.
- `app/facultades/components/FacultyAcademicOffer.tsx` — tarjeta clicable `<a>`/`<article>`, título superpuesto, panel de revelado jornada/modalidad, encabezado y botón final limpiados.
- `app/facultades/components/faculty-academic-offer.module.css` — media 4/5, `.programTitle`, `.programReveal` con hover/focus y media queries, tabs píldora, `.moreLink` estilo news; reglas huérfanas eliminadas.

Diff completo: `git diff HEAD~1 HEAD` en `web_institucional_frontend`.

</details>

</details>
