'use client'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { consultSchema, ConsultInput } from '@/lib/schemas'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Button } from '@/components/ui/Button'

interface ConsultFormProps {
  onSubmit: (data: ConsultInput) => Promise<void>
  loading?: boolean
}

export function ConsultForm({ onSubmit, loading }: ConsultFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<ConsultInput>({
    resolver: zodResolver(consultSchema),
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <Input dark label="Data" type="date" error={errors.date?.message} {...register('date')} />
        <Input dark label="Clínica" placeholder="Opcional" {...register('clinic')} />
      </div>
      <Input dark label="Motivo" placeholder="Ex: Check-up" error={errors.reason?.message} {...register('reason')} />
      <Textarea label="Diagnóstico" placeholder="Opcional" {...register('diagnosis')} />
      <Textarea label="Tratamento" placeholder="Opcional" {...register('treatment')} />
      <Textarea label="Observações" placeholder="Opcional" {...register('notes')} />
      <Button type="submit" loading={loading} className="w-full">Salvar Consulta</Button>
    </form>
  )
}
