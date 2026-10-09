import { useId } from 'react'

import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'

type RetroWindowProps = {
  title: string
  children: React.ReactNode
}

const DOTS = ['bg-destructive', 'bg-warning', 'bg-success']

/** Moldura de "programa antigo" (DS, seção 8.2). O conteúdo é livre. */
export function RetroWindow({ title, children }: RetroWindowProps) {
  const titleId = useId()

  return (
    <Card
      role="region"
      aria-labelledby={titleId}
      size="sm"
      className="gap-0 py-0"
    >
      <div className="flex h-8 items-center gap-1.5 border-b-2 bg-popover px-3">
        {DOTS.map((color) => (
          <span
            key={color}
            data-slot="retro-window-dot"
            aria-hidden="true"
            className={cn('size-2.5 rounded-full', color)}
          />
        ))}
        <span
          id={titleId}
          className="ml-2 text-xs font-semibold text-muted-foreground"
        >
          {title}
        </span>
      </div>
      {children}
    </Card>
  )
}
