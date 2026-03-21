'use client'
import { useState } from 'react'
import { petsService } from '@/services/pets.service'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Pet } from '@/types'
import { Search, Dog, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import toast from 'react-hot-toast'
import { formatDate } from '@/utils/date'

const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') ?? 'http://localhost:3001'

export default function BuscarPetPage() {
  const [cpf, setCpf] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ tutor: { name: string; phone?: string; cpf?: string }; pets: Pet[] } | null>(null)

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (!cpf.replace(/\D/g, '')) return
    setLoading(true)
    try {
      const data = await petsService.searchByCpf(cpf)
      setResult(data)
      if (data.pets.length === 0) toast('Tutor encontrado, mas não tem pets cadastrados', { icon: '🐾' })
    } catch {
      toast.error('Tutor não encontrado com este CPF')
      setResult(null)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-5">
      <h1 className="text-xl font-bold text-gray-900">Buscar Pet</h1>

      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="flex-1">
          <Input
            dark
            placeholder="CPF do tutor (ex: 000.000.000-00)"
            value={cpf}
            onChange={(e) => setCpf(e.target.value)}
          />
        </div>
        <Button type="submit" loading={loading} className="shrink-0">
          <Search size={16} />
        </Button>
      </form>

      {result && (
        <div className="space-y-4">
          {/* Tutor info */}
          <Card>
            <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Tutor</p>
            <p className="font-semibold text-gray-900">{result.tutor.name}</p>
            {result.tutor.phone && <p className="text-sm text-gray-500 mt-0.5">{result.tutor.phone}</p>}
          </Card>

          {/* Pets list */}
          {result.pets.length > 0 && (
            <div>
              <h2 className="font-medium text-gray-700 mb-2">Pets ({result.pets.length})</h2>
              <div className="space-y-2">
                {result.pets.map((pet) => (
                  <Link key={pet.id} href={`/vet/pets/${pet.id}`}>
                    <Card className="hover:shadow-md transition-shadow cursor-pointer">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl overflow-hidden bg-emerald-50 flex items-center justify-center shrink-0">
                          {pet.photo ? (
                            <Image src={`${API_URL}/uploads/${pet.photo}`} alt={pet.name} width={48} height={48} className="object-cover w-full h-full" />
                          ) : (
                            <Dog size={22} className="text-emerald-400" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-900">{pet.name}</p>
                          <p className="text-sm text-gray-500">{pet.species}{pet.breed ? ` · ${pet.breed}` : ''}</p>
                          <p className="text-xs text-gray-400 mt-0.5">Nasc: {formatDate(pet.birthDate)}</p>
                        </div>
                        <ChevronRight size={18} className="text-gray-400 shrink-0" />
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
