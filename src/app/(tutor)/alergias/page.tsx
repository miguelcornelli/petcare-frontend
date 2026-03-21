'use client'
import { useEffect, useState } from 'react'
import { petsService } from '@/services/pets.service'
import { allergiesService } from '@/services/allergies.service'
import { Pet, Allergy } from '@/types'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { EmptyState } from '@/components/ui/EmptyState'
import { AlertTriangle } from 'lucide-react'
import toast from 'react-hot-toast'

const severityMap: Record<string, { label: string; variant: 'red' | 'yellow' | 'green' }> = {
  HIGH:   { label: 'Alta',  variant: 'red' },
  MEDIUM: { label: 'Média', variant: 'yellow' },
  LOW:    { label: 'Baixa', variant: 'green' },
}

export default function AlergiasPage() {
  const [petAllergies, setPetAllergies] = useState<{ pet: Pet; allergies: Allergy[] }[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPetId, setSelectedPetId] = useState<string | 'all'>('all')

  useEffect(() => {
    petsService.list({ limit: 50 }).then(async ({ data: pets }) => {
      const all = await Promise.all(pets.map(async (pet) => {
        const { data: allergies } = await allergiesService.list(pet.id)
        return { pet, allergies }
      }))
      setPetAllergies(all.filter((x) => x.allergies.length > 0))
    }).catch(() => toast.error('Erro ao carregar alergias')).finally(() => setLoading(false))
  }, [])

  const filtered = selectedPetId === 'all' ? petAllergies : petAllergies.filter((x) => x.pet.id === selectedPetId)

  if (loading) return <div className="space-y-3">{[1, 2].map((i) => <div key={i} className="h-20 bg-gray-100 rounded-2xl animate-pulse" />)}</div>

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold text-gray-900">Alergias</h1>

      {petAllergies.length > 1 && (
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setSelectedPetId('all')}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${selectedPetId === 'all' ? 'bg-emerald-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
          >
            Todos
          </button>
          {petAllergies.map(({ pet }) => (
            <button
              key={pet.id}
              onClick={() => setSelectedPetId(pet.id)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${selectedPetId === pet.id ? 'bg-emerald-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              {pet.name}
            </button>
          ))}
        </div>
      )}

      {!filtered.length ? (
        <EmptyState icon={AlertTriangle} title="Nenhuma alergia registrada" description="As alergias dos seus pets aparecerão aqui" />
      ) : (
        filtered.map(({ pet, allergies }) => (
          <div key={pet.id}>
            {selectedPetId === 'all' && <h2 className="font-medium text-gray-700 mb-2">{pet.name}</h2>}
            <div className="space-y-2">
              {allergies.map((a) => {
                const sev = a.severity ? severityMap[a.severity] : null
                return (
                  <Card key={a.id}>
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium text-gray-900">{a.name}</p>
                        {a.notes && <p className="text-sm text-gray-500 mt-0.5">{a.notes}</p>}
                      </div>
                      {sev && <Badge variant={sev.variant}>{sev.label}</Badge>}
                    </div>
                  </Card>
                )
              })}
            </div>
          </div>
        ))
      )}
    </div>
  )
}
