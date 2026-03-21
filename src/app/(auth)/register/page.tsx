'use client'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { registerStep1Schema, registerStep2Schema, RegisterStep1Input, RegisterStep2Input } from '@/lib/schemas'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'
import { authService } from '@/services/auth.service'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import { PawPrint, Eye, EyeOff, ArrowLeft, MapPin } from 'lucide-react'
import { AxiosError } from 'axios'
import { ApiError } from '@/types'

export default function RegisterPage() {
  const [step, setStep] = useState<1 | 2>(1)
  const [step1Data, setStep1Data] = useState<RegisterStep1Input | null>(null)
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const router = useRouter()

  const form1 = useForm<RegisterStep1Input>({
    resolver: zodResolver(registerStep1Schema),
    defaultValues: { role: 'TUTOR' },
  })

  const form2 = useForm<RegisterStep2Input>({
    resolver: zodResolver(registerStep2Schema),
  })

  const role = form1.watch('role')

  function handleStep1(data: RegisterStep1Input) {
    setStep1Data(data)
    setStep(2)
  }

  async function handleStep2(data: RegisterStep2Input) {
    if (!step1Data) return
    setLoading(true)
    try {
      await authService.register({ ...step1Data, password: data.password })
      toast.success('Conta criada com sucesso!')
      router.push('/login')
    } catch (err) {
      const msg = (err as AxiosError<ApiError>).response?.data?.message ?? 'Erro ao criar conta'
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  const password = form2.watch('password') ?? ''
  const rules = [
    { label: 'Mínimo 6 caracteres', ok: password.length >= 6 },
    { label: 'Letra maiúscula', ok: /[A-Z]/.test(password) },
    { label: 'Letra minúscula', ok: /[a-z]/.test(password) },
    { label: 'Número', ok: /[0-9]/.test(password) },
    { label: 'Caractere especial', ok: /[^A-Za-z0-9]/.test(password) },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-500 rounded-2xl shadow-lg mb-4">
            <PawPrint size={32} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Criar conta</h1>
          <p className="text-sm text-gray-500 mt-1">Etapa {step} de 2</p>
        </div>

        {/* Stepper */}
        <div className="flex items-center gap-2 mb-6">
          <div className="flex-1 h-1.5 rounded-full bg-emerald-500" />
          <div className={`flex-1 h-1.5 rounded-full transition-colors ${step === 2 ? 'bg-emerald-500' : 'bg-gray-200'}`} />
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">

          {/* ETAPA 1 */}
          {step === 1 && (
            <>
              <h2 className="font-semibold text-gray-900 mb-4">Seus dados</h2>
              <form onSubmit={form1.handleSubmit(handleStep1)} className="space-y-4" noValidate>
                <Input dark label="Nome completo" placeholder="Seu nome" error={form1.formState.errors.name?.message} {...form1.register('name')} />
                <Input dark label="E-mail" type="email" placeholder="seu@email.com" error={form1.formState.errors.email?.message} {...form1.register('email')} />
                <Select dark label="Perfil" options={[
                  { value: 'TUTOR', label: 'Tutor (Dono do pet)' },
                  { value: 'VET', label: 'Veterinário' },
                  { value: 'CLINIC', label: 'Clínica / Estabelecimento' },
                ]} error={form1.formState.errors.role?.message} {...form1.register('role')} />
                {role === 'TUTOR' && (
                  <Input dark label="CPF" placeholder="000.000.000-00" error={form1.formState.errors.cpf?.message} {...form1.register('cpf')} />
                )}
                {role === 'VET' && (
                  <Input dark label="CRMV" placeholder="CRMV-SP 12345" error={form1.formState.errors.crmv?.message} {...form1.register('crmv')} />
                )}
                <Input dark label="Telefone" placeholder="(11) 99999-0000" error={form1.formState.errors.phone?.message} {...form1.register('phone')} />

                {/* Endereço */}
                <div className="pt-2">
                  <div className="flex items-center gap-2 mb-3">
                    <MapPin size={15} className="text-emerald-500" />
                    <span className="text-sm font-semibold text-gray-700">Endereço</span>
                  </div>
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <div className="w-32">
                        <Input dark label="CEP" placeholder="00000-000" error={form1.formState.errors.zipCode?.message} {...form1.register('zipCode')} />
                      </div>
                      <div className="flex-1">
                        <Input dark label="Estado (UF)" placeholder="SP" error={form1.formState.errors.state?.message} {...form1.register('state')} />
                      </div>
                    </div>
                    <Input dark label="Cidade" placeholder="São Paulo" error={form1.formState.errors.city?.message} {...form1.register('city')} />
                    <Input dark label="Bairro" placeholder="Centro" error={form1.formState.errors.neighborhood?.message} {...form1.register('neighborhood')} />
                    <Input dark label="Rua e número" placeholder="Rua das Flores, 123" error={form1.formState.errors.street?.message} {...form1.register('street')} />
                  </div>
                </div>

                <Button type="submit" className="w-full" size="lg">Continuar</Button>
              </form>
            </>
          )}

          {/* ETAPA 2 */}
          {step === 2 && (
            <>
              <div className="flex items-center gap-2 mb-4">
                <button type="button" onClick={() => setStep(1)} className="p-1 rounded-lg hover:bg-gray-100 transition-colors" aria-label="Voltar">
                  <ArrowLeft size={18} className="text-gray-500" />
                </button>
                <h2 className="font-semibold text-gray-900">Crie sua senha</h2>
              </div>
              <form onSubmit={form2.handleSubmit(handleStep2)} className="space-y-4" noValidate>
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-black">Senha</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      className="w-full rounded-xl border border-gray-300 px-3 py-2 pr-10 text-sm text-black bg-white focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-colors"
                      {...form2.register('password')}
                    />
                    <button type="button" onClick={() => setShowPassword((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600" aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}>
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {form2.formState.errors.password && (
                    <p className="text-xs text-red-500" role="alert">{form2.formState.errors.password.message}</p>
                  )}
                </div>

                {password.length > 0 && (
                  <ul className="space-y-1">
                    {rules.map((r) => (
                      <li key={r.label} className={`flex items-center gap-2 text-xs ${r.ok ? 'text-emerald-600' : 'text-gray-400'}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${r.ok ? 'bg-emerald-500' : 'bg-gray-300'}`} />
                        {r.label}
                      </li>
                    ))}
                  </ul>
                )}

                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-black">Repetir senha</label>
                  <div className="relative">
                    <input
                      type={showConfirm ? 'text' : 'password'}
                      placeholder="••••••••"
                      className="w-full rounded-xl border border-gray-300 px-3 py-2 pr-10 text-sm text-black bg-white focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-colors"
                      {...form2.register('confirmPassword')}
                    />
                    <button type="button" onClick={() => setShowConfirm((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600" aria-label={showConfirm ? 'Ocultar senha' : 'Mostrar senha'}>
                      {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {form2.formState.errors.confirmPassword && (
                    <p className="text-xs text-red-500" role="alert">{form2.formState.errors.confirmPassword.message}</p>
                  )}
                </div>

                <Button type="submit" loading={loading} className="w-full" size="lg">Criar conta</Button>
              </form>
            </>
          )}

          <p className="text-center text-sm text-gray-500 mt-4">
            Já tem conta? <a href="/login" className="text-emerald-600 font-medium hover:underline">Entrar</a>
          </p>
        </div>
      </div>
    </div>
  )
}
