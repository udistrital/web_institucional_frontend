import { NextDrupal } from "next-drupal"

export const drupal = new NextDrupal(
  process.env.DRUPAL_BASE_URL || 'http://localhost:8080',
  { withAuth: false }
)