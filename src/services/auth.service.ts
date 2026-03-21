import { api } from '@/lib/axios'
import { AuthTokens, User } from '@/types'
import { LoginInput, RegisterInput, ProfileInput } from '@/lib/schemas'

export const authService = {
  login: (data: LoginInput) => api.post<AuthTokens>('/auth/login', data).then((r) => r.data),
  register: (data: RegisterInput) => api.post('/auth/register', data).then((r) => r.data),
  logout: (refreshToken: string) => api.post('/auth/logout', { refreshToken }),
  refresh: (refreshToken: string) => api.post<{ accessToken: string; refreshToken: string }>('/auth/refresh', { refreshToken }).then((r) => r.data),
  getProfile: () => api.get<User>('/auth/profile').then((r) => r.data),
  updateProfile: (data: ProfileInput) => api.put<User>('/auth/profile', data).then((r) => r.data),
}
