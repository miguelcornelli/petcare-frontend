'use client'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { antiParasiteSchema, AntiParasiteInput } from '@/lib/schemas'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Button } from '@/components/ui/Button'

interface AntiParasiteFormProps {
  onSubmit: (data: AntiParasiteInput) => Promise<void>
  loading?: boolean
}

export function AntiParasiteForm({ onSubmit, loading }: AntiParasiteFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<AntiParasiteInput>({
    resolver: zodResolver(antiParasiteSchema),
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input dark label="Medicamento" placeholder="Ex: Nexgard" error={errors.medicationName?.message} {...register('medicationName')} />
      <Input dark label="Marca" placeholder="Opcional" {...register('brand')} />
      <div className="grid grid-cols-2 gap-3">
        <Input dark label="Data de aplicação" type="date" error={errors.appliedAt?.message} {...register('appliedAt')} />
        <Input dark label="Validade" type="date" {...register('expiresAt')} />
      </div>
      <Textarea label="Observações" placeholder="Opcional" {...register('notes')} />
      <Button type="submit" loading={loading} className="w-full">Salvar</Button>
    </form>
  )
}
