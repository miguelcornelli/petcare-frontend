'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Dog, Syringe, Bug, Stethoscope, FlaskConical, AlertTriangle, Shield, LogOut, PawPrint, UserCircle, Search } from 'lucide-react'
import { cn } from '@/utils/cn'
import { useAuth } from '@/hooks/useAuth'

const tutorNav = [
  { href: '/dashboard', icon: Home, label: 'Dashboard' },
  { href: '/pets', icon: Dog, label: 'Meus Pets' },
  { href: '/vacinas', icon: Syringe, label: 'Vacinas' },
  { href: '/antiparasitarios', icon: Bug, label: 'Antiparasitários' },
  { href: '/consultas', icon: Stethoscope, label: 'Consultas' },
  { href: '/exames', icon: FlaskConical, label: 'Exames' },
  { href: '/alergias', icon: AlertTriangle, label: 'Alergias' },
  { href: '/acessos', icon: Shield, label: 'Acessos' },
]

const vetNav = [
  { href: '/vet/dashboard', icon: Home, label: 'Dashboard' },
  { href: '/vet/buscar', icon: Search, label: 'Buscar Pet' },
]

export function Sidebar() {
  const pathname = usePathname()
  const { user, logout } = useAuth()

  const nav = user?.role === 'VET' ? vetNav : tutorNav

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-gray-200 h-full fixed left-0 top-0 bottom-0 z-30">
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-emerald-500 rounded-xl flex items-center justify-center">
            <PawPrint size={18} className="text-white" />
          </div>
          <span className="font-bold text-gray-900 text-lg">PetCare</span>
        </div>
      </div>

      <div className="p-4 border-b border-gray-100">
        <Link href="/perfil" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center">
            <span className="text-emerald-700 font-semibold text-sm">{user?.name?.[0]?.toUpperCase()}</span>
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
            <p className="text-xs text-gray-500">{user?.role === 'TUTOR' ? 'Tutor' : user?.role === 'VET' ? 'Veterinário' : 'Clínica'}</p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 p-3 space-y-1 overflow-y-auto" aria-label="Navegação lateral">
        {nav.map(({ href, icon: Icon, label }) => {
          const active = pathname === href || pathname.startsWith(href + '/')
          return (
            <Link key={href} href={href} className={cn('flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition-colors', active ? 'bg-emerald-50 text-emerald-700 font-medium' : 'text-gray-600 hover:bg-gray-50')}>
              <Icon size={18} />
              {label}
            </Link>
          )
        })}
      </nav>

      <div className="p-3 border-t border-gray-100 space-y-1">
        <Link href="/perfil" className={cn('flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition-colors', pathname === '/perfil' ? 'bg-emerald-50 text-emerald-700 font-medium' : 'text-gray-600 hover:bg-gray-50')}>
          <UserCircle size={18} />
          Meu Perfil
        </Link>
        <button onClick={logout} className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-gray-600 hover:bg-red-50 hover:text-red-600 w-full transition-colors">
          <LogOut size={18} />
          Sair
        </button>
      </div>
    </aside>
  )
}
