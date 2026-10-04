import type { Product } from "@/data/products";
import { useCart } from "@/lib/cart";
import { ProductImage } from "./ProductImage";

export function ProductCard({ product }: { product: Product }) {
  const { add } = useCart();
  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border bg-card">
      <div className="relative">
        <ProductImage src={product.images[0]} name={product.name} className="aspect-square w-full" />
        {product.tag && (
          <span className="absolute left-2 top-2 rounded-full bg-primary px-2.5 py-0.5 text-xs font-semibold text-primary-foreground">
            {product.tag}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-3 p-3 sm:p-4">
        <h3 className="font-display text-lg font-semibold leading-tight sm:text-xl">« {product.name} »</h3>
        <p className="mt-auto text-lg font-semibold">{product.price} €</p>
        <button onClick={() => add(product.id)} className="btn-buy w-full px-2 text-[0.95rem]">
          Ajouter au panier
        </button>
      </div>
    </article>
  );
}
