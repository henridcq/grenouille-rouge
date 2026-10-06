import { createFileRoute, Link } from "@tanstack/react-router";
import { PHOTOS } from "@/data/products";
import { ProductImage } from "@/components/shop/ProductImage";
import { Reveal } from "@/components/shop/Reveal";
import { PREMIER_SAC } from "@/data/site-texts";

export const Route = createFileRoute("/atelier")({
  head: () => ({
    meta: [
      { title: "L'atelier Grenouille Rouge à Grémonville : qui coud vos sacs" },
      { name: "description", content: "Marie-Isabel, Bénédicte, la jute du Ronchay et le cuir végétal. L'histoire d'un atelier normand depuis 2000." },
      { property: "og:title", content: "L'atelier Grenouille Rouge à Grémonville : qui coud vos sacs" },
      { property: "og:description", content: "Marie-Isabel, Bénédicte, la jute du Ronchay et le cuir végétal. L'histoire d'un atelier normand depuis 2000." },
      { property: "og:image", content: PHOTOS.atelier },
      { name: "twitter:image", content: PHOTOS.atelier },
    ],
  }),
  component: Atelier,
});

const sections: [string, string][] = [
  ["Pourquoi Grenouille Rouge", "La grenouille rouge, espèce protégée, correspond bien à notre univers : préserver les matières, les savoir-faire, et fabriquer autrement. Avec un peu d'humour, évidemment : c'est aussi un clin d'œil au surnom des Français. Mais chez nous, la grenouille, on ne la mange pas, on la protège !"],
  ["Le premier sac", PREMIER_SAC],
  ["La jute vient d'à côté", "Notre toile de jute et notre lin sont tissés au Tissage du Ronchay, à Luneray, à vingt minutes de l'atelier. Une entreprise familiale depuis 1845, le dernier tissage de jute de France, et le premier à qui Marie-Isabel a acheté sa toile. La Normandie est la première région productrice de lin au monde ; on aurait eu tort d'aller chercher plus loin."],
  ["Le cuir, le pochoir, la peinture", "Les anses sont en cuir français au tannage végétal : un cuir tanné aux écorces et aux feuilles, sans chrome, qui se patine et vit avec vous. Nous utilisons deux sortes de pochoirs : ceux que nous dessinons à l'atelier, et des lettres traditionnelles en aluminium. Chaque lettre est posée et peinte à la main, puis la peinture est fixée à chaud. C'est pour ça qu'il n'y a jamais deux sacs pareils."],
  ["Rien ne se perd", "Les chutes de coton deviennent des appliqués. Les chutes de cuir deviennent des languettes. Les toiles d'ombrage de Socotex, à Honfleur, deviennent des trousses et des cabas. Les sacs de café de Vert-tiges, à Fécamp, deviennent des sacs tout court. Et deux fois par an, l'atelier ouvre ses portes pour vendre ses prototypes et ses fins de série : on appelle ça les trésors de l'atelier."],
  ["Ce qu'on en dit", "Nous sommes fiers de notre collaboration avec Saint James, une maison historique du savoir-faire textile français. Lauréate des trophées de l'économie normande au salon du Made in France (2019). Membre de l'ARSEN, l'Association régionale des savoir-faire d'excellence normands. En boutique chez une cinquantaine de revendeurs indépendants, et dans les ateliers de Saint James."],
  ["Bénédicte, et la relève", "Bénédicte, c'est la couture dans le sang et le souci du détail, sans oublier ce petit grain de folie qui caractérise Grenouille Rouge. Et Lorenzo ? La relève arrive… et elle a du style !"],
  ["Une journée à l'atelier", "Chez Grenouille Rouge, ce n'est pas l'industrie textile telle qu'on l'imagine ! On commence par le café, indispensable. Puis les machines se mettent à ronronner, les idées fusent, les tissus passent de main en main : on coupe, on coud, on peint, on personnalise… avec quelques éclats de rire entre deux. Le soir, les derniers sacs sont emballés, prêts à partir vivre leur vie. Demain ? On recommence. Mais jamais tout à fait pareil."],
  ["Ce que vous nous demandez de peindre", "Il y en a tellement. Un sac pour pelotes de laine baptisé « Capitaine Crochet », une commande spéciale pour la tour Eiffel, des paniers écrits en coréen pour des amoureux de la France… Chaque pièce est unique, parce que chacune passe par nos mains."],
  ["Venir à l'atelier", "1375 rue du Bois Tillant, 76970 Grémonville. Sur rendez-vous pour retirer une commande, et deux fois par an pour les trésors de l'atelier."],
];

const imgs = [PHOTOS.atelier, PHOTOS.jute, PHOTOS.ambiance];

function Atelier() {
  return (
    <div className="mx-auto max-w-3xl px-4 pt-8">
      <h1 className="text-3xl font-medium leading-tight md:text-4xl">Un atelier au milieu des champs, et deux paires de mains.</h1>
      <p className="mt-3 font-display text-2xl">Un morceau de vie made in Normandie.</p>
      <p className="mt-4 text-xl">Grenouille Rouge, c'est un atelier à Grémonville, dans le pays de Caux, entre Rouen et la mer. On y coupe, on y coud, on y peint. Depuis 2000.</p>
      <ProductImage src={PHOTOS.atelier} name="Marie-Isabel et Bénédicte à l'atelier" alt="Marie-Isabel et Bénédicte dans l'atelier de Grémonville" className="mt-8 aspect-[4/3] w-full rounded-none" />
      {sections.map(([t, b], i) => (
        <Reveal key={t} className="mt-12">
          <h2 className="text-2xl font-medium">{t}</h2>
          <p className="mt-3 text-lg">{b}</p>
          {i === 2 && <ProductImage src={imgs[1]} name="Le travail de la toile de jute" alt="Toile de jute travaillée à l'atelier" className="mt-6 aspect-[4/3] w-full rounded-none" />}
          {i === 3 && <ProductImage src={PHOTOS.cuirs} name="Les cuirs de l'atelier" alt="Lanières de cuir bleu, rose, vert et cognac sur la toile de jute" className="mt-6 aspect-[4/3] w-full rounded-none" />}
          {i === 5 && <ProductImage src={PHOTOS.etiquette} name="Étiquette Made in France" alt="Étiquette Grenouille Rouge fabriqué en France cousue sur un panier" className="mt-6 aspect-[4/3] w-full rounded-none" />}
          {i === 4 && <ProductImage src={imgs[2]} name="Sacs et cabas de l'atelier" alt="Sacs et cabas Grenouille Rouge à l'atelier" className="mt-6 aspect-[4/3] w-full rounded-none" />}
        </Reveal>
      ))}
      <Link to="/rayon/$rayon" params={{ rayon: "cabas-sacs" }} className="btn-soft mt-10">Voir les cabas & sacs</Link>
    </div>
  );
}
