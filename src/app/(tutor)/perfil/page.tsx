'use client'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { profileSchema, ProfileInput } from '@/lib/schemas'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { authService } from '@/services/auth.service'
import { useAuthStore } from '@/store/auth.store'
import { User, MapPin, Phone } from 'lucide-react'
import toast from 'react-hot-toast'
import { AxiosError } from 'axios'
import { ApiError } from '@/types'

export default function PerfilPage() {
  const { user, updateUser } = useAuthStore()
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ProfileInput>({
    resolver: zodResolver(profileSchema),
  })

  useEffect(() => {
    authService.getProfile()
      .then((data) => {
        reset({
          name: data.name ?? '',
          phone: data.phone ?? '',
          zipCode: data.zipCode ?? '',
          street: data.street ?? '',
          neighborhood: data.neighborhood ?? '',
          city: data.city ?? '',
          state: data.state ?? '',
        })
      })
      .catch(() => toast.error('Erro ao carregar perfil'))
      .finally(() => setFetching(false))
  }, [reset])

  async function onSubmit(data: ProfileInput) {
    setLoading(true)
    try {
      const updated = await authService.updateProfile(data)
      updateUser({ ...user!, ...updated })
      toast.success('Perfil atualizado!')
    } catch (err) {
      const msg = (err as AxiosError<ApiError>).response?.data?.message ?? 'Erro ao atualizar perfil'
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  if (fetching) return (
    <div className="space-y-3">
      {[1, 2, 3, 4].map((i) => <div key={i} className="h-14 bg-gray-100 rounded-2xl animate-pulse" />)}
    </div>
  )

  const roleLabel = user?.role === 'TUTOR' ? 'Tutor' : user?.role === 'VET' ? 'Veterinário' : 'Clínica'

  return (
    <div className="space-y-5">
      <h1 className="text-xl font-bold text-gray-900">Meu Perfil</h1>

      {/* Avatar */}
      <div className="flex items-center gap-4 bg-white rounded-2xl p-4 shadow-sm">
        <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
          <span className="text-emerald-700 font-bold text-2xl">{user?.name?.[0]?.toUpperCase()}</span>
        </div>
        <div>
          <p className="font-semibold text-gray-900">{user?.name}</p>
          <p className="text-sm text-gray-500">{user?.email}</p>
          <span className="text-xs bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-medium">{roleLabel}</span>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Dados pessoais */}
        <div className="bg-white rounded-2xl shadow-sm p-4 space-y-4">
          <div className="flex items-center gap-2 mb-1">
            <User size={15} className="text-emerald-500" />
            <span className="text-sm font-semibold text-gray-700">Dados pessoais</span>
          </div>
          <Input dark label="Nome completo" placeholder="Seu nome" error={errors.name?.message} {...register('name')} />
          <Input dark label="Telefone" placeholder="(11) 99999-0000" error={errors.phone?.message} {...register('phone')} />
          {user?.cpf && (
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">CPF</p>
              <p className="text-sm text-gray-400 bg-gray-50 rounded-xl px-3 py-2">{user.cpf}</p>
            </div>
          )}
          {user?.crmv && (
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">CRMV</p>
              <p className="text-sm text-gray-400 bg-gray-50 rounded-xl px-3 py-2">{user.crmv}</p>
            </div>
          )}
        </div>

        {/* Endereço */}
        <div className="bg-white rounded-2xl shadow-sm p-4 space-y-4">
          <div className="flex items-center gap-2 mb-1">
            <MapPin size={15} className="text-emerald-500" />
            <span className="text-sm font-semibold text-gray-700">Endereço</span>
          </div>
          <div className="flex gap-2">
            <div className="w-32">
              <Input dark label="CEP" placeholder="00000-000" error={errors.zipCode?.message} {...register('zipCode')} />
            </div>
            <div className="flex-1">
              <Input dark label="Estado (UF)" placeholder="SP" error={errors.state?.message} {...register('state')} />
            </div>
          </div>
          <Input dark label="Cidade" placeholder="São Paulo" error={errors.city?.message} {...register('city')} />
          <Input dark label="Bairro" placeholder="Centro" error={errors.neighborhood?.message} {...register('neighborhood')} />
          <Input dark label="Rua e número" placeholder="Rua das Flores, 123" error={errors.street?.message} {...register('street')} />
        </div>

        <Button type="submit" loading={loading} className="w-full" size="lg">Salvar alterações</Button>
      </form>
    </div>
  )
}
