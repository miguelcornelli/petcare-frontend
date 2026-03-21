'use client'
import { useEffect, useState } from 'react'
import { petsService } from '@/services/pets.service'
import { parasitesService } from '@/services/parasites.service'
import { Pet, AntiParasite } from '@/types'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { Select } from '@/components/ui/Select'
import { EmptyState } from '@/components/ui/EmptyState'
import { AntiParasiteForm } from '@/components/forms/AntiParasiteForm'
import { Bug, Plus } from 'lucide-react'
import { formatDate, isExpired, isExpiringSoon } from '@/utils/date'
import { AntiParasiteInput } from '@/lib/schemas'
import toast from 'react-hot-toast'

export default function AntiparasitariosPage() {
  const [petItems, setPetItems] = useState<{ pet: Pet; items: AntiParasite[] }[]>([])
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
      const { data: items } = await parasitesService.list(pet.id)
      return { pet, items }
    }))
    setPetItems(all.filter((x) => x.items.length > 0))
    if (pets.length > 0 && !modalPetId) setModalPetId(pets[0].id)
  }

  useEffect(() => {
    load().catch(() => toast.error('Erro ao carregar dados')).finally(() => setLoading(false))
  }, [])

  async function handleAdd(data: AntiParasiteInput) {
    if (!modalPetId) return
    setSaving(true)
    try {
      await parasitesService.create(modalPetId, data)
      toast.success('Antiparasitário registrado!')
      setModalOpen(false)
      await load()
    } catch {
      toast.error('Erro ao salvar')
    } finally {
      setSaving(false)
    }
  }

  const filtered = selectedPetId === 'all' ? petItems : petItems.filter((x) => x.pet.id === selectedPetId)

  if (loading) return <div className="space-y-3">{[1, 2].map((i) => <div key={i} className="h-24 bg-gray-100 rounded-2xl animate-pulse" />)}</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">Antiparasitários</h1>
        {allPets.length > 0 && (
          <Button size="sm" onClick={() => setModalOpen(true)}>
            <Plus size={16} className="mr-1" />Adicionar
          </Button>
        )}
      </div>

      {petItems.length > 1 && (
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setSelectedPetId('all')}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${selectedPetId === 'all' ? 'bg-emerald-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
          >
            Todos
          </button>
          {petItems.map(({ pet }) => (
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
          icon={Bug}
          title="Nenhum registro"
          description="Adicione o primeiro antiparasitário"
          action={allPets.length > 0 ? <Button size="sm" onClick={() => setModalOpen(true)}><Plus size={14} className="mr-1" />Adicionar</Button> : undefined}
        />
      ) : (
        filtered.map(({ pet, items }) => (
          <div key={pet.id}>
            {selectedPetId === 'all' && <h2 className="font-medium text-gray-700 mb-2">{pet.name}</h2>}
            <div className="space-y-2">
              {items.map((item) => {
                const expired = isExpired(item.expiresAt)
                const expiring = !expired && isExpiringSoon(item.expiresAt)
                return (
                  <Card key={item.id}>
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium text-gray-900">{item.medicationName}</p>
                        {item.brand && <p className="text-xs text-gray-500">{item.brand}</p>}
                        <p className="text-xs text-gray-400 mt-1">Aplicado: {formatDate(item.appliedAt)} · Vence: {formatDate(item.expiresAt)}</p>
                      </div>
                      {expired ? <Badge variant="red">Vencido</Badge> : expiring ? <Badge variant="yellow">A vencer</Badge> : <Badge variant="green">Ok</Badge>}
                    </div>
                  </Card>
                )
              })}
            </div>
          </div>
        ))
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Novo Antiparasitário">
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
        <AntiParasiteForm onSubmit={handleAdd} loading={saving} />
      </Modal>
    </div>
  )
}
