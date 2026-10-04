// Données de la maquette : tout est ici, facile à modifier.
// Photos : https://grenouillerouge.com/img/p/… (originaux du site actuel). Remplacer une adresse suffit.

export type RayonId = "personnalises" | "sacs-a-main" | "cabas" | "rangement" | "buches" | "minis" | "trousses";
export type FormatId = "bb-rond" | "rond" | "rond-xl" | "carre" | "carre-xxl" | "cabas" | "vide-poches";

export type Product = {
  slug: string;
  name: string;
  price: number;
  rayon: RayonId;
  images: string[];
  alt: string;
  accroche?: string;
  body?: string;
  tech?: string;
  proof?: string;
  /** "out" = Bientôt de retour ; nombre = il en reste X */
  stock?: "out" | number;
  format?: FormatId;
  seo?: { title: string; description: string };
};

import { ph } from "./photos";
const P = (n: string) => ph(n) ?? "";
const p = (id: number) => `https://grenouillerouge.com/img/p/${String(id).split("").join("/")}/${id}.jpg`;
export const cms = (f: string) => `https://grenouillerouge.com/img/cms/${f}`;
export const LOGO = "https://grenouillerouge.com/img/grenouille-rouge-logo-1683816362.jpg";

export const PHOTOS = {
  atelier: cms("Grenouille-Rouge-2.jpg"),
  cuirs: P("atelier-cuirs-couleurs.jpg"),
  etiquette: P("detail-etiquette-made-in-france.jpg"),
  hero: P("ambiance-les-jouets-de-leo.jpg"),
  princesse: P("ambiance-tresors-de-princesse.jpg"),
  trio: P("ambiance-trio-canape.jpg"),
  parisiennePortee: P("parisienne-kaki-portee-02.jpg"),
  poele: P("ambiance-on-va-pas-s-peler-poele.jpg"),
  printemps: P("ambiance-rangement-de-printemps.jpg"),
  miniAmbiance: P("mini-vide-tes-poches-ambiance.jpg"),
  musee: P("parisienne-moutarde-musee.jpg"),
  trioRonds: P("trio-ronds-vierges-02.jpg"),
  ronds: P("trois-ronds-empiles-01.jpg"),
  peler: P("on-va-pas-s-peler-detail.jpg"),
  jute: cms("Qui-sommes-nous-2.jpg"),
  ambiance: cms("Grenouille-Rouge.jpg"),
};

const persoBody =
  "En toile de jute tissée au Ronchay, doublé, surpiqué et peint au pochoir dans notre atelier de Grémonville. Il tient debout tout seul, même vide. Et il tiendra des années.";

const perso = (
  slug: string, format: FormatId, name: string, price: number, imgs: (number | string)[], accroche: string, dims: string, alt: string,
): Product => ({
  slug, format, name, price, rayon: "personnalises", images: imgs.map((i) => (typeof i === "number" ? p(i) : P(i))), alt, accroche, body: persoBody, tech: dims, proof: "Peint à la main",
});

const MINI_BODY =
  "Quinze centimètres de jute doublée et surpiquée, une languette en cuir, et un message peint à la main : Peace mémé, Vide tes poches, Le gras c'est la vie, Chargeurs & Co, Médocs, Belle et rebelle… À poser dans l'entrée, la cuisine, la salle de bain. À offrir… ou pas.";
const mini = (slug: string, name: string, imgs: number[]): Product => ({
  slug: `mini-${slug}`, name, price: 19, rayon: "minis", images: imgs.map(p),
  alt: `Mini panier en jute « ${name} » peint à la main`,
  accroche: "Petits par la taille. Pas par le caractère.", body: MINI_BODY, tech: "H 15 · Ø 16 cm · jute, cuir.", proof: "Peint à la main",
});

