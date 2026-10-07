CREATE TABLE public.backoffice_reports (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), created_at timestamptz NOT NULL DEFAULT now(), subject text NOT NULL, body text NOT NULL);
GRANT SELECT, INSERT ON public.backoffice_reports TO anon;
GRANT ALL ON public.backoffice_reports TO service_role;
ALTER TABLE public.backoffice_reports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anon insert backoffice" ON public.backoffice_reports FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "anon read backoffice" ON public.backoffice_reports FOR SELECT TO anon USING (true);