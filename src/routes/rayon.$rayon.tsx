import { createFileRoute, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { products, rayons, type Rayon, type Tag } from "@/data/products";
import { ProductCard } from "@/components/shop/ProductCard";

export const Route = createFileRoute("/rayon/$rayon")({
  loader: ({ params }) => {
    if (!(params.rayon in rayons)) throw notFound();
    return { rayon: params.rayon as Rayon };
  },
  head: ({ loaderData }) => {
    const r = loaderData ? rayons[loaderData.rayon] : null;
    const title = r ? `${r.title} — Grenouille Rouge` : "Rayon introuvable";
    return {
      meta: [
        { title },
        { name: "description", content: r?.intro ?? "" },
        { property: "og:title", content: title },
        { property: "og:description", content: r?.intro ?? "" },
      ],
    };
  },
  component: RayonPage,
});

const filters: ("Tous" | Tag)[] = ["Tous", "Cuisine", "Animaux", "Humour", "Enfants"];

function RayonPage() {
  const { rayon } = Route.useLoaderData();
  const [f, setF] = useState<"Tous" | Tag>("Tous");
  const [all, setAll] = useState(false);
  const list = products.filter((p) => p.rayon === rayon && (f === "Tous" || p.tag === f));
  const shown = all ? list : list.slice(0, 12);

  return (
    <section className="mx-auto max-w-6xl px-4 pt-8">
      <h1 className="text-4xl font-bold md:text-5xl">{rayons[rayon].title}</h1>
      <p className="mt-2 text-lg text-muted-foreground">{rayons[rayon].intro}</p>
      <div className="mt-5 flex gap-2 overflow-x-auto pb-1">
        {filters.map((x) => (
          <button
            key={x}
            onClick={() => setF(x)}
            className={`shrink-0 rounded-full border px-4 py-2 font-medium ${f === x ? "border-foreground bg-foreground text-background" : ""}`}
          >
            {x}
          </button>
        ))}
      </div>
      <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
        {shown.map((p) => <ProductCard key={p.id} product={p} />)}
      </div>
      {list.length === 0 && <p className="py-10 text-center text-muted-foreground">Rien dans ce rayon pour ce thème, pour l'instant.</p>}
      {!all && list.length > 12 && (
        <div className="mt-6 text-center"><button onClick={() => setAll(true)} className="btn-soft">Voir plus</button></div>
      )}
    </section>
  );
}
