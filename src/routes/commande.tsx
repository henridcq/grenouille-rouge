import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useCart, type CartLine } from "@/lib/cart";
import { shippingOptions, euro } from "@/data/products";
import { CustomDetails } from "@/components/shop/CustomDetails";

export const Route = createFileRoute("/commande")({
  head: () => ({
    meta: [
      { title: "Votre commande · Grenouille Rouge" },
      { name: "description", content: "Une seule page, pas de compte à créer. Livraison offerte en point relais dès 39 €." },
      { property: "og:title", content: "Votre commande · Grenouille Rouge" },
      { property: "og:description", content: "Une seule page, pas de compte à créer." },
    ],
  }),
  component: Commande,
});

const input = "h-13 w-full rounded-none border bg-card px-4 text-lg";

function Recap({ lines, shipPrice, grand, gift, note }: { lines: CartLine[]; shipPrice: number; grand: number; gift: boolean; note: string }) {
  return (
    <>
      <ul className="mt-3 divide-y">
        {lines.map((l) => (
          <li key={l.key} className="py-2">
            <div className="flex justify-between gap-3 font-medium"><span>{l.qty} × {l.product.name}</span><span>{euro(l.qty * l.price)}</span></div>
            {l.custom && <div className="mt-1 rounded-none bg-muted p-2"><CustomDetails c={l.custom} /></div>}
            {l.variant && <p className="text-sm">{l.variant}</p>}
            <p className="text-sm text-muted-foreground">{l.custom ? "peint pour vous, part sous 8 jours" : "part sous 48 h"}</p>
          </li>
        ))}
      </ul>
      {gift && <p className="mt-2 text-sm">Cadeau : emballé, prix retiré{note ? ` · « ${note} »` : ""}</p>}
      <div className="mt-3 flex justify-between border-t pt-3"><span>Livraison</span><span>{shipPrice === 0 ? "Offerte" : euro(shipPrice)}</span></div>
      <div className="mt-1 flex justify-between text-xl font-medium"><span>Total</span><span>{euro(grand)}</span></div>
    </>
  );
}

