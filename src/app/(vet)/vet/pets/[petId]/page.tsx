'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { petsService } from '@/services/pets.service'
import { vaccinesService } from '@/services/vaccines.service'
import { consultsService } from '@/services/consults.service'
import { examsService } from '@/services/exams.service'
import { allergiesService } from '@/services/allergies.service'
import { Pet, Vaccine, Consult, Exam, Allergy } from '@/types'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Modal } from '@/components/ui/Modal'
import { VaccineForm } from '@/components/forms/VaccineForm'
import { ConsultForm } from '@/components/forms/ConsultForm'
import { ExamForm } from '@/components/forms/ExamForm'
import { AllergyForm } from '@/components/forms/AllergyForm'
import { ArrowLeft, Plus, Syringe, Stethoscope, FlaskConical, AlertTriangle, FileText, ExternalLink, Dog } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { formatDate } from '@/utils/date'
import { VaccineInput, ConsultInput, ExamInput, AllergyInput } from '@/lib/schemas'
import toast from 'react-hot-toast'

const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') ?? 'http://localhost:3001'

type ModalType = 'vaccine' | 'consult' | 'exam' | 'allergy' | null

export default function VetPetPage() {
  const { petId } = useParams<{ petId: string }>()
  const [pet, setPet] = useState<Pet | null>(null)
  const [vaccines, setVaccines] = useState<Vaccine[]>([])
  const [consults, setConsults] = useState<Consult[]>([])
  const [exams, setExams] = useState<Exam[]>([])
  const [allergies, setAllergies] = useState<Allergy[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [modal, setModal] = useState<ModalType>(null)

  async function load() {
    const [petData, vax, cons, exms, alrg] = await Promise.all([
      petsService.get(petId),
      vaccinesService.list(petId),
      consultsService.list(petId),
      examsService.list(petId),
      allergiesService.list(petId),
    ])
    setPet(petData)
    setVaccines(vax.data)
    setConsults(cons.data)
    setExams(exms.data)
    setAllergies(alrg.data)
  }

  useEffect(() => {
    load().catch(() => toast.error('Erro ao carregar dados')).finally(() => setLoading(false))
  }, [petId])

  async function handleVaccine(data: VaccineInput, labelPhoto?: File) {
    setSaving(true)
    try {
      await vaccinesService.create(petId, data, labelPhoto)
      toast.success('Vacina registrada!')
      setModal(null)
      const vax = await vaccinesService.list(petId)
      setVaccines(vax.data)
    } catch { toast.error('Erro ao registrar vacina') } finally { setSaving(false) }
  }

  async function handleConsult(data: ConsultInput) {
    setSaving(true)
    try {
      await consultsService.create(petId, data)
      toast.success('Consulta registrada!')
      setModal(null)
      const cons = await consultsService.list(petId)
      setConsults(cons.data)
    } catch { toast.error('Erro ao registrar consulta') } finally { setSaving(false) }
  }

  async function handleExam(data: ExamInput, file?: File) {
    setSaving(true)
    try {
      await examsService.create(petId, data, file)
      toast.success('Exame registrado!')
      setModal(null)
      const exms = await examsService.list(petId)
      setExams(exms.data)
    } catch { toast.error('Erro ao registrar exame') } finally { setSaving(false) }
  }

  async function handleAllergy(data: AllergyInput) {
    setSaving(true)
    try {
      await allergiesService.create(petId, data)
      toast.success('Alergia registrada!')
      setModal(null)
      const alrg = await allergiesService.list(petId)
      setAllergies(alrg.data)
    } catch { toast.error('Erro ao registrar alergia') } finally { setSaving(false) }
  }

  if (loading) return <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-20 bg-gray-100 rounded-2xl animate-pulse" />)}</div>
  if (!pet) return null

  const severityMap: Record<string, { label: string; variant: 'red' | 'yellow' | 'green' }> = {
    HIGH: { label: 'Alta', variant: 'red' },
    MEDIUM: { label: 'Média', variant: 'yellow' },
    LOW: { label: 'Baixa', variant: 'green' },
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href="/vet/buscar" className="p-2 rounded-xl hover:bg-gray-100 transition-colors" aria-label="Voltar">
          <ArrowLeft size={20} className="text-gray-600" />
        </Link>
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="w-10 h-10 rounded-xl overflow-hidden bg-emerald-50 flex items-center justify-center shrink-0">
            {pet.photo ? (
              <Image src={`${API_URL}/uploads/${pet.photo}`} alt={pet.name} width={40} height={40} className="object-cover w-full h-full" />
            ) : (
              <Dog size={20} className="text-emerald-400" />
            )}
          </div>
          <div className="min-w-0">
            <h1 className="text-xl font-bold text-gray-900 truncate">{pet.name}</h1>
            <p className="text-sm text-gray-500">{pet.species}{pet.breed ? ` · ${pet.breed}` : ''}</p>
          </div>
        </div>
      </div>

      {/* Pet info */}
      <Card>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div><p className="text-gray-400 text-xs">Sexo</p><p className="font-medium">{pet.gender === 'MALE' ? 'Macho' : 'Fêmea'}</p></div>
          <div><p className="text-gray-400 text-xs">Nascimento</p><p className="font-medium">{formatDate(pet.birthDate)}</p></div>
          {pet.color && <div><p className="text-gray-400 text-xs">Cor</p><p className="font-medium">{pet.color}</p></div>}
          {pet.microchip && <div><p className="text-gray-400 text-xs">Microchip</p><p className="font-medium text-xs">{pet.microchip}</p></div>}
        </div>
      </Card>

      {/* Vacinas */}
      <section>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2"><Syringe size={16} className="text-emerald-500" /><h2 className="font-semibold text-gray-900">Vacinas</h2></div>
          <Button size="sm" onClick={() => setModal('vaccine')}><Plus size={14} className="mr-1" />Adicionar</Button>
        </div>
        {vaccines.length ? (
          <div className="space-y-2">
            {vaccines.map((v) => (
              <Card key={v.id}>
                <p className="font-medium text-gray-900">{v.name}</p>
                <p className="text-xs text-gray-400 mt-0.5">Aplicada: {formatDate(v.appliedAt)} · Vence: {formatDate(v.expiresAt)}</p>
                {v.manufacturer && <p className="text-xs text-gray-500">{v.manufacturer}{v.lot ? ` · Lote: ${v.lot}` : ''}</p>}
              </Card>
            ))}
          </div>
        ) : <p className="text-sm text-gray-400 bg-gray-50 rounded-xl px-3 py-3">Nenhuma vacina registrada</p>}
      </section>

      {/* Consultas */}
      <section>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2"><Stethoscope size={16} className="text-emerald-500" /><h2 className="font-semibold text-gray-900">Consultas</h2></div>
          <Button size="sm" onClick={() => setModal('consult')}><Plus size={14} className="mr-1" />Adicionar</Button>
        </div>
        {consults.length ? (
          <div className="space-y-2">
            {consults.map((c) => (
              <Card key={c.id}>
                <p className="font-medium text-gray-900">{c.reason}</p>
                <p className="text-xs text-gray-400 mt-0.5">{formatDate(c.date)}{c.clinic ? ` · ${c.clinic}` : ''}</p>
                {c.diagnosis && <p className="text-sm text-gray-600 mt-1"><span className="font-medium">Diagnóstico:</span> {c.diagnosis}</p>}
              </Card>
            ))}
          </div>
        ) : <p className="text-sm text-gray-400 bg-gray-50 rounded-xl px-3 py-3">Nenhuma consulta registrada</p>}
      </section>

      {/* Exames */}
      <section>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2"><FlaskConical size={16} className="text-emerald-500" /><h2 className="font-semibold text-gray-900">Exames</h2></div>
          <Button size="sm" onClick={() => setModal('exam')}><Plus size={14} className="mr-1" />Adicionar</Button>
        </div>
        {exams.length ? (
          <div className="space-y-2">
            {exams.map((exam) => (
              <Card key={exam.id}>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-medium text-gray-900">{exam.type}</p>
                    {exam.lab && <p className="text-xs text-gray-500">{exam.lab}</p>}
                    <p className="text-xs text-gray-400 mt-0.5">{formatDate(exam.date)}</p>
                    {exam.result && <p className="text-sm text-gray-600 mt-1"><span className="font-medium">Resultado:</span> {exam.result}</p>}
                  </div>
                  {exam.fileUrl && (
                    <a href={`${API_URL}/uploads/${exam.fileUrl}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs text-emerald-600 bg-emerald-50 px-2 py-1.5 rounded-xl shrink-0">
                      <FileText size={13} /><span>PDF</span><ExternalLink size={10} />
                    </a>
                  )}
                </div>
              </Card>
            ))}
          </div>
        ) : <p className="text-sm text-gray-400 bg-gray-50 rounded-xl px-3 py-3">Nenhum exame registrado</p>}
      </section>

      {/* Alergias */}
      <section>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2"><AlertTriangle size={16} className="text-emerald-500" /><h2 className="font-semibold text-gray-900">Alergias</h2></div>
          <Button size="sm" onClick={() => setModal('allergy')}><Plus size={14} className="mr-1" />Adicionar</Button>
        </div>
        {allergies.length ? (
          <div className="space-y-2">
            {allergies.map((a) => {
              const sev = a.severity ? severityMap[a.severity] : null
              return (
                <Card key={a.id}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{a.name}</p>
                      {a.notes && <p className="text-sm text-gray-500 mt-0.5">{a.notes}</p>}
                    </div>
                    {sev && <Badge variant={sev.variant}>{sev.label}</Badge>}
                  </div>
                </Card>
              )
            })}
          </div>
        ) : <p className="text-sm text-gray-400 bg-gray-50 rounded-xl px-3 py-3">Nenhuma alergia registrada</p>}
      </section>

      {/* Modals */}
      <Modal isOpen={modal === 'vaccine'} onClose={() => setModal(null)} title="Nova Vacina">
        <VaccineForm onSubmit={handleVaccine} loading={saving} />
      </Modal>
      <Modal isOpen={modal === 'consult'} onClose={() => setModal(null)} title="Nova Consulta">
        <ConsultForm onSubmit={handleConsult} loading={saving} />
      </Modal>
      <Modal isOpen={modal === 'exam'} onClose={() => setModal(null)} title="Novo Exame">
        <ExamForm onSubmit={handleExam} loading={saving} />
      </Modal>
      <Modal isOpen={modal === 'allergy'} onClose={() => setModal(null)} title="Nova Alergia">
        <AllergyForm onSubmit={handleAllergy} loading={saving} />
      </Modal>
    </div>
  )
}
