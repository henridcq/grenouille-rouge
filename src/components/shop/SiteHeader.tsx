import { Link, useRouterState } from "@tanstack/react-router";
import { Search, ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/cart";
import { LOGO } from "@/data/products";

const BANNER = "Cousu et peint à la main en Normandie · Livraison offerte en point relais dès 39 € · Expédié sous 48 h";

const nav = [
  { label: "Personnalisés", to: "/personnalises" as const },
  { label: "Paniers", to: "/rayon/$rayon" as const, rayon: "rangement" },
  { label: "Cabas et sacs", to: "/rayon/$rayon" as const, rayon: "cabas" },
  { label: "L'atelier", to: "/atelier" as const },
];

export function SiteHeader() {
  const { count, setOpen, bump } = useCart();
  const path = useRouterState({ select: (s) => s.location.pathname });
  // Sur le configurateur, l'aperçu prend la place collante en haut sur téléphone.
  const configurator = path === "/composer" || path === "/cabas-personnalise";
  return (
    <header className={`${configurator ? "relative md:sticky" : "sticky"} top-0 z-40 border-b bg-background/95 backdrop-blur`}>
      <div className="overflow-hidden bg-foreground py-1.5 text-xs text-background sm:text-sm">
        <div className="marquee flex w-max gap-12 whitespace-nowrap md:mx-auto md:w-auto md:justify-center">
          <span>{BANNER}</span>
          <span className="md:hidden" aria-hidden="true">{BANNER}</span>
        </div>
      </div>
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-2.5">
        <Link to="/" className="flex min-w-0 items-center gap-2" aria-label="Grenouille Rouge, accueil">
          <img src={LOGO} alt="Grenouille Rouge" className="h-10 w-auto mix-blend-multiply sm:h-12" />
        </Link>
        <nav className="ml-6 hidden gap-6 md:flex">
          {nav.map((n) => (
            <Link key={n.label} to={n.to} params={n.rayon ? { rayon: n.rayon } : undefined} className="font-medium hover:text-primary" activeProps={{ className: "underline underline-offset-8" }}>
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <Link to="/recherche" aria-label="Rechercher" className="grid h-11 w-11 place-items-center rounded-full hover:bg-muted">
            <Search className="h-5 w-5" />
          </Link>
          <button onClick={() => setOpen(true)} aria-label={`Panier, ${count} article${count > 1 ? "s" : ""}`} className="relative grid h-11 w-11 place-items-center rounded-full border-2 border-foreground">
            <ShoppingBag className="h-5 w-5" />
            <span key={bump} className={`absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-foreground px-1 text-[0.7rem] font-bold text-background ${bump ? "animate-bump" : ""}`}>
              {count}
            </span>
          </button>
        </div>
      </div>
      <nav className="mx-auto flex max-w-6xl gap-2 overflow-x-auto px-4 pb-2.5 text-[0.95rem] md:hidden">
        {nav.map((n) => (
          <Link key={n.label} to={n.to} params={n.rayon ? { rayon: n.rayon } : undefined} className="shrink-0 rounded-full border px-4 py-1.5 font-medium" activeProps={{ className: "bg-foreground text-background border-foreground" }}>
            {n.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
