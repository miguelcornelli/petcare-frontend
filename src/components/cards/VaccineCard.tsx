import { Vaccine } from '@/types'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { formatDate, isExpired, isExpiringSoon } from '@/utils/date'
import { Syringe } from 'lucide-react'

export function VaccineCard({ vaccine }: { vaccine: Vaccine }) {
  const expired = isExpired(vaccine.expiresAt)
  const expiring = !expired && isExpiringSoon(vaccine.expiresAt)

  return (
    <Card>
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
            <Syringe size={18} className="text-blue-500" />
          </div>
          <div className="min-w-0">
            <p className="font-medium text-gray-900 truncate">{vaccine.name}</p>
            <p className="text-xs text-gray-500">Aplicada: {formatDate(vaccine.appliedAt)}</p>
            {vaccine.vet && <p className="text-xs text-gray-400">Dr. {vaccine.vet.name}</p>}
          </div>
        </div>
        <div className="flex-shrink-0">
          {expired ? <Badge variant="red">Vencida</Badge> : expiring ? <Badge variant="yellow">A vencer</Badge> : <Badge variant="green">Válida</Badge>}
        </div>
      </div>
      <p className="text-xs text-gray-500 mt-2">Validade: {formatDate(vaccine.expiresAt)}</p>
    </Card>
  )
}
