# Informe de Auditoría — Arquitectura Frontend

Informe generado por el Sistema_Auditoria (`scripts/audit`). Agrupa los hallazgos por regla de arquitectura, con el archivo afectado, la línea, la severidad y la remediación recomendada. Las reglas sin hallazgos se indican de forma explícita como cumplidas.

## Resumen

- Elementos inventariados: 64
- Hallazgos totales: 39
  - Severidad alta: 0 · media: 39 · baja: 0
- Reglas cumplidas: 6
- Omisiones: 0

## Hallazgos por regla

### Regla 1 · Separación de responsabilidades

**Regla cumplida**: no se detectaron hallazgos para esta regla.

### Regla 2 · Capa de servicios

**Regla cumplida**: no se detectaron hallazgos para esta regla.

### Regla 3 · Tipado estricto

**Regla cumplida**: no se detectaron hallazgos para esta regla.

### Regla 4 · Componentización

**Regla cumplida**: no se detectaron hallazgos para esta regla.

### Regla 5 · Estilos

**Regla cumplida**: no se detectaron hallazgos para esta regla.

### Skill · Estandarización de componentes

39 hallazgos detectados.

| Archivo | Línea | Severidad | Descripción | Remediación |
| --- | --- | --- | --- | --- |
| components/home/EnrollmentSection.tsx | — | media | [nombre-tsx] El archivo `EnrollmentSection.tsx` no coincide en PascalCase con el nombre del directorio `home` (se esperaba `Home.tsx`). | Renombrar el archivo a `Home.tsx` para que coincida en PascalCase con el nombre del directorio del componente. |
| components/home/EnrollmentSection.tsx | — | media | [archivo-types] El directorio del componente no contiene `EnrollmentSection.types.ts`. | Crear `components/home/EnrollmentSection.types.ts` con las interfaces y `type` de las props y el estado del componente. |
| components/home/EnrollmentSection.tsx | — | media | [prop-classname] Las props del componente no incluyen soporte para una propiedad `className?: string` opcional. | Añadir `className?: string` a la interface de props del componente para permitir la composición en layouts mayores. |
| components/home/FacultiesSection.tsx | — | media | [nombre-tsx] El archivo `FacultiesSection.tsx` no coincide en PascalCase con el nombre del directorio `home` (se esperaba `Home.tsx`). | Renombrar el archivo a `Home.tsx` para que coincida en PascalCase con el nombre del directorio del componente. |
| components/home/FacultiesSection.tsx | — | media | [archivo-types] El directorio del componente no contiene `FacultiesSection.types.ts`. | Crear `components/home/FacultiesSection.types.ts` con las interfaces y `type` de las props y el estado del componente. |
| components/home/FacultiesSection.tsx | — | media | [prop-classname] Las props del componente no incluyen soporte para una propiedad `className?: string` opcional. | Añadir `className?: string` a la interface de props del componente para permitir la composición en layouts mayores. |
| components/home/FacultyShowcaseSection.tsx | — | media | [nombre-tsx] El archivo `FacultyShowcaseSection.tsx` no coincide en PascalCase con el nombre del directorio `home` (se esperaba `Home.tsx`). | Renombrar el archivo a `Home.tsx` para que coincida en PascalCase con el nombre del directorio del componente. |
| components/home/FacultyShowcaseSection.tsx | — | media | [archivo-types] El directorio del componente no contiene `FacultyShowcaseSection.types.ts`. | Crear `components/home/FacultyShowcaseSection.types.ts` con las interfaces y `type` de las props y el estado del componente. |
| components/home/FacultyShowcaseSection.tsx | — | media | [prop-classname] Las props del componente no incluyen soporte para una propiedad `className?: string` opcional. | Añadir `className?: string` a la interface de props del componente para permitir la composición en layouts mayores. |
| components/home/HeroCarousel.tsx | — | media | [nombre-tsx] El archivo `HeroCarousel.tsx` no coincide en PascalCase con el nombre del directorio `home` (se esperaba `Home.tsx`). | Renombrar el archivo a `Home.tsx` para que coincida en PascalCase con el nombre del directorio del componente. |
| components/home/HeroCarousel.tsx | — | media | [archivo-types] El directorio del componente no contiene `HeroCarousel.types.ts`. | Crear `components/home/HeroCarousel.types.ts` con las interfaces y `type` de las props y el estado del componente. |
| components/home/HeroCarousel.tsx | — | media | [barrel-index] El barrel `components/home/index.ts` no exporta el componente `HeroCarousel`. | Añadir al barrel la reexportación del componente (p. ej. `export { default as HeroCarousel } from "./HeroCarousel";`). |
| components/home/HeroCarousel.tsx | — | media | [prop-classname] Las props del componente no incluyen soporte para una propiedad `className?: string` opcional. | Añadir `className?: string` a la interface de props del componente para permitir la composición en layouts mayores. |
| components/home/HeroSection.tsx | — | media | [nombre-tsx] El archivo `HeroSection.tsx` no coincide en PascalCase con el nombre del directorio `home` (se esperaba `Home.tsx`). | Renombrar el archivo a `Home.tsx` para que coincida en PascalCase con el nombre del directorio del componente. |
| components/home/HeroSection.tsx | — | media | [archivo-types] El directorio del componente no contiene `HeroSection.types.ts`. | Crear `components/home/HeroSection.types.ts` con las interfaces y `type` de las props y el estado del componente. |
| components/home/HeroSection.tsx | — | media | [prop-classname] Las props del componente no incluyen soporte para una propiedad `className?: string` opcional. | Añadir `className?: string` a la interface de props del componente para permitir la composición en layouts mayores. |
| components/home/NewsSection.tsx | — | media | [nombre-tsx] El archivo `NewsSection.tsx` no coincide en PascalCase con el nombre del directorio `home` (se esperaba `Home.tsx`). | Renombrar el archivo a `Home.tsx` para que coincida en PascalCase con el nombre del directorio del componente. |
| components/home/NewsSection.tsx | — | media | [archivo-types] El directorio del componente no contiene `NewsSection.types.ts`. | Crear `components/home/NewsSection.types.ts` con las interfaces y `type` de las props y el estado del componente. |
| components/home/NewsSection.tsx | — | media | [prop-classname] Las props del componente no incluyen soporte para una propiedad `className?: string` opcional. | Añadir `className?: string` a la interface de props del componente para permitir la composición en layouts mayores. |
| components/home/QuickLinksSection.tsx | — | media | [nombre-tsx] El archivo `QuickLinksSection.tsx` no coincide en PascalCase con el nombre del directorio `home` (se esperaba `Home.tsx`). | Renombrar el archivo a `Home.tsx` para que coincida en PascalCase con el nombre del directorio del componente. |
| components/home/QuickLinksSection.tsx | — | media | [archivo-types] El directorio del componente no contiene `QuickLinksSection.types.ts`. | Crear `components/home/QuickLinksSection.types.ts` con las interfaces y `type` de las props y el estado del componente. |
| components/home/QuickLinksSection.tsx | — | media | [prop-classname] Las props del componente no incluyen soporte para una propiedad `className?: string` opcional. | Añadir `className?: string` a la interface de props del componente para permitir la composición en layouts mayores. |
| components/home/ServicesSection.tsx | — | media | [nombre-tsx] El archivo `ServicesSection.tsx` no coincide en PascalCase con el nombre del directorio `home` (se esperaba `Home.tsx`). | Renombrar el archivo a `Home.tsx` para que coincida en PascalCase con el nombre del directorio del componente. |
| components/home/ServicesSection.tsx | — | media | [archivo-types] El directorio del componente no contiene `ServicesSection.types.ts`. | Crear `components/home/ServicesSection.types.ts` con las interfaces y `type` de las props y el estado del componente. |
| components/home/ServicesSection.tsx | — | media | [prop-classname] Las props del componente no incluyen soporte para una propiedad `className?: string` opcional. | Añadir `className?: string` a la interface de props del componente para permitir la composición en layouts mayores. |
| components/home/StudentServicesSection.tsx | — | media | [nombre-tsx] El archivo `StudentServicesSection.tsx` no coincide en PascalCase con el nombre del directorio `home` (se esperaba `Home.tsx`). | Renombrar el archivo a `Home.tsx` para que coincida en PascalCase con el nombre del directorio del componente. |
| components/home/StudentServicesSection.tsx | — | media | [archivo-types] El directorio del componente no contiene `StudentServicesSection.types.ts`. | Crear `components/home/StudentServicesSection.types.ts` con las interfaces y `type` de las props y el estado del componente. |
| components/home/StudentServicesSection.tsx | — | media | [prop-classname] Las props del componente no incluyen soporte para una propiedad `className?: string` opcional. | Añadir `className?: string` a la interface de props del componente para permitir la composición en layouts mayores. |
| components/home/UniversityPromoSection.tsx | — | media | [nombre-tsx] El archivo `UniversityPromoSection.tsx` no coincide en PascalCase con el nombre del directorio `home` (se esperaba `Home.tsx`). | Renombrar el archivo a `Home.tsx` para que coincida en PascalCase con el nombre del directorio del componente. |
| components/home/UniversityPromoSection.tsx | — | media | [archivo-types] El directorio del componente no contiene `UniversityPromoSection.types.ts`. | Crear `components/home/UniversityPromoSection.types.ts` con las interfaces y `type` de las props y el estado del componente. |
| components/home/UniversityPromoSection.tsx | — | media | [prop-classname] Las props del componente no incluyen soporte para una propiedad `className?: string` opcional. | Añadir `className?: string` a la interface de props del componente para permitir la composición en layouts mayores. |
| components/ti/TableroIframe.tsx | — | media | [nombre-tsx] El archivo `TableroIframe.tsx` no coincide en PascalCase con el nombre del directorio `ti` (se esperaba `Ti.tsx`). | Renombrar el archivo a `Ti.tsx` para que coincida en PascalCase con el nombre del directorio del componente. |
| components/ti/TableroIframe.tsx | — | media | [archivo-types] El directorio del componente no contiene `TableroIframe.types.ts`. | Crear `components/ti/TableroIframe.types.ts` con las interfaces y `type` de las props y el estado del componente. |
| components/ti/TableroIframe.tsx | — | media | [barrel-index] El directorio del componente no contiene un barrel `index.ts`. | Crear `components/ti/index.ts` que reexporte el componente (p. ej. `export { default as TableroIframe } from "./TableroIframe";`). |
| components/ti/TableroIframe.tsx | — | media | [prop-classname] Las props del componente no incluyen soporte para una propiedad `className?: string` opcional. | Añadir `className?: string` a la interface de props del componente para permitir la composición en layouts mayores. |
| components/ti/TablerosExplorer.tsx | — | media | [nombre-tsx] El archivo `TablerosExplorer.tsx` no coincide en PascalCase con el nombre del directorio `ti` (se esperaba `Ti.tsx`). | Renombrar el archivo a `Ti.tsx` para que coincida en PascalCase con el nombre del directorio del componente. |
| components/ti/TablerosExplorer.tsx | — | media | [archivo-types] El directorio del componente no contiene `TablerosExplorer.types.ts`. | Crear `components/ti/TablerosExplorer.types.ts` con las interfaces y `type` de las props y el estado del componente. |
| components/ti/TablerosExplorer.tsx | — | media | [barrel-index] El directorio del componente no contiene un barrel `index.ts`. | Crear `components/ti/index.ts` que reexporte el componente (p. ej. `export { default as TablerosExplorer } from "./TablerosExplorer";`). |
| components/ti/TablerosExplorer.tsx | — | media | [prop-classname] Las props del componente no incluyen soporte para una propiedad `className?: string` opcional. | Añadir `className?: string` a la interface de props del componente para permitir la composición en layouts mayores. |

