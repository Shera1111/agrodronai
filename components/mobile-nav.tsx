'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, ScanEye, Map, Brain, FileBarChart, Leaf } from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/inspection', label: 'Inspection', icon: ScanEye },
  { href: '/maps', label: 'Maps', icon: Map },
  { href: '/fine-tuning', label: 'Fine-Tuning', icon: Brain },
  { href: '/reports', label: 'Reports', icon: FileBarChart },
]

export function MobileNav() {
  const pathname = usePathname()

  return (
    <div className="sticky top-0 z-30 border-b border-border bg-card/95 backdrop-blur md:hidden">
      <div className="flex items-center gap-2 px-4 py-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Leaf className="h-4 w-4" />
        </div>
        <span className="text-sm font-semibold text-foreground">Agro-Drone AI</span>
      </div>
      <nav className="flex gap-1 overflow-x-auto px-2 pb-2">
        {navItems.map((item) => {
          const active = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href)
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors',
                active
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                  : 'text-muted-foreground hover:bg-muted',
              )}
            >
              <Icon className="h-3.5 w-3.5" />
              {item.label}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
