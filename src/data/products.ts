// Données de la boutique. Le catalogue (fiches, onglets, prix, photos) vient de catalogue-1-0.json,
// validé par Marie-Isabel : c'est la seule source de vérité. Ce fichier ne fait qu'ajouter
// les textes de fiche et les photos supplémentaires de l'atelier.

import raw from "./catalogue-1-0.json";
import { ph } from "./photos";
import { palette, paletteCabas } from "./custom";

export type RayonId = "personnalises" | "cabas-sacs" | "maison" | "petits-cadeaux";
export type FormatId = "bb-rond" | "rond" | "rond-xl" | "bb-carre" | "carre" | "carre-xxl" | "cabas" | "vide-poches";

export type Choice = { name: string; image?: string | undefined; price?: number | undefined; hex?: string | undefined };
export type Option = { label: string; choices: Choice[] };

export type Product = {
  slug: string;
  name: string;
  /** Prix de base (ou « à partir de » quand une option change le prix) */
  price: number;
  fromPrice?: boolean;
  rayon: RayonId;
  images: string[];
  alt: string;
  accroche?: string;
  /** Fiches personnalisables : paragraphe « Ce que vous choisissez » et fiche technique complète validés. */
  choose?: string;
  techLine?: string;
  body?: string;
  tech?: string;
  proof?: string;
  /** Ligne verte sous le prix (stock, fabrication) */
  stockLine?: string;
  format?: FormatId;
  options?: Option[];
  bestseller: boolean;
  /** Photo faible : jamais mise en avant sur l'accueil */
  weakPhoto: boolean;
  seo?: { title: string; description: string };
};

const P = (n: string) => ph(n) ?? "";
const p = (id: number) => `https://grenouillerouge.com/img/p/${String(id).split("").join("/")}/${id}.jpg`;
export const cms = (f: string) => `https://grenouillerouge.com/img/cms/${f}`;
export const LOGO = "https://grenouillerouge.com/img/grenouille-rouge-logo-1683816362.jpg";

export const PHOTOS = {
  accueil: P("accueil-hero.jpg"),
  atelier: cms("Grenouille-Rouge-2.jpg"),
  cuirs: P("atelier-cuirs-couleurs.jpg"),
  etiquette: P("detail-etiquette-made-in-france.jpg"),
  hero: P("ambiance-les-jouets-de-leo.jpg"),
  princesse: P("ambiance-tresors-de-princesse.jpg"),
  trio: P("ambiance-trio-canape.jpg"),
  carreSalon: P("ambiance-carre-salon.jpg"),
  parisiennePortee: P("parisienne-kaki-portee-02.jpg"),
  poele: P("ambiance-on-va-pas-s-peler-poele.jpg"),
  printemps: P("ambiance-rangement-de-printemps.jpg"),
  miniAmbiance: P("mini-vide-tes-poches-ambiance.jpg"),
  musee: P("parisienne-moutarde-musee.jpg"),
  trioRonds: P("trio-ronds-vierges-02.jpg"),
  peler: P("on-va-pas-s-peler-detail.jpg"),
  jute: cms("Qui-sommes-nous-2.jpg"),
  ambiance: cms("Grenouille-Rouge.jpg"),
};

// ---------- Lecture du catalogue ----------
type Raw = {
  nom: string; onglet: string; prix: number | string; photo?: string; note?: string; option?: string;
  variantes?: { choix: string; photo: string }[]; ventes_24_mois: number; photo_a_refaire: boolean; dimensions?: string;
};

const RAYON: Record<string, RayonId> = { "Personnalisés": "personnalises", "Cabas & sacs": "cabas-sacs", "La maison": "maison", "Petits cadeaux": "petits-cadeaux" };

