import { useId } from 'react'

import { cn } from '@/lib/utils'

import { CARTAO, TITULO_SUB } from './estilos'

type ModuloComProgresso = {
  id: string
  nome: string
  concluidas: number
  total: number
}

const RAIO = 34
const VOLTA = 2 * Math.PI * RAIO
const CORES = ['text-primary', 'text-chart-5']

function Anel({
  valor,
  rotulo,
  cor,
  children,
}: {
  valor: number
  rotulo: string
  cor: string
  children: React.ReactNode
}) {
  return (
    <div
      role="img"
      aria-label={rotulo}
      className="relative grid size-20 place-items-center"
    >
      <svg
        aria-hidden
        viewBox="0 0 80 80"
        className="absolute inset-0 -rotate-90"
      >
        <circle
          cx="40"
          cy="40"
          r={RAIO}
          fill="none"
          strokeWidth="8"
          className="stroke-border/40"
        />
        {valor > 0 && (
          <circle
            cx="40"
            cy="40"
            r={RAIO}
            fill="none"
            strokeWidth="8"
            strokeLinecap="round"
            stroke="currentColor"
            strokeDasharray={VOLTA}
            strokeDashoffset={VOLTA * (1 - valor)}
            className={cor}
          />
        )}
      </svg>
      <span aria-hidden className="font-bold tabular-nums">
        {children}
      </span>
    </div>
  )
}

/** Um anel por módulo; JavaScript aparece como "em breve" (briefing, Fase 3). */
export function ProgressoModulos({
  modulos,
}: {
  modulos: ModuloComProgresso[]
}) {
  const tituloId = useId()
  return (
    <section aria-labelledby={tituloId} className={CARTAO}>
      <h3 id={tituloId} className={TITULO_SUB}>
        Módulos
      </h3>
      <ul className="mt-4 flex flex-wrap gap-6">
        {modulos.map((modulo, i) => (
          <li key={modulo.id} className="flex flex-col items-center gap-2">
            <Anel
              valor={modulo.total ? modulo.concluidas / modulo.total : 0}
              rotulo={`${modulo.nome}: ${modulo.concluidas} de ${modulo.total} aulas concluídas`}
              cor={CORES[i % CORES.length]}
            >
              {modulo.concluidas}/{modulo.total}
            </Anel>
            <span aria-hidden className="font-medium">
              {modulo.nome}
            </span>
          </li>
        ))}
        <li className="flex flex-col items-center gap-2 text-muted-foreground">
          <span
            aria-hidden
            className={cn(
              'grid size-20 place-items-center rounded-full border-2 border-dashed border-muted-foreground/60 text-sm',
            )}
          >
            em breve
          </span>
          <span aria-hidden className="font-medium">
            JavaScript
          </span>
          <span className="sr-only">JavaScript, em breve</span>
        </li>
      </ul>
    </section>
  )
}
