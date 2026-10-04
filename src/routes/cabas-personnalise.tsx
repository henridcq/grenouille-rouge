import { createFileRoute } from "@tanstack/react-router";
import { Configurator } from "@/components/shop/Configurator";

export const Route = createFileRoute("/cabas-personnalise")({
  head: () => ({
    meta: [
      { title: "Cabas en jute personnalisé, peint à la main en Normandie" },
      { name: "description", content: "Un cabas en toile de jute à votre mot ou prénom, peint au pochoir à l'atelier. Anses en cuir assorties, 8 couleurs. 59 €, expédié sous 8 jours." },
      { property: "og:title", content: "Cabas en jute personnalisé, peint à la main en Normandie" },
      { property: "og:description", content: "Un cabas en toile de jute à votre mot ou prénom, peint au pochoir à l'atelier. Anses en cuir assorties, 8 couleurs." },
    ],
  }),
  component: () => <Configurator lockCabas />,
});
