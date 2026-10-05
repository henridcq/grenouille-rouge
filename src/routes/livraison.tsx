import { createFileRoute } from "@tanstack/react-router";
import { Pictos } from "@/components/shop/Reassurance";

export const Route = createFileRoute("/livraison")({
  head: () => ({
    meta: [
      { title: "Livraison offerte en point relais dès 39 € · Grenouille Rouge" },
      { name: "description", content: "Délais, frais de port, retours sous 14 jours, emballage cadeau offert. Tout ce qu'il faut savoir avant de commander." },
      { property: "og:title", content: "Livraison offerte en point relais dès 39 € · Grenouille Rouge" },
      { property: "og:description", content: "Délais, frais de port, retours sous 14 jours, emballage cadeau offert." },
    ],
  }),
  component: Livraison,
});

function Livraison() {
  return (
    <div className="mx-auto max-w-3xl space-y-8 px-4 pt-8 text-lg">
      <h1 className="text-3xl font-medium md:text-4xl">Livraison et retours</h1>
      <section>
        <h2 className="text-2xl font-medium">Quand est-ce que ça part ?</h2>
        <p className="mt-2">Les pièces en stock partent sous 48 h ouvrées. Les pièces personnalisées sont peintes à la commande : comptez 8 jours ouvrés avant l'expédition. Vous recevez un email avec le suivi dès que le colis quitte l'atelier.</p>
      </section>
      <section>
        <h2 className="text-2xl font-medium">Combien ça coûte ?</h2>
        <ul className="mt-2 list-disc space-y-1 pl-6">
          <li>Point relais (Colissimo ou Mondial Relay) : <strong>offert dès 39 €</strong>, sinon 3,90 €. Compter 2 à 4 jours après l'expédition.</li>
          <li>À domicile (Colissimo) : 6,90 €, offert dès 90 €. Compter 2 à 3 jours.</li>
          <li>Retrait à l'atelier, à Grémonville : gratuit, sur rendez-vous. On vous appelle quand c'est prêt.</li>
          <li>Belgique, Suisse, Europe : calculé au panier.</li>
        </ul>
      </section>
      <section>
        <h2 className="text-2xl font-medium">Et si je veux l'offrir ?</h2>
        <p className="mt-2">Cochez « C'est un cadeau » dans le panier : on emballe, on glisse votre petit mot écrit à la main, et on n'imprime pas le prix. On peut aussi l'envoyer directement chez la personne.</p>
      </section>
      <section id="retours" className="scroll-mt-32">
        <h2 className="text-2xl font-medium">Et si ça ne convient pas ?</h2>
        <p className="mt-2">Une pièce personnalisée est faite pour vous seul : elle n'est ni reprise ni échangée (c'est prévu par la loi, et c'est logique : personne d'autre ne s'appelle comme vous). Pour les autres pièces, vous avez 14 jours après réception pour changer d'avis : renvoyez-la neuve, complète, dans son emballage d'origine, à vos frais. On rembourse sous 14 jours après réception du retour, par le même moyen de paiement. Un défaut qui vient de nous ? On refait le sac, à nos frais, point.</p>
      </section>
      <section>
        <h2 className="text-2xl font-medium">Une question ?</h2>
        <p className="mt-2"><a href="mailto:contact@grenouillerouge.com" className="underline">contact@grenouillerouge.com</a>. C'est Marie-Isabel qui répond, en général le jour même, sauf quand elle a les mains dans la peinture.</p>
      </section>
      <div className="pt-6"><Pictos /></div>
    </div>
  );
}
