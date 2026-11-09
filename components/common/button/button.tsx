import Link from "next/link";
import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  Ref,
  ReactNode,
} from "react";
import styles from "./button.module.css";

/** Variantes de contraste aprobadas por la identidad visual institucional. */
export type ButtonVariant = "red" | "white";

type CommonProps = {
  variant?: ButtonVariant;
  children: ReactNode;
  className?: string;
};

/**
 * Props cuando el botón actúa como enlace. Si `href` es una ruta externa
 * (http/https/mailto/tel) se renderiza un `<a>`; en otro caso, un `<Link>` de
 * Next.js para navegación interna.
 */
type LinkButtonProps = CommonProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "className" | "children"> & {
    href: string;
    ref?: Ref<HTMLAnchorElement>;
  };

/** Props cuando el botón ejecuta una acción (no navega). */
type ActionButtonProps = CommonProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children"> & {
    href?: undefined;
    ref?: Ref<HTMLButtonElement>;
  };

export type ButtonProps = LinkButtonProps | ActionButtonProps;

function esEnlaceExterno(href: string): boolean {
  return /^(https?:|mailto:|tel:)/.test(href);
}

/**
 * Botón institucional compartido. Renderiza un `<button>`, un `<a>` o un
 * `<Link>` según las props, manteniendo un estilo visual único en todo el
 * sitio. Usar `variant="red"` sobre fondos claros y `variant="white"` sobre
 * fondos con color.
 */
export default function Button({
  variant = "red",
  className = "",
  children,
  ...rest
}: ButtonProps) {
  const classes = [styles.button, styles[variant], className]
    .filter(Boolean)
    .join(" ");

  // Enlace (interno o externo): el resto de props son atributos de ancla.
  if (rest.href !== undefined) {
    const { href, ...anchorProps } = rest;

    if (esEnlaceExterno(href)) {
      return (
        <a className={classes} href={href} {...anchorProps}>
          {children}
        </a>
      );
    }

    return (
      <Link className={classes} href={href} {...anchorProps}>
        {children}
      </Link>
    );
  }

  // Acción: el resto de props son atributos de <button>.
  return (
    <button className={classes} {...rest}>
      {children}
    </button>
  );
}
