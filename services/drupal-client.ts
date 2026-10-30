import "server-only";
import { NextDrupal } from "next-drupal"
import { getServerBaseUrl } from "./api";

export function createDrupalClient() {
  return new NextDrupal(getServerBaseUrl(), { withAuth: false });
}
