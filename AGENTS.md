<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

---

# AGENT STEERING: Reglas de Arquitectura Frontend Institucional

Al auditar, refactorizar o crear código para este proyecto, debes seguir estrictamente estas reglas:

1. **Separación de Responsabilidades:** Los componentes visuales de React (ej. landing pages, banners, widgets de contacto) NUNCA deben realizar peticiones HTTP directas ni conocer la estructura de JSON:API.
2. **Capa de Servicios:** Toda interacción de red debe estar aislada en una carpeta `/services` (o `/lib/api`). Estos servicios deben transformar la respuesta anidada de JSON:API en interfaces planas de TypeScript antes de entregar los datos a los componentes.
3. **Tipado Estricto:** Prohibido el uso del tipo `any`. Toda respuesta de la API, prop de componente y estado debe tener su respectiva interface o `type` explícito en TypeScript.
4. **Componentización:** La UI debe dividirse en componentes presentacionales (visuales) y componentes contenedores (lógicos).
5. **Estilos:** Mantener consistencia con el sistema de diseño institucional, priorizando el encapsulamiento de estilos y evitando dependencias visuales no estandarizadas.

---

# SKILLS

## Skill: Estandarización y Refactorización de Componentes UI
**Cuándo usar:** Al crear o auditar componentes visuales como módulos de noticias, héroes o widgets para la página web institucional.

**Instrucciones de ejecución:**
1. Todo componente debe exportarse desde un archivo `index.ts` (patrón *barrel*) para mantener las importaciones limpias en el resto del proyecto.
2. La estructura interna del directorio del componente debe ser obligatoriamente:
   - `[NombreComponente].tsx` (Lógica principal y UI)
   - `[NombreComponente].types.ts` (Interfaces de TypeScript)
3. Las `props` del componente deben extender o incluir soporte para clases adicionales (`className`) para permitir la composición en layouts mayores.
4. Si el componente depende de datos asíncronos en el cliente, se deben implementar y validar siempre los estados de carga (`loading`) y error (`error`).