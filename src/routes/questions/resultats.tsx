import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { listQuestionsReports } from "@/lib/questions.functions";

export const Route = createFileRoute("/questions/resultats")({
  head: () => ({
    meta: [
      { title: "Réponses aux questions · Grenouille Rouge" },
      { name: "description", content: "Récapitulatifs enregistrés depuis la page des 6 questions." },
      { property: "og:title", content: "Réponses aux questions · Grenouille Rouge" },
      { property: "og:description", content: "Récapitulatifs enregistrés depuis la page des 6 questions." },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: QuestionsResultats,
});

type Report = { id: string; created_at: string; subject: string; body: string };

function QuestionsResultats() {
  const list = useServerFn(listQuestionsReports);
  const [reports, setReports] = useState<Report[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    list().then(setReports).catch((e) => setError(String(e)));
  }, [list]);

  const download = (r: Report) => {
    const blob = new Blob([r.body], { type: "text/plain;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `questions-grenouille-rouge-${r.created_at.slice(0, 10)}.txt`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  return (
    <div className="mx-auto max-w-xl px-4 py-8 text-lg">
      <h1 className="text-2xl font-medium">Réponses aux questions reçus</h1>
      <p className="mt-2 text-muted-foreground">Chaque fois que « Envoyer à Henri » est pressé, le récap arrive ici.</p>
      {error && <p role="alert" className="mt-4 rounded-2xl bg-muted px-4 py-3 font-semibold">Impossible de charger la liste : {error}</p>}
      {reports && reports.length === 0 && <p className="mt-6 text-xl">Rien pour l'instant — les questions n'ont pas encore été envoyées.</p>}
      <ul className="mt-6 space-y-4">
        {reports?.map((r) => (
          <li key={r.id} className="rounded-2xl border-2 bg-card p-4">
            <p className="font-semibold">{r.subject}</p>
            <p className="text-base text-muted-foreground">
              {new Date(r.created_at).toLocaleString("fr-FR", { dateStyle: "long", timeStyle: "short" })}
            </p>
            <div className="mt-3 flex gap-3">
              <button type="button" onClick={() => download(r)} className="min-h-12 flex-1 rounded-2xl bg-foreground px-4 font-semibold text-background">
                Télécharger le récap
              </button>
              <details className="flex-1">
                <summary className="grid min-h-12 cursor-pointer place-items-center rounded-2xl border-2 px-4 font-semibold">Voir</summary>
                <pre className="mt-3 max-h-96 overflow-auto whitespace-pre-wrap rounded-xl bg-muted p-3 text-sm">{r.body.split("DONNÉES BRUTES")[0]}</pre>
              </details>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
