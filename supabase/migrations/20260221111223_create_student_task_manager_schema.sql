/*
  # Student Task Manager Database Schema

  ## Overview
  This migration sets up the complete database schema for the Student Task Manager application,
  including user profiles and task management tables with proper security policies.

  ## New Tables

  ### 1. `profiles`
  Stores user profile information linked to auth.users
  - `id` (uuid, primary key) - References auth.users(id)
  - `email` (text) - User's email address
  - `full_name` (text) - Student's full name
  - `created_at` (timestamptz) - Account creation timestamp
  - `updated_at` (timestamptz) - Last profile update timestamp

  ### 2. `tasks`
  Stores all student tasks with comprehensive details
  - `id` (uuid, primary key) - Unique task identifier
  - `user_id` (uuid, foreign key) - References profiles(id)
  - `title` (text) - Task title/name
  - `description` (text) - Detailed task description
  - `subject` (text) - Academic subject (e.g., "Mathematics", "Physics")
  - `category` (text) - Task type: Assignment, Project, Exam, Personal Study
  - `priority` (text) - Priority level: High, Medium, Low
  - `status` (text) - Current status: Pending, In Progress, Completed
  - `start_date` (date) - Task start date
  - `due_date` (date) - Task deadline
  - `completed_at` (timestamptz) - Timestamp when task was completed
  - `created_at` (timestamptz) - Task creation timestamp
  - `updated_at` (timestamptz) - Last task update timestamp

  ## Security

  ### Row Level Security (RLS)
  - All tables have RLS enabled
  - Users can only access their own profile data
  - Users can only manage their own tasks
  - Policies enforce authentication requirements

  ## Important Notes
  1. All timestamps use timezone-aware timestamptz type
  2. Foreign key constraints ensure data integrity
  3. Indexes on user_id and due_date optimize query performance
  4. Default values prevent null-related issues
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  full_name text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create tasks table
CREATE TABLE IF NOT EXISTS tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text DEFAULT '',
  subject text DEFAULT '',
  category text NOT NULL DEFAULT 'Assignment',
  priority text NOT NULL DEFAULT 'Medium',
  status text NOT NULL DEFAULT 'Pending',
  start_date date,
  due_date date,
  completed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS tasks_user_id_idx ON tasks(user_id);
CREATE INDEX IF NOT EXISTS tasks_due_date_idx ON tasks(due_date);
CREATE INDEX IF NOT EXISTS tasks_status_idx ON tasks(status);
CREATE INDEX IF NOT EXISTS tasks_priority_idx ON tasks(priority);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Tasks policies
CREATE POLICY "Users can view own tasks"
  ON tasks FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own tasks"
  ON tasks FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own tasks"
  ON tasks FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete own tasks"
  ON tasks FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());