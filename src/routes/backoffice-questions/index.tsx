import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { saveBackofficeReport } from "@/lib/backoffice.functions";

export const Route = createFileRoute("/backoffice-questions/")({
  head: () => ({
    meta: [
      { title: "8 questions pour tes commandes · Grenouille Rouge" },
      { name: "description", content: "Page privée : 8 questions pour préparer l'outil de suivi des commandes." },
      { property: "og:title", content: "8 questions pour tes commandes · Grenouille Rouge" },
      { property: "og:description", content: "Page privée : 8 questions pour préparer l'outil de suivi des commandes." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: BackofficePage,
});

/** Un écran. `n` = numéro de question (Q7 et Q8 ont deux écrans). */
type S = { id: string; n: number; title: string; options: string[]; multi?: boolean; other?: { label: string; hint: string } };
const SCREENS: S[] = [
  { id: "q1", n: 1, title: "Entre « payée » et « partie », quelles étapes tu veux cocher pour chaque commande du site ?", options: [
    "Vue → En fabrication → Expédiée", "Vue → En fabrication → Prête → Expédiée", "Vue → Cousue → Peinte → Emballée → Expédiée", "Autre"],
    other: { label: "Autre", hint: "Écris tes étapes dans l'ordre, séparées par une flèche" } },
  { id: "q2", n: 2, multi: true, title: "À quels moments tu regardes ton téléphone ou tes mails ?", options: [
    "Tôt le matin, avant l'atelier", "En arrivant à l'atelier", "À midi", "L'après-midi", "Le soir", "Tout le temps, plusieurs fois par heure"] },
  { id: "q3", n: 3, title: "Quand une commande arrive, tu veux être prévenue par…", options: ["Mail", "Notification sur mon téléphone", "Les deux"] },
  { id: "q4", n: 4, title: "Si tu n'as pas appuyé sur « Vu », on te relance au bout de…", options: ["2 heures", "4 heures", "Le lendemain matin", "Jamais"] },
  { id: "q5", n: 5, title: "Si la relance reste sans réponse, Henri reçoit une copie ?", options: ["Oui", "Non"] },
  { id: "q6", n: 6, title: "Un récap de tes commandes en cours chaque jour, à quelle heure ?", options: ["7 h", "8 h", "9 h", "18 h", "Pas de récap"] },
  { id: "q7a", n: 7, multi: true, title: "Quels jours tu déposes tes colis ?", options: ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"] },
  { id: "q7b", n: 7, title: "Et tu les déposes…", options: ["Plutôt le matin", "Plutôt l'après-midi", "Ça dépend"] },
  { id: "q8a", n: 8, title: "À l'atelier, tu gères tes commandes surtout sur…", options: ["Mon téléphone", "L'ordinateur", "Les deux"] },
  { id: "q8b", n: 8, title: "Tu as une imprimante à l'atelier ?", options: ["Oui", "Non"] },
];

type Ans = { picks: string[]; text: string };
type State = { pos: number; ans: Record<string, Ans>; sent: boolean; back: boolean };
const KEY = "gr-backoffice-v1";
const init: State = { pos: 0, ans: {}, sent: false, back: false };
const FINAL = SCREENS.length + 1;
const big = "min-h-14 w-full rounded-2xl px-5 text-lg font-semibold";

const answerText = (s: S, a?: Ans) => {
  if (!a || a.picks.length === 0) return "(pas de réponse)";
  return a.picks.map((p) => (s.other && p === s.other.label ? `Autre : ${a.text.trim()}` : p)).join(", ");
};

function BackofficePage() {
  const [st, setSt] = useState<State>(init);
  const [loaded, setLoaded] = useState(false);
  const [warn, setWarn] = useState(false);
  const [sending, setSending] = useState<"idle" | "busy" | "fail">("idle");
  const send = useServerFn(saveBackofficeReport);

  useEffect(() => {
    try { const s = localStorage.getItem(KEY); if (s) setSt({ ...init, ...JSON.parse(s) }); } catch { /* ignore */ }
    setLoaded(true);
  }, []);
  useEffect(() => { if (loaded) localStorage.setItem(KEY, JSON.stringify(st)); }, [st, loaded]);
  useEffect(() => { window.scrollTo(0, 0); setWarn(false); }, [st.pos]);

  const goTo = (pos: number, back = st.back) => setSt((s) => ({ ...s, pos: Math.max(0, Math.min(FINAL, pos)), back }));
  // En mode « Modifier », on revient au récap — sauf entre les deux écrans d'une même question.
  const after = () => {
    const nextSame = q && SCREENS[st.pos]?.n === q.n;
    goTo(st.back && !nextSame ? FINAL : st.pos + 1, st.back && !!nextSame);
  };

  if (!loaded) return <div className="min-h-[70vh]" />;

  const progress = Math.round((st.pos / FINAL) * 100);
  const q = st.pos >= 1 && st.pos <= SCREENS.length ? SCREENS[st.pos - 1]! : null;
  const a: Ans = (q && st.ans[q.id]) || { picks: [], text: "" };
  const otherOn = !!(q?.other && a.picks.includes(q.other.label));
  const setAns = (v: Ans) => q && setSt((s) => ({ ...s, ans: { ...s.ans, [q.id]: v } }));

  const pick = (o: string) => {
    if (!q) return;
    if (q.multi) { setAns({ ...a, picks: a.picks.includes(o) ? a.picks.filter((p) => p !== o) : [...a.picks, o] }); return; }
    setAns({ ...a, picks: [o] });
    if (o !== q.other?.label) after();
  };
  const next = () => {
    if (a.picks.length === 0 || (otherOn && !a.text.trim())) { setWarn(true); return; }
    after();
  };

  const subject = `Back-office Grenouille Rouge – ${new Date().toLocaleString("fr-FR", { dateStyle: "short", timeStyle: "short" })}`;
  const report = [
    ...SCREENS.flatMap((x) => [`Q${x.n}. ${x.title}`, `  → ${answerText(x, st.ans[x.id])}`, ""]),
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
        <div className="h-3 overflow-hidden rounded-full bg-muted"><div className="h-full bg-sage" style={{ width: `${progress}%` }} /></div>
        <p className="mt-1 text-sm text-muted-foreground">{q ? `Question ${q.n} / 8` : `${progress} %`}</p>
      </div>
      {warn && <p role="alert" className="mt-3 rounded-2xl bg-muted px-4 py-3 text-lg font-semibold">Il me manque juste ça 🙂</p>}

      {st.pos === 0 && (
        <div className="flex min-h-[70vh] flex-col justify-center gap-6 text-center">
          <h1 className="text-3xl font-medium leading-tight">Maman, je te prépare un outil pour que tu ne rates plus jamais une commande du site.</h1>
          <p className="text-xl">8 questions, 3 minutes.</p>
          <button type="button" onClick={() => goTo(1)} className={`${big} bg-foreground text-background`}>C'est parti</button>
        </div>
      )}

      {q && (
        <div className="space-y-6 pt-6">
          <h1 className="text-2xl font-medium leading-tight">{q.title}</h1>
          {q.multi && <p className="text-base text-muted-foreground">Plusieurs choix possibles.</p>}
          <div className="space-y-3">
            {q.options.map((o) => {
              const on = a.picks.includes(o);
              return (
                <button key={o} type="button" role={q.multi ? "checkbox" : undefined} aria-checked={q.multi ? on : undefined} onClick={() => pick(o)}
                  className={`${big} flex items-center gap-3 border-2 text-left ${on ? "border-foreground bg-foreground text-background" : "bg-card"}`}>
                  {q.multi && <span className="grid size-7 shrink-0 place-items-center rounded-md border-2 border-current">{on ? "✓" : ""}</span>}
                  {o}
                </button>
              );
            })}
          </div>
          {otherOn && q.other && (
            <label className="block">
              <span className="text-lg font-semibold">{q.other.hint}</span>
              <input value={a.text} onChange={(e) => setAns({ ...a, text: e.target.value })} placeholder="Vue → … → Expédiée" className="mt-1 min-h-14 w-full rounded-2xl border-2 bg-card px-4 text-lg" />
            </label>
          )}
          <div className="sticky bottom-0 -mx-4 mt-8 flex gap-3 border-t bg-background/95 px-4 py-3 backdrop-blur">
            <button type="button" onClick={() => goTo(st.pos - 1, false)} className="min-h-14 shrink-0 rounded-2xl border-2 bg-card px-4 text-lg font-semibold">← Retour</button>
            {(q.multi || otherOn) && <button type="button" onClick={next} className="min-h-14 flex-1 rounded-2xl bg-foreground px-4 text-lg font-semibold text-background">Suivant →</button>}
          </div>
        </div>
      )}

      {st.pos === FINAL && !st.sent && (
        <div className="space-y-5 pt-4">
          <h1 className="text-2xl font-medium">Tes 8 réponses</h1>
          <ul className="space-y-3">
            {SCREENS.map((x, i) => (
              <li key={x.id} className="rounded-2xl border-2 bg-card p-4">
                <p className="text-base text-muted-foreground">Q{x.n}. {x.title}</p>
                <p className="text-xl font-semibold">{answerText(x, st.ans[x.id])}</p>
                <button type="button" onClick={() => goTo(i + 1, true)} className="mt-2 text-base underline">Modifier</button>
              </li>
            ))}
          </ul>
          <button type="button" disabled={sending === "busy"} onClick={doSend} className={`${big} bg-primary text-primary-foreground disabled:opacity-60`}>
            {sending === "busy" ? "Envoi en cours…" : sending === "fail" ? "Réessayer" : "Envoyer à Henri"}
          </button>
          {sending === "fail" && <p className="rounded-2xl bg-muted p-4 font-semibold">Ça n'est pas parti, réessaie.</p>}
          <button type="button" onClick={() => goTo(SCREENS.length, false)} className="text-base underline">← Retour</button>
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
