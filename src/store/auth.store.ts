import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { User } from '@/types'

interface AuthState {
  user: User | null
  accessToken: string | null
  refreshToken: string | null
  setAuth: (user: User, accessToken: string, refreshToken: string) => void
  updateUser: (user: User) => void
  logout: () => void
  isAuthenticated: () => boolean
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      setAuth: (user, accessToken, refreshToken) => {
        localStorage.setItem('petcare_access_token', accessToken)
        localStorage.setItem('petcare_refresh_token', refreshToken)
        set({ user, accessToken, refreshToken })
      },
      updateUser: (user) => set({ user }),
      logout: () => {
        localStorage.removeItem('petcare_access_token')
        localStorage.removeItem('petcare_refresh_token')
        set({ user: null, accessToken: null, refreshToken: null })
      },
      isAuthenticated: () => !!get().user && !!get().accessToken,
    }),
    { name: 'petcare_auth', partialize: (s) => ({ user: s.user, accessToken: s.accessToken, refreshToken: s.refreshToken }) }
  )
)
