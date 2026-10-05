import type { ReactNode } from "react";

/** Bloc de section. Aucune animation d'apparition (choix /style). */
export function Reveal({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={className}>{children}</div>;
}
