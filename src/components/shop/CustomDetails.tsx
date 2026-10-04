import { formatOf, handles, type Color, type CustomConfig } from "@/data/custom";

function Dot({ c }: { c: Color }) {
  return <span className="inline-block h-3.5 w-3.5 shrink-0 rounded-full border border-foreground/30 align-middle" style={{ backgroundColor: c.hex }} />;
}

/** Toutes les options d'une ligne personnalisée. */
export function CustomDetails({ c }: { c: CustomConfig }) {
  const h = handles.find((x) => x.id === c.handle);
  return (
    <dl className="mt-1 space-y-0.5 text-sm">
      <div className="flex gap-1"><dt className="text-muted-foreground">Forme :</dt><dd>{formatOf(c.format).label}</dd></div>
      {c.single ? (
        <div className="flex items-center gap-1"><dt className="text-muted-foreground">Couleur :</dt><dd className="flex items-center gap-1"><Dot c={c.textColor} /> {c.textColor.name}</dd></div>
      ) : (
        <>
          <div className="flex items-center gap-1"><dt className="text-muted-foreground">Anse :</dt><dd className="flex items-center gap-1">{h?.label}{c.handleColor && h?.id !== "corde" && <><Dot c={c.handleColor} /> {c.handleColor.name}</>}</dd></div>
          <div className="flex items-center gap-1"><dt className="text-muted-foreground">Texte :</dt><dd className="flex items-center gap-1"><Dot c={c.textColor} /> {c.textColor.name}</dd></div>
          <div className="flex items-center gap-1"><dt className="text-muted-foreground">Feston :</dt><dd className="flex items-center gap-1"><Dot c={c.festonColor} /> {c.festonColor.name}</dd></div>
        </>
      )}
      <div>
        <dt className="text-muted-foreground">Votre texte :</dt>
        <dd className="font-stencil text-base leading-snug">
          {c.lines.filter((l) => l.trim()).map((l, i) => <div key={i}>{l}</div>)}
        </dd>
      </div>
    </dl>
  );
}