/** Noms retouchés à la main (majuscules, accents, consignes de la note). */
const NAMES: Record<string, string> = {
  "Le carré XXL": "Le Carré XXL",
  "Le rond": "Le Rond",
  "Le pailleté": "Le Pailleté",
  "1 2 3 PLOUF": "1 2 3 Plouf",
  "CABAS JO": "Cabas JO",
  "CABAS RAYE": "Cabas rayé",
  "CABAS VERT POP": "Cabas vert pop",
  "Cabas mille pois": "Mille pois",
  "Panier en jute étoile ou coeur": "Étoile ou cœur",
  "PANIER DE RANGEMENT OU PLAGE EN TOILE DE PARASOL": "Panier de rangement ou de plage en toile de parasol",
  "Au coin du feu (sac à bûches)": "Au coin du feu",
  "Coussin décoration villes Carte de France dos vert": "Coussin décoration Carte de France bleue",
  "Coussin décoration - Corse": "Coussin Corse",
  "Gamme Luxe (chevron laine)": "Gamme Luxe",
  "Grenouille rouge": "Grenouille Rouge",
};
const PREFIX = /^(Cabas (personnalisable )?en jute|Sac de rangement|Panier de rangement|Sac à bois en jute|Sac à bûches en jute|Sac à granulés de bois|Panier à jouets)\s*-\s*/i;

function cleanName(r: Raw): string {
  let n = r.nom.replace(/\s+/g, " ").trim();
  if (NAMES[n]) return NAMES[n]!;
  if (r.onglet === "Personnalisés") n = n.split(",")[0]!;
  n = n.replace(PREFIX, "").replace(/\.$/, "").trim();
  return NAMES[n] ?? n;
}
const slugify = (s: string) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/œ/g, "oe").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const img = (s: string) => (s.startsWith("http") ? s : P(s));

// ---------- Compléments de l'atelier (textes, photos en plus) ----------
const persoBody = "En toile de jute tissée au Ronchay, doublé, surpiqué et peint au pochoir dans notre atelier de Grémonville. Il tient debout tout seul, même vide. Et il tiendra des années.";
const MINI_BODY = "Quinze centimètres de jute doublée et surpiquée, une languette en cuir, et un message peint à la main. À poser dans l'entrée, la cuisine, la salle de bain. À offrir… ou pas.";
const colorOpt = (label: string, list: { name: string; hex: string }[]): Option => ({ label, choices: list.map((c) => ({ name: c.name, hex: c.hex })) });
const names = (label: string, list: string[]): Option => ({ label, choices: list.map((name) => ({ name })) });

type Extra = Partial<Omit<Product, "slug" | "name" | "price" | "rayon" | "bestseller" | "weakPhoto">> & { more?: string[] };
const perso = (format: FormatId, accroche: string, tech: string, alt: string, more: string[]): Extra => ({ format, accroche, tech, alt, body: persoBody, proof: "Peint à la main", more: more.map(P) });

