# Requirements Document

## Introduction

Esta funcionalidad define una auditoría de la arquitectura frontend del sitio web institucional (proyecto `web_institucional_frontend`, basado en Next.js App Router, React 19, TypeScript 5, Tailwind CSS 4 y `next-drupal` sobre un backend Drupal JSON:API) y el plan de remediación asociado para alinear el código con las reglas de arquitectura definidas en `AGENTS.md`.

El objetivo es doble:

1. **Auditar** el estado actual del frontend: inventariar rutas, componentes y capas de datos, y detectar de forma verificable dónde se incumplen las cinco reglas de arquitectura y la skill de estandarización de componentes.
2. **Remediar** los incumplimientos: introducir una capa de servicios que aísle la interacción de red y transforme JSON:API en interfaces planas, forzar tipado estricto sin `any`, reestructurar los componentes al patrón obligatorio (carpeta por componente con barrel `index.ts`, `[Nombre].tsx` y `[Nombre].types.ts`), separar componentes presentacionales de contenedores, implementar estados de carga y error en componentes con datos asíncronos de cliente, y asegurar consistencia de estilos con el sistema de diseño institucional.

El resultado esperado del sistema es un **informe de auditoría** (documento de hallazgos) más un conjunto de componentes y capas de datos conformes a las reglas, verificables mediante la compilación de TypeScript, el linter del proyecto y la revisión estructural de directorios.

Hallazgos preliminares que motivan esta auditoría (observados en el código actual):
- `components/home/NewsSection.tsx` es un componente visual que realiza `fetch` directo a `/jsonapi/node/news`, conoce la estructura JSON:API y resuelve URLs de imagen internamente (incumple reglas 1 y 2).
- `app/[...slug]/page.tsx` realiza `fetch` directo con tipos JSON:API declarados en línea (incumple reglas 1 y 2).
- No existe carpeta `/services` ni `/lib/api`; `lib/drupal.ts` solo instancia el cliente `NextDrupal`.
- `components/ti/tableros.ts` sí aplana JSON:API a tipos planos, pero reside dentro de `components/ti/` en lugar de una capa de servicios compartida.
- `components/home/` tiene estructura plana (`HeroSection.tsx`, `NewsSection.tsx`, `heroData.ts`, `home.module.css`, `index.ts`) sin carpeta por componente ni archivos `[Nombre].types.ts` (incumple la skill de estandarización).

## Glossary

- **Sistema_Auditoria**: El proceso y los artefactos que inventarían el frontend y evalúan su conformidad con las reglas de arquitectura, produciendo un informe de hallazgos.
- **Informe_Auditoria**: Documento generado que lista el inventario del frontend, los hallazgos de incumplimiento clasificados por regla y severidad, y las acciones de remediación recomendadas.
- **Capa_Servicios**: Módulo(s) ubicado(s) en `/services` o `/lib/api` que encapsula(n) toda la interacción de red con el backend Drupal JSON:API y expone(n) funciones que devuelven interfaces planas de TypeScript.
- **Componente_Presentacional**: Componente React cuya única responsabilidad es renderizar UI a partir de sus `props`, sin realizar peticiones de red ni conocer la estructura JSON:API.
- **Componente_Contenedor**: Componente React responsable de la lógica de obtención y coordinación de datos (invocando la Capa_Servicios) que entrega datos ya aplanados a los Componentes_Presentacionales.
- **Interface_Plana**: Interface o `type` de TypeScript que representa un dato de dominio con propiedades directas (por ejemplo `Noticia`, `Articulo`, `Tablero`), sin la estructura anidada `data/attributes/relationships/included` de JSON:API.
- **Estructura_Componente**: Directorio por componente que contiene obligatoriamente `[NombreComponente].tsx`, `[NombreComponente].types.ts` y un barrel `index.ts`.
- **Estado_Carga**: Estado de UI (`loading`) que un componente cliente con datos asíncronos muestra mientras los datos no están disponibles.
- **Estado_Error**: Estado de UI (`error`) que un componente cliente con datos asíncronos muestra cuando la obtención de datos falla.
- **Sistema_Diseno**: Conjunto de estilos, tokens y convenciones visuales institucionales usados de forma consistente en el frontend.
- **Verificacion_Conformidad**: Comprobaciones automatizadas y estructurales (compilación de TypeScript en modo estricto, ejecución del linter del proyecto y validación de la estructura de directorios) que confirman la conformidad con las reglas.

