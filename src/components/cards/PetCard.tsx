'use client'
import Link from 'next/link'
import Image from 'next/image'
import { Dog } from 'lucide-react'
import { Pet } from '@/types'
import { Card } from '@/components/ui/Card'
import { formatDate } from '@/utils/date'

interface PetCardProps {
  pet: Pet
}

export function PetCard({ pet }: PetCardProps) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') ?? 'http://localhost:3001'

  return (
    <Link href={`/pets/${pet.id}`}>
      <Card className="hover:shadow-md transition-shadow cursor-pointer">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl overflow-hidden bg-emerald-50 flex items-center justify-center flex-shrink-0">
            {pet.photo ? (
              <Image src={`${API_URL}/uploads/${pet.photo}`} alt={pet.name} width={56} height={56} className="object-cover w-full h-full" />
            ) : (
              <Dog size={24} className="text-emerald-400" />
            )}
          </div>
          <div className="min-w-0">
            <h3 className="font-semibold text-gray-900 truncate">{pet.name}</h3>
            <p className="text-sm text-gray-500">{pet.species}{pet.breed ? ` · ${pet.breed}` : ''}</p>
            <p className="text-xs text-gray-400 mt-0.5">Nascimento: {formatDate(pet.birthDate)}</p>
          </div>
        </div>
      </Card>
    </Link>
  )
}
