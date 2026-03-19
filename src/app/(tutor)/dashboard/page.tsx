'use client'
import { useEffect, useState } from 'react'
import { useAuthStore } from '@/store/auth.store'
import { petsService } from '@/services/pets.service'
import { Pet, PaginatedResult } from '@/types'
import { PetCard } from '@/components/cards/PetCard'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { Dog, Plus } from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'

export default function DashboardPage() {
  const { user } = useAuthStore()
  const [pets, setPets] = useState<PaginatedResult<Pet> | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    petsService.list({ limit: 6 })
      .then(setPets)
      .catch(() => toast.error('Erro ao carregar pets'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Olá, {user?.name?.split(' ')[0]} 👋</h1>
        <p className="text-sm text-gray-500 mt-1">Gerencie a saúde dos seus pets</p>
      </div>

      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-gray-900">Meus Pets</h2>
        <Link href="/pets/novo">
          <Button size="sm"><Plus size={16} className="mr-1" /> Novo Pet</Button>
        </Link>
      </div>

      {loading ? (
        <div className="grid gap-3 sm:grid-cols-2">
          {[1, 2, 3].map((i) => <div key={i} className="h-20 bg-gray-100 rounded-2xl animate-pulse" />)}
        </div>
      ) : !pets?.data.length ? (
        <EmptyState icon={Dog} title="Nenhum pet cadastrado" description="Adicione seu primeiro pet para começar" action={<Link href="/pets/novo"><Button size="sm">Adicionar Pet</Button></Link>} />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {pets.data.map((pet) => <PetCard key={pet.id} pet={pet} />)}
        </div>
      )}

      {(pets?.meta.total ?? 0) > 6 && (
        <Link href="/pets" className="block text-center text-sm text-emerald-600 font-medium hover:underline">
          Ver todos os pets →
        </Link>
      )}
    </div>
  )
}
