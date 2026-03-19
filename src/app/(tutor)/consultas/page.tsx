'use client'
import { useEffect, useState } from 'react'
import { petsService } from '@/services/pets.service'
import { consultsService } from '@/services/consults.service'
import { Pet, Consult } from '@/types'
import { Card } from '@/components/ui/Card'
import { EmptyState } from '@/components/ui/EmptyState'
import { Stethoscope } from 'lucide-react'
import { formatDate } from '@/utils/date'
import toast from 'react-hot-toast'

export default function ConsultasPage() {
  const [petConsults, setPetConsults] = useState<{ pet: Pet; consults: Consult[] }[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    petsService.list({ limit: 50 }).then(async ({ data: pets }) => {
      const all = await Promise.all(pets.map(async (pet) => {
        const { data: consults } = await consultsService.list(pet.id)
        return { pet, consults }
      }))
      setPetConsults(all.filter((x) => x.consults.length > 0))
    }).catch(() => toast.error('Erro ao carregar consultas')).finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="space-y-3">{[1, 2].map((i) => <div key={i} className="h-24 bg-gray-100 rounded-2xl animate-pulse" />)}</div>

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold text-gray-900">Histórico de Consultas</h1>
      {!petConsults.length ? (
        <EmptyState icon={Stethoscope} title="Nenhuma consulta" description="O histórico de consultas aparecerá aqui" />
      ) : (
        petConsults.map(({ pet, consults }) => (
          <div key={pet.id}>
            <h2 className="font-medium text-gray-700 mb-2">{pet.name}</h2>
            <div className="space-y-2">
              {consults.map((c) => (
                <Card key={c.id}>
                  <p className="font-medium text-gray-900">{c.reason}</p>
                  <p className="text-xs text-gray-500 mt-1">{formatDate(c.date)}{c.clinic ? ` · ${c.clinic}` : ''}</p>
                  {c.diagnosis && <p className="text-sm text-gray-600 mt-2"><span className="font-medium">Diagnóstico:</span> {c.diagnosis}</p>}
                  {c.vet && <p className="text-xs text-gray-400 mt-1">Dr. {c.vet.name}</p>}
                </Card>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  )
}
