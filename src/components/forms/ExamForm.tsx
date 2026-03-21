'use client'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { examSchema, ExamInput } from '@/lib/schemas'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Button } from '@/components/ui/Button'
import { useRef, useState } from 'react'
import { FileText, X } from 'lucide-react'

interface ExamFormProps {
  onSubmit: (data: ExamInput, file?: File) => Promise<void>
  loading?: boolean
}

export function ExamForm({ onSubmit, loading }: ExamFormProps) {
  const [file, setFile] = useState<File | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const { register, handleSubmit, formState: { errors } } = useForm<ExamInput>({
    resolver: zodResolver(examSchema),
  })

  async function submit(data: ExamInput) {
    await onSubmit(data, file ?? undefined)
  }

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <Input dark label="Data" type="date" error={errors.date?.message} {...register('date')} />
        <Input dark label="Tipo" placeholder="Hemograma" error={errors.type?.message} {...register('type')} />
      </div>
      <Input dark label="Laboratório" placeholder="Opcional" {...register('lab')} />
      <Textarea label="Resultado" placeholder="Opcional" {...register('result')} />
      <Textarea label="Observações" placeholder="Opcional" {...register('notes')} />

      {/* PDF Upload */}
      <div>
        <label className="text-sm font-medium text-gray-700 block mb-1">Anexar PDF</label>
        {file ? (
          <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-2">
            <FileText size={16} className="text-emerald-600 shrink-0" />
            <span className="text-sm text-emerald-700 truncate flex-1">{file.name}</span>
            <button type="button" onClick={() => setFile(null)} className="text-gray-400 hover:text-gray-600">
              <X size={15} />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="w-full border-2 border-dashed border-gray-300 hover:border-emerald-400 rounded-xl py-3 text-sm text-gray-400 hover:text-emerald-600 transition-colors flex items-center justify-center gap-2"
          >
            <FileText size={16} />
            Selecionar PDF
          </button>
        )}
        <input
          ref={fileRef}
          type="file"
          accept="application/pdf,image/*"
          className="hidden"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        />
      </div>

      <Button type="submit" loading={loading} className="w-full">Salvar Exame</Button>
    </form>
  )
}