## Requirements

### Requirement 1: Inventario del frontend

**User Story:** Como arquitecto frontend, quiero un inventario completo de rutas, componentes y capas de datos del proyecto, para tener una base objetiva sobre la cual evaluar la conformidad arquitectónica.

#### Acceptance Criteria

1. WHEN se ejecuta la auditoría, THE Sistema_Auditoria SHALL registrar en el Informe_Auditoria todas las rutas ubicadas bajo el directorio `app/`, incluyendo para cada una la ruta de su archivo `page.tsx` correspondiente.
2. IF el directorio `app/` no existe o no contiene ningún archivo `page.tsx`, THEN THE Sistema_Auditoria SHALL registrar en el Informe_Auditoria una entrada que indique la ausencia de rutas y continuar con el resto de la auditoría sin interrumpirse.
3. WHEN se ejecuta la auditoría, THE Sistema_Auditoria SHALL registrar en el Informe_Auditoria todos los componentes ubicados bajo el directorio `components/`, incluyendo para cada uno la ruta completa de su archivo.
4. WHEN se ejecuta la auditoría, THE Sistema_Auditoria SHALL registrar en el Informe_Auditoria todos los módulos que contengan al menos una operación de solicitud de red hacia el backend Drupal, incluyendo para cada uno la ruta completa de su archivo.
5. THE Sistema_Auditoria SHALL clasificar cada elemento inventariado en exactamente una de tres categorías, aplicando las reglas siguientes en orden: si el elemento contiene al menos una operación de solicitud de red hacia el backend Drupal, se clasifica como módulo de datos; en caso contrario, si el elemento gestiona estado o compone otros componentes, se clasifica como componente contenedor; en caso contrario, se clasifica como componente presentacional.

### Requirement 2: Detección de peticiones de red en componentes visuales

**User Story:** Como arquitecto frontend, quiero detectar todos los componentes visuales que realizan peticiones HTTP directas o conocen la estructura JSON:API, para identificar las violaciones de separación de responsabilidades.

#### Acceptance Criteria

1. WHEN se analiza un componente visual, THE Sistema_Auditoria SHALL detectar el uso de `fetch`, `XMLHttpRequest` o cualquier cliente HTTP importado dentro del archivo del componente, registrando el nombre del archivo y el número de línea de cada ocurrencia.
2. WHEN se analiza un componente visual, THE Sistema_Auditoria SHALL detectar referencias a la estructura JSON:API, considerando como coincidencia el acceso a cualquiera de las propiedades `data`, `attributes`, `relationships` o `included`, y registrando el nombre del archivo y el número de línea de cada ocurrencia.
3. IF un componente visual realiza al menos una petición HTTP directa o accede al menos una vez a la estructura JSON:API, THEN THE Sistema_Auditoria SHALL registrar un hallazgo en el Informe_Auditoria clasificado como violación de la regla de separación de responsabilidades, incluyendo el nombre del archivo y el número de línea de la primera ocurrencia detectada.
4. WHEN se registra un hallazgo de este requisito, THE Sistema_Auditoria SHALL asignarle exactamente uno de los tres niveles de severidad del conjunto {alta, media, baja}, aplicando severidad alta cuando exista una petición HTTP directa, severidad media cuando exista acceso a la estructura JSON:API sin petición HTTP directa, y severidad baja en cualquier otro caso detectado dentro del alcance de este requisito.
5. IF un archivo de componente visual no puede ser analizado porque no existe, no puede leerse o no es un archivo de texto válido, THEN THE Sistema_Auditoria SHALL omitir el archivo, registrar en el Informe_Auditoria una entrada indicando el nombre del archivo y el motivo de la omisión, y continuar el análisis con los archivos restantes.

