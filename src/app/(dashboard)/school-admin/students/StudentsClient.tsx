'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import {
  PageHeader, Badge, Button, Table, TableHead, TableBody, TableRow, TableTh, TableTd,
  Dialog, FormField, Input, Select, toast, Avatar
} from '@/components/ui'
import { Upload, Plus, Download, Search } from 'lucide-react'
import Link from 'next/link'

interface StudentRow {
  id: string
  user_id: string
  class_grade: string
  section: string
  roll_number: string | null
  parent_name: string | null
  users: { id: string; name: string; email: string; phone: string | null; is_active: boolean }
}

export function StudentsClient({ students: initialStudents, schoolId }: { students: StudentRow[]; schoolId: string }) {
  const [students, setStudents] = useState(initialStudents)
  const [search, setSearch] = useState('')
  const [filterClass, setFilterClass] = useState('all')

  const uniqueClasses = [...new Set(students.map(s => s.class_grade))].sort()

  const filtered = students.filter(s => {
    const matchSearch = s.users.name.toLowerCase().includes(search.toLowerCase()) ||
      s.users.email.toLowerCase().includes(search.toLowerCase()) ||
      (s.roll_number && s.roll_number.toLowerCase().includes(search.toLowerCase()))
    const matchClass = filterClass === 'all' || s.class_grade === filterClass
    return matchSearch && matchClass
  })

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
            <Button><Plus size={16} /> Add Student</Button>
          </div>
        }
      />

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input
            placeholder="Search students..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 pl-9 pr-4 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          />
        </div>
        <Select value={filterClass} onChange={(e) => setFilterClass(e.target.value)} className="w-full sm:w-48">
          <option value="all">All Classes</option>
          {uniqueClasses.map(c => <option key={c} value={c}>{c}</option>)}
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
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableTd className="text-center py-12 text-slate-400" colSpan={5 as any}>No students found</TableTd>
              </TableRow>
            ) : (
              filtered.map((student) => (
                <TableRow key={student.id}>
                  <TableTd>
                    <div className="flex items-center gap-3">
                      <Avatar name={student.users.name} size="sm" />
                      <div>
                        <p className="font-medium text-slate-900">{student.users.name}</p>
                        <p className="text-xs text-slate-500">{student.users.email}</p>
                      </div>
                    </div>
                  </TableTd>
                  <TableTd>
                    <Badge variant="secondary">{student.class_grade} - {student.section}</Badge>
                  </TableTd>
                  <TableTd>{student.roll_number ?? '-'}</TableTd>
                  <TableTd>
                    {student.parent_name ? (
                      <span className="text-sm text-slate-600">{student.parent_name}</span>
                    ) : <span className="text-sm text-slate-400">-</span>}
                  </TableTd>
                  <TableTd>
                    <Badge variant={student.users.is_active ? 'success' : 'danger'}>
                      {student.users.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableTd>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
