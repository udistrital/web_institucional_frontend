/**
 * Stub de `server-only` para el entorno de pruebas.
 *
 * El paquete `server-only` lo provee Next.js en tiempo de build y lanza si se
 * importa desde un bundle de cliente. En Vitest (entorno `node`) no existe como
 * módulo resoluble, por lo que lo sustituimos por un módulo vacío para poder
 * importar los archivos de la Capa_Servicios que lo declaran. No altera el
 * comportamiento de la lógica bajo prueba.
 */
export {};