### Requirement 3: Detección de ausencia de capa de servicios

**User Story:** Como arquitecto frontend, quiero verificar la existencia y el uso de una capa de servicios que aísle la red, para asegurar que la interacción con Drupal está centralizada.

#### Acceptance Criteria

1. WHEN se ejecuta la auditoría, THE Sistema_Auditoria SHALL verificar la existencia de al menos uno de los directorios que conforman la Capa_Servicios (`/services` o `/lib/api`) dentro del directorio raíz del proyecto frontend.
2. IF no existe ninguno de los directorios `/services` ni `/lib/api`, THEN THE Sistema_Auditoria SHALL registrar en el Informe_Auditoria un hallazgo de severidad alta que indique la ausencia de la Capa_Servicios, incluyendo la lista de directorios esperados que no fueron encontrados.
3. WHEN se identifica un módulo que realiza llamadas de red o de obtención de datos y que reside fuera de la Capa_Servicios, THE Sistema_Auditoria SHALL registrar en el Informe_Auditoria un hallazgo de severidad media que incluya la ruta actual del módulo y la ruta destino recomendada dentro de la Capa_Servicios.
4. WHERE existan funciones de obtención de datos dentro de la Capa_Servicios, THE Sistema_Auditoria SHALL verificar que cada función devuelve una Interface_Plana y registrar como hallazgo de severidad media toda función que devuelva la estructura JSON:API sin transformar, indicando la ubicación de la función.
5. IF durante la auditoría no se puede acceder o leer el directorio raíz del proyecto frontend, THEN THE Sistema_Auditoria SHALL registrar en el Informe_Auditoria un hallazgo que indique la imposibilidad de completar la verificación de la Capa_Servicios y SHALL preservar los resultados obtenidos hasta ese momento.

### Requirement 4: Detección de tipado no estricto

**User Story:** Como arquitecto frontend, quiero detectar el uso del tipo `any` y la ausencia de tipos explícitos, para garantizar el tipado estricto en todo el frontend.

#### Acceptance Criteria

1. WHEN se analiza un archivo de código fuente TypeScript (extensión `.ts` o `.tsx`), THE Sistema_Auditoria SHALL detectar cada aparición del tipo `any`, tanto explícito como implícito, y registrar la ruta del archivo y el número de línea de cada aparición.
2. WHEN se analiza un archivo de código fuente TypeScript, THE Sistema_Auditoria SHALL detectar cada componente cuyas props carezcan de una `interface` o `type` explícito que las declare, y registrar la ruta del archivo y el número de línea del componente.
3. WHEN se analiza la configuración de compilación de TypeScript, THE Sistema_Auditoria SHALL verificar que la opción `strict` esté definida con valor `true`.
4. IF la opción `strict` no está definida o tiene un valor distinto de `true`, THEN THE Sistema_Auditoria SHALL registrar el hallazgo en el Informe_Auditoria como violación de la regla de tipado estricto, indicando la ruta del archivo de configuración.
5. IF se detecta al menos un uso del tipo `any` o al menos una prop sin tipo explícito, THEN THE Sistema_Auditoria SHALL registrar cada hallazgo en el Informe_Auditoria como violación de la regla de tipado estricto, incluyendo la ruta del archivo y el número de línea del hallazgo.

### Requirement 5: Detección de estructura de componentes no conforme

**User Story:** Como arquitecto frontend, quiero detectar los componentes que no cumplen el patrón obligatorio de carpeta, barrel y archivo de tipos, para planificar su reestructuración.

#### Acceptance Criteria

