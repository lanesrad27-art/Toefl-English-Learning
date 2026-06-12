-- ============================================================
-- TOEFLPro Platform — Supabase schema
-- Run this whole file in Supabase → SQL Editor → New query.
-- ============================================================

-- users_profile -------------------------------------------------
CREATE TABLE IF NOT EXISTS users_profile (
  id UUID REFERENCES auth.users PRIMARY KEY,
  full_name TEXT,
  target_score INTEGER,
  current_level TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- user_progress -------------------------------------------------
CREATE TABLE IF NOT EXISTS user_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users,
  section TEXT, -- reading, listening, speaking, writing, structure, vocabulary
  score INTEGER,
  total_questions INTEGER,
  time_spent INTEGER, -- seconds
  created_at TIMESTAMP DEFAULT NOW()
);

-- user_streak ---------------------------------------------------
CREATE TABLE IF NOT EXISTS user_streak (
  user_id UUID REFERENCES auth.users PRIMARY KEY,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_activity_date DATE
);

-- error_journal -------------------------------------------------
CREATE TABLE IF NOT EXISTS error_journal (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users,
  question_id TEXT,
  question_text TEXT,
  user_answer TEXT,
  correct_answer TEXT,
  explanation TEXT,
  category TEXT,
  reviewed BOOLEAN DEFAULT FALSE,
  correct_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- vocabulary_srs ------------------------------------------------
CREATE TABLE IF NOT EXISTS vocabulary_srs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users,
  word_id TEXT,
  interval_days INTEGER DEFAULT 1,
  next_review DATE,
  ease_factor FLOAT DEFAULT 2.5,
  repetitions INTEGER DEFAULT 0
);

-- daily_journal -------------------------------------------------
CREATE TABLE IF NOT EXISTS daily_journal (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users,
  entry_text TEXT,
  speaking_recording_url TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- study_plan ----------------------------------------------------
CREATE TABLE IF NOT EXISTS study_plan (
  user_id UUID REFERENCES auth.users PRIMARY KEY,
  plan_data JSONB,
  target_date DATE,
  daily_hours INTEGER,
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================
-- Row Level Security: each user can only read/write their own rows
-- ============================================================
ALTER TABLE users_profile  ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress  ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_streak    ENABLE ROW LEVEL SECURITY;
ALTER TABLE error_journal  ENABLE ROW LEVEL SECURITY;
ALTER TABLE vocabulary_srs ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_journal  ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_plan     ENABLE ROW LEVEL SECURITY;

-- Helper macro pattern repeated per table -----------------------
-- DROP first so this file can be re-run safely (idempotent).
DROP POLICY IF EXISTS "own profile"  ON users_profile;
DROP POLICY IF EXISTS "own progress" ON user_progress;
DROP POLICY IF EXISTS "own streak"   ON user_streak;
DROP POLICY IF EXISTS "own errors"   ON error_journal;
DROP POLICY IF EXISTS "own srs"      ON vocabulary_srs;
DROP POLICY IF EXISTS "own journal"  ON daily_journal;
DROP POLICY IF EXISTS "own plan"     ON study_plan;

CREATE POLICY "own profile"  ON users_profile  FOR ALL USING (auth.uid() = id)      WITH CHECK (auth.uid() = id);
CREATE POLICY "own progress" ON user_progress  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own streak"   ON user_streak    FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own errors"   ON error_journal  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own srs"      ON vocabulary_srs FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own journal"  ON daily_journal  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own plan"     ON study_plan     FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Auto-create a profile row when a new auth user signs up -------
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users_profile (id, full_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', ''));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
