import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState, type CSSProperties, type ReactNode } from "react";
import { useServerFn } from "@tanstack/react-start";
import { bySlug, products, rayons } from "@/data/products";
import { saveStyleReport } from "@/lib/style.functions";

export const Route = createFileRoute("/style/")({
  head: () => ({
    meta: [
      { title: "Le style du site · Grenouille Rouge" },
      { name: "description", content: "Page privée : le jeu des duels et le constructeur de style." },
      { property: "og:title", content: "Le style du site · Grenouille Rouge" },
      { property: "og:description", content: "Page privée : le jeu des duels et le constructeur de style." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex, nofollow" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600&family=Playfair+Display:wght@500;600&family=Bodoni+Moda:opsz,wght@6..96,500;6..96,600&family=Libre+Caslon+Display&family=DM+Sans:wght@400;500&family=Jost:wght@400;500&family=Lora:wght@400;500&display=swap",
      },
    ],
  }),
  component: StylePage,
});

// ---------- Données ----------
const KEY = "gr-style-v1";
const LOGO = "https://grenouillerouge.com/img/grenouille-rouge-logo-1683816362.jpg";
const rondXL = bySlug("le-rond-xl");
const auCoinDuFeu = bySlug("au-coin-du-feu");
const multiHomards = bySlug("multi-homards");
const menuLabels = [rayons.personnalises.label, rayons["cabas-sacs"].label, rayons.maison.label, rayons["petits-cadeaux"].label];
const IMG = {
  leo: rondXL?.images[1] ?? rondXL?.images[0],
  rondxl: rondXL?.images[0],
  feu: auCoinDuFeu?.images[0],
  homards: multiHomards?.images[0],
  portee: bySlug("la-parisienne")?.images[0],
  detail: bySlug("on-va-pas-s-peler")?.images[2] ?? bySlug("on-va-pas-s-peler")?.images[0],
};
const LEGACY_PHOTO_IDS = [
  "ambiance-carre-salon.jpg", "ambiance-trio-canape.jpg", "ambiance-tresors-de-princesse.jpg",
  "ambiance-rangement-de-printemps.jpg", "ambiance-on-va-pas-s-peler-poele.jpg", "mini-vide-tes-poches-ambiance.jpg",
  "parisienne-moutarde-musee.jpg", "atelier-cuirs-couleurs.jpg", "trio-ronds-vierges-02.jpg",
  "sac-jute-bord-noir-jardin-01.jpg", "detail-etiquette-made-in-france.jpg", "barda-de-famille-orange-01.jpg",
];
const photoProducts = products.filter((product) => !product.weakPhoto && Boolean(product.images[0])).slice(0, 12);
const PHOTOS12 = photoProducts.map((product, index) => ({
  id: LEGACY_PHOTO_IDS[index] ?? product.slug,
  url: product.images[0] ?? "",
  alt: product.name,
}));

type Style = {
  fond: string; policeTitres: string; policeTexte: string;
  casse: "normale" | "maj"; tailleTitres: "discrete" | "moyenne" | "grande";
  rouge: "partout" | "boutons-prix" | "boutons" | "absent";
  accent: string;
  boutons: "carre" | "arrondi" | "pilule" | "contour" | "texte";
  stylePhotos: "studio" | "scene" | "porte" | "matiere";
  formatPhotos: "carre" | "vertical" | "pleine";
  espace: "aere" | "equilibre" | "serre";
  entete: "logo-gauche" | "logo-centre" | "logo-dessus";
  bandeau: "rouge" | "accent" | "texte" | "aucun";
  animations: "aucune" | "discret" | "present";
  logo: "garde" | "simplifier" | "plus-tard";
};
const DEFAULT_STYLE: Style = {
  fond: "#F6F1E8", policeTitres: "Fraunces", policeTexte: "Inter",
  casse: "normale", tailleTitres: "moyenne", rouge: "boutons-prix", accent: "#7D8F6A",
  boutons: "arrondi", stylePhotos: "scene", formatPhotos: "carre", espace: "equilibre",
  entete: "logo-gauche", bandeau: "rouge", animations: "discret", logo: "garde",
};
const BRUN = "#2B211B";
const ROUGE = "#C8102E";
const TITLE_FONTS: Record<string, string> = {
  "Fraunces": "'Fraunces', serif", "Cormorant Garamond": "'Cormorant Garamond', serif",
  "Playfair Display": "'Playfair Display', serif", "Bodoni Moda": "'Bodoni Moda', serif",
  "Libre Caslon Display": "'Libre Caslon Display', serif",
};
const BODY_FONTS: Record<string, string> = {
  "Inter": "'Inter', sans-serif", "DM Sans": "'DM Sans', sans-serif",
  "Jost": "'Jost', sans-serif", "Lora": "'Lora', serif",
};

