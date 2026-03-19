'use client'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { accessService } from '@/services/access.service'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Search } from 'lucide-react'
import toast from 'react-hot-toast'

const schema = z.object({ tutorCpf: z.string().min(11), petId: z.string().uuid('ID inválido') })
type FormData = z.infer<typeof schema>

export default function BuscarPetPage() {
  const [loading, setLoading] = useState(false)
  const [requested, setRequested] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({ resolver: zodResolver(schema) })

  async function onSubmit(data: FormData) {
    setLoading(true)
    try {
      await accessService.request(data.tutorCpf, data.petId)
      setRequested(true)
      toast.success('Solicitação enviada ao tutor!')
    } catch {
      toast.error('Tutor ou pet não encontrado')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold text-gray-900">Buscar Pet</h1>
      <Card>
        {requested ? (
          <div className="text-center py-4">
            <p className="text-emerald-600 font-medium">Solicitação enviada!</p>
            <p className="text-sm text-gray-500 mt-1">Aguardando aprovação do tutor.</p>
            <Button variant="secondary" className="mt-4" onClick={() => setRequested(false)}>Nova Busca</Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input label="CPF do Tutor" placeholder="000.000.000-00" error={errors.tutorCpf?.message} {...register('tutorCpf')} />
            <Input label="ID do Pet" placeholder="UUID do pet" error={errors.petId?.message} {...register('petId')} />
            <Button type="submit" loading={loading} className="w-full"><Search size={16} className="mr-2" />Solicitar Acesso</Button>
          </form>
        )}
      </Card>
    </div>
  )
}
