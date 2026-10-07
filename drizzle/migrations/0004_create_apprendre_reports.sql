CREATE TABLE public.apprendre_reports (id uuid primary key default gen_random_uuid(), created_at timestamptz not null default now(), subject text not null, body text not null);
GRANT SELECT, INSERT ON public.apprendre_reports TO anon;
GRANT ALL ON public.apprendre_reports TO service_role;
ALTER TABLE public.apprendre_reports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anon insert apprendre" ON public.apprendre_reports FOR INSERT TO anon WITH CHECK (length(body) < 400000);
CREATE POLICY "anon read apprendre" ON public.apprendre_reports FOR SELECT TO anon USING (true);