// ---------- Mini-site (aperçu) ----------
function MiniSite({ s, compact = false }: { s: Style; compact?: boolean }) {
  const dark = s.fond === "#2B211B";
  const text = dark ? "#F6F1E8" : BRUN;
  const titleColor = s.rouge === "partout" ? ROUGE : text;
  const priceColor = s.rouge === "partout" || s.rouge === "boutons-prix" ? ROUGE : text;
  const titleSize = s.tailleTitres === "discrete" ? 15 : s.tailleTitres === "grande" ? 24 : 19;
  const pad = s.espace === "aere" ? 18 : s.espace === "serre" ? 6 : 10;
  const heroImg = s.stylePhotos === "studio" ? IMG.rondxl : s.stylePhotos === "porte" ? IMG.portee : s.stylePhotos === "matiere" ? IMG.detail : IMG.leo;
  const heroRatio = s.formatPhotos === "vertical" ? "4/5" : s.formatPhotos === "carre" ? "1/1" : "5/4";
  const anim: CSSProperties = s.animations === "discret" ? { animation: "grFade 1.2s ease both" } : {};
  const btn: CSSProperties =
    s.boutons === "texte"
      ? { background: "none", color: s.rouge === "absent" ? text : ROUGE, textDecoration: "underline", fontWeight: 600, padding: "6px 0" }
      : {
          background: s.boutons === "contour" ? "transparent" : s.rouge === "absent" ? text : ROUGE,
          color: s.boutons === "contour" ? (s.rouge === "absent" ? text : ROUGE) : "#fff",
          border: s.boutons === "contour" ? `1.5px solid ${s.rouge === "absent" ? text : ROUGE}` : "none",
          borderRadius: s.boutons === "carre" ? 2 : s.boutons === "pilule" ? 999 : 12,
          padding: "8px 12px", fontWeight: 600,
        };
  const titleStyle: CSSProperties = {
    fontFamily: TITLE_FONTS[s.policeTitres], color: titleColor, fontSize: titleSize, fontWeight: 600,
    textTransform: s.casse === "maj" ? "uppercase" : "none", letterSpacing: s.casse === "maj" ? "0.12em" : "normal",
    lineHeight: 1.2,
  };
  const bodyStyle: CSSProperties = { fontFamily: BODY_FONTS[s.policeTexte], color: text };
  const bandeauBg = s.bandeau === "rouge" ? ROUGE : s.bandeau === "accent" ? s.accent : text;

  return (
    <div
      className={`flex h-full w-full flex-col overflow-hidden ${s.animations === "present" ? "gr-pulse-once" : ""}`}
      style={{ background: s.fond, fontSize: 10, ...anim }}
    >
      {s.bandeau !== "aucun" && (
        <div className="py-1 text-center" style={{ background: bandeauBg, color: "#fff", fontSize: 8 }}>
          Livraison offerte dès 39 €
        </div>
      )}
      {/* En-tête */}
      <div className="flex items-center gap-2 px-2 py-1.5" style={bodyStyle}>
        {s.entete === "logo-gauche" && (
          <>
            <img src={LOGO} alt="" className="h-5 w-5 rounded-full object-cover" />
            <span className="flex-1" />
            <span aria-hidden>☰</span>
            <span aria-hidden>🧺</span>
          </>
        )}
        {s.entete === "logo-centre" && (
          <>
            <span aria-hidden>☰</span>
            <img src={LOGO} alt="" className="mx-auto h-5 w-5 rounded-full object-cover" />
            <span aria-hidden>🧺</span>
          </>
        )}
        {s.entete === "logo-dessus" && (
          <div className="w-full text-center">
            <img src={LOGO} alt="" className="mx-auto h-5 w-5 rounded-full object-cover" />
          </div>
        )}
      </div>
      <div className="flex justify-center gap-2 overflow-hidden border-y px-1 py-1 whitespace-nowrap" style={{ ...bodyStyle, fontSize: 6.5 }}>
        {menuLabels.map((label) => <span key={label}>{label}</span>)}
      </div>
      {/* Héro */}
      <div style={{ padding: pad }}>
        <div>
          {heroImg && (
            <img
              src={heroImg}
              alt={rondXL?.name ?? "Le Rond XL"}
              className={`w-full rounded object-cover ${s.animations === "present" ? "gr-zoom" : ""}`}
              style={{ aspectRatio: heroRatio }}
            />
          )}
        </div>
        <h3 className="mt-2" style={titleStyle}>{rondXL?.name ?? "Le Rond XL"}</h3>
        <p className="mt-0.5" style={{ ...bodyStyle, fontSize: 8, opacity: 0.75 }}>Le Rond XL · peint au pochoir à Grémonville</p>
        <p className="mt-1 font-bold" style={{ ...bodyStyle, color: priceColor, fontSize: 13 }}>{rondXL?.price ?? 56} €</p>
        <button type="button" className="mt-1.5 w-full text-center" style={{ ...btn, fontSize: 10 }}>
          Créer mon Rond XL{s.boutons === "texte" ? " →" : ""}
        </button>
      </div>
      {/* 2 produits */}
      <div className="grid grid-cols-2" style={{ gap: pad, padding: `0 ${pad}px` }}>
        {[
          { img: IMG.feu, nom: auCoinDuFeu?.name ?? "Au coin du feu", prix: `${auCoinDuFeu?.price ?? 76} €` },
          { img: IMG.homards, nom: multiHomards?.name ?? "Multi homards", prix: `${multiHomards?.price ?? 54} €` },
        ].map((p) => (
          <div key={p.nom}>
            {p.img && <img src={p.img} alt={p.nom} className="w-full rounded object-cover" style={{ aspectRatio: heroRatio }} />}
            <p className="mt-0.5" style={{ ...bodyStyle, fontSize: 8 }}>{p.nom}</p>
            <p className="font-semibold" style={{ ...bodyStyle, color: priceColor, fontSize: 9 }}>{p.prix}</p>
          </div>
        ))}
      </div>
      {/* Réassurance */}
      <div className="mx-2 my-2 rounded px-2 py-1.5 text-center" style={{ background: `${s.accent}22`, color: s.accent, fontSize: 7.5, fontWeight: 600 }}>
        Peint à la main · Expédié sous 8 jours · Livraison offerte dès 39 €
      </div>
      {!compact && <div className="pb-2" />}
    </div>
  );
}

function Phone({ children, onClick, label }: { children: ReactNode; onClick?: () => void; label?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="block w-full overflow-hidden rounded-2xl border-4 border-foreground/80 bg-white shadow-lg"
      aria-label={label}
    >
      <div className="aspect-[9/16] w-full overflow-hidden">{children}</div>
    </button>
  );
}

// ---------- Duels ----------
// Dans chaque duel : a = la mauvaise version, b = la bonne version ; good = la position (A ou B) où s'affiche la bonne.
type Duel = { titre: string; regle: string; expl: string; good: "A" | "B"; a: () => ReactNode; b: () => ReactNode };

const MiniProduit = ({ img, nom, prix, showPrix = true }: { img?: string | undefined; nom: string; prix: string; showPrix?: boolean }) => (
  <div>
    {img && <img src={img} alt={nom} className="aspect-square w-full rounded object-cover" />}
    <p style={{ fontSize: 8 }}>{nom}</p>
    {showPrix ? <p className="font-bold" style={{ fontSize: 9, color: ROUGE }}>{prix}</p> : <p style={{ fontSize: 8, color: "#7D8F6A" }}>Découvrir</p>}
  </div>
);

