import { api } from '@/lib/axios'
import { Pet, PaginatedResult } from '@/types'
import { PetInput } from '@/lib/schemas'

export const petsService = {
  list: (params?: { page?: number; limit?: number }) =>
    api.get<PaginatedResult<Pet>>('/pets', { params }).then((r) => r.data),

  get: (id: string) => api.get<Pet>(`/pets/${id}`).then((r) => r.data),

  create: (data: PetInput, photo?: File) => {
    const form = new FormData()
    Object.entries(data).forEach(([k, v]) => v && form.append(k, v))
    if (photo) form.append('photo', photo)
    return api.post<Pet>('/pets', form, { headers: { 'Content-Type': 'multipart/form-data' } }).then((r) => r.data)
  },

  update: (id: string, data: Partial<PetInput>, photo?: File) => {
    const form = new FormData()
    Object.entries(data).forEach(([k, v]) => v && form.append(k, v as string))
    if (photo) form.append('photo', photo)
    return api.put<Pet>(`/pets/${id}`, form, { headers: { 'Content-Type': 'multipart/form-data' } }).then((r) => r.data)
  },

  searchByCpf: (cpf: string) =>
    api.get<{ tutor: { id: string; name: string; email: string; phone?: string; cpf?: string }; pets: Pet[] }>(`/pets/search?cpf=${cpf.replace(/\D/g, '')}`).then((r) => r.data),

  delete: (id: string) => api.delete(`/pets/${id}`),

  addWeight: (petId: string, weight: number, date: string) =>
    api.post(`/pets/${petId}/weights`, { weight, date }).then((r) => r.data),
}
