import type { Check } from '@/lib/checks/types'

export type Aula = {
  slug: string
  /** Posição no módulo, a partir de 1. */
  ordem: number
  modulo: 'html'
  titulo: string
  /** Frase dita pela Luv no começo da aula (até duas frases — DS 8.2). */
  objetivo: string
  duracaoMin: number
  pratica: {
    /** Passos curtos, um por item. */
    enunciado: string[]
    /** Código com que o editor começa (e para onde "Recomeçar" volta). */
    inicial: string
    conferencia: Check[]
    /** Da mais vaga para a mais direta (DS 9 — Conferência e pistas). */
    pistas: string[]
    /** Uma solução possível; precisa passar em toda a conferência. */
    solucao: string
  }
}
