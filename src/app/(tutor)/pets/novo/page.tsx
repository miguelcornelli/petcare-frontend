'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { PetForm } from '@/components/forms/PetForm'
import { petsService } from '@/services/pets.service'
import { PetInput } from '@/lib/schemas'
import { ArrowLeft } from 'lucide-react'
import toast from 'react-hot-toast'
import Link from 'next/link'

export default function NovoPetPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleSubmit(data: PetInput, photo?: File) {
    setLoading(true)
    try {
      await petsService.create(data, photo)
      toast.success('Pet cadastrado com sucesso!')
      router.push('/pets')
    } catch {
      toast.error('Erro ao cadastrar pet')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Link href="/pets" className="p-2 rounded-xl hover:bg-gray-100 transition-colors" aria-label="Voltar">
          <ArrowLeft size={20} className="text-gray-600" />
        </Link>
        <h1 className="text-xl font-bold text-gray-900">Novo Pet</h1>
      </div>
      <PetForm onSubmit={handleSubmit} loading={loading} />
    </div>
  )
}