1. WHEN se analiza un componente, THE Sistema_Auditoria SHALL verificar que existe un directorio propio del componente que contiene un archivo `[NombreComponente].tsx`, donde `NombreComponente` coincide en PascalCase con el nombre del directorio.
2. WHEN se analiza un componente, THE Sistema_Auditoria SHALL verificar que el directorio del componente contiene un archivo `[NombreComponente].types.ts`.
3. WHEN se analiza un componente, THE Sistema_Auditoria SHALL verificar que el directorio del componente contiene un barrel `index.ts` que exporta el componente.
4. WHEN se analiza un componente, THE Sistema_Auditoria SHALL verificar que las `props` del componente incluyen soporte para una propiedad `className` opcional de tipo `string`.
5. IF un componente no cumple uno o más elementos de la Estructura_Componente o carece de soporte para `className`, THEN THE Sistema_Auditoria SHALL registrar un hallazgo por cada elemento incumplido en el Informe_Auditoria, indicando la ruta del componente y el criterio incumplido.
6. IF un directorio o archivo de componente no puede leerse durante el análisis, THEN THE Sistema_Auditoria SHALL registrar la omisión con su motivo y continuar el análisis con los componentes restantes.

### Requirement 6: Detección de estados de carga y error ausentes

**User Story:** Como arquitecto frontend, quiero detectar los componentes cliente con datos asíncronos que no implementan estados de carga y error, para asegurar una experiencia de usuario robusta.

#### Acceptance Criteria

1. WHEN se analiza un componente marcado con la directiva `'use client'`, THE Sistema_Auditoria SHALL determinar si el componente obtiene datos de forma asíncrona en el cliente, considerando como dato asíncrono cualquier operación que devuelva una promesa iniciada dentro del componente o de sus hooks cuyo resultado se refleje en el estado renderizado.
2. IF un componente cliente obtiene datos de forma asíncrona y no presenta ninguna representación visible mientras la operación asíncrona está pendiente (Estado_Carga: indicador de carga, texto de espera o contenido de marcador de posición), THEN THE Sistema_Auditoria SHALL registrar un hallazgo en el Informe_Auditoria que identifique el componente y su ubicación de archivo.
3. IF un componente cliente obtiene datos de forma asíncrona y no presenta ninguna representación visible cuando la operación asíncrona falla (Estado_Error: mensaje de error, ruta de reintento o contenido alternativo condicionado al fallo), THEN THE Sistema_Auditoria SHALL registrar un hallazgo en el Informe_Auditoria que identifique el componente y su ubicación de archivo.
4. IF un componente marcado con la directiva `'use client'` no obtiene datos de forma asíncrona en el cliente, THEN THE Sistema_Auditoria SHALL excluir el componente de la evaluación de Estado_Carga y Estado_Error y no registrar ningún hallazgo por este motivo.
5. WHEN el Sistema_Auditoria registra un hallazgo de Estado_Carga o Estado_Error ausente, THE Sistema_Auditoria SHALL indicar en el Informe_Auditoria el tipo de estado ausente (carga o error) para cada hallazgo.

### Requirement 7: Generación del informe de auditoría

**User Story:** Como arquitecto frontend, quiero un informe de auditoría estructurado y trazable, para poder priorizar y planificar la remediación.

#### Acceptance Criteria

1. WHEN finaliza el análisis, THE Sistema_Auditoria SHALL generar un Informe_Auditoria que agrupa los hallazgos por regla de arquitectura.
2. THE Informe_Auditoria SHALL asociar cada hallazgo con la ruta del archivo afectado.
3. THE Informe_Auditoria SHALL asignar a cada hallazgo una severidad clasificada como alta, media o baja.
4. THE Informe_Auditoria SHALL incluir, para cada hallazgo, una acción de remediación recomendada.
5. WHEN el análisis no detecta hallazgos para una regla, THE Informe_Auditoria SHALL indicar de forma explícita que dicha regla se cumple.

### Requirement 8: Introducción de la capa de servicios (remediación)

**User Story:** Como desarrollador frontend, quiero una capa de servicios que aísle toda la interacción de red y transforme JSON:API en interfaces planas, para que los componentes no dependan de la estructura del backend.

#### Acceptance Criteria

