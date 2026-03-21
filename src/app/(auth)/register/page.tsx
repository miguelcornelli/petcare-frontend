'use client'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { registerSchema, RegisterInput } from '@/lib/schemas'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'
import { authService } from '@/services/auth.service'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import { PawPrint } from 'lucide-react'
import { AxiosError } from 'axios'
import { ApiError } from '@/types'

export default function RegisterPage() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const { register, handleSubmit, watch, formState: { errors } } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: 'TUTOR' },
  })

  const role = watch('role')

  async function onSubmit(data: RegisterInput) {
    setLoading(true)
    try {
      await authService.register(data)
      toast.success('Conta criada com sucesso!')
      router.push('/login')
    } catch (err) {
      const msg = (err as AxiosError<ApiError>).response?.data?.message ?? 'Erro ao criar conta'
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-500 rounded-2xl shadow-lg mb-4">
            <PawPrint size={32} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Criar conta</h1>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <Input dark label="Nome completo" error={errors.name?.message} {...register('name')} />
            <Input dark label="E-mail" type="email" error={errors.email?.message} {...register('email')} />
            <Input dark label="Senha" type="password" error={errors.password?.message} {...register('password')} />
            <Select dark label="Perfil" options={[{ value: 'TUTOR', label: 'Tutor (Dono do pet)' }, { value: 'VET', label: 'Veterinário' }, { value: 'CLINIC', label: 'Clínica / Estabelecimento' }]} error={errors.role?.message} {...register('role')} />
            {role === 'TUTOR' && <Input dark label="CPF" placeholder="000.000.000-00" {...register('cpf')} />}
            {role === 'VET' && <Input dark label="CRMV" placeholder="CRMV-SP 12345" {...register('crmv')} />}
            <Input dark label="Telefone" placeholder="Opcional" {...register('phone')} />
            <Button type="submit" loading={loading} className="w-full" size="lg">Criar conta</Button>
          </form>
          <p className="text-center text-sm text-gray-500 mt-4">
            Já tem conta? <a href="/login" className="text-emerald-600 font-medium hover:underline">Entrar</a>
          </p>
        </div>
      </div>
    </div>
  )
}
