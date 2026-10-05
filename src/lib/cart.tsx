import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { toast } from "sonner";
import { bySlug, type Product } from "@/data/products";
import type { CustomConfig } from "@/data/custom";

type Line = { key: string; slug: string; qty: number; custom?: CustomConfig | undefined; variant?: string | undefined; unit?: number | undefined };
export type CartLine = Line & { product: Product; price: number };
type Ctx = {
  lines: CartLine[];
  count: number;
  total: number;
  open: boolean;
  setOpen: (o: boolean) => void;
  bump: number;
  gift: boolean;
  setGift: (g: boolean) => void;
  note: string;
  setNote: (n: string) => void;
  add: (slug: string, custom?: CustomConfig, variant?: { label: string; price: number }) => void;
  setQty: (key: string, qty: number) => void;
  clear: () => void;
};

const CartCtx = createContext<Ctx | null>(null);
let n = 0;

export function CartProvider({ children }: { children: ReactNode }) {
  const [raw, setRaw] = useState<Line[]>([]);
  const [open, setOpen] = useState(false);
  const [bump, setBump] = useState(0);
  const [gift, setGift] = useState(false);
  const [note, setNote] = useState("");

  const value = useMemo<Ctx>(() => {
    const lines = raw.flatMap((l) => {
      const product = bySlug(l.slug);
      return product ? [{ ...l, product, price: l.unit ?? product.price }] : [];
    });
    return {
      lines,
      count: lines.reduce((s, l) => s + l.qty, 0),
      total: lines.reduce((s, l) => s + l.qty * l.price, 0),
      open, setOpen, bump, gift, setGift, note, setNote,
      add: (slug, custom, variant) => {
        setRaw((prev) => {
          if (!custom) {
            const f = prev.find((l) => l.slug === slug && !l.custom && l.variant === variant?.label);
            if (f) return prev.map((l) => (l === f ? { ...l, qty: l.qty + 1 } : l));
          }
          return [...prev, { key: `${slug}-${++n}`, slug, qty: 1, custom, variant: variant?.label, unit: variant?.price }];
        });
        setBump((b) => b + 1);
        toast("Ajouté !", {
          duration: 3000,
          action: { label: "Voir le panier", onClick: () => setOpen(true) },
          cancel: { label: "Continuer", onClick: () => {} },
        });
      },
      setQty: (key, qty) =>
        setRaw((prev) => (qty <= 0 ? prev.filter((l) => l.key !== key) : prev.map((l) => (l.key === key ? { ...l, qty } : l)))),
      clear: () => { setRaw([]); setGift(false); setNote(""); },
    };
  }, [raw, open, bump, gift, note]);

  return <CartCtx.Provider value={value}>{children}</CartCtx.Provider>;
}

export function useCart() {
  const c = useContext(CartCtx);
  if (!c) throw new Error("useCart outside provider");
  return c;
}
