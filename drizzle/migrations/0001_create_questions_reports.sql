CREATE TABLE public.questions_reports (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), created_at timestamptz NOT NULL DEFAULT now(), subject text NOT NULL, body text NOT NULL);
GRANT SELECT, INSERT ON public.questions_reports TO anon;
GRANT ALL ON public.questions_reports TO service_role;
ALTER TABLE public.questions_reports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anon can insert questions reports" ON public.questions_reports FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "anon can read questions reports" ON public.questions_reports FOR SELECT TO anon USING (true);