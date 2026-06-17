-- ============================================================
-- EduConnect — Complete Database Schema
-- Run this FIRST in Supabase SQL Editor, then run seed.sql
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- 1. SCHOOLS
-- ============================================================
CREATE TABLE IF NOT EXISTS schools (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name          TEXT NOT NULL,
  address       TEXT,
  contact_email TEXT NOT NULL,
  subscription_plan   TEXT NOT NULL DEFAULT 'basic'
    CHECK (subscription_plan IN ('free','basic','pro','enterprise')),
  subscription_status TEXT NOT NULL DEFAULT 'active'
    CHECK (subscription_status IN ('trial','active','past_due','canceled')),
  status        TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending','approved','suspended')),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- 2. USERS (all roles share one table)
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
  id             UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  school_id      UUID REFERENCES schools(id) ON DELETE SET NULL,
  name           TEXT NOT NULL,
  email          TEXT NOT NULL UNIQUE,
  phone          TEXT,
  role           TEXT NOT NULL DEFAULT 'student'
    CHECK (role IN ('super_admin','school_admin','tutor','student')),
  is_active      BOOLEAN NOT NULL DEFAULT true,
  last_login_at  TIMESTAMPTZ,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- 3. STUDENTS
-- ============================================================
CREATE TABLE IF NOT EXISTS students (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id       UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  school_id     UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  class_grade   TEXT NOT NULL,
  section       TEXT,
  parent_name   TEXT,
  parent_email  TEXT,
  parent_phone  TEXT,
  roll_number   TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- 4. TUTORS
-- ============================================================
CREATE TABLE IF NOT EXISTS tutors (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id       UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  subjects      TEXT[] NOT NULL DEFAULT '{}',
  bio           TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- 5. TUTOR ASSIGNMENTS (which tutor teaches at which school)
-- ============================================================
CREATE TABLE IF NOT EXISTS tutor_assignments (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tutor_id      UUID NOT NULL REFERENCES tutors(id) ON DELETE CASCADE,
  school_id     UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  subject       TEXT NOT NULL,
  class_grade   TEXT NOT NULL,
  is_active     BOOLEAN NOT NULL DEFAULT true,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(tutor_id, school_id, subject, class_grade)
);

-- ============================================================
-- 6. PROJECTS (assignments created by tutors)
-- ============================================================
CREATE TABLE IF NOT EXISTS projects (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tutor_id      UUID NOT NULL REFERENCES tutors(id) ON DELETE CASCADE,
  school_id     UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  title         TEXT NOT NULL,
  description   TEXT NOT NULL DEFAULT '',
  class_grade   TEXT NOT NULL,
  section       TEXT,
  due_date      DATE NOT NULL,
  max_marks     INTEGER NOT NULL DEFAULT 100,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- 7. SUBMISSIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS submissions (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id      UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  student_id      UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  file_url        TEXT,
  notes           TEXT,
  submitted_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  marks_obtained  INTEGER,
  feedback        TEXT,
  graded_at       TIMESTAMPTZ,
  UNIQUE(project_id, student_id)
);

-- ============================================================
-- 8. ATTENDANCE
-- ============================================================
CREATE TABLE IF NOT EXISTS attendance (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id    UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  school_id     UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  tutor_id      UUID REFERENCES tutors(id) ON DELETE SET NULL,
  date          DATE NOT NULL DEFAULT CURRENT_DATE,
  status        TEXT NOT NULL DEFAULT 'present'
    CHECK (status IN ('present','absent','late','excused')),
  notes         TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(student_id, date)
);

-- ============================================================
-- 9. SCHOOL INQUIRIES (registration applications)
-- ============================================================
CREATE TABLE IF NOT EXISTS school_inquiries (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  school_name   TEXT NOT NULL,
  contact_name  TEXT NOT NULL,
  email         TEXT NOT NULL,
  phone         TEXT,
  student_count INTEGER,
  message       TEXT,
  status        TEXT NOT NULL DEFAULT 'new'
    CHECK (status IN ('new','contacted','converted','rejected')),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_users_school_id ON users(school_id);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_students_school_id ON students(school_id);
CREATE INDEX IF NOT EXISTS idx_students_class_grade ON students(class_grade);
CREATE INDEX IF NOT EXISTS idx_tutors_user_id ON tutors(user_id);
CREATE INDEX IF NOT EXISTS idx_tutor_assignments_tutor ON tutor_assignments(tutor_id);
CREATE INDEX IF NOT EXISTS idx_tutor_assignments_school ON tutor_assignments(school_id);
CREATE INDEX IF NOT EXISTS idx_projects_tutor ON projects(tutor_id);
CREATE INDEX IF NOT EXISTS idx_projects_school ON projects(school_id);
CREATE INDEX IF NOT EXISTS idx_submissions_project ON submissions(project_id);
CREATE INDEX IF NOT EXISTS idx_submissions_student ON submissions(student_id);
CREATE INDEX IF NOT EXISTS idx_attendance_student ON attendance(student_id);
CREATE INDEX IF NOT EXISTS idx_attendance_date ON attendance(date);

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE tutors ENABLE ROW LEVEL SECURITY;
ALTER TABLE tutor_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE school_inquiries ENABLE ROW LEVEL SECURITY;

-- Helper functions to prevent infinite recursion in RLS policies
CREATE OR REPLACE FUNCTION public.get_user_role()
RETURNS TEXT AS $$
  SELECT role FROM public.users WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.get_user_school_id()
RETURNS UUID AS $$
  SELECT school_id FROM public.users WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER;

-- SCHOOLS policies
CREATE POLICY "Super admins can do everything on schools"
  ON schools FOR ALL
  USING (public.get_user_role() = 'super_admin');

CREATE POLICY "School admins can view their own school"
  ON schools FOR SELECT
  USING (id = public.get_user_school_id() AND public.get_user_role() = 'school_admin');

CREATE POLICY "Tutors can view assigned schools"
  ON schools FOR SELECT
  USING (id IN (
    SELECT ta.school_id FROM tutor_assignments ta
    JOIN tutors t ON t.id = ta.tutor_id
    WHERE t.user_id = auth.uid()
  ));

CREATE POLICY "Students can view their school"
  ON schools FOR SELECT
  USING (id = public.get_user_school_id() AND public.get_user_role() = 'student');

CREATE POLICY "Anyone can view approved schools"
  ON schools FOR SELECT
  USING (status = 'approved');

-- USERS policies
CREATE POLICY "Super admins can do everything on users"
  ON users FOR ALL
  USING (public.get_user_role() = 'super_admin');

CREATE POLICY "Users can view own profile"
  ON users FOR SELECT
  USING (id = auth.uid());

CREATE POLICY "School admins can view users in their school"
  ON users FOR SELECT
  USING (school_id = public.get_user_school_id() AND public.get_user_role() = 'school_admin');

-- STUDENTS policies
CREATE POLICY "Super admins can do everything on students"
  ON students FOR ALL
  USING (public.get_user_role() = 'super_admin');

CREATE POLICY "School admins can manage students in their school"
  ON students FOR ALL
  USING (school_id = public.get_user_school_id() AND public.get_user_role() = 'school_admin');

CREATE POLICY "Tutors can view students at assigned schools"
  ON students FOR SELECT
  USING (school_id IN (
    SELECT ta.school_id FROM tutor_assignments ta
    JOIN tutors t ON t.id = ta.tutor_id
    WHERE t.user_id = auth.uid()
  ));

CREATE POLICY "Students can view own record"
  ON students FOR SELECT
  USING (user_id = auth.uid());

-- TUTORS policies
CREATE POLICY "Super admins can do everything on tutors"
  ON tutors FOR ALL
  USING (public.get_user_role() = 'super_admin');

CREATE POLICY "Tutors can view and update own profile"
  ON tutors FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Tutors can update own profile"
  ON tutors FOR UPDATE
  USING (user_id = auth.uid());

-- TUTOR_ASSIGNMENTS policies
CREATE POLICY "Super admins can manage all tutor assignments"
  ON tutor_assignments FOR ALL
  USING (public.get_user_role() = 'super_admin');

CREATE POLICY "Tutors can view own assignments"
  ON tutor_assignments FOR SELECT
  USING (tutor_id IN (SELECT id FROM tutors WHERE user_id = auth.uid()));

CREATE POLICY "School admins can view assignments for their school"
  ON tutor_assignments FOR SELECT
  USING (school_id = public.get_user_school_id() AND public.get_user_role() = 'school_admin');

-- PROJECTS policies
CREATE POLICY "Super admins can do everything on projects"
  ON projects FOR ALL
  USING (public.get_user_role() = 'super_admin');

CREATE POLICY "Tutors can manage own projects"
  ON projects FOR ALL
  USING (tutor_id IN (SELECT id FROM tutors WHERE user_id = auth.uid()));

CREATE POLICY "School admins can view projects for their school"
  ON projects FOR SELECT
  USING (school_id = public.get_user_school_id() AND public.get_user_role() = 'school_admin');

CREATE POLICY "Students can view projects for their school and grade"
  ON projects FOR SELECT
  USING (
    school_id IN (SELECT school_id FROM students WHERE user_id = auth.uid())
    AND class_grade IN (SELECT class_grade FROM students WHERE user_id = auth.uid())
  );

-- SUBMISSIONS policies
CREATE POLICY "Super admins can do everything on submissions"
  ON submissions FOR ALL
  USING (public.get_user_role() = 'super_admin');

CREATE POLICY "Tutors can view and grade submissions for their projects"
  ON submissions FOR ALL
  USING (project_id IN (
    SELECT p.id FROM projects p
    JOIN tutors t ON t.id = p.tutor_id
    WHERE t.user_id = auth.uid()
  ));

CREATE POLICY "Students can manage own submissions"
  ON submissions FOR ALL
  USING (student_id IN (SELECT id FROM students WHERE user_id = auth.uid()));

-- ATTENDANCE policies
CREATE POLICY "Super admins can do everything on attendance"
  ON attendance FOR ALL
  USING (public.get_user_role() = 'super_admin');

CREATE POLICY "Tutors can manage attendance at assigned schools"
  ON attendance FOR ALL
  USING (tutor_id IN (SELECT id FROM tutors WHERE user_id = auth.uid()));

CREATE POLICY "School admins can view attendance for their school"
  ON attendance FOR SELECT
  USING (school_id = public.get_user_school_id() AND public.get_user_role() = 'school_admin');

CREATE POLICY "Students can view own attendance"
  ON attendance FOR SELECT
  USING (student_id IN (SELECT id FROM students WHERE user_id = auth.uid()));

-- SCHOOL_INQUIRIES policies
CREATE POLICY "Super admins can do everything on inquiries"
  ON school_inquiries FOR ALL
  USING (public.get_user_role() = 'super_admin');

CREATE POLICY "Anyone can create inquiries"
  ON school_inquiries FOR INSERT
  WITH CHECK (true);

-- ============================================================
-- TRIGGER: Auto-create user/student/tutor rows on auth signup
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, name, email, role, school_id)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'role', 'student'),
    (NEW.raw_user_meta_data->>'school_id')::UUID
  );

  -- If role is tutor, create tutor record
  IF COALESCE(NEW.raw_user_meta_data->>'role', 'student') = 'tutor' THEN
    INSERT INTO public.tutors (user_id, subjects)
    VALUES (NEW.id, '{}');
  END IF;

  -- If role is student, create student record
  IF COALESCE(NEW.raw_user_meta_data->>'role', 'student') = 'student' THEN
    INSERT INTO public.students (user_id, school_id, class_grade, section)
    VALUES (
      NEW.id,
      (NEW.raw_user_meta_data->>'school_id')::UUID,
      COALESCE(NEW.raw_user_meta_data->>'class_grade', '9'),
      NEW.raw_user_meta_data->>'section'
    );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if any, then create
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- Updated_at trigger for schools
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_schools_updated_at ON schools;
CREATE TRIGGER set_schools_updated_at
  BEFORE UPDATE ON schools
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
