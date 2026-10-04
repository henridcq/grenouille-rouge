import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { products, rayons, shopRayons, type RayonId } from "@/data/products";
import { ProductCard } from "@/components/shop/ProductCard";
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

function Rayon() {
  const { rayon } = Route.useLoaderData();
  const r = rayons[rayon];
  const list = products.filter((p) => p.rayon === rayon);
  const extra = rayon === "cabas" ? products.find((p) => p.slug === "le-cabas-personnalisable") : undefined;

  return (
    <div className="mx-auto max-w-6xl px-4 pt-8">
      <nav className="mb-6 flex gap-2 overflow-x-auto pb-1 text-[0.95rem]">
        {shopRayons.map((id) => (
          <Link key={id} to="/rayon/$rayon" params={{ rayon: id }} className="shrink-0 rounded-full border px-4 py-1.5" activeProps={{ className: "bg-foreground text-background border-foreground" }}>
            {rayons[id].label}
          </Link>
        ))}
      </nav>
      <h1 className="text-4xl font-bold md:text-5xl">{r.title}</h1>
      <p className="mt-3 max-w-2xl text-lg text-muted-foreground">{r.intro}</p>
      <Reveal className="mt-8 grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-5 lg:grid-cols-4">
        {extra && <ProductCard product={extra} />}
        {list.map((p) => <ProductCard key={p.slug} product={p} />)}
      </Reveal>
    </div>
  );
}
