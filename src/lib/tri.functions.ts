import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

/**
 * Envoi du récap de tri à Henri.
 * Pas encore branché : il faut d'abord un domaine d'envoi d'emails vérifié.
 * Tant que ce n'est pas fait, la page propose « Copier » et « Ma messagerie ».
 */
export const sendTriReport = createServerFn({ method: "POST" })
  .inputValidator((d) => z.object({ subject: z.string().max(200), body: z.string().max(400_000) }).parse(d))
  .handler(async () => {
    return { ok: false as const, reason: "email_not_configured" };
  });
