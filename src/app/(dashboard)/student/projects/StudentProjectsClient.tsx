'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { PageHeader, Badge, Button, Card, CardContent } from '@/components/ui'
import { BookOpen, CheckCircle2, Clock, AlertCircle } from 'lucide-react'
import { formatDate } from '@/lib/utils'

export function StudentProjectsClient({ projects, submissions, studentId }: any) {
  const router = useRouter()
  const [filter, setFilter] = useState('all')

  const filtered = projects.filter((p: any) => {
    const sub = submissions.find((s: any) => s.project_id === p.id)
    if (filter === 'all') return true
    if (filter === 'pending') return !sub
    if (filter === 'submitted') return sub && sub.marks_obtained === null
    if (filter === 'graded') return sub && sub.marks_obtained !== null
    return true
  })

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Projects"
        description="View and submit your assignments"
      />

      <div className="flex gap-2 pb-2 overflow-x-auto">
        {['all', 'pending', 'submitted', 'graded'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${filter === f ? 'bg-indigo-600 text-white shadow-sm' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
          >
            {f === 'all' ? 'All Projects' : f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filtered.length === 0 ? (
          <div className="col-span-full py-12 text-center text-slate-500 bg-white rounded-xl border border-slate-200 border-dashed">
            <BookOpen size={32} className="mx-auto text-slate-300 mb-3" />
            <p>No projects found in this category.</p>
          </div>
        ) : (
          filtered.map((project: any) => {
            const sub = submissions.find((s: any) => s.project_id === project.id)
            const isOverdue = !sub && new Date(project.due_date) < new Date()
            
            return (
              <Card key={project.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => router.push(`/student/projects/${project.id}`)}>
                <CardContent className="p-5 flex flex-col h-full">
                  <div className="flex justify-between items-start mb-3">
                    <Badge variant={sub ? (sub.marks_obtained !== null ? 'success' : 'info') : (isOverdue ? 'danger' : 'warning')}>
                      {sub ? (sub.marks_obtained !== null ? 'Graded' : 'Submitted') : (isOverdue ? 'Overdue' : 'Pending')}
                    </Badge>
                    <span className="text-xs text-slate-500 font-medium">{formatDate(project.due_date, 'MMM d')}</span>
                  </div>
                  
                  <h3 className="font-semibold text-slate-900 text-lg mb-1 line-clamp-1">{project.title}</h3>
                  <p className="text-xs text-slate-500 mb-3">By {project.tutors.users.name}</p>
                  
                  <p className="text-sm text-slate-600 line-clamp-2 mb-4 flex-1">
                    {project.description}
                  </p>
                  
                  {sub?.marks_obtained !== null && sub !== undefined ? (
                    <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-sm font-medium text-slate-700">Your Grade</span>
                      <span className="font-bold text-emerald-600">{sub.marks_obtained} <span className="text-slate-400 font-normal text-xs">/ {project.max_marks}</span></span>
                    </div>
                  ) : (
                    <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between text-sm">
                      <span className="text-slate-500">Max marks: {project.max_marks}</span>
                      <Button size="sm" variant={sub ? 'outline' : 'default'} className="px-6">
                        {sub ? 'View' : 'Submit Now'}
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })
        )}
      </div>
    </div>
  )
}
