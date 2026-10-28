import { NextDrupal } from "next-drupal";

const baseUrl = process.env.DRUPAL_BASE_URL || "http://localhost:8080";

const drupal = new NextDrupal(baseUrl);

const nodes = await drupal.getResourceCollection("node--animated_hero", {
  params: {
    "filter[status]": "1",
    "filter[title]": "HERO_FMYRN",
    include: "field_hero_image,field_hero_alignment,field_hero_size",
  },
});

console.dir(nodes, { depth: null });
