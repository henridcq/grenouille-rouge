// Contenus de la page cachée /textes (questionnaire « les textes du site » pour Marie-Isabel).

export type Versions = { id: string; title: string; question: string; slot: "titre" | "sousTitre" | "bouton" | "bandeau" | "signature"; versions: string[] };

export const TON = [
  { label: "A · Sobre et chic", text: "Votre prénom, peint à la main. Choisissez la forme, l'anse et la couleur. Nous peignons au pochoir et cousons dans notre atelier de Grémonville. Expédié sous 8 jours." },
  { label: "B · Chaleureuse", text: "À votre prénom, à votre mot, à votre idée. Choisissez la forme, l'anse, la couleur, et écrivez ce que vous voulez. On le peint au pochoir, à la main, et on vous l'expédie sous 8 jours." },
  { label: "C · Avec de l'humour", text: "Les trésors de Maëlle. Le bazar de Papa. Les chaussettes orphelines. Écrivez ce que vous voulez, on le peint à la main. Même les fautes d'orthographe, si vous insistez." },
];

export const HUMOUR = ["Pas du tout, je veux faire sérieux", "Un clin d'œil par page", "Partout, c'est ma marque"];

export const PHRASES = [
  "Un sac qui a du chien !",
  "Petits par la taille. Pas par le caractère.",
  "Fabriqué dans notre atelier (bien rangé) en Normandie.",
  "Chez la Grenouille, rien ne se perd, tout se transforme.",
  "Chez nous la grenouille, on ne la mange pas, on la protège !",
  "Le savoir-faire se fabrique, mais il se transmet aussi.",
  "À offrir… ou pas.",
  "Un cuir qui va vivre, se patiner, et raconter votre histoire.",
];

export const MOTS = ["artisanal", "fait main", "atelier", "Normandie", "Grémonville", "jute", "lin", "pochoir", "peint à la main", "cousu main", "série limitée", "pièce unique", "trésors", "bazar", "barda", "fourbi", "durable", "authentique", "chic", "élégant", "luxe", "premium", "créatrice", "savoir-faire", "made in France", "local", "cadeau", "personnalisé", "unique", "caractère"];

export const CLES: Versions[] = [
  { id: "2.1", slot: "titre", title: "Le grand titre de l'accueil", question: "Quel grand titre pour l'accueil ?", versions: ["Des paniers en jute qui ont des choses à dire.", "Votre prénom, peint à la main sur de la jute normande.", "Le bazar de Jules. Les trésors de Louise. Et le vôtre ?", "Son prénom, peint à la main."] },
  { id: "2.2", slot: "sousTitre", title: "La phrase sous le titre", question: "Quelle phrase juste sous le titre ?", versions: ["Cousus, peints au pochoir et personnalisés à votre prénom, dans notre atelier de Grémonville, en Normandie. Depuis 2000.", "Choisissez la forme et la couleur, écrivez un prénom : nous le peignons à la main, dans notre atelier normand.", "Un atelier, deux paires de mains, et plus de vingt-cinq ans de jute peinte au pochoir."] },
  { id: "2.3", slot: "bouton", title: "Le bouton principal", question: "Que dit le gros bouton rouge ?", versions: ["Créer mon Rond XL · 56 €", "Je personnalise", "Créer le mien", "Écrire mon prénom"] },
  { id: "2.4", slot: "bandeau", title: "Le bandeau du haut", question: "Que dit le bandeau rouge tout en haut ?", versions: ["Cousu et peint à la main en Normandie · Livraison offerte en point relais dès 39 € · Expédié sous 48 h", "Livraison offerte en point relais dès 39 €", "Peint à la main à Grémonville · Expédié sous 8 jours, même à Noël"] },
  { id: "2.5", slot: "signature", title: "La signature", question: "La signature du bas de page (et sous le logo dans les emails) ?", versions: ["Chez nous la grenouille, on ne la mange pas, on la protège.", "Cousu et peint à la main en Normandie, depuis 2000.", "Fabriqué dans notre atelier (bien rangé) en Normandie."] },
];

export const HISTOIRE = [
  { photo: "cuirs", q: "Pourquoi « Grenouille Rouge » ? Raconte-le comme à une cliente au marché.", aide: "Le surnom, Rojo, l'espèce protégée… ce qui est vrai, et comment tu le racontes." },
  { photo: "trioRonds", q: "Ton tout premier sac, en 2000 : c'était quoi, pour qui, et pourquoi ce jour-là ?", aide: "Un détail suffit : la toile, la personne, ce qu'elle a dit." },
  { photo: "hero", q: "Le plus beau, le plus drôle ou le plus touchant texte qu'une cliente t'a demandé de peindre.", aide: "Le texte exact, et l'histoire derrière si tu la connais." },
  { photo: "carreSalon", q: "La commande dont tu es la plus fière.", aide: "Pour qui, combien de pièces, ce qui était difficile." },
  { photo: "etiquette", q: "Bénédicte : qu'est-ce qu'elle fait à l'atelier, et qu'est-ce qu'elle fait mieux que personne ? Et Lorenzo ?", aide: "Une phrase sur chacun suffit, mais une vraie." },
  { photo: "cuirs", q: "Raconte une journée à l'atelier, du café du matin au dernier sac emballé.", aide: "Ce qu'on entend, ce qu'on sent, qui fait quoi." },
] as const;

