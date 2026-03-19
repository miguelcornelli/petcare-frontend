'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/auth.store'
import { AppShell } from '@/components/layout/AppShell'

export default function TutorLayout({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated } = useAuthStore()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated()) router.replace('/login')
    else if (user?.role !== 'TUTOR') router.replace('/login')
  }, [user, isAuthenticated, router])

  if (!user) return null

  return <AppShell>{children}</AppShell>
}
