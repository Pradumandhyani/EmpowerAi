-- ============================================================
-- EduConnect — Seed Data
-- Run this AFTER 001_initial_schema.sql in Supabase SQL Editor
-- ============================================================
-- 
-- HOW TO RUN:
-- 1. Go to Supabase Dashboard → SQL Editor
-- 2. Paste the contents of supabase/migrations/001_initial_schema.sql → Run
-- 3. Paste the contents of THIS file (seed.sql) → Run
--
-- IMPORTANT: The auth.users inserts below use Supabase's admin API format.
-- For the seed users to work, you need to insert them via the Supabase Dashboard
-- or use the service role key. Below we insert directly into public tables,
-- assuming the auth users are created separately (via Dashboard or API).
--
-- For quick setup, create these auth users in Supabase Dashboard → Authentication → Users:
--   1. admin@educonnect.com      / Admin@123456      (then run UPDATE below)
--   2. principal@sunrise.edu.in  / School@123456
--   3. hod@dps.edu.in            / School@123456
--   4. admin@stxaviers.edu.in    / School@123456
--   5-10. tutor emails           / Tutor@123456
--   11-30. student emails        / Student@123456
--
-- OR use the alternative approach at the bottom that uses auth.users directly.
-- ============================================================

-- ============================================================
-- SCHOOLS (3 schools)
-- ============================================================
INSERT INTO schools (id, name, address, contact_email, subscription_plan, subscription_status, status, created_at) VALUES
  ('a1000000-0000-0000-0000-000000000001', 'Sunrise International Academy', '42 MG Road, Bengaluru, Karnataka 560001', 'principal@sunrise.edu.in', 'pro', 'active', 'approved', now() - interval '90 days'),
  ('a1000000-0000-0000-0000-000000000002', 'Delhi Public School - Noida', 'Sector 30, Noida, Uttar Pradesh 201303', 'hod@dps.edu.in', 'enterprise', 'active', 'approved', now() - interval '60 days'),
  ('a1000000-0000-0000-0000-000000000003', 'St. Xavier''s High School', '14 Park Street, Kolkata, West Bengal 700016', 'admin@stxaviers.edu.in', 'basic', 'active', 'approved', now() - interval '30 days')
ON CONFLICT DO NOTHING;

-- ============================================================
-- AUTH USERS (created via Supabase admin)
-- We use a trick: insert into auth.users directly for seeding.
-- Passwords are hashed using bcrypt — the password for all is shown in comments.
-- ============================================================

-- Helper: Insert auth users with pre-hashed passwords
-- Password: Admin@123456 (for admin)
-- Password: School@123456 (for school admins)  
-- Password: Tutor@123456 (for tutors)
-- Password: Student@123456 (for students)

-- NOTE: If direct auth.users insertion doesn't work on your Supabase instance,
-- create users manually in Dashboard → Authentication → Users with the emails below,
-- then run the public table inserts.

