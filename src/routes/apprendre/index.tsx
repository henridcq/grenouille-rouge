import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { saveApprendreReport } from "@/lib/apprendre.functions";

export const Route = createFileRoute("/apprendre/")({
  head: () => ({
    meta: [
      { title: "Ton site, tes mains · Grenouille Rouge" },
      { name: "description", content: "10 missions pour apprendre à améliorer le site de l'atelier." },
      { property: "og:title", content: "Ton site, tes mains · Grenouille Rouge" },
      { property: "og:description", content: "10 missions pour apprendre à améliorer le site de l'atelier." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: Apprendre,
});

/* ---------- Contenu ---------- */

type Step =
  | { k: "why"; text: string }
  | { k: "look"; title?: string; link?: string; linkLabel?: string; checks: string[]; note?: string }
  | { k: "prompt"; id: string; title?: string; template: string; defaults?: Record<string, string>; consigne?: string }
  | { k: "verify"; title?: string; checks: string[] }
  | { k: "info"; title: string; text: string; checks?: string[]; after?: string };

type Mission = { title: string; steps: Step[]; bilanNote?: string };

const CONSIGNE = "Colle-le dans Lovable, envoie, attends la fin.";

const MISSIONS: Mission[] = [
  {
    title: "Rien n'est définitif",
    steps: [
      { k: "why", text: "Apprendre que tout se défait en un geste." },
      { k: "look", link: "/", linkLabel: "Ouvrir l'accueil", checks: ["Je l'ai trouvé", "Je l'ai lu en entier sur mon téléphone"], title: "Le bandeau rouge tout en haut du site." },
      {
        k: "prompt", id: "p1",
        template: 'Dans le bandeau rouge tout en haut du site, remplace "[ancien texte]" par "[nouveau texte]". Ne touche à rien d\'autre.',
        defaults: { "ancien texte": "Livraison offerte en point relais dès 39 €", "nouveau texte": "Livraison offerte en point relais dès 39 € · Peint à la main en Normandie" },
      },
      { k: "verify", checks: ["Le nouveau texte apparaît"] },
      {
        k: "info", title: "Maintenant, annule",
        text: "Dans Lovable, retrouve ton message dans l'historique et reviens à la version d'avant (demande à Henri de te montrer le bouton la première fois). Vérifie : l'ancien bandeau est revenu.",
        checks: ["C'est revenu"], after: "Tu vois : rien n'est jamais cassé pour de bon.",
      },
    ],
  },
  {
    title: "Changer un prix",
    steps: [
      { k: "why", text: "Un prix juste, c'est une cliente rassurée." },
      { k: "look", title: "L'onglet « Petits cadeaux ».", link: "/rayon/petits-cadeaux", linkLabel: "Ouvrir Petits cadeaux", checks: ["Les prix sont tous justes ?"], note: "Les prix faux que j'ai vus" },
      { k: "prompt", id: "p1", template: 'Sur la fiche "[nom du produit]", change le prix de [ancien] € à [nouveau] €. Ne touche à rien d\'autre.' },
      { k: "verify", checks: ["Le prix est changé sur la fiche", "et dans la grille de l'onglet"] },
    ],
  },
  {
    title: "Mettre une de mes photos",
    steps: [
      { k: "why", text: "Une belle photo vend mieux qu'un long texte." },
      { k: "look", title: "L'onglet « Cabas & sacs ».", link: "/rayon/cabas-sacs", linkLabel: "Ouvrir Cabas & sacs", checks: ["Je repère une photo trop petite, floue ou vieille"] },
      {
        k: "prompt", id: "p1",
        template: 'Voici une nouvelle photo pour la fiche "[nom du produit]" (pièce jointe). Mets-la en photo principale, garde les autres en galerie. Ne touche à rien d\'autre.',
        consigne: "Joins ta photo au message dans Lovable avant d'envoyer.",
      },
      { k: "verify", checks: ["La photo apparaît dans la grille", "et sur la fiche", "elle n'est pas coupée bizarrement"] },
    ],
  },
  {
    title: "Corriger un texte",
    steps: [
      { k: "why", text: "Chaque phrase du site doit sonner comme toi." },
      { k: "look", title: "Une fiche de ton choix, lue comme une cliente.", link: "/rayon/maison", linkLabel: "Ouvrir La maison", checks: ["Une info fausse ?", "Une faute ?", "Une phrase qui ne te ressemble pas ?"], note: "Ce que j'ai remarqué" },
      { k: "prompt", id: "p1", template: 'Sur la fiche "[nom du produit]", remplace la phrase "[ancienne phrase]" par "[nouvelle phrase]". Ne touche à rien d\'autre.' },
      { k: "verify", checks: ["La phrase est changée", "le reste de la fiche est intact"] },
    ],
  },
  {
    title: "Rupture de stock",
    steps: [
      { k: "why", text: "Quand un produit manque, on le cache, puis on le remet." },
      { k: "prompt", id: "pA", title: "Prompt A — on met en pause", template: 'Mets la fiche "[nom du produit]" en "Bientôt de retour" : on la voit mais on ne peut plus l\'acheter. Ne touche à rien d\'autre.' },
      { k: "verify", checks: ["Le bouton d'achat a disparu"] },
      { k: "prompt", id: "pB", title: "Prompt B — on remet en vente", template: 'Remets la fiche "[nom du produit]" en vente normale.' },
      { k: "verify", checks: ["Le bouton est revenu"] },
    ],
  },
  {
    title: "Demander avant de toucher",
    bilanNote: "L'idée que je garde",
    steps: [
      { k: "why", text: "On peut discuter avec Lovable sans rien modifier, pour réfléchir à deux." },
      { k: "info", title: "Passe en mode discussion", text: "Dans Lovable, passe en mode discussion (demande à Henri lequel la première fois), puis pose ta question." },
      { k: "prompt", id: "p1", template: 'Sans rien modifier : à ton avis, qu\'est-ce qui pourrait rendre la page "[nom de la page]" plus claire pour une cliente sur téléphone ? Donne-moi 3 idées simples.' },
    ],
  },
  {
    title: "Audit de mon accueil",
    steps: [
      { k: "why", text: "L'accueil, c'est ta vitrine : on la regarde d'un œil neuf." },
      {
        k: "look", title: "Sur téléphone :", link: "/", linkLabel: "Ouvrir l'accueil",
        checks: ['Je vois "Je personnalise" sans faire défiler', "La photo du haut me plaît", "Les 4 onglets sont clairs", "Les prix des best-sellers sont justes", "Rien ne déborde sur le côté", "Il n'y a aucune faute"],
        note: "Les 3 choses que je changerais",
      },
      { k: "prompt", id: "p1", title: "Chose n° 1", template: 'Sur l\'accueil, dans le bloc "[nom du bloc]", [ce que je veux changer]. Ne touche à rien d\'autre.', consigne: "Envoie-les un par un, en vérifiant entre chaque." },
      { k: "prompt", id: "p2", title: "Chose n° 2", template: 'Sur l\'accueil, dans le bloc "[nom du bloc]", [ce que je veux changer]. Ne touche à rien d\'autre.', consigne: "Envoie-les un par un, en vérifiant entre chaque." },
      { k: "prompt", id: "p3", title: "Chose n° 3", template: 'Sur l\'accueil, dans le bloc "[nom du bloc]", [ce que je veux changer]. Ne touche à rien d\'autre.', consigne: "Envoie-les un par un, en vérifiant entre chaque." },
    ],
  },
  {
    title: "Changer de saison",
    steps: [
      { k: "why", text: "Le site vit avec les saisons, comme l'atelier." },
      { k: "look", title: "Le bloc saison de l'accueil.", link: "/", linkLabel: "Ouvrir l'accueil", checks: ["Il parle bien de la saison actuelle ?"] },
      { k: "prompt", id: "p1", template: 'Sur l\'accueil, dans le bloc saison, mets en avant "[produit ou collection]" avec le titre "[titre]" et la photo "[nom de la photo ou pièce jointe]". Ne touche à rien d\'autre.' },
      { k: "verify", checks: ["Le bloc a changé", "le lien mène au bon produit"] },
    ],
  },
  {
    title: "Ajouter un produit",
    steps: [
      { k: "why", text: "Une nouveauté de l'atelier mérite sa place sur le site." },
      {
        k: "prompt", id: "p1",
        template: 'Ajoute un produit dans l\'onglet "[onglet]" : nom "[nom]", prix [prix] €, dimensions [dimensions], description : "[2 ou 3 phrases]". Photo en pièce jointe. Place-le en [position] dans l\'onglet. Ne touche à rien d\'autre.',
        consigne: "Joins ta photo au message dans Lovable avant d'envoyer.",
      },
      { k: "verify", checks: ["Le produit est dans le bon onglet", "le prix et la photo sont justes", "je peux l'ajouter au panier"] },
    ],
  },
  {
    title: "Je suis ma cliente",
    steps: [
      { k: "why", text: "Le meilleur audit : acheter chez soi, comme une inconnue." },
      {
        k: "look", title: "Sur téléphone, comme une cliente qui ne te connaît pas :", link: "/personnalises", linkLabel: "Ouvrir Personnalisés",
        checks: ["Je crée un Rond XL avec un prénom", "Le texte s'affiche en majuscules", "Le prix et le délai sont clairs", "Je l'ajoute au panier", "Le panier est clair"],
        note: "Ce qui m'a gênée",
      },
      { k: "prompt", id: "p1", template: "Sur [la page], [le problème], je voudrais [la solution]. Ne touche à rien d'autre." },
    ],
  },
];

const RULES = [
  "Une seule demande par message.",
  "Je dis OÙ (la page, le bloc), QUOI (l'avant → l'après), et j'ajoute « Ne touche à rien d'autre. »",
  "Je vérifie toujours sur mon téléphone.",
  "Je peux TOUJOURS revenir en arrière : rien n'est définitif.",
  "Une petite amélioration par semaine vaut mieux qu'une refonte par an.",
];

const BILANS = ["Ça a marché", "Ça n'a pas marché, j'ai annulé", "J'ai besoin d'Henri"] as const;

/* ---------- État ---------- */

type MState = {
  step: number;
  checks: Record<string, boolean>;
  notes: Record<string, string>;
  fields: Record<string, Record<string, string>>;
  copied: Record<string, string>;
  bilan?: string;
  bilanText?: string;
  doneAt?: string;
};
type State = { missions: MState[]; open: number | null };

const KEY = "gr-apprendre-v1";
const emptyM = (): MState => ({ step: 0, checks: {}, notes: {}, fields: {}, copied: {} });
const initial = (): State => ({ missions: MISSIONS.map(emptyM), open: null });

const holes = (t: string) => Array.from(new Set(Array.from(t.matchAll(/\[([^\]]+)\]/g), (m) => m[1]!)));
const fill = (t: string, f: Record<string, string>) => t.replace(/\[([^\]]+)\]/g, (_, h: string) => (f[h]?.trim() ? f[h]!.trim() : `[${h}]`));

function buildRecap(s: State) {
  const lines: string[] = ["PARCOURS « APPRENDRE » — GRENOUILLE ROUGE", ""];
  const help = s.missions.map((m, i) => ({ m, i })).filter(({ m }) => m.bilan === BILANS[2]);
  lines.push("J'AI BESOIN D'HENRI", help.length ? "" : "Aucune demande.");
  help.forEach(({ m, i }) => lines.push(`- Mission ${i + 1} · ${MISSIONS[i]!.title} : ${m.bilanText || "(pas d'explication)"}`));
  lines.push("");
  s.missions.forEach((m, i) => {
    if (!m.doneAt) return;
    const mi = MISSIONS[i]!;
    lines.push(`MISSION ${i + 1} · ${mi.title}`, `Terminée le ${new Date(m.doneAt).toLocaleString("fr-FR")}`);
    const checked = Object.entries(m.checks).filter(([, v]) => v).map(([k]) => k.split("::")[1]);
    lines.push(`Cases cochées : ${checked.length ? checked.join(" · ") : "aucune"}`);
    Object.entries(m.notes).forEach(([k, v]) => v.trim() && lines.push(`${k} : ${v.trim()}`));
    Object.entries(m.copied).forEach(([k, v]) => lines.push(`Prompt copié (${k}) : ${v}`));
    lines.push(`Bilan : ${m.bilan ?? "—"}${m.bilanText ? ` — ${m.bilanText}` : ""}`, "");
  });
  lines.push("DONNÉES BRUTES", JSON.stringify(s, null, 2));
  return lines.join("\n");
}

/* ---------- UI ---------- */

const btn = "min-h-12 w-full bg-foreground px-4 font-medium text-background disabled:opacity-40";
const btnGhost = "min-h-12 w-full border border-foreground px-4 font-medium";

function Apprendre() {
  const [s, setS] = useState<State>(initial);
  const [loaded, setLoaded] = useState(false);
  const [rules, setRules] = useState(false);
  const save = useServerFn(saveApprendreReport);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const p = JSON.parse(raw) as State;
        if (p.missions?.length === MISSIONS.length) setS(p);
      }
    } catch { /* rien */ }
    setLoaded(true);
  }, []);
  useEffect(() => { if (loaded) localStorage.setItem(KEY, JSON.stringify(s)); }, [s, loaded]);

  const done = s.missions.filter((m) => m.doneAt).length;
  const upd = (i: number, f: (m: MState) => MState) =>
    setS((p) => ({ ...p, missions: p.missions.map((m, j) => (j === i ? f(m) : m)) }));

  const finish = (i: number) => {
    const next: State = {
      open: null,
      missions: s.missions.map((m, j) => (j === i ? { ...m, doneAt: new Date().toISOString() } : m)),
    };
    setS(next);
    window.scrollTo(0, 0);
    const d = new Date().toLocaleString("fr-FR", { dateStyle: "short", timeStyle: "short" });
    save({ data: { subject: `Apprendre Grenouille Rouge – mission ${i + 1} – ${d}`, body: buildRecap(next) } }).catch(() => {});
  };

  return (
    <div className="mx-auto max-w-xl px-5 pb-32 pt-8 text-[17px] leading-relaxed">
      {s.open === null ? (
        done === MISSIONS.length ? (
          <><End /><div className="mt-10"><Home s={s} done={done} onOpen={(i) => setS((p) => ({ ...p, open: i }))} /></div></>
        ) : (
          <Home s={s} done={done} onOpen={(i) => { setS((p) => ({ ...p, open: i })); window.scrollTo(0, 0); }} />
        )
      ) : (
        <MissionView
          i={s.open}
          m={s.missions[s.open]!}
          upd={(f) => upd(s.open!, f)}
          onBack={() => setS((p) => ({ ...p, open: null }))}
          onFinish={() => finish(s.open!)}
        />
      )}
      <div className="fixed inset-x-0 bottom-0 border-t bg-background p-3">
        <button type="button" onClick={() => setRules(true)} className="mx-auto block min-h-12 w-full max-w-xl border border-sage px-4 font-medium text-sage">
          Mes 5 règles
        </button>
      </div>
      {rules && (
        <div className="fixed inset-0 z-50 flex items-end bg-foreground/40" onClick={() => setRules(false)}>
          <div className="mx-auto w-full max-w-xl bg-background p-6" onClick={(e) => e.stopPropagation()}>
            <RulesCard />
            <button type="button" className={`${btn} mt-6`} onClick={() => setRules(false)}>Fermer</button>
          </div>
        </div>
      )}
    </div>
  );
}

