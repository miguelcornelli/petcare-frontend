'use client'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { vaccineSchema, VaccineInput } from '@/lib/schemas'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { useRef, useState } from 'react'
import SignatureCanvas from 'react-signature-canvas'
import { Pen, Trash2 } from 'lucide-react'

interface VaccineFormProps {
  onSubmit: (data: VaccineInput, labelPhoto?: File) => Promise<void>
  loading?: boolean
}

export function VaccineForm({ onSubmit, loading }: VaccineFormProps) {
  const [labelPhoto, setLabelPhoto] = useState<File | null>(null)
  const sigRef = useRef<SignatureCanvas>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<VaccineInput>({
    resolver: zodResolver(vaccineSchema),
  })

  function clearSignature() {
    sigRef.current?.clear()
    setValue('vetSignature', '')
  }

  function saveSignature() {
    if (sigRef.current?.isEmpty()) return
    setValue('vetSignature', sigRef.current!.toDataURL())
  }

  async function submit(data: VaccineInput) {
    saveSignature()
    await onSubmit(data, labelPhoto ?? undefined)
  }

  return (
    // eslint-disable-next-line
    <form onSubmit={handleSubmit(submit)} className="space-y-4">
      <Input label="Nome da Vacina" placeholder="Ex: V10" error={errors.name?.message} {...register('name')} />
      <div className="grid grid-cols-2 gap-3">
        <Input label="Data de Aplicação" type="date" error={errors.appliedAt?.message} {...register('appliedAt')} />
        <Input label="Validade" type="date" error={errors.expiresAt?.message} {...register('expiresAt')} />
      </div>
      <Input label="Lote" placeholder="Opcional" {...register('lot')} />
      <Input label="Fabricante" placeholder="Opcional" {...register('manufacturer')} />

      <div>
        <label className="text-sm font-medium text-gray-700 block mb-1">Foto do Rótulo</label>
        <input ref={fileRef} type="file" accept="image/*" onChange={(e) => setLabelPhoto(e.target.files?.[0] ?? null)} className="w-full text-sm text-gray-500 file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100" />
      </div>

      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="text-sm font-medium text-gray-700">Assinatura Digital</label>
          <button type="button" onClick={clearSignature} className="flex items-center gap-1 text-xs text-red-500 hover:text-red-600">
            <Trash2 size={12} /> Limpar
          </button>
        </div>
        <div className="border-2 border-dashed border-gray-300 rounded-xl overflow-hidden bg-gray-50">
          <SignatureCanvas ref={sigRef} penColor="#1f2937" canvasProps={{ className: 'w-full h-28', style: { width: '100%', height: 112 } }} onEnd={saveSignature} />
        </div>
        <p className="text-xs text-gray-400 mt-1 flex items-center gap-1"><Pen size={10} /> Assine no campo acima</p>
      </div>

      <Button type="submit" loading={loading} className="w-full">Registrar Vacina</Button>
    </form>
  )
}
