import { Link } from "@tanstack/react-router";
import { ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/cart";
import { rayons, type Rayon } from "@/data/products";
import { Frog } from "./Frog";

export function SiteHeader() {
  const { count, setOpen, bump } = useCart();
  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
      <div className="bg-foreground px-3 py-1.5 text-center text-xs text-background sm:text-sm">
        Cousu main en Normandie · Livraison offerte dès 70 € · Emballage cadeau offert
      </div>
      <div className="mx-auto grid max-w-6xl grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 py-3">
        <Link to="/" className="flex min-w-0 items-center gap-2">
          <Frog className="h-8 w-8 shrink-0" />
          <span className="truncate font-display text-xl font-bold sm:text-2xl">
            Grenouille <span className="text-primary">Rouge</span>
          </span>
        </Link>
        <button
          onClick={() => setOpen(true)}
          aria-label={`Panier, ${count} article${count > 1 ? "s" : ""}`}
          className="relative grid h-12 w-12 place-items-center rounded-full border-2 border-foreground"
        >
          <ShoppingBag className="h-6 w-6" />
          <span
            key={bump}
            className={`absolute -right-1 -top-1 grid h-6 min-w-6 place-items-center rounded-full bg-primary px-1 text-xs font-bold text-primary-foreground ${bump ? "animate-bump" : ""}`}
          >
            {count}
          </span>
        </button>
      </div>
      <nav className="mx-auto flex max-w-6xl gap-2 overflow-x-auto px-4 pb-3 text-[0.95rem]">
        {(Object.keys(rayons) as Rayon[]).map((r) => (
          <Link
            key={r}
            to="/rayon/$rayon"
            params={{ rayon: r }}
            className="shrink-0 rounded-full border px-4 py-2 font-medium"
            activeProps={{ className: "bg-foreground text-background border-foreground" }}
          >
            {rayons[r].label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
