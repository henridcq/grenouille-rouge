import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { formatOf, palette, MAX } from "@/data/custom";
import { BagPreview } from "./BagPreview";

export function HeroConfigurator() {
  const [name, setName] = useState("LOUISE");
  const [color, setColor] = useState(palette.find((c) => c.name === "Bleu cobalt")!);
  const row = useRef<HTMLDivElement>(null);
  useEffect(() => { const el = row.current?.querySelector<HTMLElement>('[aria-checked="true"]'); if (el && row.current) row.current.scrollLeft = el.offsetLeft - 60; }, []);
  const price = formatOf("rond-xl").price;

  return (
    <section className="mx-auto grid max-w-6xl items-center gap-3 px-4 pt-3 md:grid-cols-2 md:gap-12 md:pt-10">
      <h1 className="text-[1.65rem] font-bold leading-[1.1] md:col-span-2 md:text-5xl">Des paniers en jute qui ont des choses à dire.</h1>
      <BagPreview format="rond-xl" color={color} lines={[name]} className="mx-auto aspect-square w-full max-w-[min(100%,32svh)] rounded-none md:max-w-none" />
      <div className="min-w-0 space-y-2.5">
        <label className="block">
          <span className="text-sm font-semibold">Votre prénom</span>
          <input value={name} maxLength={MAX} onChange={(e) => setName(e.target.value.toUpperCase())}
            className="font-stencil mt-1 h-12 w-full rounded-none border bg-card px-4 text-xl uppercase" />
        </label>
        <div ref={row} role="radiogroup" aria-label="Couleur" className="-mx-4 flex snap-x gap-2 overflow-x-auto px-4 py-1.5 md:mx-0 md:flex-wrap md:px-0">
          {palette.map((c) => {
            const on = c.name === color.name;
            return (
              <button key={c.name} type="button" role="radio" aria-checked={on} aria-label={c.name} title={c.name} onClick={() => setColor(c)}
                className={`h-9 w-9 shrink-0 snap-start rounded-full border border-foreground/20 transition ${on ? "ring-2 ring-foreground ring-offset-2 ring-offset-background" : ""}`}
                style={{ backgroundColor: c.hex }} />
            );
          })}
        </div>
        <p className="text-sm text-muted-foreground">Couleur : {color.name}</p>
        <Link to="/composer" search={{ forme: "rond-xl", prenom: name, couleur: color.name }} className="btn-buy w-full text-lg">
          Créer mon Rond XL · {price} €
        </Link>
        <p className="text-center text-[0.8rem] text-muted-foreground">Peint à la main à Grémonville · Expédié sous 8 jours · Livraison offerte dès 39 €</p>
      </div>
    </section>
  );
}
