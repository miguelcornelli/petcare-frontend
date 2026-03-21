'use client'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { allergySchema, AllergyInput } from '@/lib/schemas'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Textarea } from '@/components/ui/Textarea'
import { Button } from '@/components/ui/Button'

interface AllergyFormProps {
  onSubmit: (data: AllergyInput) => Promise<void>
  loading?: boolean
}

export function AllergyForm({ onSubmit, loading }: AllergyFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<AllergyInput>({
    resolver: zodResolver(allergySchema),
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input dark label="Nome da alergia" placeholder="Ex: Pólen, Frango" error={errors.name?.message} {...register('name')} />
      <Select dark label="Severidade" options={[
        { value: 'LOW', label: 'Baixa' },
        { value: 'MEDIUM', label: 'Média' },
        { value: 'HIGH', label: 'Alta' },
      ]} placeholder="Selecione (opcional)" {...register('severity')} />
      <Textarea label="Observações" placeholder="Opcional" {...register('notes')} />
      <Button type="submit" loading={loading} className="w-full">Salvar Alergia</Button>
    </form>
  )
}
