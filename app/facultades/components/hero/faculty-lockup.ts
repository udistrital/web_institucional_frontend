export type FacultyLockup = {
  eyebrow: string;
  name: string;
};

const LOOSE_DASHES = /(^|\s)[-–—]+(?=\s|$)/g;
const FACULTY_PREFIX = /^(facultad(?:\s+(?:del|de))?)(?:\s+(.*))?$/i;

function normalizeTitle(title: string): string {
  return title.replace(LOOSE_DASHES, "$1").replace(/\s+/g, " ").trim();
}

/** Separa "Facultad de/del" del nombre para el lockup del hero. */
export default function getFacultyLockup(title: string): FacultyLockup {
  const normalizedTitle = normalizeTitle(title);
  const match = normalizedTitle.match(FACULTY_PREFIX);
  const eyebrow = match ? match[1] : "Facultad";
  const name = match ? match[2] ?? "" : normalizedTitle;

  return { eyebrow, name: name || title };
}
