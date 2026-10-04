import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import type { FormatId } from "@/data/products";

/** Lien vers le configurateur (page cabas dédiée pour le cabas). */
export function PersoLink({ format, className, children }: { format?: FormatId | undefined; className?: string; children: ReactNode }) {
  if (format === "cabas") return <Link to="/cabas-personnalise" className={className}>{children}</Link>;
  return <Link to="/composer" search={{ forme: format ?? "rond-xl" }} className={className}>{children}</Link>;
}
