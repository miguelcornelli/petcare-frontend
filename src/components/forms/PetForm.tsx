'use client'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { petSchema, PetInput } from '@/lib/schemas'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'
import { useState, useRef } from 'react'
import { Camera } from 'lucide-react'

interface PetFormProps {
  defaultValues?: Partial<PetInput>
  onSubmit: (data: PetInput, photo?: File) => Promise<void>
  loading?: boolean
}

export function PetForm({ defaultValues, onSubmit, loading }: PetFormProps) {
  const [photo, setPhoto] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const { register, handleSubmit, formState: { errors } } = useForm<PetInput>({
    resolver: zodResolver(petSchema),
    defaultValues,
  })

  function handlePhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setPhoto(file)
    setPreview(URL.createObjectURL(file))
  }

  async function submit(data: PetInput) {
    await onSubmit(data, photo ?? undefined)
  }

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-4">
      <div className="flex justify-center">
        <button type="button" onClick={() => fileRef.current?.click()} className="w-24 h-24 rounded-2xl border-2 border-dashed border-gray-300 hover:border-emerald-400 flex flex-col items-center justify-center gap-1 overflow-hidden transition-colors" aria-label="Adicionar foto do pet">
          {preview ? <img src={preview} alt="Preview" className="w-full h-full object-cover" /> : <><Camera size={20} className="text-gray-400" /><span className="text-xs text-gray-400">Foto</span></>}
        </button>
        <input ref={fileRef} type="file" accept="image/*" onChange={handlePhoto} className="hidden" />
      </div>

      <Input dark label="Nome" placeholder="Nome do pet" error={errors.name?.message} {...register('name')} />
      <Input dark label="Espécie" placeholder="Cão, Gato..." error={errors.species?.message} {...register('species')} />
      <Input dark label="Raça" placeholder="Opcional" {...register('breed')} />
      <Select dark label="Sexo" options={[{ value: 'MALE', label: 'Macho' }, { value: 'FEMALE', label: 'Fêmea' }]} error={errors.gender?.message} {...register('gender')} />
      <Input dark label="Data de Nascimento" type="date" error={errors.birthDate?.message} {...register('birthDate')} />
      <Input dark label="Cor / Pelagem" placeholder="Opcional" {...register('color')} />
      <Input dark label="Microchip" placeholder="Opcional" {...register('microchip')} />

      <Button type="submit" loading={loading} className="w-full">Salvar Pet</Button>
    </form>
  )
}