export const products: Product[] = [
  // Personnalisables
  { ...perso("le-rond-xl", "rond-xl", "Le Rond XL", 56, ["ambiance-les-jouets-de-leo.jpg", "rond-xl-vierge-recto-01.jpg", "rond-xl-vierge-profil-01.jpg", 1390, 3051], "Notre préféré, et le vôtre. Jouets, linge, plaids, bûches : il avale tout.", "H 40 · Ø 40 cm", "Grand panier rond XL en jute, prêt à recevoir votre texte peint à la main"),
    body: "Quarante centimètres de haut, quarante de large : le Rond XL est notre panier le plus demandé, et de loin. Les jouets de Léo, les trésors de Solveig, le barda de Papa, le linge de toute la famille. En toile de jute tissée au Ronchay, doublé, surpiqué et peint au pochoir dans notre atelier de Grémonville. Il tient debout tout seul, même vide. Et il tiendra des années.",
    seo: { title: "Le Rond XL : grand panier en jute personnalisé à votre prénom", description: "Notre panier le plus demandé. 40 cm, jute normande, texte peint à la main. Jouets, linge, plaids. 56 €, livraison offerte en point relais." } },
  perso("le-bb-rond", "bb-rond", "Le BB Rond", 43, ["bb-rond-vierge-recto-01.jpg", "bb-rond-vierge-profil-01.jpg", 1452, 3053], "Pour les petites choses qui comptent : chaussettes, doudous, télécommandes.", "H 25 · Ø 25 cm", "Petit panier rond BB en jute, à personnaliser"),
  perso("le-rond", "rond", "Le Rond", 49, ["rond-vierge-recto-01.jpg", "ambiance-tresors-de-princesse.jpg", "rond-vierge-profil-01.jpg", "rond-vierge-anses-01.jpg", 565, 3054], "Le format qui va partout : entrée, salle de bain, bureau.", "H 35 · Ø 35 cm", "Panier rond en jute, à personnaliser"),
  perso("le-carre", "carre", "Le Carré", 59, ["carre-vierge-recto.jpg", "ambiance-carre-salon.jpg", "carre-vierge-profil.jpg", "carre-vierge-anses.jpg", 1478, 3055], "Des angles nets, des pompons, et de la place.", "35 × 35 cm", "Panier carré en jute à pompons, à personnaliser"),
  perso("le-carre-xxl", "carre-xxl", "Le Carré XXL", 64, ["carre-xxl-vierge-recto.jpg", "carre-xxl-vierge-profil.jpg", 464, 3050], "Le coffre à jouets qu'on n'a pas honte de laisser au salon.", "40 × 40 cm", "Grand panier carré XXL en jute, à personnaliser"),
  perso("le-cabas-personnalisable", "cabas", "Le cabas personnalisable", 59, ["config-cabas-vierge.jpg", 2350, 3056], "Pour le marché, la plage, l'école. Avec votre mot dessus, et des anses en cuir assorties.", "30 × 40 cm", "Cabas en jute avec anses en cuir, à personnaliser"),
  perso("le-petit-panier-vide-poches", "vide-poches", "Le petit panier vide-poches", 20, [3040, 3057, "vide-poches-vierge-recto.jpg"], "Clés, lunettes, monnaie. Le petit cadeau qui reste.", "H 15 · Ø 16 cm", "Petit panier vide-poches en jute, à personnaliser"),

  // Sacs à main
  { slug: "loom", name: "Loom", price: 74, rayon: "sacs-a-main", images: [p(2949), p(2948)], alt: "Sac à main Loom en jute à chevrons gris et kaki, anses en cuir", stock: 3, proof: "Cousu à Grémonville",
    accroche: "Le sac à main qui n'a pas besoin d'en faire trop.",
    body: "Jute naturelle, chevrons gris et kaki, anses en cuir au tannage végétal : le Loom se porte à l'épaule ou à la main, du bureau au marché, sans jamais détonner. Cousu dans notre atelier de Grémonville, en petite série. Il fait partie de ces sacs qu'on finit par porter tous les jours sans l'avoir décidé.",
    tech: "30 × 27 × 16 cm · jute, cuir · éponge humide.",
    seo: { title: "Loom : sac à main en jute et cuir, fabriqué en Normandie", description: "Jute naturelle, chevrons gris et kaki, anses en cuir végétal. Porté épaule ou main. Cousu à l'atelier en petite série. 74 €." } },
  { slug: "la-parisienne", name: "La Parisienne", price: 149, rayon: "sacs-a-main", images: [P("parisienne-kaki-portee-03.jpg"), P("parisienne-kaki-portee-01.jpg"), P("parisienne-moutarde-musee.jpg"), P("parisienne-kaki-portee-02.jpg"), p(1254), p(2056), p(1244), p(2057)], alt: "Grand cabas La Parisienne en lin enduit, anses en cuir chocolat", proof: "Cousue à Grémonville",
    accroche: "Un grand cabas en lin enduit, réversible, cousu en Normandie. Le reste est une question d'allure.",
    body: "Quarante centimètres de haut, cinquante de large, et deux anses en cuir chocolat au tannage végétal, interchangeables. Lin enduit d'un côté, lin naturel de l'autre : retournez-le selon l'humeur. Fabriquée en série limitée à l'atelier. Elle va au travail, à la plage et en week-end, et elle y va longtemps.",
    tech: "40 × 50 × 11 cm · lin enduit, lin, cuir · éponge humide.",
    seo: { title: "La Parisienne : grand cabas en lin enduit réversible, 149 €", description: "Un sac à main en lin français, réversible, anses en cuir interchangeables. Série limitée cousue en Normandie." } },
  { slug: "titi", name: "Titi", price: 142, rayon: "sacs-a-main", images: [p(1232), p(2411), p(2417), p(1239)], alt: "Sac à main Titi en lin enduit noir, anses en cuir orange", proof: "Cousu à Grémonville",
    accroche: "Le lin enduit noir, les anses orange, et une poche zippée pour ce qu'on ne veut pas perdre.",
    body: "Un sac à main en lin enduit, doublé de lin naturel, avec deux anses en cuir au tannage végétal qu'on change à volonté. Une poche plaquée, une poche fermée. Cousu à Grémonville. Sobre dehors, bien rangé dedans.",
    tech: "40 × 35 × 12 cm · lin enduit, lin, cuir." },
  { slug: "midinette", name: "Midinette", price: 94, rayon: "sacs-a-main", images: [p(2196), p(2200), p(2194), p(2202), p(2208)], alt: "Sac bandoulière Midinette en lin enduit noir", proof: "Cousu en Normandie",
    accroche: "En hommage aux midinettes, ces couturières parisiennes du début du siècle. Le nôtre se porte en bandoulière.",
    body: "Lin enduit imperméable, fermeture à glissière, anse réglable de 70 à 116 cm. À l'intérieur, une poche zippée et deux poches plaquées. Existe en noir, bleu jean, cirque, danseuse, chien-chat. Cousu en Normandie.",
    tech: "35 × 30 cm · lin enduit, lin." },

  { slug: "midinette-bleu-jean", name: "Midinette bleu jean", price: 94, rayon: "sacs-a-main", images: [P("midinette-bleu-jean-recto.jpg")], alt: "Sac bandoulière Midinette bleu jean, bandoulière rayée", proof: "Cousu en Normandie",
    accroche: "En hommage aux midinettes, ces couturières parisiennes du début du siècle. Le nôtre se porte en bandoulière.",
    body: "Lin enduit imperméable, fermeture à glissière, anse réglable de 70 à 116 cm. À l'intérieur, une poche zippée et deux poches plaquées. Existe en noir, bleu jean, cirque, danseuse, chien-chat. Cousu en Normandie.",
    tech: "35 × 30 cm · lin enduit, lin." },
  { slug: "sac-jute-bord-noir", name: "Sac en jute bordé de noir", price: 74, rayon: "sacs-a-main", images: ["sac-jute-bord-noir-porte-01.jpg", "sac-jute-bord-noir-jardin-01.jpg", "sac-jute-bord-noir-jardin-02.jpg", "sac-jute-bord-noir-porte-02.jpg", "sac-jute-bord-noir-porte-03.jpg", "sac-jute-bord-noir-porte-04.jpg"].map(P), alt: "Sac à main en jute bordé de noir, porté", proof: "Cousu à Grémonville" },

  // Cabas
  { slug: "multi-teckels", name: "Multi-Teckels", price: 59, rayon: "cabas", images: [p(2972), p(2971)], alt: "Petit cabas en jute couvert de teckels peints à la main", proof: "Peint à la main",
    accroche: "Des teckels peints un par un. Aucun ne ressemble à son voisin.",
    body: "Petit cabas en jute tissée en Normandie, entièrement doublé, anses en cuir rivées. Chaque teckel est peint à la main à la peinture textile, fixée à chaud. Le format idéal pour le marché, ou pour le bureau quand on a un teckel à la maison.",
    tech: "27 × 30 cm · jute, cuir." },
  { slug: "multi-homards", name: "Multi homards", price: 54, rayon: "cabas", images: [p(2144), p(2150), p(1339), p(2147)], alt: "Petit cabas en jute à homards rouges peints à la main", proof: "Peint à la main",
    accroche: "Rouge, rose ou bleu : les homards de l'été, peints à la main.",
    body: "Un petit cabas en jute doublé, anses en cuir français au tannage végétal. Chaque homard est peint un par un dans l'atelier. Il va à la plage, au marché, et il fait parler.",
    tech: "25 × 30 cm · jute, cuir." },
  { slug: "le-petit-classique", name: "Le Petit classique", price: 44, rayon: "cabas", images: [p(1318), p(1319), p(1321), p(1315), p(1306), p(1309), p(1303), p(1300), p(1297)], alt: "Cabas Petit classique en jute, anses en cuir rouge", proof: "Cousu à Grémonville",
    accroche: "Le cabas en jute de tous les jours. Choisissez la couleur des anses, le reste est déjà parfait.",
    body: "Toile de jute, anses en cuir au tannage végétal en rouge, cognac, orange, bleu, noir, fuchsia, jaune ou chocolat. Pour les courses, la ville, la plage, et toutes les fois où on ne sait pas quel sac prendre.",
    tech: "30 × 40 cm · jute, cuir.",
    seo: { title: "Le Petit classique : cabas en jute et cuir, 8 couleurs d'anses", description: "Le cabas en jute de tous les jours, cousu en Normandie, anses en cuir au tannage végétal. 30 × 40 cm. 44 €." } },
  { slug: "etoile-ou-coeur", name: "Étoile ou cœur", price: 54, rayon: "cabas", images: [p(2582)], alt: "Panier-cabas en jute avec un appliqué en cuir doré en forme d'étoile", proof: "Cousu main",
    accroche: "Un appliqué en cuir doré, cousu à la main. Une étoile, ou un cœur : à vous de dire.",
    body: "Panier-cabas en jute tissée en Normandie, anses en cuir au tannage végétal. L'appliqué est découpé et posé à la main : chaque pièce est unique. Notre quatrième meilleure vente, et le cadeau le plus sûr qu'on connaisse.",
    tech: "30 × 40 cm · anses 42 cm · jute, cuir." },
  { slug: "mille-pois", name: "Mille pois", price: 59, rayon: "cabas", images: [], alt: "Cabas Mille pois en jute à pois peints à la main", proof: "Peint à la main",
    accroche: "Un cabas normand jusque dans la doublure : de la bâche recyclée.",
    body: "Toile de jute tissée en Normandie, pois peints à la main, doublure en bâche récupérée, anses en cuir au tannage végétal. Marché, plage, quotidien.",
    tech: "30 × 50 cm à plat · anses 42 cm · jute, bâche, cuir." },
  { slug: "le-paillete", name: "Le Pailleté", price: 59, rayon: "cabas", images: [], alt: "Cabas Le Pailleté en jute et lurex, anses en cuir noir", stock: "out", proof: "Cousu à l'atelier",
    accroche: "De la jute, du lurex, et des anses en cuir noir. Le cabas des soirs d'été.",
    body: "Tissé en Normandie, cousu à l'atelier. Les paillettes sont dans le fil, pas collées dessus : elles ne partiront pas.",
    tech: "30 × 40 cm · jute et lurex, cuir." },
  { slug: "mon-coeur", name: "Mon cœur", price: 54, rayon: "cabas", images: [p(1218), p(2316)], alt: "Petit cabas en jute à petits cœurs rouges peints à la main", proof: "Peint à la main",
    accroche: "Des petits cœurs peints à la main. Rouge ou bleu. Pas deux pareils.",
    body: "Petit cabas en jute doublé, anses en cuir français au tannage végétal, cousu à Grémonville.",
    tech: "25 × 30 cm · jute, cuir." },

  // Rangement
  { slug: "le-barda-de", name: "Le barda de…", price: 55, rayon: "rangement", images: [P("barda-de-famille-orange-01.jpg"), P("barda-de-famille-gris-recto.jpg"), p(1149), p(1150), p(2128), p(2132)], alt: "Grand panier rond en jute « Barda de Papa » peint au pochoir", proof: "Peint à la main",
    accroche: "Barda de Papa, Barda de famille, Barda hippique : dites-nous de qui.",
    body: "Grand panier rond en jute doublée, anses en corde de chanvre, message peint au pochoir. Il range la chambre, l'entrée, le coffre de la voiture, et il y survit.",
    tech: "H 40 · Ø 40 cm · jute, chanvre." },
  { slug: "les-tresors-de-maman", name: "Les trésors de Maman", price: 55, rayon: "rangement", images: [p(1134), p(1133)], alt: "Grand panier en jute « Les trésors de Maman » peint au pochoir", proof: "Peint à la main" },
  { slug: "pause-litteraire", name: "Pause littéraire", price: 54, rayon: "rangement", images: [p(2466), p(2465)], alt: "Panier en jute « Pause littéraire » pour ranger les livres", proof: "Peint à la main" },
  { slug: "panier-pour-chien", name: "Panier pour chien", price: 44, rayon: "rangement", images: [p(2932), p(2931)], alt: "Panier en jute pour les affaires du chien", proof: "Peint à la main" },
  { slug: "wanted-socks", name: "Wanted socks", price: 39, rayon: "rangement", images: [p(1724), p(1727)], alt: "Panier en jute « Wanted socks » pour les chaussettes", proof: "Peint à la main" },
  { slug: "petits-souliers", name: "Petits souliers", price: 55, rayon: "rangement", images: [p(1836), p(2055)], alt: "Panier en jute « Petits souliers » pour les chaussures", proof: "Peint à la main" },
  { slug: "des-jouets-par-milliers", name: "Des jouets par milliers", price: 55, rayon: "rangement", images: [p(2115), p(2120)], alt: "Panier à jouets en jute « Des jouets par milliers »", proof: "Peint à la main" },

  { slug: "bar-a-bazar", name: "Bar à bazar", price: 55, rayon: "rangement", images: [P("bar-a-bazar-recto.jpg"), P("bar-a-bazar-profil.jpg")], alt: "Grand panier en jute « Bar à bazar » peint au pochoir", proof: "Peint à la main" },
  { slug: "bar-a-bouquins", name: "Bar à bouquins", price: 55, rayon: "rangement", images: [P("bar-a-bouquins-recto.jpg")], alt: "Grand panier en jute « Bar à bouquins » peint au pochoir", proof: "Peint à la main" },
  { slug: "mon-fourbi-francais", name: "Mon fourbi français", price: 55, rayon: "rangement", images: [P("mon-fourbi-francais-recto.jpg")], alt: "Panier en jute « Mon fourbi français » peint au pochoir", proof: "Peint à la main" },

  // Bûches
  { slug: "chauffe-marcel", name: "Chauffe Marcel", price: 76, rayon: "buches", images: [p(1178), p(1176)], alt: "Sac à bûches en jute « Chauffe Marcel » peint au pochoir", proof: "Peint à la main",
    accroche: "Un sac à bûches qui a du chien.",
    body: "Toile de jute épaisse, doublée, surpiquée à la ficelle, une sangle de tapissier qui fait tout le tour pour porter lourd sans broncher. « Chauffe Marcel » peint au pochoir, à la main. Il porte le bois, il reste près du poêle, et il fait sourire tout l'hiver.",
    tech: "H 40 · fond 40 × 60 cm · jute, sangle, ficelle · pas de traitement anti-feu : on le tient à distance des flammes.",
    seo: { title: "Chauffe Marcel : le sac à bûches en jute qui a du chien", description: "Sac à bois en jute épaisse, doublé et surpiqué, message peint au pochoir. Fabriqué à Grémonville. 76 €, expédié sous 48 h." } },
  { slug: "au-coin-du-feu", name: "Au coin du feu", price: 76, rayon: "buches", images: [p(1170), p(2139), p(2174), p(2178)], alt: "Sac à bûches en jute « Au coin du feu » peint au pochoir", proof: "Peint à la main",
    accroche: "Le classique de l'atelier, celui que les boutiques nous redemandent chaque automne.",
    body: "Même toile, même sangle, même solidité que Chauffe Marcel, avec son message peint en orange, en blanc, en vert ou en violet. Il transporte les bûches, puis les plaids, les jouets, les magazines. Un sac pour la cheminée, qui finit souvent dans le salon.",
    tech: "H 40 · fond 40 × 60 cm · jute, sangle, ficelle." },
  { slug: "on-va-pas-s-peler", name: "On va pas s'peler", price: 59, rayon: "buches", images: [P("ambiance-on-va-pas-s-peler-poele.jpg"), P("on-va-pas-s-peler-recto.jpg"), P("on-va-pas-s-peler-detail.jpg"), P("on-va-pas-s-peler-anse.jpg"), P("on-va-pas-s-peler-profil.jpg"), p(2101), p(2105)], alt: "Grand panier rond à granulés « On va pas s'peler » en jute", proof: "Peint à la main",
    accroche: "Le sac à granulés qui dit tout haut ce que vous pensez en décembre.",
    body: "Un grand rond en jute doublée, anses en cuir noir, message peint au pochoir. Il avale un sac de granulés entier et reste beau à côté du poêle.",
    tech: "jute, cuir · éponge humide." },
  { slug: "chauffe-marcel-rond", name: "Chauffe Marcel Rond", price: 59, rayon: "buches", images: [p(2107), p(2460)], alt: "Panier rond à bûches « Chauffe Marcel » en jute", proof: "Peint à la main" },
  { slug: "au-coin-du-feu-rond", name: "Au coin du feu Rond", price: 55, rayon: "buches", images: [p(2158), p(2157)], alt: "Panier rond à bûches « Au coin du feu » en jute", proof: "Peint à la main" },

  // Minis
  mini("peace-meme", "Peace mémé", [3095]),
  { ...mini("vide-tes-poches", "Vide tes poches", [3100]), images: [P("mini-vide-tes-poches-ambiance.jpg"), p(3100)] },
  mini("le-gras", "Le gras c'est la vie", [3065]),
  mini("chargeurs", "Chargeurs and co", [3124]),
  mini("medocs", "Médocs", [3094]),
  mini("belle-et-rebelle", "Belle et rebelle", [3104]),
  mini("bazar", "Bazar", [2713, 3063]),
  mini("the-cafe", "Thé café", [3064]),
  mini("oignons", "Oignons échalotes", [3066]),
  mini("epices", "Bar à épices", [2715, 3069]),
  mini("moche", "Moche et remoche", [3108]),
  mini("clefs", "Clefs du bonheur", [3112]),
  mini("miam", "Miam", [3120]),
  mini("fourzytout", "Fourzytout", [3128]),
  mini("chat-noir", "Chat noir", [3134]),
  mini("labrador", "Labrador", [3175]),
  mini("coccinelle", "Coccinelle", [3181, 3182]),
  mini("leopard", "Léopard", [3185]),

  // Trousses
  { slug: "trousse-soco", name: "Trousse Soco", price: 20, rayon: "trousses", images: [p(2380), p(2379), p(2383), p(2386), p(2449)], alt: "Trousse Soco rouge en toile d'ombrage recyclée, languette en cuir", proof: "Cousue à Grémonville",
    accroche: "Cousue dans les chutes de toile d'ombrage de Socotex, à Honfleur. Rien ne se perd.",
    body: "Rouge, bleu, jaune ou noir. Trousse de toilette ou trousse d'école, lavable d'un coup d'éponge. La languette est taillée dans les chutes de cuir de nos anses.",
    tech: "23 × 7 × 7 cm · toile technique, cuir." },
];

