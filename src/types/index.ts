export type Role = 'TUTOR' | 'VET' | 'CLINIC'

export interface User {
  id: string
  name: string
  email: string
  role: Role
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
  user: User
}

export interface Pet {
  id: string
  tutorId: string
  name: string
  species: string
  breed?: string
  gender: 'MALE' | 'FEMALE'
  birthDate: string
  photo?: string
  microchip?: string
  color?: string
  createdAt: string
  weights?: PetWeight[]
}

export interface PetWeight {
  id: string
  weight: number
  date: string
}

export interface Vaccine {
  id: string
  petId: string
  vetId: string
  name: string
  appliedAt: string
  expiresAt: string
  lot?: string
  manufacturer?: string
  labelPhoto?: string
  vetSignature?: string
  vet?: { name: string; crmv: string }
  createdAt: string
}

export interface AntiParasite {
  id: string
  petId: string
  medicationName: string
  brand?: string
  appliedAt: string
  expiresAt: string
  notes?: string
  boxPhoto?: string
  createdAt: string
}

export interface Consult {
  id: string
  petId: string
  date: string
  clinic?: string
  reason: string
  diagnosis?: string
  treatment?: string
  notes?: string
  attachments: string[]
  vet?: { name: string; crmv: string }
  createdAt: string
}

export interface Exam {
  id: string
  petId: string
  date: string
  type: string
  lab?: string
  result?: string
  fileUrl?: string
  notes?: string
  vet?: { name: string; crmv: string }
  createdAt: string
}

export interface Allergy {
  id: string
  petId: string
  name: string
  severity?: 'LOW' | 'MEDIUM' | 'HIGH'
  notes?: string
  createdAt: string
}

export interface AccessRequest {
  id: string
  clinicId: string
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
  requestedAt: string
  pet?: { name: string }
  tutor?: { name: string }
}

export interface AccessLog {
  id: string
  clinicId: string
  petId: string
  accessedAt: string
  pet?: { name: string }
}

export interface PaginatedResult<T> {
  data: T[]
  meta: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

export interface ApiError {
  error: string
  message: string
  details?: { field: string; message: string }[]
}
