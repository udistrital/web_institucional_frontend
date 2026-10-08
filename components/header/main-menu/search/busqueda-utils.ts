import type { NavigationItem } from "../shared/navigation";

export type SearchResult = {
  item: NavigationItem;
  parents: string[];
  score: number;
};

export function normalizeSearchText(text: string): string {
  if (!text) return "";
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function characterMatchScore(source: string, token: string): number {
  if (!source || !token) return 0;
  return source.includes(token) ? 1 : 0;
}

export function searchNavigation(
  items: NavigationItem[],
  query: string,
  parents: string[] = [],
): SearchResult[] {
  const tokens = normalizeSearchText(query).trim().split(/\s+/).filter(Boolean);
  if (tokens.length === 0) return [];

  return items
    .reduce<SearchResult[]>((results, item) => {
      const label = normalizeSearchText(item.label);
      const context = normalizeSearchText([...parents, item.label].join(" "));

      const scores = tokens.map((token) =>
        Math.max(
          characterMatchScore(label, token) * 2,
          characterMatchScore(context, token),
        ),
      );

      if (scores.every((score) => score > 0)) {
        results.push({
          item,
          parents,
          score: scores.reduce((total, score) => total + score, 0),
        });
      }

      if (item.children && item.children.length > 0) {
        results.push(
          ...searchNavigation(item.children, query, [...parents, item.label]),
        );
      }

      return results;
    }, [])
    .sort((first, second) => second.score - first.score);
}
