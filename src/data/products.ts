export type Rayon = "minis" | "personnalisables" | "cabas" | "cadeaux";
export type Tag = "Cuisine" | "Animaux" | "Humour" | "Enfants";

export type Product = {
  id: string;
  name: string;
  price: number;
  rayon: Rayon;
  tag?: Tag;
  images: string[];
};

const u = (p: string) => `https://grenouillerouge.com/${p}`;
const mini = (id: string, name: string, tag: Tag, img: string): Product => ({
  id, name, price: 19, rayon: "minis", tag, images: [u(img)],
});

export const products: Product[] = [
  mini("peace-meme", "Peace mémé", "Humour", "3095-large_default/vide-poche-bazar.jpg"),
  mini("le-gras", "Le gras c'est la vie", "Cuisine", "3065-large_default/petit-panier-le-gras-c-est-la-vie.jpg"),
  mini("the-cafe", "Thé café", "Cuisine", "3064-large_default/petit-panier-the-et-cafe.jpg"),
  mini("oignons", "Oignons échalotes", "Cuisine", "3066-large_default/mini-panier-oignons-echalotes.jpg"),
  mini("epices", "Bar à épices", "Cuisine", "3069-large_default/vide-poche-bar-a-epices.jpg"),
  mini("medocs", "Médocs", "Humour", "3094-large_default/vide-poche-bazar.jpg"),
  mini("belle-rebelle", "Belle et rebelle", "Humour", "3104-large_default/vide-poche-bazar.jpg"),
  mini("vide-poches", "Vide tes poches", "Humour", "3100-large_default/vide-poche-bazar.jpg"),
  mini("chargeurs", "Chargeurs and co", "Humour", "3124-large_default/vide-poche-bazar.jpg"),
  mini("chat-noir", "Chat noir", "Animaux", "3134-large_default/vide-poche-bazar.jpg"),
  mini("labrador", "Labrador", "Animaux", "3175-large_default/vide-poche-bazar.jpg"),
  mini("coccinelle", "Coccinelle", "Enfants", "3181-large_default/vide-poche-bazar.jpg"),

  { id: "le-rond", name: "Le Rond", price: 49, rayon: "personnalisables", images: [u("565-large_default/sac-personnalisable-rond.jpg"), u("3054-large_default/sac-personnalisable-rond.jpg")] },
  { id: "bb-rond", name: "Le BB Rond", price: 43, rayon: "personnalisables", images: [u("1452-large_default/sac-bb-rond.jpg")] },
  { id: "carre", name: "Le Carré", price: 59, rayon: "personnalisables", images: [u("1478-large_default/sac-carre.jpg")] },
  { id: "cabas-perso", name: "Le cabas personnalisable", price: 59, rayon: "personnalisables", images: [u("2350-large_default/cabas-personnalisable.jpg")] },
  { id: "petit-prenom", name: "Le petit panier à votre prénom", price: 20, rayon: "personnalisables", images: [u("3040-large_default/petit-panier-vide-poches.jpg")] },

  { id: "homards", name: "Cabas Multi homards rouge", price: 54, rayon: "cabas", images: [u("2144-large_default/le-multi-homards-rouge.jpg")] },
  { id: "mon-coeur", name: "Cabas Mon cœur", price: 54, rayon: "cabas", images: [u("1218-large_default/mon-coeur.jpg")] },
  { id: "petit-classique", name: "Petit classique rouge", price: 44, rayon: "cabas", images: [u("1318-large_default/le-petit-classique-rouge.jpg")] },
  { id: "courses", name: "Cabas de courses anses courtes", price: 24, rayon: "cabas", images: [u("866-large_default/cabas-de-courses-anses-courtes.jpg")] },
  { id: "tresors", name: "Panier Les trésors de Maman", price: 55, rayon: "cabas", tag: "Enfants", images: [u("1134-large_default/sac-de-rangement-les-tresors-de-maman.jpg")] },
  { id: "panier-chien", name: "Panier pour chien", price: 44, rayon: "cabas", tag: "Animaux", images: [u("2932-large_default/panier-pour-chien.jpg")] },
  { id: "marcel", name: "Sac à bûches Chauffe Marcel", price: 76, rayon: "cabas", tag: "Humour", images: [u("1178-large_default/chauffe-marcel.jpg")] },

  { id: "soco", name: "Trousse Soco rouge", price: 20, rayon: "cadeaux", images: [u("2380-large_default/trousse-soco-rouge.jpg")] },
  { id: "bouteille", name: "Sac bouteille Chic", price: 19, rayon: "cadeaux", tag: "Cuisine", images: [u("614-large_default/sac-bouteille-chic.jpg")] },
  { id: "medailles", name: "Porte-médailles rouge", price: 19, rayon: "cadeaux", tag: "Enfants", images: [u("323-large_default/porte-medailles-rouge.jpg")] },
  { id: "midinette", name: "Sac à main Midinette noir", price: 94, rayon: "cadeaux", images: [u("2196-large_default/midinette-noir.jpg")] },
];

export const byId = (id: string) => products.find((p) => p.id === id)!;

export const rayons: Record<Rayon, { label: string; title: string; intro: string }> = {
  minis: { label: "Les Minis 19 €", title: "Les Minis à messages", intro: "Petits paniers en jute qui disent tout haut ce que l'on pense tout bas. 19 € chacun." },
  personnalisables: { label: "Personnalisables", title: "Personnalisables", intro: "Votre prénom, votre mot, votre phrase : brodé dans notre atelier sous 8 jours." },
  cabas: { label: "Cabas & paniers", title: "Cabas & paniers", intro: "Pour le marché, les bûches, les jouets ou le chien : solides, cousus pour durer." },
  cadeaux: { label: "Cadeaux", title: "Cadeaux", intro: "De petites attentions en jute, emballage cadeau offert sur chaque commande." },
};

export const FREE_SHIPPING = 70;
export const euro = (n: number) => n.toFixed(2).replace(".", ",") + " €";
