'use client'

import { useState } from 'react'
import { Dialog } from '@/components/ui'
import { Building2, User, Mail, Phone, Users, MessageSquare, Calendar, ArrowRight, X } from 'lucide-react'
import Link from 'next/link'

export interface SchoolInquiry {
  id: string
  school_name: string
  contact_name: string
  email: string
  phone: string | null
  student_count: number | null
  message: string | null
  status: string
  created_at: string
}

interface RecentInquiriesProps {
  inquiries: SchoolInquiry[]
}

export function RecentInquiries({ inquiries }: RecentInquiriesProps) {
  const [selectedInquiry, setSelectedInquiry] = useState<SchoolInquiry | null>(null)

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100">
        <h2 className="font-semibold text-slate-900">New School Inquiries</h2>
        <p className="text-xs text-slate-500 mt-0.5">Click on any inquiry to view its full details</p>
      </div>
      <div className="divide-y divide-slate-100">
        {!inquiries || inquiries.length === 0 ? (
          <div className="p-6 text-center text-slate-400 text-sm">No new inquiries</div>
        ) : (
          inquiries.map((inq) => (
            <button
              key={inq.id}
              onClick={() => setSelectedInquiry(inq)}
              className="w-full text-left px-6 py-4 flex items-start gap-3 hover:bg-slate-50 active:bg-slate-100 transition-colors focus:outline-none focus:bg-slate-50/80 group"
            >
              <div className="h-8 w-8 rounded-full bg-indigo-50 text-indigo-600 group-hover:bg-indigo-100 group-hover:text-indigo-700 text-xs font-bold flex items-center justify-center flex-shrink-0 transition-colors">
                {inq.contact_name.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <p className="text-sm font-semibold text-slate-900 truncate group-hover:text-indigo-600 transition-colors">
                    {inq.school_name}
                  </p>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  {inq.contact_name} · {inq.email}
                </p>
              </div>
              <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                <span className="text-xs text-slate-400 whitespace-nowrap">
                  {new Date(inq.created_at).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </span>
                <span className="text-[10px] text-indigo-500 font-medium opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5">
                  View details <ArrowRight size={10} />
                </span>
              </div>
            </button>
          ))
        )}
      </div>

      {/* Inquiry details Modal */}
      <Dialog
        open={!!selectedInquiry}
        onClose={() => setSelectedInquiry(null)}
        title="School Inquiry Details"
      >
        {selectedInquiry && (
          <div className="space-y-6">
            {/* Header info */}
            <div className="flex items-start gap-4 p-4 bg-indigo-50/40 rounded-xl border border-indigo-100/50">
              <div className="h-12 w-12 rounded-xl bg-indigo-600 text-white flex items-center justify-center flex-shrink-0 shadow-sm shadow-indigo-200">
                <Building2 size={24} />
              </div>
              <div className="min-w-0">
                <h3 className="font-bold text-slate-900 text-lg leading-snug truncate">
                  {selectedInquiry.school_name}
                </h3>
                <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                  <Calendar size={13} className="text-slate-400" />
                  <span>
                    Received on{' '}
                    {new Date(selectedInquiry.created_at).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              </div>
            </div>

            {/* Grid details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-slate-50 rounded-lg p-3 border border-slate-100">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 mb-1">
                  <User size={14} className="text-slate-400" />
                  <span>CONTACT PERSON</span>
                </div>
                <p className="text-sm font-semibold text-slate-800">{selectedInquiry.contact_name}</p>
              </div>

              <div className="bg-slate-50 rounded-lg p-3 border border-slate-100">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 mb-1">
                  <Users size={14} className="text-slate-400" />
                  <span>EXPECTED STUDENTS</span>
                </div>
                <p className="text-sm font-semibold text-slate-800">
                  {selectedInquiry.student_count !== null && selectedInquiry.student_count !== undefined
                    ? `${selectedInquiry.student_count.toLocaleString()} students`
                    : 'Not specified'}
                </p>
              </div>

              <div className="bg-slate-50 rounded-lg p-3 border border-slate-100">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 mb-1">
                  <Mail size={14} className="text-slate-400" />
                  <span>EMAIL ADDRESS</span>
                </div>
                <a
                  href={`mailto:${selectedInquiry.email}`}
                  className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 hover:underline break-all"
                >
                  {selectedInquiry.email}
                </a>
              </div>

              <div className="bg-slate-50 rounded-lg p-3 border border-slate-100">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 mb-1">
                  <Phone size={14} className="text-slate-400" />
                  <span>PHONE NUMBER</span>
                </div>
                {selectedInquiry.phone ? (
                  <a
                    href={`tel:${selectedInquiry.phone}`}
                    className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 hover:underline"
                  >
                    {selectedInquiry.phone}
                  </a>
                ) : (
                  <p className="text-sm font-medium text-slate-400">Not provided</p>
                )}
              </div>
            </div>

            {/* Inquiry Message */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                <MessageSquare size={14} className="text-slate-400" />
                <span>INQUIRY MESSAGE</span>
              </div>
              <div className="bg-slate-50 border border-slate-150 rounded-lg p-4 text-sm text-slate-700 leading-relaxed whitespace-pre-wrap min-h-[80px]">
                {selectedInquiry.message ? selectedInquiry.message : (
                  <span className="text-slate-400 italic">No message details provided by the school admin.</span>
                )}
              </div>
            </div>

            {/* Modal actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Link
                href="/super-admin/schools?filter=pending"
                onClick={() => setSelectedInquiry(null)}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm rounded-lg transition-colors shadow-sm"
              >
                Go to Pending Approvals <ArrowRight size={15} />
              </Link>
              <button
                onClick={() => setSelectedInquiry(null)}
                className="px-4 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium text-sm rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Dialog>
    </div>
  )
}
