import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { products } from "@/data/products";
import { ProductCard } from "@/components/shop/ProductCard";

export const Route = createFileRoute("/recherche")({
  head: () => ({
    meta: [
      { title: "Rechercher · Grenouille Rouge" },
      { name: "description", content: "Retrouvez un panier, un cabas ou un sac Grenouille Rouge par son nom." },
      { property: "og:title", content: "Rechercher · Grenouille Rouge" },
      { property: "og:description", content: "Retrouvez un panier, un cabas ou un sac par son nom." },
    ],
  }),
  component: Recherche,
});

const norm = (s: string) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

function Recherche() {
  const [q, setQ] = useState("");
  const list = q.trim() ? products.filter((p) => norm(`${p.name} ${p.accroche ?? ""}`).includes(norm(q))) : [];
  return (
    <div className="mx-auto max-w-6xl px-4 pt-8">
      <h1 className="text-3xl font-medium">Rechercher</h1>
      <input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder="Rond XL, Chauffe Marcel, Mini…" className="mt-4 h-13 w-full max-w-xl rounded-none border bg-card px-4 text-lg" />
      {q.trim() && list.length === 0 && <p className="mt-6 text-lg">Rien trouvé pour « {q} ».</p>}
      <div className="mt-8 grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-5 lg:grid-cols-4">
        {list.map((p) => <ProductCard key={p.slug} product={p} />)}
      </div>
    </div>
  );
}