const EXTRA: Record<string, Extra> = {
  "le-rond-xl": { ...perso("rond-xl", "Notre préféré, et le vôtre. Jouets, linge, plaids, bûches : il avale tout.", "H 40 · Ø 40 cm", "Grand panier rond XL en jute, prêt à recevoir votre texte peint à la main", ["ambiance-les-jouets-de-leo.jpg", "rond-xl-vierge-recto-01.jpg", "rond-xl-vierge-profil-01.jpg"]),
    body: "Quarante centimètres de haut, quarante de large : le Rond XL est notre panier le plus demandé, et de loin. Les jouets de Léo, les trésors de Solveig, le barda de Papa, le linge de toute la famille. En toile de jute tissée au Ronchay, doublé, surpiqué et peint au pochoir dans notre atelier de Grémonville.",
    choose: "l'anse (à pois, à étoiles ou en corde de chanvre), une seule couleur pour tout le panier parmi les 19 proposées (le texte, le feston et les motifs de l'anse), et votre texte : jusqu'à 3 lignes de 13 caractères, en majuscules.",
    techLine: "H 40 · Ø 40 cm · jute, doublure jute · un coup de brosse, pas de machine.",
    seo: { title: "Le Rond XL : grand panier en jute personnalisé à votre prénom", description: "Notre panier le plus demandé. 40 cm, jute normande, texte peint à la main. Jouets, linge, plaids. 56 €, livraison offerte en point relais." } },
  "le-bb-rond": perso("bb-rond", "Pour les petites choses qui comptent : chaussettes, doudous, télécommandes.", "H 30 · Ø 30 cm", "Petit panier rond BB en jute, à personnaliser", ["bb-rond-vierge-recto-01.jpg", "bb-rond-vierge-profil-01.jpg"]),
  "le-rond": perso("rond", "Le format qui va partout : entrée, salle de bain, bureau.", "H 35 · Ø 35 cm", "Panier rond en jute, à personnaliser", ["rond-vierge-recto-01.jpg", "ambiance-tresors-de-princesse.jpg", "rond-vierge-profil-01.jpg", "rond-vierge-anses-01.jpg"]),
  "le-bb-carre": perso("bb-carre", "Le petit carré : il range sans prendre de place.", "35 × 35 × 35 cm", "Panier BB Carré en jute, à personnaliser", []),
  "le-carre": perso("carre", "Des angles nets, des pompons, et de la place.", "H 38 · 40 × 40 cm", "Panier carré en jute à pompons, à personnaliser", ["carre-vierge-recto.jpg", "ambiance-carre-salon.jpg", "carre-vierge-profil.jpg", "carre-vierge-anses.jpg"]),
  "le-carre-xxl": perso("carre-xxl", "Le coffre à jouets qu'on n'a pas honte de laisser au salon.", "H 40 · 45 × 45 cm", "Grand panier carré XXL en jute, à personnaliser", ["carre-xxl-vierge-recto.jpg", "carre-xxl-vierge-profil.jpg"]),
  "le-cabas-personnalisable": { ...perso("cabas", "Pour le marché, la plage, l'école. Avec votre mot dessus, et des anses en cuir assorties.", "H 36 · L 40 · P 15 cm · anses 42 cm", "Cabas en jute avec anses en cuir, à personnaliser", ["config-cabas-vierge.jpg"]),
    accroche: "Pour le marché, la plage, l'école. Avec votre mot dessus.",
    body: "Toile de jute tissée en Normandie, anses en cuir au tannage végétal, peint au pochoir et cousu dans notre atelier de Grémonville.",
    choose: "une couleur parmi 8 (noir, rouge, fuchsia, bleu jean, orange, jaune, cognac, chocolat) ; le cuir des anses, le texte et le feston sont assortis. Et votre texte : jusqu'à 3 lignes de 13 caractères, en majuscules.",
    techLine: "H 36 · L 40 · P 15 cm · anses 42 cm · jute, cuir · un coup de brosse pour l'entretien." },
  "le-petit-panier-vide-poches": perso("vide-poches", "Clés, lunettes, monnaie. Le petit cadeau qui reste.", "H 16 · Ø 15 cm", "Petit panier vide-poches en jute, à personnaliser", ["vide-poches-vierge-recto.jpg"]),

  "le-loom": { images: ["sac-jute-bord-noir-porte-01.jpg", "sac-jute-bord-noir-porte-02.jpg", "sac-jute-bord-noir-porte-03.jpg", "sac-jute-bord-noir-porte-04.jpg", "sac-jute-bord-noir-jardin-01.jpg", "sac-jute-bord-noir-jardin-02.jpg"].map(P),
    alt: "Le Loom, sac à main en jute bordé de noir, porté", proof: "Cousu à Grémonville", stockLine: "Fait à la commande",
    accroche: "Le sac à main qui n'a pas besoin d'en faire trop.",
    body: "Toile de jute naturelle bordée de noir, anses en cuir au tannage végétal : le Loom se porte à l'épaule ou à la main, du bureau au marché, sans jamais détonner. Cousu dans notre atelier de Grémonville, à la commande. Il fait partie de ces sacs qu'on finit par porter tous les jours sans l'avoir décidé.",
    tech: "30 × 27 × 16 cm · jute, chevron laine, cuir.",
    seo: { title: "Le Loom : sac à main en jute bordé de noir, cousu en Normandie", description: "Toile de jute bordée de noir, anses en cuir au tannage végétal. Cousu à la commande à Grémonville. 68 €." } },
  "l-elegant": { body: "Le même sac que le Loom, avec la jute à l'intérieur.", proof: "Cousu à Grémonville" },
  "la-parisienne": { more: ["parisienne-kaki-portee-03.jpg", "parisienne-kaki-portee-01.jpg", "parisienne-moutarde-musee.jpg"].map(P), proof: "Cousue à Grémonville",
    accroche: "Un grand cabas en lin enduit, réversible, cousu en Normandie. Le reste est une question d'allure.",
    body: "Quarante centimètres de haut, cinquante de large, et deux anses en cuir chocolat au tannage végétal, interchangeables. Lin enduit d'un côté, lin naturel de l'autre : retournez-le selon l'humeur. Fabriquée en série limitée à l'atelier. Au travail, à la plage ou en week-end, c'est une valeur sûre.",
    tech: "40 × 50 × 11 cm · lin enduit, lin, cuir · éponge humide." },
  titi: { proof: "Cousu à Grémonville", accroche: "Le lin enduit, les anses en cuir, et une poche zippée pour ce qu'on ne veut pas perdre.",
    body: "Un sac à main en lin enduit, doublé de lin naturel, avec deux anses en cuir au tannage végétal qu'on change à volonté. Cousu à Grémonville.", tech: "40 × 35 × 12 cm · lin enduit, lin, cuir." },
  midinette: { proof: "Cousu en Normandie", accroche: "En hommage aux midinettes, ces couturières parisiennes du début du siècle. La nôtre se porte en bandoulière.",
    body: "Lin enduit imperméable, fermeture à glissière, anse réglable de 70 à 116 cm. À l'intérieur, une poche zippée et deux poches plaquées.", tech: "35 × 30 cm · lin enduit, lin." },
  "multi-teckels": { proof: "Peint à la main", accroche: "Des teckels peints un par un. Aucun ne ressemble à son voisin.",
    body: "Petit cabas en jute tissée en Normandie, entièrement doublé, anses en cuir rivées. Chaque teckel est peint à la main.", tech: "27 × 30 cm · jute, cuir." },
  "multi-homards": { proof: "Peint à la main", accroche: "Rouge, rose ou bleu : les homards de l'été, peints à la main.",
    body: "Un petit cabas en jute doublé, anses en cuir français au tannage végétal. Chaque homard est peint un par un dans l'atelier.", tech: "25 × 30 cm · jute, cuir." },
  "le-petit-classique": { proof: "Cousu à Grémonville", accroche: "Le cabas en jute de tous les jours. Choisissez la couleur des anses, le reste est déjà parfait.",
    body: "Toile de jute, anses en cuir au tannage végétal. Pour les courses, la ville, la plage, et toutes les fois où on ne sait pas quel sac prendre.", tech: "30 × 40 cm · jute, cuir." },
  "etoile-ou-coeur": { proof: "Cousu main", accroche: "Un appliqué en cuir doré, cousu à la main. Une étoile, ou un cœur : à vous de dire.",
    options: [names("Motif", ["Étoile", "Cœur"])], body: "Panier-cabas en jute tissée en Normandie, anses en cuir au tannage végétal. L'appliqué est découpé et posé à la main : chaque pièce est unique.", tech: "30 × 40 cm · anses 42 cm · jute, cuir." },
  "mille-pois": { proof: "Peint à la main", accroche: "Un cabas normand jusque dans la doublure : de la bâche recyclée.",
    body: "Toile de jute tissée en Normandie, pois peints à la main, doublure en bâche récupérée, anses en cuir au tannage végétal.", tech: "30 × 50 cm à plat · anses 42 cm · jute, bâche, cuir." },
  "le-paillete": { proof: "Cousu à l'atelier", options: [names("Couleur", ["Or", "Argent"])], accroche: "De la jute, du lurex, et des anses en cuir. Le cabas des soirs d'été.",
    body: "Tissé en Normandie, cousu à l'atelier. Les paillettes sont dans le fil, pas collées dessus : elles ne partiront pas." },
  "mon-coeur": { proof: "Peint à la main", options: [names("Couleur", ["Rouge", "Bleu"])], accroche: "Des petits cœurs peints à la main. Pas deux pareils.",
    body: "Petit cabas en jute doublé, anses en cuir français au tannage végétal, cousu à Grémonville.", tech: "25 × 30 cm · jute, cuir." },
  "grenouille-des-villes": { body: "Une toile et une taille à part : ce cabas n'est pas personnalisable. Il existe en noir uniquement." },
  "cabas-leopard": { body: "Notre clin d'œil au millénaire de la Normandie." },
  "cabas-raye": { body: "La nouvelle gamme de rentrée, en toiles recyclées." },

  "au-coin-du-feu": { proof: "Peint à la main", accroche: "Le classique de l'atelier, celui que les boutiques nous redemandent chaque automne.",
    body: "Même toile, même sangle, même solidité que Chauffe Marcel, avec son message peint en orange, en blanc, en vert ou en violet. Il transporte les bûches, puis les plaids, les jouets, les magazines. Un sac pour la cheminée, qui finit souvent dans le salon.", tech: "H 40 · fond 40 × 60 cm · jute, sangle, ficelle · non traité contre le feu : à tenir éloigné des flammes." },
  "chauffe-marcel": { proof: "Peint à la main", accroche: "Un sac à bûches qui a du chien.",
    body: "Toile de jute épaisse, doublée, surpiquée de coton, une sangle de tapissier qui fait tout le tour pour porter lourd sans broncher. « Chauffe Marcel » peint au pochoir, à la main. Il porte le bois et il fait sourire tout l'hiver.",
    tech: "H 40 · fond 40 × 60 cm · jute, sangle, ficelle · non traité contre le feu : à tenir éloigné des flammes." },
  "on-va-pas-s-peler": { more: ["ambiance-on-va-pas-s-peler-poele.jpg", "on-va-pas-s-peler-recto.jpg", "on-va-pas-s-peler-detail.jpg", "on-va-pas-s-peler-anse.jpg", "on-va-pas-s-peler-profil.jpg"].map(P), proof: "Peint à la main",
    accroche: "Le sac à granulés qui dit tout haut ce que vous pensez en décembre.", body: "Un grand rond en jute doublée, anses en cuir noir, message peint au pochoir. Il avale un sac de granulés entier et reste beau à côté du poêle.", tech: "H 40 · Ø 40 cm · jute, cuir." },
  "barda-de-famille": { more: [P("barda-de-famille-orange-01.jpg"), P("barda-de-famille-gris-recto.jpg")], proof: "Peint à la main" },
  "bar-a-bazar": { more: [P("bar-a-bazar-recto.jpg"), P("bar-a-bazar-profil.jpg")], proof: "Peint à la main" },
  "mon-fourbi-francais": { proof: "Peint à la main", options: [colorOpt("Couleur du message", palette)] },
  "bar-a-bouquins": { proof: "Peint à la main", options: [colorOpt("Couleur", paletteCabas)] },
  "coussin-decoration-et-coussin-corse": { body: "Offre groupée : le coussin Carte de France et le petit coussin Corse." },
  "coussin-corse": { body: "Le petit coussin." },
  "gamme-luxe": { body: "Le panier rond en chevron de laine, en trois tailles." },

  "trousse-soco": { proof: "Cousue à Grémonville", accroche: "Cousue dans les chutes de toile d'ombrage de Socotex, à Honfleur. Rien ne se perd.",
    body: "Trousse de toilette ou trousse d'école, lavable d'un coup d'éponge. La languette est taillée dans les chutes de cuir de nos anses.", tech: "23 × 7 × 7 cm · toile technique, cuir." },
  "trousse-en-lin-personnalisable": { proof: "Peint à la main", accroche: "Ses initiales, son prénom court : sept lettres, peintes à la main.",
    body: "Une trousse en lin, peinte au pochoir à l'atelier avec le mot de votre choix, dans une des 19 couleurs de nos personnalisés." },
};

