import { createFileRoute, Link } from "@tanstack/react-router";
import { Star } from "lucide-react";
import { bySlug, PHOTOS, type Product } from "@/data/products";
import { ProductCard } from "@/components/shop/ProductCard";
import { ProductImage } from "@/components/shop/ProductImage";

const HERO = PHOTOS.hero;

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Grenouille Rouge · Sacs et paniers en jute peints à la main en Normandie" },
      { name: "description", content: "Paniers de rangement, cabas et sacs à main cousus et peints au pochoir à Grémonville. Personnalisables à votre prénom. Livraison offerte en point relais dès 39 €." },
      { property: "og:title", content: "Grenouille Rouge · Sacs et paniers en jute peints à la main en Normandie" },
      { property: "og:description", content: "Paniers de rangement, cabas et sacs à main cousus et peints au pochoir à Grémonville. Personnalisables à votre prénom." },
    ],
  }),
  component: Index,
});

const reviews = [
  ["Cécile P.", "Produits d'excellente qualité, increvable, français, normand même ! Créatrice disponible et à l'écoute de vos besoins. Faites vous plaisir !"],
  ["Gérard F.", "Sacs de bonne qualité et service après vente hors pair ; nous avons rencontré des personnes passionnées et passionnantes."],
  ["Laurence d'A.", "Un super service après vente ! Mille mercis d'avoir fait des miracles car mon sac avait bien vécu ! Il est reparti pour une seconde vie…"],
  ["Virginie D.", "(…) des sacs personnalisables de grande qualité et uniques ! L'accueil y est chaleureux (…)"],
];

function season(m: number) {
  if (m >= 9) return { title: "Chauffe Marcel, et les autres.", text: "Sacs à bûches et paniers à granulés en jute, pour que le coin du feu ait du chien.", rayon: "maison", img: PHOTOS.poele, alt: "Sac à granulés « On va pas s'peler » à côté d'un poêle" };
  if (m <= 2) return { title: "Rangement de printemps.", text: "Le bazar a enfin un endroit où aller.", rayon: "maison", img: PHOTOS.printemps, alt: "Panier « Rangement de printemps » dans un jardin" };
  if (m <= 5) return { title: "Pour une mère d'exception.", text: "Un panier à son prénom, peint à la main. Elle le gardera.", rayon: "personnalises", img: HERO, alt: "Panier personnalisé à un prénom" };
  return { title: "Marché, plage, et retour.", text: "Cabas en jute et toile de parasol recyclée.", rayon: "cabas-sacs", img: bySlug("multi-homards")!.images[0], alt: "Cabas en jute Multi homards" };
}

const CLIENTES = ["LES TRÉSORS DE MARGUERITE", "FAUT QUE JE RANGE !", "LES CHAUSSONS DES HABITUÉS", "LE BARDA D'AGATHE", "TOUT CE QUI N'A PAS DE PLACE", "LINGE REBELLE", "LES BIDULES D'ARTHUR", "MA LECTURE INTELLO", "EXCUSEZ LE BAZAR MAIS ICI ON VIT", "FRINGUES DE TROLLS", "LES JOUETS DE GUSTAVE", "METTRE LES VOILES", "LE PETIT BOIS AU POÊLE", "BARDA DE CHAT", "GRANDS GODILLOTS"];

const ONGLETS = [
  { label: "Personnalisés", to: "/personnalises" as const, img: HERO, alt: "Panier Rond XL « Les jouets de Léo » peint à la main" },
  { label: "Cabas & sacs", rayon: "cabas-sacs", img: PHOTOS.parisiennePortee, alt: "La Parisienne kaki portée à l'épaule" },
  { label: "La maison", rayon: "maison", img: PHOTOS.trio, alt: "Trois paniers à message sur un canapé vert" },
  { label: "Petits cadeaux", rayon: "petits-cadeaux", img: PHOTOS.miniAmbiance, alt: "Mini vide-poches peint à la main" },
];

export const PREMIER_SAC = "En 2000, Marie-Isabel cherchait un joli sac de rangement pour ses enfants. À l'époque, elle ne trouvait que du plastique. Tapissière, elle a eu l'idée d'utiliser la toile de jute, cette belle matière naturelle habituellement cachée au cœur des fauteuils. Son premier sac était né.";

const H2 = "text-3xl md:text-4xl";

