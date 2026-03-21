'use client'
import { useEffect, useState } from 'react'
import { petsService } from '@/services/pets.service'
import { examsService } from '@/services/exams.service'
import { Pet, Exam } from '@/types'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { EmptyState } from '@/components/ui/EmptyState'
import { ExamForm } from '@/components/forms/ExamForm'
import { FlaskConical, Plus, FileText, ExternalLink } from 'lucide-react'
import { formatDate } from '@/utils/date'
import { Select } from '@/components/ui/Select'
import { ExamInput } from '@/lib/schemas'
import toast from 'react-hot-toast'

const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') ?? 'http://localhost:3001'

export default function ExamesPage() {
  const [petExams, setPetExams] = useState<{ pet: Pet; exams: Exam[] }[]>([])
  const [allPets, setAllPets] = useState<Pet[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPetId, setSelectedPetId] = useState<string | 'all'>('all')
  const [modalOpen, setModalOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [modalPetId, setModalPetId] = useState('')

  async function load() {
    const { data: pets } = await petsService.list({ limit: 50 })
    setAllPets(pets)
    const all = await Promise.all(pets.map(async (pet) => {
      const { data: exams } = await examsService.list(pet.id)
      return { pet, exams }
    }))
    setPetExams(all.filter((x) => x.exams.length > 0))
    if (pets.length > 0 && !modalPetId) setModalPetId(pets[0].id)
  }

  useEffect(() => {
    load().catch(() => toast.error('Erro ao carregar exames')).finally(() => setLoading(false))
  }, [])

  async function handleAdd(data: ExamInput, file?: File) {
    if (!modalPetId) return
    setSaving(true)
    try {
      await examsService.create(modalPetId, data, file)
      toast.success('Exame registrado!')
      setModalOpen(false)
      await load()
    } catch {
      toast.error('Erro ao salvar exame')
    } finally {
      setSaving(false)
    }
  }

  const filtered = selectedPetId === 'all' ? petExams : petExams.filter((x) => x.pet.id === selectedPetId)

  if (loading) return <div className="space-y-3">{[1, 2].map((i) => <div key={i} className="h-24 bg-gray-100 rounded-2xl animate-pulse" />)}</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">Exames</h1>
        {allPets.length > 0 && (
          <Button size="sm" onClick={() => setModalOpen(true)}>
            <Plus size={16} className="mr-1" />Adicionar
          </Button>
        )}
      </div>

      {petExams.length > 1 && (
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setSelectedPetId('all')}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${selectedPetId === 'all' ? 'bg-emerald-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
          >
            Todos
          </button>
          {petExams.map(({ pet }) => (
            <button
              key={pet.id}
              onClick={() => setSelectedPetId(pet.id)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${selectedPetId === pet.id ? 'bg-emerald-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              {pet.name}
            </button>
          ))}
        </div>
      )}

      {!filtered.length ? (
        <EmptyState
          icon={FlaskConical}
          title="Nenhum exame registrado"
          description="Adicione o primeiro exame do seu pet"
          action={allPets.length > 0 ? <Button size="sm" onClick={() => setModalOpen(true)}><Plus size={14} className="mr-1" />Adicionar</Button> : undefined}
        />
      ) : (
        filtered.map(({ pet, exams }) => (
          <div key={pet.id}>
            {selectedPetId === 'all' && <h2 className="font-medium text-gray-700 mb-2">{pet.name}</h2>}
            <div className="space-y-2">
              {exams.map((exam) => (
                <Card key={exam.id}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-medium text-gray-900">{exam.type}</p>
                      {exam.lab && <p className="text-xs text-gray-500">{exam.lab}</p>}
                      <p className="text-xs text-gray-400 mt-1">{formatDate(exam.date)}</p>
                      {exam.result && <p className="text-sm text-gray-600 mt-1.5"><span className="font-medium">Resultado:</span> {exam.result}</p>}
                      {exam.vet && <p className="text-xs text-gray-400 mt-1">Dr. {exam.vet.name}</p>}
                    </div>
                    {exam.fileUrl && (
                      <a
                        href={`${API_URL}/uploads/${exam.fileUrl}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-xs text-emerald-600 hover:text-emerald-700 shrink-0 bg-emerald-50 px-2 py-1.5 rounded-xl"
                      >
                        <FileText size={14} />
                        <span>PDF</span>
                        <ExternalLink size={11} />
                      </a>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        ))
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Novo Exame">
        {allPets.length > 1 && (
          <div className="mb-4">
            <Select
              dark
              label="Pet"
              options={allPets.map((p) => ({ value: p.id, label: p.name }))}
              value={modalPetId}
              onChange={(e) => setModalPetId(e.target.value)}
            />
          </div>
        )}
        <ExamForm onSubmit={handleAdd} loading={saving} />
      </Modal>
    </div>
  )
}
