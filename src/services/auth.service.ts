import { api } from '@/lib/axios'
import { AuthTokens } from '@/types'
import { LoginInput, RegisterInput } from '@/lib/schemas'

export const authService = {
  login: (data: LoginInput) => api.post<AuthTokens>('/auth/login', data).then((r) => r.data),
  register: (data: RegisterInput) => api.post('/auth/register', data).then((r) => r.data),
  logout: (refreshToken: string) => api.post('/auth/logout', { refreshToken }),
  refresh: (refreshToken: string) => api.post<{ accessToken: string; refreshToken: string }>('/auth/refresh', { refreshToken }).then((r) => r.data),
}
