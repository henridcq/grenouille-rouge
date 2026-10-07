import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { isDone, useAtelier } from "@/lib/marie-orders";
import { OrderList } from "@/components/marie/OrderList";

export const Route = createFileRoute("/marie/terminees")({ component: Done });

function Done() {
  const { ready, orders } = useAtelier();
  const [q, setQ] = useState("");
  if (!ready) return null;
  const s = q.trim().toLowerCase();
  const list = orders
    .filter(isDone)
    .filter((o) => !s || `${o.number} ${o.customer.first} ${o.customer.last}`.toLowerCase().includes(s))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  return (
    <div>
      <h1 className="text-2xl">Terminées</h1>
      <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Chercher un nom ou un numéro" className="mt-4 mb-4 h-12 w-full border bg-card px-3" />
      <OrderList orders={list} done />
    </div>
  );
}