export const bySlug = (slug: string) => products.find((x) => x.slug === slug);

export const rayons: Record<RayonId, { label: string; title: string; intro: string; seoTitle: string }> = {
  personnalises: { label: "Personnalisés", title: "Paniers et sacs personnalisés", intro: "", seoTitle: "Panier personnalisé prénom, peint à la main · Grenouille Rouge" },
  "sacs-a-main": { label: "Sacs à main", title: "Sacs à main", intro: "Loom, Parisienne, Titi, Midinette : des sacs en série limitée, cousus à Grémonville, pensés pour durer et se patiner avec vous.", seoTitle: "Sacs à main en lin et jute, cousus en Normandie · Grenouille Rouge" },
  cabas: { label: "Cabas en jute", title: "Cabas en jute", intro: "Petit classique, Multi-Teckels, homards, mille pois : des cabas en jute tissée en Normandie, anses en cuir, motifs peints à la main. Dès 44 €.", seoTitle: "Cabas en toile de jute fabriqués en France · Grenouille Rouge" },
  rangement: { label: "Paniers de rangement", title: "Paniers de rangement", intro: "Grands paniers en toile de jute doublée, messages peints à la main. Pour la chambre, l'entrée, le linge. Fabriqués en Normandie, dès 39 €.", seoTitle: "Paniers de rangement en jute à message · Barda, Socks, Souliers" },
  buches: { label: "Sacs à bûches", title: "Sacs à bûches", intro: "Chauffe Marcel, Au coin du feu : des sacs à bois en toile de jute doublée, sangle de tapissier, message peint à la main. 55 à 76 €.", seoTitle: "Sac à bûches en jute, cousu main en Normandie · Grenouille Rouge" },
  minis: { label: "Minis à messages", title: "Minis à messages", intro: "Petits par la taille. Pas par le caractère. À poser partout, à offrir, à collectionner !", seoTitle: "Minis : petits paniers en jute à message, 19 € · Grenouille Rouge" },
  trousses: { label: "Trousses et pochettes", title: "Trousses et pochettes", intro: "Trousses Soco cousues dans des chutes de toile d'ombrage, trousses de toilette, pochettes. Fabriquées à Grémonville.", seoTitle: "Trousses made in France en toile recyclée · Grenouille Rouge" },
};

export const shopRayons: RayonId[] = ["sacs-a-main", "cabas", "rangement", "buches", "minis", "trousses"];

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
  pr.rayon === "personnalises" ? "Expédié sous 8 jours" : "Expédié sous 48 h";
