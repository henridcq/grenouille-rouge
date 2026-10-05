import { useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, Search, ShoppingBag } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useCart } from "@/lib/cart";
import { LOGO } from "@/data/products";

const BANNER = "Livraison offerte en point relais dès 39 €";

export function SiteHeader() {
  const { count, setOpen } = useCart();
  const [menu, setMenu] = useState(false);
  const path = useRouterState({ select: (s) => s.location.pathname });
  // Sur le configurateur, l'aperçu prend la place collante en haut sur téléphone.
  const configurator = path === "/composer" || path === "/cabas-personnalise";
  const close = () => setMenu(false);
  const item = "block border-b py-4 font-display text-2xl";
  const act = { className: "text-sage underline underline-offset-8" };
  return (
    <header className={`${configurator ? "relative md:sticky" : "sticky"} top-0 z-40 border-b bg-background`}>
      <div className="bg-primary py-2 text-center text-xs font-medium text-primary-foreground sm:text-sm">{BANNER}</div>
      <div className="mx-auto grid max-w-6xl grid-cols-[1fr_auto_1fr] items-center px-3 py-2">
        <button onClick={() => setMenu(true)} aria-label="Ouvrir le menu" className="grid h-11 w-11 place-items-center text-sage">
          <Menu className="h-6 w-6" />
        </button>
        <Link to="/" aria-label="Grenouille Rouge, accueil" className="justify-self-center">
          <img src={LOGO} alt="Grenouille Rouge" className="h-10 w-auto mix-blend-multiply sm:h-12" />
        </Link>
        <div className="flex items-center justify-self-end">
          <Link to="/recherche" aria-label="Rechercher" className="grid h-11 w-11 place-items-center text-sage">
            <Search className="h-5 w-5" />
          </Link>
          <button onClick={() => setOpen(true)} aria-label={`Panier, ${count} article${count > 1 ? "s" : ""}`} className="relative grid h-11 w-11 place-items-center text-sage">
            <ShoppingBag className="h-6 w-6" />
            {count > 0 && (
              <span className="absolute right-0.5 top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-sage px-1 text-[0.7rem] font-semibold text-background">{count}</span>
            )}
          </button>
        </div>
      </div>
      <Sheet open={menu} onOpenChange={setMenu}>
        <SheetContent side="left" className="w-[85vw] max-w-sm bg-background px-6">
          <SheetHeader className="text-left"><SheetTitle className="font-display text-xl font-medium">Menu</SheetTitle></SheetHeader>
          <nav className="mt-4">
            <Link to="/personnalises" onClick={close} className={item} activeProps={act}>Personnalisés</Link>
            <Link to="/rayon/$rayon" params={{ rayon: "cabas-sacs" }} onClick={close} className={item} activeProps={act}>Cabas & sacs</Link>
            <Link to="/rayon/$rayon" params={{ rayon: "maison" }} onClick={close} className={item} activeProps={act}>La maison</Link>
            <Link to="/rayon/$rayon" params={{ rayon: "petits-cadeaux" }} onClick={close} className={item} activeProps={act}>Petits cadeaux</Link>
            <Link to="/atelier" onClick={close} className="block py-4 text-lg text-muted-foreground" activeProps={act}>L'atelier</Link>
          </nav>
        </SheetContent>
      </Sheet>
    </header>
  );
}