const DUELS: Duel[] = [
  {
    titre: "La photo", good: "B",
    regle: "Des photos en grand.",
    expl: "En boutique, ta cliente touche le jute. En ligne, la photo, c'est sa seule main. Plus elle est grande, plus elle voit ton travail : le pochoir, le feston, la toile.",
    a: () => (
      <div className="flex h-full flex-col items-center justify-center bg-[#F6F1E8] p-6">
        {IMG.leo && <img src={IMG.leo} alt="Rond XL" className="w-1/2 rounded object-cover" />}
        <p className="mt-2" style={{ fontSize: 9 }}>Le Rond XL</p>
        <p className="font-bold" style={{ fontSize: 10, color: ROUGE }}>56 €</p>
      </div>
    ),
    b: () => (
      <div className="flex h-full flex-col bg-[#F6F1E8]">
        {IMG.leo && <img src={IMG.leo} alt="Rond XL" className="w-full flex-1 object-cover" />}
        <div className="p-2">
          <p style={{ fontSize: 10 }}>Le Rond XL · peint à la main</p>
          <p className="font-bold" style={{ fontSize: 12, color: ROUGE }}>56 €</p>
        </div>
      </div>
    ),
  },
  {
    titre: "Le bouton", good: "A",
    regle: "Un bouton d'achat visible sur chaque écran.",
    expl: "Sur ton site actuel, en 2 ans, 1 766 paniers ont été commencés et seulement 330 payés : 4 paniers sur 5 abandonnés. Chaque seconde où la cliente cherche le bouton, elle peut partir.",
    a: () => (
      <div className="flex h-full flex-col bg-[#F6F1E8] p-3">
        {IMG.rondxl && <img src={IMG.rondxl} alt="Rond XL" className="aspect-square w-full rounded object-cover" />}
        <p className="mt-2" style={{ fontSize: 8, lineHeight: 1.5 }}>
          Chaque panier est cousu à la main dans notre atelier de Grémonville, en Normandie. La toile de jute est choisie avec soin, les anses sont en corde tressée, et le prénom est peint au pochoir, lettre par lettre. C'est un travail patient, qui demande plusieurs jours…
        </p>
        <p className="mt-2 text-center" style={{ fontSize: 8, color: "#7D8F6A" }}>↓ Faire défiler pour trouver le bouton ↓</p>
      </div>
    ),
    b: () => (
      <div className="relative flex h-full flex-col bg-[#F6F1E8] p-3">
        {IMG.rondxl && <img src={IMG.rondxl} alt="Rond XL" className="aspect-square w-full rounded object-cover" />}
        <p className="mt-2" style={{ fontSize: 8 }}>Le Rond XL · peint au pochoir</p>
        <div className="absolute inset-x-2 bottom-2 rounded-xl py-2 text-center font-bold text-white" style={{ background: ROUGE, fontSize: 10 }}>
          Créer mon Rond XL · 56 €
        </div>
      </div>
    ),
  },
  {
    titre: "Le prix", good: "A",
    regle: "Des prix clairs, partout.",
    expl: "Une cliente qui ne voit pas le prix ne te le demande pas : elle part. Un prix clair, c'est rassurant, et c'est très chic.",
    a: () => (
      <div className="grid h-full grid-cols-2 gap-2 bg-[#F6F1E8] p-3">
        <MiniProduit img={IMG.feu} nom="Au coin du feu" prix="76 €" showPrix={false} />
        <MiniProduit img={IMG.homards} nom="Multi homards" prix="54 €" showPrix={false} />
        <MiniProduit img={IMG.rondxl} nom="Rond XL" prix="56 €" showPrix={false} />
        <MiniProduit img={IMG.portee} nom="Parisienne" prix="69 €" showPrix={false} />
      </div>
    ),
    b: () => (
      <div className="grid h-full grid-cols-2 gap-2 bg-[#F6F1E8] p-3">
        <MiniProduit img={IMG.feu} nom="Au coin du feu" prix="76 €" />
        <MiniProduit img={IMG.homards} nom="Multi homards" prix="54 €" />
        <MiniProduit img={IMG.rondxl} nom="Rond XL" prix="56 €" />
        <MiniProduit img={IMG.portee} nom="Parisienne" prix="69 €" />
      </div>
    ),
  },
  {
    titre: "L'accueil", good: "B",
    regle: "Le configurateur dès l'accueil.",
    expl: "Ce qui se vend chez toi, c'est le prénom : un tiers de tes ventes en ligne, et le Rond XL est ton n°1 avec 38 vendus en 2 ans. Ta cliente doit pouvoir jouer avec dès la première seconde.",
    a: () => (
      <div className="flex h-full flex-col bg-[#F6F1E8]">
        {IMG.portee && <img src={IMG.portee} alt="Atelier" className="w-full flex-1 object-cover" />}
        <p className="p-3 text-center italic" style={{ fontSize: 9 }}>
          « Dans un petit atelier de Normandie, le jute devient poésie… »
        </p>
      </div>
    ),
    b: () => (
      <div className="flex h-full flex-col bg-[#F6F1E8] p-2">
        {IMG.rondxl && <img src={IMG.rondxl} alt="Rond XL" className="aspect-square w-full rounded object-cover" />}
        <div className="mt-2 rounded border bg-white px-2 py-1" style={{ fontSize: 9, color: "#999" }}>Tapez un prénom…</div>
        <div className="mt-2 rounded-xl py-2 text-center font-bold text-white" style={{ background: ROUGE, fontSize: 10 }}>
          Créer mon Rond XL · 56 €
        </div>
      </div>
    ),
  },
  {
    titre: "Le texte", good: "A",
    regle: "Peu de mots, et une preuve en image.",
    expl: "Sur téléphone, personne ne lit un long texte. Une photo de tes mains raconte ton savoir-faire en une seconde. Ton histoire reste sur la page L'atelier, pour celles qui veulent la lire.",
    a: () => (
      <div className="h-full bg-[#F6F1E8] p-3" style={{ fontSize: 8, lineHeight: 1.6 }}>
        <p>
          Il était une fois, au cœur du pays de Caux, un petit atelier où le temps s'écoule autrement. Depuis des années, Marie-Isabel y coud, y peint, y transforme la humble toile de jute en compagnons du quotidien. Chaque panier porte en lui l'âme de la Normandie, le parfum des linosaunes, la patience des gestes appris et transmis. Le pochoir, hérité des anciennes techniques d'impression, dépose le prénom comme une caresse…
        </p>
        <p className="mt-2">Et chaque matin, l'atelier s'éveille au son de la machine à coudre…</p>
      </div>
    ),
    b: () => (
      <div className="flex h-full flex-col bg-[#F6F1E8] p-3">
        <div className="grid flex-1 place-items-center rounded bg-[#E8DCC8] p-3 text-center" style={{ fontSize: 9, color: BRUN }}>
          Photo à venir :<br />tes mains au pochoir
        </div>
        <p className="mt-2" style={{ fontSize: 9 }}>Cousu main à Grémonville. Peint au pochoir à ton prénom.</p>
        <p style={{ fontSize: 9 }}>Comptez 8 jours ouvrés.</p>
      </div>
    ),
  },
  {
    titre: "Le menu", good: "B",
    regle: "4 onglets maximum.",
    expl: "Trop de choix, on ne choisit rien. Avec 4 onglets, ta cliente sait tout de suite où aller, et tous tes produits restent là.",
    a: () => (
      <div className="h-full bg-[#F6F1E8] p-3">
        <p className="mb-2 font-bold" style={{ fontSize: 10 }}>Menu</p>
        {["Personnalisables", "Cabas", "Sacs à main", "Paniers", "Coin du feu", "Minis", "Trousses", "Coussins"].map((m) => (
          <p key={m} className="border-b py-1.5" style={{ fontSize: 9 }}>{m}</p>
        ))}
      </div>
    ),
    b: () => (
      <div className="h-full bg-[#F6F1E8] p-3">
        <p className="mb-2 font-bold" style={{ fontSize: 10 }}>Menu</p>
        {["Personnalisés", "Cabas & sacs", "La maison", "Petits cadeaux"].map((m) => (
          <p key={m} className="border-b py-2.5 font-semibold" style={{ fontSize: 11 }}>{m}</p>
        ))}
      </div>
    ),
  },
  {
    titre: "Le téléphone", good: "A",
    regle: "Le téléphone d'abord.",
    expl: "Aujourd'hui, environ 3 visites sur 4 sur les boutiques en ligne se font sur un téléphone, et encore plus quand la cliente arrive d'Instagram. Si elle doit zoomer, elle s'en va.",
    a: () => (
      <div className="h-full bg-[#F6F1E8] p-1">
        <div className="flex justify-between" style={{ fontSize: 4 }}>
          <span>Accueil</span><span>Boutique</span><span>Atelier</span><span>Contact</span><span>Blog</span>
        </div>
        <div className="mt-1 grid grid-cols-4 gap-0.5">
          {[IMG.feu, IMG.homards, IMG.rondxl, IMG.portee, IMG.leo, IMG.detail, IMG.feu, IMG.homards].map((img, i) => (
            <div key={i}>{img && <img src={img} alt="" className="aspect-square w-full object-cover" />}</div>
          ))}
        </div>
        <p className="mt-1 text-center" style={{ fontSize: 6, color: "#999" }}>🔍 il faut zoomer pour lire…</p>
      </div>
    ),
    b: () => (
      <div className="h-full bg-[#F6F1E8] p-2">
        <div className="grid grid-cols-2 gap-2">
          <MiniProduit img={IMG.feu} nom="Au coin du feu" prix="76 €" />
          <MiniProduit img={IMG.homards} nom="Multi homards" prix="54 €" />
        </div>
        <div className="mt-2 rounded-xl py-2 text-center font-bold text-white" style={{ background: ROUGE, fontSize: 10 }}>
          Créer mon Rond XL · 56 €
        </div>
      </div>
    ),
  },
];

