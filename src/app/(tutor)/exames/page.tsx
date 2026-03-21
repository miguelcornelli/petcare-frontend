'use client'
import { useEffect, useState } from 'react'
import { petsService } from '@/services/pets.service'
import { examsService } from '@/services/exams.service'
import { Pet, Exam } from '@/types'
import { Card } from '@/components/ui/Card'
import { EmptyState } from '@/components/ui/EmptyState'
import { FlaskConical } from 'lucide-react'
import { formatDate } from '@/utils/date'
import toast from 'react-hot-toast'

export default function ExamesPage() {
  const [petExams, setPetExams] = useState<{ pet: Pet; exams: Exam[] }[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPetId, setSelectedPetId] = useState<string | 'all'>('all')

  useEffect(() => {
    petsService.list({ limit: 50 }).then(async ({ data: pets }) => {
      const all = await Promise.all(pets.map(async (pet) => {
        const { data: exams } = await examsService.list(pet.id)
        return { pet, exams }
      }))
      setPetExams(all.filter((x) => x.exams.length > 0))
    }).catch(() => toast.error('Erro ao carregar exames')).finally(() => setLoading(false))
  }, [])

  const filtered = selectedPetId === 'all' ? petExams : petExams.filter((x) => x.pet.id === selectedPetId)

  if (loading) return <div className="space-y-3">{[1, 2].map((i) => <div key={i} className="h-24 bg-gray-100 rounded-2xl animate-pulse" />)}</div>

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold text-gray-900">Exames</h1>

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
        <EmptyState icon={FlaskConical} title="Nenhum exame registrado" description="Os exames dos seus pets aparecerão aqui" />
      ) : (
        filtered.map(({ pet, exams }) => (
          <div key={pet.id}>
            {selectedPetId === 'all' && <h2 className="font-medium text-gray-700 mb-2">{pet.name}</h2>}
            <div className="space-y-2">
              {exams.map((exam) => (
                <Card key={exam.id}>
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{exam.type}</p>
                      {exam.lab && <p className="text-xs text-gray-500">{exam.lab}</p>}
                      <p className="text-xs text-gray-400 mt-1">{formatDate(exam.date)}</p>
                      {exam.result && <p className="text-sm text-gray-600 mt-1.5"><span className="font-medium">Resultado:</span> {exam.result}</p>}
                    </div>
                    {exam.vet && <p className="text-xs text-gray-400 shrink-0 ml-2">Dr. {exam.vet.name}</p>}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  )
}
