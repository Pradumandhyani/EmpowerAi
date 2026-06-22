'use client'

import { useState } from 'react'
import { Button } from '@/components/ui'
import { LogOut } from 'lucide-react'

export function StopImpersonatingButton() {
  const [loading, setLoading] = useState(false)

  const handleStop = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/impersonate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'stop' }),
      })
      if (res.ok) {
        window.location.href = '/super-admin/schools'
      } else {
        console.error('Failed to stop impersonating')
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button 
      size="sm" 
      variant="outline" 
      className="bg-white/10 hover:bg-white/20 border-white/30 text-white h-7 px-3 text-xs font-bold transition-all"
      onClick={handleStop}
      loading={loading}
    >
      <LogOut size={12} className="mr-1.5" /> Exit Impersonation
    </Button>
  )
}
