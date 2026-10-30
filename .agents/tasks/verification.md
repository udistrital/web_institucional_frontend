# Nota de verificación — Build estático en CI sin Drupal

Objetivo: `ALLOW_EMPTY_EXPORT=true npm run build` debe terminar en **exit code 0**
generando el sitio estático (`output: "export"`) aunque Drupal no esté levantado
(entorno CI). El arreglo correcto es tolerar datos vacíos y degradar con gracia, sin
cambiar la estrategia de rendering a dinámico/SSR.

## Cómo se simuló CI (Drupal caído)

En este entorno había un Drupal real escuchando en `localhost:8080`, así que un build
sin variables hubiera usado datos reales y no habría reproducido el fallo. NO se apagó
Drupal; en su lugar se apuntó la base URL a un puerto no alcanzable para forzar el
`fetch failed` (equivalente al `ECONNREFUSED` de CI):

```
DRUPAL_BASE_URL=http://127.0.0.1:9 NEXT_PUBLIC_DRUPAL_BASE_URL=http://127.0.0.1:9 \
  ALLOW_EMPTY_EXPORT=true npm run build
```

cwd: `/home/nico_guz/Escritorio/web institucional/web_institucional_frontend`.

Nota: en el CI real (`.github/workflows/ci.yml`) no existe `.env.local`, así que
`getServerBaseUrl()` cae en `http://localhost:8080` y los fetch fallan igual. El
resultado del fix es el mismo: el build tolera los fallos y no revienta.

## Causa raíz y barrido completo de prerender

Dos puntos abortaban el prerender estático cuando Drupal no responde:

1. **`app/components/home/FacultiesSection.tsx` (página `/`)** — con `faculties`
   vacío, `(start + index) % faculties.length` daba `NaN` → `faculties[NaN]` →
   `undefined` → `faculty.href` lanzaba `TypeError: Cannot read properties of
   undefined (reading 'href')`, abortando el prerender de `/`. Era el crash del log
   original del usuario. `services/facultades.ts` devolvía `[]` en error.

2. **`services/actividades.ts` → `/nuestra-universidad/calendario-academico`** —
   `cargarActividadesAcademicas()` hacía `if (process.env.NODE_ENV === "production")
   throw error;` a propósito para no publicar un calendario vacío. En un export
   estático ese throw aborta el prerender y mata el build. La página YA tenía la rama
   `noDisponible` ("Calendario no disponible") lista para este caso.

Resto de servicios/páginas revisados y ya resistentes (no requerían cambios): `hero`
(`fallbackHeroSlides`), `noticias` (`fallbackNews`), `integrantes`/`getRector` (`[]` /
`null`), `facultades` page (estado vacío), `acerca-de` (try/catch), `tableros`/`ti`
(`hasError`), `oferta-academica` (`Promise.allSettled` + `noDisponible`), `sitemap`
(estático). Carruseles cliente `HeroCarousel` y `news-carousel` ya hacen guard de
array vacío; `TramitesTabs` usa `% length` sobre datos de navegación estáticos, no de
Drupal.

## Cambios realizados

1. **`services/facultades.ts`**: añadido `fallbackFaculties` no vacío (1 entrada con
   `imageUrl: null`, `href: "/facultades"`), espejando `fallbackHeroSlides` de
   `services/hero.ts`. `getFaculties()` devuelve los datos mapeados si hay, y
   `fallbackFaculties` si el mapeo queda vacío o el fetch falla (antes devolvía `[]`).
2. **`app/components/home/FacultiesSection.tsx`**: resistente a array vacío y a
   elementos `undefined`. Early return con estado seguro (solo intro + enlace "Ver
   facultades") cuando no hay facultades; `move()` y `visible` evitan `% 0`; `visible`
   filtra `undefined`; keys de listas por `faculty.id ?? index` en vez de `title`.
   Comportamiento idéntico cuando `faculties` tiene datos.
3. **`services/actividades.ts`**: eliminado el `throw error` condicionado a producción.
   Ahora el `catch` siempre devuelve `{ actividades: [], noDisponible: true }`, de modo
   que la página de calendario prerenderiza su aviso "Calendario no disponible" cuando
   Drupal no responde. Camino de datos reales intacto cuando Drupal sí responde. No se
   introdujo ninguna variable de entorno nueva; degradar con gracia es el único
   comportamiento.

## Comandos ejecutados y resultados

- `DRUPAL_BASE_URL=http://127.0.0.1:9 NEXT_PUBLIC_DRUPAL_BASE_URL=http://127.0.0.1:9 ALLOW_EMPTY_EXPORT=true npm run build`
  → **EXIT=0**
  → `✓ Generating static pages using 3 workers (25/25)`
  → sin `Error occurred prerendering`, sin `Cannot read properties of undefined`, sin
    `exiting the build`.
  → 8 líneas de log `fetch failed` / "No se pudo..." (ESPERADAS: prueban que Drupal
    estaba caído; están capturadas, no revientan el build).
  → `out/` generado con `out/index.html`,
    `out/nuestra-universidad/oferta-academica/index.html` y
    `out/nuestra-universidad/calendario-academico/index.html` (23 `index.html` en total).
  → Verificado en el HTML emitido: la home contiene el fallback "Conoce nuestras
    facultades" y el calendario contiene "Calendario no disponible".

- `npm run lint`
  → 0 errores, 9 warnings PREEXISTENTES ajenos a estos cambios (`<img>` en
    `footer.tsx`/`brand.tsx`, `ariaHidden` sin usar en `menu-icon.tsx`, `FacultyIcon`
    sin usar en `nuestra-universidad.tsx`). Ninguno en los archivos tocados.

## Resumen del build (rutas generadas, todas estáticas ○)

```
Route (app)                                        Revalidate  Expire
┌ ○ /                                                      1h      1y
├ ○ /_not-found
├ ○ /acerca-de
├ ○ /facultades                                            1h      1y
├ ○ /facultades/artes-asab
├ ○ /facultades/artes-asab/extension
├ ○ /facultades/ciencias-educacion
├ ○ /facultades/ciencias-matematicas-naturales
├ ○ /facultades/ciencias-salud
├ ○ /facultades/ingenieria
├ ○ /facultades/medio-ambiente-recursos-naturales
├ ○ /facultades/tecnologica
├ ○ /forocsu/integrantes                                   1h      1y
├ ○ /nuestra-universidad/calendario-academico              1h      1y
├ ○ /nuestra-universidad/oferta-academica                  1h      1y
├ ○ /nuestra-universidad/sobre-nosotros                    1h      1y
├ ○ /perfiles
├ ○ /perfiles/administrativos
├ ○ /perfiles/aspirantes
├ ○ /perfiles/educadores
├ ○ /perfiles/estudiantes
├ ○ /sitemap.xml
└ ○ /ti                                                    1h      1y
○  (Static)  prerendered as static content
```

El bloque `<!-- BEGIN:nextjs-agent-rules -->` de `AGENTS.md` quedó intacto.
