'use client'
import { useEffect } from 'react'
import { usePets } from '@/hooks/usePets'
import { PetCard } from '@/components/cards/PetCard'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { Dog, Plus } from 'lucide-react'
import Link from 'next/link'

export default function PetsPage() {
  const { pets, loading, fetchPets } = usePets()

  useEffect(() => { fetchPets() }, [fetchPets])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">Meus Pets</h1>
        <Link href="/pets/novo"><Button size="sm"><Plus size={16} className="mr-1" />Novo</Button></Link>
      </div>

      {loading ? (
        <div className="grid gap-3 sm:grid-cols-2">
          {[1, 2, 3].map((i) => <div key={i} className="h-20 bg-gray-100 rounded-2xl animate-pulse" />)}
        </div>
      ) : !pets?.data.length ? (
        <EmptyState icon={Dog} title="Nenhum pet cadastrado" description="Adicione seu primeiro pet" action={<Link href="/pets/novo"><Button>Adicionar Pet</Button></Link>} />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {pets.data.map((pet) => <PetCard key={pet.id} pet={pet} />)}
        </div>
      )}
    </div>
  )
}
