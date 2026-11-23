# Procesos SIGUD: informe v2 (revisión 2, tras B1)

Todo se verificó en Chrome headless real (CDP) sobre `npm run build` servido desde `out/` con `shots-v2/serve.mjs` (puerto 4330). Los PNG se abrieron y se miraron. No se hizo ningún commit (regla del brief). Drupal respondió 200 en localhost:8080 durante el build.

Scripts y datos: `shots-v2/run.mjs`, `shots-v2/final/measurements.json` (build final, `embeddable: true`). `shots-v2/embed-test/` es una corrida anterior con iframes activos. `shots-v2/superseded-embeddable-false/` es la corrida de la entrega anterior (tarjeta sin iframe), conservada solo como referencia.

## Cambio de esta revisión (hallazgo B1)

- `content.ts`: `embeddable: true` en las tres secciones (comportamiento aprobado). Comentario actualizado.
- `EmbedPanel.tsx`: el enlace "Abrir en una pestaña nueva" pasó de debajo del visor a la fila del encabezado, junto al h2. Así queda visible sin scroll. La capa de carga con el botón principal a los 12 s se mantiene.
- `page.module.css`: se quita `.actions`; `.sectionHeading` ahora permite `flex-wrap` y `space-between`; el botón secundario tiene fondo blanco.
- No se tocó `section-tabs`, `bread-crumbs`, `page-hero` ni el footer.

## Causas raíz

1. **Documentos que no cargan.** Hay dos causas.
   - Bug de `EmbedPanel`: el iframe solo se montaba con `isLoading === false`, y `isLoading` solo cambiaba en el `onLoad` de ese mismo iframe. Quedaba un spinner infinito. Corregido.
   - Bloqueo de Daruma: las tres URLs responden 200 con `x-frame-options: SAMEORIGIN` y `content-security-policy: frame-ancestors 'self' planeacionud.udistrital.edu.co;`. Chrome cancela el iframe desde cualquier otro dominio (`net::ERR_BLOCKED_BY_RESPONSE`, visto en `final/measurements.json`). **Esto no se puede corregir desde el frontend.** Hay que pedir a Daruma que añada el dominio del sitio a `frame-ancestors`, o publicar el sitio en `planeacionud.udistrital.edu.co`.
   - Con `curl` (sin sesión) Daruma devuelve 500 o 200 según los encabezados enviados, así que las cabeceras citadas salen de las peticiones de Chrome registradas por CDP.
2. **Nombres de pestañas.** `content.ts` los había acortado. Ahora son exactamente "Admisiones, Registro y Control" (939), "Gestión de Docencia" (946) y "Gestión de laboratorios" (950), con ids `admisiones-registro-control`, `gestion-docencia`, `gestion-laboratorios`. La misma etiqueta se usa en la pestaña, el h2 y el `title` del iframe.
3. **Colores y aspecto.** `page.module.css` usaba grises genéricos y un `.page` con `max-width` que encerraba la barra sticky. Ahora la barra va a todo ancho y el contenido usa los mismos valores que `/sigud/organigrama/` (medidos en el navegador, idénticos): fondo `rgb(247,247,245)`, tarjeta blanca con `border-top: 4px solid rgb(253,180,0)`, sombra `0 5px 18px rgba(0,0,0,.08)`, padding 36px, kicker `rgb(140,25,25)` 14px/700/mayúsculas, h2 Montserrat 52px, pestaña activa roja con subrayado dorado. `--institutional-red` vale `#8c1919` en `globals.css` (`#a1021f` no existe como token en el repo); se usó el token, igual que las páginas hermanas.

## Peticiones de red (Chrome real, build final, ingeniería y artes-asab; 1440, 1024 y 390 px)

| Paso | Peticiones a darumasoftware |
|---|---|
| Carga inicial | solo `index=939` (200, luego cancelada por frame-ancestors) |
| Clic en pestaña 1 (ya activa) | ninguna |
| Clic en pestaña 2 | solo `index=946` |
| Clic en pestaña 3 | solo `index=950` |
| Teclado (→, →, ←) | 946, luego 950; el ← no genera petición (iframe ya montado) |
| Carga con `#gestion-docencia` | solo `index=946` (no se pide 939) |
| Carga con `#gestion-laboratorios` | solo `index=950` |

- Las flechas del teclado cambian de pestaña: docencia, laboratorios, docencia (1440 y 390, ambas facultades).
- Los hashes abren la pestaña correcta, con su panel sin `hidden` y el resto ocultos.
- El iframe de cada pestaña queda montado y el `onLoad` se dispara (la capa de carga desaparece en 0 a 600 ms). El `onLoad` se dispara aunque el contenido esté bloqueado, así que no sirve para detectar el bloqueo.
- Detección de panel activo: `ResizeObserver` sobre el `<article>`. Un panel con `hidden` no tiene caja y no dispara; al activarse (clic, teclado o hash) sí. Verificado en las tres vías.

## Estado "tarda más de lo esperado" (12 s)

