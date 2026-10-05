import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import raw from "@/data/tri-produits.json";
import { ph } from "@/data/photos";
import { ProductImage } from "@/components/shop/ProductImage";
import { saveTriReport } from "@/lib/tri.functions";

export const Route = createFileRoute("/tri/")({
  head: () => ({
    meta: [
      { title: "Tri des produits · Grenouille Rouge" },
      { name: "description", content: "Page privée de tri des produits pour l'atelier." },
      { property: "og:title", content: "Tri des produits · Grenouille Rouge" },
      { property: "og:description", content: "Page privée de tri des produits pour l'atelier." },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: TriPage,
});

type P = { id: number; nom: string; prix: number; onglet_propose: string; photo: string; ventes_24_mois: number; photo_a_refaire: boolean };
const PRODUCTS = raw as P[];
const TABS = ["Personnalisés", "Cabas & sacs", "La maison", "Petits cadeaux", "Je ne le vends plus"] as const;
const OUT = "Je ne le vends plus";
const COUSSINS = PRODUCTS.filter((p) => /coussin/i.test(p.nom)).map((p) => p.nom.replace(/\s+/g, " "));
const EMAIL = "henri.dcq@gmail.com";
const KEY = "gr-tri-v1";

// ---------- Questions ----------
type Field = {
  id: string; label: string; type: "text" | "number" | "long" | "choice" | "checks";
  options?: string[]; show?: (a: A) => boolean; minWords?: number; help?: string;
};
type A = Record<string, string | string[] | boolean>;
type Q = { n: number; title: string; photos: (string | undefined)[]; fields: Field[] };

const dims = (p: string, label: string, parts: string[]): Field[] => parts.map((x) => ({ id: `${p}_${x}`, label: `${label} · ${x} (cm)`, type: "number" }));
const QUESTIONS: Q[] = [
  { n: 1, title: "Ce sac en jute bordé de noir.", photos: [ph("sac-jute-bord-noir-porte-01.jpg")], fields: [
    { id: "q1_nom", label: "Nom du sac", type: "text" },
    { id: "q1_prix", label: "Prix de vente (€)", type: "number" },
    { id: "q1_dim", label: "Dimensions (H × L × P en cm)", type: "text", help: "ex. 30 × 40 × 12" },
    { id: "q1_couleurs", label: "Couleurs disponibles", type: "text" },
    { id: "q1_stock", label: "En stock ?", type: "choice", options: ["Oui", "Non, je le fais à la commande", "Il n'existe plus"] },
    { id: "q1_combien", label: "Combien ?", type: "number", show: (a) => a["q1_stock"] === "Oui" },
  ] },
  { n: 2, title: "Le BB Carré.", photos: [ph("bb-carre-vierge-recto.jpg")], fields: [
    { id: "q2_vend", label: "Tu le vends ?", type: "choice", options: ["Je le vends toujours", "Je ne le vends plus"] },
    { id: "q2_prix", label: "Prix (€)", type: "number", show: (a) => a["q2_vend"] === "Je le vends toujours" },
    { id: "q2_dim", label: "Dimensions (H × L × P en cm)", type: "text", show: (a) => a["q2_vend"] === "Je le vends toujours" },
    { id: "q2_perso", label: "Personnalisable comme les autres ?", type: "choice", options: ["Oui", "Non"], show: (a) => a["q2_vend"] === "Je le vends toujours" },
  ] },
  { n: 3, title: "Ta gamme Luxe (Luxe BB Rond 64 €, Luxe Rond 78 €, Luxe Super Rond 94 €).", photos: ["https://grenouillerouge.com/img/p/2/4/3/5/2435.jpg"], fields: [
    { id: "q3_diff", label: "En quoi elle est différente des personnalisés ?", type: "long", help: "matière, finitions, anses, doublure… quelques mots suffisent" },
    { id: "q3_garde", label: "On la garde ?", type: "choice", options: ["Oui, telle quelle", "Oui, mais à changer", "Non"] },
    { id: "q3_quoi", label: "Quoi changer ?", type: "long", show: (a) => a["q3_garde"] === "Oui, mais à changer" },
  ] },
  { n: 4, title: "La trousse en lin personnalisable (21 €) est encore en ligne.", photos: ["https://grenouillerouge.com/img/p/2/6/9/7/2697.jpg"], fields: [
    { id: "q4_fait", label: "Tu la fais ?", type: "choice", options: ["Je la fais toujours", "Je ne la fais plus"] },
    { id: "q4_prix", label: "Prix (€)", type: "number", show: (a) => a["q4_fait"] === "Je la fais toujours" },
    { id: "q4_lettres", label: "Nombre de lettres maximum", type: "number", show: (a) => a["q4_fait"] === "Je la fais toujours" },
    { id: "q4_couleurs", label: "Couleurs de peinture possibles", type: "text", show: (a) => a["q4_fait"] === "Je la fais toujours" },
  ] },
  { n: 5, title: "Les dimensions de tes formats, en centimètres.", photos: [ph("trio-ronds-vierges-02.jpg")], fields: [
    ...dims("q5_bbrond", "BB Rond", ["hauteur", "diamètre"]),
    ...dims("q5_rond", "Rond", ["hauteur", "diamètre"]),
    ...dims("q5_rondxl", "Rond XL", ["hauteur", "diamètre"]),
    ...dims("q5_carre", "Carré", ["hauteur", "largeur", "profondeur"]),
    ...dims("q5_carrexxl", "Carré XXL", ["hauteur", "largeur", "profondeur"]),
    ...dims("q5_cabas", "Cabas personnalisable", ["hauteur", "largeur", "profondeur", "longueur des anses"]),
    ...dims("q5_videpoches", "Petit vide-poches", ["hauteur", "diamètre"]),
  ] },
  { n: 6, title: "La police de tes pochoirs.", photos: [ph("ambiance-les-jouets-de-leo.jpg")], fields: [
    { id: "q6_nom", label: "Nom de la police si tu le connais", type: "text" },
    { id: "q6_achat", label: "Où tu achètes tes pochoirs", type: "text" },
    { id: "q6_casse", label: "Majuscules seulement, ou aussi minuscules ?", type: "choice", options: ["Majuscules seulement", "Aussi minuscules"] },
    { id: "q6_chiffres", label: "Les chiffres et les accents existent ?", type: "choice", options: ["Oui", "Non", "Certains"] },
    { id: "q6_lesquels", label: "Lesquels ?", type: "text", show: (a) => a["q6_chiffres"] === "Certains" },
  ] },
  { n: 7, title: "Ces deux grands paniers.", photos: [ph("mon-fourbi-francais-recto.jpg"), ph("bar-a-bouquins-recto.jpg")], fields: [
    { id: "q7a_prix", label: "Mon fourbi français · Prix (€)", type: "number" },
    { id: "q7a_dim", label: "Mon fourbi français · Dimensions (H × diamètre)", type: "text" },
    { id: "q7a_couleurs", label: "Mon fourbi français · Couleurs de peinture possibles", type: "text" },
    { id: "q7b_prix", label: "Bar à bouquins · Prix (€)", type: "number" },
    { id: "q7b_dim", label: "Bar à bouquins · Dimensions (H × diamètre)", type: "text" },
    { id: "q7b_couleurs", label: "Bar à bouquins · Couleurs de peinture possibles", type: "text" },
  ] },
  { n: 8, title: "Tes 13 coussins (Carte de France, Corse, chiens, chats).", photos: ["https://grenouillerouge.com/img/p/2/2/5/2/2252.jpg"], fields: [
    { id: "q8_vend", label: "Lesquels tu vends encore ?", type: "checks", options: COUSSINS },
    { id: "q8_stock", label: "En stock ?", type: "choice", options: ["Oui", "Non, à la commande"] },
    { id: "q8_combien", label: "Combien à peu près ?", type: "number", show: (a) => a["q8_stock"] === "Oui" },
    { id: "q8_atelier", label: "Faits à l'atelier ?", type: "choice", options: ["Oui", "Non, achetés", "Les deux"] },
    { id: "q8_precise", label: "Précise", type: "text", show: (a) => a["q8_atelier"] === "Les deux" },
  ] },
];

const visible = (q: Q, a: A) => q.fields.filter((f) => !f.show || f.show(a));
function missing(q: Q, a: A): boolean {
  return visible(q, a).some((f) => {
    if (a[`${f.id}__nsp`]) return !String(a[`${f.id}__qui`] ?? "").trim();
    const v = a[f.id];
    if (f.type === "checks") return false; // aucune case cochée = elle n'en vend plus aucun
    const s = String(v ?? "").trim();
    if (!s) return true;
    if (f.minWords && s.split(/\s+/).length < f.minWords) return true;
    return false;
  });
}

// ---------- Écrans ----------
type Screen = { k: "welcome" } | { k: "q"; q: Q } | { k: "p"; i: number } | { k: "pause"; done: number } | { k: "final" };
const SCREENS: Screen[] = [
  { k: "welcome" },
  ...QUESTIONS.map((q) => ({ k: "q", q }) as Screen),
  ...PRODUCTS.flatMap((_, i) => {
    const s: Screen[] = [{ k: "p", i }];
    if ((i + 1) % 20 === 0 && i + 1 < PRODUCTS.length) s.push({ k: "pause", done: i + 1 });
    return s;
  }),
  { k: "final" },
];

type Sort = Record<number, { tab: string; prix: string; note: string }>;
type State = { pos: number; a: A; sort: Sort; sent: boolean; later: boolean };
const init: State = { pos: 0, a: {}, sort: {}, sent: false, later: false };

const sortOf = (s: Sort, p: P) => s[p.id] ?? { tab: p.onglet_propose, prix: String(p.prix), note: "" };

const EXTRA_PHOTOS = [
  "Un petit vide-poches SANS texte, sur fond blanc, de face.",
  "Le Rond XL avec un prénom, dans une vraie chambre ou un salon.",
  "Le sac à bûches Au coin du feu rempli de bûches, près d'une cheminée ou d'un poêle.",
  "Tes mains qui peignent un prénom au pochoir (une photo + une vidéo verticale de 20 secondes).",
  "Le feston cousu main, en gros plan.",
  "Toi et Bénédicte à l'atelier, un portrait chacune.",
];

function photoTodo(sort: Sort) {
  return PRODUCTS.filter((p) => p.photo_a_refaire && sortOf(sort, p).tab !== OUT);
}

function buildReport(st: State) {
  const L: string[] = [];
  const fmt = (v: unknown) => (Array.isArray(v) ? (v.length ? v.join(", ") : "(aucun)") : String(v ?? ""));
  L.push("QUESTIONS", "");
  for (const q of QUESTIONS) {
    L.push(`Q${q.n}. ${q.title}`);
    for (const f of visible(q, st.a)) {
      const val = st.a[`${f.id}__nsp`] ? `Je ne sais pas. Qui peut savoir / quand : ${fmt(st.a[`${f.id}__qui`])}` : fmt(st.a[f.id]);
      L.push(`  - ${f.label} : ${val}`);
    }
    L.push("");
  }
  L.push("TRI", "");
  for (const t of TABS) {
    const list = PRODUCTS.filter((p) => sortOf(st.sort, p).tab === t);
    L.push(`${t === OUT ? "RETIRÉS" : t.toUpperCase()} (${list.length})`);
    for (const p of list) L.push(`  [${p.id}] ${p.nom} – ${sortOf(st.sort, p).prix} €`);
    L.push("");
  }
  L.push("CHANGEMENTS", "");
  for (const p of PRODUCTS) {
    const s = sortOf(st.sort, p);
    if (s.tab !== p.onglet_propose) L.push(`  [${p.id}] ${p.nom} : ${p.onglet_propose} → ${s.tab}`);
    if (Number(s.prix.replace(",", ".")) !== p.prix) L.push(`  [${p.id}] ${p.nom} : ${p.prix} € → ${s.prix} €`);
  }
  L.push("", "PHOTOS À FAIRE", "");
  for (const p of photoTodo(st.sort)) L.push(`  [${p.id}] ${p.nom}`);
  for (const e of EXTRA_PHOTOS) L.push(`  • ${e}`);
  L.push("", "REMARQUES", "");
  for (const p of PRODUCTS) { const n = sortOf(st.sort, p).note.trim(); if (n) L.push(`  [${p.id}] ${p.nom} : ${n}`); }
  L.push("", "DONNÉES BRUTES (JSON)", JSON.stringify({ questions: st.a, tri: PRODUCTS.map((p) => ({ id: p.id, ...sortOf(st.sort, p) })) }));
  return L.join("\n");
}

// ---------- UI ----------
const big = "min-h-14 w-full rounded-2xl px-5 text-lg font-semibold";

function Photo({ src, name }: { src?: string | undefined; name: string }) {
  return <ProductImage src={src} name={name} alt={name} className="aspect-square w-full rounded-3xl" />;
}

function FieldInput({ f, a, set }: { f: Field; a: A; set: (k: string, v: A[string]) => void }) {
  const nsp = !!a[`${f.id}__nsp`];
  const input = "mt-1 min-h-14 w-full rounded-2xl border-2 bg-card px-4 text-lg";
  return (
    <div className="space-y-2">
      <p className="text-lg font-semibold">{f.label}</p>
      {f.help && <p className="text-base text-muted-foreground">{f.help}</p>}
      {!nsp && (f.type === "text" || f.type === "number") && (
        <input inputMode={f.type === "number" ? "decimal" : undefined} value={String(a[f.id] ?? "")} onChange={(e) => set(f.id, e.target.value)} className={input} />
      )}
      {!nsp && f.type === "long" && (
        <>
          <textarea rows={4} value={String(a[f.id] ?? "")} onChange={(e) => set(f.id, e.target.value)} className={`${input} py-3`} />
          {f.minWords && <p className="text-sm text-muted-foreground">{String(a[f.id] ?? "").trim().split(/\s+/).filter(Boolean).length} / {f.minWords} mots minimum</p>}
        </>
      )}
      {!nsp && f.type === "choice" && (
        <div className="space-y-2">
          {f.options!.map((o) => (
            <button key={o} type="button" onClick={() => set(f.id, o)} className={`${big} border-2 text-left ${a[f.id] === o ? "border-foreground bg-foreground text-background" : "bg-card"}`}>{o}</button>
          ))}
        </div>
      )}
      {!nsp && f.type === "checks" && (
        <div className="space-y-2">
          {f.options!.map((o) => {
            const list = (a[f.id] as string[] | undefined) ?? [];
            const on = list.includes(o);
            return (
              <label key={o} className="flex min-h-14 items-center gap-3 rounded-2xl border-2 bg-card px-4 text-lg">
                <input type="checkbox" checked={on} onChange={() => set(f.id, on ? list.filter((x) => x !== o) : [...list, o])} className="h-6 w-6 accent-[var(--foreground)]" />
                {o}
              </label>
            );
          })}
        </div>
      )}
      <label className="flex items-center gap-2 text-base text-muted-foreground">
        <input type="checkbox" checked={nsp} onChange={(e) => set(`${f.id}__nsp`, e.target.checked)} className="h-5 w-5" /> Je ne sais pas
      </label>
      {nsp && <input placeholder="Qui peut savoir, ou quand tu sauras ?" value={String(a[`${f.id}__qui`] ?? "")} onChange={(e) => set(`${f.id}__qui`, e.target.value)} className={input} />}
    </div>
  );
}

function TriPage() {
  const [st, setSt] = useState<State>(init);
  const [loaded, setLoaded] = useState(false);
  const [warn, setWarn] = useState(false);
  const [sending, setSending] = useState<"idle" | "busy" | "fail">("idle");
  const [copied, setCopied] = useState(false);
  const send = useServerFn(saveTriReport);
  const touch = useRef<number | null>(null);

  useEffect(() => {
    try { const s = localStorage.getItem(KEY); if (s) setSt({ ...init, ...JSON.parse(s), later: false }); } catch { /* ignore */ }
    setLoaded(true);
  }, []);
  useEffect(() => { if (loaded) localStorage.setItem(KEY, JSON.stringify(st)); }, [st, loaded]);
  useEffect(() => { window.scrollTo(0, 0); setWarn(false); }, [st.pos]);

  const sc = SCREENS[Math.min(st.pos, SCREENS.length - 1)]!;
  const go = (d: number) => setSt((s) => ({ ...s, pos: Math.max(0, Math.min(SCREENS.length - 1, s.pos + d)) }));
  const setA = (k: string, v: A[string]) => setSt((s) => ({ ...s, a: { ...s.a, [k]: v } }));
  const setP = (p: P, patch: Partial<Sort[number]>) => setSt((s) => ({ ...s, sort: { ...s.sort, [p.id]: { ...sortOf(s.sort, p), ...patch } } }));
  const next = () => {
    if (sc.k === "q" && missing(sc.q, st.a)) { setWarn(true); return; }
    if (sc.k === "p") { const p = PRODUCTS[sc.i]!; setP(p, {}); if (!sortOf(st.sort, p).prix.trim()) { setWarn(true); return; } }
    go(1);
  };
  const report = useMemo(() => buildReport(st), [st]);
  const subject = `Tri Grenouille Rouge – ${new Date().toLocaleString("fr-FR", { dateStyle: "short", timeStyle: "short" })}`;
  const doSend = async () => {
    setSending("busy");
    try { const r = await send({ data: { subject, body: report } }); if (r.ok) { setSt((s) => ({ ...s, sent: true })); setSending("idle"); } else setSending("fail"); }
    catch { setSending("fail"); }
  };

  if (!loaded) return <div className="min-h-[70vh]" />;

  const progress = Math.round((st.pos / (SCREENS.length - 1)) * 100);
  const nav = (label = "Suivant →") => (
    <div className="sticky bottom-0 -mx-4 mt-8 flex gap-3 border-t bg-background/95 px-4 py-3 backdrop-blur">
      <button type="button" onClick={() => go(-1)} className="min-h-14 shrink-0 rounded-2xl border-2 bg-card px-4 text-lg font-semibold">← Retour</button>
      <button type="button" onClick={next} className="min-h-14 flex-1 rounded-2xl bg-foreground px-4 text-lg font-semibold text-background">{label}</button>
    </div>
  );

  return (
    <div className="mx-auto max-w-xl px-4 pb-6 text-lg print:max-w-none">
      <div className="sticky top-0 z-10 -mx-4 bg-background/95 px-4 py-3 backdrop-blur print:hidden">
        <div className="h-3 overflow-hidden rounded-full bg-muted"><div className="h-full bg-sage transition-all" style={{ width: `${progress}%` }} /></div>
        <p className="mt-1 text-sm text-muted-foreground">
          {sc.k === "q" ? `Étape 1 · Question ${sc.q.n} / 8` : sc.k === "p" ? `Étape 2 · Produit ${sc.i + 1} / ${PRODUCTS.length}` : `${progress} %`}
        </p>
      </div>
      {warn && <p role="alert" className="mt-3 rounded-2xl bg-muted px-4 py-3 text-lg font-semibold">Il me manque juste ça 🙂</p>}

      {sc.k === "welcome" && (
        <div className="flex min-h-[70vh] flex-col justify-center gap-6 text-center">
          <h1 className="text-3xl font-medium leading-tight">Maman, aide-moi à finir ton site.</h1>
          <p className="text-xl">2 étapes : 8 questions, puis le tri de tes produits. Tu peux t'arrêter quand tu veux, tout est gardé.</p>
          <button type="button" onClick={() => go(1)} className={`${big} bg-foreground text-background`}>C'est parti</button>
        </div>
      )}

      {sc.k === "q" && (
        <div className="space-y-6 pt-3">
          <div className={`grid gap-2 ${sc.q.photos.length > 1 ? "grid-cols-2" : ""}`}>
            {sc.q.photos.map((p, i) => <Photo key={i} src={p} name={sc.q.title} />)}
          </div>
          <h1 className="text-2xl font-medium leading-tight">{sc.q.title}</h1>
          {visible(sc.q, st.a).map((f) => <FieldInput key={f.id} f={f} a={st.a} set={setA} />)}
          {nav()}
        </div>
      )}

      {sc.k === "p" && (() => {
        const p = PRODUCTS[sc.i]!;
        const s = sortOf(st.sort, p);
        return (
          <div
            className="space-y-5 pt-3"
            onTouchStart={(e) => { touch.current = e.touches[0]!.clientX; }}
            onTouchEnd={(e) => { const x = touch.current; touch.current = null; if (x !== null && x - e.changedTouches[0]!.clientX > 80) next(); }}
          >
            {p.photo_a_refaire && (
              <p className="rounded-2xl border-2 border-[oklch(0.7_0.17_55)] bg-[oklch(0.93_0.08_70)] px-4 py-3 text-lg font-semibold">⚠️ Photo à refaire : celle-ci est trop petite ou toute seule. Elle sera dans ta liste de photos à la fin.</p>
            )}
            <div className="relative">
              <Photo src={p.photo} name={p.nom} />
              {p.ventes_24_mois >= 5 && <span className="absolute left-3 top-3 rounded-full bg-primary px-3 py-1 text-base font-bold text-primary-foreground">Best-seller</span>}
            </div>
            <div>
              <h1 className="text-2xl font-medium leading-tight">{p.nom}</h1>
              <p className="mt-1 text-2xl font-semibold text-primary">{s.prix} €</p>
            </div>
            <div className="space-y-2">
              <p className="text-lg font-semibold">Dans quel onglet ?</p>
              {TABS.map((t) => (
                <button key={t} type="button" onClick={() => setP(p, { tab: t })} className={`${big} border-2 text-left ${s.tab === t ? "border-foreground bg-foreground text-background" : "bg-card"}`}>{t}</button>
              ))}
            </div>
            <label className="block">
              <span className="text-lg font-semibold">Prix (€)</span>
              <input inputMode="decimal" value={s.prix} onChange={(e) => setP(p, { prix: e.target.value })} className="mt-1 min-h-14 w-full rounded-2xl border-2 bg-card px-4 text-lg" />
            </label>
            <label className="block">
              <span className="text-lg font-semibold">Une remarque ? <span className="font-normal text-muted-foreground">(facultatif)</span></span>
              <textarea rows={2} value={s.note} onChange={(e) => setP(p, { note: e.target.value })} className="mt-1 w-full rounded-2xl border-2 bg-card px-4 py-3 text-lg" />
            </label>
            {nav("C'est bon, suivant →")}
          </div>
        );
      })()}

      {sc.k === "pause" && (
        <div className="flex min-h-[70vh] flex-col justify-center gap-5 text-center">
          {st.later ? (
            <p className="text-2xl font-semibold">Tout est gardé. Rouvre cette page quand tu veux, tu reprendras ici. ☕</p>
          ) : (
            <>
              <h1 className="text-3xl font-medium">{sc.done} / {PRODUCTS.length}, tu avances bien !</h1>
              <p className="text-2xl">Pause café ?</p>
            </>
          )}
          <button type="button" onClick={() => { setSt((s) => ({ ...s, later: false })); go(1); }} className={`${big} bg-foreground text-background`}>Je continue</button>
          {!st.later && <button type="button" onClick={() => setSt((s) => ({ ...s, later: true }))} className={`${big} border-2 bg-card`}>Je reprends plus tard</button>}
        </div>
      )}

      {sc.k === "final" && (
        <div className="space-y-6 pt-4">
          {!st.sent && (
            <div className="space-y-3 print:hidden">
              <h1 className="text-2xl font-medium">Tu as tout fini, bravo !</h1>
              <button type="button" disabled={sending === "busy"} onClick={doSend} className={`${big} bg-primary text-primary-foreground disabled:opacity-60`}>
                {sending === "busy" ? "Envoi en cours…" : sending === "fail" ? "Réessayer" : "Ça y est, mission accomplie ! 🎉"}
              </button>
              {sending === "fail" && (
                <div className="space-y-3 rounded-2xl bg-muted p-4">
                  <p className="font-semibold">Ça n'est pas parti, réessaie.</p>
                  <p className="text-base">Si ça ne marche toujours pas :</p>
                  <button type="button" onClick={async () => { await navigator.clipboard.writeText(`${subject}\n\n${report}`); setCopied(true); }} className={`${big} border-2 bg-card`}>{copied ? "Copié ✓ colle-le dans un email à Henri" : "Copier le récap"}</button>
                  <a href={`mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(report.split("DONNÉES BRUTES")[0]!.slice(0, 6000))}`} className={`${big} grid place-items-center border-2 bg-card`}>Ouvrir ma messagerie</a>
                  <button type="button" onClick={() => setSt((s) => ({ ...s, sent: true }))} className="text-base underline">C'est fait, je l'ai envoyé moi-même</button>
                </div>
              )}
              <button type="button" onClick={() => go(-1)} className="text-base underline">← Retour</button>
            </div>
          )}
          {st.sent && (
            <div className="space-y-5">
              <h1 className="text-3xl font-medium">Tes photos à faire</h1>
              <ul className="list-disc space-y-1 pl-6 text-lg">
                <li>Fond blanc ou crème, à la lumière du jour près d'une fenêtre.</li>
                <li>Téléphone à hauteur du produit, de face.</li>
                <li>Envoie-les à Henri par email en taille réelle.</li>
              </ul>
              <ul className="space-y-3">
                {photoTodo(st.sort).map((p) => (
                  <li key={p.id} className="flex items-center gap-3 rounded-2xl bg-card p-2">
                    <ProductImage src={p.photo} name={p.nom} alt={p.nom} className="h-16 w-16 shrink-0 rounded-xl text-xs" />
                    <span>{p.nom}</span>
                  </li>
                ))}
              </ul>
              <h2 className="text-2xl font-medium">Et ces photos qui manquent au site</h2>
              <ul className="list-disc space-y-2 pl-6">{EXTRA_PHOTOS.map((e) => <li key={e}>{e}</li>)}</ul>
              <button type="button" onClick={() => window.print()} className={`${big} border-2 bg-card print:hidden`}>Imprimer ma liste</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
