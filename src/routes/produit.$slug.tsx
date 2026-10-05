import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { useState } from "react";
import { bySlug, products, rayons, delayOf, euro } from "@/data/products";
import { formatOf, palette } from "@/data/custom";
import { Check } from "lucide-react";
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
  const [sel, setSel] = useState<Record<string, string>>(() => Object.fromEntries((p.options ?? []).map((o) => [o.label, o.choices[0]!.name])));
  const [word, setWord] = useState("LÉA");
  const [wColor, setWColor] = useState(palette.find((c) => c.name === "Rouge")!);
  const [reread, setReread] = useState(false);
  const custom = p.rayon === "personnalises";
  const trousse = p.slug === "trousse-en-lin-personnalisable";
  const picked = (p.options ?? []).map((o) => o.choices.find((c) => c.name === sel[o.label]) ?? o.choices[0]!);
  const price = picked.find((c) => c.price !== undefined)?.price ?? p.price;
  const pickedImg = picked.find((c) => c.image)?.image;
  const images = pickedImg ? [pickedImg, ...p.images.filter((i) => i !== pickedImg)] : p.images;
  const variantLabel = trousse
    ? `« ${word.trim()} » · couleur ${wColor.name.toLowerCase()}`
    : (p.options ?? []).map((o, i) => `${o.label} : ${picked[i]!.name}`).join(" · ");
  const short = custom ? formatOf(p.format!).label : "";
  const related = products.filter((x) => x.slug !== p.slug && x.rayon !== "personnalises" && !x.weakPhoto && x.price < 60)
    .filter((x, i, a) => a.findIndex((y) => y.rayon === x.rayon) === i).slice(0, 4);
  const stockLine = custom || trousse ? "Peint à la commande, expédié sous 8 jours" : p.stockLine ?? null;
  const title = custom ? `${p.name}, à votre prénom` : p.name;

  const cta = custom ? (
    <PersoLink format={p.format} className="btn-buy w-full text-lg">
      Ajouter mon {short} · {p.price} €
    </PersoLink>
  ) : (
    <button
      disabled={trousse && (!reread || !word.trim())}
      onClick={() => { add(p.slug, undefined, variantLabel ? { label: variantLabel, price } : undefined); setReread(false); }}
      className="btn-buy w-full text-lg disabled:cursor-not-allowed disabled:opacity-40 disabled:filter-none"
    >Ajouter au panier · {euro(price)}</button>
  );

  return (
    <div className="mx-auto max-w-6xl px-4 pb-28 pt-4 md:pb-0 md:pt-10">
      <div className="grid gap-6 md:grid-cols-2 md:gap-12">
        <div>
          {trousse ? (
            <div className="relative overflow-hidden rounded-none [container-type:inline-size]">
              <ProductImage src={p.images[0]} name={p.name} alt={p.alt} className="aspect-square w-full" />
              <div className="pointer-events-none absolute inset-0 grid place-items-center">
                <span style={{ fontFamily: '"Stardos Stencil", sans-serif', fontWeight: 700, fontSize: "13cqw", color: wColor.hex, opacity: 0.9, mixBlendMode: "multiply" }}>{word.trim() || "VOTRE MOT"}</span>
              </div>
            </div>
          ) : images.length > 0 ? (
            <div
              className="-mx-4 flex snap-x snap-mandatory overflow-x-auto md:mx-0 md:rounded-none"
              onScroll={(e) => setIdx(Math.round(e.currentTarget.scrollLeft / e.currentTarget.clientWidth))}
            >
              {images.map((src, i) => (
                <ProductImage key={src} src={src} name={p.name} alt={i === 0 ? p.alt : `${p.alt}, vue ${i + 1}`} className="aspect-square w-full shrink-0 snap-center" />
              ))}
            </div>
          ) : (
            <ProductImage name={p.name} alt={p.alt} className="aspect-square w-full rounded-none" />
          )}
          {!trousse && images.length > 1 && (
            <div className="mt-3 flex justify-center gap-1.5">
              {images.map((_, i) => <span key={i} className={`h-2 rounded-full ${i === idx ? "w-5 bg-foreground" : "w-2 bg-border"}`} />)}
            </div>
          )}
        </div>

        <div>
          <h1 className="text-3xl font-medium leading-tight md:text-4xl">{title}</h1>
          <p className="mt-3 text-lg">
            <strong>{price} €</strong> · {p.proof ?? "Cousu main"} · {delayOf(p)}{custom ? " · Livraison offerte en point relais" : ""}
          </p>
          {stockLine && <p className="mt-2 inline-block rounded-none bg-sage-soft px-3 py-1 text-[0.95rem] font-medium text-sage">{stockLine}</p>}

          {p.accroche && <p className="mt-5 text-xl font-semibold">{p.accroche}</p>}
          {p.body && <p className="mt-3 text-lg">{p.body}</p>}
          {custom && (
            <div className="mt-4 space-y-3 text-lg">
              <p><strong>Ce que vous choisissez :</strong> {p.format === "cabas" ? "une couleur parmi 8 (le cuir des anses, le texte et le feston sont assortis), et votre texte : jusqu'à 3 lignes de 13 caractères." : "l'anse (à pois, à étoiles ou en corde de chanvre), la couleur des pois ou des étoiles, la couleur du texte, la couleur du feston cousu main qui borde le panier, et votre texte : jusqu'à 3 lignes de 13 caractères."}</p>
              <p><strong>Ce qu'on fait :</strong> on découpe le pochoir, on peint à la main à la peinture textile, on fixe à chaud, on coud, on pose le feston à la main, on vérifie, on emballe.</p>
              <p><strong>Dimensions :</strong> {p.tech}. <strong>Matières :</strong> toile de jute 100 % naturelle, doublure coton, anses en sangle de jute ou corde de chanvre. <strong>Entretien :</strong> un coup d'éponge humide. Pas de machine.</p>
            </div>
          )}
          {(p.options ?? []).map((o) => (
            <fieldset key={o.label} className="mt-5">
              <legend className="text-lg font-semibold">{o.label} : <span className="font-normal">{sel[o.label]}</span></legend>
              <div className="mt-2 flex flex-wrap gap-2">
                {o.choices.map((c) => {
                  const on = sel[o.label] === c.name;
                  const pick = () => { setSel((s) => ({ ...s, [o.label]: c.name })); setIdx(0); };
                  return c.hex ? (
                    <button key={c.name} type="button" aria-pressed={on} aria-label={c.name} title={c.name} onClick={pick}
                      className={`grid h-10 w-10 place-items-center rounded-full border border-foreground/20 ${on ? "ring-2 ring-foreground ring-offset-2 ring-offset-background" : ""}`} style={{ backgroundColor: c.hex }}>
                      {on && <Check className="h-4 w-4 text-background mix-blend-difference" />}
                    </button>
                  ) : (
                    <button key={c.name} type="button" aria-pressed={on} onClick={pick}
                      className={`min-h-11 rounded-none border-2 px-4 font-medium ${on ? "border-foreground bg-foreground text-background" : "bg-card"}`}>
                      {c.name}{c.price !== undefined ? ` · ${c.price} €` : ""}
                    </button>
                  );
                })}
              </div>
            </fieldset>
          ))}
          {trousse && (
            <div className="mt-5 space-y-4 rounded-none border bg-card p-4">
              <label className="block">
                <span className="text-lg font-semibold">Votre mot</span>
                <input value={word} maxLength={7} onChange={(e) => { setReread(false); setWord(e.target.value.toUpperCase().replace(/[^A-ZÀ-ÖØ-ÞŒÆ0-9 &'-]/g, "")); }}
                  className="font-stencil mt-1 h-13 w-full rounded-none border bg-background px-4 text-xl uppercase" />
                <span className="mt-1 block text-sm text-muted-foreground">7 lettres maximum, une ligne. En majuscules, accents compris. {word.length}/7</span>
              </label>
              <div>
                <p className="font-semibold">Couleur : <span className="font-normal">{wColor.name}</span></p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {palette.map((c) => (
                    <button key={c.name} type="button" aria-label={c.name} title={c.name} aria-pressed={c.name === wColor.name} onClick={() => setWColor(c)}
                      className={`h-9 w-9 rounded-full border border-foreground/20 ${c.name === wColor.name ? "ring-2 ring-foreground ring-offset-2 ring-offset-background" : ""}`} style={{ backgroundColor: c.hex }} />
                  ))}
                </div>
              </div>
              <label className="flex cursor-pointer items-start gap-3">
                <input type="checkbox" checked={reread} onChange={(e) => setReread(e.target.checked)} className="mt-1 h-5 w-5 accent-[var(--foreground)]" />
                <span className="font-medium">J'ai relu mon texte : il sera peint tel quel.</span>
              </label>
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
          <h2 className="mb-4 text-2xl font-medium">Questions fréquentes</h2>
          <Faq />
        </section>
      )}

      <section className="mt-14">
        <h2 className="text-2xl font-medium">Pour compléter</h2>
        <div className="mt-6 grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-5 lg:grid-cols-4">
          {related.map((r) => <ProductCard key={r.slug} product={r} />)}
        </div>
      </section>
    </div>
  );
}
