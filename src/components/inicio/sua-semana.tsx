import { useId } from 'react'

import { HeartIcon } from 'lucide-react'

import { type DiaDaSemana, fraseDaSemana } from '@/lib/progresso/painel'
import { cn } from '@/lib/utils'

import { CARTAO, TITULO_BLOCO } from './estilos'

function rotuloDoDia(dia: DiaDaSemana) {
  return [dia.completo, dia.hoje && 'hoje', dia.estudou && 'estudou']
    .filter(Boolean)
    .join(', ')
}

/**
 * A semana de segunda a domingo (habit tracker sem sequência — briefing
 * 10.4): coração nos dias estudados, hoje tracejado, futuro vazio.
 */
export function SuaSemana({
  dias,
  meta,
}: {
  dias: DiaDaSemana[]
  meta: number
}) {
  const tituloId = useId()
  const estudados = dias.filter((dia) => dia.estudou).length
  return (
    <section aria-labelledby={tituloId} className={CARTAO}>
      <h2 id={tituloId} className={TITULO_BLOCO}>
        Sua semana
      </h2>
      <p className="mt-1 text-muted-foreground">
        {fraseDaSemana(estudados, meta)}
      </p>
      <ul className="mt-4 grid max-w-md grid-cols-7 gap-1.5 sm:gap-3">
        {dias.map((dia) => (
          <li
            key={dia.dia}
            className="flex flex-col items-center gap-1 text-sm text-muted-foreground"
          >
            <span
              aria-hidden
              className={cn(
                'grid aspect-square w-full max-w-12 place-items-center rounded-xl border-2',
                dia.estudou
                  ? 'border-line-strong bg-primary text-primary-foreground shadow-sticker'
                  : 'border-border/50 bg-muted',
                dia.hoje &&
                  'outline-2 outline-offset-2 outline-ring outline-dashed',
              )}
            >
              {dia.estudou && <HeartIcon className="size-5 fill-current" />}
            </span>
            <span aria-hidden>{dia.hoje ? 'hoje' : dia.curto}</span>
            <span className="sr-only">{rotuloDoDia(dia)}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}
