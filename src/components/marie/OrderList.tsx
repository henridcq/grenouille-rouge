import { Link } from "@tanstack/react-router";
import { DELIVERY_LABEL, STATUS_LABEL, fmtDate, total, urgency, type Order } from "@/lib/marie-orders";

const DOT = { vert: "bg-[#2E7D4F]", orange: "bg-[#E08A1E]", rouge: "bg-primary" } as const;
const DOT_LABEL = { vert: "Large", orange: "Bientôt", rouge: "En retard" } as const;

export function Dot({ o }: { o: Order }) {
  const u = urgency(o);
  return <span className="inline-flex items-center gap-1.5 text-xs"><span className={`h-3 w-3 rounded-full ${DOT[u]}`} />{DOT_LABEL[u]}</span>;
}
export const TestBadge = () => <span className="border border-foreground/40 px-1.5 text-[10px] tracking-wider">TEST</span>;

function summary(o: Order) {
  const l = o.lines[0]!;
  const t = l.custom ? ` « ${l.custom.text.join(" ")} »` : "";
  return `${l.product}${t}${o.lines.length > 1 ? ` + ${o.lines.length - 1} autre${o.lines.length > 2 ? "s" : ""}` : ""}`;
}

export function OrderList({ orders, done }: { orders: Order[]; done?: boolean }) {
  if (!orders.length) return <p className="py-10 text-center text-muted-foreground">Rien ici pour l'instant.</p>;
  return (
    <>
      {/* Téléphone : cartes empilées */}
      <ul className="space-y-3 md:hidden">
        {orders.map((o) => (
          <li key={o.id}>
            <Link to="/marie/commande/$id" params={{ id: o.id }} className="block border bg-card p-4">
              <div className="flex items-center justify-between">
                <span className="font-medium">{o.number} {o.test && <TestBadge />}</span>
                {!done && <Dot o={o} />}
              </div>
              <p className="mt-1">{summary(o)}</p>
              <p className="mt-1 text-sm text-muted-foreground">{o.customer.first} {o.customer.last} · {DELIVERY_LABEL[o.delivery.mode]}</p>
              <div className="mt-2 flex justify-between text-sm"><span className="text-sage">{STATUS_LABEL[o.status]}</span><span>{done ? "" : `avant le ${fmtDate(o.deadline)}`}</span></div>
            </Link>
          </li>
        ))}
      </ul>
      {/* Ordinateur : tableau */}
      <table className="hidden w-full text-left text-sm md:table">
        <thead className="border-b text-muted-foreground">
          <tr><th className="py-2">N°</th><th>Commande</th><th>Cliente</th><th>Livraison</th><th>Statut</th><th>{done ? "Total" : "Date limite"}</th>{!done && <th />}</tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o.id} className="border-b hover:bg-card">
              <td className="py-3"><Link to="/marie/commande/$id" params={{ id: o.id }} className="font-medium underline-offset-2 hover:underline">{o.number}</Link> {o.test && <TestBadge />}</td>
              <td>{summary(o)}</td>
              <td>{o.customer.first} {o.customer.last}</td>
              <td>{DELIVERY_LABEL[o.delivery.mode]}</td>
              <td className="text-sage">{STATUS_LABEL[o.status]}</td>
              <td>{done ? `${total(o)} €` : fmtDate(o.deadline)}</td>
              {!done && <td><Dot o={o} /></td>}
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
