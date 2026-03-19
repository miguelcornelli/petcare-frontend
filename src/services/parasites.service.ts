import { api } from '@/lib/axios'
import { AntiParasite, PaginatedResult } from '@/types'
import { AntiParasiteInput } from '@/lib/schemas'

export const parasitesService = {
  list: (petId: string, params?: { page?: number }) =>
    api.get<PaginatedResult<AntiParasite>>(`/pets/${petId}/parasites`, { params }).then((r) => r.data),

  create: (petId: string, data: AntiParasiteInput, boxPhoto?: File) => {
    const form = new FormData()
    Object.entries(data).forEach(([k, v]) => v && form.append(k, v))
    if (boxPhoto) form.append('boxPhoto', boxPhoto)
    return api.post<AntiParasite>(`/pets/${petId}/parasites`, form, { headers: { 'Content-Type': 'multipart/form-data' } }).then((r) => r.data)
  },

  update: (id: string, data: Partial<AntiParasiteInput>) =>
    api.put<AntiParasite>(`/parasites/${id}`, data).then((r) => r.data),
}
