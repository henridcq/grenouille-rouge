import { createFileRoute, Link } from "@tanstack/react-router";
import { Hand, Truck, Gift, RotateCcw, Star } from "lucide-react";
import { products, byId } from "@/data/products";
import { useCart } from "@/lib/cart";
import { ProductCard } from "@/components/shop/ProductCard";
import { ProductImage } from "@/components/shop/ProductImage";

const HERO = "https://grenouillerouge.com/3095-large_default/vide-poche-bazar.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Grenouille Rouge — Paniers en jute à messages, dès 19 €" },
      { name: "description", content: "Des paniers en jute qui ont des choses à dire. Cousus main en Normandie, livraison offerte dès 70 €." },
      { property: "og:title", content: "Grenouille Rouge — Paniers en jute à messages" },
      { property: "og:description", content: "Cousus main en Normandie, à offrir… ou pas. À partir de 19 €." },
      { property: "og:image", content: HERO },
      { name: "twitter:image", content: HERO },
    ],
  }),
  component: Index,
});

const reviews = [
  ["Claire", "Caen", "Offert à ma belle-sœur, elle l'a mis sur son plan de travail le soir même."],
  ["Françoise", "Rouen", "Le « Peace mémé » a fait rire toute la table à Noël. Très bien cousu."],
  ["Martine", "Le Havre", "Commandé le lundi, reçu le jeudi, joliment emballé. Je reviendrai."],
  ["Sylvie", "Dieppe", "Mon prénom brodé en carmin sur Le Rond : il ne me quitte plus au marché."],
  ["Annie", "Évreux", "Solide, bien fini, rien à voir avec les paniers d'enseigne."],
  ["Hélène", "Paris", "Trois Minis pour mes trois sœurs, chacune le sien. Un succès !"],
];

const bundle = ["the-cafe", "epices", "le-gras", "soco"];

function Index() {
  const { add } = useCart();
  const minis = products.filter((p) => p.rayon === "minis").slice(0, 8);
  const bundleTotal = bundle.reduce((s, id) => s + byId(id).price, 0);

  return (
    <>
      {/* Hero */}
      <section className="mx-auto grid max-w-6xl items-center gap-6 px-4 pt-5 md:grid-cols-2 md:gap-12 md:pt-12">
        <ProductImage src={HERO} name="Peace mémé" className="aspect-[4/3] w-full rounded-3xl md:order-2 md:aspect-square" />
        <div>
          <h1 className="text-[2.4rem] font-bold leading-[1.05] md:text-6xl">
            Des paniers en jute qui ont des choses à dire
          </h1>
          <p className="mt-4 text-lg text-muted-foreground md:text-xl">
            Cousus main en Normandie, à offrir… ou pas. À partir de 19 €
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
            <a href="#minis" className="btn-buy text-lg sm:px-8">Voir les Minis</a>
            <Link to="/rayon/$rayon" params={{ rayon: "personnalisables" }} className="py-2 text-center underline underline-offset-4">
              Personnaliser le mien
            </Link>
          </div>
        </div>
      </section>

      {/* Minis */}
      <section id="minis" className="mx-auto max-w-6xl scroll-mt-40 px-4 pt-16">
        <h2 className="text-3xl font-bold md:text-4xl">Les Minis à messages, 19 €</h2>
        <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
          {minis.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
        <div className="mt-6 text-center">
          <Link to="/rayon/$rayon" params={{ rayon: "minis" }} className="btn-soft">Voir les 45 Minis</Link>
        </div>
      </section>

      {/* Personnalisable */}
      <section className="mx-auto max-w-6xl px-4 pt-16">
        <div className="grid overflow-hidden rounded-3xl border bg-card md:grid-cols-2">
          <ProductImage src={byId("le-rond").images[0]} name="Le Rond" className="aspect-square w-full" />
          <div className="flex flex-col justify-center gap-4 p-6 md:p-10">
            <h2 className="text-3xl font-bold md:text-4xl">Le vôtre, à votre prénom</h2>
            <p className="text-lg">Un prénom, un mot, une phrase… brodé dans notre atelier sous 8 jours.</p>
            <Link to="/rayon/$rayon" params={{ rayon: "personnalisables" }} className="btn-soft self-start">Créer le mien</Link>
          </div>
        </div>
      </section>

      {/* Lot */}
      <section className="mx-auto max-w-6xl px-4 pt-16">
        <div className="rounded-3xl bg-sage-soft p-5 md:p-8">
          <h2 className="text-3xl font-bold">Pour atteindre la livraison offerte</h2>
          <p className="mt-2 text-lg">3 Minis + 1 trousse = <strong>{bundleTotal} €</strong>, port offert</p>
          <div className="mt-5 grid grid-cols-4 gap-2 sm:gap-4">
            {bundle.map((id) => (
              <figure key={id}>
                <ProductImage src={byId(id).images[0]} name={byId(id).name} className="aspect-square w-full rounded-xl" />
                <figcaption className="mt-1 text-xs leading-tight sm:text-sm">{byId(id).name}</figcaption>
              </figure>
            ))}
          </div>
          <button onClick={() => add(bundle)} className="btn-soft mt-5 w-full bg-background sm:w-auto">
            Ajouter le lot · {bundleTotal} €
          </button>
        </div>
      </section>

      {/* Réassurance */}
      <section className="mx-auto grid max-w-6xl grid-cols-2 gap-4 px-4 pt-16 md:grid-cols-4">
        {[
          [Hand, "Cousu main à Grémonville (Normandie)"],
          [Truck, "Expédié sous 48 h (stock) / 8 jours (personnalisé)"],
          [Gift, "Livraison offerte dès 70 €, 3,90 € en point relais sinon"],
          [RotateCcw, "Retour sous 14 jours"],
        ].map(([Icon, text], i) => {
          const I = Icon as typeof Hand;
          return (
            <div key={i} className="flex flex-col items-center gap-2 text-center">
              <span className="grid h-14 w-14 place-items-center rounded-full bg-sage-soft text-sage"><I className="h-7 w-7" /></span>
              <p className="text-[0.95rem]">{text as string}</p>
            </div>
          );
        })}
      </section>

      {/* Avis */}
      <section className="mx-auto max-w-6xl px-4 pt-16">
        <h2 className="text-3xl font-bold md:text-4xl">Elles en parlent</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {reviews.map(([n, v, t]) => (
            <blockquote key={n} className="rounded-2xl border bg-card p-5">
              <div className="flex gap-0.5 text-primary">{Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}</div>
              <p className="mt-2 text-lg">« {t} »</p>
              <footer className="mt-2 text-muted-foreground">{n}, {v}</footer>
            </blockquote>
          ))}
        </div>
      </section>

      {/* Atelier */}
      <section className="mx-auto grid max-w-6xl items-center gap-6 px-4 pt-16 md:grid-cols-2">
        <ProductImage src="https://grenouillerouge.com/img/cms/Grenouille-Rouge-2.jpg" name="Marie-Isabel et Bénédicte à l'atelier" className="aspect-[4/3] w-full rounded-3xl" />
        <div>
          <h2 className="text-3xl font-bold md:text-4xl">Qui coud vos sacs ?</h2>
          <ul className="mt-4 space-y-2 text-lg">
            <li>Marie-Isabel et Bénédicte, tapissières depuis 1996.</li>
            <li>Nos premiers sacs en jute sont nés en 2000.</li>
            <li>Tout est cousu dans notre atelier de Grémonville.</li>
          </ul>
        </div>
      </section>
    </>
  );
}
