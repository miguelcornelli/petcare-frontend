import { api } from '@/lib/axios'
import { AccessRequest, AccessLog, PaginatedResult } from '@/types'

export const accessService = {
  request: (tutorCpf: string, petId: string) =>
    api.post<AccessRequest>('/access/request', { tutorCpf, petId }).then((r) => r.data),

  approve: (id: string) =>
    api.post<AccessRequest>(`/access/${id}/approve`).then((r) => r.data),

  reject: (id: string) =>
    api.post<AccessRequest>(`/access/${id}/reject`).then((r) => r.data),

  getLogs: (params?: { page?: number }) =>
    api.get<PaginatedResult<AccessLog>>('/access/logs', { params }).then((r) => r.data),
}
