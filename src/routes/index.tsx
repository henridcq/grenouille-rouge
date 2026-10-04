import { createFileRoute, Link } from "@tanstack/react-router";
import { Star } from "lucide-react";
import { bySlug, PHOTOS, type Product } from "@/data/products";
import { ProductCard } from "@/components/shop/ProductCard";
import { ProductImage } from "@/components/shop/ProductImage";
import { Pictos } from "@/components/shop/Reassurance";
import { Reveal } from "@/components/shop/Reveal";

const HERO = "https://grenouillerouge.com/img/p/1/3/9/0/1390.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Grenouille Rouge · Sacs et paniers en jute peints à la main en Normandie" },
      { name: "description", content: "Paniers de rangement, cabas et sacs à main cousus et peints au pochoir à Grémonville. Personnalisables à votre prénom. Livraison offerte en point relais dès 39 €." },
      { property: "og:title", content: "Grenouille Rouge · Sacs et paniers en jute peints à la main en Normandie" },
      { property: "og:description", content: "Paniers de rangement, cabas et sacs à main cousus et peints au pochoir à Grémonville. Personnalisables à votre prénom." },
      { property: "og:image", content: HERO },
      { name: "twitter:image", content: HERO },
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
  if (m >= 9) return { title: "Chauffe Marcel, et les autres.", text: "Sacs à bûches et paniers à granulés en jute, pour que le coin du feu ait du chien.", rayon: "buches", img: bySlug("chauffe-marcel")!.images[0] };
  if (m <= 2) return { title: "Rangement de printemps.", text: "Le bazar a enfin un endroit où aller.", rayon: "rangement", img: bySlug("le-barda-de")!.images[0] };
  if (m <= 5) return { title: "Pour une mère d'exception.", text: "Un panier à son prénom, peint à la main. Elle le gardera.", rayon: "personnalises", img: HERO };
  return { title: "Marché, plage, et retour.", text: "Cabas en jute et toile de parasol recyclée.", rayon: "cabas", img: bySlug("multi-homards")!.images[0] };
}

