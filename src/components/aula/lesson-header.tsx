import Link from 'next/link'

import { ArrowLeftIcon } from 'lucide-react'

import { buttonVariants } from '@/components/ui/button'

/** Dentro da aula, a navegação principal some (DS 5.3). */
export function LessonHeader({
  ordem,
  modulo,
}: {
  ordem?: number
  /** Nome curto do módulo, como "HTML". */
  modulo?: string
}) {
  return (
    <header className="sticky top-0 z-10 border-b-2 border-muted bg-background">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-4 md:px-6">
        <Link href="/aulas" className={buttonVariants({ variant: 'ghost' })}>
          <ArrowLeftIcon data-icon="inline-start" />
          Voltar para aulas
        </Link>
        {ordem !== undefined && modulo && (
          <span className="text-sm text-muted-foreground">
            Aula {ordem} · {modulo}
          </span>
        )}
      </div>
    </header>
  )
}