export const VRAI_FAUX = [
  "Tu es tapissière de métier depuis 1996.",
  "La grenouille, c'est ton surnom, et Rouge, c'est la traduction de Rojo.",
  "La jute vient du Tissage du Ronchay, à Luneray, à vingt minutes de l'atelier : une entreprise familiale depuis 1845, le dernier tissage de jute de France.",
  "Les anses sont en cuir français au tannage végétal, sans chrome.",
  "Les pochoirs sont découpés au laser, les lettres posées et peintes à la main, puis la peinture est fixée à chaud.",
  "Plus de 800 clientes vous ont fait confiance en ligne.",
  "Lauréate des trophées de l'économie normande au salon du Made in France (2019), membre de l'ARSEN.",
  "Tes sacs sont vendus chez une cinquantaine de revendeurs indépendants, et dans les ateliers de Saint James.",
  "Les toiles d'ombrage de Socotex (Honfleur) deviennent des trousses, les sacs de café de Vert-tiges (Fécamp) deviennent des sacs.",
  "Deux fois par an, l'atelier ouvre ses portes pour les « trésors de l'atelier » (prototypes et fins de série).",
  "C'est toi qui réponds aux emails, en général le jour même.",
];

/** Textes du copy deck, corrigés d'après le catalogue actuel (dimensions, couleurs, règles du texte). */
export const FICHES: { slug: string; name: string; text: string }[] = [
  { slug: "le-rond-xl", name: "Le Rond XL", text: "Quarante centimètres de haut, quarante de large : le Rond XL est notre panier le plus demandé, et de loin. Les jouets de Léo, les trésors de Solveig, le barda de Papa, le linge de toute la famille. En toile de jute tissée au Ronchay, doublé, surpiqué et peint au pochoir dans notre atelier de Grémonville. Il tient debout tout seul, même vide. Et il tiendra des années.\n\nCe que vous choisissez : l'anse (à pois, à étoiles ou en corde de chanvre), une seule couleur pour tout le panier (le texte, le feston cousu main et les motifs de l'anse) parmi 19, et votre texte : jusqu'à 3 lignes de 13 caractères, en majuscules.\n\nH 40 · Ø 40 cm · jute, doublure coton · un coup d'éponge humide, pas de machine." },
  { slug: "au-coin-du-feu", name: "Au coin du feu", text: "Le classique de l'atelier, celui que les boutiques nous redemandent chaque automne. Même toile, même sangle, même solidité que Chauffe Marcel, avec son message peint en orange, en blanc, en vert ou en violet. Il transporte les bûches, puis les plaids, les jouets, les magazines. Un sac pour la cheminée, qui finit souvent dans le salon.\n\nH 40 · fond 40 × 60 cm · jute, sangle, ficelle." },
  { slug: "le-cabas-personnalisable", name: "Le cabas personnalisable", text: "Pour le marché, la plage, l'école. Avec votre mot dessus. Toile de jute tissée au Ronchay, anses en cuir au tannage végétal, peint au pochoir et cousu dans notre atelier de Grémonville.\n\nCe que vous choisissez : une couleur parmi 8 (noir, rouge, fuchsia, bleu jean, orange, jaune, cognac, chocolat) ; le cuir des anses, le texte et le feston sont assortis. Et votre texte : jusqu'à 3 lignes de 13 caractères, en majuscules.\n\nH 36 · L 40 · P 15 cm · anses 42 cm · jute, cuir · éponge humide." },
  { slug: "etoile-ou-coeur", name: "Étoile ou cœur", text: "Un appliqué en cuir doré, cousu à la main. Une étoile, ou un cœur : à vous de dire. Panier-cabas en jute tissée en Normandie, anses en cuir au tannage végétal. L'appliqué est découpé et posé à la main : chaque pièce est unique. Notre quatrième meilleure vente, et le cadeau le plus sûr qu'on connaisse.\n\n30 × 40 cm · anses 42 cm · jute, cuir." },
  { slug: "chauffe-marcel", name: "Chauffe Marcel", text: "Un sac à bûches qui a du chien. Toile de jute épaisse, doublée, surpiquée à la ficelle, une sangle de tapissier qui fait tout le tour pour porter lourd sans broncher. « Chauffe Marcel » peint au pochoir, à la main. Il porte le bois, il reste près du poêle, et il fait sourire tout l'hiver.\n\nH 40 · fond 40 × 60 cm · jute, sangle, ficelle · pas de traitement anti-feu : on le tient à distance des flammes." },
  { slug: "le-petit-classique", name: "Le Petit classique", text: "Le cabas en jute de tous les jours. Choisissez la couleur des anses, le reste est déjà parfait. Toile de jute, anses en cuir au tannage végétal en rouge, cognac, orange, bleu, noir, fuchsia, jaune ou chocolat. Pour les courses, la ville, la plage, et toutes les fois où on ne sait pas quel sac prendre.\n\n30 × 40 cm · jute, cuir." },
  { slug: "multi-teckels", name: "Multi-Teckels", text: "Des teckels peints un par un. Aucun ne ressemble à son voisin. Petit cabas en jute tissée en Normandie, entièrement doublé, anses en cuir rivées. Chaque teckel est peint à la main à la peinture textile, fixée à chaud. Le format idéal pour le marché, ou pour le bureau quand on a un teckel à la maison.\n\n27 × 30 cm · jute, cuir." },
  { slug: "multi-homards", name: "Multi homards", text: "Rouge, rose ou bleu : les homards de l'été, peints à la main. Un petit cabas en jute doublé, anses en cuir français au tannage végétal. Chaque homard est peint un par un dans l'atelier. Il va à la plage, au marché, et il fait parler.\n\n25 × 30 cm · jute, cuir." },
  { slug: "le-loom", name: "Le Loom", text: "Le sac à main qui n'a pas besoin d'en faire trop. Toile de jute naturelle bordée de noir, anses en cuir au tannage végétal : le Loom se porte à l'épaule ou à la main, du bureau au marché, sans jamais détonner. Cousu dans notre atelier de Grémonville, à la commande. Il fait partie de ces sacs qu'on finit par porter tous les jours sans l'avoir décidé.\n\n30 × 27 × 16 cm · jute, cuir · éponge humide." },
  { slug: "la-parisienne", name: "La Parisienne", text: "Un grand cabas en lin enduit, réversible, cousu en Normandie. Le reste est une question d'allure. Quarante centimètres de haut, cinquante de large, et deux anses en cuir chocolat au tannage végétal, interchangeables. Lin enduit d'un côté, lin naturel de l'autre : retournez-le selon l'humeur. Fabriquée en série limitée à l'atelier. Elle va au travail, à la plage et en week-end, et elle y va longtemps.\n\n40 × 50 × 11 cm · lin enduit, lin, cuir · éponge humide." },
];

