// Photos envoyées par l'atelier (hébergées en ligne). Pour remplacer une photo : changer le nom de fichier ici ou dans products.ts.
const files = import.meta.glob<{ url: string }>("../assets/photos/*.asset.json", { eager: true, import: "default" });

const map: Record<string, string> = {};
for (const [path, a] of Object.entries(files)) map[path.split("/").pop()!.replace(".asset.json", "")] = a.url;

/** URL d'une photo par son nom de fichier (ex. "ambiance-trio-canape.jpg"). */
export const ph = (name: string): string | undefined => map[name];
