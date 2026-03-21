'use client'
import { useAuthStore } from '@/store/auth.store'
import { Search, Stethoscope } from 'lucide-react'
import Link from 'next/link'

export default function VetDashboardPage() {
  const { user } = useAuthStore()
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Olá, Dr. {user?.name?.split(' ')[0]} 👋</h1>
        <p className="text-sm text-gray-500 mt-1">Pronto para atender</p>
      </div>

      <Link href="/vet/buscar">
        <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-5 text-white shadow-lg">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Search size={24} className="text-white" />
            </div>
            <div>
              <p className="font-semibold text-lg">Buscar Pet</p>
              <p className="text-emerald-100 text-sm">Busque pelo CPF do tutor</p>
            </div>
          </div>
        </div>
      </Link>

      <div className="bg-white rounded-2xl p-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
            <Stethoscope size={20} className="text-blue-500" />
          </div>
          <div>
            <p className="font-medium text-gray-900">CRMV: {user?.crmv ?? 'Não informado'}</p>
            <p className="text-sm text-gray-500">{user?.email}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
