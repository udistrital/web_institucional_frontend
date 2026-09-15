import type { Metadata } from "next";
import { Lato, Montserrat } from "next/font/google";
import ContactWidget from "@/components/contact-widget/contact-widget";
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

const lato = Lato({
  variable: "--font-lato",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "Universidad Distrital Francisco Jose de Caldas",
    template: "%s | Universidad Distrital",
  },
  description: "Portal institucional de la Universidad Distrital Francisco Jose de Caldas.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  ),
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${montserrat.variable} ${lato.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <ContactWidget />
      </body>
    </html>
  );
}
