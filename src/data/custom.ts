import { ph } from "./photos";
import type { FormatId } from "./products";

export type Handle = "pois" | "etoiles" | "corde";
export type Color = { name: string; hex: string };

export const formats: { id: FormatId; label: string; price: number; slug: string; image: string }[] = [
  { id: "bb-rond", label: "BB Rond", price: 43, slug: "le-bb-rond", image: ph("bb-rond-vierge-recto-01.jpg") ?? "" },
  { id: "rond", label: "Rond", price: 49, slug: "le-rond", image: ph("rond-vierge-recto-01.jpg") ?? "" },
  { id: "rond-xl", label: "Rond XL", price: 56, slug: "le-rond-xl", image: ph("rond-xl-vierge-recto-01.jpg") ?? "" },
  { id: "bb-carre", label: "BB Carré", price: 54, slug: "le-bb-carre", image: ph("bb-carre-vierge-recto.jpg") ?? "" },
  { id: "carre", label: "Carré", price: 59, slug: "le-carre", image: ph("carre-vierge-recto.jpg") ?? "" },
  { id: "carre-xxl", label: "Carré XXL", price: 64, slug: "le-carre-xxl", image: ph("carre-xxl-vierge-recto.jpg") ?? "" },
  { id: "cabas", label: "Cabas", price: 59, slug: "le-cabas-personnalisable", image: ph("config-cabas-vierge.jpg") ?? "" },
  { id: "vide-poches", label: "Petit panier vide-poches", price: 20, slug: "le-petit-panier-vide-poches", image: ph("vide-poches-vierge-recto.jpg") ?? "" },
];
export const formatOf = (id: FormatId) => formats.find((f) => f.id === id)!;

// Photos des anses : à remplacer (lot 2). Vide = bloc beige avec le nom.
export const handles: { id: Handle; label: string; short: string; photo?: string | undefined }[] = [
  { id: "pois", label: "À pois", short: "anse à pois", photo: ph("config-anse-pois.jpg") },
  { id: "corde", label: "En corde de chanvre", short: "anse en corde de chanvre", photo: ph("config-anse-corde.jpg") },
  { id: "etoiles", label: "À étoiles", short: "anse à étoiles", photo: ph("config-anse-etoiles.jpg") },
];

export const palette: Color[] = [
  ["Noir", "#1A1A1A"], ["Gris", "#A9A9A9"], ["Ciel", "#6CB9E5"], ["Orange", "#FD5A17"], ["Chocolat", "#5D391F"],
  ["Blanc", "#F5F5F3"], ["Framboise", "#AE1146"], ["Bleu marine", "#002C6B"], ["Rouge", "#D71619"], ["Bouton d'or", "#DCB62D"],
  ["Vert végétal", "#058E34"], ["Turquoise", "#02B9B5"], ["Bleu cobalt", "#005DBA"], ["Bleu jean", "#1D649A"], ["Violet", "#5D1581"],
  ["Rose fluo", "#FA37A0"], ["Rose layette", "#F4B9BB"], ["Kaki", "#5A5D26"], ["Vert bouteille", "#0B4A2E"],
].map(([name, hex]) => ({ name: name!, hex: hex! }));

export const paletteCabas: Color[] = [
  ["Noir", "#1A1A1A"], ["Rouge", "#C0161B"], ["Fuchsia", "#D6247A"], ["Bleu jean", "#1D649A"],
  ["Orange", "#E8721C"], ["Jaune", "#E5B521"], ["Cognac", "#9A5A2B"], ["Chocolat", "#4A2C1A"],
].map(([name, hex]) => ({ name: name!, hex: hex! }));

export type CustomConfig = {
  format: FormatId;
  handle?: Handle | undefined;
  handleColor?: Color | undefined;
  textColor: Color;
  festonColor: Color;
  /** cabas : couleur unique */
  single?: boolean | undefined;
  lines: string[];
};

export const MAX = 13;
const ALLOWED = /^[A-Za-zÀ-ÖØ-öø-ÿŒœÆæ0-9 &'’.\-]*$/;

export const ERR = {
  empty: "Il manque le plus important : le mot.",
  long: "Ça déborde du pochoir. Encore trois lettres de moins et c'est parfait.",
  char: "Celui-là, nos pochoirs ne savent pas le faire. Lettres, chiffres, accents et & sont les bienvenus.",
};

export function textError(lines: string[]): string | null {
  if (lines.some((l) => !ALLOWED.test(l))) return ERR.char;
  if (lines.some((l) => l.length > MAX)) return ERR.long;
  if (lines.every((l) => l.trim() === "")) return ERR.empty;
  return null;
}

export const models: { label: string; lines: string[] }[] = [
  { label: "Les trésors de…", lines: ["Les trésors", "de ", ""] },
  { label: "Le bazar de…", lines: ["Le bazar", "de ", ""] },
  { label: "Barda de…", lines: ["Barda", "de ", ""] },
  { label: "Les jouets de…", lines: ["Les jouets", "de ", ""] },
  { label: "Doudous & Cie", lines: ["Doudous & Cie", "", ""] },
  { label: "Mon texte", lines: ["", "", ""] },
];

export function recap(c: CustomConfig): string {
  const f = formatOf(c.format);
  const parts = [f.label];
  if (c.single) parts.push(`couleur ${c.textColor.name.toLowerCase()} (cuir, texte et feston assortis)`);
  else {
    const h = handles.find((x) => x.id === c.handle)!;
    parts.push(h.short, `couleur ${c.textColor.name.toLowerCase()}`);
  }
  parts.push(`« ${c.lines.filter((l) => l.trim()).join(" / ")} »`);
  return parts.join(" · ");
}
