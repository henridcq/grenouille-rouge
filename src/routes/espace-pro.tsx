import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/espace-pro")({
  head: () => ({
    meta: [
      { title: "Sacs et paniers personnalisés pour entreprises et boutiques, made in Normandie" },
      { name: "description", content: "Cadeaux d'entreprise, séries à votre logo, revendeurs. Fabrication à Grémonville, devis sous 48 h." },
      { property: "og:title", content: "Espace pro · Grenouille Rouge" },
      { property: "og:description", content: "Cadeaux d'entreprise, séries à votre logo, revendeurs. Fabrication à Grémonville." },
    ],
  }),
  component: () => (
    <div className="mx-auto max-w-2xl px-4 pt-12">
      <h1 className="text-4xl font-bold md:text-5xl">Boutiques, hôtels, entreprises</h1>
      <p className="mt-5 text-lg">
        Depuis plus de vingt ans, nous cousons et peignons aussi pour les professionnels : séries pour les boutiques indépendantes, cadeaux d'entreprise à votre logo, paniers au nom de votre hôtel ou de votre maison. Même atelier, mêmes mains, même jute normande. Un espace dédié, avec le catalogue revendeur et les devis en ligne, arrive bientôt. En attendant, écrivez-nous à <a href="mailto:contact@grenouillerouge.com" className="underline">contact@grenouillerouge.com</a> : on vous répond sous 48 h.
      </p>
    </div>
  ),
});
