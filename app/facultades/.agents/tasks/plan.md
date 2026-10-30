# Implementation Plan — Rediseño de páginas de facultades

Cambios de diseño YA APROBADOS sobre la plantilla compartida de facultades. Se
editan SOLO estos cuatro archivos; no se tocan componentes globales
(`bread-crumbs`, `news-section`) ni las 7 rutas individuales
(`app/facultades/<slug>/page.tsx`), que renderizan `<FacultyPage slug=... />`.

Archivos a editar (rutas reales):
- `app/facultades/components/FacultyPage.tsx` (Server Component async — NO añadir `"use client"`)
- `app/facultades/components/faculty-page.module.css`
- `app/facultades/components/FacultyAcademicOffer.tsx` (Client Component, ya tiene `"use client"`)
- `app/facultades/components/faculty-academic-offer.module.css`

Referencias de estilo (NO editar, solo imitar):
- `app/components/home/home.module.css` → `.faculties-intro h2 / .news-section h2`
  (títulos: `font-family: var(--font-montserrat), sans-serif; font-weight: 700; line-height: .9`),
  `.news-more-link` (botón: fondo rojo, texto blanco, `border-radius: 5px`,
  hover dorado + texto negro), `.hero-link/.faculties-link` (`border-radius: 5px; font-weight: 600`).
- `app/nuestra-universidad/sobre-nosotros/page.tsx` → `<BreadCrumbs variant="onDark" />`
  como PRIMER elemento dentro del `<section>`.
