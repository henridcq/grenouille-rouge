import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { toast } from "sonner";
import { useNavigate } from "@tanstack/react-router";
import { byId, type Product } from "@/data/products";

type Line = { id: string; qty: number };
type Ctx = {
  lines: (Line & { product: Product })[];
  count: number;
  total: number;
  open: boolean;
  setOpen: (o: boolean) => void;
  bump: number;
  add: (ids: string | string[]) => void;
  setQty: (id: string, qty: number) => void;
  clear: () => void;
};

const CartCtx = createContext<Ctx | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [raw, setRaw] = useState<Line[]>([]);
  const [open, setOpen] = useState(false);
  const [bump, setBump] = useState(0);
  const navigate = useNavigate();

  const value = useMemo<Ctx>(() => {
    const lines = raw.map((l) => ({ ...l, product: byId(l.id) }));
    return {
      lines,
      count: lines.reduce((s, l) => s + l.qty, 0),
      total: lines.reduce((s, l) => s + l.qty * l.product.price, 0),
      open,
      setOpen,
      bump,
      add: (ids) => {
        const list = Array.isArray(ids) ? ids : [ids];
        setRaw((prev) => {
          const next = [...prev];
          for (const id of list) {
            const f = next.find((l) => l.id === id);
            if (f) f.qty += 1;
            else next.push({ id, qty: 1 });
          }
          return next.map((l) => ({ ...l }));
        });
        setBump((b) => b + 1);
        toast.success(list.length > 1 ? "Le lot est dans votre panier" : "Ajouté au panier", {
          duration: 2000,
          action: { label: "Commander", onClick: () => navigate({ to: "/commande" }) },
        });
      },
      setQty: (id, qty) =>
        setRaw((prev) => (qty <= 0 ? prev.filter((l) => l.id !== id) : prev.map((l) => (l.id === id ? { ...l, qty } : l)))),
      clear: () => setRaw([]),
    };
  }, [raw, open, bump, navigate]);

  return <CartCtx.Provider value={value}>{children}</CartCtx.Provider>;
}

export function useCart() {
  const c = useContext(CartCtx);
  if (!c) throw new Error("useCart outside provider");
  return c;
}