function RulesCard() {
  return (
    <div>
      <h2 className="text-2xl">Mes 5 règles</h2>
      <ol className="mt-4 space-y-3">
        {RULES.map((r, i) => (
          <li key={r} className="flex gap-3"><span className="font-display text-sage">{i + 1}.</span><span>{r}</span></li>
        ))}
      </ol>
    </div>
  );
}

function Home({ s, done, onOpen }: { s: State; done: number; onOpen: (i: number) => void }) {
  return (
    <>
      <h1 className="text-3xl">Ton site, tes mains.</h1>
      <p className="mt-4">
        Un site, ce n'est pas un objet fini qu'on allume ou qu'on éteint. C'est comme l'atelier : on l'améliore un peu chaque semaine. Ici, 10 missions de 10 minutes pour apprendre à le faire toi-même, sans rien casser.
      </p>
      <div className="mt-6">
        <div className="flex justify-between text-sm"><span>Progression</span><span>{done}/10</span></div>
        <div className="mt-1 h-2 bg-muted"><div className="h-2 bg-sage" style={{ width: `${done * 10}%` }} /></div>
      </div>
      <ul className="mt-8 space-y-3">
        {MISSIONS.map((m, i) => {
          const st = s.missions[i]!;
          const locked = i > 0 && !s.missions[i - 1]!.doneAt;
          const label = st.doneAt ? "Terminée ✓" : locked ? "Verrouillée" : "En cours";
          return (
            <li key={m.title}>
              <button
                type="button" disabled={locked} onClick={() => onOpen(i)}
                className={`flex w-full items-center justify-between border p-4 text-left ${locked ? "opacity-40" : ""} ${st.doneAt ? "border-sage" : ""}`}
              >
                <span><span className="block text-sm text-muted-foreground">Mission {i + 1}</span><span className="font-display text-lg">{m.title}</span></span>
                <span className={`shrink-0 px-2 py-1 text-xs ${st.doneAt ? "bg-sage text-background" : "border"}`}>{label}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </>
  );
}

function End() {
  return (
    <>
      <h1 className="text-3xl">Bravo, ton site est entre tes mains.</h1>
      <div className="mt-8 border border-sage p-5"><RulesCard /></div>
      <p className="mt-6 font-display text-xl">Une petite amélioration par semaine.</p>
    </>
  );
}

function Checks({ prefix, items, m, upd }: { prefix: string; items: string[]; m: MState; upd: (f: (m: MState) => MState) => void }) {
  return (
    <ul className="mt-4 space-y-2">
      {items.map((c) => {
        const k = `${prefix}::${c}`;
        return (
          <li key={k}>
            <label className="flex min-h-12 cursor-pointer items-center gap-3 border p-3">
              <input type="checkbox" className="size-5 accent-[var(--sage)]" checked={!!m.checks[k]}
                onChange={(e) => upd((x) => ({ ...x, checks: { ...x.checks, [k]: e.target.checked } }))} />
              <span>{c}</span>
            </label>
          </li>
        );
      })}
    </ul>
  );
}

function Note({ label, m, upd }: { label: string; m: MState; upd: (f: (m: MState) => MState) => void }) {
  return (
    <label className="mt-5 block">
      <span className="font-medium">{label}</span>
      <span className="block text-sm text-muted-foreground">Facultatif · tu peux dicter avec le micro de ton clavier.</span>
      <textarea rows={3} className="mt-2 w-full border bg-background p-3" value={m.notes[label] ?? ""}
        onChange={(e) => upd((x) => ({ ...x, notes: { ...x.notes, [label]: e.target.value } }))} />
    </label>
  );
}

function PromptStep({ st, m, upd, title }: { st: Extract<Step, { k: "prompt" }>; m: MState; upd: (f: (m: MState) => MState) => void; title: string }) {
  const f = { ...st.defaults, ...m.fields[st.id] };
  const text = fill(st.template, f);
  const [ok, setOk] = useState(false);
  return (
    <>
      <h2 className="text-2xl">{st.title ?? "Écris ton prompt"}</h2>
      <p className="mt-1 text-sm text-muted-foreground">{title}</p>
      <div className="mt-4 space-y-3">
        {holes(st.template).map((h) => (
          <label key={h} className="block">
            <span className="text-sm font-medium">{h}</span>
            <input className="mt-1 min-h-12 w-full border bg-background px-3" value={f[h] ?? ""}
              onChange={(e) => upd((x) => ({ ...x, fields: { ...x.fields, [st.id]: { ...f, [h]: e.target.value } } }))} />
          </label>
        ))}
      </div>
      <p className="mt-5 text-sm font-medium">Ton prompt :</p>
      <p className="mt-1 border-l-2 border-sage bg-muted p-3">{text}</p>
      <button type="button" className={`${btn} mt-4`} onClick={() => {
        navigator.clipboard?.writeText(text).catch(() => {});
        setOk(true);
        upd((x) => ({ ...x, copied: { ...x.copied, [st.title ?? st.id]: text } }));
      }}>{ok ? "Copié ✓" : "Copier le prompt"}</button>
      {st.consigne && <p className="mt-4 font-medium">{st.consigne}</p>}
      <p className="mt-2">{CONSIGNE}</p>
    </>
  );
}

function MissionView({ i, m, upd, onBack, onFinish }: { i: number; m: MState; upd: (f: (m: MState) => MState) => void; onBack: () => void; onFinish: () => void }) {
  const mi = MISSIONS[i]!;
  const total = mi.steps.length + 1;
  const isBilan = m.step >= mi.steps.length;
  const st = mi.steps[m.step];
  const go = (d: number) => { upd((x) => ({ ...x, step: Math.max(0, Math.min(total - 1, x.step + d)) })); window.scrollTo(0, 0); };
  const head = `Mission ${i + 1} · ${mi.title}`;
  const canFinish = !!m.bilan && (m.bilan !== BILANS[2] || !!m.bilanText?.trim());

  return (
    <>
      <button type="button" onClick={onBack} className="text-sage underline">← Toutes les missions</button>
      <p className="mt-4 text-sm text-muted-foreground">{head} — étape {m.step + 1}/{total}</p>
      <div className="mt-1 h-1 bg-muted"><div className="h-1 bg-sage" style={{ width: `${((m.step + 1) / total) * 100}%` }} /></div>

      <div className="mt-6">
        {st?.k === "why" && (<><h2 className="text-2xl">Pourquoi</h2><p className="mt-3 text-xl">{st.text}</p></>)}
        {st?.k === "look" && (
          <>
            <h2 className="text-2xl">Regarde</h2>
            {st.title && <p className="mt-2">{st.title}</p>}
            {st.link && <a href={st.link} target="_blank" rel="noreferrer" className="mt-3 inline-block text-sage underline">{st.linkLabel} ↗</a>}
            <Checks prefix={`s${m.step}`} items={st.checks} m={m} upd={upd} />
            <Note label={st.note ?? "Ce que j'ai remarqué"} m={m} upd={upd} />
          </>
        )}
        {st?.k === "prompt" && <PromptStep key={st.id} st={st} m={m} upd={upd} title={head} />}
        {st?.k === "verify" && (
          <><h2 className="text-2xl">{st.title ?? "Vérifie sur ton téléphone"}</h2><Checks prefix={`s${m.step}`} items={st.checks} m={m} upd={upd} /></>
        )}
        {st?.k === "info" && (
          <>
            <h2 className="text-2xl">{st.title}</h2>
            <p className="mt-3">{st.text}</p>
            {st.checks && <Checks prefix={`s${m.step}`} items={st.checks} m={m} upd={upd} />}
            {st.after && st.checks?.every((c) => m.checks[`s${m.step}::${c}`]) && <p className="mt-5 font-display text-xl">{st.after}</p>}
          </>
        )}
        {isBilan && (
          <>
            <h2 className="text-2xl">Bilan</h2>
            {mi.bilanNote && <Note label={mi.bilanNote} m={m} upd={upd} />}
            <div className="mt-4 space-y-2">
              {BILANS.map((b) => (
                <button key={b} type="button" onClick={() => upd((x) => ({ ...x, bilan: b }))}
                  className={`min-h-12 w-full border px-4 text-left ${m.bilan === b ? "border-sage bg-sage text-background" : ""}`}>{b}</button>
              ))}
            </div>
            {m.bilan === BILANS[2] && (
              <label className="mt-4 block">
                <span className="font-medium">Explique en une phrase</span>
                <textarea rows={2} className="mt-2 w-full border bg-background p-3" value={m.bilanText ?? ""}
                  onChange={(e) => upd((x) => ({ ...x, bilanText: e.target.value }))} />
              </label>
            )}
          </>
        )}
      </div>

      <div className="mt-8 flex gap-3">
        {m.step > 0 && <button type="button" className={btnGhost} onClick={() => go(-1)}>← Retour</button>}
        {isBilan ? (
          <button type="button" className={btn} disabled={!canFinish} onClick={onFinish}>Mission terminée ✓</button>
        ) : (
          <button type="button" className={btn} onClick={() => go(1)}>Étape suivante →</button>
        )}
      </div>
    </>
  );
}
