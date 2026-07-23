/*
# Add gamification, reminders, and user settings tables

## Tables:
1. `gamification_stats` - XP points, streaks, levels
   - `id` (uuid, primary key)
   - `user_id` (uuid, references profiles.id)
   - `xp_points` (integer, default 0)
   - `streak_days` (integer, default 0)
   - `last_completion_date` (date)
   - `level` (integer, default 1)
   - `created_at` (timestamp)
   - `updated_at` (timestamp)

2. `user_reminders` - Reminder settings and schedules
   - `id` (uuid, primary key)
   - `user_id` (uuid, references profiles.id)
   - `morning_reminder_enabled` (boolean, default false)
   - `morning_reminder_time` (time, default '08:00')
   - `evening_reminder_enabled` (boolean, default false)
   - `evening_reminder_time` (time, default '22:30')
   - `weekly_scan_reminder` (boolean, default false)
   - `weekly_scan_day` (integer, default 0)
   - `created_at` (timestamp)
   - `updated_at` (timestamp)

3. `support_tickets` - User support messages
   - `id` (uuid, primary key)
   - `user_id` (uuid, references auth.users)
   - `message` (text, not null)
   - `status` (text, default 'open')
   - `created_at` (timestamp)

## Security:
- RLS enabled on all tables
- Owner-scoped CRUD policies
*/

-- Gamification stats table
CREATE TABLE IF NOT EXISTS gamification_stats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES profiles(id) ON DELETE CASCADE,
  xp_points integer DEFAULT 0,
  streak_days integer DEFAULT 0,
  last_completion_date date,
  level integer DEFAULT 1,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

ALTER TABLE gamification_stats ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_gamification" ON gamification_stats;
CREATE POLICY "select_own_gamification" ON gamification_stats FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_gamification" ON gamification_stats;
CREATE POLICY "insert_own_gamification" ON gamification_stats FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_gamification" ON gamification_stats;
CREATE POLICY "update_own_gamification" ON gamification_stats FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- User reminders table
CREATE TABLE IF NOT EXISTS user_reminders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES profiles(id) ON DELETE CASCADE,
  morning_reminder_enabled boolean DEFAULT false,
  morning_reminder_time time DEFAULT '08:00',
  evening_reminder_enabled boolean DEFAULT false,
  evening_reminder_time time DEFAULT '22:30',
  weekly_scan_reminder boolean DEFAULT false,
  weekly_scan_day integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

ALTER TABLE user_reminders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_reminders" ON user_reminders;
CREATE POLICY "select_own_reminders" ON user_reminders FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_reminders" ON user_reminders;
CREATE POLICY "insert_own_reminders" ON user_reminders FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_reminders" ON user_reminders;
CREATE POLICY "update_own_reminders" ON user_reminders FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Support tickets table
CREATE TABLE IF NOT EXISTS support_tickets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  message text NOT NULL,
  status text DEFAULT 'open',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_tickets" ON support_tickets;
CREATE POLICY "select_own_tickets" ON support_tickets FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_tickets" ON support_tickets;
CREATE POLICY "insert_own_tickets" ON support_tickets FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);