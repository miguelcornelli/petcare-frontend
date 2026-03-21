import { api } from '@/lib/axios'
import { Exam, PaginatedResult } from '@/types'
import { ExamInput } from '@/lib/schemas'

export const examsService = {
  list: (petId: string, params?: { page?: number }) =>
    api.get<PaginatedResult<Exam>>(`/pets/${petId}/exams`, { params }).then((r) => r.data),

  create: (petId: string, data: ExamInput, file?: File) => {
    const form = new FormData()
    Object.entries(data).forEach(([k, v]) => {
      if (!v) return
      // backend expects full ISO datetime
      if (k === 'date') form.append(k, new Date(v).toISOString())
      else form.append(k, v)
    })
    if (file) form.append('file', file)
    return api.post<Exam>(`/pets/${petId}/exams`, form, { headers: { 'Content-Type': 'multipart/form-data' } }).then((r) => r.data)
  },
}