-- Super Admin
INSERT INTO auth.users (id, instance_id, email, encrypted_password, email_confirmed_at, raw_user_meta_data, role, aud, created_at, updated_at)
VALUES (
  'b1000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000000',
  'admin@educonnect.com',
  crypt('Admin@123456', gen_salt('bf')),
  now(),
  '{"name": "Platform Admin", "role": "super_admin"}'::jsonb,
  'authenticated', 'authenticated', now(), now()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO auth.identities (id, user_id, provider_id, provider, identity_data, last_sign_in_at, created_at, updated_at)
VALUES (
  'b1000000-0000-0000-0000-000000000001',
  'b1000000-0000-0000-0000-000000000001',
  'b1000000-0000-0000-0000-000000000001',
  'email',
  '{"sub": "b1000000-0000-0000-0000-000000000001", "email": "admin@educonnect.com"}'::jsonb,
  now(), now(), now()
) ON CONFLICT DO NOTHING;

-- School Admins (3)
INSERT INTO auth.users (id, instance_id, email, encrypted_password, email_confirmed_at, raw_user_meta_data, role, aud, created_at, updated_at) VALUES
  ('b1000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000000', 'principal@sunrise.edu.in', crypt('School@123456', gen_salt('bf')), now(), '{"name": "Dr. Priya Sharma", "role": "school_admin", "school_id": "a1000000-0000-0000-0000-000000000001"}'::jsonb, 'authenticated', 'authenticated', now(), now()),
  ('b1000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000000', 'hod@dps.edu.in', crypt('School@123456', gen_salt('bf')), now(), '{"name": "Rajesh Kumar Singh", "role": "school_admin", "school_id": "a1000000-0000-0000-0000-000000000002"}'::jsonb, 'authenticated', 'authenticated', now(), now()),
  ('b1000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000000', 'admin@stxaviers.edu.in', crypt('School@123456', gen_salt('bf')), now(), '{"name": "Sister Mary Francis", "role": "school_admin", "school_id": "a1000000-0000-0000-0000-000000000003"}'::jsonb, 'authenticated', 'authenticated', now(), now())
ON CONFLICT (id) DO NOTHING;

INSERT INTO auth.identities (id, user_id, provider_id, provider, identity_data, last_sign_in_at, created_at, updated_at) VALUES
  ('b1000000-0000-0000-0000-000000000002', 'b1000000-0000-0000-0000-000000000002', 'b1000000-0000-0000-0000-000000000002', 'email', '{"sub": "b1000000-0000-0000-0000-000000000002", "email": "principal@sunrise.edu.in"}'::jsonb, now(), now(), now()),
  ('b1000000-0000-0000-0000-000000000003', 'b1000000-0000-0000-0000-000000000003', 'b1000000-0000-0000-0000-000000000003', 'email', '{"sub": "b1000000-0000-0000-0000-000000000003", "email": "hod@dps.edu.in"}'::jsonb, now(), now(), now()),
  ('b1000000-0000-0000-0000-000000000004', 'b1000000-0000-0000-0000-000000000004', 'b1000000-0000-0000-0000-000000000004', 'email', '{"sub": "b1000000-0000-0000-0000-000000000004", "email": "admin@stxaviers.edu.in"}'::jsonb, now(), now(), now())
ON CONFLICT DO NOTHING;

-- Tutors (6)
INSERT INTO auth.users (id, instance_id, email, encrypted_password, email_confirmed_at, raw_user_meta_data, role, aud, created_at, updated_at) VALUES
  ('b1000000-0000-0000-0000-000000000011', '00000000-0000-0000-0000-000000000000', 'anita.kumar@educonnect.com', crypt('Tutor@123456', gen_salt('bf')), now(), '{"name": "Dr. Anita Kumar", "role": "tutor"}'::jsonb, 'authenticated', 'authenticated', now(), now()),
  ('b1000000-0000-0000-0000-000000000012', '00000000-0000-0000-0000-000000000000', 'vikram.mehta@educonnect.com', crypt('Tutor@123456', gen_salt('bf')), now(), '{"name": "Vikram Mehta", "role": "tutor"}'::jsonb, 'authenticated', 'authenticated', now(), now()),
  ('b1000000-0000-0000-0000-000000000013', '00000000-0000-0000-0000-000000000000', 'sneha.rao@educonnect.com', crypt('Tutor@123456', gen_salt('bf')), now(), '{"name": "Sneha Rao", "role": "tutor"}'::jsonb, 'authenticated', 'authenticated', now(), now()),
  ('b1000000-0000-0000-0000-000000000014', '00000000-0000-0000-0000-000000000000', 'arjun.patel@educonnect.com', crypt('Tutor@123456', gen_salt('bf')), now(), '{"name": "Arjun Patel", "role": "tutor"}'::jsonb, 'authenticated', 'authenticated', now(), now()),
  ('b1000000-0000-0000-0000-000000000015', '00000000-0000-0000-0000-000000000000', 'meera.nair@educonnect.com', crypt('Tutor@123456', gen_salt('bf')), now(), '{"name": "Meera Nair", "role": "tutor"}'::jsonb, 'authenticated', 'authenticated', now(), now()),
  ('b1000000-0000-0000-0000-000000000016', '00000000-0000-0000-0000-000000000000', 'rahul.gupta@educonnect.com', crypt('Tutor@123456', gen_salt('bf')), now(), '{"name": "Rahul Gupta", "role": "tutor"}'::jsonb, 'authenticated', 'authenticated', now(), now())
ON CONFLICT (id) DO NOTHING;

INSERT INTO auth.identities (id, user_id, provider_id, provider, identity_data, last_sign_in_at, created_at, updated_at) VALUES
  ('b1000000-0000-0000-0000-000000000011', 'b1000000-0000-0000-0000-000000000011', 'b1000000-0000-0000-0000-000000000011', 'email', '{"sub": "b1000000-0000-0000-0000-000000000011", "email": "anita.kumar@educonnect.com"}'::jsonb, now(), now(), now()),
  ('b1000000-0000-0000-0000-000000000012', 'b1000000-0000-0000-0000-000000000012', 'b1000000-0000-0000-0000-000000000012', 'email', '{"sub": "b1000000-0000-0000-0000-000000000012", "email": "vikram.mehta@educonnect.com"}'::jsonb, now(), now(), now()),
  ('b1000000-0000-0000-0000-000000000013', 'b1000000-0000-0000-0000-000000000013', 'b1000000-0000-0000-0000-000000000013', 'email', '{"sub": "b1000000-0000-0000-0000-000000000013", "email": "sneha.rao@educonnect.com"}'::jsonb, now(), now(), now()),
  ('b1000000-0000-0000-0000-000000000014', 'b1000000-0000-0000-0000-000000000014', 'b1000000-0000-0000-0000-000000000014', 'email', '{"sub": "b1000000-0000-0000-0000-000000000014", "email": "arjun.patel@educonnect.com"}'::jsonb, now(), now(), now()),
  ('b1000000-0000-0000-0000-000000000015', 'b1000000-0000-0000-0000-000000000015', 'b1000000-0000-0000-0000-000000000015', 'email', '{"sub": "b1000000-0000-0000-0000-000000000015", "email": "meera.nair@educonnect.com"}'::jsonb, now(), now(), now()),
  ('b1000000-0000-0000-0000-000000000016', 'b1000000-0000-0000-0000-000000000016', 'b1000000-0000-0000-0000-000000000016', 'email', '{"sub": "b1000000-0000-0000-0000-000000000016", "email": "rahul.gupta@educonnect.com"}'::jsonb, now(), now(), now())
ON CONFLICT DO NOTHING;

-- Students (20 students across grades 9-12)
INSERT INTO auth.users (id, instance_id, email, encrypted_password, email_confirmed_at, raw_user_meta_data, role, aud, created_at, updated_at) VALUES
  -- Sunrise Academy students (Grade 9 & 10)
  ('b1000000-0000-0000-0000-000000000101', '00000000-0000-0000-0000-000000000000', 'aarav.sharma@student.sunrise.edu.in', crypt('Student@123456', gen_salt('bf')), now(), '{"name": "Aarav Sharma", "role": "student", "school_id": "a1000000-0000-0000-0000-000000000001", "class_grade": "9", "section": "A"}'::jsonb, 'authenticated', 'authenticated', now(), now()),
  ('b1000000-0000-0000-0000-000000000102', '00000000-0000-0000-0000-000000000000', 'diya.patel@student.sunrise.edu.in', crypt('Student@123456', gen_salt('bf')), now(), '{"name": "Diya Patel", "role": "student", "school_id": "a1000000-0000-0000-0000-000000000001", "class_grade": "9", "section": "A"}'::jsonb, 'authenticated', 'authenticated', now(), now()),
  ('b1000000-0000-0000-0000-000000000103', '00000000-0000-0000-0000-000000000000', 'rohan.joshi@student.sunrise.edu.in', crypt('Student@123456', gen_salt('bf')), now(), '{"name": "Rohan Joshi", "role": "student", "school_id": "a1000000-0000-0000-0000-000000000001", "class_grade": "9", "section": "B"}'::jsonb, 'authenticated', 'authenticated', now(), now()),
  ('b1000000-0000-0000-0000-000000000104', '00000000-0000-0000-0000-000000000000', 'ananya.reddy@student.sunrise.edu.in', crypt('Student@123456', gen_salt('bf')), now(), '{"name": "Ananya Reddy", "role": "student", "school_id": "a1000000-0000-0000-0000-000000000001", "class_grade": "10", "section": "A"}'::jsonb, 'authenticated', 'authenticated', now(), now()),
  ('b1000000-0000-0000-0000-000000000105', '00000000-0000-0000-0000-000000000000', 'kabir.singh@student.sunrise.edu.in', crypt('Student@123456', gen_salt('bf')), now(), '{"name": "Kabir Singh", "role": "student", "school_id": "a1000000-0000-0000-0000-000000000001", "class_grade": "10", "section": "A"}'::jsonb, 'authenticated', 'authenticated', now(), now()),
  ('b1000000-0000-0000-0000-000000000106', '00000000-0000-0000-0000-000000000000', 'ishita.das@student.sunrise.edu.in', crypt('Student@123456', gen_salt('bf')), now(), '{"name": "Ishita Das", "role": "student", "school_id": "a1000000-0000-0000-0000-000000000001", "class_grade": "10", "section": "B"}'::jsonb, 'authenticated', 'authenticated', now(), now()),
  ('b1000000-0000-0000-0000-000000000107', '00000000-0000-0000-0000-000000000000', 'vivaan.malhotra@student.sunrise.edu.in', crypt('Student@123456', gen_salt('bf')), now(), '{"name": "Vivaan Malhotra", "role": "student", "school_id": "a1000000-0000-0000-0000-000000000001", "class_grade": "9", "section": "A"}'::jsonb, 'authenticated', 'authenticated', now(), now()),

  -- DPS Noida students (Grade 11 & 12)
  ('b1000000-0000-0000-0000-000000000201', '00000000-0000-0000-0000-000000000000', 'aryan.verma@student.dps.edu.in', crypt('Student@123456', gen_salt('bf')), now(), '{"name": "Aryan Verma", "role": "student", "school_id": "a1000000-0000-0000-0000-000000000002", "class_grade": "11", "section": "A"}'::jsonb, 'authenticated', 'authenticated', now(), now()),
  ('b1000000-0000-0000-0000-000000000202', '00000000-0000-0000-0000-000000000000', 'saanvi.agarwal@student.dps.edu.in', crypt('Student@123456', gen_salt('bf')), now(), '{"name": "Saanvi Agarwal", "role": "student", "school_id": "a1000000-0000-0000-0000-000000000002", "class_grade": "11", "section": "A"}'::jsonb, 'authenticated', 'authenticated', now(), now()),
  ('b1000000-0000-0000-0000-000000000203', '00000000-0000-0000-0000-000000000000', 'reyansh.gupta@student.dps.edu.in', crypt('Student@123456', gen_salt('bf')), now(), '{"name": "Reyansh Gupta", "role": "student", "school_id": "a1000000-0000-0000-0000-000000000002", "class_grade": "11", "section": "B"}'::jsonb, 'authenticated', 'authenticated', now(), now()),
  ('b1000000-0000-0000-0000-000000000204', '00000000-0000-0000-0000-000000000000', 'myra.kapoor@student.dps.edu.in', crypt('Student@123456', gen_salt('bf')), now(), '{"name": "Myra Kapoor", "role": "student", "school_id": "a1000000-0000-0000-0000-000000000002", "class_grade": "12", "section": "A"}'::jsonb, 'authenticated', 'authenticated', now(), now()),
  ('b1000000-0000-0000-0000-000000000205', '00000000-0000-0000-0000-000000000000', 'aditya.rao@student.dps.edu.in', crypt('Student@123456', gen_salt('bf')), now(), '{"name": "Aditya Rao", "role": "student", "school_id": "a1000000-0000-0000-0000-000000000002", "class_grade": "12", "section": "A"}'::jsonb, 'authenticated', 'authenticated', now(), now()),
  ('b1000000-0000-0000-0000-000000000206', '00000000-0000-0000-0000-000000000000', 'kavya.iyer@student.dps.edu.in', crypt('Student@123456', gen_salt('bf')), now(), '{"name": "Kavya Iyer", "role": "student", "school_id": "a1000000-0000-0000-0000-000000000002", "class_grade": "12", "section": "B"}'::jsonb, 'authenticated', 'authenticated', now(), now()),

  -- St. Xavier's students (Grade 9–12 mixed)
  ('b1000000-0000-0000-0000-000000000301', '00000000-0000-0000-0000-000000000000', 'siddharth.mukherjee@student.stxaviers.edu.in', crypt('Student@123456', gen_salt('bf')), now(), '{"name": "Siddharth Mukherjee", "role": "student", "school_id": "a1000000-0000-0000-0000-000000000003", "class_grade": "9", "section": "A"}'::jsonb, 'authenticated', 'authenticated', now(), now()),
  ('b1000000-0000-0000-0000-000000000302', '00000000-0000-0000-0000-000000000000', 'prisha.sen@student.stxaviers.edu.in', crypt('Student@123456', gen_salt('bf')), now(), '{"name": "Prisha Sen", "role": "student", "school_id": "a1000000-0000-0000-0000-000000000003", "class_grade": "10", "section": "A"}'::jsonb, 'authenticated', 'authenticated', now(), now()),
  ('b1000000-0000-0000-0000-000000000303', '00000000-0000-0000-0000-000000000000', 'dhruv.banerjee@student.stxaviers.edu.in', crypt('Student@123456', gen_salt('bf')), now(), '{"name": "Dhruv Banerjee", "role": "student", "school_id": "a1000000-0000-0000-0000-000000000003", "class_grade": "11", "section": "A"}'::jsonb, 'authenticated', 'authenticated', now(), now()),
  ('b1000000-0000-0000-0000-000000000304', '00000000-0000-0000-0000-000000000000', 'riya.chatterjee@student.stxaviers.edu.in', crypt('Student@123456', gen_salt('bf')), now(), '{"name": "Riya Chatterjee", "role": "student", "school_id": "a1000000-0000-0000-0000-000000000003", "class_grade": "12", "section": "A"}'::jsonb, 'authenticated', 'authenticated', now(), now()),
  ('b1000000-0000-0000-0000-000000000305', '00000000-0000-0000-0000-000000000000', 'arnav.bose@student.stxaviers.edu.in', crypt('Student@123456', gen_salt('bf')), now(), '{"name": "Arnav Bose", "role": "student", "school_id": "a1000000-0000-0000-0000-000000000003", "class_grade": "9", "section": "B"}'::jsonb, 'authenticated', 'authenticated', now(), now()),
  ('b1000000-0000-0000-0000-000000000306', '00000000-0000-0000-0000-000000000000', 'tara.ghosh@student.stxaviers.edu.in', crypt('Student@123456', gen_salt('bf')), now(), '{"name": "Tara Ghosh", "role": "student", "school_id": "a1000000-0000-0000-0000-000000000003", "class_grade": "10", "section": "B"}'::jsonb, 'authenticated', 'authenticated', now(), now())
ON CONFLICT (id) DO NOTHING;

-- Student identities
INSERT INTO auth.identities (id, user_id, provider_id, provider, identity_data, last_sign_in_at, created_at, updated_at) VALUES
  ('b1000000-0000-0000-0000-000000000101', 'b1000000-0000-0000-0000-000000000101', 'b1000000-0000-0000-0000-000000000101', 'email', '{"sub": "b1000000-0000-0000-0000-000000000101", "email": "aarav.sharma@student.sunrise.edu.in"}'::jsonb, now(), now(), now()),
  ('b1000000-0000-0000-0000-000000000102', 'b1000000-0000-0000-0000-000000000102', 'b1000000-0000-0000-0000-000000000102', 'email', '{"sub": "b1000000-0000-0000-0000-000000000102", "email": "diya.patel@student.sunrise.edu.in"}'::jsonb, now(), now(), now()),
  ('b1000000-0000-0000-0000-000000000103', 'b1000000-0000-0000-0000-000000000103', 'b1000000-0000-0000-0000-000000000103', 'email', '{"sub": "b1000000-0000-0000-0000-000000000103", "email": "rohan.joshi@student.sunrise.edu.in"}'::jsonb, now(), now(), now()),
  ('b1000000-0000-0000-0000-000000000104', 'b1000000-0000-0000-0000-000000000104', 'b1000000-0000-0000-0000-000000000104', 'email', '{"sub": "b1000000-0000-0000-0000-000000000104", "email": "ananya.reddy@student.sunrise.edu.in"}'::jsonb, now(), now(), now()),
  ('b1000000-0000-0000-0000-000000000105', 'b1000000-0000-0000-0000-000000000105', 'b1000000-0000-0000-0000-000000000105', 'email', '{"sub": "b1000000-0000-0000-0000-000000000105", "email": "kabir.singh@student.sunrise.edu.in"}'::jsonb, now(), now(), now()),
  ('b1000000-0000-0000-0000-000000000106', 'b1000000-0000-0000-0000-000000000106', 'b1000000-0000-0000-0000-000000000106', 'email', '{"sub": "b1000000-0000-0000-0000-000000000106", "email": "ishita.das@student.sunrise.edu.in"}'::jsonb, now(), now(), now()),
  ('b1000000-0000-0000-0000-000000000107', 'b1000000-0000-0000-0000-000000000107', 'b1000000-0000-0000-0000-000000000107', 'email', '{"sub": "b1000000-0000-0000-0000-000000000107", "email": "vivaan.malhotra@student.sunrise.edu.in"}'::jsonb, now(), now(), now()),
  ('b1000000-0000-0000-0000-000000000201', 'b1000000-0000-0000-0000-000000000201', 'b1000000-0000-0000-0000-000000000201', 'email', '{"sub": "b1000000-0000-0000-0000-000000000201", "email": "aryan.verma@student.dps.edu.in"}'::jsonb, now(), now(), now()),
  ('b1000000-0000-0000-0000-000000000202', 'b1000000-0000-0000-0000-000000000202', 'b1000000-0000-0000-0000-000000000202', 'email', '{"sub": "b1000000-0000-0000-0000-000000000202", "email": "saanvi.agarwal@student.dps.edu.in"}'::jsonb, now(), now(), now()),
  ('b1000000-0000-0000-0000-000000000203', 'b1000000-0000-0000-0000-000000000203', 'b1000000-0000-0000-0000-000000000203', 'email', '{"sub": "b1000000-0000-0000-0000-000000000203", "email": "reyansh.gupta@student.dps.edu.in"}'::jsonb, now(), now(), now()),
  ('b1000000-0000-0000-0000-000000000204', 'b1000000-0000-0000-0000-000000000204', 'b1000000-0000-0000-0000-000000000204', 'email', '{"sub": "b1000000-0000-0000-0000-000000000204", "email": "myra.kapoor@student.dps.edu.in"}'::jsonb, now(), now(), now()),
  ('b1000000-0000-0000-0000-000000000205', 'b1000000-0000-0000-0000-000000000205', 'b1000000-0000-0000-0000-000000000205', 'email', '{"sub": "b1000000-0000-0000-0000-000000000205", "email": "aditya.rao@student.dps.edu.in"}'::jsonb, now(), now(), now()),
  ('b1000000-0000-0000-0000-000000000206', 'b1000000-0000-0000-0000-000000000206', 'b1000000-0000-0000-0000-000000000206', 'email', '{"sub": "b1000000-0000-0000-0000-000000000206", "email": "kavya.iyer@student.dps.edu.in"}'::jsonb, now(), now(), now()),
  ('b1000000-0000-0000-0000-000000000301', 'b1000000-0000-0000-0000-000000000301', 'b1000000-0000-0000-0000-000000000301', 'email', '{"sub": "b1000000-0000-0000-0000-000000000301", "email": "siddharth.mukherjee@student.stxaviers.edu.in"}'::jsonb, now(), now(), now()),
  ('b1000000-0000-0000-0000-000000000302', 'b1000000-0000-0000-0000-000000000302', 'b1000000-0000-0000-0000-000000000302', 'email', '{"sub": "b1000000-0000-0000-0000-000000000302", "email": "prisha.sen@student.stxaviers.edu.in"}'::jsonb, now(), now(), now()),
  ('b1000000-0000-0000-0000-000000000303', 'b1000000-0000-0000-0000-000000000303', 'b1000000-0000-0000-0000-000000000303', 'email', '{"sub": "b1000000-0000-0000-0000-000000000303", "email": "dhruv.banerjee@student.stxaviers.edu.in"}'::jsonb, now(), now(), now()),
  ('b1000000-0000-0000-0000-000000000304', 'b1000000-0000-0000-0000-000000000304', 'b1000000-0000-0000-0000-000000000304', 'email', '{"sub": "b1000000-0000-0000-0000-000000000304", "email": "riya.chatterjee@student.stxaviers.edu.in"}'::jsonb, now(), now(), now()),
  ('b1000000-0000-0000-0000-000000000305', 'b1000000-0000-0000-0000-000000000305', 'b1000000-0000-0000-0000-000000000305', 'email', '{"sub": "b1000000-0000-0000-0000-000000000305", "email": "arnav.bose@student.stxaviers.edu.in"}'::jsonb, now(), now(), now()),
  ('b1000000-0000-0000-0000-000000000306', 'b1000000-0000-0000-0000-000000000306', 'b1000000-0000-0000-0000-000000000306', 'email', '{"sub": "b1000000-0000-0000-0000-000000000306", "email": "tara.ghosh@student.stxaviers.edu.in"}'::jsonb, now(), now(), now())
ON CONFLICT DO NOTHING;

-- ============================================================
-- PUBLIC TABLE DATA
-- (The trigger should create these automatically, but we insert
-- explicitly in case the trigger hasn't been set up yet)
-- ============================================================

-- Super Admin user record
INSERT INTO users (id, name, email, role, school_id) VALUES
  ('b1000000-0000-0000-0000-000000000001', 'Platform Admin', 'admin@educonnect.com', 'super_admin', NULL)
ON CONFLICT (id) DO NOTHING;

-- School Admin user records
INSERT INTO users (id, name, email, role, school_id) VALUES
  ('b1000000-0000-0000-0000-000000000002', 'Dr. Priya Sharma', 'principal@sunrise.edu.in', 'school_admin', 'a1000000-0000-0000-0000-000000000001'),
  ('b1000000-0000-0000-0000-000000000003', 'Rajesh Kumar Singh', 'hod@dps.edu.in', 'school_admin', 'a1000000-0000-0000-0000-000000000002'),
  ('b1000000-0000-0000-0000-000000000004', 'Sister Mary Francis', 'admin@stxaviers.edu.in', 'school_admin', 'a1000000-0000-0000-0000-000000000003')
ON CONFLICT (id) DO NOTHING;

-- Tutor user records
INSERT INTO users (id, name, email, role, school_id) VALUES
  ('b1000000-0000-0000-0000-000000000011', 'Dr. Anita Kumar', 'anita.kumar@educonnect.com', 'tutor', NULL),
  ('b1000000-0000-0000-0000-000000000012', 'Vikram Mehta', 'vikram.mehta@educonnect.com', 'tutor', NULL),
  ('b1000000-0000-0000-0000-000000000013', 'Sneha Rao', 'sneha.rao@educonnect.com', 'tutor', NULL),
  ('b1000000-0000-0000-0000-000000000014', 'Arjun Patel', 'arjun.patel@educonnect.com', 'tutor', NULL),
  ('b1000000-0000-0000-0000-000000000015', 'Meera Nair', 'meera.nair@educonnect.com', 'tutor', NULL),
  ('b1000000-0000-0000-0000-000000000016', 'Rahul Gupta', 'rahul.gupta@educonnect.com', 'tutor', NULL)
ON CONFLICT (id) DO NOTHING;

-- Student user records
INSERT INTO users (id, name, email, role, school_id) VALUES
  ('b1000000-0000-0000-0000-000000000101', 'Aarav Sharma', 'aarav.sharma@student.sunrise.edu.in', 'student', 'a1000000-0000-0000-0000-000000000001'),
  ('b1000000-0000-0000-0000-000000000102', 'Diya Patel', 'diya.patel@student.sunrise.edu.in', 'student', 'a1000000-0000-0000-0000-000000000001'),
  ('b1000000-0000-0000-0000-000000000103', 'Rohan Joshi', 'rohan.joshi@student.sunrise.edu.in', 'student', 'a1000000-0000-0000-0000-000000000001'),
  ('b1000000-0000-0000-0000-000000000104', 'Ananya Reddy', 'ananya.reddy@student.sunrise.edu.in', 'student', 'a1000000-0000-0000-0000-000000000001'),
  ('b1000000-0000-0000-0000-000000000105', 'Kabir Singh', 'kabir.singh@student.sunrise.edu.in', 'student', 'a1000000-0000-0000-0000-000000000001'),
  ('b1000000-0000-0000-0000-000000000106', 'Ishita Das', 'ishita.das@student.sunrise.edu.in', 'student', 'a1000000-0000-0000-0000-000000000001'),
  ('b1000000-0000-0000-0000-000000000107', 'Vivaan Malhotra', 'vivaan.malhotra@student.sunrise.edu.in', 'student', 'a1000000-0000-0000-0000-000000000001'),
  ('b1000000-0000-0000-0000-000000000201', 'Aryan Verma', 'aryan.verma@student.dps.edu.in', 'student', 'a1000000-0000-0000-0000-000000000002'),
  ('b1000000-0000-0000-0000-000000000202', 'Saanvi Agarwal', 'saanvi.agarwal@student.dps.edu.in', 'student', 'a1000000-0000-0000-0000-000000000002'),
  ('b1000000-0000-0000-0000-000000000203', 'Reyansh Gupta', 'reyansh.gupta@student.dps.edu.in', 'student', 'a1000000-0000-0000-0000-000000000002'),
  ('b1000000-0000-0000-0000-000000000204', 'Myra Kapoor', 'myra.kapoor@student.dps.edu.in', 'student', 'a1000000-0000-0000-0000-000000000002'),
  ('b1000000-0000-0000-0000-000000000205', 'Aditya Rao', 'aditya.rao@student.dps.edu.in', 'student', 'a1000000-0000-0000-0000-000000000002'),
  ('b1000000-0000-0000-0000-000000000206', 'Kavya Iyer', 'kavya.iyer@student.dps.edu.in', 'student', 'a1000000-0000-0000-0000-000000000002'),
  ('b1000000-0000-0000-0000-000000000301', 'Siddharth Mukherjee', 'siddharth.mukherjee@student.stxaviers.edu.in', 'student', 'a1000000-0000-0000-0000-000000000003'),
  ('b1000000-0000-0000-0000-000000000302', 'Prisha Sen', 'prisha.sen@student.stxaviers.edu.in', 'student', 'a1000000-0000-0000-0000-000000000003'),
  ('b1000000-0000-0000-0000-000000000303', 'Dhruv Banerjee', 'dhruv.banerjee@student.stxaviers.edu.in', 'student', 'a1000000-0000-0000-0000-000000000003'),
  ('b1000000-0000-0000-0000-000000000304', 'Riya Chatterjee', 'riya.chatterjee@student.stxaviers.edu.in', 'student', 'a1000000-0000-0000-0000-000000000003'),
  ('b1000000-0000-0000-0000-000000000305', 'Arnav Bose', 'arnav.bose@student.stxaviers.edu.in', 'student', 'a1000000-0000-0000-0000-000000000003'),
  ('b1000000-0000-0000-0000-000000000306', 'Tara Ghosh', 'tara.ghosh@student.stxaviers.edu.in', 'student', 'a1000000-0000-0000-0000-000000000003')
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- TUTOR PROFILES
-- ============================================================
INSERT INTO tutors (id, user_id, subjects, bio) VALUES
  ('c1000000-0000-0000-0000-000000000001', 'b1000000-0000-0000-0000-000000000011', ARRAY['Python', 'Data Science', 'Machine Learning'], 'Ph.D. in Computer Science from IIT Delhi. 8+ years teaching programming and AI/ML to high school students.'),
  ('c1000000-0000-0000-0000-000000000002', 'b1000000-0000-0000-0000-000000000012', ARRAY['JavaScript', 'React', 'Web Development'], 'Full-stack developer turned educator. Built multiple EdTech products. Passionate about teaching web technologies.'),
  ('c1000000-0000-0000-0000-000000000003', 'b1000000-0000-0000-0000-000000000013', ARRAY['Java', 'C++', 'Data Structures'], 'Software engineer at Google for 5 years. Now dedicated to training the next generation of programmers.'),
  ('c1000000-0000-0000-0000-000000000004', 'b1000000-0000-0000-0000-000000000014', ARRAY['Scratch', 'Python', 'Game Development'], 'Specializes in making coding fun for beginners. Creator of CodeKids YouTube channel with 50K subscribers.'),
  ('c1000000-0000-0000-0000-000000000005', 'b1000000-0000-0000-0000-000000000015', ARRAY['HTML/CSS', 'UI/UX Design', 'Figma'], 'Former design lead at Flipkart. Teaches students the intersection of design thinking and coding.'),
  ('c1000000-0000-0000-0000-000000000006', 'b1000000-0000-0000-0000-000000000016', ARRAY['Python', 'Robotics', 'Arduino', 'IoT'], 'Robotics enthusiast and STEM educator. Led teams to national-level robotics competitions.')
ON CONFLICT (user_id) DO UPDATE SET
  id = EXCLUDED.id,
  subjects = EXCLUDED.subjects,
  bio = EXCLUDED.bio;

-- ============================================================
-- STUDENT PROFILES
-- ============================================================
INSERT INTO students (id, user_id, school_id, class_grade, section, parent_name, parent_email, parent_phone, roll_number) VALUES
  -- Sunrise Academy
  ('d1000000-0000-0000-0000-000000000101', 'b1000000-0000-0000-0000-000000000101', 'a1000000-0000-0000-0000-000000000001', '9', 'A', 'Rajeev Sharma', 'rajeev.sharma@gmail.com', '+91 98765 43201', 'SA-9A-001'),
  ('d1000000-0000-0000-0000-000000000102', 'b1000000-0000-0000-0000-000000000102', 'a1000000-0000-0000-0000-000000000001', '9', 'A', 'Mehul Patel', 'mehul.patel@gmail.com', '+91 98765 43202', 'SA-9A-002'),
  ('d1000000-0000-0000-0000-000000000103', 'b1000000-0000-0000-0000-000000000103', 'a1000000-0000-0000-0000-000000000001', '9', 'B', 'Suresh Joshi', 'suresh.joshi@gmail.com', '+91 98765 43203', 'SA-9B-001'),
  ('d1000000-0000-0000-0000-000000000104', 'b1000000-0000-0000-0000-000000000104', 'a1000000-0000-0000-0000-000000000001', '10', 'A', 'Venkat Reddy', 'venkat.reddy@gmail.com', '+91 98765 43204', 'SA-10A-001'),
  ('d1000000-0000-0000-0000-000000000105', 'b1000000-0000-0000-0000-000000000105', 'a1000000-0000-0000-0000-000000000001', '10', 'A', 'Harbinder Singh', 'harbinder.singh@gmail.com', '+91 98765 43205', 'SA-10A-002'),
  ('d1000000-0000-0000-0000-000000000106', 'b1000000-0000-0000-0000-000000000106', 'a1000000-0000-0000-0000-000000000001', '10', 'B', 'Amitabh Das', 'amitabh.das@gmail.com', '+91 98765 43206', 'SA-10B-001'),
  ('d1000000-0000-0000-0000-000000000107', 'b1000000-0000-0000-0000-000000000107', 'a1000000-0000-0000-0000-000000000001', '9', 'A', 'Sunil Malhotra', 'sunil.malhotra@gmail.com', '+91 98765 43207', 'SA-9A-003'),
  -- DPS Noida
  ('d1000000-0000-0000-0000-000000000201', 'b1000000-0000-0000-0000-000000000201', 'a1000000-0000-0000-0000-000000000002', '11', 'A', 'Praveen Verma', 'praveen.verma@gmail.com', '+91 98765 43211', 'DPS-11A-001'),
  ('d1000000-0000-0000-0000-000000000202', 'b1000000-0000-0000-0000-000000000202', 'a1000000-0000-0000-0000-000000000002', '11', 'A', 'Sanjay Agarwal', 'sanjay.agarwal@gmail.com', '+91 98765 43212', 'DPS-11A-002'),
  ('d1000000-0000-0000-0000-000000000203', 'b1000000-0000-0000-0000-000000000203', 'a1000000-0000-0000-0000-000000000002', '11', 'B', 'Amit Gupta', 'amit.gupta@gmail.com', '+91 98765 43213', 'DPS-11B-001'),
  ('d1000000-0000-0000-0000-000000000204', 'b1000000-0000-0000-0000-000000000204', 'a1000000-0000-0000-0000-000000000002', '12', 'A', 'Rohit Kapoor', 'rohit.kapoor@gmail.com', '+91 98765 43214', 'DPS-12A-001'),
  ('d1000000-0000-0000-0000-000000000205', 'b1000000-0000-0000-0000-000000000205', 'a1000000-0000-0000-0000-000000000002', '12', 'A', 'Kiran Rao', 'kiran.rao@gmail.com', '+91 98765 43215', 'DPS-12A-002'),
  ('d1000000-0000-0000-0000-000000000206', 'b1000000-0000-0000-0000-000000000206', 'a1000000-0000-0000-0000-000000000002', '12', 'B', 'Mohan Iyer', 'mohan.iyer@gmail.com', '+91 98765 43216', 'DPS-12B-001'),
  -- St. Xavier's
  ('d1000000-0000-0000-0000-000000000301', 'b1000000-0000-0000-0000-000000000301', 'a1000000-0000-0000-0000-000000000003', '9', 'A', 'Arun Mukherjee', 'arun.mukherjee@gmail.com', '+91 98765 43301', 'SX-9A-001'),
  ('d1000000-0000-0000-0000-000000000302', 'b1000000-0000-0000-0000-000000000302', 'a1000000-0000-0000-0000-000000000003', '10', 'A', 'Debashis Sen', 'debashis.sen@gmail.com', '+91 98765 43302', 'SX-10A-001'),
  ('d1000000-0000-0000-0000-000000000303', 'b1000000-0000-0000-0000-000000000303', 'a1000000-0000-0000-0000-000000000003', '11', 'A', 'Tapan Banerjee', 'tapan.banerjee@gmail.com', '+91 98765 43303', 'SX-11A-001'),
  ('d1000000-0000-0000-0000-000000000304', 'b1000000-0000-0000-0000-000000000304', 'a1000000-0000-0000-0000-000000000003', '12', 'A', 'Subhash Chatterjee', 'subhash.chatterjee@gmail.com', '+91 98765 43304', 'SX-12A-001'),
  ('d1000000-0000-0000-0000-000000000305', 'b1000000-0000-0000-0000-000000000305', 'a1000000-0000-0000-0000-000000000003', '9', 'B', 'Partha Bose', 'partha.bose@gmail.com', '+91 98765 43305', 'SX-9B-001'),
  ('d1000000-0000-0000-0000-000000000306', 'b1000000-0000-0000-0000-000000000306', 'a1000000-0000-0000-0000-000000000003', '10', 'B', 'Anup Ghosh', 'anup.ghosh@gmail.com', '+91 98765 43306', 'SX-10B-001')
ON CONFLICT (user_id) DO UPDATE SET
  id = EXCLUDED.id,
  school_id = EXCLUDED.school_id,
  class_grade = EXCLUDED.class_grade,
  section = EXCLUDED.section,
  parent_name = EXCLUDED.parent_name,
  parent_email = EXCLUDED.parent_email,
  parent_phone = EXCLUDED.parent_phone,
  roll_number = EXCLUDED.roll_number;

-- ============================================================
-- TUTOR ASSIGNMENTS
-- ============================================================
INSERT INTO tutor_assignments (tutor_id, school_id, subject, class_grade) VALUES
  -- Dr. Anita Kumar teaches Python at Sunrise (9 & 10) and DPS (11)
  ('c1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000001', 'Python', '9'),
  ('c1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000001', 'Python', '10'),
  ('c1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000002', 'Data Science', '11'),
  -- Vikram Mehta teaches Web Dev at DPS (11 & 12)
  ('c1000000-0000-0000-0000-000000000002', 'a1000000-0000-0000-0000-000000000002', 'JavaScript', '11'),
  ('c1000000-0000-0000-0000-000000000002', 'a1000000-0000-0000-0000-000000000002', 'React', '12'),
  -- Sneha Rao teaches Java at St. Xavier's (11 & 12)
  ('c1000000-0000-0000-0000-000000000003', 'a1000000-0000-0000-0000-000000000003', 'Java', '11'),
  ('c1000000-0000-0000-0000-000000000003', 'a1000000-0000-0000-0000-000000000003', 'Data Structures', '12'),
  -- Arjun Patel teaches Scratch/Python at Sunrise (9) and St. Xavier's (9 & 10)
  ('c1000000-0000-0000-0000-000000000004', 'a1000000-0000-0000-0000-000000000001', 'Scratch', '9'),
  ('c1000000-0000-0000-0000-000000000004', 'a1000000-0000-0000-0000-000000000003', 'Scratch', '9'),
  ('c1000000-0000-0000-0000-000000000004', 'a1000000-0000-0000-0000-000000000003', 'Python', '10'),
  -- Meera Nair teaches UI/UX at DPS (12)
  ('c1000000-0000-0000-0000-000000000005', 'a1000000-0000-0000-0000-000000000002', 'UI/UX Design', '12'),
  -- Rahul Gupta teaches Robotics at Sunrise (10) and St. Xavier's (11)
  ('c1000000-0000-0000-0000-000000000006', 'a1000000-0000-0000-0000-000000000001', 'Robotics', '10'),
  ('c1000000-0000-0000-0000-000000000006', 'a1000000-0000-0000-0000-000000000003', 'Arduino', '11')
ON CONFLICT DO NOTHING;

-- ============================================================
-- PROJECTS
-- ============================================================
INSERT INTO projects (id, tutor_id, school_id, title, description, class_grade, section, due_date, max_marks) VALUES
  -- Python projects at Sunrise
  ('e1000000-0000-0000-0000-000000000001', 'c1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000001', 'Python Calculator App', 'Build a calculator application using Python that supports basic arithmetic operations (+, -, *, /) and handles division by zero errors gracefully.', '9', 'A', (CURRENT_DATE + interval '14 days')::date, 100),
  ('e1000000-0000-0000-0000-000000000002', 'c1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000001', 'Python Quiz Game', 'Create an interactive quiz game in Python with at least 10 questions, score tracking, and a leaderboard.', '9', NULL, (CURRENT_DATE + interval '21 days')::date, 100),
  ('e1000000-0000-0000-0000-000000000003', 'c1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000001', 'Data Analysis with Pandas', 'Analyze a given CSV dataset using pandas. Create visualizations using matplotlib and present your findings.', '10', 'A', (CURRENT_DATE + interval '28 days')::date, 150),
  -- Web Dev projects at DPS
  ('e1000000-0000-0000-0000-000000000004', 'c1000000-0000-0000-0000-000000000002', 'a1000000-0000-0000-0000-000000000002', 'Personal Portfolio Website', 'Design and build a responsive personal portfolio website using HTML, CSS, and JavaScript. Include sections: About, Projects, Skills, Contact.', '11', 'A', (CURRENT_DATE + interval '10 days')::date, 100),
  ('e1000000-0000-0000-0000-000000000005', 'c1000000-0000-0000-0000-000000000002', 'a1000000-0000-0000-0000-000000000002', 'React Todo Application', 'Build a Todo app using React with features: add, delete, mark complete, filter by status, and persist data in localStorage.', '12', 'A', (CURRENT_DATE + interval '18 days')::date, 120),
  -- Java projects at St. Xavier's
  ('e1000000-0000-0000-0000-000000000006', 'c1000000-0000-0000-0000-000000000003', 'a1000000-0000-0000-0000-000000000003', 'Library Management System', 'Build a console-based Library Management System in Java with OOP principles. Support add/remove books, issue/return, and search.', '11', 'A', (CURRENT_DATE + interval '25 days')::date, 150),
  ('e1000000-0000-0000-0000-000000000007', 'c1000000-0000-0000-0000-000000000003', 'a1000000-0000-0000-0000-000000000003', 'Sorting Algorithm Visualizer', 'Implement and compare Bubble Sort, Merge Sort, and Quick Sort. Measure and plot execution times for different input sizes.', '12', 'A', (CURRENT_DATE + interval '30 days')::date, 100),
  -- Scratch at Sunrise
  ('e1000000-0000-0000-0000-000000000008', 'c1000000-0000-0000-0000-000000000004', 'a1000000-0000-0000-0000-000000000001', 'Scratch Platformer Game', 'Create a platformer game in Scratch with at least 3 levels, collectible items, and a scoring system.', '9', 'A', (CURRENT_DATE + interval '7 days')::date, 80),
  -- Robotics at Sunrise
  ('e1000000-0000-0000-0000-000000000009', 'c1000000-0000-0000-0000-000000000006', 'a1000000-0000-0000-0000-000000000001', 'Arduino LED Pattern Controller', 'Program an Arduino to display various LED patterns (chase, fade, blink) controlled by push buttons. Document your circuit diagram.', '10', 'A', (CURRENT_DATE + interval '12 days')::date, 100),
  -- UI/UX at DPS
  ('e1000000-0000-0000-0000-000000000010', 'c1000000-0000-0000-0000-000000000005', 'a1000000-0000-0000-0000-000000000002', 'Mobile App UI Redesign', 'Redesign the UI of any popular mobile app using Figma. Create wireframes, high-fidelity mockups, and a clickable prototype.', '12', 'A', (CURRENT_DATE + interval '20 days')::date, 100)
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- SUBMISSIONS (some students have submitted past projects)
-- ============================================================
INSERT INTO submissions (project_id, student_id, file_url, notes, submitted_at, marks_obtained, feedback, graded_at) VALUES
  -- Aarav submitted Python Calculator (graded)
  ('e1000000-0000-0000-0000-000000000001', 'd1000000-0000-0000-0000-000000000101', NULL, 'Completed with error handling for division by zero and added square root feature.', now() - interval '2 days', 92, 'Excellent work! Clean code structure and good error handling. The square root addition was a nice touch.', now() - interval '1 day'),
  -- Diya submitted Python Calculator (graded)
  ('e1000000-0000-0000-0000-000000000001', 'd1000000-0000-0000-0000-000000000102', NULL, 'Basic calculator with all required operations.', now() - interval '3 days', 78, 'Good implementation. Consider adding input validation for non-numeric entries.', now() - interval '1 day'),
  -- Vivaan submitted Scratch game (graded)
  ('e1000000-0000-0000-0000-000000000008', 'd1000000-0000-0000-0000-000000000107', NULL, 'Made a Mario-style game with 3 levels and power-ups.', now() - interval '1 day', 75, 'Creative game design! The physics could be smoother. Great job on the sprites.', now() - interval '6 hours'),
  -- Aryan submitted Portfolio (awaiting grading)
  ('e1000000-0000-0000-0000-000000000004', 'd1000000-0000-0000-0000-000000000201', NULL, 'Responsive portfolio with dark mode toggle and smooth scroll animations.', now() - interval '12 hours', NULL, NULL, NULL),
  -- Myra submitted React Todo (graded)
  ('e1000000-0000-0000-0000-000000000005', 'd1000000-0000-0000-0000-000000000204', NULL, 'Full-featured Todo app with filters, localStorage, and drag-and-drop reordering.', now() - interval '5 days', 115, 'Outstanding submission! The drag-and-drop feature was beyond requirements. Very impressive.', now() - interval '3 days'),
  -- Aditya submitted React Todo (graded)
  ('e1000000-0000-0000-0000-000000000005', 'd1000000-0000-0000-0000-000000000205', NULL, 'Todo app with basic CRUD and filter functionality.', now() - interval '4 days', 95, 'Solid implementation. Good use of React hooks. Consider adding error boundaries.', now() - interval '2 days'),
  -- Riya submitted Sorting Visualizer (awaiting grading)
  ('e1000000-0000-0000-0000-000000000007', 'd1000000-0000-0000-0000-000000000304', NULL, 'Implemented all three sorts with timing comparison charts.', now() - interval '1 day', NULL, NULL, NULL)
ON CONFLICT DO NOTHING;

-- ============================================================
-- ATTENDANCE (sample data for last 5 days)
-- ============================================================
INSERT INTO attendance (student_id, school_id, tutor_id, date, status, notes) VALUES
  -- Sunrise Grade 9A attendance
  ('d1000000-0000-0000-0000-000000000101', 'a1000000-0000-0000-0000-000000000001', 'c1000000-0000-0000-0000-000000000001', CURRENT_DATE - 1, 'present', NULL),
  ('d1000000-0000-0000-0000-000000000102', 'a1000000-0000-0000-0000-000000000001', 'c1000000-0000-0000-0000-000000000001', CURRENT_DATE - 1, 'present', NULL),
  ('d1000000-0000-0000-0000-000000000103', 'a1000000-0000-0000-0000-000000000001', 'c1000000-0000-0000-0000-000000000001', CURRENT_DATE - 1, 'absent', 'Sick leave'),
  ('d1000000-0000-0000-0000-000000000107', 'a1000000-0000-0000-0000-000000000001', 'c1000000-0000-0000-0000-000000000001', CURRENT_DATE - 1, 'late', 'Arrived 15 min late'),
  ('d1000000-0000-0000-0000-000000000101', 'a1000000-0000-0000-0000-000000000001', 'c1000000-0000-0000-0000-000000000001', CURRENT_DATE - 3, 'present', NULL),
  ('d1000000-0000-0000-0000-000000000102', 'a1000000-0000-0000-0000-000000000001', 'c1000000-0000-0000-0000-000000000001', CURRENT_DATE - 3, 'present', NULL),
  ('d1000000-0000-0000-0000-000000000103', 'a1000000-0000-0000-0000-000000000001', 'c1000000-0000-0000-0000-000000000001', CURRENT_DATE - 3, 'present', NULL),
  -- DPS attendance
  ('d1000000-0000-0000-0000-000000000201', 'a1000000-0000-0000-0000-000000000002', 'c1000000-0000-0000-0000-000000000002', CURRENT_DATE - 1, 'present', NULL),
  ('d1000000-0000-0000-0000-000000000202', 'a1000000-0000-0000-0000-000000000002', 'c1000000-0000-0000-0000-000000000002', CURRENT_DATE - 1, 'present', NULL),
  ('d1000000-0000-0000-0000-000000000204', 'a1000000-0000-0000-0000-000000000002', 'c1000000-0000-0000-0000-000000000002', CURRENT_DATE - 1, 'excused', 'Family event'),
  ('d1000000-0000-0000-0000-000000000205', 'a1000000-0000-0000-0000-000000000002', 'c1000000-0000-0000-0000-000000000002', CURRENT_DATE - 1, 'present', NULL)
ON CONFLICT DO NOTHING;

-- ============================================================
-- SCHOOL INQUIRIES (some pending/new applications)
-- ============================================================
INSERT INTO school_inquiries (school_name, contact_name, email, phone, student_count, message, status, created_at) VALUES
  ('Greenfield International School', 'Mr. Arjun Nambiar', 'arjun@greenfield.edu.in', '+91 80 2556 1234', 800, 'We are looking for coding tutors for grades 8-12. Currently offering basic IT classes and want to upgrade to a full coding curriculum.', 'new', now() - interval '2 days'),
  ('Vidya Niketan Public School', 'Mrs. Lakshmi Iyer', 'lakshmi.iyer@vidyaniketan.edu.in', '+91 44 2345 6789', 1200, 'Interested in Python and web development courses for our senior students. We have computer labs with 60 systems.', 'new', now() - interval '5 days'),
  ('The Heritage School', 'Dr. Sameer Khan', 'sameer.khan@heritage.edu.in', '+91 11 4567 8901', 500, 'Want to introduce coding from grade 6 onwards. Looking for a comprehensive curriculum.', 'contacted', now() - interval '10 days'),
  ('Modern Public School', 'Ms. Nisha Agarwal', 'nisha@modernpublic.edu.in', '+91 22 3456 7890', 350, NULL, 'new', now() - interval '1 day')
ON CONFLICT DO NOTHING;

-- ============================================================
-- DONE! Your database is now seeded with sample data.
-- 
-- LOGIN CREDENTIALS:
-- ┌─────────────────────────────────┬──────────────────────────────┬────────────────┐
-- │ Role                            │ Email                        │ Password       │
-- ├─────────────────────────────────┼──────────────────────────────┼────────────────┤
-- │ Super Admin                     │ admin@educonnect.com         │ Admin@123456   │
-- │ School Admin (Sunrise)          │ principal@sunrise.edu.in     │ School@123456  │
-- │ School Admin (DPS)              │ hod@dps.edu.in               │ School@123456  │
-- │ School Admin (St. Xavier's)     │ admin@stxaviers.edu.in       │ School@123456  │
-- │ Tutor (Dr. Anita Kumar)         │ anita.kumar@educonnect.com   │ Tutor@123456   │
-- │ Tutor (Vikram Mehta)            │ vikram.mehta@educonnect.com  │ Tutor@123456   │
-- │ Student (Aarav Sharma, 9A)      │ aarav.sharma@student...      │ Student@123456 │
-- │ Student (Myra Kapoor, 12A)      │ myra.kapoor@student...       │ Student@123456 │
-- └─────────────────────────────────┴──────────────────────────────┴────────────────┘
-- ============================================================
