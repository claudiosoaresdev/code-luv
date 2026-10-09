import { useId } from 'react'
import Link from 'next/link'

import { HeartIcon, LockIcon } from 'lucide-react'

import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

import { CARTAO, TITULO_SUB } from './estilos'

type VitrineConquistasProps = {
  selos: { id: string; titulo: string; ganha: boolean }[]
  proxima?: { titulo: string; comoGanhar: string }
}

/** As conquistas em selos e a próxima ao alcance (HU-09). */
export function VitrineConquistas({ selos, proxima }: VitrineConquistasProps) {
  const tituloId = useId()
  return (
    <section aria-labelledby={tituloId} className={CARTAO}>
      <h3 id={tituloId} className={TITULO_SUB}>
        Conquistas
      </h3>
      <ul className="mt-4 flex flex-wrap gap-3">
        {selos.map((selo) => (
          <li
            key={selo.id}
            className={cn(
              'grid size-14 place-items-center rounded-xl border-2',
              selo.ganha
                ? 'border-chart-5 bg-muted text-primary'
                : 'border-dashed border-muted-foreground/60 text-muted-foreground',
            )}
          >
            {selo.ganha ? (
              <HeartIcon aria-hidden className="size-6 fill-current" />
            ) : (
              <LockIcon aria-hidden className="size-5" />
            )}
            <span className="sr-only">
              {selo.ganha
                ? `${selo.titulo}, ganha`
                : `${selo.titulo}, ainda não`}
            </span>
          </li>
        ))}
      </ul>
      {proxima && (
        <p className="mt-4 text-muted-foreground">
          Próxima: <strong className="text-foreground">{proxima.titulo}</strong>{' '}
          — {proxima.comoGanhar}
        </p>
      )}
      <Link
        href="/conquistas"
        className={cn(buttonVariants({ variant: 'outline' }), 'mt-4 w-fit')}
      >
        Ver conquistas
      </Link>
    </section>
  )
}
