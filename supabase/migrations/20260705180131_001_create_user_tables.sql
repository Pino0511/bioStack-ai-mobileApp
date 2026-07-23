/*
# Create user tables for BioStack AI

## Tables Created:
1. `profiles` - User profile data
   - `id` (uuid, primary key, references auth.users)
   - `name` (text, default 'User')
   - `age` (integer, default 25)
   - `skin_type` (text, nullable - 'dry', 'oily', 'combination')
   - `goal` (text, nullable - 'skincare', 'posture', 'focus')
   - `budget` (text, nullable - 'low', 'medium', 'elite')
   - `is_premium` (boolean, default false)
   - `subscription_plan` (text, default 'annual')
   - `dark_mode` (boolean, default false)
   - `language` (text, default 'it')
   - `created_at` (timestamp)
   - `updated_at` (timestamp)

2. `routine_progress` - Daily routine checkbox states
   - `id` (uuid, primary key)
   - `user_id` (uuid, references profiles.id)
   - `activity_id` (text, not null)
   - `activity_name` (text, not null)
   - `is_morning` (boolean, not null)
   - `completed` (boolean, default false)
   - `date` (date, not null)
   - `updated_at` (timestamp)

3. `scan_history` - AI scan results and photos
   - `id` (uuid, primary key)
   - `user_id` (uuid, references profiles.id)
   - `image_url` (text, not null)
   - `dry_skin` (boolean, default false)
   - `jawline_asymmetry` (boolean, default false)
   - `hydration_score` (integer, nullable)
   - `symmetry_score` (integer, nullable)
   - `created_at` (timestamp)

4. `progress_photos` - Before/After diary photos
   - `id` (uuid, primary key)
   - `user_id` (uuid, references profiles.id)
   - `image_url` (text, not null)
   - `type` (text, not null - 'before' or 'after')
   - `symmetry_improvement` (integer, nullable)
   - `hydration_improvement` (integer, nullable)
   - `lines_reduction` (integer, nullable)
   - `glowup_score` (integer, nullable)
   - `created_at` (timestamp)

## Security:
- Enable RLS on all tables
- Owner-scoped CRUD policies for authenticated users
- All user_id columns default to auth.uid()
*/

-- Profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  name text DEFAULT 'User',
  age integer DEFAULT 25,
  skin_type text,
  goal text,
  budget text,
  is_premium boolean DEFAULT false,
  subscription_plan text DEFAULT 'annual',
  dark_mode boolean DEFAULT false,
  language text DEFAULT 'it',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_profile" ON profiles;
CREATE POLICY "select_own_profile" ON profiles FOR SELECT
  TO authenticated USING (auth.uid() = id);

DROP POLICY IF EXISTS "insert_own_profile" ON profiles;
CREATE POLICY "insert_own_profile" ON profiles FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "update_own_profile" ON profiles;
CREATE POLICY "update_own_profile" ON profiles FOR UPDATE
  TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- Routine progress table
CREATE TABLE IF NOT EXISTS routine_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES profiles(id) ON DELETE CASCADE,
  activity_id text NOT NULL,
  activity_name text NOT NULL,
  is_morning boolean NOT NULL,
  completed boolean DEFAULT false,
  date date NOT NULL DEFAULT CURRENT_DATE,
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE routine_progress ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_routine" ON routine_progress;
CREATE POLICY "select_own_routine" ON routine_progress FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_routine" ON routine_progress;
CREATE POLICY "insert_own_routine" ON routine_progress FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_routine" ON routine_progress;
CREATE POLICY "update_own_routine" ON routine_progress FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_routine" ON routine_progress;
CREATE POLICY "delete_own_routine" ON routine_progress FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- Scan history table
CREATE TABLE IF NOT EXISTS scan_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES profiles(id) ON DELETE CASCADE,
  image_url text NOT NULL,
  dry_skin boolean DEFAULT false,
  jawline_asymmetry boolean DEFAULT false,
  hydration_score integer,
  symmetry_score integer,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE scan_history ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_scans" ON scan_history;
CREATE POLICY "select_own_scans" ON scan_history FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_scans" ON scan_history;
CREATE POLICY "insert_own_scans" ON scan_history FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_scans" ON scan_history;
CREATE POLICY "delete_own_scans" ON scan_history FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- Progress photos table
CREATE TABLE IF NOT EXISTS progress_photos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES profiles(id) ON DELETE CASCADE,
  image_url text NOT NULL,
  type text NOT NULL,
  symmetry_improvement integer,
  hydration_improvement integer,
  lines_reduction integer,
  glowup_score integer,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE progress_photos ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_photos" ON progress_photos;
CREATE POLICY "select_own_photos" ON progress_photos FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_photos" ON progress_photos;
CREATE POLICY "insert_own_photos" ON progress_photos FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_photos" ON progress_photos;
CREATE POLICY "update_own_photos" ON progress_photos FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_photos" ON progress_photos;
CREATE POLICY "delete_own_photos" ON progress_photos FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- Create unique index for routine_progress per user per activity per date
CREATE UNIQUE INDEX IF NOT EXISTS routine_progress_user_activity_date_idx 
  ON routine_progress(user_id, activity_id, date);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS routine_progress_user_date_idx ON routine_progress(user_id, date);
CREATE INDEX IF NOT EXISTS scan_history_user_idx ON scan_history(user_id);
CREATE INDEX IF NOT EXISTS progress_photos_user_type_idx ON progress_photos(user_id, type);