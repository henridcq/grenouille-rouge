import { createFileRoute, notFound } from "@tanstack/react-router";

const pages: Record<string, string> = {
  cgv: "Conditions générales de vente",
  "mentions-legales": "Mentions légales",
  confidentialite: "Politique de confidentialité",
};

export const Route = createFileRoute("/legal/$page")({
  loader: ({ params }) => {
    const title = pages[params.page];
    if (!title) throw notFound();
    return { title };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.title ?? "Page"} · Grenouille Rouge` },
      { name: "description", content: `${loaderData?.title ?? "Page"} de Grenouille Rouge, atelier à Grémonville.` },
      { property: "og:title", content: `${loaderData?.title ?? "Page"} · Grenouille Rouge` },
      { property: "og:description", content: "En cours de rédaction." },
    ],
  }),
  component: () => {
    const { title } = Route.useLoaderData();
    return (
      <div className="mx-auto max-w-2xl px-4 pt-12">
        <h1 className="text-3xl font-medium">{title}</h1>
        <p className="mt-4 text-lg text-muted-foreground">En cours de rédaction.</p>
      </div>
    );
  },
});
