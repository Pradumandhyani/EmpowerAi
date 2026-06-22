'use client'

import { useState } from 'react'
import {
  PageHeader, Badge, Button, Table, TableHead, TableBody, TableRow, TableTh, TableTd,
  Dialog, FormField, Input, Select, toast, Avatar
} from '@/components/ui'
import { Upload, Plus, Search, Edit2, Trash2 } from 'lucide-react'
import Link from 'next/link'

interface StudentRow {
  id: string
  user_id: string
  class_grade: string
  section: string
  roll_number: string | null
  parent_name: string | null
  parent_email: string | null
  parent_phone: string | null
  users: { id: string; name: string; email: string; phone: string | null; is_active: boolean }
}

export function StudentsClient({ students: initialStudents, schoolId }: { students: StudentRow[]; schoolId: string }) {
  const [students, setStudents] = useState<StudentRow[]>(initialStudents)
  const [search, setSearch] = useState('')
  const [filterClass, setFilterClass] = useState('all')

  // Modals and loading state
  const [addOpen, setAddOpen] = useState(false)
  const [editStudent, setEditStudent] = useState<StudentRow | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<StudentRow | null>(null)
  const [loading, setLoading] = useState(false)

  // Form states
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    class_grade: '9',
    section: '',
    roll_number: '',
    parent_name: '',
    parent_email: '',
    parent_phone: '',
    is_active: true
  })

  const uniqueClasses = Array.from(new Set(students.map(s => s.class_grade))).sort()

  const filtered = students.filter(s => {
    const nameMatch = s.users?.name?.toLowerCase().includes(search.toLowerCase()) ?? false
    const emailMatch = s.users?.email?.toLowerCase().includes(search.toLowerCase()) ?? false
    const rollMatch = s.roll_number?.toLowerCase().includes(search.toLowerCase()) ?? false
    const matchSearch = nameMatch || emailMatch || rollMatch
    const matchClass = filterClass === 'all' || s.class_grade === filterClass
    return matchSearch && matchClass
  })

  const resetForm = () => {
    setForm({
      name: '',
      email: '',
      phone: '',
      class_grade: '9',
      section: '',
      roll_number: '',
      parent_name: '',
      parent_email: '',
      parent_phone: '',
      is_active: true
    })
  }

  const openAdd = () => {
    resetForm()
    setAddOpen(true)
  }

  const openEdit = (student: StudentRow) => {
    setForm({
      name: student.users.name,
      email: student.users.email,
      phone: student.users.phone || '',
      class_grade: student.class_grade,
      section: student.section || '',
      roll_number: student.roll_number || '',
      parent_name: student.parent_name || '',
      parent_email: student.parent_email || '',
      parent_phone: student.parent_phone || '',
      is_active: student.users.is_active
    })
    setEditStudent(student)
  }

  const handleAddStudent = async () => {
    if (!form.name || !form.email || !form.class_grade) {
      toast('Please fill out all required fields.', 'error')
      return
    }
    setLoading(true)

    try {
      const res = await fetch('/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, school_id: schoolId })
      })

      const data = await res.json()
      if (res.ok) {
        setStudents([data.student, ...students])
        toast('Student created successfully and credentials emailed!', 'success')
        setAddOpen(false)
        resetForm()
      } else {
        toast(data.error || 'Failed to create student', 'error')
      }
    } catch {
      toast('Network error. Please try again.', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleEditStudent = async () => {
    if (!editStudent) return
    if (!form.name || !form.class_grade) {
      toast('Please fill out all required fields.', 'error')
      return
    }
    setLoading(true)

    try {
      const res = await fetch(`/api/students/${editStudent.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })

      const data = await res.json()
      if (res.ok) {
        setStudents(prev => prev.map(s => s.id === editStudent.id ? data.student : s))
        toast('Student updated successfully!', 'success')
        setEditStudent(null)
        resetForm()
      } else {
        toast(data.error || 'Failed to update student', 'error')
      }
    } catch {
      toast('Network error. Please try again.', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteStudent = async () => {
    if (!deleteConfirm) return
    setLoading(true)

    try {
      const res = await fetch(`/api/students/${deleteConfirm.id}`, {
        method: 'DELETE'
      })

      if (res.ok) {
        setStudents(prev => prev.filter(s => s.id !== deleteConfirm.id))
        toast('Student account deleted successfully', 'success')
        setDeleteConfirm(null)
      } else {
        const data = await res.json()
        toast(data.error || 'Failed to delete student', 'error')
      }
    } catch {
      toast('Network error. Please try again.', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Students"
        description="Manage students across all classes and sections"
        action={
          <div className="flex gap-2">
            <Link href="/school-admin/students/upload">
              <Button variant="outline"><Upload size={16} /> Bulk Upload</Button>
            </Link>
            <Button onClick={openAdd}><Plus size={16} /> Add Student</Button>
          </div>
        }
      />

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input
            placeholder="Search students by name, email or roll number..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 pl-9 pr-4 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          />
        </div>
        <Select value={filterClass} onChange={(e) => setFilterClass(e.target.value)} className="w-full sm:w-48">
          <option value="all">All Classes</option>
          {uniqueClasses.map(c => <option key={c} value={c}>Grade {c}</option>)}
        </Select>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <Table>
          <TableHead>
            <TableRow>
              <TableTh>Student</TableTh>
              <TableTh>Class & Section</TableTh>
              <TableTh>Roll No.</TableTh>
              <TableTh>Parent / Guardian</TableTh>
              <TableTh>Status</TableTh>
              <TableTh>Actions</TableTh>
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableTd className="text-center py-12 text-slate-400" colSpan={6 as any}>No students found</TableTd>
              </TableRow>
            ) : (
              filtered.map((student) => (
                <TableRow key={student.id}>
                  <TableTd>
                    <div className="flex items-center gap-3">
                      <Avatar name={student.users?.name ?? 'Unknown'} size="sm" />
                      <div>
                        <p className="font-medium text-slate-900">{student.users?.name ?? 'Unknown'}</p>
                        <p className="text-xs text-slate-500">{student.users?.email ?? 'No email'}</p>
                      </div>
                    </div>
                  </TableTd>
                  <TableTd>
                    <Badge variant="secondary">Grade {student.class_grade} {student.section && `- ${student.section}`}</Badge>
                  </TableTd>
                  <TableTd>{student.roll_number ?? '-'}</TableTd>
                  <TableTd>
                    {student.parent_name ? (
                      <div className="text-sm text-slate-600">
                        <p className="font-medium">{student.parent_name}</p>
                        {student.parent_phone && <p className="text-xs text-slate-400">{student.parent_phone}</p>}
                      </div>
                    ) : <span className="text-sm text-slate-400">-</span>}
                  </TableTd>
                  <TableTd>
                    <Badge variant={student.users?.is_active ? 'success' : 'danger'}>
                      {student.users?.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableTd>
                  <TableTd>
                    <div className="flex items-center gap-1">
                      <Button size="icon" variant="ghost" onClick={() => openEdit(student)} title="Edit Student">
                        <Edit2 size={14} className="text-slate-500" />
                      </Button>
                      <Button size="icon" variant="ghost" onClick={() => setDeleteConfirm(student)} title="Delete Student" className="text-red-500 hover:text-red-700 hover:bg-red-50">
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </TableTd>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Add Student Dialog */}
      <Dialog open={addOpen} onClose={() => setAddOpen(false)} title="Add New Student">
        <div className="space-y-4 max-h-[80vh] overflow-y-auto px-1">
          <div className="border-b border-slate-100 pb-3 mb-2">
            <h4 className="text-sm font-semibold text-slate-700">Account Details</h4>
          </div>
          
          <FormField label="Full Name" required>
            <Input placeholder="Aarav Sharma" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </FormField>
          
          <FormField label="Email Address" required>
            <Input type="email" placeholder="aarav@student.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </FormField>

          <FormField label="Contact Phone">
            <Input placeholder="+91 98765 43210" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </FormField>

          <div className="grid grid-cols-2 gap-4">
            <FormField label="Grade / Class" required>
              <Select value={form.class_grade} onChange={(e) => setForm({ ...form, class_grade: e.target.value })}>
                <option value="9">Grade 9</option>
                <option value="10">Grade 10</option>
                <option value="11">Grade 11</option>
                <option value="12">Grade 12</option>
              </Select>
            </FormField>
            
            <FormField label="Section">
              <Input placeholder="e.g. A" value={form.section} onChange={(e) => setForm({ ...form, section: e.target.value })} />
            </FormField>
          </div>

          <FormField label="Roll Number">
            <Input placeholder="e.g. 24" value={form.roll_number} onChange={(e) => setForm({ ...form, roll_number: e.target.value })} />
          </FormField>

          <div className="border-b border-slate-100 pt-4 pb-3 mb-2">
            <h4 className="text-sm font-semibold text-slate-700">Parent / Guardian Details</h4>
          </div>

          <FormField label="Parent Name">
            <Input placeholder="Rajesh Sharma" value={form.parent_name} onChange={(e) => setForm({ ...form, parent_name: e.target.value })} />
          </FormField>

          <div className="grid grid-cols-2 gap-4">
            <FormField label="Parent Email">
              <Input type="email" placeholder="rajesh@parent.com" value={form.parent_email} onChange={(e) => setForm({ ...form, parent_email: e.target.value })} />
            </FormField>
            <FormField label="Parent Phone">
              <Input placeholder="+91 99999 88888" value={form.parent_phone} onChange={(e) => setForm({ ...form, parent_phone: e.target.value })} />
            </FormField>
          </div>

          <div className="flex gap-3 pt-4 border-t border-slate-100">
            <Button className="flex-1" onClick={handleAddStudent} loading={loading}>
              Create Student Account
            </Button>
            <Button variant="outline" onClick={() => setAddOpen(false)}>Cancel</Button>
          </div>
        </div>
      </Dialog>

      {/* Edit Student Dialog */}
      <Dialog open={!!editStudent} onClose={() => setEditStudent(null)} title="Edit Student Profile">
        {editStudent && (
          <div className="space-y-4 max-h-[80vh] overflow-y-auto px-1">
            <div className="border-b border-slate-100 pb-3 mb-2">
              <h4 className="text-sm font-semibold text-slate-700">Profile Info ({form.email})</h4>
            </div>
            
            <FormField label="Full Name" required>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </FormField>

            <FormField label="Contact Phone">
              <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </FormField>

            <div className="grid grid-cols-2 gap-4">
              <FormField label="Grade / Class" required>
                <Select value={form.class_grade} onChange={(e) => setForm({ ...form, class_grade: e.target.value })}>
                  <option value="9">Grade 9</option>
                  <option value="10">Grade 10</option>
                  <option value="11">Grade 11</option>
                  <option value="12">Grade 12</option>
                </Select>
              </FormField>
              
              <FormField label="Section">
                <Input value={form.section} onChange={(e) => setForm({ ...form, section: e.target.value })} />
              </FormField>
            </div>

            <FormField label="Roll Number">
              <Input value={form.roll_number} onChange={(e) => setForm({ ...form, roll_number: e.target.value })} />
            </FormField>

            <FormField label="Account Status">
              <Select value={form.is_active ? 'active' : 'inactive'} onChange={(e) => setForm({ ...form, is_active: e.target.value === 'active' })}>
                <option value="active">Active (Access Allowed)</option>
                <option value="inactive">Inactive (Access Suspended)</option>
              </Select>
            </FormField>

            <div className="border-b border-slate-100 pt-4 pb-3 mb-2">
              <h4 className="text-sm font-semibold text-slate-700">Parent / Guardian Details</h4>
            </div>

            <FormField label="Parent Name">
              <Input value={form.parent_name} onChange={(e) => setForm({ ...form, parent_name: e.target.value })} />
            </FormField>

            <div className="grid grid-cols-2 gap-4">
              <FormField label="Parent Email">
                <Input type="email" value={form.parent_email} onChange={(e) => setForm({ ...form, parent_email: e.target.value })} />
              </FormField>
              <FormField label="Parent Phone">
                <Input value={form.parent_phone} onChange={(e) => setForm({ ...form, parent_phone: e.target.value })} />
              </FormField>
            </div>

            <div className="flex gap-3 pt-4 border-t border-slate-100">
              <Button className="flex-1" onClick={handleEditStudent} loading={loading}>
                Save Profile Changes
              </Button>
              <Button variant="outline" onClick={() => setEditStudent(null)}>Cancel</Button>
            </div>
          </div>
        )}
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} title="Delete Student Account">
        {deleteConfirm && (
          <div className="space-y-4">
            <p className="text-slate-600 text-sm leading-relaxed">
              Are you sure you want to permanently delete the student account for <strong className="text-slate-900">{deleteConfirm.users.name}</strong> (<span className="text-slate-500">{deleteConfirm.users.email}</span>)?
            </p>
            <p className="text-xs text-red-500 bg-red-50 p-2.5 rounded-lg border border-red-100">
              Warning: This action is irreversible and will delete all submissions, records, and login access related to this student.
            </p>
            
            <div className="flex gap-3 pt-4 border-t border-slate-100">
              <Button className="flex-1" variant="destructive" onClick={handleDeleteStudent} loading={loading}>
                Confirm Delete
              </Button>
              <Button variant="outline" className="flex-1" onClick={() => setDeleteConfirm(null)}>Cancel</Button>
            </div>
          </div>
        )}
      </Dialog>
    </div>
  )
}
