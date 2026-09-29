import type { Metadata } from "next";
import Tarjet from "@/components/tarjet/tarjet";
import { mainNavigation } from "@/navegation/audience_services";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Servicios - Aspirantes",
};

export default function ServiciosAspirantesPage() {
  const aspirantes = mainNavigation.find((p) => p.label === "Aspirantes");
  const children = aspirantes?.children ?? [];

  return (
    <section />
  );
}
