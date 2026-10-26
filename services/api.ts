import "server-only";

export function getServerBaseUrl(): string {
  const isDocker = Boolean(
    process.env.DRUPAL_BASE_URL &&
      !process.env.NEXT_PUBLIC_DRUPAL_BASE_URL?.includes("localhost"),
  );

  return (
    (isDocker
      ? process.env.DRUPAL_BASE_URL
      : process.env.NEXT_PUBLIC_DRUPAL_BASE_URL) ||
    process.env.DRUPAL_BASE_URL ||
    "http://localhost:8080"
  );
}

export function getPublicBaseUrl(): string {
  return process.env.NEXT_PUBLIC_DRUPAL_BASE_URL || getServerBaseUrl();
}

export function getFetchOptions(): RequestInit {
  return process.env.NODE_ENV === "development"
    ? { cache: "no-store" }
    : { next: { revalidate: 3600 } };
}

export function resolveUrl(path: string | undefined, baseUrl: string): string | null {
  if (!path) return null;

  try {
    return new URL(path, baseUrl).toString();
  } catch {
    return null;
  }
}

export async function fetchJson<T>(url: URL | string, options?: RequestInit): Promise<T> {
  const response = await fetch(url.toString(), options ?? getFetchOptions());
  if (!response.ok) {
    throw new Error(`Drupal respondió con HTTP ${response.status}.`);
  }

  return (await response.json()) as T;
}