Probado reteniendo la petición a Daruma con `Fetch.enable` de CDP (1 petición retenida). A los 3 s: "Cargando documento…". A los 14 s: "El documento tarda más de lo esperado." y el botón principal rojo "Abrir en una pestaña nueva", además del botón secundario del encabezado.

## Medidas de layout

| Viewport | Scroll horizontal de la página | Tablist | Enlace "Abrir" en scroll 0 (viewport 900 px de alto) |
|---|---|---|---|
| 1440 | no | cabe, sin desbordar | visible (y 713 a 759) |
| 1024 | no | cabe | visible (y 756 a 802) |
| 390 | no | desborda internamente con scroll propio, igual que las hermanas | **no completamente**: y 881 a 926, medio botón cae bajo el borde de 900 px; se ve tras un scroll de ~30 px |

A 390 px el hero ocupa casi toda la pantalla (cabecera, cinco botones, imagen, migas, pestañas), así que ningún contenido de esta página queda sobre el pliegue. El botón es lo primero que aparece al empezar a hacer scroll. No se redujo el hero (fuera del alcance).

## Lo que se ve en las capturas (`shots-v2/final/`, todas con tamaño real, 390 a 1440 px de ancho)

- `ingenieria-1440-tab1-viewport.png` (1440x900): hero de Ingeniería con cinco botones; "Procesos SIGUD" dorado, texto negro y desplazado a la derecha. Migas "Inicio / Facultades / Ingenieria / Procesos sigud". Barra de pestañas blanca a todo ancho con las tres etiquetas correctas y la primera activa en rojo con subrayado dorado. Kicker rojo "PROCESOS SIGUD", h2 "Admisiones, Registro y Control" y a la derecha el botón "Abrir en una pestaña nueva" con borde rojo. Debajo asoma la tarjeta con borde superior dorado.
- `ingenieria-1440-tab1-full.png`, `-tab2-full.png`, `-tab3-full.png` (1440x2391): la tarjeta contiene un visor gris con el icono de documento bloqueado de Chrome (cara triste), que es lo que Chrome pinta cuando Daruma impide la incrustación. **No se ve el documento.** La zona blanca inferior es el footer en modo cortina, que la captura completa no pinta.
- `ingenieria-1440-hash-gestion-docencia-full.png` y `...-laboratorios-full.png`: abren directamente la pestaña correcta, con el mismo visor bloqueado.
- `ingenieria-1024-tab*-full.png`: barra sin desbordar, mismo aspecto.
- `ingenieria-390-tab1-full.png`, `-tab2-full.png`: hero apilado, la barra de pestañas se corta en "Gestión de Docen…" y se desplaza por dentro. El h2 se parte en dos líneas y el botón "Abrir" queda debajo. El visor aparece **en blanco** (con borde), sin el icono de bloqueo; en 390 px emulado Chrome no pinta la página de bloqueo en la captura. Tampoco se ve el documento.
- `artes-asab-*`: mismo patrón que Ingeniería con el hero de Artes ASAB.
- `lento-1440-t14s-viewport.png` y `lento-390-t14s-viewport.png`: visor con spinner, "Cargando documento…", "El documento tarda más de lo esperado." y el botón rojo "Abrir en una pestaña nueva". `lento-1440-t3s-viewport.png`: solo spinner y texto de carga.
- `ref-organigrama-1440-viewport.png` / `-full.png` y `ref-organigrama-390-*`: referencia. Mismo patrón (fondo gris cálido, kicker, h2, tarjeta con borde dorado, barra de pestañas a todo ancho). Se diferencia en que organigrama tiene iconos en las pestañas (no se añadieron aquí; opcional).

## Comandos y resultados

- `npm run build`: sin errores; se generan las 7 rutas `/facultades/*/procesos-sigud` (ejecutado tras el último cambio de código).
- `npm run lint`: 0 errores, 10 warnings preexistentes (el brief decía 12), ninguno en `procesos-sigud`.
- Verificación en navegador: `node shots-v2/run.mjs` con `LABEL=final` (dos veces: la segunda solo para encuadrar las capturas del estado lento; el código no cambió entre ambas).
- Sin tests ni dependencias nuevas.

## No verificado o limitaciones

- **No se vio el documento de Daruma renderizado dentro del iframe.** Daruma lo bloquea para este origen (localhost); cualquier dominio no autorizado verá lo mismo: visor gris/blanco vacío más el botón "Abrir en una pestaña nueva" siempre visible. Necesita que Daruma autorice el dominio del sitio en `frame-ancestors`. Si se prefiere mostrar solo el enlace mientras tanto, basta con `embeddable: false` en `content.ts` (decisión del usuario).
- Con el dominio autorizado no se probó el aspecto del documento dentro del visor ni el atributo `sandbox` (`allow-same-origin allow-scripts allow-popups allow-forms`).
- A 390 px el botón "Abrir" no cabe entero sobre el pliegue de 900 px (ver tabla).
- A 390 px la pestaña activa puede quedar fuera de la vista dentro de la barra al abrir por hash. Depende de `SectionTabs`, excluido por el brief.
- No se añadieron iconos a las pestañas (opcional).
