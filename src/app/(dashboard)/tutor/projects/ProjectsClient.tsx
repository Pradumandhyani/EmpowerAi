'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { PageHeader, Badge, Button, Dialog, FormField, Input, Textarea, Select, toast, Card, CardContent, Table, TableHead, TableBody, TableRow, TableTh, TableTd, Avatar } from '@/components/ui'
import { Plus, BookOpen, Calendar as CalendarIcon, Link as LinkIcon, Clock, AlertCircle, CheckCircle2 } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import type { Project } from '@/types/database'

interface ProjectWithSchool extends Project {
  schools: { name: string }
}

export function ProjectsClient({ projects: initialProjects, assignments, tutorId, pendingSubmissions: initialPendingSubmissions }: any) {
  const router = useRouter()
  const supabase = createClient()
  const [projects, setProjects] = useState<ProjectWithSchool[]>(initialProjects)
  const [pendingSubmissions, setPendingSubmissions] = useState<any[]>(initialPendingSubmissions ?? [])
  const [activeTab, setActiveTab] = useState<'projects' | 'evaluations'>('projects')
  const [addOpen, setAddOpen] = useState(false)
  const [gradeOpen, setGradeOpen] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [gradeForm, setGradeForm] = useState({ marks: '', feedback: '' })

  const [form, setForm] = useState({
    assignment_id: '',
    section: '',
    title: '',
    description: '',
    due_date: '',
    max_marks: 100,
  })

  const handleAddProject = async () => {
    if (!form.assignment_id || !form.title || !form.due_date) return
    setLoading(true)

    const assignment = assignments.find((a: any) => a.id === form.assignment_id)
    
    const { data, error } = await supabase.from('projects').insert({
      tutor_id: tutorId,
      school_id: assignment.school_id,
      class_grade: assignment.class_grade,
      section: form.section || null,
      title: form.title,
      description: form.description,
      due_date: form.due_date,
      max_marks: form.max_marks,
    }).select('*, schools(name)').single()

    if (!error && data) {
      setProjects([data as ProjectWithSchool, ...projects])
      toast('Project created successfully', 'success')
      setAddOpen(false)
      setForm({ assignment_id: '', section: '', title: '', description: '', due_date: '', max_marks: 100 })
    } else {
      toast(error?.message || 'Failed to create project', 'error')
    }
    setLoading(false)
  }

  const handleGrade = async () => {
    if (!gradeOpen) return
    setLoading(true)

    const marksObtained = parseFloat(gradeForm.marks)
    if (isNaN(marksObtained) || marksObtained < 0 || marksObtained > gradeOpen.project.max_marks) {
      toast(`Marks must be between 0 and ${gradeOpen.project.max_marks}`, 'error')
      setLoading(false)
      return
    }

    const { data, error } = await supabase.from('submissions').update({
      marks_obtained: marksObtained,
      feedback: gradeForm.feedback,
      graded_at: new Date().toISOString(),
    }).eq('id', gradeOpen.submission_id).select().single()

    if (!error && data) {
      setPendingSubmissions((prev: any) => prev.filter((s: any) => s.id !== gradeOpen.submission_id))
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
            projectTitle: gradeOpen.project.title,
            marksObtained: marksObtained,
            maxMarks: gradeOpen.project.max_marks,
            feedback: gradeForm.feedback
          }
        })
      })

      setGradeOpen(null)
    } else {
      toast(error?.message || 'Failed to save grade', 'error')
    }
    setLoading(false)
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Projects"
        description="Assign and manage projects for your classes"
        action={
          <Button onClick={() => setAddOpen(true)}>
            <Plus size={16} /> Create Project
          </Button>
        }
      />

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-6 mb-2">
        <button
          onClick={() => setActiveTab('projects')}
          className={`pb-3 text-sm font-semibold border-b-2 transition-colors ${
            activeTab === 'projects'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
          }`}
        >
          All Projects ({projects.length})
        </button>
        <button
          onClick={() => setActiveTab('evaluations')}
          className={`pb-3 text-sm font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
            activeTab === 'evaluations'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
          }`}
        >
          Pending Evaluations
          {pendingSubmissions.length > 0 && (
            <span className="bg-amber-100 text-amber-800 text-xs font-semibold px-2 py-0.5 rounded-full ml-1">
              {pendingSubmissions.length}
            </span>
          )}
        </button>
      </div>

      {activeTab === 'projects' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {projects.length === 0 ? (
            <div className="col-span-full py-12 text-center text-slate-500 bg-white rounded-xl border border-slate-200 border-dashed">
              No projects created yet.
            </div>
          ) : (
            projects.map(project => (
              <Card key={project.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => router.push(`/tutor/projects/${project.id}`)}>
                <CardContent className="p-5 flex flex-col h-full">
                  <div className="flex justify-between items-start mb-3">
                    <Badge variant="secondary" className="bg-indigo-50 text-indigo-700">
                      {project.schools.name}
                    </Badge>
                    <Badge variant={new Date(project.due_date) < new Date() ? 'danger' : 'success'}>
                      Due {formatDate(project.due_date)}
                    </Badge>
                  </div>
                  <h3 className="font-semibold text-slate-900 text-lg mb-1 line-clamp-1">{project.title}</h3>
                  <p className="text-sm text-slate-500 line-clamp-2 mb-4 flex-1">
                    {project.description}
                  </p>
                  <div className="flex items-center justify-between text-xs font-medium text-slate-600 mt-auto pt-4 border-t border-slate-100">
                    <span className="flex items-center gap-1.5"><BookOpen size={14} /> Grade {project.class_grade} {project.section && `- Sec ${project.section}`}</span>
                    <span>Max: {project.max_marks} pts</span>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <Table>
            <TableHead>
              <TableRow>
                <TableTh>Student</TableTh>
                <TableTh>Project</TableTh>
                <TableTh>Class</TableTh>
                <TableTh>Submitted On</TableTh>
                <TableTh>Action</TableTh>
              </TableRow>
            </TableHead>
            <TableBody>
              {pendingSubmissions.length === 0 ? (
                <TableRow>
                  <TableTd className="text-center py-12 text-slate-400" colSpan={5 as any}>
                    No evaluations pending! All caught up.
                  </TableTd>
                </TableRow>
              ) : (
                pendingSubmissions.map((sub: any) => (
                  <TableRow key={sub.id}>
                    <TableTd>
                      <div className="flex items-center gap-3">
                        <Avatar name={sub.students.users.name} size="sm" />
                        <div>
                          <p className="font-medium text-slate-900">{sub.students.users.name}</p>
                          <p className="text-xs text-slate-500">{sub.students.users.email}</p>
                        </div>
                      </div>
                    </TableTd>
                    <TableTd>
                      <div>
                        <p className="font-medium text-slate-900 truncate max-w-[200px]">{sub.projects.title}</p>
                        <p className="text-xs text-slate-500 truncate max-w-[200px]">{sub.projects.schools.name}</p>
                      </div>
                    </TableTd>
                    <TableTd>
                      <Badge variant="info">
                        Grade {sub.students.class_grade} {sub.students.section && `- ${sub.students.section}`}
                      </Badge>
                    </TableTd>
                    <TableTd>
                      <span className="text-sm text-slate-600">
                        {formatDate(sub.submitted_at, 'MMM d, h:mm a')}
                      </span>
                    </TableTd>
                    <TableTd>
                      <Button
                        size="sm"
                        onClick={() => {
                          setGradeOpen({
                            submission_id: sub.id,
                            student: { name: sub.students.users.name, email: sub.students.users.email },
                            file_url: sub.file_url,
                            remarks: sub.remarks,
                            project: { title: sub.projects.title, max_marks: sub.projects.max_marks }
                          })
                          setGradeForm({
                            marks: '',
                            feedback: ''
                          })
                        }}
                      >
                        Grade Now
                      </Button>
                    </TableTd>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Create Project Dialog */}
      <Dialog open={addOpen} onClose={() => setAddOpen(false)} title="Create New Project">
        <div className="space-y-4">
          <FormField label="Assign to Class" required>
            <Select value={form.assignment_id} onChange={(e) => setForm({ ...form, assignment_id: e.target.value })}>
              <option value="">Select class assignment...</option>
              {assignments.map((a: any) => (
                <option key={a.id} value={a.id}>
                  {a.schools.name} — {a.subject} (Grade {a.class_grade})
                </option>
              ))}
            </Select>
          </FormField>
          
          <FormField label="Specific Section (Optional)">
            <Input placeholder="e.g. A" value={form.section} onChange={(e) => setForm({ ...form, section: e.target.value })} />
            <p className="text-xs text-slate-400 mt-1">Leave blank to assign to all sections</p>
          </FormField>

          <FormField label="Project Title" required>
            <Input placeholder="Mid-term Science Project" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </FormField>

          <FormField label="Description" required>
            <Textarea 
              placeholder="Detail the requirements..." 
              value={form.description} 
              onChange={(e) => setForm({ ...form, description: e.target.value })} 
              className="min-h-[120px]"
            />
          </FormField>

          <div className="grid grid-cols-2 gap-4">
            <FormField label="Due Date" required>
              <Input type="date" value={form.due_date} onChange={(e) => setForm({ ...form, due_date: e.target.value })} />
            </FormField>
            <FormField label="Max Marks" required>
              <Input type="number" min="1" value={form.max_marks} onChange={(e) => setForm({ ...form, max_marks: parseInt(e.target.value) || 0 })} />
            </FormField>
          </div>

          <div className="flex gap-3 pt-4">
            <Button className="flex-1" onClick={handleAddProject} loading={loading} disabled={!form.assignment_id || !form.title || !form.due_date}>
              Create Project
            </Button>
            <Button variant="outline" onClick={() => setAddOpen(false)}>Cancel</Button>
          </div>
        </div>
      </Dialog>

      {/* Grade Dialog */}
      <Dialog open={!!gradeOpen} onClose={() => setGradeOpen(null)} title={`Grade ${gradeOpen?.student?.name}`}>
        {gradeOpen && (
          <div className="space-y-6">
            <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
              <div className="mb-3">
                <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Project Title</p>
                <p className="text-sm text-slate-800 font-medium">{gradeOpen.project.title}</p>
              </div>
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
              <FormField label={`Marks Obtained (Out of ${gradeOpen.project.max_marks})`} required>
                <div className="relative w-1/2">
                  <Input 
                    type="number" 
                    min="0" 
                    max={gradeOpen.project.max_marks} 
                    step="0.5"
                    value={gradeForm.marks} 
                    onChange={(e) => setGradeForm({ ...gradeForm, marks: e.target.value })} 
                    className="text-lg font-semibold"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium">/ {gradeOpen.project.max_marks}</span>
                </div>
              </FormField>

              <FormField label="Feedback Comments">
                <Textarea 
                  placeholder="Great job on..." 
                  value={gradeForm.feedback} 
                  onChange={(e) => setGradeForm({ ...gradeForm, feedback: e.target.value })}
                  className="min-h-[100px]"
                />
              </FormField>

              <div className="flex gap-3 pt-2">
                <Button className="flex-1" onClick={handleGrade} loading={loading} disabled={!gradeForm.marks}>
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
