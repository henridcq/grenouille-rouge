import { createFileRoute, Link } from "@tanstack/react-router";
import { products } from "@/data/products";
import { ProductImage } from "@/components/shop/ProductImage";
import { Faq } from "@/components/shop/Reassurance";
import { Reveal } from "@/components/shop/Reveal";

export const Route = createFileRoute("/personnalises")({
  head: () => ({
    meta: [
      { title: "Panier personnalisé prénom, peint à la main · Grenouille Rouge" },
      { name: "description", content: "Choisissez la forme, l'anse, la couleur et votre texte : on le peint au pochoir dans notre atelier normand. Expédié sous 8 jours. À partir de 43 €." },
      { property: "og:title", content: "Panier personnalisé prénom, peint à la main · Grenouille Rouge" },
      { property: "og:description", content: "Choisissez la forme, l'anse, la couleur et votre texte : on le peint au pochoir dans notre atelier normand." },
    ],
  }),
  component: Perso,
});

const order = ["le-bb-rond", "le-rond", "le-rond-xl", "le-carre", "le-carre-xxl", "le-cabas-personnalisable", "le-petit-panier-vide-poches"];

function Perso() {
  const formats = order.map((s) => products.find((p) => p.slug === s)!);
  return (
    <div className="mx-auto max-w-6xl px-4 pt-8">
      <h1 className="max-w-3xl text-4xl font-bold leading-tight md:text-5xl">Un prénom, un mot, une phrase. Peints à la main sur de la jute normande.</h1>
      <div className="mt-4 max-w-3xl space-y-3 text-lg">
        <p>À vous de jouer : choisissez la forme, l'anse et la couleur, puis écrivez ce qui vous ressemble. Nous posons le pochoir, nous peignons, nous cousons. Huit jours plus tard, c'est dans votre boîte aux lettres. Ou dans celle de la personne qui a de la chance.</p>
        <p className="text-muted-foreground">Les trésors de Louise. Le bazar de Jules. Barda de Papa. Doudous & Cie. Les chaussettes orphelines. Depuis 2000, nos clientes ont écrit plus de deux mille messages sur nos paniers. On n'a pas encore vu deux fois le même.</p>
      </div>

      <div className="mt-10 grid gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
        {formats.map((p) => (
          <Reveal key={p.slug}>
            <article className="flex h-full flex-col">
              <Link to="/produit/$slug" params={{ slug: p.slug }}>
                <ProductImage src={p.images[0]} name={p.name} alt={p.alt} className="aspect-square w-full rounded-2xl" />
              </Link>
              <h2 className="mt-3 text-2xl font-bold">{p.name}</h2>
              <p className="mt-1 text-[0.95rem]">{p.accroche}</p>
              <p className="mt-1 text-sm text-muted-foreground">{p.tech}</p>
              <p className="mt-2 text-lg font-semibold text-primary">{p.price} €</p>
              <Link to={p.format === "cabas" ? "/cabas-personnalise" : "/composer"} search={p.format === "cabas" ? undefined : { forme: p.format }} className="btn-soft mt-3">Personnaliser</Link>
            </article>
          </Reveal>
        ))}
      </div>

      <section className="mt-16 max-w-3xl">
        <h2 className="mb-4 text-3xl font-bold">Questions fréquentes</h2>
        <Faq />
      </section>
    </div>
  );
}