- `app/globals.css` → tokens `--fs-*`, `--institutional-red` (#8c1919),
  `--institutional-gold` (#fdb400), `--font-montserrat`, `--lh-tight`.
- `components/common/news-section/news-section.tsx` → acepta prop `title`.
- `components/common/bread-crumbs/bread-crumbs.tsx` → única prop `variant`
  ("default" | "onDark"); deriva los segmentos de `usePathname()`.

Notas de arquitectura / decisiones:
- CSS Modules: las clases `.eyebrow`/`.heroLead` de `faculty-page.module.css` y de
  `app/facultades/page.module.css` son módulos DISTINTOS y están aisladas; borrar
  las de `faculty-page.module.css` NO afecta a `page.module.css`. Verificado con grep.
- No cambiar la lógica de datos: filtrado `slugFiltro(program.facultad) === facultySlug`,
  agrupación por nivel, orden Pregrado/Especialización/Maestría/Doctorado/otros y
  límite de 4 por nivel permanecen intactos.
- No pasar funciones ni datos no serializables del Server (`FacultyPage`) al Client
  (`FacultyAcademicOffer`). `FacultyPage` sigue siendo `async` Server Component.
- No añadir tests. No refactors no relacionados.

---

## TAREA 1 — Header, breadcrumbs, tipografía y título de noticias

- [ ] 1. Mover BreadCrumbs al tope y cambiar a variante onDark en `FacultyPage.tsx`.
      En la rama principal (facultad encontrada), colocar `<BreadCrumbs variant="onDark" />`
      como PRIMER hijo de `<section className={styles.page}>`, ANTES del `<header className={styles.hero}>`,
      igual que en `sobre-nosotros/page.tsx`. Eliminar la instancia actual
      `<BreadCrumbs variant="default" />` que está entre el hero y `styles.body`.
      No tocar la rama de facultad no encontrada (que no renderiza breadcrumbs).
      Files: `app/facultades/components/FacultyPage.tsx`
      Verify: `npm run build` desde `web_institucional_frontend` compila sin errores nuevos;
      inspección manual del JSX confirma que BreadCrumbs es el primer elemento y aparece una sola vez.

- [ ] 2. Eliminar el eyebrow y el heroLead del hero en `FacultyPage.tsx`.
      Quitar `<p className={styles.eyebrow}>Oferta académica por sede</p>` y el
      `<p className={styles.heroLead}>Conoce los programas académicos y niveles de formación de esta facultad.</p>`
      completos dentro de `styles.heroText`. Dejar solo el `<h1 className={styles.heroTitle}>`.
      Files: `app/facultades/components/FacultyPage.tsx`
      Verify: grep confirma que `styles.eyebrow` y `styles.heroLead` ya no se referencian en
      `FacultyPage.tsx`; `npm run build` compila sin errores nuevos.

- [ ] 3. Pasar el título de la facultad a NewsSection en `FacultyPage.tsx`.
      En la rama principal, cambiar `<NewsSection news={news} />` por
      `<NewsSection news={news} title={`Noticias · ${facultyHeading(faculty.title)}`} />`,
      reutilizando la función `facultyHeading` existente (produce "Facultad X" sin duplicar prefijo).
      No modificar la `<NewsSection news={news} />` de la rama de facultad no encontrada.
      Files: `app/facultades/components/FacultyPage.tsx`
      Verify: `npm run build` compila sin errores nuevos; el título "Noticias · Facultad ..." se
      genera para las rutas de facultad.

- [ ] 4. Borrar las reglas CSS huérfanas del hero y aplicar tipografía del home en `faculty-page.module.css`.
      Tras los pasos 2–3: eliminar las reglas `.eyebrow { ... }` y `.heroLead { ... }`
      (quedan sin uso — confirmado por grep: solo las usaba el hero de `FacultyPage.tsx`).
      En `.heroTitle` añadir `font-family: var(--font-montserrat), sans-serif; font-weight: 700; line-height: .9;`
      (conservar `font-size: var(--fs-h1)`; reemplazar el actual `line-height: var(--lh-tight)` por `.9`).
      En la regla combinada `.unavailable h1, .statusMessage h2` añadir
      `font-family: var(--font-montserrat), sans-serif; font-weight: 700;` para consistencia.
      Files: `app/facultades/components/faculty-page.module.css`
      Verify: `npm run lint` y `npm run build` sin errores nuevos; grep de `eyebrow`/`heroLead`
      en `faculty-page.module.css` no devuelve coincidencias.

---

## TAREA 2 — Tarjetas de oferta con revelado al hover (`FacultyAcademicOffer.tsx` + su CSS)

- [ ] 5. Rediseñar la estructura JSX de cada tarjeta de programa en `FacultyAcademicOffer.tsx`.
      Dentro de `level.programs.slice(0, 4).map((program) => { ... })`:
      - Elemento raíz condicional: si `program.paginaProgramaUrl` existe, raíz
        `<a href={program.paginaProgramaUrl} className={styles.programCard} aria-label={program.nombre}>`;
        si NO existe, raíz `<article className={styles.programCard}>` (no clicable). Usar una
        misma clase `styles.programCard` para ambos casos.
      - Conservar el bloque de media (`styles.programMedia`) con `programImage(program, faculty)`
        como fallback de imagen de la facultad y el fallback de inicial (`styles.programFallback`)
        cuando no hay ninguna imagen. Mantener el `<Image fill ... />` con su `alt` actual.
      - Superponer el nombre del programa en la parte inferior de la media sobre un degradado
        oscuro: añadir dentro de `styles.programMedia` un `<h3 className={styles.programTitle}>{program.nombre}</h3>`
        (o un contenedor con degradado + h3). Eliminar el antiguo `<h3>{program.nombre}</h3>` que
        estaba en `styles.programContent`.
      - Añadir el panel de revelado (hover/focus) que muestra SOLO Jornada y Modalidad:
        un `<div className={styles.programReveal}>` con un `<dl>` que renderice `Modalidad` y
        `Jornada` cada uno solo si existe (`program.modalidad` / `program.jornada` pueden ser null).
      - ELIMINAR por completo: `<p className={styles.programLevel}>{level.name}</p>`, el bloque de
        SNIES (`program.snies`), el bloque de acreditación `<p className={styles.accreditation}>` y
        el enlace "Ver programa" (`<a className={styles.programLink}>`). El `styles.programContent`
        y el `<dl className={styles.programDetails}>` anteriores dejan de usarse para estos campos;
        reemplazarlos por la nueva estructura (title en media + panel reveal).
      Files: `app/facultades/components/FacultyAcademicOffer.tsx`
      Verify: `npm run build` compila; inspección del DOM/JSX confirma tarjeta `<a>` cuando hay URL
      (con `aria-label`) y `<article>` cuando no; solo aparecen Jornada/Modalidad en el panel.

- [ ] 6. Rediseñar las tarjetas y el panel de revelado accesible en `faculty-academic-offer.module.css`.
      - `.programMedia`: cambiar `aspect-ratio: 16 / 9` a `aspect-ratio: 4 / 5` (imagen más grande).
        Mantener `position: relative; overflow: hidden`.
      - Añadir `.programTitle`: posicionado al fondo de la media (`position: absolute; inset-inline: 0; bottom: 0`),
        sobre un degradado oscuro (`background: linear-gradient(to top, rgb(0 0 0 / 82%), rgb(0 0 0 / 0%))`
        aplicado al título o a un contenedor), `color: #fff`, `font-family: var(--font-montserrat), sans-serif`,
        `font-weight: 700`, `line-height: var(--lh-tight)`, padding generoso, `z-index` por encima de la imagen.
      - Añadir `.programReveal`: panel superpuesto (p. ej. `position: absolute; inset: 0`) oculto en reposo
        (`opacity: 0; transform: translateY(8px); pointer-events: none`) con fondo semitransparente oscuro
        para legibilidad, y `transition: opacity 240ms ease, transform 240ms ease`.
      - Revelado por hover Y teclado: `.programCard:hover .programReveal`,
        `.programCard:focus-within .programReveal` → `opacity: 1; transform: translateY(0); pointer-events: auto`.
      - `.programCard` como enlace: asegurar `display: block/flex`, `position: relative`,
        `text-decoration: none`, `color: inherit`; mantener el foco visible (NO suprimir `:focus-visible`;
        el `a:focus-visible` global de `globals.css` aplica). Conservar el estilo de tarjeta
        (fondo, borde, borde-superior rojo, sombra).
      - `@media (hover: none)`: mostrar `.programReveal` siempre visible
        (`opacity: 1; transform: none; pointer-events: auto; position: static` o equivalente legible).
      - `@media (prefers-reduced-motion: reduce)`: `.programReveal { transition: none; }`.
      - ELIMINAR reglas huérfanas tras el paso 5: `.programLevel` (ambas apariciones: la del grupo
        `.eyebrow, .programLevel` — ver paso 9 — y la regla individual), `.accreditation`, `.programLink`
        (de la regla combinada `.programLink, .moreLink` dejar solo `.moreLink`; eliminar la regla
        individual `.programLink { ... }`). Las dejadas sin uso `.programContent`, `.programContent h3`,
        `.programDetails`, `.programDetails dt`, `.programDetails dd` deben eliminarse si ya no se
        referencian tras el rediseño (verificar con grep antes de borrar cada una).
      Files: `app/facultades/components/faculty-academic-offer.module.css`
      Verify: `npm run lint` y `npm run build` sin errores nuevos; grep de `programLevel`,
      `accreditation`, `programLink`, `programDetails`, `programContent` cruzado contra el `.tsx`
      confirma que no quedan clases referenciadas sin definición ni definiciones sin uso.

---

## TAREA 3 — Pestañas de nivel, encabezado de sección y botón final

- [ ] 7. Limpiar el encabezado de la sección de oferta en `FacultyAcademicOffer.tsx`.
      Dentro de `styles.offerHeading`: eliminar `<p className={styles.eyebrow}>Programas por nivel</p>`
      y eliminar el `<p className={styles.levelCount} aria-live="polite">...</p>` completo
      (contador "N programas"). Conservar el `<h2 id="faculty-offer-title">Oferta académica</h2>`.
      Files: `app/facultades/components/FacultyAcademicOffer.tsx`
      Verify: `npm run build` compila; el h2 "Oferta académica" permanece; ya no aparece el eyebrow
      ni el contador.

- [ ] 8. Cambiar el texto del botón final a "Ver todas las propuestas" en `FacultyAcademicOffer.tsx`.
      En el enlace `styles.moreLink`, reemplazar el texto "Ver más" por "Ver todas las propuestas".
      Conservar `href={catalogHref}` (= `/nuestra-universidad/oferta-academica?facultad=${facultySlug}&nivel=${slugFiltro(level.name)}`),
      `target="_blank"`, `rel="noopener noreferrer"` y la condición de render
      `level.programs.length > 4`.
      Files: `app/facultades/components/FacultyAcademicOffer.tsx`
      Verify: `npm run build` compila; el botón muestra "Ver todas las propuestas" y sigue apareciendo
      solo cuando el nivel tiene más de 4 programas.

- [ ] 9. Rediseñar tabs de nivel, h2 y botón final en `faculty-academic-offer.module.css`.
      - En la regla `.eyebrow, .programLevel`: eliminar `.eyebrow` del selector (queda huérfano tras
        paso 7). `.programLevel` se elimina en el paso 6; si ambos quedan sin uso, borrar la regla
        completa (verificar con grep).
      - Eliminar `.levelCount { ... }` (huérfana tras paso 7).
      - `.offerHeading h2`: añadir `font-family: var(--font-montserrat), sans-serif; font-weight: 700;`
        y cambiar `line-height` a `.9` (actualmente `var(--lh-tight)`). Conservar `font-size: var(--fs-h2)`.
      - Rediseñar `.tab` y `.activeTab` como píldoras inspiradas en los botones del home:
        `border-radius: 5px; font-weight: 600;`. Activo (`.activeTab`): `background: var(--institutional-red); color: #fff;`.
        Inactivo (`.tab`): fondo claro/con borde y `color: var(--institutional-red)`.
        Hover (`.tab:hover`): `background: var(--institutional-gold); color: #000;`.
        Quitar el patrón actual de `border-bottom` como indicador de activo. Conservar `flex: 0 0 auto`
        para scroll horizontal en `.tabs`. Mantener foco visible (no suprimir `:focus-visible` global).
      - Rediseñar `.moreLink` con el estilo de `.news-more-link` del home: centrado
        (`display: block; margin: 2.5rem auto 0; width: fit-content; text-align: center`),
        `background: var(--institutional-red); color: #fff; border-radius: 5px; font-weight: 600;`
        `padding: .7rem 2.7rem; text-decoration: none;`. Hover: `background: var(--institutional-gold); color: #000;`.
        Reemplazar la regla previa `.moreLink:hover { background: #e9a600; }` por el hover dorado.
      - La regla combinada `.programLink, .moreLink` debe quedar solo como estilo base de `.moreLink`
        o integrarse; eliminar lo específico de `.programLink`.
      Files: `app/facultades/components/faculty-academic-offer.module.css`
      Verify: `npm run lint` y `npm run build` sin errores nuevos; inspección confirma tabs tipo
      píldora con estados activo/inactivo/hover correctos, h2 en Montserrat 700, y botón final rojo
      centrado con hover dorado. Mantiene `role=tablist/tab/tabpanel`, `aria-selected`, `aria-controls`,
      `id`, `tabIndex` y `hidden` de tabpanels (sin cambios en el JSX de accesibilidad de tabs).

---

## Verificación final (toda la tarea)

Desde `/Users/Daniel/job-pagina-web/web_institucional_frontend`:

- [ ] 10. Ejecutar `npm run lint` — sin errores nuevos.
      Son aceptables los ~9 warnings preexistentes de footer/header; no debe aparecer ninguno nuevo
      en los cuatro archivos editados.

- [ ] 11. Ejecutar `npm run build` — compila sin errores nuevos y se generan las 7 rutas de facultades:
      `/facultades/artes-asab`, `/facultades/ciencias-educacion`,
      `/facultades/ciencias-matematicas-naturales`, `/facultades/ciencias-salud`,
      `/facultades/ingenieria`, `/facultades/medio-ambiente-recursos-naturales`,
      `/facultades/tecnologica`. Confirmar en la salida del build que las 7 páginas aparecen como
      generadas (estáticas o SSG según la configuración actual, sin cambiar su naturaleza).

- [ ] 12. Revisión de accesibilidad del revelado hover (manual/inspección):
      el panel Jornada/Modalidad se revela con `:hover` y con teclado (`:focus-within` al tabular
      hasta la tarjeta `<a>`), es visible permanentemente bajo `@media (hover: none)`, y respeta
      `prefers-reduced-motion: reduce` (sin transición). El foco de la tarjeta clicable permanece
      visible (outline global de `globals.css`).

## Posibles brechas / supuestos

- El panel de revelado se superpone a la imagen; se asume que basta mostrar Jornada/Modalidad sobre
  un fondo oscuro semitransparente para contraste AA. Si el diseño del home sugiere otra ubicación,
  mantener legibilidad (texto claro sobre fondo oscuro) como criterio.
- "Fuente más bold" para títulos se interpreta como `font-weight: 700` + Montserrat + `line-height: .9`,
  exactamente como los `h2` del home; se conserva `--fs-h1`/`--fs-h2` para no alterar tamaños.
- No se añaden dependencias ni se tocan servicios de datos (`services/*`, `lib/filtros`).
