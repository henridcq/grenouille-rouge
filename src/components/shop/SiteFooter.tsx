import { Link } from "@tanstack/react-router";

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t bg-card">
      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-10 text-[0.95rem] sm:grid-cols-2">
        <div className="space-y-1">
          <p className="font-display text-xl font-bold">Grenouille Rouge</p>
          <p>Atelier à Grémonville, Normandie</p>
          <p><a href="mailto:contact@grenouillerouge.com" className="underline">contact@grenouillerouge.com</a></p>
          <p>Instagram @grenouille.rouge</p>
        </div>
        <ul className="flex flex-wrap gap-x-5 gap-y-2 sm:justify-end">
          <li><Link to="/atelier" className="underline">L'atelier</Link></li>
          <li><Link to="/livraison" className="underline">Livraison</Link></li>
          <li><Link to="/livraison" hash="retours" className="underline">Retours</Link></li>
          <li><Link to="/legal/$page" params={{ page: "cgv" }} className="underline">CGV</Link></li>
          <li><Link to="/legal/$page" params={{ page: "mentions-legales" }} className="underline">Mentions légales</Link></li>
          <li><Link to="/legal/$page" params={{ page: "confidentialite" }} className="underline">Confidentialité</Link></li>
          <li><Link to="/espace-pro" className="underline">Espace pro</Link></li>
        </ul>
      </div>
      <p className="px-4 pb-6 text-center text-sm text-muted-foreground">© 2026 Grenouille Rouge. Chez nous la grenouille, on ne la mange pas, on la protège.</p>
    </footer>
  );
}
