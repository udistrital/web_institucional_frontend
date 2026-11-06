export type PageHeroTitleSegment = {
  text: string;
  accent: boolean;
};

export type PageHeroTitle = string | PageHeroTitleSegment[];

export type PageHeroVariant = "default" | "brand" | "brand-diagonal";

export type PageHeroData = {
  /** Línea superior del título; la usan las variantes "brand" y "brand-diagonal". */
  eyebrow?: string;
  title: PageHeroTitle;
  imageUrl?: string | null;
  imageAlt?: string;
};
