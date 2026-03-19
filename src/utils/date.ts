export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('pt-BR')
}

export function formatDateTime(dateStr: string): string {
  return new Date(dateStr).toLocaleString('pt-BR')
}

export function isExpired(dateStr: string): boolean {
  return new Date(dateStr) < new Date()
}

export function isExpiringSoon(dateStr: string, days = 30): boolean {
  const d = new Date(dateStr)
  const limit = new Date()
  limit.setDate(limit.getDate() + days)
  return d > new Date() && d <= limit
}

export function toDatetimeLocal(dateStr: string): string {
  const d = new Date(dateStr)
  return d.toISOString().slice(0, 16)
}

export function toISOString(localDate: string): string {
  return new Date(localDate).toISOString()
}
