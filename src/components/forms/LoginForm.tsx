'use client'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginSchema, LoginInput } from '@/lib/schemas'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { useAuth } from '@/hooks/useAuth'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { AxiosError } from 'axios'
import { ApiError } from '@/types'

export function LoginForm() {
  const { login } = useAuth()
  const [loading, setLoading] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  })

  async function onSubmit(data: LoginInput) {
    setLoading(true)
    try {
      await login(data)
    } catch (err) {
      const msg = (err as AxiosError<ApiError>).response?.data?.message ?? 'Erro ao fazer login'
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <Input label="E-mail" type="email" placeholder="seu@email.com" error={errors.email?.message} {...register('email')} />
      <Input label="Senha" type="password" placeholder="••••••" error={errors.password?.message} {...register('password')} />
      <Button type="submit" loading={loading} className="w-full" size="lg">
        Entrar
      </Button>
    </form>
  )
}