/** FAQ du copy deck, corrigée : texte en MAJUSCULES, une seule couleur, trousse ajoutée. */
export const FAQ: { q: string; a: string }[] = [
  { q: "Le texte est-il vraiment peint à la main ?", a: "Oui. Il est peint à la main, au pochoir, à la peinture textile, puis fixé à chaud. C'est ce qui lui donne ce grain, et c'est pour ça qu'il n'y en a pas deux pareils." },
  { q: "Est-ce que la peinture tient ?", a: "Oui. Fixée à chaud, elle résiste aux années, aux enfants et aux chiens. Elle n'aime que la machine à laver : un coup d'éponge humide suffit." },
  { q: "Combien de lettres je peux mettre ?", a: "Jusqu'à trois lignes de 13 caractères, espaces compris. Le texte est peint en MAJUSCULES uniquement, accents et chiffres compris. Le configurateur vous le montre en direct." },
  { q: "C'est quoi, le feston ?", a: "Le point cousu à la main qui borde le haut du panier. Il est de la même couleur que le texte et les motifs de l'anse : une seule couleur pour tout le sac, parmi 19." },
  { q: "Je peux choisir la police ?", a: "Non : une seule police de pochoir, celle de l'atelier. C'est elle qui fait qu'on reconnaît un panier Grenouille Rouge." },
  { q: "Je peux écrire ce que je veux ?", a: "Prénoms, surnoms, phrases, blagues, noms de chien : oui. En majuscules, accents et chiffres compris. On respecte votre orthographe." },
  { q: "Le panier tient-il debout ?", a: "Oui, même vide. La toile est doublée et surpiquée : il garde sa forme." },
  { q: "D'où vient la jute ?", a: "Du Tissage du Ronchay, à Luneray, le dernier tissage de jute de France, à vingt minutes de l'atelier." },
  { q: "Et le cuir ?", a: "Un cuir français au tannage végétal, sans chrome. Il se patine, il vit avec vous." },
  { q: "Est-ce que je peux venir à l'atelier ?", a: "Sur rendez-vous, pour retirer une commande. Et deux fois par an, on ouvre grand les portes pour les « trésors de l'atelier » : suivez-nous sur Instagram pour la date." },
  { q: "Vous faites des commandes pour les entreprises et les boutiques ?", a: "Oui, en série, à votre nom ou à votre logo. Rendez-vous sur l'Espace pro." },
  { q: "Vous personnalisez aussi les trousses ?", a: "Oui, la trousse en lin : 7 lettres maximum." },
];
