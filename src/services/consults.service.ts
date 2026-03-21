import { api } from '@/lib/axios'
import { Consult, PaginatedResult } from '@/types'
import { ConsultInput } from '@/lib/schemas'

export const consultsService = {
  list: (petId: string, params?: { page?: number }) =>
    api.get<PaginatedResult<Consult>>(`/pets/${petId}/consults`, { params }).then((r) => r.data),

  create: (petId: string, data: ConsultInput, attachments?: File[]) => {
    const form = new FormData()
    Object.entries(data).forEach(([k, v]) => {
      if (!v) return
      if (k === 'date') form.append(k, new Date(v).toISOString())
      else form.append(k, v)
    })
    attachments?.forEach((f) => form.append('attachments', f))
    return api.post<Consult>(`/pets/${petId}/consults`, form, { headers: { 'Content-Type': 'multipart/form-data' } }).then((r) => r.data)
  },
}
