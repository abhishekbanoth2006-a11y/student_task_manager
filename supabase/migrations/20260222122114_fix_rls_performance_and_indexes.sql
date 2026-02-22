/*
  # Fix RLS Performance Issues and Remove Unused Indexes

  ## Changes

  ### 1. RLS Policy Optimization
  Replace auth.uid() calls with (select auth.uid()) to improve query performance
  at scale by avoiding re-evaluation for each row.
  
  ### 2. Remove Unused Indexes
  Remove indexes on due_date, status, and priority that aren't being used
  in current query patterns.

  ## Details
  - Optimize all auth.uid() calls in profiles table policies
  - Optimize all auth.uid() calls in tasks table policies
  - Drop unused indexes for better write performance
  - Keep user_id index as it's essential for filtering
*/

DROP INDEX IF EXISTS tasks_due_date_idx;
DROP INDEX IF EXISTS tasks_status_idx;
DROP INDEX IF EXISTS tasks_priority_idx;

DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

DROP POLICY IF EXISTS "Users can view own tasks" ON tasks;
DROP POLICY IF EXISTS "Users can insert own tasks" ON tasks;
DROP POLICY IF EXISTS "Users can update own tasks" ON tasks;
DROP POLICY IF EXISTS "Users can delete own tasks" ON tasks;

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (id = (select auth.uid()));

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (id = (select auth.uid()));

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (id = (select auth.uid()))
  WITH CHECK (id = (select auth.uid()));

CREATE POLICY "Users can view own tasks"
  ON tasks FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

CREATE POLICY "Users can insert own tasks"
  ON tasks FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "Users can update own tasks"
  ON tasks FOR UPDATE
  TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "Users can delete own tasks"
  ON tasks FOR DELETE
  TO authenticated
  USING (user_id = (select auth.uid()));
