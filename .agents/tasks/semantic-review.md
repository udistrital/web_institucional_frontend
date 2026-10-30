# Header fijo, compacto y por encima de las pestañas de sobre-nosotros

El header deja de ocultarse al hacer scroll. Se eliminó por completo la maquinaria de framer-motion de `header-container.tsx` (refs, estado `height`/`floating`, `useAnimationControls`, `useReducedMotion`, `ResizeObserver`, listener de scroll y el `<motion.div>` con `position: fixed`), que ahora vuelve a ser un componente de servidor simple que solo renderiza `<AudienceNav />` seguido de `<Header />`. La fijación se resolvió moviéndola al propio `<header>` con utilidades Tailwind (`sticky top-0 z-50`): la barra roja de perfiles queda en flujo normal y sale de vista al bajar, mientras el bloque escudo+menú+buscador queda pegado arriba. Se compactó el alto (escudo desktop 72→56px, paddings verticales reducidos) y se introdujo la variable `--header-h` para que la barra de pestañas de sobre-nosotros se pegue justo debajo del header en lugar de solaparlo.

Watch for:
- (possible) `--header-h` es una estimación fija (112px mobile / 72px desktop); si el alto real del header difiere, la barra de pestañas dejará un hueco o se montará ligeramente, aunque nunca tapará el header. La propia nota de verificación lo marca como pendiente de validación visual.
- (confirmed) El diff sin commitear mezcla cambios ajenos al header en `sobre-nosotros` (grid del himno, tarjetas de símbolos, `graficosGrid`, eliminación de `otrosHimnos`) que no forman parte de esta tarea.
- (confirmed) `use-hide-on-scroll.ts` quedó en el árbol como código muerto: ya no lo importa ningún componente.

**Verdict**: APPROVED

## High-level view

La fijación pasó de JavaScript imperativo a CSS declarativo. En lugar de medir el header, escuchar scroll y conmutar entre `relative` y `fixed` con animaciones de entrada/salida, ahora el `<header>` usa `sticky top-0`. Es menos código, sin listeners ni reflows, y elimina la clase entera de bugs de sincronización que tenía la versión anterior. La barra roja de perfiles queda deliberadamente fuera de la fijación: scrollea y desaparece, que es justo lo que pide el requerimiento.

El apilamiento resuelve el requisito de que el menú del header gane siempre. El `<header>` es `z-50` y la barra de pestañas `.sectionNav` de sobre-nosotros es `z-20`; ambos cuelgan del mismo contenedor `relative z-10` del `FooterReveal`, de modo que el header pinta por encima. Además `.sectionNav` ahora se ancla en `top: var(--header-h)` para detenerse bajo el header en vez de competir por la posición 0. Los overlays que deben cubrir todo (buscador global `z-[70]`, panel móvil `z-79/80`) se montan por `createPortal` en `document.body`, fuera del contexto `z-10`, así que no se ven afectados por la jerarquía del header.

El `sticky` depende de que ningún ancestro rompa `position: sticky`: el wrapper del `FooterReveal` que envuelve al header es `position: relative` sin `transform`, `overflow` ni `filter`, así que no lo rompe. Es el único punto donde la fijación podía fallar silenciosamente.

El único cabo suelto real es que `--header-h` es un número escrito a mano, no una medición. No puede tapar el header (el z-index manda), pero sí puede dejar un desajuste de algunos píxeles entre la barra de pestañas y el borde inferior del header hasta que se valide en navegador.

<details>
<summary>Issues (3)</summary>

1. **`--header-h` estimado, no medido** (possible) — El valor fijo puede no coincidir con el alto real del header renderizado y dejar hueco/solapamiento entre `.sectionNav` y el header. No bloquea (no tapa el menú); validar visualmente y ajustar el valor si el render difiere.
2. **Cambios de sobre-nosotros bundleados** (confirmed) — El diff sin commitear incluye cambios de estilos del himno y símbolos ajenos a la tarea del header; conviene separarlos en su propio commit para mantener el alcance limpio.
3. **Código muerto `use-hide-on-scroll.ts`** (confirmed) — El hook ya no se usa en ningún componente; eliminarlo o dejarlo documentado como intencional.

