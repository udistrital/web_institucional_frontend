export type PageHeroTitleSegment = {
  text: string;
  accent: boolean;
};

export type PageHeroTitle = string | PageHeroTitleSegment[];

export type PageHeroData = {
  title: PageHeroTitle;
  imageUrl?: string | null;
  imageAlt?: string;
};
