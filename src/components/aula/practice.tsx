'use client'

import { useId, useState } from 'react'

import { LuvSays } from '@/components/luv/luv-says'
import { Button } from '@/components/ui/button'
import { toast } from '@/components/ui/toast'
import type { Aula } from '@/content/aulas/types'
import { runChecks } from '@/lib/checks/run-checks'
import type { CheckResult } from '@/lib/checks/types'

import { CheckList } from './check-list'
import { CodeEditor } from './code-editor'
import { HintPanel } from './hint-panel'
import { LessonDone } from './lesson-done'
import { ResultPreview } from './result-preview'

type PracticeProps = {
  aula: Aula
  proxima?: { slug: string; titulo: string }
}

function falaDaLuv(faltam: number) {
  if (faltam === 0) return 'Funcionou! Agora é só concluir a aula.'
  return faltam === 1
    ? 'Quase! Falta 1 item. Quer uma pista?'
    : `Quase! Faltam ${faltam} itens. Quer uma pista?`
}

/**
 * Prática da aula (DS 9 — Estrutura da aula, Conferência e pistas,
 * Conclusão de aula, Desfazer). Nada é salvo ainda (Plano 4).
 */
export function Practice({ aula, proxima }: PracticeProps) {
  const { pratica } = aula
  const tituloId = useId()
  const ajudaId = useId()
  const [codigo, setCodigo] = useState(pratica.inicial)
  const [resultados, setResultados] = useState<CheckResult[] | null>(null)
  const [mostrarPistas, setMostrarPistas] = useState(false)
  const [concluida, setConcluida] = useState(false)

  const faltam = resultados?.filter((r) => !r.ok).length ?? 0
  const tudoCerto = resultados !== null && faltam === 0

  function mudarCodigo(novo: string) {
    setCodigo(novo)
    setResultados(null) // conferência antiga não vale para o código novo
  }

  function conferir() {
    const novos = runChecks(codigo, pratica.conferencia)
    setResultados(novos)
    if (novos.some((r) => !r.ok)) setMostrarPistas(true)
  }

  function recomecar() {
    if (codigo === pratica.inicial) return // nada a desfazer
    const anterior = codigo
    mudarCodigo(pratica.inicial)
    toast.add({
      title: 'Exercício recomeçado',
      description: 'Seu código voltou para o começo.',
      timeout: 6000,
      actionProps: {
        children: 'Desfazer',
        onClick: () => mudarCodigo(anterior),
      },
    })
  }

  function concluir() {
    setConcluida(true)
    toast.add({ title: 'Aula concluída', description: aula.titulo })
  }

  if (concluida) {
    return <LessonDone titulo={aula.titulo} proxima={proxima} />
  }

  return (
    <section aria-labelledby={tituloId} className="flex flex-col gap-5">
      <h2 id={tituloId} className="font-display text-2xl font-semibold">
        Prática
      </h2>

      <ol className="flex list-decimal flex-col gap-1 pl-5 text-base">
        {pratica.enunciado.map((passo) => (
          <li key={passo}>{passo}</li>
        ))}
      </ol>

      <CodeEditor
        value={codigo}
        onChange={mudarCodigo}
        label="Seu código HTML"
      />
      <ResultPreview html={codigo} />

      <div className="flex flex-wrap gap-3">
        <Button variant={tudoCerto ? 'outline' : 'default'} onClick={conferir}>
          Conferir
        </Button>
        <Button variant="outline" onClick={recomecar}>
          Recomeçar
        </Button>
      </div>

      <CheckList
        itens={pratica.conferencia.map((c) => c.descricao)}
        resultados={resultados}
      />

      {/* Região viva persistente: a fala troca aqui dentro e é anunciada. */}
      <div role="status">
        {resultados !== null && (
          <LuvSays
            announce={false}
            state={tudoCerto ? 'comemorar' : 'incentivo'}
          >
            {falaDaLuv(faltam)}
          </LuvSays>
        )}
      </div>

      {mostrarPistas && (
        <HintPanel pistas={pratica.pistas} solucao={pratica.solucao} />
      )}

      <div className="flex flex-col gap-2">
        <Button
          size="lg"
          className="w-fit"
          variant={tudoCerto ? 'default' : 'outline'}
          disabled={!tudoCerto}
          focusableWhenDisabled
          aria-describedby={tudoCerto ? undefined : ajudaId}
          onClick={concluir}
        >
          Concluir aula
        </Button>
        {!tudoCerto && (
          <p id={ajudaId} className="text-sm text-muted-foreground">
            Confira o exercício: quando todos os itens estiverem certos, você
            conclui a aula.
          </p>
        )}
      </div>
    </section>
  )
}
