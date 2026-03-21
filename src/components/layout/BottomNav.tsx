'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Dog, Syringe, AlertTriangle, MoreHorizontal, X, FlaskConical, Bug, Stethoscope, Shield, UserCircle, Search } from 'lucide-react'
import { cn } from '@/utils/cn'
import { useState } from 'react'
import { useAuthStore } from '@/store/auth.store'

const mainItems = [
  { href: '/dashboard', icon: Home, label: 'Início' },
  { href: '/pets', icon: Dog, label: 'Pets' },
  { href: '/vacinas', icon: Syringe, label: 'Vacinas' },
  { href: '/alergias', icon: AlertTriangle, label: 'Alergias' },
]

const moreItems = [
  { href: '/exames', icon: FlaskConical, label: 'Exames' },
  { href: '/antiparasitarios', icon: Bug, label: 'Antiparasitários' },
  { href: '/consultas', icon: Stethoscope, label: 'Consultas' },
  { href: '/acessos', icon: Shield, label: 'Acessos' },
  { href: '/perfil', icon: UserCircle, label: 'Meu Perfil' },
]

const vetMainItems = [
  { href: '/vet/dashboard', icon: Home, label: 'Início' },
  { href: '/vet/buscar', icon: Search, label: 'Buscar Pet' },
  { href: '/perfil', icon: UserCircle, label: 'Perfil' },
]

export function BottomNav() {
  const pathname = usePathname()
  const [showMore, setShowMore] = useState(false)
  const { user } = useAuthStore()

  const isVet = user?.role === 'VET'

  if (isVet) {
    return (
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-100 lg:hidden bottom-nav-safe" aria-label="Navegação principal">
        <div className="flex items-stretch h-16">
          {vetMainItems.map(({ href, icon: Icon, label }) => {
            const active = pathname === href || pathname.startsWith(href + '/')
            return (
              <Link key={href} href={href} aria-current={active ? 'page' : undefined} className="flex-1 flex flex-col items-center justify-center">
                <span className={cn('flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-2xl transition-all', active ? 'bg-emerald-50' : '')}>
                  <Icon size={22} strokeWidth={active ? 2.5 : 1.8} className={cn('transition-colors', active ? 'text-emerald-600' : 'text-gray-400')} />
                  <span className={cn('text-[10px] font-medium transition-colors', active ? 'text-emerald-600' : 'text-gray-400')}>{label}</span>
                </span>
              </Link>
            )
          })}
        </div>
      </nav>
    )
  }

  const moreActive = moreItems.some((i) => pathname === i.href || pathname.startsWith(i.href + '/'))

  return (
    <>
      {showMore && (
        <div className="lg:hidden fixed inset-0 z-50 flex flex-col justify-end">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowMore(false)} />
          <div className="relative bg-white rounded-t-2xl shadow-2xl pb-safe">
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 rounded-full bg-gray-200" />
            </div>
            <div className="flex items-center justify-between px-4 py-2 border-b border-gray-100">
              <span className="font-semibold text-gray-900">Mais opções</span>
              <button onClick={() => setShowMore(false)} className="p-1.5 rounded-xl hover:bg-gray-100" aria-label="Fechar">
                <X size={18} className="text-gray-500" />
              </button>
            </div>
            <div className="p-4 grid grid-cols-3 gap-3">
              {moreItems.map(({ href, icon: Icon, label }) => {
                const active = pathname === href || pathname.startsWith(href + '/')
                return (
                  <Link key={href} href={href} onClick={() => setShowMore(false)} className={cn('flex flex-col items-center gap-2 p-3 rounded-2xl transition-colors', active ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-50 text-gray-600 hover:bg-gray-100')}>
                    <Icon size={24} strokeWidth={active ? 2.5 : 1.8} />
                    <span className="text-xs font-medium text-center leading-tight">{label}</span>
                  </Link>
                )
              })}
            </div>
            <div style={{ height: 'env(safe-area-inset-bottom)' }} />
          </div>
        </div>
      )}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-100 lg:hidden bottom-nav-safe" aria-label="Navegação principal">
        <div className="flex items-stretch h-16">
          {mainItems.map(({ href, icon: Icon, label }) => {
            const active = pathname === href || pathname.startsWith(href + '/')
            return (
              <Link key={href} href={href} aria-current={active ? 'page' : undefined} className="flex-1 flex flex-col items-center justify-center">
                <span className={cn('flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-2xl transition-all', active ? 'bg-emerald-50' : '')}>
                  <Icon size={22} strokeWidth={active ? 2.5 : 1.8} className={cn('transition-colors', active ? 'text-emerald-600' : 'text-gray-400')} />
                  <span className={cn('text-[10px] font-medium transition-colors', active ? 'text-emerald-600' : 'text-gray-400')}>{label}</span>
                </span>
              </Link>
            )
          })}
          <button onClick={() => setShowMore(true)} className="flex-1 flex flex-col items-center justify-center" aria-label="Mais opções">
            <span className={cn('flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-2xl transition-all', (moreActive || showMore) ? 'bg-emerald-50' : '')}>
              <MoreHorizontal size={22} strokeWidth={1.8} className={cn('transition-colors', (moreActive || showMore) ? 'text-emerald-600' : 'text-gray-400')} />
              <span className={cn('text-[10px] font-medium transition-colors', (moreActive || showMore) ? 'text-emerald-600' : 'text-gray-400')}>Mais</span>
            </span>
          </button>
        </div>
      </nav>
    </>
  )
}
