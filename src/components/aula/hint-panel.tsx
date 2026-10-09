'use client'

import { useEffect, useRef, useState } from 'react'

import { LightbulbIcon } from 'lucide-react'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'

type HintPanelProps = {
  pistas: string[]
  solucao: string
}

/**
 * Pistas progressivas (DS 8.2 — HintPanel): uma de cada vez; "Ver solução"
 * só depois da última. Nada aqui indica perda ou penalidade.
 */
export function HintPanel({ pistas, solucao }: HintPanelProps) {
  const [abertas, setAbertas] = useState(0)
  const [solucaoAberta, setSolucaoAberta] = useState(false)
  const solucaoRef = useRef<HTMLDivElement>(null)
  const temMaisPistas = abertas < pistas.length

  // O botão "Ver solução" some ao ser clicado; leva o foco para a solução.
  useEffect(() => {
    if (solucaoAberta) solucaoRef.current?.focus()
  }, [solucaoAberta])

  return (
    <div className="flex flex-col gap-3">
      {abertas > 0 && (
        <Alert variant="warning" role="status">
          <LightbulbIcon />
          <AlertTitle>
            Pista {abertas} de {pistas.length}
          </AlertTitle>
          <AlertDescription>{pistas[abertas - 1]}</AlertDescription>
        </Alert>
      )}

      {solucaoAberta && (
        <div
          ref={solucaoRef}
          tabIndex={-1}
          className="flex flex-col gap-2 outline-none"
        >
          <p className="text-sm font-semibold">Uma solução possível</p>
          <pre className="overflow-x-auto rounded-lg border-2 border-border bg-popover p-4 font-mono text-sm leading-relaxed">
            {solucao}
          </pre>
        </div>
      )}

      {temMaisPistas ? (
        <Button
          variant="outline"
          className="w-fit"
          onClick={() => setAbertas((n) => n + 1)}
        >
          {abertas === 0 ? 'Ver pista' : 'Ver próxima pista'}
        </Button>
      ) : (
        !solucaoAberta && (
          <Button
            variant="outline"
            className="w-fit"
            onClick={() => setSolucaoAberta(true)}
          >
            Ver solução
          </Button>
        )
      )}
    </div>
  )
}
