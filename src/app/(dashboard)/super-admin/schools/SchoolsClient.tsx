'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import {
  PageHeader, Badge, Button, Table, TableHead, TableBody, TableRow, TableTh, TableTd,
  Dialog, FormField, Input, Select, toast
} from '@/components/ui'
import type { School, SchoolStatus, SubscriptionPlan } from '@/types/database'
import { Plus, CheckCircle, XCircle, Edit2, Search } from 'lucide-react'
import { formatDate } from '@/lib/utils'

const statusBadge: Record<SchoolStatus, { variant: 'success' | 'warning' | 'danger'; label: string }> = {
  approved: { variant: 'success', label: 'Approved' },
  pending: { variant: 'warning', label: 'Pending' },
  suspended: { variant: 'danger', label: 'Suspended' },
}

const planBadge: Record<SubscriptionPlan, string> = {
  free: 'Free',
  basic: 'Basic',
  pro: 'Pro',
  enterprise: 'Enterprise',
}

export function SchoolsClient({ schools: initialSchools, initialFilter }: { schools: School[]; initialFilter?: string }) {
  const supabase = createClient()
  const [schools, setSchools] = useState(initialSchools)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState(initialFilter ?? 'all')
  const [editSchool, setEditSchool] = useState<School | null>(null)
  const [addOpen, setAddOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [approvingId, setApprovingId] = useState<string | null>(null)

  const [form, setForm] = useState({
    name: '', address: '', contact_email: '',
    subscription_plan: 'basic' as SubscriptionPlan,
    status: 'pending' as SchoolStatus,
  })

  const filtered = schools.filter((s) => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.contact_email.toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === 'all' || s.status === filter
    return matchSearch && matchFilter
  })

  const handleApprove = async (id: string) => {
    setApprovingId(id)
    try {
      const res = await fetch('/api/admin/approve-school', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ schoolId: id }),
      })
      const result = await res.json()

      if (!res.ok) {
        toast(result.error || 'Failed to approve school', 'error')
      } else {
        setSchools((prev) => prev.map((s) => s.id === id ? { ...s, status: 'approved' } : s))
        toast('School approved! Credentials sent to the school email.', 'success')
      }
    } catch {
      toast('Network error. Please try again.', 'error')
    } finally {
      setApprovingId(null)
    }
  }

  const handleSuspend = async (id: string) => {
    const { error } = await supabase.from('schools').update({ status: 'suspended' }).eq('id', id)
    if (!error) {
      setSchools((prev) => prev.map((s) => s.id === id ? { ...s, status: 'suspended' } : s))
      toast('School suspended', 'info')
    }
  }

  const handleImpersonate = async (schoolId: string) => {
    try {
      const res = await fetch('/api/admin/impersonate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ schoolId }),
      })
      const result = await res.json()
      if (res.ok) {
        window.location.href = '/school-admin'
      } else {
        toast(result.error || 'Failed to impersonate', 'error')
      }
    } catch {
      toast('Network error. Please try again.', 'error')
    }
  }

  const handleUpdateSchool = async () => {
    if (!editSchool) return
    setLoading(true)
    const { error } = await supabase.from('schools').update({
      name: form.name,
      address: form.address,
      contact_email: form.contact_email,
      subscription_plan: form.subscription_plan,
      status: form.status,
    }).eq('id', editSchool.id)

    if (!error) {
      setSchools((prev) => prev.map((s) => s.id === editSchool.id
        ? { ...s, ...form } : s))
      toast('School updated', 'success')
      setEditSchool(null)
    } else {
      toast(error.message, 'error')
    }
    setLoading(false)
  }

  const handleAddSchool = async () => {
    setLoading(true)
    const { data, error } = await supabase.from('schools').insert({
      name: form.name,
      address: form.address || null,
      contact_email: form.contact_email,
      subscription_plan: form.subscription_plan,
      status: form.status,
      subscription_status: 'active',
    }).select().single()

    if (!error && data) {
      setSchools((prev) => [data, ...prev])
      toast('School added successfully', 'success')
      setAddOpen(false)
      setForm({ name: '', address: '', contact_email: '', subscription_plan: 'basic', status: 'pending' })
    } else {
      toast(error?.message ?? 'Failed to add school', 'error')
    }
    setLoading(false)
  }

  const openEdit = (school: School) => {
    setEditSchool(school)
    setForm({
      name: school.name,
      address: school.address ?? '',
      contact_email: school.contact_email,
      subscription_plan: school.subscription_plan,
      status: school.status,
    })
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Schools"
        description="Manage all schools on the platform"
        action={
          <Button onClick={() => { setAddOpen(true); setForm({ name: '', address: '', contact_email: '', subscription_plan: 'basic', status: 'pending' }) }}>
            <Plus size={16} /> Add School
          </Button>
        }
      />

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input
            placeholder="Search schools..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 pl-9 pr-4 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          />
        </div>
        <div className="flex gap-2">
          {['all', 'pending', 'approved', 'suspended'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${filter === f ? 'bg-indigo-600 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <Table>
          <TableHead>
            <TableRow>
              <TableTh>School</TableTh>
              <TableTh>Contact Email</TableTh>
              <TableTh>Plan</TableTh>
              <TableTh>Status</TableTh>
              <TableTh>Registered</TableTh>
              <TableTh>Actions</TableTh>
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableTd className="text-center py-12 text-slate-400" colSpan={6 as any}>
                  No schools found
                </TableTd>
              </TableRow>
            ) : (
              filtered.map((school) => {
                const sb = statusBadge[school.status]
                return (
                  <TableRow key={school.id}>
                    <TableTd>
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-lg bg-indigo-100 text-indigo-700 text-xs font-bold flex items-center justify-center">
                          {school.name.charAt(0)}
                        </div>
                        <span className="font-medium text-slate-900">{school.name}</span>
                      </div>
                    </TableTd>
                    <TableTd>{school.contact_email}</TableTd>
                    <TableTd>
                      <span className="text-xs font-medium text-slate-600 bg-slate-100 px-2 py-1 rounded-full">
                        {planBadge[school.subscription_plan]}
                      </span>
                    </TableTd>
                    <TableTd>
                      <Badge variant={sb.variant}>{sb.label}</Badge>
                    </TableTd>
                    <TableTd>{formatDate(school.created_at)}</TableTd>
                    <TableTd>
                      <div className="flex items-center gap-2">
                        {school.status === 'pending' && (
                          <Button size="sm" loading={approvingId === school.id} onClick={() => handleApprove(school.id)}>
                            <CheckCircle size={14} /> Approve
                          </Button>
                        )}
                        {school.status === 'approved' && (
                          <>
                            <Button size="sm" variant="outline" className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 border-indigo-200" onClick={() => handleImpersonate(school.id)}>
                              Login as School
                            </Button>
                            <Button size="sm" variant="destructive" onClick={() => handleSuspend(school.id)}>
                              <XCircle size={14} /> Suspend
                            </Button>
                          </>
                        )}
                        <Button size="icon" variant="ghost" onClick={() => openEdit(school)}>
                          <Edit2 size={14} />
                        </Button>
                      </div>
                    </TableTd>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Edit Dialog */}
      <Dialog open={!!editSchool} onClose={() => setEditSchool(null)} title="Edit School">
        <div className="space-y-4">
          <FormField label="School Name" required><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></FormField>
          <FormField label="Contact Email" required><Input type="email" value={form.contact_email} onChange={(e) => setForm({ ...form, contact_email: e.target.value })} /></FormField>
          <FormField label="Address"><Input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} /></FormField>
          <FormField label="Subscription Plan">
            <Select value={form.subscription_plan} onChange={(e) => setForm({ ...form, subscription_plan: e.target.value as SubscriptionPlan })}>
              <option value="free">Free</option>
              <option value="basic">Basic</option>
              <option value="pro">Pro</option>
              <option value="enterprise">Enterprise</option>
            </Select>
          </FormField>
          <FormField label="Status">
            <Select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as SchoolStatus })}>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="suspended">Suspended</option>
            </Select>
          </FormField>
          <div className="flex gap-3 pt-2">
            <Button className="flex-1" onClick={handleUpdateSchool} loading={loading}>Save Changes</Button>
            <Button variant="outline" onClick={() => setEditSchool(null)}>Cancel</Button>
          </div>
        </div>
      </Dialog>

      {/* Add Dialog */}
      <Dialog open={addOpen} onClose={() => setAddOpen(false)} title="Add School">
        <div className="space-y-4">
          <FormField label="School Name" required><Input placeholder="Sunrise Academy" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></FormField>
          <FormField label="Contact Email" required><Input type="email" placeholder="admin@school.com" value={form.contact_email} onChange={(e) => setForm({ ...form, contact_email: e.target.value })} /></FormField>
          <FormField label="Address"><Input placeholder="123 Education Lane, City" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} /></FormField>
          <FormField label="Subscription Plan">
            <Select value={form.subscription_plan} onChange={(e) => setForm({ ...form, subscription_plan: e.target.value as SubscriptionPlan })}>
              <option value="free">Free</option>
              <option value="basic">Basic</option>
              <option value="pro">Pro</option>
              <option value="enterprise">Enterprise</option>
            </Select>
          </FormField>
          <FormField label="Status">
            <Select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as SchoolStatus })}>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
            </Select>
          </FormField>
          <div className="flex gap-3 pt-2">
            <Button className="flex-1" onClick={handleAddSchool} loading={loading}>Add School</Button>
            <Button variant="outline" onClick={() => setAddOpen(false)}>Cancel</Button>
          </div>
        </div>
      </Dialog>
    </div>
  )
}
