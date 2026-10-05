import { Link } from "@tanstack/react-router";
import { Minus, Plus, Trash2 } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";
import { useCart } from "@/lib/cart";
import { RELAIS_FREE, euro, products } from "@/data/products";
import { ProductImage } from "./ProductImage";
import { CustomDetails } from "./CustomDetails";

const suggestions = ["mini-peace-meme", "trousse-soco", "le-petit-panier-vide-poches"];

export function CartDrawer() {
  const { open, setOpen, lines, total, setQty, add, gift, setGift, note, setNote } = useCart();
  const isMobile = useIsMobile();
  const left = Math.max(0, RELAIS_FREE - total);
  const pct = Math.min(100, (total / RELAIS_FREE) * 100);
  const sugg = products.filter((p) => suggestions.includes(p.slug) && p.price < 30 && !lines.some((l) => l.slug === p.slug));

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent side={isMobile ? "bottom" : "right"} className={`flex flex-col gap-0 bg-background p-0 ${isMobile ? "max-h-[90vh] rounded-none" : "w-full sm:max-w-md"}`}>
        <SheetHeader className="border-b px-5 py-4 text-left">
          <SheetTitle className="font-display text-2xl">Votre panier</SheetTitle>
        </SheetHeader>

        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
            <p className="text-lg">Il est vide, mais pas pour longtemps. Les Minis commencent à 19 €.</p>
            <Link to="/rayon/$rayon" params={{ rayon: "petits-cadeaux" }} onClick={() => setOpen(false)} className="btn-soft">Voir les petits cadeaux</Link>
          </div>
        ) : (
          <>
            <div className="border-b px-5 py-3">
              <p className="text-[0.95rem] font-medium">
                {left > 0 ? `Plus que ${euro(left).replace(",00", "")} pour la livraison offerte en point relais` : "Livraison en point relais offerte"}
              </p>
              <div className="mt-2 h-2 overflow-hidden bg-muted">
                <div className="h-full bg-sage" style={{ width: `${pct}%` }} />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-3">
              <ul className="divide-y">
                {lines.map((l) => (
                  <li key={l.key} className="flex gap-3 py-3">
                    <ProductImage src={l.product.images[0]} name={l.product.name} alt={l.product.alt} className="h-20 w-20 shrink-0 rounded-none" />
                    <div className="flex min-w-0 flex-1 flex-col">
                      <p className="font-semibold leading-tight">{l.product.name}</p>
                      {l.custom && <CustomDetails c={l.custom} />}
                      {l.variant && <p className="text-sm text-muted-foreground">{l.variant}</p>}
                      <div className="mt-2 flex items-center gap-2">
                        <button aria-label="Retirer un" onClick={() => setQty(l.key, l.qty - 1)} className="grid h-9 w-9 place-items-center rounded-full border">
                          {l.qty === 1 ? <Trash2 className="h-4 w-4" /> : <Minus className="h-4 w-4" />}
                        </button>
                        <span className="w-6 text-center font-semibold">{l.qty}</span>
                        <button aria-label="Ajouter un" onClick={() => setQty(l.key, l.qty + 1)} className="grid h-9 w-9 place-items-center rounded-full border"><Plus className="h-4 w-4" /></button>
                        <span className="ml-auto font-semibold">{euro(l.qty * l.price)}</span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>

              {sugg.length > 0 && (
                <div className="mt-4">
                  <p className="font-display text-lg font-semibold">Pour compléter le colis</p>
                  <div className="mt-2 grid grid-cols-3 gap-2">
                    {sugg.map((p) => (
                      <div key={p.slug} className="relative text-sm">
                        <ProductImage src={p.images[0]} name={p.name} alt={p.alt} className="aspect-square w-full rounded-none" />
                        <p className="mt-1 leading-tight">{p.name}</p>
                        <p className="font-semibold">{p.price} €</p>
                        {p.rayon === "personnalises" ? (
                          <Link to="/composer" search={{ forme: p.format }} onClick={() => setOpen(false)} aria-label={`Personnaliser ${p.name}`} className="absolute right-1 top-1 grid h-8 w-8 place-items-center bg-background shadow"><Plus className="h-4 w-4" /></Link>
                        ) : (
                          <button onClick={() => add(p.slug)} aria-label={`Ajouter ${p.name}`} className="absolute right-1 top-1 grid h-8 w-8 place-items-center bg-background shadow"><Plus className="h-4 w-4" /></button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <label className="mt-5 flex cursor-pointer items-start gap-3 rounded-none border bg-card p-3">
                <input type="checkbox" checked={gift} onChange={(e) => setGift(e.target.checked)} className="mt-1 h-5 w-5 accent-[var(--sage)]" />
                <span>C'est un cadeau : on emballe, on n'imprime pas le prix, et on glisse votre petit mot.</span>
              </label>
              {gift && (
                <textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="Votre petit mot (on l'écrit à la main)" rows={3} className="mt-2 w-full rounded-none border bg-card p-3" />
              )}
            </div>
            <div className="space-y-2 border-t px-5 py-4">
              <Link to="/commande" onClick={() => setOpen(false)} className="btn-buy w-full text-lg">Commander · {euro(total)}</Link>
              <p className="text-center text-sm text-muted-foreground">Pas de compte à créer. Paiement sécurisé.</p>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
