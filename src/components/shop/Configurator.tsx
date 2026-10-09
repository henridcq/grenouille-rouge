import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import type { FormatId } from "@/data/products";
import { euro } from "@/data/products";
import {
  formats, formatOf, handles, palette, paletteCabas, models, textError, recap, MAX,
  type Color, type Handle, type CustomConfig,
} from "@/data/custom";
import { useCart } from "@/lib/cart";
import { ProductImage } from "./ProductImage";
import { BagPreview } from "./BagPreview";

function Swatches({ colors, value, onChange, label }: { colors: Color[]; value: Color; onChange: (c: Color) => void; label: string }) {
  return (
    <div role="radiogroup" aria-label={label} className="grid grid-cols-5 gap-x-1 gap-y-3 sm:grid-cols-7">
      {colors.map((c) => {
        const on = c.name === value.name;
        return (
          <button key={c.name} type="button" role="radio" aria-checked={on} onClick={() => onChange(c)} className="flex flex-col items-center gap-1 text-center">
            <span
              className={`grid h-10 w-10 place-items-center rounded-full ${on ? "ring-2 ring-foreground ring-offset-2 ring-offset-background" : ""} ${c.name === "Blanc" ? "border border-foreground/40" : ""}`}
              style={{ backgroundColor: c.hex }}
            >
              {on && <Check className="h-4 w-4" style={{ color: ["Blanc", "Bouton d'or", "Rose layette", "Ciel", "Gris", "Jaune"].includes(c.name) ? "#2B211B" : "#fff" }} />}
            </span>
            <span className="text-[0.72rem] leading-tight">{c.name}</span>
          </button>
        );
      })}
    </div>
  );
}

function Step({ n, title, help, children }: { n: number; title: string; help?: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3 border-t pt-6">
      <h2 className="flex items-baseline gap-3 text-2xl font-medium">
        <span className="font-sans text-base font-semibold text-muted-foreground">{n}</span>{title}
      </h2>
      {children}
      {help && <p className="text-[0.95rem] italic text-muted-foreground">{help}</p>}
    </section>
  );
}

const byName = (list: Color[], n: string) => list.find((c) => c.name === n)!;

