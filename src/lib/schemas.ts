import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('E-mail inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
})

export const registerStep1Schema = z.object({
  name: z.string().min(2, 'Nome muito curto'),
  email: z.string().email('E-mail inválido'),
  role: z.enum(['TUTOR', 'VET', 'CLINIC']),
  cpf: z.string().optional(),
  crmv: z.string().optional(),
  phone: z.string().min(1, 'Telefone obrigatório'),
}).superRefine((data, ctx) => {
  if (data.role === 'TUTOR' && !data.cpf?.trim()) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'CPF obrigatório', path: ['cpf'] })
  }
  if (data.role === 'VET' && !data.crmv?.trim()) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'CRMV obrigatório', path: ['crmv'] })
  }
})

const passwordSchema = z
  .string()
  .min(6, 'Mínimo 6 caracteres')
  .regex(/[A-Z]/, 'Deve conter letra maiúscula')
  .regex(/[a-z]/, 'Deve conter letra minúscula')
  .regex(/[0-9]/, 'Deve conter número')
  .regex(/[^A-Za-z0-9]/, 'Deve conter caractere especial')

export const registerStep2Schema = z.object({
  password: passwordSchema,
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, {
  message: 'As senhas não coincidem',
  path: ['confirmPassword'],
})

export const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(['TUTOR', 'VET', 'CLINIC']),
  cpf: z.string().optional(),
  crmv: z.string().optional(),
  phone: z.string().optional(),
})

export const petSchema = z.object({
  name: z.string().min(1, 'Nome obrigatório'),
  species: z.string().min(1, 'Espécie obrigatória'),
  breed: z.string().optional(),
  gender: z.enum(['MALE', 'FEMALE']),
  birthDate: z.string().min(1, 'Data de nascimento obrigatória'),
  microchip: z.string().optional(),
  color: z.string().optional(),
})

export const vaccineSchema = z.object({
  name: z.string().min(1, 'Nome obrigatório'),
  appliedAt: z.string().min(1, 'Data de aplicação obrigatória'),
  expiresAt: z.string().min(1, 'Data de validade obrigatória'),
  lot: z.string().optional(),
  manufacturer: z.string().optional(),
  vetSignature: z.string().optional(),
})

export const antiParasiteSchema = z.object({
  medicationName: z.string().min(1, 'Nome obrigatório'),
  brand: z.string().optional(),
  appliedAt: z.string().min(1, 'Data de aplicação obrigatória'),
  expiresAt: z.string().optional(),
  notes: z.string().optional(),
})

export const consultSchema = z.object({
  date: z.string().min(1, 'Data obrigatória'),
  clinic: z.string().optional(),
  reason: z.string().min(1, 'Motivo obrigatório'),
  diagnosis: z.string().optional(),
  treatment: z.string().optional(),
  notes: z.string().optional(),
})

export const examSchema = z.object({
  date: z.string().min(1, 'Data obrigatória'),
  type: z.string().min(1, 'Tipo obrigatório'),
  lab: z.string().optional(),
  result: z.string().optional(),
  notes: z.string().optional(),
})

export const allergySchema = z.object({
  name: z.string().min(1, 'Nome obrigatório'),
  severity: z.enum(['LOW', 'MEDIUM', 'HIGH']).optional(),
  notes: z.string().optional(),
})

export type LoginInput = z.infer<typeof loginSchema>
export type RegisterInput = z.infer<typeof registerSchema>
export type RegisterStep1Input = z.infer<typeof registerStep1Schema>
export type RegisterStep2Input = z.infer<typeof registerStep2Schema>
export type PetInput = z.infer<typeof petSchema>
export type VaccineInput = z.infer<typeof vaccineSchema>
export type AntiParasiteInput = z.infer<typeof antiParasiteSchema>
export type ConsultInput = z.infer<typeof consultSchema>
export type ExamInput = z.infer<typeof examSchema>
export type AllergyInput = z.infer<typeof allergySchema>