### Estados de carga y error (componentes cliente)

**Regla cumplida**: no se detectaron hallazgos para esta regla.

## Inventario

64 elementos inventariados.

| Archivo | Categoría | Ruta asociada |
| --- | --- | --- |
| app/[...slug]/page.tsx | Componente contenedor | /[...slug] |
| app/acerca-de/page.tsx | Componente presentacional | /acerca-de |
| app/articulos/page.tsx | Componente contenedor | /articulos |
| app/facultades/artes-asab/page.tsx | Componente presentacional | /facultades/artes-asab |
| app/facultades/ciencias-educacion/page.tsx | Componente presentacional | /facultades/ciencias-educacion |
| app/facultades/ciencias-matematicas-naturales/page.tsx | Componente presentacional | /facultades/ciencias-matematicas-naturales |
| app/facultades/ciencias-salud/page.tsx | Componente presentacional | /facultades/ciencias-salud |
| app/facultades/ingenieria/page.tsx | Componente presentacional | /facultades/ingenieria |
| app/facultades/medio-ambiente-recursos-naturales/page.tsx | Componente presentacional | /facultades/medio-ambiente-recursos-naturales |
| app/facultades/page.tsx | Componente presentacional | /facultades |
| app/facultades/tecnologica/page.tsx | Componente presentacional | /facultades/tecnologica |
| app/page.tsx | Componente contenedor | / |
| app/perfiles/administrativos/page.tsx | Componente presentacional | /perfiles/administrativos |
| app/perfiles/aspirantes/page.tsx | Componente contenedor | /perfiles/aspirantes |
| app/perfiles/educadores/page.tsx | Componente presentacional | /perfiles/educadores |
| app/perfiles/estudiantes/page.tsx | Componente presentacional | /perfiles/estudiantes |
| app/perfiles/page.tsx | Componente contenedor | /perfiles |
| app/ti/page.tsx | Componente contenedor | /ti |
| components/article/Article.tsx | Componente contenedor | — |
| components/article/Article.types.ts | Componente presentacional | — |
| components/article/index.ts | Componente presentacional | — |
| components/contact-widget/contact-widget.tsx | Componente contenedor | — |
| components/emisoraLive/emisora-live.tsx | Componente contenedor | — |
| components/emisoraLive/Hooks/useRadio.ts | Componente contenedor | — |
| components/emisoraLive/programacion.tsx | Componente presentacional | — |
| components/footer/footer.tsx | Componente contenedor | — |
| components/header/audience-nav/audience-button.tsx | Componente contenedor | — |
| components/header/audience-nav/audience-nav.tsx | Componente contenedor | — |
| components/header/brand.tsx | Componente contenedor | — |
| components/header/dropdown-motion.ts | Componente presentacional | — |
| components/header/header.tsx | Componente contenedor | — |
| components/header/main-menu/aspirantes.tsx | Componente contenedor | — |
| components/header/main-menu/buscador.tsx | Componente presentacional | — |
| components/header/main-menu/campus.tsx | Componente contenedor | — |
| components/header/main-menu/icons.tsx | Componente presentacional | — |
| components/header/main-menu/internacionalizacion.tsx | Componente contenedor | — |
| components/header/main-menu/main-menu.tsx | Componente contenedor | — |
| components/header/main-menu/menu-icon.tsx | Componente contenedor | — |
| components/header/main-menu/navigation.ts | Componente presentacional | — |
| components/header/main-menu/nuestra-universidad.tsx | Componente contenedor | — |
| components/header/main-menu/oferta-academica.tsx | Componente contenedor | — |
| components/header/main-menu/search-results.tsx | Componente contenedor | — |
| components/header/use-hide-on-scroll.ts | Componente contenedor | — |
| components/home/EnrollmentSection.tsx | Componente contenedor | — |
| components/home/FacultiesSection.tsx | Componente contenedor | — |
| components/home/FacultyShowcaseSection.tsx | Componente contenedor | — |
| components/home/HeroCarousel.tsx | Componente contenedor | — |
| components/home/HeroSection.tsx | Componente contenedor | — |
| components/home/index.ts | Componente presentacional | — |
| components/home/NewsSection.tsx | Componente contenedor | — |
| components/home/QuickLinksSection.tsx | Componente contenedor | — |
| components/home/ServicesSection.tsx | Componente contenedor | — |
| components/home/StudentServicesSection.tsx | Componente contenedor | — |
| components/home/UniversityPromoSection.tsx | Componente contenedor | — |
| components/home/useSwipe.ts | Componente presentacional | — |
| components/news-card/index.ts | Componente presentacional | — |
| components/news-card/NewsCard.tsx | Componente contenedor | — |
| components/news-card/NewsCard.types.ts | Componente presentacional | — |
| components/news-list/index.ts | Componente presentacional | — |
| components/news-list/NewsList.tsx | Componente contenedor | — |
| components/news-list/NewsList.types.ts | Componente presentacional | — |
| components/tarjet/tarjet.tsx | Componente contenedor | — |
| components/ti/TableroIframe.tsx | Componente contenedor | — |
| components/ti/TablerosExplorer.tsx | Componente contenedor | — |

## Omisiones

No se registraron omisiones.