const sideFor = (d: Duel, v: "A" | "B") => (d.good === v ? d.b() : d.a());

const REGLES = [
  "Le téléphone d'abord.",
  "Des produits en grand.",
  "Un bouton d'achat visible sur chaque écran.",
  "Des prix clairs.",
  "Le configurateur dès l'accueil.",
];

// ---------- Écrans de style (partie 2) ----------
type Group = { key: keyof Style; label: string; options: { id: string; label: string; help?: string }[] };
type StyleScreen = { key: string; titre: string; groups: Group[] };

const STYLE_SCREENS: StyleScreen[] = [
  { key: "fond", titre: "Le fond", groups: [{ key: "fond", label: "Couleur de fond", options: [
    { id: "#F6F1E8", label: "Crème (actuel)" }, { id: "#FBFAF7", label: "Blanc cassé" },
    { id: "#E9E5DD", label: "Lin grisé" }, { id: "#E8DCC8", label: "Sable" }, { id: "#2B211B", label: "Sombre" },
  ] }] },
  { key: "policeTitres", titre: "La police des titres", groups: [{ key: "policeTitres", label: "Police des titres", options: [
    { id: "Fraunces", label: "Fraunces (actuelle)" }, { id: "Cormorant Garamond", label: "Cormorant Garamond" },
    { id: "Playfair Display", label: "Playfair Display" }, { id: "Bodoni Moda", label: "Bodoni Moda", help: "De la même famille que la police de tes pochoirs" },
    { id: "Libre Caslon Display", label: "Libre Caslon Display" },
  ] }] },
  { key: "policeTexte", titre: "La police du texte", groups: [{ key: "policeTexte", label: "Police du texte", options: [
    { id: "Inter", label: "Inter (actuelle)" }, { id: "DM Sans", label: "DM Sans" },
    { id: "Jost", label: "Jost" }, { id: "Lora", label: "Lora" },
  ] }] },
  { key: "titres", titre: "Les titres", groups: [
    { key: "casse", label: "Casse", options: [{ id: "normale", label: "Normale" }, { id: "maj", label: "Tout en majuscules espacées" }] },
    { key: "tailleTitres", label: "Taille", options: [{ id: "discrete", label: "Discrète" }, { id: "moyenne", label: "Moyenne" }, { id: "grande", label: "Grande" }] },
  ] },
  { key: "rouge", titre: "La place du rouge grenouille", groups: [{ key: "rouge", label: "Le rouge", options: [
    { id: "partout", label: "Partout (titres, prix, boutons)" }, { id: "boutons-prix", label: "Boutons et prix seulement" },
    { id: "boutons", label: "Boutons seulement" }, { id: "absent", label: "Presque absent" },
  ] }] },
  { key: "accent", titre: "La couleur d'accent", groups: [{ key: "accent", label: "Accent (réassurance, détails, liens)", options: [
    { id: "#7D8F6A", label: "Vert sauge (actuel)" }, { id: "#1F2A44", label: "Bleu marine" },
    { id: "#5A5D26", label: "Kaki" }, { id: "#5D391F", label: "Chocolat" }, { id: "#1A1A1A", label: "Noir" },
  ] }] },
  { key: "boutons", titre: "Les boutons", groups: [{ key: "boutons", label: "Forme des boutons", options: [
    { id: "carre", label: "Plein carré" }, { id: "arrondi", label: "Plein arrondi" }, { id: "pilule", label: "Pilule (très arrondi)" },
    { id: "contour", label: "Contour fin" }, { id: "texte", label: "Texte souligné avec flèche" },
  ] }] },
  { key: "stylePhotos", titre: "Le style de photos", groups: [{ key: "stylePhotos", label: "Style de photos", options: [
    { id: "studio", label: "Studio, fond neutre" }, { id: "scene", label: "Mis en scène à la maison" },
    { id: "porte", label: "Porté" }, { id: "matiere", label: "Gros plan sur la matière" },
  ] }] },
  { key: "formatPhotos", titre: "Le format des photos", groups: [{ key: "formatPhotos", label: "Format", options: [
    { id: "carre", label: "Carré" }, { id: "vertical", label: "Vertical (portrait 4:5)" }, { id: "pleine", label: "Pleine largeur bord à bord" },
  ] }] },
  { key: "espace", titre: "L'espace", groups: [{ key: "espace", label: "Densité", options: [
    { id: "aere", label: "Aéré (grandes marges)" }, { id: "equilibre", label: "Équilibré" }, { id: "serre", label: "Serré (plus de produits visibles)" },
  ] }] },
  { key: "entete", titre: "Le haut de page", groups: [
    { key: "entete", label: "En-tête", options: [
      { id: "logo-gauche", label: "Logo à gauche, menu à droite" },
      { id: "logo-centre", label: "Logo centré, menu à gauche, panier à droite" },
      { id: "logo-dessus", label: "Logo centré au-dessus, 4 onglets dessous" },
    ] },
    { key: "bandeau", label: "Le bandeau « Livraison offerte dès 39 € »", options: [
      { id: "rouge", label: "Rouge" }, { id: "accent", label: "Couleur d'accent" },
      { id: "texte", label: "Couleur du texte" }, { id: "aucun", label: "Pas de bandeau" },
    ] },
  ] },
  { key: "animations", titre: "Le mouvement", groups: [{ key: "animations", label: "Animations", options: [
    { id: "aucune", label: "Aucune animation" }, { id: "discret", label: "Discret (apparition douce)" },
    { id: "present", label: "Présent (zoom léger, bouton qui pulse)" },
  ] }] },
  { key: "logo", titre: "Le logo", groups: [{ key: "logo", label: "Le logo grenouille", options: [
    { id: "garde", label: "Je le garde tel quel" }, { id: "simplifier", label: "Je veux le simplifier" }, { id: "plus-tard", label: "On en reparle plus tard" },
  ] }] },
];