export function Configurator({ initial = "rond-xl", lockCabas = false, prenom, couleur }: { initial?: FormatId; lockCabas?: boolean; prenom?: string | undefined; couleur?: string | undefined }) {
  const { add } = useCart();
  const [format, setFormat] = useState<FormatId>(lockCabas ? "cabas" : initial);
  const [handle, setHandle] = useState<Handle>("etoiles");
  const [color, setColor] = useState<Color>(palette.find((c) => c.name === couleur) ?? byName(palette, "Bleu cobalt"));
  const [cabasColor, setCabasColor] = useState<Color>(byName(paletteCabas, "Cognac"));
  const [lines, setLines] = useState<string[]>(prenom ? [prenom.slice(0, MAX).toUpperCase(), "", ""] : ["LES TRÉSORS", "DE MAËLLE", ""]);
  const [checked, setChecked] = useState(false);
  const [small, setSmall] = useState(false);

  useEffect(() => { if (!lockCabas) setFormat(initial); }, [initial, lockCabas]);
  useEffect(() => {
    const onScroll = () => setSmall(window.scrollY > 140);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const f = formatOf(format);
  const isCabas = format === "cabas";
  const err = textError(lines);
  const tColor = isCabas ? cabasColor : color;
  const config: CustomConfig = isCabas
    ? { format, textColor: cabasColor, festonColor: cabasColor, single: true, lines }
    : { format, handle, handleColor: handle === "corde" ? undefined : color, textColor: color, festonColor: color, lines };

  const setLine = (i: number, v: string) => { setChecked(false); setLines((ls) => ls.map((l, j) => (j === i ? v.toUpperCase() : l))); };

  const preview = (
    <figure>
      <BagPreview format={format} color={tColor} lines={lines} small={small}
        className={`mx-auto rounded-none ${small ? "h-36 w-36 md:aspect-square md:h-auto md:w-full" : "aspect-square w-full max-w-[22rem] md:max-w-none"}`} />
      <figcaption className={`mx-auto mt-2 max-w-md text-center text-sm italic text-muted-foreground ${small ? "hidden md:block" : ""}`}>
        Aperçu indicatif : la peinture à la main a ses humeurs, c'est ce qui fait qu'il n'y en aura pas deux pareils.
        <span className="mt-1 block not-italic">coutures et feston à la couleur de la peinture</span>
      </figcaption>
    </figure>
  );

  return (
    <div className="mx-auto max-w-6xl px-4 md:grid md:grid-cols-[1fr_1.1fr] md:gap-10 md:pt-8">
      {/* Aperçu toujours visible */}
      <div className="sticky top-0 z-30 -mx-4 border-b bg-background/95 px-4 py-3 backdrop-blur md:top-36 md:mx-0 md:h-fit md:border-0 md:bg-transparent md:p-0">
        {preview}
      </div>

      <div className="space-y-6 pb-10 pt-6 md:pt-0">
        <header>
          <h1 className="text-3xl font-medium md:text-4xl">{lockCabas ? "Cabas personnalisé" : "Composez le vôtre."}</h1>
          <p className="mt-2 text-lg text-muted-foreground">
            {lockCabas
              ? "Un cabas en jute à votre mot, peint à la main en Normandie. Pour le marché, la plage, l'école, la vie."
              : "Une forme, une anse, vos couleurs et un mot. L'aperçu se met à jour sous vos yeux."}
          </p>
        </header>

        {!lockCabas && (
          <Step n={1} title="Quelle taille ?" help="Un doute ? Le Rond XL est celui qu'on vend le plus.">
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {formats.map((x) => (
                <button key={x.id} type="button" onClick={() => setFormat(x.id)} aria-pressed={format === x.id}
                  className={`flex items-center gap-2 rounded-none border-2 bg-card p-2 text-left ${format === x.id ? "border-foreground" : "border-transparent"}`}>
                  <ProductImage src={x.image} name={x.label} alt={`Panier ${x.label} en jute`} className="h-12 w-12 shrink-0 rounded-none" />
                  <span className="min-w-0">
                    <span className="block font-semibold leading-tight">{x.label}</span>
                    <span className="text-sm font-semibold">{x.price} €</span>
                  </span>
                </button>
              ))}
            </div>
          </Step>
        )}

        {!isCabas && (
          <Step n={2} title="Quelle anse ?" help="La corde pour le côté brut, les pois et les étoiles pour les chambres d'enfants. Ou l'inverse, c'est vous qui voyez.">
            <div className="grid grid-cols-3 gap-2">
              {handles.map((h) => (
                <button key={h.id} type="button" onClick={() => setHandle(h.id)} aria-pressed={handle === h.id}
                  className={`overflow-hidden rounded-none border-2 bg-card text-center ${handle === h.id ? "border-foreground" : "border-transparent"}`}>
                  <ProductImage src={h.photo} name={h.label} alt={`Anse ${h.label.toLowerCase()}`} className="aspect-square w-full text-sm" />
                  <span className="block p-2 text-sm font-semibold leading-tight">{h.label}</span>
                </button>
              ))}
            </div>
          </Step>
        )}

        {isCabas ? (
          <Step n={lockCabas ? 1 : 2} title="Quelle couleur ?" help="Une couleur, et on s'occupe du reste : le cuir des anses, le texte et le feston seront assortis.">
            <Swatches colors={paletteCabas} value={cabasColor} onChange={setCabasColor} label="Couleur du cabas" />
            <p className="text-sm text-muted-foreground">Feston et coutures assortis à la peinture.</p>
          </Step>
        ) : (
          <Step n={3} title="Quelle couleur ?" help="Une couleur pour tout le sac : le texte, le feston et les pois ou les étoiles de l'anse.">
            <Swatches colors={palette} value={color} onChange={setColor} label="Couleur du sac" />
            <p className="text-sm text-muted-foreground">Feston et coutures assortis à la peinture.</p>
          </Step>
        )}

        <Step n={isCabas ? (lockCabas ? 2 : 3) : 4} title="Qu'est-ce qu'on écrit ?" help="En majuscules, accents compris. On respecte votre orthographe, même créative.">
          <div className="flex flex-wrap gap-2">
            {models.map((m) => (
              <button key={m.label} type="button" onClick={() => { setChecked(false); setLines(m.lines.map((l) => l.toUpperCase())); }} className="rounded-none border bg-card px-3 py-1.5 text-[0.95rem] font-medium hover:border-foreground">
                {m.label}
              </button>
            ))}
          </div>
          <p className="text-sm text-muted-foreground">Votre texte : 3 lignes maximum, 13 caractères par ligne, espaces compris.</p>
          <div className="space-y-2">
            {lines.map((l, i) => (
              <label key={i} className="block">
                <div className="flex items-center gap-2">
                  <input value={l} onChange={(e) => setLine(i, e.target.value)} aria-label={`Ligne ${i + 1}`}
                    className={`font-stencil h-13 w-full rounded-none border bg-card px-4 text-xl uppercase ${l.length > MAX ? "border-primary" : ""}`} />
                </div>
                <span className={`mt-0.5 block text-sm ${l.length > MAX ? "font-semibold text-foreground underline" : "text-muted-foreground"}`}>Ligne {i + 1} : {l.length}/{MAX}</span>
              </label>
            ))}
          </div>
          {err && <p role="alert" className="rounded-none bg-muted px-4 py-3 font-medium">{err}</p>}
        </Step>

        <section className="space-y-4 rounded-none border bg-card p-5">
          <p className="text-lg">
            {recap(config)} · <strong>{f.price} €</strong> · expédié sous 8 jours ouvrés.
          </p>
          <label className="flex cursor-pointer items-start gap-3">
            <input type="checkbox" checked={checked} onChange={(e) => setChecked(e.target.checked)} className="mt-1 h-5 w-5 accent-[var(--foreground)]" />
            <span className="font-medium">J'ai relu mon texte : il sera peint tel quel.</span>
          </label>
          <button type="button" disabled={!checked || !!err} onClick={() => { add(f.slug, { ...config, lines: [...lines] }); setChecked(false); }}
            className="btn-buy w-full text-lg disabled:cursor-not-allowed disabled:opacity-40 disabled:filter-none">
            Ajouter au panier · {euro(f.price)}
          </button>
          <p className="text-center text-sm text-muted-foreground">Personnalisé pour vous, donc ni repris ni échangé. Si l'erreur vient de nous, on refait.</p>
        </section>
      </div>
    </div>
  );
}
