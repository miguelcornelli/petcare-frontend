'use client'
import { useEffect, useState } from 'react'
import { petsService } from '@/services/pets.service'
import { vaccinesService } from '@/services/vaccines.service'
import { Pet, Vaccine } from '@/types'
import { VaccineCard } from '@/components/cards/VaccineCard'
import { EmptyState } from '@/components/ui/EmptyState'
import { Syringe } from 'lucide-react'
import toast from 'react-hot-toast'

export default function VacinasPage() {
  const [petVaccines, setPetVaccines] = useState<{ pet: Pet; vaccines: Vaccine[] }[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    petsService.list({ limit: 50 }).then(async ({ data: pets }) => {
      const all = await Promise.all(pets.map(async (pet) => {
        const { data: vaccines } = await vaccinesService.list(pet.id)
        return { pet, vaccines }
      }))
      setPetVaccines(all.filter((x) => x.vaccines.length > 0))
    }).catch(() => toast.error('Erro ao carregar vacinas')).finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="space-y-3">{[1, 2].map((i) => <div key={i} className="h-24 bg-gray-100 rounded-2xl animate-pulse" />)}</div>

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold text-gray-900">Vacinas</h1>
      {!petVaccines.length ? (
        <EmptyState icon={Syringe} title="Nenhuma vacina registrada" description="As vacinas dos seus pets aparecerão aqui" />
      ) : (
        petVaccines.map(({ pet, vaccines }) => (
          <div key={pet.id}>
            <h2 className="font-medium text-gray-700 mb-2">{pet.name}</h2>
            <div className="space-y-2">{vaccines.map((v) => <VaccineCard key={v.id} vaccine={v} />)}</div>
          </div>
        ))
      )}
    </div>
  )
}
