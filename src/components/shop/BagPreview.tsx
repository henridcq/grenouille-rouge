import type { FormatId } from "@/data/products";
import { formatOf, type Color } from "@/data/custom";
import { ProductImage } from "./ProductImage";

/**
 * Repères mesurés sur chaque photo vierge (en % de l'image carrée) :
 * rim = hauteur du feston, x0/x1 = bords gauche/droit du panier, bottom = bas de la toile.
 */
const GEO: Record<FormatId, { rim: number; x0: number; x1: number; bottom: number }> = {
  "bb-rond": { rim: 27, x0: 20, x1: 75.5, bottom: 87 },
  rond: { rim: 24.6, x0: 15, x1: 81.5, bottom: 93 },
  "rond-xl": { rim: 23, x0: 12, x1: 83.5, bottom: 94 },
  "bb-carre": { rim: 24, x0: 14, x1: 86, bottom: 90 },
  carre: { rim: 24.2, x0: 10.5, x1: 89.5, bottom: 91 },
  "carre-xxl": { rim: 23.6, x0: 8, x1: 95, bottom: 91 },
  "vide-poches": { rim: 22, x0: 16.5, x1: 94, bottom: 92 },
  cabas: { rim: 30, x0: 20, x1: 80, bottom: 85 },
};

export function BagPreview({ format, color, lines, small = false, className = "" }: { format: FormatId; color: Color; lines: string[]; small?: boolean; className?: string }) {
  const f = formatOf(format);
  const g = GEO[format];
  const shown = lines.map((l) => l.trim()).filter(Boolean);
  const longest = Math.max(4, ...shown.map((l) => l.length));
  const bw = g.x1 - g.x0;
  // ~60 % de la largeur du panier ; une majuscule Stardos fait environ 0,62 em
  const fs = Math.min((0.6 * bw) / (longest * 0.48), 15);
  const isCabas = format === "cabas";

  return (
    <div className={`relative overflow-hidden bg-card [container-type:inline-size] ${className}`}>
      <ProductImage key={f.image} src={f.image} name={f.label} alt={`Aperçu : ${f.label} en jute avec votre texte peint en ${color.name.toLowerCase()}`} className="absolute inset-0 h-full w-full" />
      {!isCabas && (
        <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          <line x1={g.x0} x2={g.x1} y1={g.rim} y2={g.rim} stroke="var(--jute-deep)" strokeWidth="3.4" />
          <line x1={g.x0} x2={g.x1} y1={g.rim} y2={g.rim} stroke={color.hex} strokeWidth="3.2" strokeDasharray="0.5 0.22" />
        </svg>
      )}
      <div className="absolute grid place-items-center" style={{ left: `${g.x0}%`, right: `${100 - g.x1}%`, top: `${g.rim + 2}%`, bottom: `${100 - g.bottom}%` }}>
        <div
          className="text-center uppercase transition-colors"
          style={{
            fontFamily: '"Stardos Stencil", sans-serif', fontWeight: 700, lineHeight: 0.95,
            fontSize: `${fs}cqw`, color: color.hex, opacity: 0.9, mixBlendMode: "multiply",
          }}
        >
          {shown.length ? shown.map((l, i) => <div key={i}>{l}</div>) : <span className="opacity-40">Votre texte</span>}
        </div>
      </div>
      {small && <span className="sr-only">Aperçu réduit</span>}
    </div>
  );
}
