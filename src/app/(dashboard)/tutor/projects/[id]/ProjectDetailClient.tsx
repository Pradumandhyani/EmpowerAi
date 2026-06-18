'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { PageHeader, Badge, Button, Table, TableHead, TableBody, TableRow, TableTh, TableTd, Dialog, FormField, Input, Textarea, toast, Avatar } from '@/components/ui'
import { ChevronLeft, FileText, CheckCircle2, AlertCircle, Clock, Link as LinkIcon } from 'lucide-react'
import { formatDate } from '@/lib/utils'

export function ProjectDetailClient({ project, students, submissions: initialSubmissions }: any) {
  const supabase = createClient()
  const router = useRouter()
  const [submissions, setSubmissions] = useState(initialSubmissions)
  const [gradeOpen, setGradeOpen] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ marks: '', feedback: '' })

  const handleGrade = async () => {
    if (!gradeOpen) return
    setLoading(true)

    const marksObtained = parseFloat(form.marks)
    if (isNaN(marksObtained) || marksObtained < 0 || marksObtained > project.max_marks) {
      toast(`Marks must be between 0 and ${project.max_marks}`, 'error')
      setLoading(false)
      return
    }

    const { data, error } = await supabase.from('submissions').update({
      marks_obtained: marksObtained,
      feedback: form.feedback,
      graded_at: new Date().toISOString(),
    }).eq('id', gradeOpen.submission_id).select().single()

    if (!error && data) {
      setSubmissions((prev: any) => prev.map((s: any) => s.id === data.id ? data : s))
      toast('Grade saved successfully', 'success')
      
      // Trigger email notification
      fetch('/api/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'grade_posted',
          data: {
            to: gradeOpen.student.email,
            studentName: gradeOpen.student.name,
            projectTitle: project.title,
            marksObtained: marksObtained,
            maxMarks: project.max_marks,
            feedback: form.feedback
          }
        })
      })

      setGradeOpen(null)
    } else {
      toast(error?.message || 'Failed to save grade', 'error')
    }
    setLoading(false)
  }

  // Map students with their submissions
  const roster = students.map((student: any) => {
    const sub = submissions.find((s: any) => s.student_id === student.id)
    return {
      student,
      submission: sub,
      status: sub ? (sub.graded_at ? 'graded' : 'submitted') : 'pending'
    }
  })

  // Stats
  const total = roster.length
  const submitted = roster.filter((r: any) => r.status !== 'pending').length
  const graded = roster.filter((r: any) => r.status === 'graded').length

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-2">
        <Link href="/tutor/projects" className="text-slate-400 hover:text-slate-600 transition-colors">
          <ChevronLeft size={20} />
        </Link>
        <span className="text-sm font-medium text-slate-500">Back to Projects</span>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="space-y-4 flex-1">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Badge variant="secondary">{project.schools.name}</Badge>
                <Badge variant="info">Grade {project.class_grade} {project.section && `- ${project.section}`}</Badge>
              </div>
              <h1 className="text-2xl font-bold text-slate-900">{project.title}</h1>
              <p className="text-sm text-slate-500 mt-1">Due Date: <span className="font-medium text-slate-700">{formatDate(project.due_date)}</span></p>
            </div>
            
            <div className="bg-slate-50 rounded-lg p-4 border border-slate-100">
              <p className="text-sm text-slate-700 whitespace-pre-wrap">{project.description}</p>
            </div>
          </div>

          <div className="flex flex-row md:flex-col gap-4 min-w-[200px]">
            <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-4 flex-1">
              <p className="text-xs font-semibold text-indigo-800 uppercase tracking-wider mb-1">Max Marks</p>
              <p className="text-3xl font-bold text-indigo-600">{project.max_marks}</p>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 flex-1">
              <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">Submissions</p>
              <p className="text-lg font-bold text-slate-900">{submitted} <span className="text-slate-400 text-sm font-medium">/ {total}</span></p>
              <div className="w-full bg-slate-200 rounded-full h-1.5 mt-2 overflow-hidden">
                <div className="bg-indigo-600 h-1.5 rounded-full" style={{ width: `${total > 0 ? (submitted / total) * 100 : 0}%` }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100">
          <h2 className="font-semibold text-slate-900">Student Submissions</h2>
        </div>
        <Table>
          <TableHead>
            <TableRow>
              <TableTh>Student</TableTh>
              <TableTh>Status</TableTh>
              <TableTh>Submitted On</TableTh>
              <TableTh>Marks</TableTh>
              <TableTh>Action</TableTh>
            </TableRow>
          </TableHead>
          <TableBody>
            {roster.length === 0 ? (
              <TableRow>
                <TableTd className="text-center py-12 text-slate-400" colSpan={5 as any}>No students enrolled in this class.</TableTd>
              </TableRow>
            ) : (
              roster.map((row: any) => (
                <TableRow key={row.student.id}>
                  <TableTd>
                    <div className="flex items-center gap-3">
                      <Avatar name={row.student.users.name} size="sm" />
                      <div>
                        <p className="font-medium text-slate-900">{row.student.users.name}</p>
                        <p className="text-xs text-slate-500">Sec {row.student.section}</p>
                      </div>
                    </div>
                  </TableTd>
                  <TableTd>
                    {row.status === 'pending' && <Badge variant="secondary"><Clock size={12} className="mr-1 inline" /> Pending</Badge>}
                    {row.status === 'submitted' && <Badge variant="warning"><AlertCircle size={12} className="mr-1 inline" /> Needs Grading</Badge>}
                    {row.status === 'graded' && <Badge variant="success"><CheckCircle2 size={12} className="mr-1 inline" /> Graded</Badge>}
                  </TableTd>
                  <TableTd>
                    {row.submission?.submitted_at ? formatDate(row.submission.submitted_at, 'MMM d, h:mm a') : '-'}
                  </TableTd>
                  <TableTd>
                    {row.status === 'graded' ? (
                      <span className="font-medium text-emerald-600">{row.submission.marks_obtained} <span className="text-slate-400 font-normal">/ {project.max_marks}</span></span>
                    ) : '-'}
                  </TableTd>
                  <TableTd>
                    {row.status === 'pending' ? (
                      <span className="text-xs text-slate-400 italic">Waiting for student</span>
                    ) : (
                      <Button 
                        size="sm" 
                        variant={row.status === 'submitted' ? 'default' : 'outline'}
                        onClick={() => {
                          setGradeOpen({
                            submission_id: row.submission.id,
                            student: { name: row.student.users.name, email: row.student.users.email },
                            file_url: row.submission.file_url,
                            remarks: row.submission.remarks,
                            marks: row.submission.marks_obtained ?? '',
                            feedback: row.submission.feedback ?? ''
                          })
                          setForm({
                            marks: row.submission.marks_obtained?.toString() ?? '',
                            feedback: row.submission.feedback ?? ''
                          })
                        }}
                      >
                        {row.status === 'submitted' ? 'Grade Now' : 'Edit Grade'}
                      </Button>
                    )}
                  </TableTd>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!gradeOpen} onClose={() => setGradeOpen(null)} title={`Grade ${gradeOpen?.student?.name}`}>
        {gradeOpen && (
          <div className="space-y-6">
            <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
              <p className="text-sm font-semibold text-slate-900 mb-2">Student's Work</p>
              {gradeOpen.file_url ? (
                <a href={gradeOpen.file_url} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm text-indigo-600 hover:underline mb-3 font-medium break-all">
                  <LinkIcon size={16} className="shrink-0" /> Open Project Link
                </a>
              ) : (
                <p className="text-sm text-slate-500 mb-3 italic">No link submitted</p>
              )}
              {gradeOpen.remarks && (
                <div>
                  <p className="text-xs text-slate-500 mb-1">Student Remarks:</p>
                  <p className="text-sm text-slate-700 italic border-l-2 border-slate-300 pl-3">"{gradeOpen.remarks}"</p>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <FormField label={`Marks Obtained (Out of ${project.max_marks})`} required>
                <div className="relative w-1/2">
                  <Input 
                    type="number" 
                    min="0" 
                    max={project.max_marks} 
                    step="0.5"
                    value={form.marks} 
                    onChange={(e) => setForm({ ...form, marks: e.target.value })} 
                    className="text-lg font-semibold"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium">/ {project.max_marks}</span>
                </div>
              </FormField>

              <FormField label="Feedback Comments">
                <Textarea 
                  placeholder="Great job on..." 
                  value={form.feedback} 
                  onChange={(e) => setForm({ ...form, feedback: e.target.value })}
                  className="min-h-[100px]"
                />
              </FormField>

              <div className="flex gap-3 pt-2">
                <Button className="flex-1" onClick={handleGrade} loading={loading} disabled={!form.marks}>
                  Save Grade & Notify Student
                </Button>
                <Button variant="outline" onClick={() => setGradeOpen(null)}>Cancel</Button>
              </div>
            </div>
          </div>
        )}
      </Dialog>
    </div>
  )
}
