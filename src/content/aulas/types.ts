import type { CheckCss, CheckHtml } from '@/lib/checks/types'

import type { ModuloId } from '../modulos'

type AulaDe<M extends ModuloId, C> = {
  slug: string
  /** Posição dentro do módulo, a partir de 1. */
  ordem: number
  modulo: M
  titulo: string
  /** Frase dita pela Luv no começo da aula (até duas frases — DS 8.2). */
  objetivo: string
  duracaoMin: number
  pratica: {
    /** Passos curtos, um por item. */
    enunciado: string[]
    /** Código com que o editor começa (e para onde "Recomeçar" volta). */
    inicial: string
    conferencia: C[]
    /** Da mais vaga para a mais direta (DS 9 — Conferência e pistas). */
    pistas: string[]
    /** Uma solução possível; precisa passar em toda a conferência. */
    solucao: string
  }
}

/** Aula de HTML: o código é uma parte do site; confere pelo documento. */
export type AulaHtml = AulaDe<'html', CheckHtml>
/** Aula de CSS: o código são regras para o site todo; confere pelas regras. */
export type AulaCss = AulaDe<'css', CheckCss>
export type Aula = AulaHtml | AulaCss
