export type FacultyHeadingSegment = {
  text: string;
  accent: boolean;
};

const APPROVED_TERMS = [
  "medio\\s+ambiente",
  "recursos\\s+naturales",
  "matemáticas",
  "matematicas",
  "ingeniería",
  "ingenieria",
  "tecnológica",
  "tecnologica",
  "educación",
  "educacion",
  "naturales",
  "artes",
  "ciencias",
  "salud",
  "asab",
];

const APPROVED_TERM_PATTERN = new RegExp(
  `\\b(?:${APPROVED_TERMS.join("|")})\\b`,
  "gi",
);

function headingText(title: string): string {
  const normalizedTitle = title.trim();
  return /^facultad\b/i.test(normalizedTitle)
    ? normalizedTitle
    : `Facultad ${normalizedTitle}`;
}

function isSafeSeparator(value: string): boolean {
  return /^[\s\-–—]*(?:(?:de|del|la|las|y|e)\s+[\s\-–—]*)*$/i.test(value);
}

export default function getFacultyHeadingSegments(
  title: string,
): FacultyHeadingSegment[] {
  const normalizedTitle = headingText(title);
  const prefixMatch = normalizedTitle.match(/^(Facultad\s+(?:de|del)\s+)/i);

  if (!prefixMatch) {
    return [{ text: normalizedTitle, accent: false }];
  }

  const prefix = prefixMatch[0];
  const subject = normalizedTitle.slice(prefix.length);
  const matches = [...subject.matchAll(APPROVED_TERM_PATTERN)];

  if (!subject || matches.length === 0) {
    return [{ text: normalizedTitle, accent: false }];
  }

  const segments: FacultyHeadingSegment[] = [
    { text: prefix, accent: false },
  ];
  let cursor = 0;

  for (const match of matches) {
    const index = match.index ?? -1;
    if (index < 0 || !isSafeSeparator(subject.slice(cursor, index))) {
      return [{ text: normalizedTitle, accent: false }];
    }

    const separator = subject.slice(cursor, index);
    if (separator) segments.push({ text: separator, accent: false });
    segments.push({ text: match[0], accent: true });
    cursor = index + match[0].length;
  }

  const trailingSeparator = subject.slice(cursor);
  if (!isSafeSeparator(trailingSeparator)) {
    return [{ text: normalizedTitle, accent: false }];
  }
  if (trailingSeparator) {
    segments.push({ text: trailingSeparator, accent: false });
  }

  return segments;
}
