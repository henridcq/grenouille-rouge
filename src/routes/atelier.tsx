import { createFileRoute, Link } from "@tanstack/react-router";
import { PHOTOS } from "@/data/products";
import { ProductImage } from "@/components/shop/ProductImage";
import { Reveal } from "@/components/shop/Reveal";

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
  ["Marie-Isabel", "Tapissière de métier depuis 1996, Marie-Isabel Rojo passe ses journées dans la toile de jute, le chanvre et le lin, à refaire des sièges. Un jour, elle détourne la toile de son usage et coud son premier sac. Puis un deuxième. En 2016, elle dépose la marque. Le nom ? La grenouille, c'est son surnom. Rouge, c'est la traduction de Rojo. Et la grenouille rouge est une espèce en voie de disparition, comme le savoir-faire qu'elle défend. Chez nous, la grenouille, on ne la mange pas. On la protège."],
  ["Bénédicte, et la relève", "Bénédicte rejoint l'atelier en 2018. Depuis, chaque pièce passe par leurs quatre mains. À l'automne 2026, Lorenzo, formé dans la filière Mode & Luxe, s'est installé derrière la machine. Parce que le savoir-faire se fabrique, mais il se transmet aussi."],
  ["La jute vient d'à côté", "Notre toile de jute et notre lin sont tissés au Tissage du Ronchay, à Luneray, à vingt minutes de l'atelier. Une entreprise familiale depuis 1845, le dernier tissage de jute de France, et le premier à qui Marie-Isabel a acheté sa toile. La Normandie est la première région productrice de lin au monde ; on aurait eu tort d'aller chercher plus loin."],
  ["Le cuir, le pochoir, la peinture", "Les anses sont en cuir français au tannage végétal : un cuir tanné aux écorces et aux feuilles, sans chrome, qui se patine et vit avec vous. Les messages sont peints au pochoir, à la peinture textile, puis fixés à chaud. Les pochoirs sont découpés au laser, les lettres sont posées à la main. C'est pour ça qu'il n'y a jamais deux sacs pareils."],
  ["Rien ne se perd", "Les chutes de coton deviennent des appliqués. Les chutes de cuir deviennent des languettes. Les toiles d'ombrage de Socotex, à Honfleur, deviennent des trousses et des cabas. Les sacs de café de Vert-tiges, à Fécamp, deviennent des sacs tout court. Et deux fois par an, l'atelier ouvre ses portes pour vendre ses prototypes et ses fins de série : on appelle ça les trésors de l'atelier."],
  ["Ce qu'on en dit", "Lauréate des trophées de l'économie normande au salon du Made in France (2019). Membre de l'ARSEN, l'Association régionale des savoir-faire d'excellence normands. En boutique chez une cinquantaine de revendeurs indépendants, et dans les ateliers de Saint James."],
  ["Venir à l'atelier", "1375 rue du Bois Tillant, 76970 Grémonville. Sur rendez-vous pour retirer une commande, et deux fois par an pour les trésors de l'atelier."],
];

const imgs = [PHOTOS.atelier, PHOTOS.jute, PHOTOS.ambiance];

function Atelier() {
  return (
    <div className="mx-auto max-w-3xl px-4 pt-8">
      <h1 className="text-4xl font-bold leading-tight md:text-5xl">Un atelier au milieu des champs, et deux paires de mains.</h1>
      <p className="mt-4 text-xl">Grenouille Rouge, c'est un atelier à Grémonville, dans le pays de Caux, entre Rouen et la mer. On y coupe, on y coud, on y peint. Depuis 2000.</p>
      <ProductImage src={PHOTOS.atelier} name="Marie-Isabel et Bénédicte à l'atelier" alt="Marie-Isabel et Bénédicte dans l'atelier de Grémonville" className="mt-8 aspect-[4/3] w-full rounded-3xl" />
      {sections.map(([t, b], i) => (
        <Reveal key={t} className="mt-12">
          <h2 className="text-3xl font-bold">{t}</h2>
          <p className="mt-3 text-lg">{b}</p>
          {i === 2 && <ProductImage src={imgs[1]} name="Le travail de la toile de jute" alt="Toile de jute travaillée à l'atelier" className="mt-6 aspect-[4/3] w-full rounded-3xl" />}
          {i === 4 && <ProductImage src={imgs[2]} name="Sacs et cabas de l'atelier" alt="Sacs et cabas Grenouille Rouge à l'atelier" className="mt-6 aspect-[4/3] w-full rounded-3xl" />}
        </Reveal>
      ))}
      <Link to="/rayon/$rayon" params={{ rayon: "cabas" }} className="btn-soft mt-10">Voir la collection</Link>
    </div>
  );
}
