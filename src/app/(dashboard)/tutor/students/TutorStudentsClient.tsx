'use client'

import { useState } from 'react'
import { PageHeader, Table, TableHead, TableBody, TableRow, TableTh, TableTd, Badge, Input, Select, Avatar, Card, CardContent } from '@/components/ui'
import { Users, Search, GraduationCap } from 'lucide-react'

export function TutorStudentsClient({ students, assignments }: any) {
  const [search, setSearch] = useState('')
  const [selectedSchool, setSelectedSchool] = useState('')
  const [selectedGrade, setSelectedGrade] = useState('')

  // Map students with the subjects taught by this tutor
  const processedStudents = students.map((student: any) => {
    const matchingAssignments = assignments.filter(
      (a: any) => a.school_id === student.school_id && a.class_grade === student.class_grade
    )
    const subjects = Array.from(new Set(matchingAssignments.map((a: any) => a.subject)))
    return {
      ...student,
      subjects
    }
  })

  // Get unique schools and grades for filter dropdowns
  const uniqueSchools = Array.from(new Set(assignments.map((a: any) => JSON.stringify({ id: a.schools.id, name: a.schools.name })))).map((s: any) => JSON.parse(s))
  const uniqueGrades = Array.from(new Set(assignments.map((a: any) => a.class_grade))).sort()

  // Filter roster
  const filtered = processedStudents.filter((item: any) => {
    const matchesSearch = item.users.name.toLowerCase().includes(search.toLowerCase()) || 
                          item.users.email.toLowerCase().includes(search.toLowerCase())
    const matchesSchool = selectedSchool ? item.school_id === selectedSchool : true
    const matchesGrade = selectedGrade ? item.class_grade === selectedGrade : true
    return matchesSearch && matchesSchool && matchesGrade
  })

  return (
    <div className="space-y-6">
      <PageHeader 
        title="My Students" 
        description="View and connect with the students in your assigned classes"
      />

      {/* Filter Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search size={16} />
          </div>
          <Input 
            placeholder="Search students by name or email..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="w-full sm:w-48">
          <Select value={selectedSchool} onChange={(e) => setSelectedSchool(e.target.value)}>
            <option value="">All Schools</option>
            {uniqueSchools.map((school: any) => (
              <option key={school.id} value={school.id}>{school.name}</option>
            ))}
          </Select>
        </div>

        <div className="w-full sm:w-40">
          <Select value={selectedGrade} onChange={(e) => setSelectedGrade(e.target.value)}>
            <option value="">All Grades</option>
            {uniqueGrades.map((grade: any) => (
              <option key={grade} value={grade}>Grade {grade}</option>
            ))}
          </Select>
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <Table>
          <TableHead>
            <TableRow>
              <TableTh>Student</TableTh>
              <TableTh>School</TableTh>
              <TableTh>Class & Roll</TableTh>
              <TableTh>My Subjects</TableTh>
              <TableTh>Contact</TableTh>
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableTd className="text-center py-12 text-slate-400" colSpan={5 as any}>
                  <div className="flex flex-col items-center justify-center">
                    <Users size={36} className="text-slate-300 mb-2" />
                    <p className="font-medium">No students found</p>
                    <p className="text-xs text-slate-500 mt-1">Try adjusting your filters or search query</p>
                  </div>
                </TableTd>
              </TableRow>
            ) : (
              filtered.map((row: any) => (
                <TableRow key={row.id}>
                  <TableTd>
                    <div className="flex items-center gap-3">
                      <Avatar name={row.users.name} size="md" />
                      <div>
                        <p className="font-semibold text-slate-900">{row.users.name}</p>
                        <p className="text-xs text-slate-500">{row.users.email}</p>
                      </div>
                    </div>
                  </TableTd>
                  <TableTd>
                    <span className="font-medium text-slate-700">{row.schools.name}</span>
                  </TableTd>
                  <TableTd>
                    <div>
                      <p className="text-slate-900 font-medium">Grade {row.class_grade} {row.section && `- Sec ${row.section}`}</p>
                      <p className="text-xs text-slate-500">Roll: {row.roll_number || 'N/A'}</p>
                    </div>
                  </TableTd>
                  <TableTd>
                    <div className="flex flex-wrap gap-1.5">
                      {row.subjects.map((sub: string) => (
                        <Badge key={sub} variant="secondary" className="bg-indigo-50 text-indigo-700 font-medium">
                          {sub}
                        </Badge>
                      ))}
                    </div>
                  </TableTd>
                  <TableTd>
                    <span className="text-slate-600 text-sm font-medium">{row.users.phone || '—'}</span>
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
