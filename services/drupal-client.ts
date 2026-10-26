import "server-only";
import { NextDrupal } from "next-drupal"

export function createDrupalClient() {
  return new NextDrupal(
    process.env.DRUPAL_BASE_URL || "http://localhost:8080",
    { withAuth: false },
  );
}