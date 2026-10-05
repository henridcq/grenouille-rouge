import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { useServerFn } from "@tanstack/react-start";
import { saveTextesReport } from "@/lib/textes.functions";
import { bySlug, LOGO, PHOTOS } from "@/data/products";
import { CLES, FAQ, FICHES, HISTOIRE, HUMOUR, MOTS, PHRASES, TON, VRAI_FAUX } from "@/data/textes";

export const Route = createFileRoute("/textes/")({
  head: () => ({
    meta: [
      { title: "Les textes du site · Grenouille Rouge" },
      { name: "description", content: "Page privée de l'atelier : relecture des textes du site." },
      { property: "og:title", content: "Les textes du site · Grenouille Rouge" },
      { property: "og:description", content: "Page privée de l'atelier : relecture des textes du site." },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: Textes,
});

const KEY = "gr-textes-v1";
type Pick = { choice: number | null; custom: string };
type State = {
  step: number;
  ton: Pick & { why: string };
  humour: number | null;
  phrases: number[];
  phraseAutre: string;
  mots: Record<string, 1 | -1>;
  motDeteste: string;
  cles: Pick[];
  histoire: string[];
  vf: { a: "Vrai" | "Faux" | "À peu près" | null; fix: string }[];
  fiches: { ok: boolean | null; text: string; detail: string }[];
  qcl: { q: string; r: string }[];
  faq: { ok: boolean | null; text: string }[];
  sentAt: string | null;
};

const init = (): State => ({
  step: 0,
  ton: { choice: null, custom: "", why: "" },
  humour: null, phrases: [], phraseAutre: "", mots: {}, motDeteste: "",
  cles: CLES.map(() => ({ choice: null, custom: "" })),
  histoire: HISTOIRE.map(() => ""),
  vf: VRAI_FAUX.map(() => ({ a: null, fix: "" })),
  fiches: FICHES.map((f) => ({ ok: null, text: f.text, detail: "" })),
  qcl: [0, 1, 2].map(() => ({ q: "", r: "" })),
  faq: FAQ.map((f) => ({ ok: null, text: f.a })),
  sentAt: null,
});

const words = (s: string) => s.trim().split(/\s+/).filter(Boolean).length;
const MIC = "🎙️ Appuie sur le micro du clavier et parle : ton téléphone écrit pour toi.";
const pickText = (p: Pick, versions: string[]) => (p.choice === -1 ? p.custom.trim() : p.choice !== null ? versions[p.choice] ?? "" : "");
const pickOk = (p: Pick) => p.choice !== null && (p.choice !== -1 || p.custom.trim().length > 0);

/* ───────────── petits composants ───────────── */

function Area({ value, onChange, placeholder, rows = 5 }: { value: string; onChange: (v: string) => void; placeholder?: string; rows?: number }) {
  return (
    <div>
      <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={rows} placeholder={placeholder}
        className="w-full rounded-2xl border-2 bg-card p-4 text-lg" />
      <p className="mt-1 text-sm text-muted-foreground">{MIC}</p>
    </div>
  );
}

function Card({ on, onClick, children }: { on: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button type="button" onClick={onClick} aria-pressed={on}
      className={`block min-h-14 w-full rounded-2xl border-2 p-4 text-left text-lg ${on ? "border-foreground bg-foreground text-background" : "bg-card"}`}>
      {children}
    </button>
  );
}

function VersionCards({ versions, value, onChange, labels }: { versions: string[]; value: Pick; onChange: (p: Pick) => void; labels?: string[] }) {
  return (
    <div className="space-y-3">
      {versions.map((v, i) => (
        <Card key={i} on={value.choice === i} onClick={() => onChange({ ...value, choice: i })}>
          {labels?.[i] && <span className="mb-1 block text-sm font-semibold opacity-70">{labels[i]}</span>}
          « {v} »
        </Card>
      ))}
      <Card on={value.choice === -1} onClick={() => onChange({ ...value, choice: -1 })}>✍️ Je l'écris moi-même</Card>
      {value.choice === -1 && <Area value={value.custom} onChange={(t) => onChange({ ...value, custom: t })} rows={3} placeholder="Ta version…" />}
    </div>
  );
}

/** Maquette téléphone au style ACTUEL du site. */
function Phone({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-[280px] rounded-[2rem] border-[6px] border-foreground bg-foreground shadow-lg">
      <div className="site-style max-h-[34svh] overflow-y-auto rounded-[1.6rem] text-[13px]">{children}</div>
    </div>
  );
}

function HomePreview({ s }: { s: State }) {
  const t = (i: number) => pickText(s.cles[i]!, CLES[i]!.versions) || CLES[i]!.versions[0]!;
  return (
    <Phone>
      <div className="bg-primary px-2 py-1.5 text-center text-[10px] font-medium text-primary-foreground">{t(3)}</div>
      <div className="grid grid-cols-[1fr_auto_1fr] items-center border-b px-2 py-1.5">
        <span className="text-sage">☰</span>
        <img src={LOGO} alt="" className="h-6 mix-blend-multiply" />
        <span className="justify-self-end text-sage">🛍</span>
      </div>
      <img src={PHOTOS.musee} alt="" className="aspect-[4/3] w-full object-cover" />
      <div className="px-3 pb-4 pt-3">
        <p className="font-display text-xl leading-tight">{t(0)}</p>
        <p className="mt-1.5 text-muted-foreground">{t(1)}</p>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <span className="grid min-h-9 place-items-center bg-primary px-1 text-center text-[11px] font-medium text-primary-foreground">{t(2)}</span>
          <span className="grid min-h-9 place-items-center border border-sage px-1 text-center text-[11px] font-medium text-sage">Découvrir l'atelier</span>
        </div>
      </div>
      <div className="border-t px-3 py-4 text-center">
        <p className="font-display text-base">Grenouille Rouge</p>
        <p className="mt-1 text-muted-foreground">{t(4)}</p>
      </div>
    </Phone>
  );
}

function TextPreview({ text }: { text: string }) {
  return (
    <Phone>
      <img src={PHOTOS.hero} alt="" className="aspect-[4/3] w-full object-cover" />
      <div className="p-3">
        <p className="font-display text-lg leading-tight">À votre prénom.</p>
        <p className="mt-1.5">{text || "…"}</p>
        <span className="mt-3 grid min-h-9 place-items-center bg-primary text-[11px] font-medium text-primary-foreground">Créer le vôtre</span>
      </div>
    </Phone>
  );
}

function FichePreview({ i, text }: { i: number; text: string }) {
  const f = FICHES[i]!;
  const p = bySlug(f.slug);
  const opt = p?.options?.[0];
  return (
    <Phone>
      {p?.images[0] ? <img src={p.images[0]} alt="" className="aspect-square w-full object-cover" />
        : <div className="grid aspect-square w-full place-items-center bg-secondary p-4 text-center font-display text-lg">{f.name}</div>}
      <div className="p-3">
        <p className="font-display text-xl">{p?.name ?? f.name}</p>
        <p className="mt-1 font-semibold">{p ? `${p.fromPrice ? "À partir de " : ""}${p.price} €` : ""}</p>
        {opt && (
          <div className="mt-2">
            <p className="text-[11px] text-muted-foreground">{opt.label}</p>
            <div className="mt-1 flex flex-wrap gap-1.5">
              {opt.choices.map((c) => c.hex
                ? <span key={c.name} title={c.name} className="h-5 w-5 rounded-full border border-foreground/20" style={{ backgroundColor: c.hex }} />
                : <span key={c.name} className="border px-2 py-0.5 text-[11px]">{c.name}</span>)}
            </div>
          </div>
        )}
        <span className="mt-3 grid min-h-9 place-items-center bg-primary text-[11px] font-medium text-primary-foreground">Ajouter au panier</span>
        <p className="mt-3 whitespace-pre-line">{text}</p>
      </div>
    </Phone>
  );
}

/* ───────────── récap ───────────── */

function buildRecap(s: State) {
  const L: string[] = [];
  const when = new Date().toLocaleString("fr-FR", { dateStyle: "long", timeStyle: "short", timeZone: "Europe/Paris" });
  L.push(`TEXTES GRENOUILLE ROUGE – ${when}`, "");
  L.push("═══ TA VOIX ═══");
  const ton = s.ton.choice === -1 ? `Sa version : « ${s.ton.custom.trim()} »` : s.ton.choice !== null ? `${TON[s.ton.choice]!.label} : « ${TON[s.ton.choice]!.text} »` : "—";
  L.push(`Ton choisi : ${ton}`, `Pourquoi : ${s.ton.why.trim()}`);
  L.push(`Humour : ${s.humour !== null ? HUMOUR[s.humour] : "—"}`);
  L.push("Phrases cochées :", ...s.phrases.map((i) => `  • ${PHRASES[i]}`));
  L.push(`Phrase ajoutée : ${s.phraseAutre.trim() || "—"}`);
  L.push(`Mots verts (j'adore) : ${MOTS.filter((m) => s.mots[m] === 1).join(", ") || "—"}`);
  L.push(`Mots rouges (je déteste) : ${MOTS.filter((m) => s.mots[m] === -1).join(", ") || "—"}`);
  L.push(`Mot détesté ajouté : ${s.motDeteste.trim() || "—"}`, "");
  L.push("═══ PHRASES CLÉS ═══");
  CLES.forEach((c, i) => {
    const p = s.cles[i]!;
    L.push(`${c.id} ${c.title} : ${p.choice === -1 ? "(sa version) " : p.choice !== null ? `(version ${String.fromCharCode(65 + p.choice)}) ` : ""}« ${pickText(p, c.versions)} »`);
  });
  L.push("", "═══ SON HISTOIRE ═══");
  HISTOIRE.forEach((h, i) => L.push(`3.${i + 1} ${h.q}`, s.histoire[i]!.trim(), ""));
  L.push("═══ VRAI OU FAUX ═══");
  VRAI_FAUX.forEach((v, i) => {
    const r = s.vf[i]!;
    L.push(`${i + 1}. « ${v} » → ${r.a ?? "—"}${r.a && r.a !== "Vrai" ? ` · Ce qui est juste : ${r.fix.trim()}` : ""}`);
  });
  L.push("", "═══ FICHES ═══");
  FICHES.forEach((f, i) => {
    const r = s.fiches[i]!;
    L.push(`${i + 1}. ${f.name} : ${r.ok ? "Parfait" : "CORRIGÉ"}`);
    if (!r.ok) L.push(r.text.trim());
    if (r.detail.trim()) L.push(`   Le détail à savoir : ${r.detail.trim()}`);
    L.push("");
  });
  L.push("═══ QUESTIONS DES CLIENTES ═══");
  s.qcl.forEach((x, i) => L.push(`${i + 1}. Q : ${x.q.trim()}`, `   R : ${x.r.trim()}`));
  L.push("", "═══ FAQ (réponses corrigées uniquement) ═══");
  const fixed = FAQ.map((f, i) => ({ f, r: s.faq[i]! })).filter(({ r }) => r.ok === false);
  if (!fixed.length) L.push("Aucune correction : tout est bon.");
  fixed.forEach(({ f, r }) => L.push(`• ${f.q}`, `  ${r.text.trim()}`));
  L.push("", "═══ DONNÉES BRUTES ═══", JSON.stringify(s, null, 2));
  return L.join("\n");
}

/* ───────────── page ───────────── */

type Screen = { part?: string; body: ReactNode; preview?: ReactNode; valid: boolean; next?: string; auto?: boolean };

function Textes() {
  const [s, setS] = useState<State>(init);
  const [ready, setReady] = useState(false);
  const [nudge, setNudge] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);
  const save = useServerFn(saveTextesReport);

  useEffect(() => {
    try { const raw = localStorage.getItem(KEY); if (raw) setS({ ...init(), ...JSON.parse(raw) }); } catch { /* ignore */ }
    setReady(true);
  }, []);
  useEffect(() => { if (ready) localStorage.setItem(KEY, JSON.stringify(s)); }, [s, ready]);
  useEffect(() => { setNudge(false); window.scrollTo(0, 0); }, [s.step]);

  const up = (f: (d: State) => void) => setS((prev) => { const d = structuredClone(prev); f(d); return d; });
  const recap = useMemo(() => buildRecap(s), [s]);

  const screens: Screen[] = [];

  // 0 · Accueil
  screens.push({ valid: true, next: "On y va", body: (
    <div className="space-y-5 pt-6">
      <h1 className="text-4xl font-bold leading-tight">Dernière ligne droite, Maman !</h1>
      <p className="text-xl">Les textes du site, c'est ta voix. Je les ai écrits en m'inspirant de tes posts Instagram : dis-moi ce qui sonne juste, corrige ce qui ne va pas, et raconte-moi ce que toi seule sais.</p>
      <p className="text-xl text-muted-foreground">Environ 20 minutes.</p>
    </div>
  ) });

  // PARTIE 1
  screens.push({ part: "Partie 1 · Ta voix", valid: pickOk(s.ton) && words(s.ton.why) >= 5, next: "Je garde celle-là →",
    preview: <TextPreview text={s.ton.choice === -1 ? s.ton.custom : s.ton.choice !== null ? TON[s.ton.choice]!.text : TON[0]!.text} />,
    body: (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Le même texte, écrit de 3 façons. Laquelle te ressemble ?</h2>
        <VersionCards versions={TON.map((t) => t.text)} labels={TON.map((t) => t.label)} value={s.ton} onChange={(p) => up((d) => { d.ton = { ...d.ton, ...p }; })} />
        <label className="block pt-2 text-lg font-semibold">Pourquoi celle-là ? <span className="font-normal text-muted-foreground">({words(s.ton.why)} / 5 mots)</span></label>
        <Area value={s.ton.why} onChange={(t) => up((d) => { d.ton.why = t; })} rows={3} />
      </div>
    ) });

  screens.push({ part: "Partie 1 · Ta voix", valid: s.humour !== null && s.phrases.length >= 3, body: (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Combien d'humour sur ton site ?</h2>
      <div className="space-y-3">{HUMOUR.map((h, i) => <Card key={h} on={s.humour === i} onClick={() => up((d) => { d.humour = i; })}>{h}</Card>)}</div>
      <h2 className="pt-4 text-2xl font-bold">Parmi tes phrases, lesquelles tu veux voir sur le site ?</h2>
      <p className="text-muted-foreground">Au moins 3. ({s.phrases.length} cochée{s.phrases.length > 1 ? "s" : ""})</p>
      <div className="space-y-3">
        {PHRASES.map((p, i) => {
          const on = s.phrases.includes(i);
          return <Card key={p} on={on} onClick={() => up((d) => { d.phrases = on ? d.phrases.filter((x) => x !== i) : [...d.phrases, i]; })}>{on ? "☑" : "☐"} « {p} »</Card>;
        })}
      </div>
      <label className="block pt-2 text-lg font-semibold">Une autre phrase à toi qu'on a oubliée ? <span className="font-normal text-muted-foreground">(facultatif)</span></label>
      <Area value={s.phraseAutre} onChange={(t) => up((d) => { d.phraseAutre = t; })} rows={2} />
    </div>
  ) });

  const verts = MOTS.filter((m) => s.mots[m] === 1).length;
  const rouges = MOTS.filter((m) => s.mots[m] === -1).length;
  screens.push({ part: "Partie 1 · Ta voix", valid: verts >= 5 && rouges >= 2, body: (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Les mots</h2>
      <p className="text-lg">Touche une fois : <strong>vert, j'adore</strong>. Deux fois : <strong>rouge, je déteste</strong>. Trois fois : neutre.</p>
      <p className="text-muted-foreground">Au moins 5 verts ({verts}) et 2 rouges ({rouges}).</p>
      <div className="flex flex-wrap gap-2">
        {MOTS.map((m) => {
          const v = s.mots[m];
          const cls = v === 1 ? "border-green-700 bg-green-700 text-white" : v === -1 ? "border-red-700 bg-red-700 text-white line-through" : "bg-card";
          return (
            <button key={m} type="button" onClick={() => up((d) => { const c = d.mots[m]; if (!c) d.mots[m] = 1; else if (c === 1) d.mots[m] = -1; else delete d.mots[m]; })}
              className={`min-h-12 rounded-full border-2 px-4 text-lg ${cls}`}>{m}</button>
          );
        })}
      </div>
      <label className="block pt-2 text-lg font-semibold">Un mot que tu ne supportes pas et qui n'est pas dans la liste ? <span className="font-normal text-muted-foreground">(facultatif)</span></label>
      <Area value={s.motDeteste} onChange={(t) => up((d) => { d.motDeteste = t; })} rows={2} />
    </div>
  ) });

  // PARTIE 2
  CLES.forEach((c, i) => {
    screens.push({ part: "Partie 2 · Les phrases clés", valid: pickOk(s.cles[i]!), next: "Je garde celle-là →", preview: <HomePreview s={s} />, body: (
      <div className="space-y-4">
        <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">{c.title}</p>
        <h2 className="text-2xl font-bold">{c.question}</h2>
        <p className="text-muted-foreground">Touche une carte : elle s'affiche dans le téléphone.</p>
        <VersionCards versions={c.versions} value={s.cles[i]!} onChange={(p) => up((d) => { d.cles[i] = p; })} />
      </div>
    ) });
  });

  // PARTIE 3
  HISTOIRE.forEach((h, i) => {
    const n = words(s.histoire[i]!);
    screens.push({ part: "Partie 3 · Ce que toi seule sais", valid: n >= 20, body: (
      <div className="space-y-4">
        <img src={PHOTOS[h.photo]} alt="" className="aspect-[4/3] w-full rounded-2xl object-cover" />
        <h2 className="text-2xl font-bold">{h.q}</h2>
        <p className="text-muted-foreground">{h.aide}</p>
        <Area value={s.histoire[i]!} onChange={(t) => up((d) => { d.histoire[i] = t; })} rows={7} />
        <p className={`text-lg font-semibold ${n >= 20 ? "text-green-700" : ""}`}>{n} / 20 mots</p>
      </div>
    ) });
  });

  // PARTIE 4
  VRAI_FAUX.forEach((v, i) => {
    const r = s.vf[i]!;
    const needFix = r.a === "Faux" || r.a === "À peu près";
    screens.push({ part: `Partie 4 · Vrai ou faux ? (${i + 1}/${VRAI_FAUX.length})`, valid: !!r.a && (!needFix || r.fix.trim().length > 0), body: (
      <div className="space-y-5">
        <p className="text-muted-foreground">Cette phrase est dans le site.</p>
        <p className="rounded-2xl border-2 bg-card p-5 text-2xl leading-snug">« {v} »</p>
        <div className="grid gap-3">
          {(["Vrai", "Faux", "À peu près"] as const).map((a) => (
            <Card key={a} on={r.a === a} onClick={() => up((d) => { d.vf[i]!.a = a; if (a === "Vrai") d.step += 1; })}>
              <span className="block text-center text-xl font-semibold">{a}</span>
            </Card>
          ))}
        </div>
        {needFix && (<><label className="block text-lg font-semibold">Qu'est-ce qui est juste ?</label><Area value={r.fix} onChange={(t) => up((d) => { d.vf[i]!.fix = t; })} rows={3} /></>)}
      </div>
    ) });
  });

  // PARTIE 5
  FICHES.forEach((f, i) => {
    const r = s.fiches[i]!;
    screens.push({ part: `Partie 5 · Tes fiches produits (${i + 1}/${FICHES.length})`, valid: r.ok !== null && r.text.trim().length > 0, preview: <FichePreview i={i} text={r.text} />, body: (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">{f.name} : le texte sonne juste ?</h2>
        <div className="grid grid-cols-2 gap-3">
          <Card on={r.ok === true} onClick={() => up((d) => { d.fiches[i]!.ok = true; d.fiches[i]!.text = f.text; })}><span className="block text-center font-semibold">Parfait</span></Card>
          <Card on={r.ok === false} onClick={() => up((d) => { d.fiches[i]!.ok = false; })}><span className="block text-center font-semibold">Je corrige</span></Card>
        </div>
        {r.ok === false && <Area value={r.text} onChange={(t) => up((d) => { d.fiches[i]!.text = t; })} rows={10} />}
        <label className="block pt-2 text-lg font-semibold">Le détail que la cliente doit absolument savoir <span className="font-normal text-muted-foreground">(facultatif)</span></label>
        <Area value={r.detail} onChange={(t) => up((d) => { d.fiches[i]!.detail = t; })} rows={2} />
      </div>
    ) });
  });

  // PARTIE 6
  screens.push({ part: "Partie 6 · Les questions des clientes", valid: s.qcl.every((x) => x.q.trim() && x.r.trim()), body: (
    <div className="space-y-5">
      <h2 className="text-2xl font-bold">Les 3 questions que les clientes te posent le plus souvent, et ce que tu leur réponds.</h2>
      {s.qcl.map((x, i) => (
        <div key={i} className="space-y-2 rounded-2xl border-2 p-4">
          <p className="font-semibold">Question {i + 1}</p>
          <input value={x.q} onChange={(e) => up((d) => { d.qcl[i]!.q = e.target.value; })} placeholder="La question" className="min-h-14 w-full rounded-2xl border-2 bg-card px-4 text-lg" />
          <p className="pt-1 font-semibold">Ta réponse</p>
          <Area value={x.r} onChange={(t) => up((d) => { d.qcl[i]!.r = t; })} rows={3} />
        </div>
      ))}
    </div>
  ) });

  screens.push({ part: "Partie 6 · Les questions des clientes", valid: s.faq.every((f) => f.ok !== null && f.text.trim()), next: "Suivant →", body: (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">La FAQ du site : relis vite.</h2>
      <div className="space-y-3">
        {FAQ.map((f, i) => {
          const r = s.faq[i]!;
          return (
            <details key={f.q} className={`rounded-2xl border-2 bg-card p-4 ${r.ok === true ? "border-green-700" : ""}`}>
              <summary className="cursor-pointer text-lg font-semibold">{r.ok === true ? "✓ " : r.ok === false ? "✎ " : ""}{f.q}</summary>
              {r.ok === false ? <div className="mt-3"><Area value={r.text} onChange={(t) => up((d) => { d.faq[i]!.text = t; })} rows={4} /></div>
                : <p className="mt-3 text-lg">{f.a}</p>}
              <div className="mt-3 grid grid-cols-2 gap-3">
                <button type="button" onClick={() => up((d) => { d.faq[i] = { ok: true, text: f.a }; })} className="min-h-14 rounded-2xl border-2 font-semibold">OK</button>
                <button type="button" onClick={() => up((d) => { d.faq[i]!.ok = false; })} className="min-h-14 rounded-2xl border-2 font-semibold">Je corrige</button>
              </div>
            </details>
          );
        })}
      </div>
      <button type="button" onClick={() => up((d) => { d.faq = d.faq.map((x, i) => (x.ok === null ? { ok: true, text: FAQ[i]!.a } : x)); })}
        className="min-h-14 w-full rounded-2xl bg-foreground text-lg font-semibold text-background">Tout est bon</button>
    </div>
  ) });

  // FINAL
  const send = async () => {
    setSending(true); setSendError(null);
    try {
      const when = new Date().toLocaleString("fr-FR", { dateStyle: "short", timeStyle: "short", timeZone: "Europe/Paris" });
      const res = await save({ data: { subject: `Textes Grenouille Rouge – ${when}`, body: recap } });
      if (res.ok) up((d) => { d.sentAt = new Date().toISOString(); });
      else setSendError(res.reason);
    } catch (e) { setSendError(String(e)); }
    setSending(false);
  };
  screens.push({ valid: false, body: (
    <div className="space-y-5 pt-4">
      <h1 className="text-4xl font-bold leading-tight">Merci Maman ! Avec ça, ton site va parler comme toi.</h1>
      {s.sentAt ? (
        <p className="rounded-2xl bg-green-700 p-5 text-xl font-semibold text-white">C'est parti chez Henri ✓</p>
      ) : (
        <>
          <button type="button" disabled={sending} onClick={send} className="min-h-16 w-full rounded-2xl bg-primary text-xl font-semibold text-primary-foreground disabled:opacity-60">
            {sending ? "Envoi…" : "J'ai fini, envoyer à Henri"}
          </button>
          {sendError && (
            <div role="alert" className="space-y-3 rounded-2xl border-2 p-4">
              <p className="text-lg">Oups, ça n'est pas parti. Vérifie ta connexion, puis réessaie : rien n'est perdu.</p>
              <button type="button" onClick={send} className="min-h-14 w-full rounded-2xl border-2 text-lg font-semibold">Réessayer</button>
              <button type="button" onClick={() => navigator.clipboard?.writeText(recap)} className="min-h-14 w-full rounded-2xl border-2 text-lg font-semibold">Copier le récap</button>
            </div>
          )}
        </>
      )}
      <details className="rounded-2xl border-2 p-4">
        <summary className="cursor-pointer text-lg font-semibold">Revoir mon récap</summary>
        <pre className="mt-3 max-h-[50svh] overflow-auto whitespace-pre-wrap text-sm">{recap.split("═══ DONNÉES BRUTES")[0]}</pre>
      </details>
    </div>
  ) });

  const last = screens.length - 1;
  const step = Math.min(s.step, last);
  const sc = screens[step]!;
  const go = (n: number) => up((d) => { d.step = Math.max(0, Math.min(last, n)); });
  const next = () => (sc.valid ? go(step + 1) : setNudge(true));

  if (!ready) return <div className="min-h-svh" />;

  return (
    <div className="mx-auto flex min-h-svh max-w-xl flex-col px-4 text-lg">
      <div className="sticky top-0 z-10 -mx-4 bg-background px-4 pb-2 pt-3">
        <div className="h-3 overflow-hidden rounded-full bg-muted">
          <div className="h-full rounded-full bg-sage" style={{ width: `${(step / last) * 100}%` }} />
        </div>
        {sc.part && <p className="mt-2 text-sm font-semibold text-muted-foreground">{sc.part}</p>}
      </div>
      {sc.preview && <div className="sticky top-14 z-[5] -mx-4 bg-background px-4 pb-3">{sc.preview}</div>}
      <div className="flex-1 pb-6 pt-2">{sc.body}</div>
      {step < last && (
        <div className="sticky bottom-0 -mx-4 border-t bg-background px-4 pb-4 pt-3">
          {nudge && !sc.valid && <p role="status" className="mb-2 text-center text-lg font-semibold">Il me manque juste ça 🙂</p>}
          <div className="grid grid-cols-[auto_1fr] gap-3">
            <button type="button" onClick={() => go(step - 1)} disabled={step === 0} className="min-h-14 rounded-2xl border-2 px-5 font-semibold disabled:opacity-30">← Retour</button>
            <button type="button" onClick={next} className={`min-h-14 rounded-2xl px-5 text-lg font-semibold ${sc.valid ? "bg-foreground text-background" : "bg-muted text-muted-foreground"}`}>{sc.next ?? "Suivant →"}</button>
          </div>
        </div>
      )}
      {step === last && <button type="button" onClick={() => go(step - 1)} className="mb-6 min-h-14 rounded-2xl border-2 font-semibold">← Retour</button>}
    </div>
  );
}
