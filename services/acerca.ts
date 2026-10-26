import "server-only";

import { createDrupalClient } from "./drupal-client";

type DrupalPage = {
  title?: string;
  body?: { processed?: string | null } | null;
};

export type InstitutionalPage = {
  title: string;
  bodyHtml: string;
};

export async function getAboutPage(uuid: string): Promise<InstitutionalPage | null> {
  const drupal = createDrupalClient();
  const result = (await drupal.getResource("node--page", uuid, {
    params: { "fields[node--page]": "title,body" },
    next: { revalidate: 3600 },
  })) as unknown as DrupalPage | null;

  if (!result?.title || !result.body?.processed) return null;

  return { title: result.title, bodyHtml: result.body.processed };
}