function Index() {
  const month = new Date().getMonth();
  const s = season(month);
  // Uniquement des produits bien photographiés (photo_a_refaire = false).
  const best = ["le-rond-xl", "le-cabas-personnalisable", "multi-homards", "le-loom", "cabas-leopard", ...(month >= 9 || month === 0 ? ["au-coin-du-feu"] : []), "la-parisienne", "on-va-pas-s-peler"]
    .map(bySlug).filter((p): p is Product => !!p && !p.weakPhoto);
  const ticker = CLIENTES.join("  ·  ") + "  ·  ";

  return (
    <>
      {/* a) Héro pleine largeur */}
      <section>
        <ProductImage src={PHOTOS.musee} name="La Parisienne" alt="La Parisienne moutarde portée dans un musée" className="aspect-[4/3] max-h-[70vh] w-full md:aspect-[21/9]" />
        <div className="mx-auto max-w-6xl px-5 pt-6 md:pt-10">
          <h1 className="text-[1.75rem] leading-[1.15] md:text-4xl">Des paniers en jute qui ont des choses à dire.</h1>
          <p className="mt-2 text-muted-foreground md:text-lg">Choisissez la forme et la couleur, écrivez votre texte : nous le peignons au pochoir, dans notre atelier en Normandie.</p>
          <div className="mt-5 grid grid-cols-2 gap-3 md:flex">
            <Link to="/composer" className="btn-buy px-3">Je personnalise</Link>
            <Link to="/atelier" className="btn-soft px-3">Découvrir l'atelier</Link>
          </div>
        </div>
      </section>

      {/* b) Ils l'ont fait */}
      <section className="pt-16" aria-label="Ils l'ont fait : textes de clientes">
        <div className="ticker-wrap overflow-hidden border-y py-4">
          <div className="ticker flex w-max whitespace-pre font-stencil text-2xl text-sage">
            <span>{ticker}</span><span aria-hidden="true">{ticker}</span>
          </div>
        </div>
        <p className="mx-auto max-w-6xl px-5 pt-4 text-center">Plus de 1 700 textes différents, tous peints à la main. Et le vôtre ? <Link to="/composer" className="font-medium text-sage underline underline-offset-4">Je personnalise →</Link></p>
      </section>

      {/* c) Les 4 onglets */}
      <section className="mx-auto max-w-6xl px-5 pt-24">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
          {ONGLETS.map((o) => {
            const inner = (
              <>
                <ProductImage src={o.img} name={o.label} alt={o.alt} className="aspect-square w-full" />
                <span className="mt-3 block font-display text-xl">{o.label}</span>
              </>
            );
            return o.rayon
              ? <Link key={o.label} to="/rayon/$rayon" params={{ rayon: o.rayon }}>{inner}</Link>
              : <Link key={o.label} to="/personnalises">{inner}</Link>;
          })}
        </div>
      </section>

      {/* d) Best-sellers */}
      <section id="best" className="mx-auto max-w-6xl scroll-mt-32 px-5 pt-24">
        <h2 className={H2}>Ceux qu'on nous redemande.</h2>
        <p className="mt-3 text-lg text-muted-foreground">Les paniers, cabas et sacs que nos clientes offrent, puis rachètent pour elles.</p>
        <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-4">
          {best.map((p) => <ProductCard key={p.slug} product={p} />)}
        </div>
      </section>

      {/* e) Histoire */}
      <section className="pt-24">
        <ProductImage src={PHOTOS.cuirs} name="Les cuirs de l'atelier" alt="Lanières de cuir bleu, rose, vert et cognac posées sur la toile de jute" className="aspect-[4/3] max-h-[70vh] w-full md:aspect-[21/9]" />
        <div className="mx-auto max-w-3xl px-5 pt-8">
          <h2 className={H2}>Marie-Isabel, Bénédicte, et la relève.</h2>
          <p className="mt-4 text-lg">{PREMIER_SAC}</p>
          <Link to="/atelier" className="btn-soft mt-6">Notre histoire</Link>
        </div>
      </section>

      {/* f) Saison */}
      <section className="mx-auto max-w-6xl px-5 pt-24">
        <Link to={s.rayon === "personnalises" ? "/personnalises" : "/rayon/$rayon"} params={{ rayon: s.rayon }} className="grid bg-sage-soft md:grid-cols-2">
          <ProductImage src={s.img} name={s.title} alt={s.alt} className="aspect-square w-full" />
          <div className="flex flex-col justify-center gap-3 p-6 md:p-12">
            <h2 className={H2}>{s.title}</h2>
            <p className="text-lg">{s.text}</p>
            <span className="font-medium text-sage underline underline-offset-4">Voir le rayon</span>
          </div>
        </Link>
      </section>

      {/* g) Avis Google */}
      <section className="mx-auto max-w-6xl px-5 pt-24">
        <h2 className={H2}>Elles en parlent mieux que nous.</h2>
        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          {reviews.map(([n, t]) => (
            <blockquote key={n} className="border bg-card p-6">
              <div className="flex gap-0.5 text-sage">{Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}</div>
              <p className="mt-3 text-lg">« {t} »</p>
              <footer className="mt-3 text-muted-foreground"><strong className="font-medium text-foreground">{n}</strong>, avis Google</footer>
            </blockquote>
          ))}
        </div>
        <p className="mt-5 font-medium">★★★★★ 5/5 · 19 avis Google · <a href="https://www.google.com/search?q=Grenouille+Rouge+Gr%C3%A9monville" target="_blank" rel="noreferrer" className="text-sage underline">Lire les avis →</a></p>
      </section>
      <div className="pt-24" />
    </>
  );
}
