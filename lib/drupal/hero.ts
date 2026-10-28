import { queryDrupalCollection } from "./query";
import type { ComponentProps } from "react";
import Hero from "@/components/ui/hero/hero";

type HeroProps = ComponentProps<typeof Hero>;

interface DrupalLink {
  uri: string;
  title: string;
}

interface DrupalHero {
  field_hero_titulo: string;
  field_hero_subtitule: string | null;
  field_hero_primary_button: DrupalLink | null;
  field_hero_secundary_button: DrupalLink | null;
  field_hero_image: { uri: { url: string } };
  field_hero_size?: { name: HeroProps["height"] };
  field_hero_alignment?: { name: HeroProps["alignment"] };
}

const link = (l: DrupalLink | null) =>
  l ? { text: l.title, href: l.uri } : undefined;

export async function getHero(title: string): Promise<HeroProps | null> {
  const [h] = await queryDrupalCollection<DrupalHero[]>("node--animated_hero", {
    "filter[status]": "1",
    "filter[title]": title,
    include: "field_hero_image,field_hero_alignment,field_hero_size",
  });

  if (!h) return null;

  return {
    title: h.field_hero_titulo,
    subtitle: h.field_hero_subtitule ?? undefined,
    backGroundImage: `${process.env.NEXT_PUBLIC_DRUPAL_BASE_URL}${h.field_hero_image.uri.url}`,
    primaryButton: link(h.field_hero_primary_button),
    secundaryButton: link(h.field_hero_secundary_button),
    height: h.field_hero_size?.name,
    alignment: h.field_hero_alignment?.name,
  };
}