1. THE Capa_Servicios SHALL residir en un directorio `/services` o `/lib/api`.
2. WHEN un componente necesita datos del backend Drupal, THE Componente_Contenedor SHALL obtener dichos datos exclusivamente a través de la Capa_Servicios.
3. WHEN la Capa_Servicios recibe una respuesta JSON:API del backend, THE Capa_Servicios SHALL transformar la respuesta en una Interface_Plana antes de entregarla al componente.
4. THE Capa_Servicios SHALL definir una Interface_Plana explícita para cada tipo de dato de dominio que expone.
5. IF la Capa_Servicios encuentra un fallo de red o una respuesta con error del backend, THEN THE Capa_Servicios SHALL señalar el error mediante un valor de retorno tipado o una excepción tipada, sin exponer la estructura JSON:API.

### Requirement 9: Migración de la obtención de datos fuera de los componentes visuales (remediación)

**User Story:** Como desarrollador frontend, quiero mover toda la lógica de obtención de datos de los componentes visuales a la capa de servicios y a componentes contenedores, para cumplir la separación de responsabilidades.

#### Acceptance Criteria

1. WHEN un componente visual actual realiza obtención de datos, THE Componente_Presentacional resultante SHALL recibir esos datos únicamente mediante `props`.
2. THE Componente_Presentacional SHALL renderizar UI sin realizar peticiones HTTP ni acceder a la estructura JSON:API.
3. WHEN se remedia una ruta o componente con datos, THE Componente_Contenedor SHALL invocar la Capa_Servicios y entregar Interfaces_Planas al Componente_Presentacional.
4. WHERE exista lógica de datos ya conforme fuera de la Capa_Servicios, THE proceso de remediación SHALL reubicar dicha lógica dentro de la Capa_Servicios conservando su comportamiento.

### Requirement 10: Reestructuración de componentes al patrón estándar (remediación)

**User Story:** Como desarrollador frontend, quiero reestructurar los componentes no conformes al patrón obligatorio de carpeta, barrel y archivo de tipos, para mantener consistencia y limpieza en las importaciones.

#### Acceptance Criteria

1. WHEN se remedia un componente, THE componente SHALL quedar ubicado en un directorio propio que contiene `[NombreComponente].tsx`, `[NombreComponente].types.ts` e `index.ts`.
2. THE barrel `index.ts` de cada componente remediado SHALL exportar el componente.
3. THE archivo `[NombreComponente].types.ts` SHALL contener las interfaces y `type` de las `props` y del estado del componente.
4. THE `props` de cada componente remediado SHALL incluir una propiedad `className` opcional para permitir la composición en layouts mayores.
5. WHEN se reubica un componente, THE proceso de remediación SHALL actualizar todas las importaciones que referencian dicho componente.

### Requirement 11: Implementación de estados de carga y error (remediación)

**User Story:** Como desarrollador frontend, quiero que los componentes cliente con datos asíncronos implementen estados de carga y error, para ofrecer una experiencia de usuario predecible ante latencia o fallos.

#### Acceptance Criteria

1. WHILE un Componente_Contenedor de cliente espera datos asíncronos, THE componente SHALL mostrar un Estado_Carga.
2. IF la obtención de datos de un Componente_Contenedor de cliente falla, THEN THE componente SHALL mostrar un Estado_Error.
3. WHEN los datos asíncronos se obtienen correctamente, THE Componente_Contenedor SHALL renderizar el Componente_Presentacional con los datos ya aplanados.

### Requirement 12: Consistencia de estilos y verificación de conformidad (remediación)

**User Story:** Como desarrollador frontend, quiero que los componentes remediados usen estilos consistentes con el sistema de diseño institucional y que la conformidad se verifique automáticamente, para prevenir regresiones.

#### Acceptance Criteria

1. THE componentes remediados SHALL usar estilos encapsulados consistentes con el Sistema_Diseno.
2. WHEN se remedia un componente, THE proceso de remediación SHALL evitar la introducción de dependencias visuales no estandarizadas.
3. WHEN finaliza la remediación, THE Verificacion_Conformidad SHALL confirmar que la compilación de TypeScript en modo estricto se completa sin errores.
4. WHEN finaliza la remediación, THE Verificacion_Conformidad SHALL confirmar que el linter del proyecto se ejecuta sin errores en los archivos modificados.
5. WHEN finaliza la remediación, THE Verificacion_Conformidad SHALL confirmar que cada componente remediado cumple la Estructura_Componente.
