import { describe, expect, it } from 'vitest'

import { CONQUISTAS, registrarConquistas } from './conquistas'
import { type Progresso, PROGRESSO_VAZIO } from './modelo'

const AGORA = '2026-10-09T20:00:00.000Z'

function comAula(conferencias: number, concluida: boolean): Progresso {
  return {
    ...PROGRESSO_VAZIO,
    aulas: {
      'seu-primeiro-html': {
        conferencias,
        ...(concluida ? { concluidaEm: AGORA } : {}),
      },
    },
  }
}

describe('conquistas', () => {
  it('são duas: Hello, World e Persistente', () => {
    expect(CONQUISTAS.map((c) => c.titulo)).toEqual([
      'Hello, World',
      'Persistente',
    ])
  })

  it('nada concluído, nada ganho', () => {
    expect(registrarConquistas(comAula(5, false), AGORA).novas).toEqual([])
  })

  it('concluir a primeira aula dá Hello, World; com 3+ conferências, também Persistente', () => {
    expect(
      registrarConquistas(comAula(1, true), AGORA).novas.map((c) => c.id),
    ).toEqual(['hello-world'])

    const { progresso, novas } = registrarConquistas(comAula(3, true), AGORA)
    expect(novas.map((c) => c.id)).toEqual(['hello-world', 'persistente'])
    expect(progresso.conquistas['persistente']).toEqual({ em: AGORA })
  })

  it('não dá a mesma conquista duas vezes', () => {
    const primeira = registrarConquistas(comAula(1, true), AGORA).progresso
    expect(registrarConquistas(primeira, AGORA).novas).toEqual([])
  })
})
