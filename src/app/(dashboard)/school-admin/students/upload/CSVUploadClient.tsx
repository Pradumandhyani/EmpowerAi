'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle, Button, toast, Badge } from '@/components/ui'
import { Upload, FileDown, AlertCircle, CheckCircle2 } from 'lucide-react'
import { CSV_TEMPLATE_HEADERS, CSV_TEMPLATE_EXAMPLE } from '@/lib/csv/parseStudents'

export function CSVUploadClient({ schoolId }: { schoolId: string }) {
  const router = useRouter()
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ created: number; skipped: number; errors: { row: number; message: string }[] } | null>(null)

  const downloadTemplate = () => {
    const blob = new Blob([`${CSV_TEMPLATE_HEADERS}\n${CSV_TEMPLATE_EXAMPLE}`], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'students_template.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleUpload = async () => {
    if (!file) return
    setLoading(true)
    setResult(null)

    const formData = new FormData()
    formData.append('file', file)
    formData.append('school_id', schoolId)

    try {
      const res = await fetch('/api/students/upload', {
        method: 'POST',
        body: formData,
      })
      const data = await res.json()

      if (res.ok) {
        setResult(data)
        if (data.created > 0) {
          toast(`Successfully created ${data.created} students`, 'success')
        }
      } else {
        toast(data.error || 'Upload failed', 'error')
        if (data.errors) setResult({ created: 0, skipped: 0, errors: data.errors })
      }
    } catch (err) {
      toast('An unexpected error occurred', 'error')
    }
    setLoading(false)
  }

  return (
    <div className="max-w-3xl space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Bulk Upload Students</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-sky-50 border border-sky-100 rounded-lg p-4">
            <h4 className="font-semibold text-sky-800 mb-2">Instructions</h4>
            <ul className="list-disc list-inside text-sm text-sky-700 space-y-1">
              <li>Download the CSV template and fill in student details.</li>
              <li><span className="font-semibold">name, email, class_grade, section</span> are required fields.</li>
              <li>Passwords will be auto-generated and emailed to students.</li>
            </ul>
            <Button variant="outline" size="sm" className="mt-4 bg-white" onClick={downloadTemplate}>
              <FileDown size={14} /> Download Template
            </Button>
          </div>

          <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center hover:bg-slate-50 transition-colors">
            <input
              type="file"
              id="csv-upload"
              accept=".csv"
              className="hidden"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
            <label htmlFor="csv-upload" className="cursor-pointer flex flex-col items-center">
              <div className="h-12 w-12 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
                <Upload size={24} />
              </div>
              <p className="text-sm font-medium text-slate-900 mb-1">
                {file ? file.name : 'Click to select CSV file'}
              </p>
              <p className="text-xs text-slate-500">Only .csv files are supported</p>
            </label>
          </div>

          {file && (
            <div className="flex gap-3">
              <Button className="flex-1" onClick={handleUpload} loading={loading}>
                Upload & Process {file.name}
              </Button>
              <Button variant="outline" onClick={() => { setFile(null); setResult(null) }}>
                Cancel
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {result && (
        <Card>
          <CardHeader>
            <CardTitle>Upload Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4">
              <Badge variant="success" className="text-sm px-3 py-1"><CheckCircle2 size={16} className="mr-1" /> {result.created} Created</Badge>
              <Badge variant="warning" className="text-sm px-3 py-1"><AlertCircle size={16} className="mr-1" /> {result.skipped} Skipped</Badge>
              <Badge variant="danger" className="text-sm px-3 py-1"><AlertCircle size={16} className="mr-1" /> {result.errors.length} Errors</Badge>
            </div>

            {result.errors.length > 0 && (
              <div className="bg-red-50 rounded-lg p-4 max-h-60 overflow-y-auto">
                <h5 className="text-sm font-semibold text-red-800 mb-2">Error Details</h5>
                <ul className="space-y-1">
                  {result.errors.map((e, i) => (
                    <li key={i} className="text-xs text-red-700">
                      <span className="font-semibold">Row {e.row}:</span> {e.message}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <Button variant="outline" onClick={() => router.push('/school-admin/students')}>
              Back to Students List
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
