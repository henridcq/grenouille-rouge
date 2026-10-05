import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { PHOTOS, products, rayons, shopRayons, type RayonId } from "@/data/products";
import { ProductCard } from "@/components/shop/ProductCard";
import { ProductImage } from "@/components/shop/ProductImage";
import { Reveal } from "@/components/shop/Reveal";

export const Route = createFileRoute("/rayon/$rayon")({
  loader: ({ params }) => {
    if (!shopRayons.includes(params.rayon as RayonId)) throw notFound();
    return { rayon: params.rayon as RayonId };
  },
  head: ({ loaderData }) => {
    const r = loaderData ? rayons[loaderData.rayon] : undefined;
    return {
      meta: [
        { title: r?.seoTitle ?? "Rayon · Grenouille Rouge" },
        { name: "description", content: r?.intro ?? "" },
        { property: "og:title", content: r?.seoTitle ?? "Rayon · Grenouille Rouge" },
        { property: "og:description", content: r?.intro ?? "" },
      ],
    };
  },
  component: Rayon,
});

const banners: Partial<Record<RayonId, [string, string]>> = {
  "cabas-sacs": [PHOTOS.parisiennePortee, "La Parisienne kaki portée à l'épaule devant une porte bleue"],
  maison: [PHOTOS.trio, "Trois paniers à message sur un canapé vert"],
  "petits-cadeaux": [PHOTOS.miniAmbiance, "Mini « Vide tes poches » dans une entrée"],
};

function Rayon() {
  const { rayon } = Route.useLoaderData();
  const r = rayons[rayon];
  // Ordre du catalogue : meilleures ventes d'abord, photos faibles en dernier.
  const list = products.filter((p) => p.rayon === rayon);
  const b = banners[rayon];

  return (
    <div className="mx-auto max-w-6xl px-4 pt-8">
      <nav className="mb-6 flex gap-2 overflow-x-auto pb-1 text-[0.95rem]">
        <Link to="/personnalises" className="shrink-0 rounded-none border px-4 py-1.5">Personnalisés</Link>
        {shopRayons.map((id) => (
          <Link key={id} to="/rayon/$rayon" params={{ rayon: id }} className="shrink-0 rounded-none border px-4 py-1.5" activeProps={{ className: "bg-foreground text-background border-foreground" }}>
            {rayons[id].label}
          </Link>
        ))}
      </nav>
      {b && b[0] && <ProductImage src={b[0]} name={r.title} alt={b[1]} className="mb-6 aspect-[16/9] w-full rounded-none md:aspect-[3/1]" />}
      <h1 className="text-3xl font-medium md:text-4xl">{r.title}</h1>
      <p className="mt-3 max-w-2xl text-lg text-muted-foreground">{r.intro}</p>
      <Reveal className="mt-8 grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-5 lg:grid-cols-4">
        {list.map((p) => <ProductCard key={p.slug} product={p} />)}
      </Reveal>
    </div>
  );
}