const seen = new Set<string>();
export const products: Product[] = (raw as Raw[]).map((r) => {
  const name: string = cleanName(r);
  let slug = slugify(name);
  while (seen.has(slug)) slug += "-2";
  seen.add(slug);
  const x = EXTRA[slug] ?? {};
  const options: Option[] = [];
  let price = typeof r.prix === "number" ? r.prix : 0;
  let fromPrice = false;
  if (r.variantes) {
    const choices: Choice[] = r.variantes.map((v) => {
      const m = v.choix.match(/^(.*?)\s*·\s*(\d+)\s*€$/);
      return { name: m ? m[1]! : v.choix, image: img(v.photo), price: m ? Number(m[2]) : undefined };
    });
    options.push({ label: r.option ?? "Modèle", choices });
    const prices = choices.map((c) => c.price).filter((n): n is number => n !== undefined);
    if (prices.length) { price = Math.min(...prices); fromPrice = true; }
  }
  if (slug === "gamme-luxe") options.push(names("Couleur", ["Naturel", "Kaki"]));
  if (x.options) options.push(...x.options);
  const main = r.photo ? img(r.photo) : options[0]?.choices[0]?.image ?? "";
  const variantImgs = options.flatMap((o) => o.choices.map((c) => c.image).filter((s): s is string => !!s));
  const images = x.images ?? [...new Set([main, ...variantImgs, ...(x.more ?? [])].filter(Boolean))];
  const rayon = RAYON[r.onglet]!;
  const isMini = /^mini /i.test(name);
  return {
    proof: "Cousu main",
    ...(isMini ? { body: MINI_BODY, tech: "H 15 · Ø 16 cm · jute, cuir.", proof: "Peint à la main" } : {}),
    ...(r.dimensions && !x.tech ? { tech: r.dimensions } : {}),
    ...x,
    slug, name, price, fromPrice, rayon, images,
    alt: x.alt ?? name,
    ...(options.length ? { options } : {}),
    bestseller: r.ventes_24_mois >= 5,
    weakPhoto: r.photo_a_refaire,
  } as Product;
});

