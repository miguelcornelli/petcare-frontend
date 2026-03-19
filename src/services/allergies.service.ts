import { api } from '@/lib/axios'
import { Allergy, PaginatedResult } from '@/types'
import { AllergyInput } from '@/lib/schemas'

export const allergiesService = {
  list: (petId: string) =>
    api.get<PaginatedResult<Allergy>>(`/pets/${petId}/allergies`).then((r) => r.data),

  create: (petId: string, data: AllergyInput) =>
    api.post<Allergy>(`/pets/${petId}/allergies`, data).then((r) => r.data),
}
