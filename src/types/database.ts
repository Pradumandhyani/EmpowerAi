export type Role = 'super_admin' | 'school_admin' | 'tutor' | 'student'
export type SchoolStatus = 'pending' | 'approved' | 'suspended'
export type SubscriptionPlan = 'free' | 'basic' | 'pro' | 'enterprise'
export type SubscriptionStatus = 'trial' | 'active' | 'past_due' | 'canceled'

export interface School {
  id: string
  name: string
  address: string | null
  contact_email: string
  subscription_plan: SubscriptionPlan
  subscription_status: SubscriptionStatus
  status: SchoolStatus
  created_at: string
  updated_at: string
}

export interface User {
  id: string
  school_id: string | null
  name: string
  email: string
  phone: string | null
  role: Role
  is_active: boolean
  last_login_at: string | null
  created_at: string
}

export interface Student {
  id: string
  user_id: string
  school_id: string
  class_grade: string
  section: string
  parent_name: string | null
  parent_email: string | null
  parent_phone: string | null
  roll_number: string | null
}

export interface Project {
  id: string
  tutor_id: string
  school_id: string
  title: string
  description: string
  class_grade: string
  section: string | null
  due_date: string
  max_marks: number
  created_at: string
}
