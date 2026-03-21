'use client'
import { ReactNode } from 'react'
import { Sidebar } from './Sidebar'
import { BottomNav } from './BottomNav'
import { Toaster } from 'react-hot-toast'
import { PawPrint } from 'lucide-react'
import { useAuthStore } from '@/store/auth.store'

function MobileHeader() {
  const { user } = useAuthStore()
  const initial = user?.name?.[0]?.toUpperCase() ?? '?'

  return (
    <header className="lg:hidden fixed top-0 left-0 right-0 z-30 bg-white border-b border-gray-100 h-14 flex items-center justify-between px-4 shadow-sm">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-emerald-500 rounded-xl flex items-center justify-center">
          <PawPrint size={17} className="text-white" />
        </div>
        <span className="font-bold text-gray-900 text-lg">PetCare</span>
      </div>
      <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
        <span className="text-emerald-700 font-semibold text-sm">{initial}</span>
      </div>
    </header>
  )
}

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <MobileHeader />
      <main className="lg:pl-64 lg:min-h-screen mobile-layout">
        <div className="max-w-4xl mx-auto px-4 py-5">
          {children}
        </div>
      </main>
      <BottomNav />
      <Toaster
        position="top-center"
        toastOptions={{
          className: 'text-sm',
          style: { marginTop: 'calc(56px + env(safe-area-inset-top))' },
        }}
      />
    </div>
  )
}