export const bySlug = (slug: string) => products.find((x) => x.slug === slug);

export const rayons: Record<RayonId, { label: string; title: string; intro: string; seoTitle: string }> = {
  personnalises: { label: "Personnalisés", title: "Paniers et sacs personnalisés", intro: "", seoTitle: "Panier personnalisé prénom, peint à la main · Grenouille Rouge" },
  "cabas-sacs": { label: "Cabas & sacs", title: "Cabas & sacs", intro: "Cabas en jute, sacs à main en lin : cousus à Grémonville, motifs peints à la main, anses en cuir au tannage végétal.", seoTitle: "Cabas en jute et sacs à main cousus en Normandie · Grenouille Rouge" },
  maison: { label: "La maison", title: "La maison", intro: "Paniers de rangement, sacs à bûches, coussins : en toile de jute doublée, messages peints à la main au pochoir.", seoTitle: "Paniers de rangement, sacs à bûches et coussins en jute · Grenouille Rouge" },
  "petits-cadeaux": { label: "Petits cadeaux", title: "Petits cadeaux", intro: "Minis à messages, trousses, porte-médailles : à glisser dans le colis. Petits par la taille, pas par le caractère.", seoTitle: "Petits cadeaux en jute peints à la main · Grenouille Rouge" },
};

export const shopRayons: RayonId[] = ["cabas-sacs", "maison", "petits-cadeaux"];

// Frais de port simulés
export const RELAIS_FREE = 39;
export const DOMICILE_FREE = 90;
export const shippingOptions = [
  { id: "relais", label: "Point relais", help: "offert dès 39 €", price: (t: number) => (t >= RELAIS_FREE ? 0 : 3.9) },
  { id: "domicile", label: "À domicile", help: "6,90 €", price: (t: number) => (t >= DOMICILE_FREE ? 0 : 6.9) },
  { id: "atelier", label: "Retrait à l'atelier de Grémonville, sur rendez-vous", help: "gratuit, on vous appelle quand c'est prêt", price: () => 0 },
] as const;

export const euro = (n: number) => n.toFixed(2).replace(".", ",") + " €";

export const delayOf = (pr: Product) =>
  pr.rayon === "personnalises" || pr.slug === "trousse-en-lin-personnalisable" ? "Expédié sous 8 jours" : "Expédié sous 48 h";
