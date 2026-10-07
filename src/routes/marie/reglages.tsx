import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { useAtelier, type Settings } from "@/lib/marie-orders";

export const Route = createFileRoute("/marie/reglages")({ component: Reglages });

function Reglages() {
  const { ready, settings, saveSettings, deleteTests, reset, orders } = useAtelier();
  if (!ready) return null;
  const set = (p: Partial<Settings>) => saveSettings({ ...settings, ...p });
  const num = "h-12 w-20 border bg-card px-3 text-center";
  const tests = orders.filter((o) => o.test).length;
  return (
    <div className="max-w-xl space-y-6">
      <h1 className="text-2xl">Réglages</h1>
      <label className="block">Adresses qui reçoivent les notifications
        <textarea value={settings.emails} onChange={(e) => set({ emails: e.target.value })} className="mt-1 w-full border bg-card p-3" rows={2} />
      </label>
      <label className="flex items-center justify-between">Heure du récap du matin (lun.–sam.)
        <span><input type="number" min={0} max={23} value={settings.recapHour} onChange={(e) => set({ recapHour: +e.target.value })} className={num} /> h</span>
      </label>
      <label className="flex items-center justify-between">Relance si pas vue au bout de
        <span><input type="number" min={1} max={24} value={settings.relanceHours} onChange={(e) => set({ relanceHours: +e.target.value })} className={num} /> h</span>
      </label>
      <label className="flex items-center justify-between">Copie à Henri si la relance reste sans réponse
        <input type="checkbox" checked={settings.copyHenri} onChange={(e) => set({ copyHenri: e.target.checked })} className="h-6 w-6 accent-[var(--sage)]" />
      </label>
      <div className="flex items-center justify-between">Heures calmes
        <span><input type="number" min={0} max={23} value={settings.quietFrom} onChange={(e) => set({ quietFrom: +e.target.value })} className={num} /> h à <input type="number" min={0} max={23} value={settings.quietTo} onChange={(e) => set({ quietTo: +e.target.value })} className={num} /> h</span>
      </div>
      <button onClick={() => toast("🐸 Ceci est une notification de test. (Maquette : rien n'est encore envoyé.)")} className="btn-soft w-full">M'envoyer une notification de test</button>
      <hr />
      <button onClick={() => { if (confirm(`Supprimer les ${tests} commandes de test ?`)) deleteTests(); }} className="btn-soft w-full" disabled={!tests}>Supprimer toutes les commandes de test ({tests})</button>
      <button onClick={reset} className="w-full text-sm underline">Remettre les 10 commandes de test</button>
      <p className="text-sm text-muted-foreground">Maquette : les e-mails et notifications ne partent pas encore. Tout est gardé dans ce navigateur.</p>
    </div>
  );
}
