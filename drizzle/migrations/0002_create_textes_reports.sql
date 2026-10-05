CREATE TABLE public.textes_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  subject text NOT NULL,
  body text NOT NULL
);
GRANT SELECT, INSERT ON public.textes_reports TO anon;
GRANT ALL ON public.textes_reports TO service_role;
ALTER TABLE public.textes_reports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Dépôt public des récaps textes" ON public.textes_reports FOR INSERT TO anon WITH CHECK (length(body) < 400000);
CREATE POLICY "Lecture des récaps textes" ON public.textes_reports FOR SELECT TO anon USING (true);