export type Faculty = {
  id: string;
  title: string;
  href: string;
  imageUrl: string | null;
  imageAlt: string;
};

type FacultyResource = {
  id: string;
  attributes: {
    title?: string;
    path?: { alias?: string | null } | null;
  };
  relationships?: {
    field_imagen_facultad?: {
      data?: { id?: string; meta?: { alt?: string } } | null;
    };
  };
};

type IncludedFile = {
  type?: string;
  id?: string;
  attributes?: { uri?: { url?: string } };
};

type FacultiesResponse = {
  data?: FacultyResource[];
  included?: IncludedFile[];
};

function getServerBaseUrl() {
  const isDocker = Boolean(
    process.env.DRUPAL_BASE_URL &&
      !process.env.NEXT_PUBLIC_DRUPAL_BASE_URL?.includes("localhost"),
  );

  return (
    (isDocker ? process.env.DRUPAL_BASE_URL : process.env.NEXT_PUBLIC_DRUPAL_BASE_URL) ||
    process.env.DRUPAL_BASE_URL ||
    "http://localhost:8080"
  );
}

function resolveImageUrl(path: string | undefined, baseUrl: string) {
  if (!path) return null;

  try {
    return new URL(path, baseUrl).toString();
  } catch {
    return null;
  }
}

function getPublicBaseUrl() {
  return process.env.NEXT_PUBLIC_DRUPAL_BASE_URL || getServerBaseUrl();
}

export async function getFaculties(): Promise<Faculty[]> {
  const apiUrl = new URL("/jsonapi/node/facultades", getServerBaseUrl());
  apiUrl.searchParams.set("filter[status]", "1");
  apiUrl.searchParams.set("include", "field_imagen_facultad");
  apiUrl.searchParams.set("sort", "title");

  try {
    const response = await fetch(
      apiUrl.toString(),
      process.env.NODE_ENV === "development"
        ? { cache: "no-store" }
        : { next: { revalidate: 3600 } },
    );

    if (!response.ok) return [];

    const json = (await response.json()) as FacultiesResponse;
    const included = json.included ?? [];
    const imageBaseUrl = getPublicBaseUrl();

    return (json.data ?? []).map((faculty) => {
      const imageReference = faculty.relationships?.field_imagen_facultad?.data;
      const imageFile = included.find(
        (item) => item.type === "file--file" && item.id === imageReference?.id,
      );
      const title = faculty.attributes.title || "Facultad";

      return {
        id: faculty.id,
        title,
        href: faculty.attributes.path?.alias || `/facultades/${faculty.id}`,
        imageUrl: resolveImageUrl(imageFile?.attributes?.uri?.url, imageBaseUrl),
        imageAlt: imageReference?.meta?.alt || title,
      };
    });
  } catch {
    return [];
  }
}