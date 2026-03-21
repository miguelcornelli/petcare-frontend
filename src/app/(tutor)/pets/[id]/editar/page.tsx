'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { petsService } from '@/services/pets.service'
import { PetForm } from '@/components/forms/PetForm'
import { PetInput } from '@/lib/schemas'
import { Pet } from '@/types'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'

export default function EditarPetPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [pet, setPet] = useState<Pet | null>(null)
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)

  useEffect(() => {
    petsService.get(id)
      .then(setPet)
      .catch(() => toast.error('Erro ao carregar dados do pet'))
      .finally(() => setFetching(false))
  }, [id])

  async function handleSubmit(data: PetInput, photo?: File) {
    setLoading(true)
    try {
      await petsService.update(id, data, photo)
      toast.success('Pet atualizado com sucesso!')
      router.push(`/pets/${id}`)
    } catch {
      toast.error('Erro ao atualizar pet')
    } finally {
      setLoading(false)
    }
  }

  if (fetching) return (
    <div className="space-y-3">
      {[1, 2, 3].map((i) => <div key={i} className="h-14 bg-gray-100 rounded-2xl animate-pulse" />)}
    </div>
  )

  if (!pet) return null

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Link href={`/pets/${id}`} className="p-2 rounded-xl hover:bg-gray-100 transition-colors" aria-label="Voltar">
          <ArrowLeft size={20} className="text-gray-600" />
        </Link>
        <h1 className="text-xl font-bold text-gray-900">Editar {pet.name}</h1>
      </div>
      <PetForm
        defaultValues={{
          name: pet.name,
          species: pet.species,
          breed: pet.breed,
          gender: pet.gender,
          birthDate: pet.birthDate.split('T')[0],
          color: pet.color,
          microchip: pet.microchip,
        }}
        onSubmit={handleSubmit}
        loading={loading}
      />
    </div>
  )
}
