import Image from 'next/image'

import { HeartIcon } from 'lucide-react'

import { falaDaSemana } from '@/lib/progresso/painel'
import { cn } from '@/lib/utils'

import { CARTAO, TITULO_PAINEL } from './estilos'

type LuvDaSemanaProps = {
  nome?: string
  /** Dias estudados na semana atual. */
  estudados: number
  meta: number
}

/**
 * Topo do dashboard: a Luv (a única da tela — uma Luv por tela (DS 8.2, LuvBubble)), o cumprimento e os
 * corações da semana. Os corações só mostram a semana; não desbloqueiam nada.
 */
export function LuvDaSemana({ nome, estudados, meta }: LuvDaSemanaProps) {
  const cheios = Math.min(estudados, meta)
  return (
    <div
      className={cn(
        CARTAO,
        'mt-12 flex flex-wrap items-end gap-x-6 gap-y-3 bg-linear-to-br from-card to-accent',
      )}
    >
      <Image
        src="/images/luv/luv-notebook.webp"
        alt=""
        width={200}
        height={210}
        loading="eager"
        className="-mt-16 -mb-2 h-auto w-[clamp(140px,30vw,200px)] drop-shadow-[4px_6px_0_var(--chart-2)]"
      />
      <div className="flex min-w-0 flex-1 basis-60 flex-col gap-2 pb-1">
        <h1 className={TITULO_PAINEL}>{nome ? `Oi, ${nome}!` : 'Oi!'}</h1>
        <p className="text-lg text-muted-foreground">
          {falaDaSemana(estudados, meta)}
        </p>
        <div
          role="img"
          aria-label={`${cheios} de ${meta} corações`}
          className="flex flex-wrap gap-2"
        >
          {Array.from({ length: meta }, (_, i) => (
            <span
              key={i}
              className={cn(
                'grid size-9 place-items-center rounded-lg border-2',
                i < cheios
                  ? 'border-line-strong bg-primary text-primary-foreground shadow-sticker'
                  : 'border-border/50 bg-muted text-muted-foreground',
              )}
            >
              <HeartIcon
                aria-hidden
                className={cn('size-5', i < cheios && 'fill-current')}
              />
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
