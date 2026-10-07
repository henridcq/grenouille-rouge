import { createFileRoute } from "@tanstack/react-router";
import { businessDaysLeft, isDone, useAtelier } from "@/lib/marie-orders";
import { OrderList } from "@/components/marie/OrderList";

export const Route = createFileRoute("/marie/")({ component: Today });

function Today() {
  const { ready, orders } = useAtelier();
  if (!ready) return null;
  const open = orders.filter((o) => !isDone(o)).sort((a, b) => a.deadline.localeCompare(b.deadline));
  const nouvelles = open.filter((o) => o.status === "nouvelle").length;
  const fab = open.filter((o) => o.status === "fabrication").length;
  const urgent = open.filter((o) => o.status !== "prete" && businessDaysLeft(o.deadline) <= 0).length;
  const card = "border bg-card p-4 text-center";
  return (
    <div>
      <h1 className="text-2xl">Aujourd'hui</h1>
      <div className="mt-4 grid grid-cols-3 gap-3">
        <div className={`${card} ${nouvelles > 0 ? "border-primary text-primary" : ""}`}><div className="font-display text-4xl">{nouvelles}</div><div className="text-sm">Nouvelles</div></div>
        <div className={card}><div className="font-display text-4xl">{fab}</div><div className="text-sm">En fabrication</div></div>
        <div className={card}><div className="font-display text-4xl">{urgent}</div><div className="text-sm">À expédier aujourd'hui ou en retard</div></div>
      </div>
      <h2 className="mt-8 mb-3 text-xl">Commandes en cours</h2>
      <OrderList orders={open} />
    </div>
  );
}
