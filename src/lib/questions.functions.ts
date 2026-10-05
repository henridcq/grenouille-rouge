import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

/** Client public (clé publishable) pour la page privée /questions : dépôt et lecture des récaps. */
function publicClient() {
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;
  return createClient<Database>(process.env["SUPABASE_URL"]!, key, {
    auth: { persistSession: false },
    global: {
      fetch: (input, init) => {
        const h = new Headers(init?.headers);
        if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) h.delete("Authorization");
        h.set("apikey", key);
        return fetch(input, { ...init, headers: h });
      },
    },
  });
}

/** Enregistre le récap de tri dans la base (bouton « Mission accomplie »). */
export const saveQuestionsReport = createServerFn({ method: "POST" })
  .inputValidator((d) => z.object({ subject: z.string().max(200), body: z.string().max(400_000) }).parse(d))
  .handler(async ({ data }) => {
    const { error } = await publicClient().from("questions_reports").insert({ subject: data.subject, body: data.body });
    if (error) return { ok: false as const, reason: error.message };
    return { ok: true as const };
  });

/** Liste les récaps enregistrés, du plus récent au plus ancien. */
export const listQuestionsReports = createServerFn({ method: "GET" }).handler(async () => {
  const { data, error } = await publicClient()
    .from("questions_reports")
    .select("id, created_at, subject, body")
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data;
});
