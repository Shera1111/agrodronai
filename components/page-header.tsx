import type { ReactNode } from 'react'

export function PageHeader({
  title,
  description,
  actions,
}: {
  title: string
  description?: string
  actions?: ReactNode
}) {
  return (
    <header className="flex flex-col gap-4 border-b border-border bg-card/60 px-6 py-5 backdrop-blur sm:flex-row sm:items-center sm:justify-between lg:px-8">
      <div className="min-w-0">
        <h1 className="text-balance text-xl font-semibold tracking-tight text-foreground lg:text-2xl">
          {title}
        </h1>
        {description ? (
          <p className="mt-1 text-pretty text-sm text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {actions ? <div className="flex shrink-0 items-center gap-2">{actions}</div> : null}
    </header>
  )
}
