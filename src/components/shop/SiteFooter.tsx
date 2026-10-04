export function SiteFooter() {
  return (
    <footer className="mt-16 border-t bg-card">
      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-10 text-[0.95rem] sm:grid-cols-3">
        <div>
          <p className="font-display text-xl font-bold">Grenouille Rouge</p>
          <p className="mt-2"><a href="mailto:contact@grenouillerouge.com" className="underline">contact@grenouillerouge.com</a></p>
          <p>Instagram @grenouille.rouge</p>
        </div>
        <p>Retrait gratuit à la boutique <strong>Jeanne a dit</strong>, à Rouen.</p>
        <ul className="space-y-1">
          <li><a href="#" className="underline">Conditions de vente</a></li>
          <li><a href="#" className="underline">Livraison</a></li>
          <li><a href="#" className="underline">Mentions légales</a></li>
        </ul>
      </div>
      <p className="pb-6 text-center text-sm text-muted-foreground">© 2026 Grenouille Rouge</p>
    </footer>
  );
}