// ---------- État & navigation ----------
type State = {
  step: number;
  duelChoices: Record<number, "A" | "B">;
  regles: Record<number, { accord: boolean; doute?: string }>;
  sty: Style;
  whys: Record<string, string>;
  photos3: string[];
  premium: number | null;
  manque: string;
  refs: { beau: string; autre: string; cheap: string; mot: string };
  edits: string[];
  done: boolean;
};
const INITIAL: State = {
  step: 0, duelChoices: {}, regles: {}, sty: DEFAULT_STYLE, whys: {}, photos3: [],
  premium: null, manque: "", refs: { beau: "", autre: "", cheap: "", mot: "" }, edits: [], done: false,
};

// Plan des écrans
type Plan =
  | { k: "welcome" } | { k: "intro" }
  | { k: "duel"; d: number } | { k: "expl"; d: number }
  | { k: "score" } | { k: "regles" }
  | { k: "style"; s: number }
  | { k: "voila" } | { k: "refs" } | { k: "envoi" } | { k: "merci" };

const PLAN: Plan[] = [
  { k: "welcome" }, { k: "intro" },
  ...DUELS.flatMap((_, d) => [{ k: "duel", d } as Plan, { k: "expl", d } as Plan]),
  { k: "score" }, { k: "regles" },
  ...STYLE_SCREENS.map((_, s) => ({ k: "style", s }) as Plan),
  { k: "voila" }, { k: "refs" }, { k: "envoi" }, { k: "merci" },
];
const VOILA_INDEX = PLAN.findIndex((p) => p.k === "voila");

function words(s: string) { return s.trim().split(/\s+/).filter(Boolean).length; }

