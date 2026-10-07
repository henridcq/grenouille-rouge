// Maquette du back-office /marie : commandes de test gardées dans le navigateur (aucune base, aucun e-mail).
import { useEffect, useState } from "react";
import { palette, paletteCabas } from "@/data/custom";

export type Status = "nouvelle" | "vue" | "fabrication" | "expediee" | "prete" | "retiree";
export type Delivery =
  | { mode: "relais"; point: string; address: string }
  | { mode: "domicile"; address: string }
  | { mode: "atelier" };
export type Line = {
  product: string; variant?: string; qty: number; price: number;
  custom?: { format: string; handle?: string; color: string; text: string[] };
};
export type Order = {
  id: string; number: string; createdAt: string; test: boolean;
  customer: { first: string; last: string; email: string; phone: string };
  delivery: Delivery; lines: Line[]; gift: { on: boolean; note?: string };
  status: Status; history: { status: Status; at: string }[];
  tracking?: string; note?: string; deadline: string; stripe_session_id: string | null;
};
export type Settings = { emails: string; recapHour: number; relanceHours: number; copyHenri: boolean; quietFrom: number; quietTo: number };

export const STATUS_LABEL: Record<Status, string> = {
  nouvelle: "Nouvelle", vue: "Vue", fabrication: "En fabrication", expediee: "Expédiée", prete: "Prête à retirer", retiree: "Retirée",
};
export const DELIVERY_LABEL = { relais: "Point relais", domicile: "Domicile", atelier: "Retrait à l'atelier" } as const;

export function flow(o: Order): Status[] {
  return o.delivery.mode === "atelier" ? ["nouvelle", "vue", "fabrication", "prete", "retiree"] : ["nouvelle", "vue", "fabrication", "expediee"];
}
export const isDone = (o: Order) => o.status === "expediee" || o.status === "retiree";
export const total = (o: Order) => o.lines.reduce((s, l) => s + l.price * l.qty, 0);
export const colorHex = (name: string) => [...palette, ...paletteCabas].find((c) => c.name === name)?.hex ?? "#999";

export function addBusinessDays(d: Date, n: number) {
  const r = new Date(d);
  while (n > 0) { r.setDate(r.getDate() + 1); const w = r.getDay(); if (w !== 0 && w !== 6) n--; }
  return r;
}
/** Jours ouvrés restants avant la date limite (négatif = en retard). */
export function businessDaysLeft(deadline: string, now = new Date()) {
  const a = new Date(now); a.setHours(0, 0, 0, 0);
  const b = new Date(deadline); b.setHours(0, 0, 0, 0);
  if (b < a) return -1;
  let n = 0; const c = new Date(a);
  while (c < b) { c.setDate(c.getDate() + 1); const w = c.getDay(); if (w !== 0 && w !== 6) n++; }
  return n;
}
export function urgency(o: Order): "vert" | "orange" | "rouge" {
  const n = businessDaysLeft(o.deadline);
  return n < 0 ? "rouge" : n <= 2 ? "orange" : "vert";
}
export const fmtDate = (s: string) => new Date(s).toLocaleDateString("fr-FR", { weekday: "short", day: "numeric", month: "short" });
export const fmtDateTime = (s: string) => new Date(s).toLocaleString("fr-FR", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });

const relais = { mode: "relais" as const, point: "Tabac Le Balto", address: "12 rue Jeanne-d'Arc, 76000 Rouen" };
const dom = (a: string) => ({ mode: "domicile" as const, address: a });

