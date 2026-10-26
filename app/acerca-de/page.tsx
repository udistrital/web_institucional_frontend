import { getAboutPage } from "@/services/acerca"

export default async function AcercaDePage() {
  const aboutPageUuid = process.env.DRUPAL_ABOUT_PAGE_UUID

  if (!aboutPageUuid) {
    return <p>Contenido no disponible.</p>
  }

  let page = null
  try {
    page = await getAboutPage(aboutPageUuid)
  } catch {
    page = null
  }

  if (!page) return <p>Contenido no disponible.</p>

  return (
    <article>
      <h1>{page.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: page.bodyHtml }} />
    </article>
  )
}