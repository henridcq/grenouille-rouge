import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import { Frog } from "@/components/shop/Frog";

export const Route = createFileRoute("/marie")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "L'atelier — suivi des commandes Grenouille Rouge" },
      { name: "description", content: "Espace privé de suivi des commandes de l'atelier." },
      { property: "og:title", content: "L'atelier — suivi des commandes" },
      { property: "og:description", content: "Espace privé de suivi des commandes de l'atelier." },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: MarieLayout,
});

const tab = "flex-1 py-3 text-center text-sm border-b-2 border-transparent";
const active = { className: "border-sage! text-sage font-medium" };

function MarieLayout() {
  return (
    <div className="mx-auto min-h-screen max-w-5xl px-4 pb-16">
      <header className="flex items-center justify-between py-4 print:hidden">
        <Link to="/marie" className="flex items-center gap-2"><Frog className="h-8 w-8" /><span className="font-display text-2xl">L'atelier</span></Link>
        <span className="border border-sage px-2 py-0.5 text-xs text-sage">Maquette</span>
      </header>
      <nav className="mb-6 flex border-b print:hidden">
        <Link to="/marie" activeOptions={{ exact: true }} className={tab} activeProps={active}>Aujourd'hui</Link>
        <Link to="/marie/terminees" className={tab} activeProps={active}>Terminées</Link>
        <Link to="/marie/reglages" className={tab} activeProps={active}>Réglages</Link>
      </nav>
      <Outlet />
    </div>
  );
}
