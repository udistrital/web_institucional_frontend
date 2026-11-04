export type ProgramName = {
  title: string;
  tag: string | null;
  fullName: string;
};

const LEVEL_PREFIX_WORDS = ["especializacion", "maestria", "doctorado"];
const TRAILING_PARENTHESIS = /^(.*\S)\s*\(\s*([^()]*[^()\s])\s*\)$/u;
const LEVEL_PREFIX = /^(\S+)\s+(?:en|de)\s+(\S.*)$/iu;

function normalize(text: string) {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("es");
}

function prefixWordForLevel(nivel: string | null | undefined) {
  const level = normalize(nivel ?? "").trim();

  return (
    LEVEL_PREFIX_WORDS.find(
      (word) => level === word || level === `${word}s` || level === `${word}es`,
    ) ?? null
  );
}

function capitalize(text: string) {
  return text.charAt(0).toLocaleUpperCase("es") + text.slice(1);
}

export function splitProgramName(
  nombre: string,
  nivel: string | null | undefined,
): ProgramName {
  const fullName = nombre.trim();
  let title = fullName;
  let tag: string | null = null;

  const parenthesis = TRAILING_PARENTHESIS.exec(title);
  if (parenthesis) {
    title = parenthesis[1].trim();
    tag = parenthesis[2].trim();
  }

  const prefixWord = prefixWordForLevel(nivel);
  const prefix = prefixWord ? LEVEL_PREFIX.exec(title) : null;
  if (prefix && normalize(prefix[1]) === prefixWord) {
    title = capitalize(prefix[2].trim());
  }

  if (!title) {
    return { title: fullName, tag: null, fullName };
  }

  return { title, tag, fullName };
}
