import { Link } from "@tanstack/react-router";
import type { Product } from "@/data/products";
import { useCart } from "@/lib/cart";
import { ProductImage } from "./ProductImage";

export function ProductCard({ product }: { product: Product }) {
  const { add } = useCart();
  const custom = product.rayon === "personnalises";
  return (
    <article className="group flex flex-col">
      <Link to="/produit/$slug" params={{ slug: product.slug }} className="relative block overflow-hidden rounded-2xl">
        <ProductImage src={product.images[0]} name={product.name} alt={product.alt} className="aspect-square w-full transition-transform duration-500 group-hover:scale-[1.03]" />
        {product.stock === "out" && (
          <span className="absolute left-2 top-2 rounded-full bg-background px-2.5 py-0.5 text-xs font-semibold">Bientôt de retour</span>
        )}
      </Link>
      <div className="flex flex-1 flex-col gap-1 pt-3">
        <Link to="/produit/$slug" params={{ slug: product.slug }} className="font-display text-lg font-semibold leading-tight">
          {product.name}
        </Link>
        <p className="font-semibold text-primary">{custom ? `À partir de ${product.price} €` : `${product.price} €`}</p>
        <div className="mt-auto pt-2">
          {custom ? (
            <Link to="/composer" search={{ forme: product.format }} className="btn-soft w-full text-[0.95rem]">Personnaliser</Link>
          ) : product.stock === "out" ? (
            <span className="btn-soft w-full cursor-not-allowed text-[0.95rem] opacity-50">Bientôt de retour</span>
          ) : (
            <button onClick={() => add(product.slug)} className="btn-soft w-full text-[0.95rem]">Ajouter</button>
          )}
        </div>
      </div>
    </article>
  );
}
