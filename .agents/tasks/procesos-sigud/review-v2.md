# Revisión v2 (segunda pasada): Procesos SIGUD facultades

Veredicto: APPROVED. Sin bloqueantes.

## Verificación del bloqueante anterior (B1)
- `content.ts`: `embeddable: true` en las tres secciones. `EmbedPanel.tsx` monta el iframe con `activated` (ResizeObserver sobre el `<article>`), lo deja montado, y la capa de carga (`.overlay`) se oculta en `onLoad`. A los 12 s sin `onLoad` aparece el botón principal. El enlace secundario "Abrir en una pestaña nueva" está siempre en el encabezado de la sección.
- Evidencia en `shots-v2/final/measurements.json` (build final, Chrome real por CDP):
  - Carga inicial: una sola petición a Daruma (`index=939`). Clic en pestaña 2: solo 946. Clic en pestaña 3: solo 950. Teclado (→, →, ←) y hashes `#gestion-docencia` / `#gestion-laboratorios` abren la pestaña correcta y piden solo su documento (el 939 que aparece en el paso "clic-laboratorios" de `darumaPorPaso` es la navegación siguiente del script, no una petición extra; `clic3Daruma` contiene solo 950).
  - `hScroll: false` a 1440, 1024 y 390; el tablist cabe a 1440 y 1024 y a 390 se desplaza por dentro como en las páginas hermanas.
  - Estado lento: con la petición retenida, a 3 s "Cargando documento…", a 14 s texto de espera y botón principal rojo (`lento-1440-t14s-viewport.png`, abierta).
  - Enlace "Abrir" visible sin scroll a 1440 (y 713–759) y 1024; a 390 queda medio cortado a 900 px de alto, se ve con ~30 px de scroll. No bloquea.

## Capturas abiertas (todas con tamaño real, ninguna de 1x1)
- `ingenieria-1440-tab1-viewport.png` (1440x900): pestañas "Admisiones, Registro y Control", "Gestión de Docencia", "Gestión de laboratorios", sin desbordar; botón "Procesos SIGUD" dorado y desplazado; kicker rojo, h2 grande, tarjeta con borde superior dorado, barra de pestañas a todo el ancho.
- `ingenieria-390-tab1-viewport.png` y `ingenieria-390-tab2-full.png`: hero apilado, botón activo dorado, pestañas con scroll interno, h2 en dos líneas, botón "Abrir" bajo el h2.
- `ingenieria-1440-tab2-full.png`, `ingenieria-1024-tab3-full.png`: título de panel correcto por pestaña; visor con icono de documento bloqueado.
- `ref-organigrama-1440-viewport.png`: referencia. Mismo patrón (fondo `#f7f7f5`, kicker rojo, h2, tarjeta con borde dorado, barra a todo el ancho). Los colores medidos coinciden con organigrama (`colorsOrganigrama` = `colorsProcesos`).
- `lento-1440-t14s-viewport.png`: visor con spinner, texto de espera y botón rojo.

## Reglas y alcance
- `git log`: sin commits nuevos (HEAD 5d0178c). `git diff HEAD` sobre `bread-crumbs/` y `section-tabs/`: vacío; `page-hero` y footer sin cambios.
- Archivos modificados: los 4 de `procesos-sigud`, `FacultyPage.tsx` (pasa `slug`) y `FacultyQuickLinks.tsx` (enlace del hero a `/facultades/<slug>/procesos-sigud`). Son el trabajo del enlace del hero pedido en el mensaje 11 del usuario; no hay tests ni dependencias nuevas.
- Informe: build sin errores (7 rutas generadas), lint 0 errores (10 warnings preexistentes). No se re-ejecutaron.
- Nombres, orden, URLs e ids de las tres pestañas coinciden con el brief; la misma etiqueta se usa en pestaña, h2 e `title` del iframe.
- Color: se usan `var(--institutional-red)` (`#8c1919` en `globals.css`) y `var(--institutional-gold)`, igual que organigrama. `#a1021f` aparece en otros módulos del repo pero no como token global; usar el token coincide con las páginas hermanas, no bloquea.

## Limitación externa que debe conocer el usuario (no bloqueante)
Ninguna captura muestra el documento renderizado. Daruma responde a las tres URLs con `X-Frame-Options: SAMEORIGIN` y `Content-Security-Policy: frame-ancestors 'self' planeacionud.udistrital.edu.co`. Chrome cancela el iframe (`net::ERR_BLOCKED_BY_RESPONSE`, registrado en `measurements.json` con esas cabeceras) desde cualquier otro dominio. El frontend no puede corregirlo. El comportamiento con iframe es el aprobado y el coder lo restauró; hay que pedir a Daruma que autorice el dominio del sitio, o desplegar en `planeacionud.udistrital.edu.co`. Mientras tanto el visor aparece gris y el usuario llega al documento con el botón "Abrir en una pestaña nueva" del encabezado. El `onLoad` se dispara aunque el contenido esté bloqueado, por eso el botón rojo de los 12 s no aparece en ese caso; el enlace secundario sí.
