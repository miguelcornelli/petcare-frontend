'use client'
import { useAuthStore } from '@/store/auth.store'
import { authService } from '@/services/auth.service'
import { LoginInput } from '@/lib/schemas'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

export function useAuth() {
  const { user, setAuth, logout: storeLogout, isAuthenticated, refreshToken } = useAuthStore()
  const router = useRouter()

  async function login(data: LoginInput) {
    const result = await authService.login(data)
    setAuth(result.user, result.accessToken, result.refreshToken)
    toast.success(`Bem-vindo, ${result.user.name}!`)

    const redirectMap = { TUTOR: '/dashboard', VET: '/vet/dashboard', CLINIC: '/clinic/buscar-pet' }
    router.push(redirectMap[result.user.role])
  }

  async function logout() {
    try {
      if (refreshToken) await authService.logout(refreshToken)
    } finally {
      storeLogout()
      router.push('/login')
    }
  }

  return { user, login, logout, isAuthenticated }
}
