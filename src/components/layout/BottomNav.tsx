'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Dog, Syringe, Bug, Stethoscope } from 'lucide-react'
import { cn } from '@/utils/cn'

const navItems = [
  { href: '/dashboard', icon: Home, label: 'Início' },
  { href: '/pets', icon: Dog, label: 'Pets' },
  { href: '/vacinas', icon: Syringe, label: 'Vacinas' },
  { href: '/antiparasitarios', icon: Bug, label: 'Antipar.' },
  { href: '/consultas', icon: Stethoscope, label: 'Consultas' },
]

export function BottomNav() {
  const pathname = usePathname()
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 lg:hidden safe-area-bottom" aria-label="Navegação principal">
      <div className="flex">
        {navItems.map(({ href, icon: Icon, label }) => {
          const active = pathname === href || pathname.startsWith(href + '/')
          return (
            <Link key={href} href={href} className={cn('flex-1 flex flex-col items-center gap-1 py-2 text-xs transition-colors', active ? 'text-emerald-600' : 'text-gray-500 hover:text-gray-700')} aria-current={active ? 'page' : undefined}>
              <Icon size={22} strokeWidth={active ? 2.5 : 2} />
              <span>{label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
