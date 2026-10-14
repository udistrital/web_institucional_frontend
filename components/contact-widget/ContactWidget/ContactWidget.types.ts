/**
 * Props del componente presentacional `ContactWidget`.
 *
 * Es puramente presentacional: muestra un botón flotante con opciones de
 * contacto (Chat, WhatsApp, Chatbot). No realiza peticiones de red ni conoce
 * la estructura JSON:API.
 */
export interface ContactWidgetProps {
  /** Clase adicional para componer el widget en layouts mayores. */
  className?: string;
}
