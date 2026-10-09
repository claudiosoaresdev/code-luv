'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'

import { dividirEmTrechos, type Trecho } from '@/lib/escuta/trechos'

import { ListenControls } from './listen-controls'
import { useEscuta } from './use-escuta'

type EscutaProps = {
  children: React.ReactNode
  /** id do elemento que recebe o foco quando a leitura termina (DS 8.2). */
  focoAoTerminar?: string
}

/** Ponto do clique → posição no texto (Chrome/Firefox e Safari têm APIs diferentes). */
function pontoNoTexto(x: number, y: number) {
  const posicao = document.caretPositionFromPoint?.(x, y)
  if (posicao) return { no: posicao.offsetNode, deslocamento: posicao.offset }
  const range = document.caretRangeFromPoint?.(x, y)
  if (range)
    return { no: range.startContainer, deslocamento: range.startOffset }
  return null
}

/**
 * A explicação com a escuta (DS 9 — Escuta): controles fixos no topo, trecho
 * destacado com a CSS Custom Highlight API (sem mexer no DOM do React) e foco
 * na prática ao terminar.
 */
export function Escuta({ children, focoAoTerminar }: EscutaProps) {
  const [trechos, setTrechos] = useState<Trecho[]>([])
  // Ref callback: mede o texto quando ele entra no DOM (sem setState em efeito).
  const medir = useCallback((elemento: HTMLDivElement | null) => {
    if (elemento) setTrechos(dividirEmTrechos(elemento))
  }, [])
  const textos = useMemo(() => trechos.map((t) => t.texto), [trechos])
  const escuta = useEscuta({ trechos: textos })
  const { estado, atual } = escuta

  useEffect(() => {
    if (typeof CSS === 'undefined' || !('highlights' in CSS)) return
    const trecho = trechos[atual]
    if ((estado === 'tocando' || estado === 'pausado') && trecho) {
      CSS.highlights.set('leitura', new Highlight(trecho.range))
      trecho.range.startContainer.parentElement?.scrollIntoView({
        block: 'nearest',
      })
    } else {
      CSS.highlights.delete('leitura')
    }
    return () => {
      CSS.highlights.delete('leitura')
    }
  }, [estado, atual, trechos])

  useEffect(() => {
    if (estado === 'fim' && focoAoTerminar) {
      document.getElementById(focoAoTerminar)?.focus()
    }
  }, [estado, focoAoTerminar])

  // Clicar numa frase pula para ela — só com a escuta em andamento, para um
  // clique de seleção nunca disparar som (briefing: nada toca sozinho).
  function pularParaOClique(evento: React.MouseEvent) {
    if (estado !== 'tocando' && estado !== 'pausado') return
    const ponto = pontoNoTexto(evento.clientX, evento.clientY)
    if (!ponto) return
    const i = trechos.findIndex((t) =>
      t.range.isPointInRange(ponto.no, ponto.deslocamento),
    )
    if (i >= 0) escuta.irPara(i)
  }

  return (
    <section aria-label="Explicação" className="flex flex-col gap-5">
      <div className="sticky top-[calc(4rem+2px)] z-10 bg-background py-2">
        <ListenControls
          estado={estado}
          atual={atual}
          total={escuta.total}
          velocidade={escuta.velocidade}
          onOuvir={escuta.ouvir}
          onPausar={escuta.pausar}
          onContinuar={escuta.continuar}
          onAnterior={escuta.anterior}
          onProximo={escuta.proximo}
          onRepetir={escuta.repetir}
          onVelocidade={escuta.mudarVelocidade}
        />
      </div>
      <div
        ref={medir}
        onClick={pularParaOClique}
        className="flex flex-col gap-4"
      >
        {children}
      </div>
    </section>
  )
}
