'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

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
    } else {
      CSS.highlights.delete('leitura')
    }
    return () => {
      CSS.highlights.delete('leitura')
    }
  }, [estado, atual, trechos])

  // Rolagem só quando o trecho muda com a escuta tocando (pausar não rola) e
  // sem animação: texto lido nunca é animado (DS 7).
  const controlesRef = useRef<HTMLDivElement>(null)
  const ultimoRolado = useRef<number | null>(null)
  useEffect(() => {
    if (estado !== 'tocando') {
      if (estado !== 'pausado') ultimoRolado.current = null
      return
    }
    if (ultimoRolado.current === atual) return
    ultimoRolado.current = atual
    const trecho = trechos[atual]
    const controles = controlesRef.current
    if (!trecho || !controles) return
    const caixa = trecho.range.getBoundingClientRect()
    const topoLivre = controles.getBoundingClientRect().bottom + 8
    if (caixa.top < topoLivre || caixa.bottom > window.innerHeight - 16) {
      window.scrollBy({
        top: caixa.top - topoLivre - window.innerHeight * 0.2,
        behavior: 'auto',
      })
    }
  }, [estado, atual, trechos])

  useEffect(() => {
    if (estado === 'fim' && focoAoTerminar) {
      document.getElementById(focoAoTerminar)?.focus()
    }
  }, [estado, focoAoTerminar])

  // Clicar numa frase pula para ela — só com a escuta em andamento (tocando ou
  // pausada; pausada, retoma dali), para um clique de seleção nunca disparar
  // som (briefing: nada toca sozinho). Seleção de texto e links são ignorados.
  function pularParaOClique(evento: React.MouseEvent) {
    if (estado !== 'tocando' && estado !== 'pausado') return
    if (window.getSelection()?.isCollapsed === false) return
    if ((evento.target as Element).closest('a')) return
    const ponto = pontoNoTexto(evento.clientX, evento.clientY)
    if (!ponto) return
    const i = trechos.findIndex((t) =>
      t.range.isPointInRange(ponto.no, ponto.deslocamento),
    )
    if (i >= 0) escuta.irPara(i)
  }

  return (
    <section className="flex flex-col gap-5">
      {/* top: altura da LessonHeader (h-16 + border-b-2) — ver lesson-header.tsx */}
      <div
        ref={controlesRef}
        className="sticky top-[calc(4rem+2px)] z-10 bg-background py-2"
      >
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
