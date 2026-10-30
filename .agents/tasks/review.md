# Manejo robusto de facultades ausentes en el carrusel de inicio

El cambio corrige el origen del `faculty.href undefined` en `FacultiesSection` sin modificar las rutas ni la estructura del carrusel para datos válidos. La sección normaliza la entrada, descarta registros que no pueden renderizarse y usa esa misma lista para la cortina, las tarjetas, los indicadores y la navegación. Cuando no queda ninguna facultad disponible, renderiza un estado vacío explícito y accesible después de ejecutar los hooks. La evidencia registrada indica que ESLint pasó y que el componente modificado compiló correctamente antes de que la generación estática se detuviera por la indisponibilidad preexistente de Drupal.

**Watch for:** **confirmado**, no hay hallazgos bloqueantes en el diff; la generación estática completa no terminó porque Drupal no estaba disponible, pero esa interrupción ocurrió después de compilar el componente modificado.

**Verdict**: APPROVED

## High-level view

La frontera de renderizado usa una lista normalizada con título y ruta válidos para la cortina, las tarjetas, los puntos y la navegación, evitando que el cálculo circular alimente un `<Link>` con `undefined`.

El carrusel mantiene el avance circular para uno, dos y tres o más registros. El estado vacío se decide después de `useState` y `useSwipe`, y sustituye los controles por un anuncio accesible sin alterar la presentación de datos válidos.

La evidencia registrada cubre lint, compilación del componente y la inspección de las secuencias del carrusel. La prueba de navegador quedó limitada por la restricción del entorno para servidores de desarrollo persistentes.

<details>
<summary>Issues (0)</summary>

</details>

<details>
<summary>Details</summary>

### Normalización de registros antes de crear enlaces

`FacultiesSection.tsx` acepta una prop ausente o nula, convierte cualquier entrada no-array en una lista vacía y filtra cada registro mediante `isRenderableFaculty`. La lista filtrada alimenta la cortina, las tarjetas y los puntos. **Confirmado**, ninguna de esas expresiones puede recibir un elemento `undefined` derivado de la longitud original, y todos los `href` de los enlaces de facultad provienen del mismo conjunto validado.

### Índice circular y frontera estable de Client Component

El avance usa el conteo normalizado y devuelve `0` cuando no hay elementos, mientras que `activeStart` evita que un índice anterior quede fuera de rango si cambia la cantidad de facultades. Con los datos inspeccionados, las ventanas son `[0, 0, 0]` para una facultad, `[0, 1, 0]` y `[1, 0, 1]` para dos, y tres elementos consecutivos con vuelta al inicio para tres o más. `useState` y `useSwipe` se ejecutan antes del retorno del estado vacío, de modo que la frontera `"use client"` y el orden de hooks permanecen estables.

### Estado vacío y evidencia de verificación

La rama `facultyCount === 0` conserva el encabezado y `/facultades`, elimina tarjetas, flechas y puntos, y expone el mensaje mediante `role="status"` y `aria-live="polite"`. `home.module.css` añade únicamente las reglas visuales de ese estado. La evidencia de la implementación registra `npm run lint` sin errores y compilación exitosa de TypeScript y del bundle; el build se detuvo después durante la generación de una ruta que necesitaba Drupal, una limitación externa al cambio. También registra que la inspección del componente no encontró la excepción `faculty.href`.

</details>

<details>
<summary>File map</summary>

- `app/components/home/FacultiesSection.tsx` — normaliza facultades, preserva el carrusel circular y añade el estado vacío accesible.
- `app/components/home/home.module.css` — agrega los estilos del estado vacío.

Full diff: `git diff HEAD^ HEAD -- app/components/home/FacultiesSection.tsx app/components/home/home.module.css`.

</details>
