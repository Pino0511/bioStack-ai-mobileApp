/*
# Add protocol slot metadata and onboarding data

## Purpose
The daily protocol now has 3 time slots (morning / afternoon / evening) and
activities carry their own metadata (category, xp, duration) so the routine_progress
table can store a faithful snapshot of each task. Onboarding answers (energy,
sleep, stress, secondary goals, sex) are stored on the profile as JSONB.

## Changes to existing tables (all additive — no data loss)
1. `routine_progress`
   - ADD `slot` text DEFAULT 'morning'  (morning | afternoon | evening)
   - ADD `category` text               (habit | nutrition | supplement | recovery | skincare | movement)
   - ADD `xp` integer DEFAULT 10
   - ADD `duration` text               (e.g. "5 min")
   - DROP+recreate the unique index to include slot, so the same activity_id
     can appear in different slots on the same day without collision.
2. `profiles`
   - ADD `onboarding` jsonb DEFAULT '{}'::jsonb
   - ADD `sex` text
   - ADD `energy_level` integer
   - ADD `sleep_quality` integer
   - ADD `secondary_goals` text[]      (array of secondary focus ids)

## Security
- No policy changes. Existing owner-scoped RLS continues to apply.
- No destructive operations.
*/

-- routine_progress: slot + activity metadata
ALTER TABLE routine_progress
  ADD COLUMN IF NOT EXISTS slot text DEFAULT 'morning';

ALTER TABLE routine_progress
  ADD COLUMN IF NOT EXISTS category text;

ALTER TABLE routine_progress
  ADD COLUMN IF NOT EXISTS xp integer DEFAULT 10;

ALTER TABLE routine_progress
  ADD COLUMN IF NOT EXISTS duration text;

-- Recreate the unique index to include slot (idempotent)
DROP INDEX IF EXISTS routine_progress_user_activity_date_idx;
CREATE UNIQUE INDEX IF NOT EXISTS routine_progress_user_activity_slot_date_idx
  ON routine_progress(user_id, activity_id, slot, date);

-- profiles: onboarding payload + structured fields
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS onboarding jsonb DEFAULT '{}'::jsonb;

ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS sex text;

ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS energy_level integer;

ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS sleep_quality integer;

ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS secondary_goals text[] DEFAULT '{}';
