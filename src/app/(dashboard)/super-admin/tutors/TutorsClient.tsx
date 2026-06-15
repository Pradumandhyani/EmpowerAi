'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import {
  PageHeader, Badge, Button, Table, TableHead, TableBody, TableRow, TableTh, TableTd,
  Dialog, FormField, Input, Textarea, Select, toast, Avatar
} from '@/components/ui'
import { Plus, Link as LinkIcon, X } from 'lucide-react'
import { generatePassword } from '@/lib/utils'

interface TutorRow {
  id: string
  user_id: string
  subjects: string[]
  bio: string | null
  created_at: string
  users: { id: string; name: string; email: string; phone: string | null; is_active: boolean }
}

interface School { id: string; name: string }
interface Assignment { id: string; tutor_id: string; school_id: string; subject: string; class_grade: string; schools: { name: string } }

export function TutorsClient({
  tutors: initialTutors,
  schools,
  assignments: initialAssignments,
}: {
  tutors: TutorRow[]
  schools: School[]
  assignments: Assignment[]
}) {
  const supabase = createClient()
  const [tutors, setTutors] = useState(initialTutors)
  const [assignments, setAssignments] = useState(initialAssignments)
  const [addOpen, setAddOpen] = useState(false)
  const [assignOpen, setAssignOpen] = useState<TutorRow | null>(null)
  const [loading, setLoading] = useState(false)

  const [form, setForm] = useState({ name: '', email: '', phone: '', subjects: '', bio: '' })
  const [assignForm, setAssignForm] = useState({ school_id: '', subject: '', class_grade: '' })

  const handleAddTutor = async () => {
    setLoading(true)
    const password = generatePassword()

    // Create auth user via API route
    const res = await fetch('/api/admin/create-user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: form.name,
        email: form.email,
        password,
        role: 'tutor',
      }),
    })

    const result = await res.json()
    if (!res.ok) {
      toast(result.error ?? 'Failed to create tutor', 'error')
      setLoading(false)
      return
    }

    // Update tutor-specific data
    await supabase.from('tutors').update({
      subjects: form.subjects.split(',').map((s) => s.trim()).filter(Boolean),
      bio: form.bio || null,
    }).eq('user_id', result.userId)

    toast(`Tutor created! Temp password: ${password}`, 'success')
    setAddOpen(false)
    setForm({ name: '', email: '', phone: '', subjects: '', bio: '' })
    // Refresh
    const { data } = await supabase.from('tutors').select('*, users!inner(id, name, email, phone, is_active)').order('created_at', { ascending: false })
    if (data) setTutors(data as any)
    setLoading(false)
  }

  const handleAssign = async () => {
    if (!assignOpen) return
    setLoading(true)
    const { error } = await supabase.from('tutor_assignments').insert({
      tutor_id: assignOpen.id,
      school_id: assignForm.school_id,
      subject: assignForm.subject,
      class_grade: assignForm.class_grade,
    })

    if (!error) {
      toast('Assignment added', 'success')
      const school = schools.find(s => s.id === assignForm.school_id)
      const newAssignment = {
        id: Date.now().toString(),
        tutor_id: assignOpen.id,
        school_id: assignForm.school_id,
        subject: assignForm.subject,
        class_grade: assignForm.class_grade,
        schools: { name: school?.name ?? '' },
      }
      setAssignments((prev) => [...prev, newAssignment])
      setAssignForm({ school_id: '', subject: '', class_grade: '' })
    } else if (error.code === '23505') {
      toast('This assignment already exists', 'error')
    } else {
      toast(error.message, 'error')
    }
    setLoading(false)
  }

  const handleRemoveAssignment = async (id: string) => {
    await supabase.from('tutor_assignments').delete().eq('id', id)
    setAssignments((prev) => prev.filter((a) => a.id !== id))
    toast('Assignment removed', 'info')
  }

  const tutorAssignments = (tutor: TutorRow) =>
    assignments.filter((a) => a.tutor_id === tutor.id)

  return (
    <div className="space-y-6">
      <PageHeader
        title="Tutors"
        description="Manage platform tutors and their school assignments"
        action={
          <Button onClick={() => setAddOpen(true)}>
            <Plus size={16} /> Add Tutor
          </Button>
        }
      />

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <Table>
          <TableHead>
            <TableRow>
              <TableTh>Tutor</TableTh>
              <TableTh>Subjects</TableTh>
              <TableTh>Assigned Schools</TableTh>
              <TableTh>Status</TableTh>
              <TableTh>Actions</TableTh>
            </TableRow>
          </TableHead>
          <TableBody>
            {tutors.length === 0 ? (
              <TableRow>
                <TableTd className="text-center py-12 text-slate-400" colSpan={5 as any}>No tutors yet</TableTd>
              </TableRow>
            ) : (
              tutors.map((tutor) => {
                const ta = tutorAssignments(tutor)
                const uniqueSchools = [...new Set(ta.map(a => a.schools.name))]
                return (
                  <TableRow key={tutor.id}>
                    <TableTd>
                      <div className="flex items-center gap-3">
                        <Avatar name={tutor.users.name} size="sm" />
                        <div>
                          <p className="font-medium text-slate-900">{tutor.users.name}</p>
                          <p className="text-xs text-slate-500">{tutor.users.email}</p>
                        </div>
                      </div>
                    </TableTd>
                    <TableTd>
                      <div className="flex flex-wrap gap-1">
                        {tutor.subjects.slice(0, 3).map((s) => (
                          <Badge key={s} variant="info">{s}</Badge>
                        ))}
                        {tutor.subjects.length > 3 && <Badge variant="secondary">+{tutor.subjects.length - 3}</Badge>}
                      </div>
                    </TableTd>
                    <TableTd>
                      <div className="flex flex-wrap gap-1">
                        {uniqueSchools.length === 0
                          ? <span className="text-slate-400 text-xs">Not assigned</span>
                          : uniqueSchools.map(s => <Badge key={s} variant="secondary">{s}</Badge>)
                        }
                      </div>
                    </TableTd>
                    <TableTd>
                      <Badge variant={tutor.users.is_active ? 'success' : 'danger'}>
                        {tutor.users.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableTd>
                    <TableTd>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => setAssignOpen(tutor)}>
                          <LinkIcon size={14} /> Assign
                        </Button>
                      </div>
                    </TableTd>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Add Tutor Dialog */}
      <Dialog open={addOpen} onClose={() => setAddOpen(false)} title="Add New Tutor">
        <div className="space-y-4">
          <FormField label="Full Name" required><Input placeholder="Dr. Anita Kumar" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></FormField>
          <FormField label="Email" required><Input type="email" placeholder="anita@educonnect.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} /></FormField>
          <FormField label="Phone"><Input type="tel" placeholder="+91 98765 43210" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} /></FormField>
          <FormField label="Subjects (comma-separated)" required>
            <Input placeholder="Mathematics, Physics, Chemistry" value={form.subjects} onChange={e => setForm({ ...form, subjects: e.target.value })} />
          </FormField>
          <FormField label="Bio">
            <Textarea placeholder="Brief description of experience and qualifications..." value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} />
          </FormField>
          <p className="text-xs text-slate-500 bg-amber-50 border border-amber-200 rounded-lg p-3">
            ⚠️ A temporary password will be generated and shown after creation. The tutor should change it on first login.
          </p>
          <div className="flex gap-3 pt-2">
            <Button className="flex-1" onClick={handleAddTutor} loading={loading}>Create Tutor</Button>
            <Button variant="outline" onClick={() => setAddOpen(false)}>Cancel</Button>
          </div>
        </div>
      </Dialog>

      {/* Assign Dialog */}
      <Dialog open={!!assignOpen} onClose={() => setAssignOpen(null)} title={`Assign ${assignOpen?.users.name ?? 'Tutor'}`}>
        {assignOpen && (
          <div className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm font-medium text-slate-700">Current Assignments</p>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {tutorAssignments(assignOpen).length === 0
                  ? <p className="text-sm text-slate-400">No assignments yet</p>
                  : tutorAssignments(assignOpen).map(a => (
                    <div key={a.id} className="flex items-center gap-2 bg-slate-50 rounded-lg px-3 py-2">
                      <span className="text-sm text-slate-700 flex-1">{a.schools.name} · {a.subject} · Grade {a.class_grade}</span>
                      <button onClick={() => handleRemoveAssignment(a.id)} className="text-red-400 hover:text-red-600">
                        <X size={14} />
                      </button>
                    </div>
                  ))
                }
              </div>
            </div>
            <hr className="border-slate-100" />
            <p className="text-sm font-medium text-slate-700">Add New Assignment</p>
            <FormField label="School" required>
              <Select value={assignForm.school_id} onChange={e => setAssignForm({ ...assignForm, school_id: e.target.value })}>
                <option value="">Select school</option>
                {schools.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </Select>
            </FormField>
            <FormField label="Subject" required>
              <Input placeholder="Mathematics" value={assignForm.subject} onChange={e => setAssignForm({ ...assignForm, subject: e.target.value })} />
            </FormField>
            <FormField label="Class/Grade" required>
              <Input placeholder="Grade 8" value={assignForm.class_grade} onChange={e => setAssignForm({ ...assignForm, class_grade: e.target.value })} />
            </FormField>
            <div className="flex gap-3">
              <Button className="flex-1" onClick={handleAssign} loading={loading} disabled={!assignForm.school_id || !assignForm.subject || !assignForm.class_grade}>
                Add Assignment
              </Button>
              <Button variant="outline" onClick={() => setAssignOpen(null)}>Done</Button>
            </div>
          </div>
        )}
      </Dialog>
    </div>
  )
}