// ---------- Page ----------
function StylePage() {
  const save = useServerFn(saveStyleReport);
  const [st, setSt] = useState<State>(INITIAL);
  const [restored, setRestored] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const saved = JSON.parse(raw) as Partial<State>;
        setSt({
          ...INITIAL,
          ...saved,
          sty: { ...INITIAL.sty, ...saved.sty },
          refs: { ...INITIAL.refs, ...saved.refs },
        });
      }
    } catch { /* ignore */ }
    setRestored(true);
  }, []);
  const [zoom, setZoom] = useState<ReactNode | null>(null);
  const [sendState, setSendState] = useState<"idle" | "sending" | "error">("idle");
  const [returnToVoila, setReturnToVoila] = useState(false);

  useEffect(() => {
    if (!restored) return;
    try { localStorage.setItem(KEY, JSON.stringify(st)); } catch { /* ignore */ }
  }, [restored, st]);

  const plan = PLAN[Math.min(st.step, PLAN.length - 1)]!;
  const progress = Math.round(((st.step + 1) / PLAN.length) * 100);
  const score = DUELS.reduce((n, duel, d) => n + (st.duelChoices[d] === duel.good ? 1 : 0), 0);

  const setSty = (key: keyof Style, value: string, screenLabel: string) => {
    setSt((p) => {
      const old = String(p.sty[key]);
      const edits = p.step >= VOILA_INDEX && old !== value ? [...p.edits, `${screenLabel} : ${old} → ${value}`] : p.edits;
      return { ...p, sty: { ...p.sty, [key]: value }, edits };
    });
  };
  const next = () => setSt((p) => ({ ...p, step: Math.min(p.step + 1, PLAN.length - 1) }));
  const back = () => setSt((p) => ({ ...p, step: Math.max(p.step - 1, 0) }));

  // Blocage « Suivant » selon l'écran
  const blocked = useMemo(() => {
    if (plan.k === "duel") return !st.duelChoices[plan.d];
    if (plan.k === "regles") {
      return REGLES.some((_, i) => {
        const r = st.regles[i];
        if (!r) return true;
        if (!r.accord && words(r.doute ?? "") < 5) return true;
        return false;
      });
    }
    if (plan.k === "style" && STYLE_SCREENS[plan.s]!.key === "stylePhotos") return st.photos3.length !== 3;
    if (plan.k === "style" && STYLE_SCREENS[plan.s]!.key === "logo" && st.sty.logo === "simplifier")
      return !String(st.whys["logo_comment"] ?? "").trim();
    if (plan.k === "voila") return st.premium == null || (st.premium < 8 && words(st.manque) < 10);
    if (plan.k === "refs") return words(st.refs.beau) < 10;
    return false;
  }, [plan, st]);

  // ---------- Récap ----------
  const buildRecap = () => {
    const L: string[] = [];
    const now = new Date().toLocaleString("fr-FR", { dateStyle: "long", timeStyle: "short" });
    L.push(`STYLE GRENOUILLE ROUGE — ${now}`, "");
    L.push(`═══ JEU : score ${score}/7 ═══`);
    DUELS.forEach((d, i) => {
      const c = st.duelChoices[i];
      L.push(`Duel ${i + 1} · ${d.titre} : choix ${c ?? "—"} ${c === d.good ? "(bonne réponse)" : "(mauvaise réponse)"}`);
    });
    L.push("", "═══ LES 5 RÈGLES ═══");
    REGLES.forEach((r, i) => {
      const v = st.regles[i];
      L.push(`${r} → ${v?.accord ? "D'accord" : `J'ai un doute : ${v?.doute ?? ""}`}`);
    });
    L.push("", "═══ SES CHOIX DE STYLE ═══");
    const optLabel = (screenKey: string, groupKey: string, id: string) => {
      const g = STYLE_SCREENS.find((s) => s.key === screenKey)?.groups.find((x) => x.key === groupKey);
      return g?.options.find((o) => o.id === id)?.label ?? id;
    };
    STYLE_SCREENS.forEach((s) => {
      s.groups.forEach((g) => {
        const val = String(st.sty[g.key]);
        L.push(`${s.titre} · ${g.label} : ${optLabel(s.key, String(g.key), val)} (valeur : ${val})`);
      });
      const why = st.whys[`why_${s.key}`];
      if (why?.trim()) L.push(`  Pourquoi ? ${why.trim()}`);
    });
    if (st.whys["logo_comment"]?.trim()) L.push(`  Logo · Comment le simplifier : ${st.whys["logo_comment"].trim()}`);
    L.push("", "═══ SES 3 PHOTOS PRÉFÉRÉES ═══", ...st.photos3.map((p) => `- ${p}`));
    L.push("", `═══ NOTE PREMIUM : ${st.premium ?? "?"}/10 ═══`);
    if (st.premium != null && st.premium < 8) L.push(`Ce qui manque : ${st.manque}`);
    L.push("", "═══ RÉFÉRENCES ═══");
    L.push(`Beau site/boutique : ${st.refs.beau}`);
    if (st.refs.autre.trim()) L.push(`Autre : ${st.refs.autre}`);
    if (st.refs.cheap.trim()) L.push(`Site cheap : ${st.refs.cheap}`);
    if (st.refs.mot.trim()) L.push(`Dernier mot pour Henri : ${st.refs.mot}`);
    if (st.edits.length) {
      L.push("", "═══ ÉCRANS MODIFIÉS APRÈS « VOILÀ TON SITE » ═══", ...st.edits.map((e) => `- ${e}`));
    }
    const tokens = {
      fond: st.sty.fond, texte: st.sty.fond === "#2B211B" ? "#F6F1E8" : "#2B211B", rouge_usage: st.sty.rouge,
      accent: st.sty.accent, police_titres: st.sty.policeTitres, police_texte: st.sty.policeTexte,
      casse_titres: st.sty.casse, taille_titres: st.sty.tailleTitres, boutons: st.sty.boutons,
      style_photos: st.sty.stylePhotos, format_photos: st.sty.formatPhotos, espace: st.sty.espace,
      entete: st.sty.entete, bandeau: st.sty.bandeau, animations: st.sty.animations, logo: st.sty.logo,
    };
    L.push("", "═══ TOKENS DE DESIGN ═══", JSON.stringify(tokens, null, 2));
    L.push("", "═══ DONNÉES BRUTES (JSON) ═══", JSON.stringify(st, null, 2));
    return L.join("\n");
  };

  const send = async () => {
    setSendState("sending");
    const subject = `Style Grenouille Rouge – ${new Date().toLocaleString("fr-FR", { dateStyle: "short", timeStyle: "short" })}`;
    const r = await save({ data: { subject, body: buildRecap() } });
    if (r.ok) {
      setSt((p) => ({ ...p, done: true, step: PLAN.length - 1 }));
      setSendState("idle");
    } else {
      setSendState("error");
    }
  };

  // ---------- Rendus ----------
  const Nav = ({ nextLabel = "Suivant →", onNext, hideBack = false, nextDisabled }: { nextLabel?: string; onNext?: () => void; hideBack?: boolean; nextDisabled?: boolean }) => (
    <div className="mt-6 flex gap-3">
      {!hideBack && st.step > 0 && (
        <button type="button" onClick={back} className="min-h-14 rounded-2xl border-2 px-5 text-lg font-semibold">← Retour</button>
      )}
      <button
        type="button"
        onClick={onNext ?? next}
        disabled={nextDisabled ?? blocked}
        className="min-h-14 flex-1 rounded-2xl bg-foreground px-5 text-lg font-bold text-background disabled:opacity-40"
      >
        {nextLabel}
      </button>
    </div>
  );

  let body: ReactNode = null;

  if (plan.k === "welcome") {
    body = (
      <div>
        <p className="text-2xl leading-relaxed">
          Maman, tu trouves le site un peu cheap. On va le rendre <strong>premium</strong>, ensemble.
        </p>
        <p className="mt-4 text-xl leading-relaxed">
          D'abord un petit jeu de 5 minutes : tu te mets à la place de ta cliente. Ensuite, tu construis ton site toi-même, en voyant le résultat en direct.
        </p>
        <Nav nextLabel="On y va" hideBack />
      </div>
    );
  } else if (plan.k === "intro") {
    body = (
      <div>
        <p className="text-2xl leading-relaxed">
          Imagine : tu es dans le métro, sur ton téléphone. Tu as vu passer un joli panier sur Instagram. Tu cliques.
        </p>
        <p className="mt-4 text-xl leading-relaxed">
          Pour chaque duel, choisis la page où tu <strong>ACHÈTERAIS</strong>. Pas la plus jolie : celle où tu sortirais ta carte.
        </p>
        <Nav nextLabel="Premier duel" />
      </div>
    );
  } else if (plan.k === "duel") {
    const d = DUELS[plan.d]!;
    const choice = st.duelChoices[plan.d];
    body = (
      <div>
        <h2 className="text-2xl font-bold">Duel {plan.d + 1}/7 · {d.titre}</h2>
        <p className="mt-1 text-lg text-muted-foreground">Touche une maquette pour la voir en grand.</p>
        <div className="mt-4 grid grid-cols-2 gap-3">
          {(["A", "B"] as const).map((v) => (
            <div key={v} className={choice === v ? "rounded-3xl ring-4 ring-green-700" : ""}>
              <Phone label={`Maquette ${v} en grand`} onClick={() => setZoom(sideFor(d, v))}>
                {sideFor(d, v)}
              </Phone>
              <p className="mt-1 text-center text-lg font-bold">{v}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3">
          {(["A", "B"] as const).map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => setSt((p) => ({ ...p, duelChoices: { ...p.duelChoices, [plan.d]: v } }))}
              className={`min-h-14 rounded-2xl text-lg font-bold ${choice === v ? "bg-foreground text-background" : "border-2"}`}
            >
              J'achète sur {v}
            </button>
          ))}
        </div>
        <Nav />
      </div>
    );
  } else if (plan.k === "expl") {
    const d = DUELS[plan.d]!;
    const good = st.duelChoices[plan.d] === d.good;
    body = (
      <div>
        <p className={`text-2xl font-bold ${good ? "text-[#7D8F6A]" : ""}`}>{good ? "Bien vu !" : "Presque !"}</p>
        <h2 className="mt-2 text-2xl font-bold">Ce que ta cliente fait</h2>
        <p className="mt-3 text-xl leading-relaxed">{d.expl}</p>
        <p className="mt-4 rounded-2xl border-2 border-foreground px-4 py-3 text-center text-xl font-bold">{d.regle}</p>
        <Nav />
      </div>
    );
  } else if (plan.k === "score") {
    const msg = score === 7 ? "Tu es une vraie commerçante !" : score >= 4 ? "Très bien !" : "Pas grave, c'est justement pour ça qu'on joue.";
    body = (
      <div className="text-center">
        <p className="text-6xl font-bold">{score}/7</p>
        <p className="mt-4 text-2xl">Tu as trouvé {score} duel{score > 1 ? "s" : ""} sur 7.</p>
        <p className="mt-2 text-xl font-semibold text-[#7D8F6A]">{msg}</p>
        <div className="text-left"><Nav /></div>
      </div>
    );
  } else if (plan.k === "regles") {
    body = (
      <div>
        <h2 className="text-2xl font-bold">Les 5 règles qu'on garde quoi qu'il arrive</h2>
        <ul className="mt-4 space-y-4">
          {REGLES.map((r, i) => {
            const v = st.regles[i];
            return (
              <li key={r} className="rounded-2xl border-2 p-4">
                <p className="text-xl font-semibold">✓ {r}</p>
                <div className="mt-3 grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setSt((p) => ({ ...p, regles: { ...p.regles, [i]: { accord: true } } }))}
                    className={`min-h-14 rounded-2xl text-lg font-bold ${v?.accord ? "bg-[#7D8F6A] text-white" : "border-2"}`}
                  >
                    D'accord
                  </button>
                  <button
                    type="button"
                    onClick={() => setSt((p) => ({ ...p, regles: { ...p.regles, [i]: { accord: false, doute: v?.doute ?? "" } } }))}
                    className={`min-h-14 rounded-2xl text-lg font-bold ${v && !v.accord ? "bg-foreground text-background" : "border-2"}`}
                  >
                    J'ai un doute
                  </button>
                </div>
                {v && !v.accord && (
                  <textarea
                    value={v.doute ?? ""}
                    onChange={(e) => setSt((p) => ({ ...p, regles: { ...p.regles, [i]: { accord: false, doute: e.target.value } } }))}
                    placeholder="Dis-moi pourquoi (au moins 5 mots)"
                    className="mt-3 min-h-20 w-full rounded-xl border-2 p-3 text-lg"
                  />
                )}
              </li>
            );
          })}
        </ul>
        <p className="mt-4 text-lg italic">Les belles marques font toutes ça. Premium et vendeur, ce n'est pas le contraire.</p>
        <Nav nextLabel="Maintenant, rendons tout ça premium →" />
      </div>
    );
  } else if (plan.k === "style") {
    const screen = STYLE_SCREENS[plan.s]!;
    body = (
      <div>
        <h2 className="text-2xl font-bold">{screen.titre}</h2>
        {/* Aperçu permanent */}
        <div className="mx-auto mt-3 w-full max-w-[260px]">
          <div className="overflow-hidden rounded-2xl border-4 border-foreground/80 shadow-lg" style={{ height: "46vh", minHeight: 340 }}>
            <MiniSite s={st.sty} />
          </div>
        </div>
        {screen.groups.map((g) => (
          <div key={String(g.key)} className="mt-4">
            <p className="text-lg font-semibold">{g.label}</p>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {g.options.map((o) => {
                const active = String(st.sty[g.key]) === o.id;
                return (
                  <button
                    key={o.id}
                    type="button"
                    onClick={() => setSty(g.key, o.id, `${screen.titre} · ${g.label}`)}
                    className={`min-h-14 rounded-2xl border-2 px-3 text-base font-semibold transition-all duration-300 ${active ? "border-foreground bg-foreground text-background" : ""}`}
                  >
                    {g.key === "fond" || g.key === "accent" ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="inline-block h-6 w-6 rounded-full border" style={{ background: o.id }} />
                        {o.label}
                      </span>
                    ) : g.key === "policeTitres" ? (
                      <span className="flex flex-col gap-1">
                        <span style={{ fontFamily: TITLE_FONTS[o.id] }}>{o.label}</span>
                        {o.help && <span className="text-xs font-normal leading-tight opacity-75">{o.help}</span>}
                      </span>
                    ) : g.key === "policeTexte" ? (
                      <span style={{ fontFamily: BODY_FONTS[o.id] }}>{o.label}</span>
                    ) : (
                      o.label
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
        {screen.key === "policeTitres" && (
          <p className="mt-3 rounded-xl bg-muted p-3 text-xl" style={{ fontFamily: TITLE_FONTS[st.sty.policeTitres] }}>
            Grenouille Rouge — Son prénom, peint à la main
          </p>
        )}
        {screen.key === "policeTexte" && (
          <p className="mt-3 rounded-xl bg-muted p-3 text-lg" style={{ fontFamily: BODY_FONTS[st.sty.policeTexte] }}>
            Chaque panier est cousu à la main dans notre atelier de Grémonville, puis peint au pochoir à votre prénom. Comptez 8 jours ouvrés.
          </p>
        )}
        {screen.key === "stylePhotos" && (
          <div className="mt-4">
            <p className="text-lg font-semibold">Tes 3 photos préférées parmi celles-ci (exactement 3)</p>
            <div className="mt-2 grid grid-cols-3 gap-2">
              {PHOTOS12.map((photo) => {
                const on = st.photos3.includes(photo.id);
                return (
                  <button
                    key={photo.id}
                    type="button"
                    onClick={() =>
                      setSt((p) => ({
                        ...p,
                        photos3: on ? p.photos3.filter((x) => x !== photo.id) : p.photos3.length < 3 ? [...p.photos3, photo.id] : p.photos3,
                      }))
                    }
                    className={`overflow-hidden rounded-xl ${on ? "ring-4 ring-[#7D8F6A]" : ""}`}
                  >
                    <img src={photo.url} alt={photo.alt} className="aspect-square w-full object-cover" />
                  </button>
                );
              })}
            </div>
            <p className="mt-1 text-base text-muted-foreground">{st.photos3.length}/3 choisies</p>
          </div>
        )}
        {screen.key === "logo" && (
          <div className="mt-3 rounded-2xl p-4 text-center" style={{ background: st.sty.fond }}>
            <img src={LOGO} alt="Logo Grenouille Rouge" className="mx-auto h-28 w-28 rounded-full object-cover" />
          </div>
        )}
        {screen.key === "logo" && st.sty.logo === "simplifier" && (
          <input
            value={st.whys["logo_comment"] ?? ""}
            onChange={(e) => setSt((p) => ({ ...p, whys: { ...p.whys, logo_comment: e.target.value } }))}
            placeholder="Comment ?"
            className="mt-3 min-h-14 w-full rounded-xl border-2 p-3 text-lg"
          />
        )}
        <input
          value={st.whys[`why_${screen.key}`] ?? ""}
          onChange={(e) => setSt((p) => ({ ...p, whys: { ...p.whys, [`why_${screen.key}`]: e.target.value } }))}
          placeholder="Pourquoi ? (facultatif)"
          className="mt-4 min-h-12 w-full rounded-xl border-2 p-3 text-base"
        />
        <Nav
          nextLabel={returnToVoila ? "Je garde celui-là →" : "Je garde celui-là →"}
          onNext={() => {
            if (returnToVoila) {
              setReturnToVoila(false);
              setSt((p) => ({ ...p, step: VOILA_INDEX }));
            } else next();
          }}
        />
      </div>
    );
  } else if (plan.k === "voila") {
    body = (
      <div>
        <h2 className="text-2xl font-bold">Voilà ton site</h2>
        <div className="mx-auto mt-3 w-full max-w-[300px]">
          <div className="overflow-hidden rounded-2xl border-4 border-foreground/80 shadow-lg" style={{ height: "52vh", minHeight: 380 }}>
            <div className="h-full overflow-y-auto">
              <MiniSite s={st.sty} />
              <MiniSite s={st.sty} compact />
            </div>
          </div>
        </div>
        <details className="mt-4 rounded-2xl border-2 p-4">
          <summary className="min-h-12 cursor-pointer text-lg font-bold">Je veux changer un truc</summary>
          <ul className="mt-2 space-y-2">
            {STYLE_SCREENS.map((s, i) => (
              <li key={s.key}>
                <button
                  type="button"
                  onClick={() => {
                    setReturnToVoila(true);
                    setSt((p) => ({ ...p, step: PLAN.findIndex((x) => x.k === "style" && x.s === i) }));
                  }}
                  className="min-h-12 w-full rounded-xl border-2 px-3 text-left text-base font-semibold"
                >
                  {s.titre}
                </button>
              </li>
            ))}
          </ul>
        </details>
        <div className="mt-4">
          <label className="text-lg font-semibold">De 1 à 10, tu le trouves premium à combien ? {st.premium == null ? "— à toi de choisir —" : `${st.premium}/10`}</label>
          <input
            type="range" min={1} max={10} value={st.premium ?? 1}
            onChange={(e) => setSt((p) => ({ ...p, premium: Number(e.target.value) }))}
            className={`mt-2 w-full ${st.premium == null ? "premium-empty" : ""}`}
          />
        </div>
        {st.premium != null && st.premium < 8 && (
          <textarea
            value={st.manque}
            onChange={(e) => setSt((p) => ({ ...p, manque: e.target.value }))}
            placeholder="Qu'est-ce qui manque encore ? (au moins 10 mots)"
            className="mt-3 min-h-24 w-full rounded-xl border-2 p-3 text-lg"
          />
        )}
        <Nav nextLabel="J'adore ! →" />
      </div>
    );
  } else if (plan.k === "refs") {
    const setRef = (k: keyof State["refs"], v: string) => setSt((p) => ({ ...p, refs: { ...p.refs, [k]: v } }));
    body = (
      <div>
        <h2 className="text-2xl font-bold">Tes références</h2>
        <label className="mt-4 block text-lg font-semibold">Un site ou une boutique (en ligne ou en vrai) que tu trouves beau. Lequel, et qu'est-ce qui te plaît dedans ?</label>
        <textarea value={st.refs.beau} onChange={(e) => setRef("beau", e.target.value)} className="mt-2 min-h-24 w-full rounded-xl border-2 p-3 text-lg" placeholder="Obligatoire, au moins 10 mots" />
        <label className="mt-4 block text-lg font-semibold">Un autre, si tu en as un (facultatif)</label>
        <textarea value={st.refs.autre} onChange={(e) => setRef("autre", e.target.value)} className="mt-2 min-h-20 w-full rounded-xl border-2 p-3 text-lg" />
        <label className="mt-4 block text-lg font-semibold">Un site que tu trouves cheap, et pourquoi ? (facultatif)</label>
        <textarea value={st.refs.cheap} onChange={(e) => setRef("cheap", e.target.value)} className="mt-2 min-h-20 w-full rounded-xl border-2 p-3 text-lg" />
        <label className="mt-4 block text-lg font-semibold">Un dernier mot pour Henri ? (facultatif)</label>
        <textarea value={st.refs.mot} onChange={(e) => setRef("mot", e.target.value)} className="mt-2 min-h-20 w-full rounded-xl border-2 p-3 text-lg" />
        <Nav />
      </div>
    );
  } else if (plan.k === "envoi") {
    body = (
      <div className="text-center">
        <h2 className="text-3xl font-bold">C'est prêt !</h2>
        <p className="mt-3 text-xl">Un appui, et tout ton récap part directement à Henri. Rien à copier, rien à envoyer toi-même.</p>
        <button
          type="button"
          onClick={send}
          disabled={sendState === "sending"}
          className="mt-6 min-h-16 w-full rounded-2xl bg-[#C8102E] px-6 text-2xl font-bold text-white disabled:opacity-50"
        >
          {sendState === "sending" ? "Envoi en cours…" : "J'ai fini, envoyer à Henri 🎉"}
        </button>
        {sendState === "error" && (
          <div className="mt-4 rounded-2xl bg-muted p-4">
            <p className="text-lg font-semibold">Ça n'est pas parti, réessaie.</p>
            <button type="button" onClick={send} className="mt-3 min-h-14 w-full rounded-2xl border-2 text-lg font-bold">Réessayer</button>
          </div>
        )}
        <Nav nextLabel="Pas encore, je relis" hideBack={false} onNext={back} />
      </div>
    );
  } else if (plan.k === "merci") {
    body = (
      <div className="text-center">
        <h2 className="text-3xl font-bold">Merci Maman !</h2>
        <p className="mt-2 text-xl">Henri s'occupe du reste.</p>
        <div className="mx-auto mt-4 w-full max-w-[300px]">
          <div className="overflow-hidden rounded-2xl border-4 border-foreground/80 shadow-lg" style={{ height: "52vh", minHeight: 380 }}>
            <MiniSite s={st.sty} />
          </div>
        </div>
        <p className="mt-4 text-lg text-muted-foreground">Ton récap est enregistré : si tu rouvres cette page, tu le retrouveras ici.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto min-h-screen max-w-xl px-4 pb-10">
      <style>{`
        @keyframes grFade { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
        @keyframes grZoom { 0%,100% { transform: scale(1); } 50% { transform: scale(1.04); } }
        @keyframes grPulse { 0% { transform: scale(1); } 40% { transform: scale(1.03); } 100% { transform: scale(1); } }
        .gr-zoom { animation: grZoom 3s ease-in-out infinite; }
        .gr-pulse-once { animation: grPulse 1.2s ease 1; }
        .premium-empty::-webkit-slider-thumb { opacity: 0; }
        .premium-empty::-moz-range-thumb { opacity: 0; }
      `}</style>
      {/* Barre de progression */}
      <div className="sticky top-0 z-10 -mx-4 bg-background px-4 pb-2 pt-3">
        <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
          <div className="h-full rounded-full bg-[#7D8F6A] transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>
        <p className="mt-1 text-sm text-muted-foreground">Étape {st.step + 1} sur {PLAN.length}</p>
      </div>
      <div className="pt-4">{body}</div>
      {/* Zoom maquette */}
      {zoom && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4" onClick={() => setZoom(null)} role="dialog" aria-modal="true">
          <div className="w-full max-w-sm overflow-hidden rounded-2xl border-4 border-white" style={{ height: "80vh" }}>
            {zoom}
          </div>
          <p className="absolute bottom-6 text-lg font-semibold text-white">Touche pour fermer</p>
        </div>
      )}
    </div>
  );
}