function Index() {
  const month = new Date().getMonth();
  const s = season(month);
  const best = ["le-rond-xl", "le-cabas-personnalisable", "loom", "etoile-ou-coeur", "multi-teckels", "le-petit-classique", ...(month >= 9 || month === 0 ? ["chauffe-marcel"] : []), "la-parisienne"]
    .map(bySlug).filter(Boolean) as Product[];

  return (
    <>
      <section className="mx-auto grid max-w-6xl items-center gap-6 px-4 pt-5 md:grid-cols-2 md:gap-12 md:pt-12">
        <ProductImage src={HERO} name="Le Rond XL" alt="Grand panier Rond XL en jute, prêt à recevoir un prénom peint à la main" className="aspect-square w-full rounded-3xl md:order-2" />
        <div>
          <h1 className="text-[2.4rem] font-bold leading-[1.05] md:text-6xl">Des paniers en jute qui ont des choses à dire.</h1>
          <p className="mt-4 text-lg text-muted-foreground md:text-xl">
            Cousus, peints au pochoir et personnalisés à votre prénom, dans notre atelier de Grémonville, en Normandie. Depuis 2000.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link to="/composer" search={{ forme: "rond-xl" }} className="btn-buy text-lg sm:px-8">Créer le mien</Link>
            <a href="#best" className="btn-soft">Voir la collection</a>
          </div>
        </div>
      </section>

      <Reveal className="mx-auto max-w-6xl px-4 pt-16">
        <div className="grid overflow-hidden rounded-3xl bg-card md:grid-cols-2">
          <ProductImage src={bySlug("le-rond")!.images[0]} name="Le Rond" alt="Panier rond en jute personnalisable" className="aspect-square w-full" />
          <div className="flex flex-col justify-center gap-4 p-6 md:p-10">
            <h2 className="text-3xl font-bold md:text-4xl">À votre prénom, à votre mot, à votre idée.</h2>
            <p className="text-lg">Choisissez la forme, l'anse, la couleur, et écrivez ce que vous voulez. On le peint au pochoir, à la main, et on vous l'expédie sous 8 jours. « Les trésors de Maëlle », « Le bazar de Papa », « Doudous & Cie » : à vous de jouer.</p>
            <p className="font-semibold text-primary">À partir de 43 €</p>
            <Link to="/personnalises" className="btn-soft self-start">Je personnalise</Link>
          </div>
        </div>
      </Reveal>

      <Reveal className="mx-auto max-w-6xl scroll-mt-32 px-4 pt-16">
        <div id="best" className="scroll-mt-32">
          <h2 className="text-3xl font-bold md:text-4xl">Ceux qu'on nous redemande.</h2>
          <p className="mt-2 text-lg text-muted-foreground">Les paniers, cabas et sacs que nos clientes offrent, puis rachètent pour elles.</p>
          <div className="mt-6 grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-5 lg:grid-cols-4">
            {best.map((p) => <ProductCard key={p.slug} product={p} />)}
          </div>
        </div>
      </Reveal>

      <Reveal className="mx-auto grid max-w-6xl items-center gap-6 px-4 pt-20 md:grid-cols-2 md:gap-12">
        <ProductImage src={PHOTOS.jute} name="Le travail de la toile de jute" alt="Mains qui travaillent la toile de jute à l'atelier" className="aspect-square w-full rounded-3xl" />
        <div>
          <h2 className="text-3xl font-bold md:text-4xl">Ici, rien n'est laissé au hasard.</h2>
          <p className="mt-4 text-lg">La toile de jute vient du Tissage du Ronchay, à vingt minutes de l'atelier. Les anses sont en cuir au tannage végétal. Chaque lettre est posée au pochoir et peinte à la main. Deux mains, parfois quatre, et beaucoup d'audace.</p>
          <Link to="/atelier" className="btn-soft mt-6">Découvrir l'atelier</Link>
        </div>
      </Reveal>

      <Reveal className="mx-auto grid max-w-6xl items-center gap-6 px-4 pt-20 md:grid-cols-2 md:gap-12">
        <ProductImage src={bySlug("loom")!.images[0]} name="Loom" alt="Sac à main Loom en jute et cuir" className="aspect-square w-full rounded-3xl md:order-2" />
        <div>
          <h2 className="text-3xl font-bold md:text-4xl">Le lin, le cuir, et des lignes qu'on ne voit nulle part ailleurs.</h2>
          <p className="mt-4 text-lg">Loom, Parisienne, Titi, Midinette : des sacs en série limitée, cousus à Grémonville, pensés pour durer et se patiner avec vous.</p>
          <Link to="/rayon/$rayon" params={{ rayon: "sacs-a-main" }} className="btn-soft mt-6">Voir les sacs à main</Link>
        </div>
      </Reveal>

      <Reveal className="mx-auto max-w-6xl px-4 pt-20">
        <Link to={s.rayon === "personnalises" ? "/personnalises" : "/rayon/$rayon"} params={{ rayon: s.rayon }} className="group grid overflow-hidden rounded-3xl bg-sage-soft md:grid-cols-2">
          <ProductImage src={s.img} name={s.title} alt="Sac à bûches en jute peint à la main" className="aspect-square w-full" />
          <div className="flex flex-col justify-center gap-3 p-6 md:p-10">
            <h2 className="text-3xl font-bold md:text-4xl">{s.title}</h2>
            <p className="text-lg">{s.text}</p>
            <span className="font-semibold underline underline-offset-4">Voir le rayon</span>
          </div>
        </Link>
      </Reveal>

      <Reveal className="mx-auto max-w-6xl px-4 pt-20">
        <h2 className="text-3xl font-bold md:text-4xl">Petits par la taille. Pas par le caractère.</h2>
        <p className="mt-3 text-lg">Minis à messages, trousses, pochettes : à glisser dans le colis. Et à partir de 39 €, la livraison en point relais est offerte.</p>
        <div className="mt-5 grid grid-cols-4 gap-2 sm:gap-4">
          {["mini-peace-meme", "mini-le-gras", "mini-vide-tes-poches", "trousse-soco"].map((sl) => {
            const pr = bySlug(sl)!;
            return (
              <Link key={sl} to="/produit/$slug" params={{ slug: sl }}>
                <ProductImage src={pr.images[0]} name={pr.name} alt={pr.alt} className="aspect-square w-full rounded-xl" />
              </Link>
            );
          })}
        </div>
        <Link to="/rayon/$rayon" params={{ rayon: "minis" }} className="btn-soft mt-6">Voir les petits cadeaux</Link>
      </Reveal>

      <Reveal className="mx-auto max-w-6xl px-4 pt-20">
        <h2 className="text-3xl font-bold md:text-4xl">Elles en parlent mieux que nous.</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {reviews.map(([n, t]) => (
            <blockquote key={n} className="rounded-2xl border bg-card p-5">
              <div className="flex gap-0.5 text-foreground">{Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}</div>
              <p className="mt-2 text-lg">« {t} »</p>
              <footer className="mt-2 text-muted-foreground"><strong className="text-foreground">{n}</strong>, avis Google</footer>
            </blockquote>
          ))}
        </div>
        <p className="mt-4 font-medium">★★★★★ 5/5 · 19 avis Google · <a href="https://www.google.com/search?q=Grenouille+Rouge+Gr%C3%A9monville" target="_blank" rel="noreferrer" className="underline">Lire les avis →</a></p>
      </Reveal>

      <Reveal className="mx-auto max-w-6xl px-4 pt-20">
        <Pictos />
      </Reveal>

      <Reveal className="mx-auto grid max-w-6xl items-center gap-6 px-4 pt-20 md:grid-cols-2 md:gap-12">
        <ProductImage src={PHOTOS.atelier} name="Marie-Isabel et Bénédicte à l'atelier" alt="Marie-Isabel et Bénédicte dans l'atelier de Grémonville" className="aspect-square w-full rounded-3xl" />
        <div>
          <h2 className="text-3xl font-bold md:text-4xl">Marie-Isabel, Bénédicte, et la relève.</h2>
          <p className="mt-4 text-lg">Tapissière de métier, Marie-Isabel coud son premier sac en jute en 2000. Bénédicte rejoint l'atelier en 2018. Depuis, chaque pièce passe par leurs mains, à Grémonville, au milieu des champs. Et quand on vous demandera d'où vient votre sac, vous saurez quoi répondre.</p>
          <Link to="/atelier" className="btn-soft mt-6">Notre histoire</Link>
        </div>
      </Reveal>

      <section className="mx-auto max-w-6xl px-4 pt-16 text-center text-[0.95rem] text-muted-foreground">
        <p>Boutique, hôtel, entreprise ? Nous fabriquons aussi en série, à votre nom ou à votre logo. <Link to="/espace-pro" className="font-medium text-foreground underline">Espace pro</Link></p>
        <p className="mt-6">Depuis 2000, plus de 800 clientes nous ont fait confiance en ligne. Et bien plus en boutique.</p>
      </section>
    </>
  );
}
