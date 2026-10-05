import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { Configurator } from "@/components/shop/Configurator";
import type { FormatId } from "@/data/products";

const ids = ["bb-rond", "rond", "rond-xl", "carre", "carre-xxl", "cabas", "vide-poches"] as const;

export const Route = createFileRoute("/composer")({
  validateSearch: z.object({ forme: z.enum(ids).optional(), prenom: z.string().max(40).optional(), couleur: z.string().max(40).optional() }),
  head: () => ({
    meta: [
      { title: "Composez votre panier personnalisé · Grenouille Rouge" },
      { name: "description", content: "Forme, anse, couleurs et texte : composez votre panier en jute, peint à la main au pochoir à Grémonville. Expédié sous 8 jours." },
      { property: "og:title", content: "Composez votre panier personnalisé · Grenouille Rouge" },
      { property: "og:description", content: "Une forme, une anse, vos couleurs et un mot. L'aperçu se met à jour sous vos yeux." },
    ],
  }),
  component: Page,
});

function Page() {
  const { forme, prenom, couleur } = Route.useSearch();
  return <Configurator initial={(forme ?? "rond-xl") as FormatId} prenom={prenom} couleur={couleur} />;
}
