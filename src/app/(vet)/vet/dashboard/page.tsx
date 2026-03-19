'use client'
import { useAuthStore } from '@/store/auth.store'
import { Card } from '@/components/ui/Card'
import { Stethoscope } from 'lucide-react'

export default function VetDashboardPage() {
  const { user } = useAuthStore()
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Olá, Dr. {user?.name?.split(' ')[0]}</h1>
        <p className="text-sm text-gray-500">Painel do Veterinário</p>
      </div>
      <Card className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
          <Stethoscope size={22} className="text-blue-500" />
        </div>
        <div>
          <p className="font-medium text-gray-900">Registrar Consulta</p>
          <p className="text-sm text-gray-500">Busque um pet pelo CPF do tutor</p>
        </div>
      </Card>
    </div>
  )
}
