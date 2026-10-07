import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { DELIVERY_LABEL, STATUS_LABEL, colorHex, flow, fmtDate, fmtDateTime, total, useAtelier, type Order, type Status } from "@/lib/marie-orders";
import { Dot, TestBadge } from "@/components/marie/OrderList";

export const Route = createFileRoute("/marie/commande/$id")({ component: Fiche });

const NEXT_LABEL: Partial<Record<Status, string>> = {
  nouvelle: "J'ai vu", vue: "Je la commence", fabrication: "", prete: "Elle est retirée",
};

function deliveryText(o: Order) {
  const d = o.delivery;
  if (d.mode === "relais") return `${d.point} — ${d.address}`;
  if (d.mode === "domicile") return d.address;
  return "Grémonville, sur rendez-vous";
}

function Fiche() {
  const { id } = Route.useParams();
  const { ready, orders, setStatus, update } = useAtelier();
  const [asking, setAsking] = useState(false);
  const [tracking, setTracking] = useState("");
  if (!ready) return null;
  const o = orders.find((x) => x.id === id);
  if (!o) return <p>Commande introuvable. <Link to="/marie" className="underline">Retour</Link></p>;
  const f = flow(o);
  const i = f.indexOf(o.status);
  const next = f[i + 1];
  const prev = f[i - 1];
  const label = o.status === "fabrication" ? (o.delivery.mode === "atelier" ? "Prête à retirer" : "Expédiée") : NEXT_LABEL[o.status];
  const advance = () => {
    if (!next) return;
    if (next === "expediee" && !asking) return setAsking(true);
    setStatus(o, next, next === "expediee" && tracking.trim() ? { tracking: tracking.trim() } : {});
    setAsking(false);
  };
  const customs = o.lines.filter((l) => l.custom);

  return (
    <div className="pb-8">
      <div className="print:hidden">
        <Link to="/marie" className="text-sm underline">← Aujourd'hui</Link>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <h1 className="text-3xl">{o.number}</h1>{o.test && <TestBadge />}
          <span className="text-sage">{STATUS_LABEL[o.status]}</span>
        </div>
        <p className="text-sm text-muted-foreground">Reçue le {fmtDateTime(o.createdAt)}</p>
      </div>

      {/* Bon imprimable (A5) + fiche écran */}
      <div className="bon mt-6 space-y-6">
        <p className="hidden print:block font-display text-3xl">{o.number}</p>
        {customs.map((l, k) => (
          <section key={k} className="border-2 border-foreground p-5">
            <p className="text-sm text-muted-foreground">{l.product} · texte à peindre</p>
            <div className="mt-2 font-stencil text-4xl leading-tight md:text-6xl">{l.custom!.text.map((t, j) => <div key={j}>{t}</div>)}</div>
            <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-lg">
              <span className="flex items-center gap-2"><span className="h-7 w-7 rounded-full border" style={{ background: colorHex(l.custom!.color) }} />{l.custom!.color}</span>
              <span>Format : {l.custom!.format}</span>
              {l.custom!.handle && <span>Anse : {l.custom!.handle}</span>}
            </div>
          </section>
        ))}
        {o.gift.on && (
          <section className="border-2 border-sage bg-sage-soft p-4">
            <p className="text-sm text-sage">🎁 Emballage cadeau · petit mot</p>
            {o.gift.note && <p className="mt-1 font-display text-2xl">« {o.gift.note} »</p>}
          </section>
        )}
        <section className="grid gap-4 md:grid-cols-2">
          <div><h2 className="text-lg">Cliente</h2><p>{o.customer.first} {o.customer.last}</p><p className="text-sm">{o.customer.email} · {o.customer.phone}</p></div>
          <div><h2 className="text-lg">{DELIVERY_LABEL[o.delivery.mode]}</h2><p>{deliveryText(o)}</p>
            <p className="mt-1 flex items-center gap-3">À faire avant le <strong>{fmtDate(o.deadline)}</strong> <span className="print:hidden"><Dot o={o} /></span></p></div>
        </section>
        <section>
          <h2 className="text-lg">Contenu</h2>
          <ul className="mt-1">{o.lines.map((l, k) => <li key={k} className="flex justify-between border-b py-2"><span>{l.qty} × {l.product}{l.variant ? ` (${l.variant})` : ""}</span><span>{l.price * l.qty} €</span></li>)}</ul>
          <p className="mt-2 text-right font-medium">Total {total(o)} €</p>
        </section>
      </div>

      <div className="mt-8 space-y-3 print:hidden">
        {next && label && (
          <>
            {asking && <input autoFocus value={tracking} onChange={(e) => setTracking(e.target.value)} placeholder="Numéro de suivi (facultatif)" className="h-14 w-full border bg-card px-4 text-lg" />}
            <button onClick={advance} className="btn-buy h-16 w-full text-xl">{asking ? "Valider : expédiée" : label}</button>
          </>
        )}
        {o.tracking && <p>Numéro de suivi : <strong>{o.tracking}</strong></p>}
        {prev && <button onClick={() => { setStatus(o, prev); setAsking(false); }} className="text-sm underline">Revenir à l'étape précédente</button>}
        <button onClick={() => window.print()} className="btn-soft w-full">Imprimer le bon</button>
        <label className="block pt-2">Note
          <textarea defaultValue={o.note ?? ""} onBlur={(e) => update(o.id, { note: e.target.value })} rows={3} className="mt-1 w-full border bg-card p-3" placeholder="Facultatif" />
        </label>
        <details className="text-sm text-muted-foreground"><summary>Historique</summary>
          <ul className="mt-2">{o.history.map((h, k) => <li key={k}>{STATUS_LABEL[h.status]} — {fmtDateTime(h.at)}</li>)}</ul>
        </details>
      </div>
    </div>
  );
}
