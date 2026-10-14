/**
 * Props del componente presentacional `Buscador`.
 *
 * Es puramente presentacional: renderiza el formulario de búsqueda del
 * encabezado. No realiza peticiones de red; delega el manejo del valor en el
 * contenedor mediante `onChange`/`onSearch`.
 */
export interface BuscadorProps {
  /** Valor actual del campo de búsqueda. */
  value: string;
  /** Callback invocado cuando cambia el valor del campo. */
  onChange: (value: string) => void;
  /** Callback invocado al enviar o activar la búsqueda. */
  onSearch: () => void;
  /** Clase adicional para componer el formulario en layouts mayores. */
  className?: string;
}
