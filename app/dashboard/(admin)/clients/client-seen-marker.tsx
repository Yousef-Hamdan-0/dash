'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { markClientsSeen } from '@/app/dashboard/actions/clients'

export default function ClientSeenMarker({ ids }: { ids: string }) {
  const router = useRouter()

  useEffect(() => {
    const clientIds = ids.split(',').filter(Boolean)
    if (clientIds.length === 0) return

    let active = true
    void markClientsSeen(clientIds).then(() => {
      if (active) router.refresh()
    })

    return () => {
      active = false
    }
  }, [ids, router])

  return null
}
