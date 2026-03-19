'use client'
import { useState, useCallback } from 'react'
import { petsService } from '@/services/pets.service'
import { Pet, PaginatedResult } from '@/types'
import toast from 'react-hot-toast'

export function usePets() {
  const [pets, setPets] = useState<PaginatedResult<Pet> | null>(null)
  const [loading, setLoading] = useState(false)

  const fetchPets = useCallback(async (page = 1) => {
    setLoading(true)
    try {
      const data = await petsService.list({ page })
      setPets(data)
    } catch {
      toast.error('Erro ao carregar pets')
    } finally {
      setLoading(false)
    }
  }, [])

  return { pets, loading, fetchPets }
}
