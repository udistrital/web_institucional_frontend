export type PageHeroTitleSegment = {
  text: string;
  accent: boolean;
};

export type PageHeroTitle = string | PageHeroTitleSegment[];

export type PageHeroVariant = "default" | "brand";

export type PageHeroData = {
  /** Línea superior del título; solo la usa la variante "brand". */
  eyebrow?: string;
  title: PageHeroTitle;
  imageUrl?: string | null;
  imageAlt?: string;
};
