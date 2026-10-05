CREATE TABLE public.tri_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  subject text NOT NULL,
  body text NOT NULL
);

GRANT SELECT, INSERT ON public.tri_reports TO anon;
GRANT ALL ON public.tri_reports TO service_role;

ALTER TABLE public.tri_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Tout le monde peut déposer un récap"
ON public.tri_reports FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "Lecture des récaps"
ON public.tri_reports FOR SELECT TO anon USING (true);