'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { PageHeader, Badge, Button, Textarea, toast, Card, CardContent, CardHeader, CardTitle } from '@/components/ui'
import { ChevronLeft, FileUp, CheckCircle2, AlertCircle, Clock, Link as LinkIcon, Download } from 'lucide-react'
import { formatDate } from '@/lib/utils'

export function StudentProjectDetailClient({ project, submission: initialSubmission, studentId, schoolId }: any) {
  const supabase = createClient()
  const [submission, setSubmission] = useState(initialSubmission)
  const [loading, setLoading] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [remarks, setRemarks] = useState(initialSubmission?.remarks || '')

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleSubmit = async () => {
    setLoading(true)
    
    let fileUrl = submission?.file_url
    
    if (file) {
      const fileExt = file.name.split('.').pop()
      const fileName = `${studentId}_${project.id}_${Date.now()}.${fileExt}`
      const filePath = `${schoolId}/${fileName}`
      
      const { error: uploadError } = await supabase.storage
        .from('submissions')
        .upload(filePath, file)
        
      if (uploadError) {
        toast(`File upload failed: ${uploadError.message}`, 'error')
        setLoading(false)
        return
      }
      
      const { data: { publicUrl } } = supabase.storage
        .from('submissions')
        .getPublicUrl(filePath)
        
      fileUrl = publicUrl
    }

    const { data, error } = await supabase
      .from('submissions')
      .upsert({
        id: submission?.id || undefined,
        project_id: project.id,
        student_id: studentId,
        school_id: schoolId,
        file_url: fileUrl,
        remarks: remarks,
        submitted_at: new Date().toISOString(),
      }, { onConflict: 'project_id,student_id' })
      .select()
      .single()

    if (!error && data) {
      setSubmission(data)
      toast('Project submitted successfully!', 'success')
    } else {
      toast(error?.message || 'Failed to submit project', 'error')
    }
    
    setLoading(false)
  }

  const isOverdue = !submission && new Date(project.due_date) < new Date()

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-2 mb-2">
        <Link href="/student/projects" className="text-slate-400 hover:text-slate-600 transition-colors">
          <ChevronLeft size={20} />
        </Link>
        <span className="text-sm font-medium text-slate-500">Back to Projects</span>
      </div>

      {/* Project Details */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 lg:p-8">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <Badge variant={submission ? (submission.marks_obtained !== null ? 'success' : 'info') : (isOverdue ? 'danger' : 'warning')}>
                {submission ? (submission.marks_obtained !== null ? 'Graded' : 'Submitted') : (isOverdue ? 'Overdue' : 'Pending')}
              </Badge>
              <span className="text-sm text-slate-500 font-medium">Due: {formatDate(project.due_date)}</span>
            </div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">{project.title}</h1>
            <p className="text-sm text-slate-500">Assigned by <span className="font-medium text-slate-700">{project.tutors.users.name}</span></p>
          </div>
          <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 text-center min-w-[120px]">
            <p className="text-xs font-bold text-indigo-800 uppercase tracking-wider mb-1">Max Marks</p>
            <p className="text-3xl font-bold text-indigo-600">{project.max_marks}</p>
          </div>
        </div>

        <div className="prose prose-slate max-w-none">
          <h3 className="text-lg font-semibold text-slate-900 mb-3">Description</h3>
          <div className="bg-slate-50 rounded-xl p-5 text-slate-700 whitespace-pre-wrap border border-slate-100 leading-relaxed">
            {project.description}
          </div>
        </div>
      </div>

      {/* Grading Results */}
      {submission?.marks_obtained !== null && submission !== undefined && (
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl border border-emerald-100 shadow-sm p-6 lg:p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <CheckCircle2 size={120} className="text-emerald-500" />
          </div>
          <h3 className="text-lg font-bold text-emerald-900 mb-6 relative z-10 flex items-center gap-2">
            <CheckCircle2 className="text-emerald-500" /> Grade Results
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
            <div className="md:col-span-1 bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-emerald-100/50 text-center">
              <p className="text-sm font-semibold text-emerald-800 uppercase tracking-wider mb-2">Marks Obtained</p>
              <p className="text-4xl font-extrabold text-emerald-600">
                {submission.marks_obtained} <span className="text-lg text-emerald-400 font-medium">/ {project.max_marks}</span>
              </p>
              <p className="text-sm font-medium text-emerald-600 mt-2 bg-emerald-100/50 py-1 px-3 rounded-full inline-block">
                {Math.round((submission.marks_obtained / project.max_marks) * 100)}%
              </p>
            </div>
            
            <div className="md:col-span-2 bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-emerald-100/50">
              <p className="text-sm font-semibold text-emerald-800 uppercase tracking-wider mb-2">Tutor Feedback</p>
              <p className="text-emerald-900 leading-relaxed italic">
                {submission.feedback ? `"${submission.feedback}"` : "No specific feedback provided."}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Submission Area */}
      {(!submission || submission.marks_obtained === null) && (
        <Card className="border-indigo-100 shadow-sm">
          <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <FileUp className="text-indigo-500" size={20} />
              {submission ? 'Update Submission' : 'Submit Your Work'}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Upload File</label>
              <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 hover:bg-slate-50 transition-colors">
                <input
                  type="file"
                  id="file-upload"
                  className="hidden"
                  onChange={handleFileChange}
                />
                <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">
                  <div className="h-10 w-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3">
                    <FileUp size={20} />
                  </div>
                  <p className="text-sm font-medium text-slate-900 mb-1">
                    {file ? file.name : 'Click to select a file'}
                  </p>
                  <p className="text-xs text-slate-500">PDF, Word, or Image files up to 10MB</p>
                </label>
              </div>
              {submission?.file_url && !file && (
                <div className="mt-3 flex items-center gap-2 text-sm text-indigo-600 bg-indigo-50 py-2 px-3 rounded-lg border border-indigo-100">
                  <LinkIcon size={14} /> Current file attached
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Remarks (Optional)</label>
              <Textarea 
                placeholder="Any notes for your tutor..." 
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                className="min-h-[100px]"
              />
            </div>

            <div className="flex justify-end pt-2">
              <Button onClick={handleSubmit} loading={loading} disabled={!file && !submission?.file_url} className="px-8">
                {submission ? 'Update Submission' : 'Submit Project'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
