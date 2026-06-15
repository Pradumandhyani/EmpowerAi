'use client'

import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle, Badge, Button } from '@/components/ui'
import { BookOpen, CheckCircle2, Clock, AlertCircle } from 'lucide-react'
import { formatDate } from '@/lib/utils'

export function StudentDashboardClient({ projects, submissions, studentId }: any) {
  const pendingProjects = projects.filter((p: any) => !submissions.find((s: any) => s.project_id === p.id))
  
  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-10 w-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock size={20} />
            </div>
            <p className="text-sm font-medium text-slate-500">Pending Tasks</p>
          </div>
          <p className="text-2xl font-bold text-slate-900">{pendingProjects.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-10 w-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 size={20} />
            </div>
            <p className="text-sm font-medium text-slate-500">Submitted Tasks</p>
          </div>
          <p className="text-2xl font-bold text-slate-900">{submissions.length}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Deadlines</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="divide-y divide-slate-100">
              {pendingProjects.length === 0 ? (
                <div className="py-8 text-center text-slate-500 flex flex-col items-center">
                  <CheckCircle2 size={32} className="text-emerald-400 mb-2" />
                  <p>You're all caught up!</p>
                </div>
              ) : (
                pendingProjects.map((p: any) => {
                  const isOverdue = new Date(p.due_date) < new Date()
                  return (
                    <div key={p.id} className="py-4 first:pt-0 last:pb-0 flex items-center gap-4">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-slate-900 truncate">{p.title}</p>
                        <p className="text-xs text-slate-500 mt-1">By {p.tutors.users.name}</p>
                      </div>
                      <div className="text-right">
                        <Badge variant={isOverdue ? 'danger' : 'warning'} className="mb-1">
                          {isOverdue ? 'Overdue' : `Due ${formatDate(p.due_date, 'MMM d')}`}
                        </Badge>
                      </div>
                      <Link href={`/student/projects/${p.id}`}>
                        <Button size="sm">View</Button>
                      </Link>
                    </div>
                  )
                })
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Grades</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="divide-y divide-slate-100">
              {submissions.filter((s: any) => s.marks_obtained !== null).length === 0 ? (
                <div className="py-8 text-center text-slate-500">
                  <BookOpen size={32} className="mx-auto text-slate-300 mb-2" />
                  <p>No graded projects yet.</p>
                </div>
              ) : (
                submissions.filter((s: any) => s.marks_obtained !== null).map((s: any) => {
                  const p = projects.find((proj: any) => proj.id === s.project_id)
                  if (!p) return null
                  const percent = Math.round((s.marks_obtained / p.max_marks) * 100)
                  return (
                    <div key={p.id} className="py-4 first:pt-0 last:pb-0 flex items-center gap-4">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-slate-900 truncate">{p.title}</p>
                        <p className="text-xs text-slate-500 mt-1">Submitted {formatDate(s.submitted_at, 'MMM d')}</p>
                      </div>
                      <div className="text-right">
                        <p className={`text-lg font-bold ${percent >= 75 ? 'text-emerald-600' : percent >= 50 ? 'text-amber-600' : 'text-red-600'}`}>
                          {s.marks_obtained} <span className="text-xs text-slate-400 font-normal">/ {p.max_marks}</span>
                        </p>
                      </div>
                      <Link href={`/student/projects/${p.id}`}>
                        <Button size="sm" variant="outline">Details</Button>
                      </Link>
                    </div>
                  )
                })
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
