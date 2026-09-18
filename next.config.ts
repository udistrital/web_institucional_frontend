import type { NextConfig } from "next"

const imageProtocol: "http" | "https" =
  process.env.NEXT_IMAGE_PROTOCOL === "https" ? "https" : "http"

const configuredImageHosts = [
  process.env.NEXT_IMAGE_DOMAIN,
  process.env.NEXT_PUBLIC_DRUPAL_BASE_URL,
  process.env.DRUPAL_BASE_URL,
]
  .filter(Boolean)
  .flatMap((value) => {
    if (!value) return []

    const entries = value
      .split(",")
      .map((entry) => entry.trim())
      .filter(Boolean)

    return entries.flatMap((entry) => {
      try {
        return [new URL(entry).hostname]
      } catch {
        return [entry.replace(/^https?:\/\//, "")]
      }
    })
  })

const remotePatterns = [
  ...new Set(configuredImageHosts.length ? configuredImageHosts : ["localhost", "backend"]),
].map((hostname) => ({
  protocol: imageProtocol,
  hostname,
}))

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
    remotePatterns,
  },
}

export default nextConfig
