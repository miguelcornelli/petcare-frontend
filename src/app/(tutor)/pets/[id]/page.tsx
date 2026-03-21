'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { petsService } from '@/services/pets.service'
import { vaccinesService } from '@/services/vaccines.service'
import { Pet, Vaccine } from '@/types'
import { VaccineCard } from '@/components/cards/VaccineCard'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { ArrowLeft, Syringe, Plus, Pencil } from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { formatDate } from '@/utils/date'
import { Card } from '@/components/ui/Card'

export default function PetDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [pet, setPet] = useState<Pet | null>(null)
  const [vaccines, setVaccines] = useState<Vaccine[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([petsService.get(id), vaccinesService.list(id)])
      .then(([petData, vaccineData]) => {
        setPet(petData)
        setVaccines(vaccineData.data)
      })
      .catch(() => toast.error('Erro ao carregar dados'))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <div className="space-y-3">{[1, 2, 3].map((i) => <div key={i} className="h-20 bg-gray-100 rounded-2xl animate-pulse" />)}</div>
  if (!pet) return null

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <Link href="/pets" className="p-2 rounded-xl hover:bg-gray-100" aria-label="Voltar">
          <ArrowLeft size={20} className="text-gray-600" />
        </Link>
        <h1 className="text-xl font-bold text-gray-900 flex-1">{pet.name}</h1>
        <Link href={`/pets/${id}/editar`} className="p-2 rounded-xl hover:bg-gray-100 transition-colors" aria-label="Editar pet">
          <Pencil size={18} className="text-gray-500" />
        </Link>
      </div>

      <Card>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div><p className="text-gray-500 text-xs">Espécie</p><p className="font-medium">{pet.species}</p></div>
          <div><p className="text-gray-500 text-xs">Raça</p><p className="font-medium">{pet.breed ?? '—'}</p></div>
          <div><p className="text-gray-500 text-xs">Sexo</p><p className="font-medium">{pet.gender === 'MALE' ? 'Macho' : 'Fêmea'}</p></div>
          <div><p className="text-gray-500 text-xs">Nascimento</p><p className="font-medium">{formatDate(pet.birthDate)}</p></div>
        </div>
      </Card>

      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-gray-900">Vacinas</h2>
          <Link href={`/vacinas/nova?petId=${id}`}><Button size="sm"><Plus size={14} className="mr-1" />Adicionar</Button></Link>
        </div>
        {vaccines.length ? (
          <div className="space-y-3">{vaccines.map((v) => <VaccineCard key={v.id} vaccine={v} />)}</div>
        ) : (
          <EmptyState icon={Syringe} title="Nenhuma vacina" description="Registre a primeira vacina deste pet" />
        )}
      </div>
    </div>
  )
}
