import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { ph } from "@/data/photos";
import { ProductImage } from "@/components/shop/ProductImage";
import { saveQuestionsReport } from "@/lib/questions.functions";

export const Route = createFileRoute("/questions/")({
  head: () => ({
    meta: [
      { title: "6 petites questions · Grenouille Rouge" },
      { name: "description", content: "Page privée : 6 questions pour finir le catalogue." },
      { property: "og:title", content: "6 petites questions · Grenouille Rouge" },
      { property: "og:description", content: "Page privée : 6 questions pour finir le catalogue." },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: QuestionsPage,
});

type Opt = { label: string; other?: string[] };
type Q = { id: string; title: string; photos: (string | undefined)[]; options: Opt[] };
const QS: Q[] = [
  { id: "q1", title: "Le coussin Corse est à 16 €.", photos: ["https://grenouillerouge.com/img/p/2/2/5/9/2259.jpg"], options: [
    { label: "Oui, c'est un petit coussin à 16 €" }, { label: "Erreur, il est à 52 € comme les autres" }, { label: "Autre prix", other: ["Prix (€)"] }] },
  { id: "q2", title: "Les dimensions du BB Carré ?", photos: [ph("bb-carre-vierge-recto.jpg")], options: [
    { label: "30 × 30 × 30 cm" }, { label: "35 × 35 × 35 cm, c'est juste" }, { label: "Autre", other: ["Hauteur (cm)", "Largeur (cm)", "Profondeur (cm)"] }] },
  { id: "q3", title: "La largeur du cabas personnalisable ?", photos: ["https://grenouillerouge.com/img/p/3/0/5/6/3056.jpg"], options: [{ label: "36 cm" }, { label: "40 cm" }] },
  { id: "q4", title: "Le prix du Loom ?", photos: ["https://grenouillerouge.com/img/p/2/9/4/8/2948.jpg"], options: [{ label: "68 €" }, { label: "74 €" }] },
  { id: "q5", title: "Le cabas de courses anses courtes ?", photos: ["https://grenouillerouge.com/img/p/8/6/5/865.jpg"], options: [
    { label: "Je le retire" }, { label: "Je le garde à 24 €" }, { label: "Je le garde à un autre prix", other: ["Prix (€)"] }] },
  { id: "q6", title: "Les Minis sur le site ?", photos: ["https://grenouillerouge.com/img/p/3/0/9/5/3095.jpg", "https://grenouillerouge.com/img/p/3/1/0/0/3100.jpg"], options: [
    { label: "Une seule fiche, la cliente choisit son modèle" }, { label: "Une fiche par Mini" }] },
];

type Ans = { choice: string; values: string[] };
type State = { pos: number; ans: Record<string, Ans>; sent: boolean; back: boolean };
const KEY = "gr-questions-v1";
const init: State = { pos: 0, ans: {}, sent: false, back: false };
const FINAL = QS.length + 1;
const big = "min-h-14 w-full rounded-2xl px-5 text-lg font-semibold";

const otherOf = (q: Q, a?: Ans) => q.options.find((o) => o.label === a?.choice)?.other;
const answerText = (q: Q, a?: Ans) => {
  if (!a) return "(pas de réponse)";
  const o = otherOf(q, a);
  return o ? `${a.choice} : ${o.map((l, i) => `${l} ${a.values[i] ?? ""}`).join(", ")}` : a.choice;
};

function QuestionsPage() {
  const [st, setSt] = useState<State>(init);
  const [loaded, setLoaded] = useState(false);
  const [warn, setWarn] = useState(false);
  const [sending, setSending] = useState<"idle" | "busy" | "fail">("idle");
  const send = useServerFn(saveQuestionsReport);

  useEffect(() => {
    try { const s = localStorage.getItem(KEY); if (s) setSt({ ...init, ...JSON.parse(s) }); } catch { /* ignore */ }
    setLoaded(true);
  }, []);
  useEffect(() => { if (loaded) localStorage.setItem(KEY, JSON.stringify(st)); }, [st, loaded]);
  useEffect(() => { window.scrollTo(0, 0); setWarn(false); }, [st.pos]);

  const goTo = (pos: number, back = st.back) => setSt((s) => ({ ...s, pos: Math.max(0, Math.min(FINAL, pos)), back }));
  const after = () => goTo(st.back ? FINAL : st.pos + 1, false);

  if (!loaded) return <div className="min-h-[70vh]" />;

  const progress = Math.round((st.pos / FINAL) * 100);
  const q = st.pos >= 1 && st.pos <= QS.length ? QS[st.pos - 1]! : null;
  const a = q ? st.ans[q.id] : undefined;
  const other = q ? otherOf(q, a) : undefined;

  const pick = (o: Opt) => {
    if (!q) return;
    setSt((s) => ({ ...s, ans: { ...s.ans, [q.id]: { choice: o.label, values: s.ans[q.id]?.choice === o.label ? s.ans[q.id]!.values : [] } } }));
    if (!o.other) after();
  };
  const setVal = (i: number, v: string) => q && setSt((s) => {
    const cur = s.ans[q.id]!; const values = [...cur.values]; values[i] = v;
    return { ...s, ans: { ...s.ans, [q.id]: { ...cur, values } } };
  });
  const nextOther = () => {
    if (other && other.some((_, i) => !String(a?.values[i] ?? "").trim())) { setWarn(true); return; }
    after();
  };

  const subject = `Questions Grenouille Rouge – ${new Date().toLocaleString("fr-FR", { dateStyle: "short", timeStyle: "short" })}`;
  const report = [
    ...QS.flatMap((x, i) => [`Q${i + 1}. ${x.title}`, `  → ${answerText(x, st.ans[x.id])}`, ""]),
    "DONNÉES BRUTES (JSON)", JSON.stringify(st.ans),
  ].join("\n");
  const doSend = async () => {
    setSending("busy");
    try { const r = await send({ data: { subject, body: report } }); if (r.ok) { setSt((s) => ({ ...s, sent: true })); setSending("idle"); } else setSending("fail"); }
    catch { setSending("fail"); }
  };

  return (
    <div className="mx-auto max-w-xl px-4 pb-6 text-lg">
      <div className="sticky top-0 z-10 -mx-4 bg-background/95 px-4 py-3 backdrop-blur">
        <div className="h-3 overflow-hidden rounded-full bg-muted"><div className="h-full bg-sage transition-all" style={{ width: `${progress}%` }} /></div>
        <p className="mt-1 text-sm text-muted-foreground">{q ? `Question ${st.pos} / ${QS.length}` : `${progress} %`}</p>
      </div>
      {warn && <p role="alert" className="mt-3 rounded-2xl bg-muted px-4 py-3 text-lg font-semibold">Il me manque juste ça 🙂</p>}

      {st.pos === 0 && (
        <div className="flex min-h-[70vh] flex-col justify-center gap-6 text-center">
          <h1 className="text-3xl font-medium leading-tight">6 petites questions, 2 minutes, et ton catalogue est fini !</h1>
          <button type="button" onClick={() => goTo(1)} className={`${big} bg-foreground text-background`}>C'est parti</button>
        </div>
      )}

      {q && (
        <div className="space-y-6 pt-3">
          <div className={`grid gap-2 ${q.photos.length > 1 ? "grid-cols-2" : ""}`}>
            {q.photos.map((p, i) => <ProductImage key={i} src={p} name={q.title} alt={q.title} className="aspect-square w-full rounded-3xl" />)}
          </div>
          <h1 className="text-2xl font-medium leading-tight">{q.title}</h1>
          <div className="space-y-3">
            {q.options.map((o) => (
              <button key={o.label} type="button" onClick={() => pick(o)} className={`${big} border-2 text-left ${a?.choice === o.label ? "border-foreground bg-foreground text-background" : "bg-card"}`}>{o.label}</button>
            ))}
          </div>
          {other && other.map((l, i) => (
            <label key={l} className="block">
              <span className="text-lg font-semibold">{l}</span>
              <input inputMode="decimal" value={a?.values[i] ?? ""} onChange={(e) => setVal(i, e.target.value)} className="mt-1 min-h-14 w-full rounded-2xl border-2 bg-card px-4 text-lg" />
            </label>
          ))}
          <div className="sticky bottom-0 -mx-4 mt-8 flex gap-3 border-t bg-background/95 px-4 py-3 backdrop-blur">
            <button type="button" onClick={() => goTo(st.pos - 1, false)} className="min-h-14 shrink-0 rounded-2xl border-2 bg-card px-4 text-lg font-semibold">← Retour</button>
            {other && <button type="button" onClick={nextOther} className="min-h-14 flex-1 rounded-2xl bg-foreground px-4 text-lg font-semibold text-background">Suivant →</button>}
          </div>
        </div>
      )}

      {st.pos === FINAL && !st.sent && (
        <div className="space-y-5 pt-4">
          <h1 className="text-2xl font-medium">Tes 6 réponses</h1>
          <ul className="space-y-3">
            {QS.map((x, i) => (
              <li key={x.id} className="rounded-2xl border-2 bg-card p-4">
                <p className="text-base text-muted-foreground">{x.title}</p>
                <p className="text-xl font-semibold">{answerText(x, st.ans[x.id])}</p>
                <button type="button" onClick={() => goTo(i + 1, true)} className="mt-2 text-base underline">Modifier</button>
              </li>
            ))}
          </ul>
          <button type="button" disabled={sending === "busy"} onClick={doSend} className={`${big} bg-primary text-primary-foreground disabled:opacity-60`}>
            {sending === "busy" ? "Envoi en cours…" : sending === "fail" ? "Réessayer" : "Envoyer à Henri"}
          </button>
          {sending === "fail" && <p className="rounded-2xl bg-muted p-4 font-semibold">Ça n'est pas parti, réessaie.</p>}
          <button type="button" onClick={() => goTo(QS.length, false)} className="text-base underline">← Retour</button>
        </div>
      )}

      {st.pos === FINAL && st.sent && (
        <div className="flex min-h-[70vh] flex-col justify-center text-center">
          <h1 className="text-4xl font-medium">Merci Maman ! ❤️</h1>
        </div>
      )}
    </div>
  );
}
