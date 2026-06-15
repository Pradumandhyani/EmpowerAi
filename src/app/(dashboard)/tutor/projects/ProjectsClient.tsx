'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { PageHeader, Badge, Button, Dialog, FormField, Input, Textarea, Select, toast, Card, CardContent } from '@/components/ui'
import { Plus, BookOpen, Calendar as CalendarIcon, Link as LinkIcon } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import type { Project } from '@/types/database'

interface ProjectWithSchool extends Project {
  schools: { name: string }
}

export function ProjectsClient({ projects: initialProjects, assignments, tutorId }: any) {
  const router = useRouter()
  const supabase = createClient()
  const [projects, setProjects] = useState<ProjectWithSchool[]>(initialProjects)
  const [addOpen, setAddOpen] = useState(false)
  const [loading, setLoading] = useState(false)

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
    </div>
  )
}
