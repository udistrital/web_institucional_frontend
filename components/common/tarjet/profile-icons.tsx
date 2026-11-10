import type { ProfileIcon } from "@/navegation/audience_services";

/**
 * Íconos de perfil para el medallón de la tarjeta de acceso por rol.
 *
 * Todos comparten viewBox 24x24 y usan `currentColor` para el trazo, de modo
 * que el color lo define el contenedor (el medallón los pinta en blanco). Son
 * de línea, coherentes con la identidad visual institucional (rojo/blanco/dorado).
 */

const common = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

/** Aspirantes: birrete de graduación (primer ingreso / admisión). */
function AspirantesIcon() {
  return (
    <svg aria-hidden="true" {...common}>
      <path d="M12 3 2 8l10 5 10-5-10-5Z" />
      <path d="M6 10.5v4.5c0 1.5 2.7 3 6 3s6-1.5 6-3v-4.5" />
      <path d="M22 8v5" />
    </svg>
  );
}

/** Estudiantes: persona (comunidad estudiantil). */
function EstudiantesIcon() {
  return (
    <svg aria-hidden="true" {...common}>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20a8 8 0 0 1 16 0" />
    </svg>
  );
}

/** Educadores: libro abierto (docencia e investigación). */
function EducadoresIcon() {
  return (
    <svg aria-hidden="true" {...common}>
      <path d="M12 6C10 4.5 7 4 4 4.5v13C7 17 10 17.5 12 19" />
      <path d="M12 6c2-1.5 5-2 8-1.5v13c-3-.5-6 0-8 1.5" />
      <path d="M12 6v13" />
    </svg>
  );
}

/** Administrativos: maletín (funcionarios). */
function AdministrativosIcon() {
  return (
    <svg aria-hidden="true" {...common}>
      <rect x="3" y="7" width="18" height="13" rx="2" />
      <path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
      <path d="M3 12h18" />
    </svg>
  );
}

/** Egresados: medalla / distinción (graduados). */
function EgresadosIcon() {
  return (
    <svg aria-hidden="true" {...common}>
      <circle cx="12" cy="9" r="5" />
      <path d="M9 13.5 7.5 21 12 18.5 16.5 21 15 13.5" />
    </svg>
  );
}

/** Visitantes: brújula (orientación / explorar el portal). */
function VisitantesIcon() {
  return (
    <svg aria-hidden="true" {...common}>
      <circle cx="12" cy="12" r="9" />
      <path d="m15.5 8.5-2 5.5-5.5 2 2-5.5 5.5-2Z" />
    </svg>
  );
}

const icons: Record<ProfileIcon, () => React.ReactElement> = {
  aspirantes: AspirantesIcon,
  estudiantes: EstudiantesIcon,
  educadores: EducadoresIcon,
  administrativos: AdministrativosIcon,
  egresados: EgresadosIcon,
  visitantes: VisitantesIcon,
};

/** Devuelve el SVG del ícono de perfil, o `null` si el nombre no existe. */
export function ProfileIconGlyph({ name }: { name?: ProfileIcon }) {
  if (!name) return null;
  const Glyph = icons[name];
  return Glyph ? <Glyph /> : null;
}
