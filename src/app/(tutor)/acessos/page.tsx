'use client'
import { useEffect, useState } from 'react'
import { accessService } from '@/services/access.service'
import { AccessLog } from '@/types'
import { Card } from '@/components/ui/Card'
import { EmptyState } from '@/components/ui/EmptyState'
import { Shield } from 'lucide-react'
import { formatDateTime } from '@/utils/date'
import toast from 'react-hot-toast'

export default function AcessosPage() {
  const [logs, setLogs] = useState<AccessLog[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    accessService.getLogs()
      .then((data) => setLogs(data.data))
      .catch(() => toast.error('Erro ao carregar acessos'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="space-y-3">{[1, 2].map((i) => <div key={i} className="h-16 bg-gray-100 rounded-2xl animate-pulse" />)}</div>

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold text-gray-900">Histórico de Acessos</h1>
      {!logs.length ? (
        <EmptyState icon={Shield} title="Nenhum acesso externo" description="Quando clínicas acessarem os dados dos seus pets, aparecerá aqui" />
      ) : (
        <div className="space-y-2">
          {logs.map((log) => (
            <Card key={log.id}>
              <p className="text-sm text-gray-900">Pet: <span className="font-medium">{log.pet?.name ?? log.petId}</span></p>
              <p className="text-xs text-gray-500 mt-0.5">Acessado em {formatDateTime(log.accessedAt)}</p>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
