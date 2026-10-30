# Breadcrumb compartido en las páginas de facultades

La integración añade el breadcrumb existente a la plantilla compartida `FacultyPage`, por lo que las siete rutas de facultad lo reciben sin duplicar código en sus `page.tsx`. Se coloca después del hero y antes de la oferta académica, usando la única prop válida `variant="default"`. La plantilla conserva su condición de Server Component y el componente de breadcrumb permanece sin cambios. La evidencia registrada indica que lint y build pasaron, incluido el build de las siete rutas.

**Watch for:** No se identificaron bloqueos en este cambio.

**Verdict**: APPROVED

## High-level view

Cada ruta sigue delegando en `FacultyPage`, que ahora concentra la única instancia del breadcrumb y cubre las siete páginas sin duplicación.

La secuencia visual es hero, navegación contextual y oferta académica. La llamada usa `variant="default"` y no altera la frontera Server/Client ni el componente compartido.

`breadcrumbs-verif.md` registra lint sin errores y build exitoso con las siete rutas. Esas suites no se reejecutaron, conforme al alcance solicitado.

<details>
<summary>Issues (0)</summary>

No hay hallazgos bloqueantes.

</details>

<details>
<summary>Details</summary>

### Inserción única en la plantilla compartida

El cambio importa `BreadCrumbs` en `app/facultades/components/FacultyPage.tsx` y lo renderiza una sola vez después del hero. Las páginas individuales, incluida `ciencias-educacion/page.tsx`, siguen pasando únicamente su slug a `FacultyPage`, sin una segunda instancia. La misma plantilla se usa para las siete rutas indicadas.

### Contrato del componente y frontera Server/Client

La invocación pasa únicamente `variant="default"`, que pertenece al tipo público de `bread-crumbs.tsx`; no se añadieron props inventadas ni se modificó el componente existente. `FacultyPage` no incorpora `'use client'` y conserva su exportación asíncrona de servidor.

### Orden visual y evidencia de verificación

El breadcrumb queda entre el hero y el `<div>` que contiene `FacultyAcademicOffer`, antes del cuerpo de oferta académica. El diff del commit sólo añade la importación y la instancia en `FacultyPage`, además del artefacto de verificación; no altera el listado general `/facultades`. `breadcrumbs-verif.md` registra `npm run lint` con cero errores, nueve advertencias preexistentes, y `npm run build` exitoso con las siete rutas de facultad.

</details>

<details>
<summary>File map</summary>

- `app/facultades/components/FacultyPage.tsx`: añade la instancia única del breadcrumb compartido entre el hero y la oferta académica.
- `.agents/tasks/breadcrumbs-verif.md`: registra la evidencia de lint y build del cambio.

El diff completo está disponible en el commit de integración de breadcrumb frente a su commit padre.

</details>
