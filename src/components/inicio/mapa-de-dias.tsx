import { useId } from 'react'

import type { CelulaDoMapa, NivelDoDia } from '@/lib/progresso/painel'
import { cn } from '@/lib/utils'

import { CARTAO, TITULO_SUB } from './estilos'

const COR: Record<NivelDoDia, string> = {
  nada: 'bg-muted',
  estudou: 'bg-chart-2',
  concluiu: 'bg-primary',
}
const NOME: Record<NivelDoDia, string> = {
  nada: 'sem estudo',
  estudou: 'estudou',
  concluiu: 'concluiu aula',
}

function resumo(total: number) {
  if (total === 0)
    return 'Seus dias de estudo aparecem aqui quando você fizer a primeira aula.'
  return total === 1
    ? '1 dia estudado desde o começo.'
    : `${total} dias estudados desde o começo.`
}

/**
 * Os últimos três meses em quadradinhos. Só soma, nunca zera (briefing 10.4).
 * A grade é decorativa para leitores de tela: o resumo e a legenda dizem tudo.
 */
export function MapaDeDias({
  semanas,
  total,
}: {
  semanas: CelulaDoMapa[][]
  total: number
}) {
  const tituloId = useId()
  return (
    <section aria-labelledby={tituloId} className={CARTAO}>
      <h3 id={tituloId} className={TITULO_SUB}>
        Seus dias de estudo
      </h3>
      <p className="mt-1 text-muted-foreground">{resumo(total)}</p>
      <div data-mapa aria-hidden="true" className="mt-4 overflow-x-auto pb-1">
        <div className="grid w-max grid-flow-col grid-rows-7 gap-1">
          {semanas.flat().map((celula) => (
            <span
              key={celula.dia}
              data-dia={celula.dia}
              title={
                celula.futuro
                  ? undefined
                  : `${celula.dia}: ${NOME[celula.nivel]}`
              }
              className={cn(
                'size-3.5 rounded-[3px]',
                celula.futuro
                  ? 'bg-transparent'
                  : cn(
                      COR[celula.nivel],
                      celula.nivel === 'nada' && 'border border-border/60',
                      celula.nivel === 'concluiu' &&
                        'ring-2 ring-line-strong ring-inset',
                    ),
              )}
            />
          ))}
        </div>
      </div>
      <ul className="mt-3 flex flex-wrap gap-4 text-sm text-muted-foreground">
        {(['nada', 'estudou', 'concluiu'] as const).map((nivel) => (
          <li key={nivel} className="flex items-center gap-1.5">
            <span
              aria-hidden
              className={cn(
                'size-3.5 rounded-[3px]',
                COR[nivel],
                nivel === 'nada' && 'border border-border/60',
                nivel === 'concluiu' && 'ring-2 ring-line-strong ring-inset',
              )}
            />
            {NOME[nivel]}
          </li>
        ))}
      </ul>
    </section>
  )
}
