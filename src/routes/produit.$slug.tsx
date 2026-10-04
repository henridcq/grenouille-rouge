import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { useState } from "react";
import { bySlug, products, rayons, delayOf, euro } from "@/data/products";
import { formatOf } from "@/data/custom";
import { useCart } from "@/lib/cart";
import { ProductImage } from "@/components/shop/ProductImage";
import { ProductCard } from "@/components/shop/ProductCard";
import { PersoLink } from "@/components/shop/PersoLink";
import { Pictos, Faq } from "@/components/shop/Reassurance";

export const Route = createFileRoute("/produit/$slug")({
  loader: ({ params }) => {
    const p = bySlug(params.slug);
    if (!p) throw notFound();
    return { slug: p.slug };
  },
  head: ({ loaderData }) => {
    const p = loaderData ? bySlug(loaderData.slug) : undefined;
    if (!p) return { meta: [{ title: "Produit · Grenouille Rouge" }] };
    const title = p.seo?.title ?? `${p.name} : ${rayons[p.rayon].title.toLowerCase()} · Grenouille Rouge`;
    const description = p.seo?.description ?? `${p.accroche ?? p.alt}. ${p.price} €, ${delayOf(p).toLowerCase()}.`;
    const img = p.images[0];
    return {
      meta: [
        { title }, { name: "description", content: description },
        { property: "og:title", content: title }, { property: "og:description", content: description },
        ...(img ? [{ property: "og:image", content: img }, { name: "twitter:image", content: img }] : []),
      ],
    };
  },
  component: Fiche,
});

function Fiche() {
  const { slug } = Route.useLoaderData();
  const p = bySlug(slug)!;
  const { add } = useCart();
  const [idx, setIdx] = useState(0);
  const custom = p.rayon === "personnalises";
  const out = p.stock === "out";
  const short = custom ? formatOf(p.format!).label : "";
  const related = products.filter((x) => x.slug !== p.slug && x.rayon !== "personnalises" && x.stock !== "out" && x.price < 60)
    .filter((x, i, a) => a.findIndex((y) => y.rayon === x.rayon) === i).slice(0, 4);
  const stockLine = custom ? "Peint à la commande, expédié sous 8 jours" : typeof p.stock === "number" ? `Il en reste ${p.stock} dans l'atelier` : out ? "Bientôt de retour" : null;
  const title = custom ? `${p.name}, à votre prénom` : p.name;

  const cta = custom ? (
    <PersoLink format={p.format} className="btn-buy w-full text-lg">
      Ajouter mon {short} · {p.price} €
    </PersoLink>
  ) : out ? (
    <span className="btn-buy w-full cursor-not-allowed text-lg opacity-40">Bientôt de retour</span>
  ) : (
    <button onClick={() => add(p.slug)} className="btn-buy w-full text-lg">Ajouter au panier · {euro(p.price)}</button>
  );

  return (
    <div className="mx-auto max-w-6xl px-4 pb-28 pt-4 md:pb-0 md:pt-10">
      <div className="grid gap-6 md:grid-cols-2 md:gap-12">
        <div>
          {p.images.length > 0 ? (
            <div
              className="-mx-4 flex snap-x snap-mandatory overflow-x-auto md:mx-0 md:rounded-3xl"
              onScroll={(e) => setIdx(Math.round(e.currentTarget.scrollLeft / e.currentTarget.clientWidth))}
            >
              {p.images.map((src, i) => (
                <ProductImage key={src} src={src} name={p.name} alt={i === 0 ? p.alt : `${p.alt}, vue ${i + 1}`} className="aspect-square w-full shrink-0 snap-center" />
              ))}
            </div>
          ) : (
            <ProductImage name={p.name} alt={p.alt} className="aspect-square w-full rounded-3xl" />
          )}
          {p.images.length > 1 && (
            <div className="mt-3 flex justify-center gap-1.5">
              {p.images.map((_, i) => <span key={i} className={`h-2 rounded-full transition-all ${i === idx ? "w-5 bg-foreground" : "w-2 bg-border"}`} />)}
            </div>
          )}
        </div>

        <div>
          <h1 className="text-4xl font-bold leading-tight md:text-5xl">{title}</h1>
          <p className="mt-3 text-lg">
            <strong className="text-primary">{p.price} €</strong> · {p.proof ?? "Cousu main"} · {delayOf(p)}{custom ? " · Livraison offerte en point relais" : ""}
          </p>
          {stockLine && <p className="mt-2 inline-block rounded-full bg-sage-soft px-3 py-1 text-[0.95rem] font-medium text-sage">{stockLine}</p>}

          {p.accroche && <p className="mt-5 text-xl font-semibold">{p.accroche}</p>}
          {p.body && <p className="mt-3 text-lg">{p.body}</p>}
          {custom && (
            <div className="mt-4 space-y-3 text-lg">
              <p><strong>Ce que vous choisissez :</strong> {p.format === "cabas" ? "une couleur parmi 8 (le cuir des anses, le texte et le feston sont assortis), et votre texte : jusqu'à 3 lignes de 13 caractères." : "l'anse (à pois, à étoiles ou en corde de chanvre), la couleur des pois ou des étoiles, la couleur du texte, la couleur du feston cousu main qui borde le panier, et votre texte : jusqu'à 3 lignes de 13 caractères."}</p>
              <p><strong>Ce qu'on fait :</strong> on découpe le pochoir, on peint à la main à la peinture textile, on fixe à chaud, on coud, on pose le feston à la main, on vérifie, on emballe.</p>
              <p><strong>Dimensions :</strong> {p.tech}. <strong>Matières :</strong> toile de jute 100 % naturelle, doublure coton, anses en sangle de jute ou corde de chanvre. <strong>Entretien :</strong> un coup d'éponge humide. Pas de machine.</p>
            </div>
          )}
          {!custom && p.tech && <p className="mt-3 text-[0.95rem] italic text-muted-foreground">{p.tech}</p>}

          <div className="fixed inset-x-0 bottom-0 z-30 border-t bg-background/95 p-3 backdrop-blur md:static md:mt-6 md:border-0 md:bg-transparent md:p-0">
            {cta}
          </div>
          <p className="mt-3 text-[0.95rem] text-muted-foreground">
            {custom ? "☑ Emballage cadeau et petit mot écrit à la main : offerts." : "Emballage cadeau offert · Livraison offerte en point relais dès 39 €."}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">Paiement sécurisé · Carte, Apple Pay, Google Pay, PayPal</p>
        </div>
      </div>

      <section className="mt-14"><Pictos /></section>

      {custom && (
        <section className="mt-14 max-w-3xl">
          <h2 className="mb-4 text-3xl font-bold">Questions fréquentes</h2>
          <Faq />
        </section>
      )}

      <section className="mt-14">
        <h2 className="text-3xl font-bold">Pour compléter</h2>
        <div className="mt-6 grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-5 lg:grid-cols-4">
          {related.map((r) => <ProductCard key={r.slug} product={r} />)}
        </div>
      </section>
    </div>
  );
}
