-- Run once in Supabase SQL Editor for existing classrooms.
ALTER TABLE public.class_groups DROP CONSTRAINT IF EXISTS class_groups_stage_check;
ALTER TABLE public.class_groups ADD CONSTRAINT class_groups_stage_check CHECK (stage BETWEEN 1 AND 6);