</details>

<details>
<summary>Details</summary>

### De animación imperativa a `position: sticky`

`header-container.tsx` pasó de ~150 líneas de control de scroll a una envoltura de dos hijos. La versión anterior media el header con un `ResizeObserver`, escuchaba `scroll`, y conmutaba un estado `floating` que aplicaba `position: fixed` con animaciones de entrada (`spring`) y salida (`tween`) vía `useAnimationControls`, con tokens para cancelar animaciones en curso. Toda esa máquina de estados desapareció. El resultado:

```tsx
export default function HeaderContainer() {
  return (
    <>
      <AudienceNav />
      <Header />
    </>
  );
}
```

La fijación ahora vive en `header.tsx` como clases Tailwind sobre el `<header>`: `sticky top-0 z-50`. Cumple el criterio 1 (ya no se oculta/muestra con scroll) y el criterio 2 (escudo+menú+buscador siempre arriba; la barra roja en flujo normal). Borra además una clase entera de bugs de la versión previa: estados intermedios donde el header podía quedar a media animación por listeners de scroll o reflows de medición.

La eliminación de `useReducedMotion` del contenedor no degrada accesibilidad porque ya no queda movimiento propio que reducir; `prefers-reduced-motion` sigue respetada donde sí hay animación (dropdown de `AudienceNav`).

### El `sticky` sobrevive al `FooterReveal`

El header se renderiza dentro de `FooterReveal`, que envuelve a sus hijos en `<div className="relative z-10 bg-white">`. Esto importa porque `position: sticky` se rompe si algún ancestro tiene `transform`, `overflow` distinto de `visible`, `filter`, `perspective` o `will-change`. Ese wrapper es solo `position: relative` sin ninguno de esos disparadores, así que el header se pega respecto al viewport como se espera. El `<motion.div>` del `FooterReveal` (que sí usa `transform` vía parallax) es hermano del wrapper de los hijos, no ancestro del header, por lo que no interfiere.

### Apilamiento: el menú del header gana siempre

```
FooterReveal wrapper  (relative, z-10)  ← contexto de apilamiento
├─ HeaderContainer
│  ├─ AudienceNav      (relative, z-60)  ← barra roja, flujo normal
│  └─ Header <header>  (sticky,  z-50)   ← bloque fijo
└─ main
   └─ SectionTabs
      └─ .sectionNav   (sticky,  z-20)   ← pestañas sobre-nosotros
```

El header (`z-50`) y `.sectionNav` (`z-20`) comparten el mismo contexto de apilamiento (el wrapper `z-10`), así que 50 > 20 garantiza que el header pinte encima. A esto se suma que `.sectionNav` cambió de `top: 0` a `top: var(--header-h, 72px)`, de modo que se detiene bajo el header en vez de competir por la posición 0. Doble mecanismo (z-index + top), cumpliendo el criterio 4: el `.sectionNav` de sobre-nosotros (z-index 20) nunca tapa el menú.

La barra roja `AudienceNav` tiene `z-60`, mayor que el header `z-50`. Esto solo es observable durante el instante en que la barra roja se va deslizando fuera de vista y el header sticky empieza a pegarse debajo: la roja pinta por encima mientras sale. Es el comportamiento visual correcto (la barra abandona la vista), no una regresión.

Los overlays que deben cubrir toda la pantalla escapan de esta jerarquía por diseño: el buscador global (`busqueda-global.tsx`) se monta con `createPortal` en `document.body` con `fixed inset-0 z-[70]`, y el panel móvil (`mobile-nav.tsx`) también usa `createPortal` con `z-79/80`. Al vivir en `document.body` no quedan atrapados por el contexto `z-10` del wrapper, así que siguen cubriendo el header. La funcionalidad de submenús desktop (`.menuFullWidth` z-1, `.menuCompact` z-10, hijos del header), panel móvil y buscador queda intacta (criterio 2).

