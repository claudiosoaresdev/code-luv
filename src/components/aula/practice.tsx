'use client'

import { useId, useState } from 'react'

import { AVISO_SITE_DE_EXEMPLO } from '@/components/site-preview'
import { Badge } from '@/components/ui/badge'
import { Bubble, BubbleContent } from '@/components/ui/bubble'
import { Button } from '@/components/ui/button'
import { toast } from '@/components/ui/toast'
import { AULAS, siteDeExemplo } from '@/content/aulas'
import type { Aula } from '@/content/aulas/types'
import { getModulo } from '@/content/modulos'
import { conferir } from '@/lib/checks/conferir'
import type { CheckResult } from '@/lib/checks/types'
import {
  concluirAula,
  hoje,
  registrarConferencia,
  salvarCodigo,
} from '@/lib/progresso/acoes'
import { type Conquista, registrarConquistas } from '@/lib/progresso/conquistas'
import { PROGRESSO_VAZIO } from '@/lib/progresso/modelo'
import { documentoDoSite, montarSite } from '@/lib/progresso/site'
import { atualizarProgresso } from '@/lib/progresso/store'
import { useProgresso } from '@/lib/progresso/use-progresso'

import { CheckList } from './check-list'
import { CodeEditor } from './code-editor'
import { HintPanel } from './hint-panel'
import { LessonDone } from './lesson-done'
import { ResultPreview } from './result-preview'

type PracticeProps = {
  aula: Aula
  proxima?: { slug: string; titulo: string }
  /** id da seção, alvo do foco ao fim da escuta. */
  id?: string
}

function falaDaLuv(faltam: number) {
  if (faltam === 0) return 'Funcionou! Agora é só concluir a aula.'
  return faltam === 1
    ? 'Quase! Falta 1 item. Quer uma pista?'
    : `Quase! Faltam ${faltam} itens. Quer uma pista?`
}

/**
 * Prática da aula (DS 9 — Estrutura da aula, Conferência e pistas,
 * Conclusão de aula, Desfazer). Código, conferências e conclusão ficam no
 * progresso da aluna (Plano 4). Nas aulas de CSS, o resultado é o site
 * inteiro com o CSS do editor (Plano 5).
 */
export function Practice({ aula, proxima, id }: PracticeProps) {
  const { pratica } = aula
  const modulo = getModulo(aula.modulo)
  const tituloId = useId()
  const ajudaId = useId()
  const avisoId = useId()
  const estado = useProgresso()
  const progresso = estado?.progresso ?? PROGRESSO_VAZIO
  const salva = progresso.aulas[aula.slug]
  // Só o que foi editado nesta visita fica no estado local: o valor mostrado
  // é editado → salvo no aparelho → código inicial (sem setState em efeito).
  const [editado, setEditado] = useState<string | null>(null)
  const codigo = editado ?? salva?.codigo ?? pratica.inicial
  const [resultados, setResultados] = useState<CheckResult[] | null>(null)
  const [mostrarPistas, setMostrarPistas] = useState(false)
  const [concluida, setConcluida] = useState(false)

  const faltam = resultados?.filter((r) => !r.ok).length ?? 0
  const tudoCerto = resultados !== null && faltam === 0

  function mudarCodigo(novo: string) {
    setEditado(novo)
    setResultados(null) // conferência antiga não vale para o código novo
    atualizarProgresso((p) => salvarCodigo(p, aula.slug, novo))
  }

  function conferirPratica() {
    const novos = conferir(aula, codigo)
    setResultados(novos)
    atualizarProgresso((p) => registrarConferencia(p, aula.slug, hoje()))
    if (novos.some((r) => !r.ok)) setMostrarPistas(true)
  }

  function recomecar() {
    if (codigo === pratica.inicial) return // nada a desfazer
    const anterior = codigo
    mudarCodigo(pratica.inicial)
    toast.add({
      title: 'Exercício recomeçado',
      description: 'Seu código voltou para o começo.',
      actionProps: {
        children: 'Desfazer',
        onClick: () => mudarCodigo(anterior),
      },
    })
  }

  function concluir() {
    const agora = new Date().toISOString()
    let novas: Conquista[] = []
    atualizarProgresso((p) => {
      const resultado = registrarConquistas(
        concluirAula(p, aula.slug, agora, hoje()),
        agora,
      )
      novas = resultado.novas
      return resultado.progresso
    })
    setConcluida(true)
    toast.add({ title: 'Aula concluída', description: aula.titulo })
    for (const conquista of novas) {
      toast.add({
        title: `Conquista: ${conquista.titulo}`,
        description: conquista.descricao,
      })
    }
  }

  // Aula de CSS: o resultado é o site inteiro, com o CSS do editor no lugar
  // desta aula. Sem HTML concluído, o CSS aparece no site de exemplo.
  const siteEmEdicao =
    aula.modulo === 'css'
      ? montarSite(progresso, AULAS, { slug: aula.slug, codigo })
      : null
  const usaExemplo = siteEmEdicao !== null && siteEmEdicao.html === ''
  const documento = siteEmEdicao
    ? documentoDoSite(siteEmEdicao, siteDeExemplo())
    : codigo

  if (concluida) {
    const siteConcluido = montarSite(progresso, AULAS)
    return (
      <LessonDone
        titulo={aula.titulo}
        proxima={proxima}
        siteHtml={documentoDoSite(siteConcluido, siteDeExemplo())}
        aviso={siteConcluido.html === '' ? AVISO_SITE_DE_EXEMPLO : undefined}
      />
    )
  }

  return (
    <section
      id={id}
      tabIndex={-1}
      aria-labelledby={tituloId}
      className="flex scroll-mt-40 flex-col gap-5 rounded-xl focus:outline-3 focus:outline-offset-4 focus:outline-ring"
    >
      <h2 id={tituloId} className="font-display text-2xl font-semibold">
        Prática
      </h2>

      {salva?.concluidaEm && (
        <Badge variant="outline" className="w-fit">
          Você já concluiu esta aula
        </Badge>
      )}

      <ol className="flex list-decimal flex-col gap-1 pl-5 text-base">
        {pratica.enunciado.map((passo) => (
          <li key={passo}>{passo}</li>
        ))}
      </ol>

      <CodeEditor
        value={codigo}
        onChange={mudarCodigo}
        label={`Seu código ${modulo.nome}`}
        linguagem={aula.modulo}
      />
      {usaExemplo && (
        <p id={avisoId} className="text-sm text-muted-foreground">
          {AVISO_SITE_DE_EXEMPLO}
        </p>
      )}
      <ResultPreview
        html={documento}
        podeVerComoCelular={aula.modulo === 'css'}
        ariaDescribedBy={usaExemplo ? avisoId : undefined}
        className={aula.modulo === 'css' ? 'h-96' : undefined}
      />

      <div className="flex flex-wrap gap-3">
        <Button
          variant={tudoCerto ? 'outline' : 'default'}
          onClick={conferirPratica}
        >
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
          <Bubble variant="tinted">
            <BubbleContent className="text-base">
              {falaDaLuv(faltam)}
            </BubbleContent>
          </Bubble>
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
