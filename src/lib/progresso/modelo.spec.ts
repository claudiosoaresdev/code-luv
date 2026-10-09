import { describe, expect, it } from 'vitest'

import { normalizar, PROGRESSO_VAZIO } from './modelo'

describe('normalizar', () => {
  it('aceita um progresso válido', () => {
    const dado = {
      versao: 1,
      nome: 'Ana',
      aulas: {
        'seu-primeiro-html': {
          codigo: '<h1>Oi</h1>',
          conferencias: 2,
          concluidaEm: '2026-10-09T20:00:00.000Z',
        },
      },
      conquistas: { 'hello-world': { em: '2026-10-09T20:00:00.000Z' } },
      diasEstudados: ['2026-10-09'],
      velocidade: 1.25,
    }
    expect(normalizar(dado)).toEqual(dado)
  })

  it('recusa o que não é progresso do CodeLuv', () => {
    expect(normalizar(null)).toBeNull()
    expect(normalizar('oi')).toBeNull()
    expect(normalizar({ versao: 2, aulas: {} })).toBeNull()
    expect(normalizar({ versao: 1, aulas: [] })).toBeNull()
  })

  it('descarta campos inválidos sem perder o resto', () => {
    expect(
      normalizar({
        versao: 1,
        nome: 42,
        aulas: { a: { codigo: 7, conferencias: 'x' }, b: 'lixo' },
        conquistas: { c: { em: 3 } },
        diasEstudados: ['2026-10-09', 5],
        velocidade: 9,
      }),
    ).toEqual({
      ...PROGRESSO_VAZIO,
      aulas: { a: { conferencias: 0 } },
      diasEstudados: ['2026-10-09'],
    })
  })

  it('o progresso vazio é ele mesmo válido', () => {
    expect(normalizar(PROGRESSO_VAZIO)).toEqual(PROGRESSO_VAZIO)
  })
})
