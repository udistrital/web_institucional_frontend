import type { ServiceProfile } from "@/navegation/audience_services";

export interface AudienceButtonProps {
  /** Perfil de servicios que se muestra en el botón y su dropdown. */
  profile: ServiceProfile;
  /** Clase adicional aplicada al elemento raíz para composición. */
  className?: string;
}
