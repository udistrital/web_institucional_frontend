# Implementation Plan

Decisiones: dividir el trabajo en dos features secuenciales porque el rendimiento debe quedar resuelto antes de ajustar la presentación. La carga específica reutilizará el normalizador y la paginación existentes, pero mantendrá `cargarOfertaAcademica` intacta para el catálogo global. La plantilla seguirá siendo un Server Component que pasa datos serializables al Client Component interactivo; el helper de títulos será puro y la variante `faculty` de breadcrumbs tendrá una rama aislada para no modificar `default` ni `onDark`.

- [ ] 1. Añadir la carga filtrada de programas y el fallback en `services/oferta-academica.ts`.
      Parametrizar internamente la colección de programas para aceptar el filtro JSON:API de `field_facultad.name`, crear `cargarOfertaPorFacultad(nombreFacultad)` sin consultas de vocabularios, y devolver el resultado compatible con `ResultadoOfertaAcademica`. Si Drupal rechaza el filtro o responde vacío, recuperar con `obtenerProgramas()` y filtrar por `slugFiltro`; conservar `noDisponible`, los diagnósticos de error y `OPCIONES_CACHE` (`no-store` en desarrollo y `revalidate: 3600` en producción). No cambiar `cargarOfertaAcademica`.
      Files: `services/oferta-academica.ts`, `lib/oferta-academica.ts` (solo si hace falta reutilizar tipos o normalización)
      Verify: `npm run lint` y `npm run build` desde `/Users/Daniel/job-pagina-web/web_institucional_frontend`; ambos deben terminar sin errores.

- [ ] 2. Cambiar `FacultyPage` al flujo de carga por facultad, conservando la seguridad y la integración actual.
      Iniciar `getFacultyBySlug(slug)` y `getNews()` en paralelo; después de resolver la facultad, llamar al nuevo loader con `faculty.title`, conservar el filtro `slugFiltro` antes de agrupar/serializar, propagar `noDisponible` y mantener el título de noticias. Este paso debe dejar intactos los datos serializables que recibe `FacultyAcademicOffer`.
      Files: `app/facultades/components/FacultyPage.tsx`
      Verify: `npm run lint` y `npm run build`; la compilación debe incluir las rutas de facultad y no debe cambiar el consumidor global `app/nuestra-universidad/oferta-academica/page.tsx`.

- [ ] 3. Implementar `variant="faculty"` en breadcrumbs sin alterar las variantes existentes.
      Inspeccionar y conservar las ramas que usan `/app/forocsu/integrantes`, `/app/facultades`, `/app/nuestra-universidad/sobre-nosotros` y `/app/perfiles/aspirantes`; añadir solo la nueva variante oscura para `Inicio / Facultades / <slug formateado>`, con SVG inline de casa `aria-hidden`, separadores, estados hover/focus y acento rojo. Hacer que la plantilla individual la use justo después del header.
      Files: `components/common/bread-crumbs/bread-crumbs.tsx`, `app/facultades/components/FacultyPage.tsx`
      Verify: `npm run lint` y `npm run build`; deben pasar sin cambios de tipos y la variante nueva debe compilar sin tocar los consumidores anteriores.

- [ ] 4. Añadir el helper puro del título y rediseñar el hero compartido.
      Crear una función de segmentación serializable que deje `Facultad de/del` y los títulos no separables en negro, pinte en rojo únicamente los términos aprobados y trate `Facultad de Artes - ASAB` con `ASAB` rojo. Renderizar sus segmentos dentro de un único `h1`; aplicar fondo gris claro, marca de agua CSS, imagen/fallback accesible, diagonal roja, acento amarillo y Montserrat 700, con una columna móvil sin `clip-path` que corte contenido. No reintroducir el párrafo descriptivo ni `OFERTA ACADÉMICA POR SEDE`.
      Files: `app/facultades/components/faculty-heading.ts` (nuevo), `app/facultades/components/FacultyPage.tsx`, `app/facultades/components/faculty-page.module.css`
      Verify: `npm run lint` y `npm run build`; deben compilar las siete rutas que delegan a `FacultyPage`.

- [ ] 5. Aplicar el rediseño de la oferta académica y sus estados responsive/accesibles.
      Mantener `FacultyAcademicOffer` como Client Component con props serializables y su lógica de tarjetas enlazables/no enlazables. Centrar el título y tabs, mostrar solo niveles con programas, mantener todos los roles/relaciones ARIA, focus visible y `hidden`, y rehacer CSS para tarjetas 4/2/1 con relación casi cuadrada, imagen cover completa, esquinas redondeadas, sombra, título/degradado/barra amarilla y reveal de jornada/modalidad; revelar siempre sin hover y quitar transición con reduced motion. Eliminar contadores y `PROGRAMAS POR NIVEL`; mostrar el CTA centrado solo cuando haya más de cuatro programas, con `_blank` y `noopener noreferrer`.
      Files: `app/facultades/components/FacultyAcademicOffer.tsx`, `app/facultades/components/faculty-academic-offer.module.css`
      Verify: `npm run lint` y `npm run build`; ambos deben pasar y validar la frontera Server/Client y CSS Modules.

- [ ] 6. Añadir la transición decorativa hacia noticias y validar el alcance visual completo.
      Insertar antes de `NewsSection` un elemento `aria-hidden` con diagonal roja y acento amarillo resuelto solo con CSS; mantener `NewsSection` sin modificaciones y el título `Noticias · Facultad ...`. Revisar visualmente las siete rutas individuales en desktop, tablet y móvil si Drupal está disponible, incluyendo fallback de imagen, foco de tabs/enlaces y reduced motion; no añadir imágenes, UUIDs ni logs temporales.
      Files: `app/facultades/components/FacultyPage.tsx`, `app/facultades/components/faculty-page.module.css`
      Verify: `npm run lint` y `npm run build`; esperar lint limpio y build exitoso. Registrar en los FEAT findings cualquier medición real de Drupal o limitación del entorno, sin dejar logs en el código.
