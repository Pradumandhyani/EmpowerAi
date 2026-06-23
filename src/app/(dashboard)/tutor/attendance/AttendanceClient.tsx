'use client'

import { useState, useMemo } from 'react'
import {
  PageHeader,
  Button,
  Select,
  Avatar,
  Badge,
  toast,
} from '@/components/ui'
import {
  ClipboardList,
  CheckCircle2,
  XCircle,
  Users,
  CalendarDays,
  School,
  BookOpen,
  ChevronRight,
  RefreshCw,
  Send,
} from 'lucide-react'

type Assignment = {
  id: string
  tutor_id: string
  school_id: string
  subject: string
  class_grade: string
  is_active: boolean
  schools: { id: string; name: string }
}

type Student = {
  id: string
  school_id: string
  class_grade: string
  section: string | null
  roll_number: string | null
  users: { name: string; email: string }
}

type AttendanceStatus = 'present' | 'absent'

type AttendanceMap = Record<string, AttendanceStatus>

function getTodayDate() {
  return new Date().toISOString().split('T')[0]
}

export function AttendanceClient({ assignments, tutorId }: { assignments: Assignment[]; tutorId: string }) {
  const [selectedSchoolId, setSelectedSchoolId] = useState('')
  const [selectedGrade, setSelectedGrade] = useState('')
  const [selectedDate, setSelectedDate] = useState(getTodayDate())
  const [students, setStudents] = useState<Student[]>([])
  const [attendance, setAttendance] = useState<AttendanceMap>({})
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [loaded, setLoaded] = useState(false)

  // Unique schools from assignments
  const uniqueSchools = useMemo(() => {
    const map = new Map<string, { id: string; name: string }>()
    for (const a of assignments) {
      if (a.schools?.id && !map.has(a.schools.id)) {
        map.set(a.schools.id, { id: a.schools.id, name: a.schools.name })
      }
    }
    return Array.from(map.values())
  }, [assignments])

  // Unique grades for the selected school
  const gradesForSchool = useMemo(() => {
    if (!selectedSchoolId) return []
    const grades = Array.from(
      new Set(
        assignments
          .filter((a) => a.school_id === selectedSchoolId)
          .map((a) => a.class_grade)
      )
    ).sort()
    return grades
  }, [assignments, selectedSchoolId])

  function handleSchoolChange(schoolId: string) {
    setSelectedSchoolId(schoolId)
    setSelectedGrade('')
    setStudents([])
    setAttendance({})
    setLoaded(false)
  }

  async function loadStudents() {
    if (!selectedSchoolId || !selectedDate) return
    setLoading(true)
    setLoaded(false)

    try {
      const params = new URLSearchParams({ school_id: selectedSchoolId, date: selectedDate })
      if (selectedGrade) params.set('class_grade', selectedGrade)

      const res = await fetch(`/api/students-for-attendance?${params.toString()}`)
      const data = await res.json()

      if (!res.ok) {
        toast(data.error || 'Failed to load students', 'error')
        setLoading(false)
        return
      }

      setStudents(data.students ?? [])

      // Build attendance map — pre-fill existing records, default new ones to 'present'
      const map: AttendanceMap = {}
      for (const student of data.students ?? []) {
        map[student.id] = (data.attendanceMap?.[student.id] as AttendanceStatus) ?? 'present'
      }
      setAttendance(map)
      setLoaded(true)
    } catch (err) {
      toast('An unexpected error occurred', 'error')
    } finally {
      setLoading(false)
    }
  }

  function toggleStatus(studentId: string) {
    setAttendance((prev) => ({
      ...prev,
      [studentId]: prev[studentId] === 'present' ? 'absent' : 'present',
    }))
  }

  function markAll(status: AttendanceStatus) {
    const map: AttendanceMap = {}
    for (const s of students) {
      map[s.id] = status
    }
    setAttendance(map)
  }

  async function submitAttendance() {
    if (students.length === 0) return
    setSubmitting(true)

    try {
      const records = students.map((s) => ({
        student_id: s.id,
        school_id: s.school_id,
        date: selectedDate,
        status: attendance[s.id] ?? 'present',
      }))

      const res = await fetch('/api/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ records }),
      })

      const data = await res.json()
      if (!res.ok) {
        toast(data.error || 'Failed to save attendance', 'error')
      } else {
        toast(`Attendance saved for ${data.count} student${data.count !== 1 ? 's' : ''}!`, 'success')
      }
    } catch (err) {
      toast('An unexpected error occurred', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  const presentCount = students.filter((s) => attendance[s.id] === 'present').length
  const absentCount = students.filter((s) => attendance[s.id] === 'absent').length
  const selectedSchoolName = uniqueSchools.find((s) => s.id === selectedSchoolId)?.name

  return (
    <div className="space-y-6">
      <PageHeader
        title="Attendance"
        description="Mark and track student attendance for your assigned schools and classes"
      />

      {/* ── Step 1: Filters ── */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/60 flex items-center gap-2">
          <CalendarDays size={16} className="text-indigo-500" />
          <h2 className="text-sm font-semibold text-slate-700">Select Date, School & Class</h2>
        </div>

        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
          {/* Date */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700 flex items-center gap-1.5">
              <CalendarDays size={14} className="text-slate-400" />
              Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={selectedDate}
              max={getTodayDate()}
              onChange={(e) => {
                setSelectedDate(e.target.value)
                setStudents([])
                setAttendance({})
                setLoaded(false)
              }}
              className="flex h-10 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            />
          </div>

          {/* School */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700 flex items-center gap-1.5">
              <School size={14} className="text-slate-400" />
              School <span className="text-red-500">*</span>
            </label>
            <Select
              value={selectedSchoolId}
              onChange={(e) => handleSchoolChange(e.target.value)}
            >
              <option value="">— Select School —</option>
              {uniqueSchools.map((school) => (
                <option key={school.id} value={school.id}>
                  {school.name}
                </option>
              ))}
            </Select>
          </div>

          {/* Class */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700 flex items-center gap-1.5">
              <BookOpen size={14} className="text-slate-400" />
              Class <span className="text-xs font-normal text-slate-400">(optional)</span>
            </label>
            <Select
              value={selectedGrade}
              onChange={(e) => {
                setSelectedGrade(e.target.value)
                setStudents([])
                setAttendance({})
                setLoaded(false)
              }}
              disabled={!selectedSchoolId}
            >
              <option value="">All Classes</option>
              {gradesForSchool.map((grade) => (
                <option key={grade} value={grade}>
                  Grade {grade}
                </option>
              ))}
            </Select>
          </div>

          {/* Load Button */}
          <Button
            onClick={loadStudents}
            disabled={!selectedSchoolId || !selectedDate || loading}
            loading={loading}
            className="flex items-center gap-2 w-full"
          >
            {loading ? 'Loading…' : (
              <>
                {loaded ? <RefreshCw size={15} /> : <ChevronRight size={15} />}
                {loaded ? 'Reload Students' : 'Load Students'}
              </>
            )}
          </Button>
        </div>
      </div>

      {/* ── Step 2: Attendance Sheet ── */}
      {loaded && (
        <div className="space-y-4">
          {/* Summary Bar */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-indigo-50 flex items-center justify-center">
                <Users size={18} className="text-indigo-600" />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500">Total</p>
                <p className="text-xl font-bold text-slate-900">{students.length}</p>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                <CheckCircle2 size={18} className="text-emerald-600" />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500">Present</p>
                <p className="text-xl font-bold text-emerald-700">{presentCount}</p>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-red-50 flex items-center justify-center">
                <XCircle size={18} className="text-red-500" />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500">Absent</p>
                <p className="text-xl font-bold text-red-600">{absentCount}</p>
              </div>
            </div>
          </div>

          {/* Attendance Sheet */}
          {students.length === 0 ? (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-12 text-center">
              <Users size={36} className="text-slate-300 mx-auto mb-3" />
              <p className="font-semibold text-slate-700">No students found</p>
              <p className="text-sm text-slate-400 mt-1">
                No students are enrolled at{' '}
                {selectedSchoolName}
                {selectedGrade ? ` in Grade ${selectedGrade}` : ''}.
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              {/* Table Header */}
              <div className="px-6 py-3 border-b border-slate-100 bg-slate-50/60 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ClipboardList size={16} className="text-indigo-500" />
                  <span className="text-sm font-semibold text-slate-700">
                    {selectedSchoolName}
                    {selectedGrade ? ` — Grade ${selectedGrade}` : ' — All Classes'}
                    <span className="ml-2 text-slate-400 font-normal">
                      {new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-IN', {
                        weekday: 'short', day: 'numeric', month: 'short', year: 'numeric'
                      })}
                    </span>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => markAll('present')}
                    className="text-xs font-medium px-3 py-1.5 rounded-lg border border-emerald-200 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 transition-colors"
                  >
                    Mark All Present
                  </button>
                  <button
                    onClick={() => markAll('absent')}
                    className="text-xs font-medium px-3 py-1.5 rounded-lg border border-red-200 text-red-600 bg-red-50 hover:bg-red-100 transition-colors"
                  >
                    Mark All Absent
                  </button>
                </div>
              </div>

              {/* Column Headers */}
              <div className="grid grid-cols-[auto_1fr_auto_auto] gap-4 px-6 py-2.5 border-b border-slate-100 bg-slate-50/40 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <span className="w-10 text-center">#</span>
                <span>Student</span>
                <span className="w-32 text-center">Class / Roll</span>
                <span className="w-40 text-center">Attendance</span>
              </div>

              {/* Student Rows */}
              <div className="divide-y divide-slate-100">
                {students.map((student, index) => {
                  const status = attendance[student.id] ?? 'present'
                  const isPresent = status === 'present'
                  return (
                    <div
                      key={student.id}
                      className={`grid grid-cols-[auto_1fr_auto_auto] gap-4 px-6 py-3.5 items-center transition-colors ${
                        isPresent ? 'hover:bg-emerald-50/30' : 'hover:bg-red-50/30 bg-red-50/10'
                      }`}
                    >
                      {/* Index */}
                      <span className="w-10 text-center text-sm font-medium text-slate-400">
                        {index + 1}
                      </span>

                      {/* Student Info */}
                      <div className="flex items-center gap-3 min-w-0">
                        <Avatar name={student.users?.name || 'S'} size="md" />
                        <div className="min-w-0">
                          <p className="font-semibold text-slate-900 truncate">
                            {student.users?.name || 'Unknown'}
                          </p>
                          <p className="text-xs text-slate-400 truncate">{student.users?.email}</p>
                        </div>
                      </div>

                      {/* Class & Roll */}
                      <div className="w-32 text-center">
                        <p className="text-sm font-medium text-slate-700">
                          Grade {student.class_grade}
                          {student.section ? ` – ${student.section}` : ''}
                        </p>
                        <p className="text-xs text-slate-400">
                          Roll: {student.roll_number || '—'}
                        </p>
                      </div>

                      {/* Toggle Buttons */}
                      <div className="w-40 flex gap-2 justify-center">
                        <button
                          onClick={() => isPresent ? undefined : toggleStatus(student.id)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                            isPresent
                              ? 'bg-emerald-500 text-white border-emerald-500 shadow-sm shadow-emerald-200 scale-105'
                              : 'bg-white text-slate-500 border-slate-200 hover:border-emerald-300 hover:text-emerald-600 hover:bg-emerald-50'
                          }`}
                        >
                          <CheckCircle2 size={13} />
                          Present
                        </button>
                        <button
                          onClick={() => !isPresent ? undefined : toggleStatus(student.id)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                            !isPresent
                              ? 'bg-red-500 text-white border-red-500 shadow-sm shadow-red-200 scale-105'
                              : 'bg-white text-slate-500 border-slate-200 hover:border-red-300 hover:text-red-500 hover:bg-red-50'
                          }`}
                        >
                          <XCircle size={13} />
                          Absent
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Submit Footer */}
              <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/60 flex items-center justify-between">
                <p className="text-sm text-slate-500">
                  <span className="font-semibold text-emerald-600">{presentCount} Present</span>
                  {' · '}
                  <span className="font-semibold text-red-500">{absentCount} Absent</span>
                  {' '}out of {students.length} students
                </p>
                <Button
                  onClick={submitAttendance}
                  loading={submitting}
                  disabled={submitting || students.length === 0}
                  className="flex items-center gap-2"
                >
                  <Send size={15} />
                  {submitting ? 'Saving…' : 'Submit Attendance'}
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Empty prompt (before loading) ── */}
      {!loaded && !loading && (
        <div className="bg-white rounded-xl border border-slate-200 border-dashed shadow-sm p-16 text-center">
          <div className="h-16 w-16 rounded-full bg-indigo-50 flex items-center justify-center mx-auto mb-4">
            <ClipboardList size={28} className="text-indigo-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-700 mb-1">Ready to Take Attendance</h3>
          <p className="text-sm text-slate-400 max-w-sm mx-auto">
            Select a date and school above, then click <strong>Load Students</strong> to begin marking attendance.
          </p>
        </div>
      )}
    </div>
  )
}