function Commande() {
  const { lines, total, clear, gift, note } = useCart();
  const [ship, setShip] = useState<string>("relais");
  const [cgv, setCgv] = useState(false);
  const [done, setDone] = useState<null | { lines: CartLine[]; shipPrice: number; grand: number; gift: boolean; note: string }>(null);
  const shipPrice = shippingOptions.find((o) => o.id === ship)!.price(total);
  const grand = total + shipPrice;

  if (done)
    return (
      <section className="mx-auto max-w-xl px-4 py-14">
        <h1 className="text-4xl font-medium">Merci, c'est noté !</h1>
        <p className="mt-4 text-lg">Votre commande n° 2451 est arrivée à l'atelier. Les pièces en stock partent sous 48 h ; les pièces à votre nom passent d'abord sous le pochoir. Vous recevrez un email avec le suivi dès que le colis est en route. En attendant, on vous montre ce qui se trame à l'atelier : <a href="https://www.instagram.com/grenouille.rouge/" target="_blank" rel="noreferrer" className="underline">Instagram @grenouille.rouge</a></p>
        <div className="mt-8 rounded-none border bg-card p-5"><Recap {...done} /></div>
        <Link to="/" className="btn-soft mt-8">Retour à l'accueil</Link>
      </section>
    );

  if (lines.length === 0)
    return (
      <section className="mx-auto max-w-lg px-4 py-20 text-center">
        <p className="text-xl">Il est vide, mais pas pour longtemps. Les Minis commencent à 19 €.</p>
        <Link to="/rayon/$rayon" params={{ rayon: "petits-cadeaux" }} className="btn-soft mt-6">Voir les petits cadeaux</Link>
      </section>
    );

  return (
    <section className="mx-auto max-w-6xl px-4 pt-8">
      <h1 className="text-3xl font-medium md:text-4xl">Plus que deux minutes.</h1>
      <div className="mt-6 grid gap-6 md:grid-cols-[1fr_1.3fr]">
        <aside className="h-fit rounded-none border bg-card p-5 md:sticky md:top-36">
          <h2 className="text-2xl font-medium">Récapitulatif</h2>
          <Recap lines={lines} shipPrice={shipPrice} grand={grand} gift={gift} note={note} />
        </aside>

        <form onSubmit={(e) => { e.preventDefault(); setDone({ lines, shipPrice, grand, gift, note }); clear(); window.scrollTo(0, 0); }} className="space-y-7">
          <fieldset className="space-y-3">
            <legend className="mb-2 font-display text-2xl font-medium">Vos coordonnées</legend>
            <input type="email" placeholder="Adresse e-mail" className={input} />
            <p className="text-sm text-muted-foreground">Votre email ne sert qu'à vous envoyer le suivi.</p>
            <div className="grid grid-cols-2 gap-3">
              <input placeholder="Prénom" className={input} />
              <input placeholder="Nom" className={input} />
            </div>
            <input type="tel" placeholder="Téléphone (pour le transporteur)" className={input} />
          </fieldset>

          <fieldset className="space-y-2">
            <legend className="mb-2 font-display text-2xl font-medium">Où livrer ?</legend>
            {shippingOptions.map((o) => {
              const price = o.price(total);
              return (
                <label key={o.id} className={`flex cursor-pointer items-center gap-3 rounded-none border-2 bg-card px-4 py-3 ${ship === o.id ? "border-foreground" : "border-transparent"}`}>
                  <input type="radio" name="ship" checked={ship === o.id} onChange={() => setShip(o.id)} className="h-5 w-5 accent-[var(--foreground)]" />
                  <span className="flex-1">
                    <span className="block text-lg">{o.label}</span>
                    <span className="text-sm text-muted-foreground">{o.help}</span>
                  </span>
                  <span className="font-semibold">{price === 0 ? <span className="text-sage">Offert</span> : euro(price)}</span>
                </label>
              );
            })}
            {ship === "relais" && <input placeholder="Code postal du point relais" className={input} />}
            {ship === "domicile" && <input placeholder="Adresse de livraison" className={input} />}
          </fieldset>

          <fieldset className="space-y-3">
            <legend className="mb-2 font-display text-2xl font-medium">Paiement</legend>
            <div className="grid grid-cols-3 gap-2">
              <button type="button" className="btn-soft px-2">Apple Pay</button>
              <button type="button" className="btn-soft px-2">Google Pay</button>
              <button type="button" className="btn-soft px-2">PayPal</button>
            </div>
            <input disabled placeholder="Numéro de carte" className={`${input} bg-muted`} />
            <div className="grid grid-cols-2 gap-3">
              <input disabled placeholder="MM / AA" className={`${input} bg-muted`} />
              <input disabled placeholder="Code" className={`${input} bg-muted`} />
            </div>
            <p className="text-sm text-muted-foreground">Vos données bancaires ne passent jamais par notre site : c'est Stripe qui s'en occupe.</p>
          </fieldset>

          <label className="flex cursor-pointer items-start gap-3">
            <input type="checkbox" checked={cgv} onChange={(e) => setCgv(e.target.checked)} className="mt-1 h-5 w-5 accent-[var(--foreground)]" />
            <span>J'ai lu les <Link to="/legal/$page" params={{ page: "cgv" }} className="underline">conditions générales de vente</Link></span>
          </label>
          <button type="submit" disabled={!cgv} className="btn-buy w-full text-xl disabled:cursor-not-allowed disabled:opacity-40">Payer {euro(grand)}</button>
          <p className="text-center text-sm text-muted-foreground">Une question avant de payer ? <a href="mailto:contact@grenouillerouge.com" className="underline">contact@grenouillerouge.com</a></p>
        </form>
      </div>
    </section>
  );
}
