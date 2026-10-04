import { Link } from "@tanstack/react-router";
import { Minus, Plus, Trash2 } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";
import { useCart } from "@/lib/cart";
import { FREE_SHIPPING, euro } from "@/data/products";
import { ProductImage } from "./ProductImage";

export function CartDrawer() {
  const { open, setOpen, lines, total, setQty } = useCart();
  const isMobile = useIsMobile();
  const left = Math.max(0, FREE_SHIPPING - total);
  const pct = Math.min(100, (total / FREE_SHIPPING) * 100);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent
        side={isMobile ? "bottom" : "right"}
        className={`flex flex-col gap-0 bg-background p-0 ${isMobile ? "max-h-[88vh] rounded-t-3xl" : "w-full sm:max-w-md"}`}
      >
        <SheetHeader className="border-b px-5 py-4 text-left">
          <SheetTitle className="font-display text-2xl">Votre panier</SheetTitle>
        </SheetHeader>

        <div className="border-b bg-sage-soft px-5 py-3">
          <p className="text-[0.95rem] font-medium">
            {left > 0 ? <>Plus que <strong>{euro(left)}</strong> pour la livraison offerte</> : "Livraison offerte, c'est gagné !"}
          </p>
          <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-background">
            <div className="h-full rounded-full bg-sage transition-all" style={{ width: `${pct}%` }} />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-3">
          {lines.length === 0 && <p className="py-10 text-center text-muted-foreground">Votre panier est encore vide.</p>}
          <ul className="divide-y">
            {lines.map((l) => (
              <li key={l.id} className="flex items-center gap-3 py-3">
                <ProductImage src={l.product.images[0]} name={l.product.name} className="h-16 w-16 shrink-0 rounded-lg" />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold">{l.product.name}</p>
                  <p className="text-muted-foreground">{euro(l.product.price * l.qty)}</p>
                  <div className="mt-1 flex items-center gap-2">
                    <button aria-label="Retirer un" onClick={() => setQty(l.id, l.qty - 1)} className="grid h-9 w-9 place-items-center rounded-full border">
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-6 text-center font-semibold">{l.qty}</span>
                    <button aria-label="Ajouter un" onClick={() => setQty(l.id, l.qty + 1)} className="grid h-9 w-9 place-items-center rounded-full border">
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <button aria-label="Retirer du panier" onClick={() => setQty(l.id, 0)} className="grid h-10 w-10 place-items-center text-muted-foreground">
                  <Trash2 className="h-5 w-5" />
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="border-t px-5 py-4">
          <div className="mb-3 flex justify-between text-lg">
            <span>Total</span>
            <strong>{euro(total)}</strong>
          </div>
          {lines.length > 0 && (
            <Link to="/commande" onClick={() => setOpen(false)} className="btn-buy w-full text-lg">
              Commander
            </Link>
          )}
          <button onClick={() => setOpen(false)} className="mt-2 w-full py-2 text-center underline underline-offset-4">
            Continuer mes achats
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
