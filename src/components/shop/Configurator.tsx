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

function Swatches({ colors, value, onChange, label }: { colors: Color[]; value: Color; onChange: (c: Color) => void; label: string }) {
  return (
    <div role="radiogroup" aria-label={label} className="grid grid-cols-5 gap-x-1 gap-y-3 sm:grid-cols-7">
      {colors.map((c) => {
        const on = c.name === value.name;
        return (
          <button key={c.name} type="button" role="radio" aria-checked={on} onClick={() => onChange(c)} className="flex flex-col items-center gap-1 text-center">
            <span
              className={`grid h-10 w-10 place-items-center rounded-full transition ${on ? "ring-2 ring-foreground ring-offset-2 ring-offset-background" : ""} ${c.name === "Blanc" ? "border border-foreground/40" : ""}`}
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
      <h2 className="flex items-baseline gap-3 text-2xl font-bold">
        <span className="font-sans text-base font-semibold text-muted-foreground">{n}</span>{title}
      </h2>
      {children}
      {help && <p className="text-[0.95rem] italic text-muted-foreground">{help}</p>}
    </section>
  );
}

const byName = (list: Color[], n: string) => list.find((c) => c.name === n)!;

export function Configurator({ initial = "rond-xl", lockCabas = false }: { initial?: FormatId; lockCabas?: boolean }) {
  const { add } = useCart();
  const [format, setFormat] = useState<FormatId>(lockCabas ? "cabas" : initial);
  const [handle, setHandle] = useState<Handle>("etoiles");
  const [handleColor, setHandleColor] = useState<Color>(byName(palette, "Rouge"));
  const [textColor, setTextColor] = useState<Color>(byName(palette, "Bleu cobalt"));
  const [festonColor, setFestonColor] = useState<Color>(byName(palette, "Bleu jean"));
  const [cabasColor, setCabasColor] = useState<Color>(byName(paletteCabas, "Cognac"));
  const [lines, setLines] = useState<string[]>(["Les trésors", "de Maëlle", ""]);
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
  const tColor = isCabas ? cabasColor : textColor;
  const fColor = isCabas ? cabasColor : festonColor;
  const config: CustomConfig = isCabas
    ? { format, textColor: cabasColor, festonColor: cabasColor, single: true, lines }
    : { format, handle, handleColor: handle === "corde" ? undefined : handleColor, textColor, festonColor, lines };

  const setLine = (i: number, v: string) => { setChecked(false); setLines((ls) => ls.map((l, j) => (j === i ? v : l))); };
  const shown = lines.filter((l) => l.trim());

  const preview = (
    <figure>
      <div className={`relative mx-auto overflow-hidden rounded-3xl bg-card transition-all duration-300 ${small ? "h-36 w-36 md:h-auto md:w-full" : "aspect-square w-full max-w-[22rem] md:max-w-none"}`}>
        <ProductImage key={f.image} src={f.image} name={f.label} alt={`Aperçu : ${f.label} en jute avec votre texte peint en ${tColor.name.toLowerCase()}`} className="absolute inset-0 h-full w-full" />
        {/* Feston : petits traits cousus le long du bord supérieur */}
        <svg className="absolute inset-x-[8%] top-[9%] h-3 w-[84%]" viewBox="0 0 100 4" preserveAspectRatio="none" aria-hidden="true">
          <line x1="0" y1="2" x2="100" y2="2" stroke={fColor.hex} strokeWidth="1.6" strokeDasharray="2.2 1.6" />
        </svg>
        <div className="absolute inset-x-[10%] top-[30%] bottom-[22%] grid place-items-center">
          <div
            className="font-stencil text-center leading-[1.05] transition-colors"
            style={{ color: tColor.hex, fontSize: small ? "0.8rem" : "clamp(1.1rem, 6.2vw, 2.1rem)", textShadow: tColor.name === "Blanc" ? "0 0 2px rgba(0,0,0,.35)" : "none" }}
          >
            {shown.length ? shown.map((l, i) => <div key={i}>{l}</div>) : <span className="opacity-40">Votre texte</span>}
          </div>
        </div>
      </div>
      <figcaption className={`mx-auto mt-2 max-w-md text-center text-sm italic text-muted-foreground ${small ? "hidden md:block" : ""}`}>
        Aperçu indicatif : la peinture à la main a ses humeurs, c'est ce qui fait qu'il n'y en aura pas deux pareils.
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
          <h1 className="text-4xl font-bold md:text-5xl">{lockCabas ? "Cabas personnalisé" : "Composez le vôtre."}</h1>
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
                  className={`flex items-center gap-2 rounded-2xl border-2 bg-card p-2 text-left transition ${format === x.id ? "border-foreground" : "border-transparent"}`}>
                  <ProductImage src={x.image} name={x.label} alt={`Panier ${x.label} en jute`} className="h-12 w-12 shrink-0 rounded-xl" />
                  <span className="min-w-0">
                    <span className="block font-semibold leading-tight">{x.label}</span>
                    <span className="text-sm font-semibold text-primary">{x.price} €</span>
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
                  className={`overflow-hidden rounded-2xl border-2 bg-card text-center transition ${handle === h.id ? "border-foreground" : "border-transparent"}`}>
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
          </Step>
        ) : (
          <Step n={3} title="Quelles couleurs ?" help="Les trois couleurs sont indépendantes : assorties ou en contraste, c'est vous qui voyez.">
            {handle !== "corde" && (
              <div className="space-y-2">
                <p className="font-semibold">Les pois ou les étoiles de l'anse <span className="font-normal text-muted-foreground">· {handleColor.name}</span></p>
                <Swatches colors={palette} value={handleColor} onChange={setHandleColor} label="Couleur des pois ou des étoiles" />
              </div>
            )}
            <div className="space-y-2 pt-3">
              <p className="font-semibold">Le texte <span className="font-normal text-muted-foreground">· {textColor.name}</span></p>
              <Swatches colors={palette} value={textColor} onChange={setTextColor} label="Couleur du texte" />
            </div>
            <div className="space-y-2 pt-3">
              <p className="font-semibold">Le feston <span className="font-normal text-muted-foreground">· {festonColor.name}</span></p>
              <Swatches colors={palette} value={festonColor} onChange={setFestonColor} label="Couleur du feston" />
              <p className="text-sm italic text-muted-foreground">Le feston, c'est le point cousu à la main qui borde le haut du panier.</p>
            </div>
          </Step>
        )}

        <Step n={isCabas ? (lockCabas ? 2 : 3) : 4} title="Qu'est-ce qu'on écrit ?" help="Majuscules ou minuscules, accents compris. On respecte votre orthographe, même créative.">
          <div className="flex flex-wrap gap-2">
            {models.map((m) => (
              <button key={m.label} type="button" onClick={() => { setChecked(false); setLines(m.lines); }} className="rounded-full border bg-card px-3 py-1.5 text-[0.95rem] font-medium hover:border-foreground">
                {m.label}
              </button>
            ))}
          </div>
          <p className="text-sm text-muted-foreground">Votre texte (3 lignes maximum, 13 caractères par ligne, espaces compris. Une seule police de pochoir, celle de l'atelier : pas de choix de police)</p>
          <div className="space-y-2">
            {lines.map((l, i) => (
              <label key={i} className="block">
                <div className="flex items-center gap-2">
                  <input value={l} onChange={(e) => setLine(i, e.target.value)} aria-label={`Ligne ${i + 1}`}
                    className={`font-stencil h-13 w-full rounded-xl border bg-card px-4 text-xl ${l.length > MAX ? "border-primary" : ""}`} />
                </div>
                <span className={`mt-0.5 block text-sm ${l.length > MAX ? "font-semibold text-primary" : "text-muted-foreground"}`}>Ligne {i + 1} : {l.length}/{MAX}</span>
              </label>
            ))}
          </div>
          {err && <p role="alert" className="rounded-xl bg-muted px-4 py-3 font-medium">{err}</p>}
        </Step>

        <section className="space-y-4 rounded-2xl border bg-card p-5">
          <p className="text-lg">
            {recap(config)} · <strong className="text-primary">{f.price} €</strong> · expédié sous 8 jours ouvrés.
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
