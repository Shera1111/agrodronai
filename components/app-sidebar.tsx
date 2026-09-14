'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  ScanEye,
  Map,
  Brain,
  FileBarChart,
  Leaf,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/inspection', label: 'Drone Inspection', icon: ScanEye, hint: 'AI Vision' },
  { href: '/maps', label: 'Field Maps', icon: Map },
  { href: '/fine-tuning', label: 'Custom AI Fine-Tuning', icon: Brain },
  { href: '/reports', label: 'Reports', icon: FileBarChart },
]

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-border bg-sidebar md:flex">
      <div className="flex items-center gap-3 px-6 py-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
          <Leaf className="h-5 w-5" />
        </div>
        <div className="leading-tight">
          <p className="text-sm font-semibold text-sidebar-foreground">Agro-Drone AI</p>
          <p className="text-xs text-muted-foreground">Crop Intelligence</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-2">
        {navItems.map((item) => {
          const active =
            item.href === '/'
              ? pathname === '/'
              : pathname.startsWith(item.href)
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                active
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                  : 'text-muted-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground',
              )}
            >
              <Icon
                className={cn(
                  'h-4.5 w-4.5 shrink-0',
                  active ? 'text-primary' : 'text-muted-foreground group-hover:text-primary',
                )}
              />
              <span className="flex-1">{item.label}</span>
              {item.hint ? (
                <span className="rounded-md bg-accent/10 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-accent">
                  {item.hint}
                </span>
              ) : null}
            </Link>
          )
        })}
      </nav>

      <div className="border-t border-border p-4">
        <div className="flex items-center gap-3 rounded-lg bg-muted px-3 py-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent/15 text-sm font-semibold text-accent">
            GR
          </div>
          <div className="min-w-0 leading-tight">
            <p className="truncate text-sm font-medium text-foreground">Green Ridge Farms</p>
            <p className="truncate text-xs text-muted-foreground">Enterprise plan</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
