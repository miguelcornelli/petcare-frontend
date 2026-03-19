import { api } from '@/lib/axios'
import { Vaccine, PaginatedResult } from '@/types'
import { VaccineInput } from '@/lib/schemas'

export const vaccinesService = {
  list: (petId: string, params?: { page?: number }) =>
    api.get<PaginatedResult<Vaccine>>(`/pets/${petId}/vaccines`, { params }).then((r) => r.data),

  create: (petId: string, data: VaccineInput, labelPhoto?: File) => {
    const form = new FormData()
    Object.entries(data).forEach(([k, v]) => v && form.append(k, v))
    if (labelPhoto) form.append('labelPhoto', labelPhoto)
    return api.post<Vaccine>(`/pets/${petId}/vaccines`, form, { headers: { 'Content-Type': 'multipart/form-data' } }).then((r) => r.data)
  },

  update: (id: string, data: Partial<VaccineInput>) =>
    api.put<Vaccine>(`/vaccines/${id}`, data).then((r) => r.data),
}
