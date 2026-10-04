import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useCart } from "@/lib/cart";
import { FREE_SHIPPING, euro } from "@/data/products";
import { Frog } from "@/components/shop/Frog";

export const Route = createFileRoute("/commande")({
  head: () => ({
    meta: [
      { title: "Votre commande — Grenouille Rouge" },
      { name: "description", content: "Finalisez votre commande en une seule page, sans créer de compte." },
      { property: "og:title", content: "Votre commande — Grenouille Rouge" },
      { property: "og:description", content: "Une seule page, pas besoin de créer un compte." },
    ],
  }),
  component: Commande,
});

const options = [
  { id: "relais", label: "Point relais", price: 3.9 },
  { id: "domicile", label: "À domicile", price: 6.9 },
  { id: "rouen", label: "Retrait à Rouen (Jeanne a dit)", price: 0 },
];

function Commande() {
  const { lines, total, clear } = useCart();
  const [ship, setShip] = useState("relais");
  const [done, setDone] = useState(false);
  const free = total >= FREE_SHIPPING;
  const shipPrice = free ? 0 : options.find((o) => o.id === ship)!.price;
  const grand = total + shipPrice;

  if (done)
    return (
      <section className="mx-auto max-w-lg px-4 py-20 text-center">
        <Frog className="mx-auto h-28 w-28" />
        <h1 className="mt-6 text-5xl font-bold">Merci !</h1>
        <p className="mt-3 text-xl">Votre commande part de l'atelier sous 48 h.</p>
        <Link to="/" className="btn-soft mt-8">Retour à l'accueil</Link>
      </section>
    );

  if (lines.length === 0)
    return (
      <section className="mx-auto max-w-lg px-4 py-20 text-center">
        <h1 className="text-3xl font-bold">Votre panier est vide</h1>
        <Link to="/" className="btn-soft mt-6">Voir nos paniers</Link>
      </section>
    );

  return (
    <section className="mx-auto grid max-w-6xl gap-6 px-4 pt-8 md:grid-cols-[1fr_1.3fr]">
      <aside className="h-fit rounded-2xl border bg-card p-5">
        <h2 className="text-2xl font-bold">Récapitulatif</h2>
        <ul className="mt-3 space-y-1">
          {lines.map((l) => (
            <li key={l.id} className="flex justify-between gap-3"><span>{l.qty} × {l.product.name}</span><span>{euro(l.qty * l.product.price)}</span></li>
          ))}
        </ul>
        <div className="mt-3 flex justify-between border-t pt-3"><span>Livraison</span><span>{euro(shipPrice)}</span></div>
        <div className="mt-1 flex justify-between text-xl font-bold"><span>Total</span><span>{euro(grand)}</span></div>
      </aside>

      <form onSubmit={(e) => { e.preventDefault(); clear(); setDone(true); window.scrollTo(0, 0); }} className="space-y-6">
        <p className="rounded-xl bg-sage-soft px-4 py-3 font-medium">Pas besoin de créer un compte.</p>

        <fieldset className="space-y-3">
          <legend className="font-display text-2xl font-bold">Vos coordonnées</legend>
          <input type="email" placeholder="Adresse e-mail" className="h-13 w-full rounded-xl border bg-card px-4 text-lg" />
          <div className="grid grid-cols-2 gap-3">
            <input placeholder="Prénom" className="h-13 w-full rounded-xl border bg-card px-4 text-lg" />
            <input placeholder="Nom" className="h-13 w-full rounded-xl border bg-card px-4 text-lg" />
          </div>
        </fieldset>

        <fieldset className="space-y-2">
          <legend className="font-display text-2xl font-bold">Livraison</legend>
          {options.map((o) => (
            <label key={o.id} className={`flex cursor-pointer items-center gap-3 rounded-xl border bg-card px-4 py-3 text-lg ${ship === o.id ? "border-foreground" : ""}`}>
              <input type="radio" name="ship" checked={ship === o.id} onChange={() => setShip(o.id)} className="h-5 w-5 accent-current" />
              <span className="flex-1">{o.label}</span>
              {o.price === 0 ? <span>Gratuit</span> : free ? <span><s className="text-muted-foreground">{euro(o.price)}</s> <span className="text-sage font-semibold">Offerte</span></span> : <span>{euro(o.price)}</span>}
            </label>
          ))}
        </fieldset>

        <fieldset className="space-y-3">
          <legend className="font-display text-2xl font-bold">Paiement</legend>
          <div className="grid grid-cols-2 gap-3">
            <button type="button" className="btn-soft">Apple Pay</button>
            <button type="button" className="btn-soft">PayPal</button>
          </div>
          <input disabled placeholder="Numéro de carte" className="h-13 w-full rounded-xl border bg-muted px-4 text-lg" />
          <div className="grid grid-cols-2 gap-3">
            <input disabled placeholder="MM / AA" className="h-13 rounded-xl border bg-muted px-4 text-lg" />
            <input disabled placeholder="Code" className="h-13 rounded-xl border bg-muted px-4 text-lg" />
          </div>
          <p className="text-sm text-muted-foreground">Maquette : aucune donnée n'est envoyée.</p>
        </fieldset>

        <button type="submit" className="btn-buy w-full text-xl">Payer {euro(grand)}</button>
      </form>
    </section>
  );
}