### Compactación del alto

El escudo desktop baja de `72px` a `56px` en `header.module.css`; el mobile se mantiene en `44px` con su media query `@media (max-width: 767px)` sin tocar. En `header.tsx`, el contenedor interno pasa de `md:py-2` a `md:py-1` y el bloque del menú de `py-1.5` a `py-1`. Son reducciones moderadas que no afectan el apilado mobile (criterio 3). El `py-2` del bloque del escudo en mobile se conserva.

### Riesgo de `--header-h` como valor fijo

`--header-h` se define en `:root` como `112px` (mobile) con override a `72px` en `@media (min-width: 768px)`, y lo consume `.sectionNav` para su `top`. El valor no se mide del DOM: es una estimación a partir de escudo 56px + paddings. Si el alto real del header renderizado difiere, la barra de pestañas quedará con un hueco (si `--header-h` es mayor que el header real) o se montará unos píxeles bajo el borde del header (si es menor). En ningún caso tapa el menú, porque el z-index sigue mandando, así que el impacto es cosmético. La nota de verificación lo marca explícitamente como pendiente de validación visual. Conviene confirmarlo en navegador en los dos breakpoints y ajustar el valor si hace falta.

### Cambios ajenos al header en el mismo diff

El diff sin commitear incluye modificaciones de `sobre-nosotros` que no pertenecen a la tarea del header: reestructuración del carrusel del himno (`.estrofa` a grid con `.estrofaSlide`/`.estrofaSlideActiva`, versos a dos columnas), cambios en `graficosGrid` y nuevas `.escudoCard`/`.banderaCard` con reordenamiento, y eliminación de los estilos `.otrosHimnos`. También hay cambios en `himno.tsx`, `content.ts` y `page.tsx` de sobre-nosotros. No son incorrectos, pero ensucian el alcance del cambio del header; idealmente van en su propio commit.

### Evidencia de verificación (no re-ejecutada)

Según `/.agents/tasks/verification.md`, el coder corrió `npx eslint` sobre los directorios tocados (0 errores, 6 warnings preexistentes ajenos a estos cambios) y `npx tsc --noEmit` (solo los 2 errores preexistentes de `next-drupal`, dependencia no instalada, sin errores nuevos). `npm run build` no sirve como gate por esa misma dependencia faltante preexistente. Confirmé por grep que `header-container.tsx` ya no referencia `framer-motion`/`motion` y que `use-hide-on-scroll.ts` no se importa en ningún componente de `app/` ni `components/`. No re-ejecuté suites.

No tested: validación visual en navegador (alto real del header vs `--header-h`, comportamiento de la barra roja al salir, submenús/panel móvil/buscador operativos). Es la única verificación pendiente y requiere `next dev`.

</details>

<details>
<summary>Mapa de archivos</summary>

- `components/layout/header/header-container.tsx` — eliminada toda la maquinaria framer-motion de ocultar/mostrar; ahora componente de servidor que solo renderiza AudienceNav + Header.
- `components/layout/header/header.tsx` — el `<header>` pasa a `sticky top-0 z-50`; paddings verticales reducidos (`md:py-1`, `py-1`).
- `components/layout/header/header.module.css` — escudo desktop `72px` → `56px`.
- `app/globals.css` — nueva variable `--header-h` (112px mobile / 72px desktop).
- `app/nuestra-universidad/sobre-nosotros/page.module.css` — `.sectionNav` cambia `top: 0` → `top: var(--header-h, 72px)`; además cambios ajenos al header (grid del himno, tarjetas de símbolos, `graficosGrid`).
- (fuera de alcance del header, en el mismo diff) `app/nuestra-universidad/sobre-nosotros/{himno.tsx,content.ts,page.tsx}`.
- `components/layout/header/use-hide-on-scroll.ts` — queda como código muerto (no importado).

Diff completo: `git diff HEAD -- components/layout/header/ app/globals.css app/nuestra-universidad/sobre-nosotros/page.module.css`

</details>