function seed(): Order[] {
  const now = Date.now();
  const ago = (min: number) => new Date(now - min * 60000);
  const mk = (i: number, o: Partial<Order> & Pick<Order, "customer" | "delivery" | "lines" | "status">, created: Date, deadline?: Date): Order => {
    const custom = o.lines.some((l) => l.custom);
    const dl = deadline ?? addBusinessDays(created, custom ? 8 : 2);
    const f = flow({ ...(o as Order) });
    const idx = f.indexOf(o.status);
    return {
      id: `test-${i}`, number: `GR-${String(i).padStart(4, "0")}`, createdAt: created.toISOString(), test: true,
      gift: { on: false }, stripe_session_id: null, deadline: dl.toISOString(),
      history: f.slice(0, idx + 1).map((s, k) => ({ status: s, at: new Date(created.getTime() + k * 3600000).toISOString() })),
      ...o,
    };
  };
  const today = new Date();
  return [
    mk(1, { customer: { first: "Camille", last: "Durand", email: "camille.durand@exemple.fr", phone: "06 12 34 56 78" }, delivery: relais, status: "nouvelle",
      lines: [{ product: "Le Rond XL", qty: 1, price: 56, custom: { format: "Rond XL", handle: "À étoiles", color: "Bleu marine", text: ["LES JOUETS", "DE LÉO"] } }] }, ago(10)),
    mk(2, { customer: { first: "Sophie", last: "Martin", email: "sophie.martin@exemple.fr", phone: "06 22 33 44 55" }, delivery: dom("4 allée des Tilleuls, 14000 Caen"), status: "vue",
      gift: { on: true, note: "Joyeux anniversaire ma chérie" },
      lines: [{ product: "Le cabas personnalisable", qty: 1, price: 59, custom: { format: "Cabas", handle: "Cuir assorti", color: "Cognac", text: ["LES TRÉSORS", "DE LOUISE"] } }] }, ago(60 * 26)),
    mk(3, { customer: { first: "Anne", last: "Leroy", email: "anne.leroy@exemple.fr", phone: "07 11 22 33 44" }, delivery: relais, status: "fabrication",
      lines: [{ product: "Au coin du feu", variant: "Orange", qty: 1, price: 76 }, { product: "Le Petit classique", variant: "Rouge", qty: 1, price: 39 }] }, ago(60 * 30), addBusinessDays(today, 1)),
    mk(4, { customer: { first: "Julie", last: "Petit", email: "julie.petit@exemple.fr", phone: "06 98 76 54 32" }, delivery: { mode: "atelier" }, status: "fabrication",
      lines: [{ product: "Le BB Rond", qty: 1, price: 43, custom: { format: "BB Rond", handle: "À pois", color: "Rose layette", text: ["DOUDOUS & CIE"] } }] }, ago(60 * 48)),
    mk(5, { customer: { first: "Claire", last: "Moreau", email: "claire.moreau@exemple.fr", phone: "06 45 67 89 01" }, delivery: relais, status: "fabrication",
      lines: [{ product: "Le Carré XXL", qty: 1, price: 64, custom: { format: "Carré XXL", handle: "En corde de chanvre", color: "Vert bouteille", text: ["LE BAZAR", "DE JULES"] } }] }, ago(60 * 24 * 12), new Date(now - 86400000 * 2)),
    mk(6, { customer: { first: "Hélène", last: "Bernard", email: "helene.bernard@exemple.fr", phone: "06 33 44 55 66" }, delivery: dom("18 rue Verte, 76200 Dieppe"), status: "nouvelle",
      lines: [{ product: "Mini vide tes poches", qty: 1, price: 15 }, { product: "Mini peace mémé", qty: 1, price: 15 }, { product: "Mini le gras c'est la vie", qty: 1, price: 15 }] }, ago(180)),
    mk(7, { customer: { first: "Marion", last: "Roux", email: "marion.roux@exemple.fr", phone: "06 77 88 99 00" }, delivery: dom("2 place du Marché, 75011 Paris"), status: "expediee", tracking: "6A12345678901",
      lines: [{ product: "La Parisienne", variant: "Kaki", qty: 1, price: 89 }] }, ago(60 * 24 * 4)),
    mk(8, { customer: { first: "Charlotte", last: "Fournier", email: "charlotte.f@exemple.fr", phone: "07 55 66 77 88" }, delivery: relais, status: "vue",
      lines: [{ product: "Trousse en lin personnalisable", qty: 1, price: 21, custom: { format: "Trousse en lin", color: "Framboise", text: ["CHARLOTTE"] } }] }, ago(60 * 5)),
    mk(9, { customer: { first: "Isabelle", last: "Girard", email: "isabelle.girard@exemple.fr", phone: "06 10 20 30 40" }, delivery: { mode: "atelier" }, status: "prete",
      lines: [{ product: "Le Rond", qty: 1, price: 49, custom: { format: "Rond", handle: "À pois", color: "Noir", text: ["LINGE"] } }] }, ago(60 * 24 * 9)),
    mk(10, { customer: { first: "Nathalie", last: "Lambert", email: "nathalie.lambert@exemple.fr", phone: "06 50 60 70 80" }, delivery: relais, status: "retiree",
      lines: [{ product: "Le Loom", qty: 1, price: 68 }] }, ago(60 * 24 * 6)),
  ];
}

export const DEFAULT_SETTINGS: Settings = { emails: "Marie-Isabel (adresse à venir), henri.dcq@gmail.com", recapHour: 7, relanceHours: 2, copyHenri: true, quietFrom: 20, quietTo: 7 };

const KEY = "gr-marie-v1";
type State = { orders: Order[]; settings: Settings };
let state: State | null = null;
const subs = new Set<() => void>();

function load(): State {
  if (state) return state;
  try { const raw = localStorage.getItem(KEY); if (raw) return (state = JSON.parse(raw)); } catch { /* ignore */ }
  return (state = { orders: seed(), settings: DEFAULT_SETTINGS });
}
function save(next: State) { state = next; localStorage.setItem(KEY, JSON.stringify(next)); subs.forEach((f) => f()); }

export function useAtelier() {
  const [s, setS] = useState<State | null>(null);
  useEffect(() => { setS(load()); const f = () => setS(load()); subs.add(f); return () => { subs.delete(f); }; }, []);
  const update = (id: string, patch: Partial<Order>) => { const cur = load(); save({ ...cur, orders: cur.orders.map((o) => (o.id === id ? { ...o, ...patch } : o)) }); };
  const setStatus = (o: Order, status: Status, extra: Partial<Order> = {}) =>
    update(o.id, { status, history: [...o.history.filter((h) => flow(o).indexOf(h.status) < flow(o).indexOf(status)), { status, at: new Date().toISOString() }], ...extra });
  return {
    ready: !!s, orders: s?.orders ?? [], settings: s?.settings ?? DEFAULT_SETTINGS, update, setStatus,
    saveSettings: (settings: Settings) => save({ ...load(), settings }),
    deleteTests: () => { const cur = load(); save({ ...cur, orders: cur.orders.filter((o) => !o.test) }); },
    reset: () => save({ orders: seed(), settings: load().settings }),
  };
}
