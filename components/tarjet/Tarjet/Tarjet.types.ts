import type { ServiceProfile } from "@/navegation/audience_services";

export type TarjetVariant = "card" | "carousel" | "bento";

export type TarjetProps = {
  service: ServiceProfile;
  variant?: TarjetVariant;
  className?: string;
};
