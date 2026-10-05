import { Link } from "@tanstack/react-router";
import type { Product } from "@/data/products";
import { useCart } from "@/lib/cart";
import { ProductImage } from "./ProductImage";
import { PersoLink } from "./PersoLink";

export function ProductCard({ product }: { product: Product }) {
  const { add } = useCart();
  const custom = product.rayon === "personnalises";
  // Une option à choisir (ou un texte à écrire) : on passe par la fiche.
  const needsFiche = !!product.options || product.slug === "trousse-en-lin-personnalisable";
  return (
    <article className="group flex flex-col">
      <Link to="/produit/$slug" params={{ slug: product.slug }} className="relative block overflow-hidden rounded-2xl">
        <ProductImage src={product.images[0]} name={product.name} alt={product.alt} className="aspect-square w-full transition-transform duration-500 group-hover:scale-[1.03]" />
        {product.bestseller && (
          <span className="absolute left-2 top-2 rounded-full bg-background/90 px-2.5 py-0.5 text-xs font-semibold">Best-seller</span>
        )}
      </Link>
      <div className="flex flex-1 flex-col gap-1 pt-3">
        <Link to="/produit/$slug" params={{ slug: product.slug }} className="font-display text-lg font-semibold leading-tight">
          {product.name}
        </Link>
        <p className="font-semibold text-primary">{custom || product.fromPrice ? `À partir de ${product.price} €` : `${product.price} €`}</p>
        <div className="mt-auto pt-2">
          {custom ? (
            <PersoLink format={product.format} className="btn-soft w-full text-[0.95rem]">Personnaliser</PersoLink>
          ) : needsFiche ? (
            <Link to="/produit/$slug" params={{ slug: product.slug }} className="btn-soft w-full text-[0.95rem]">Choisir</Link>
          ) : (
            <button onClick={() => add(product.slug)} className="btn-soft w-full text-[0.95rem]">Ajouter</button>
          )}
        </div>
      </div>
    </article>
  );
}
