import { describe, expect, it } from 'vitest'

import {
  META_PADRAO,
  metaDe,
  metaValida,
  normalizar,
  PROGRESSO_VAZIO,
} from './modelo'

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

  it('aceita conferenciasAoConcluir válido e descarta o inválido', () => {
    const r = normalizar({
      versao: 1,
      aulas: {
        a: { conferencias: 4, conferenciasAoConcluir: 2 },
        b: { conferencias: 4, conferenciasAoConcluir: -1 },
      },
    })
    expect(r?.aulas.a.conferenciasAoConcluir).toBe(2)
    expect(r?.aulas.b.conferenciasAoConcluir).toBeUndefined()
  })

  it('ignora chaves de protótipo', () => {
    const r = normalizar(
      JSON.parse(
        '{"versao":1,"aulas":{"__proto__":{"conferencias":5},"constructor":{"conferencias":1}},"conquistas":{"__proto__":{"em":"x"}}}',
      ),
    )!
    expect(Object.getPrototypeOf(r.aulas)).toBe(Object.prototype)
    expect(Object.keys(r.aulas)).toEqual([])
    expect(Object.keys(r.conquistas)).toEqual([])
  })

  it('só aceita números finitos', () => {
    const r = normalizar(
      JSON.parse(
        '{"versao":1,"aulas":{"a":{"conferencias":1e999}},"conquistas":{}}',
      ),
    )
    expect(r?.aulas.a.conferencias).toBe(0)
  })

  it('valida codigoConcluido como texto', () => {
    const r = normalizar({
      versao: 1,
      aulas: {
        a: { conferencias: 1, codigoConcluido: '<p>x</p>' },
        b: { conferencias: 1, codigoConcluido: 3 },
      },
    })
    expect(r?.aulas.a.codigoConcluido).toBe('<p>x</p>')
    expect(r?.aulas.b.codigoConcluido).toBeUndefined()
  })
})

describe('meta da semana', () => {
  it('aceita só inteiros de 1 a 7', () => {
    expect([1, 3, 7].every(metaValida)).toBe(true)
    expect([0, 8, 2.5, '3', null, undefined, Number.NaN].some(metaValida)).toBe(
      false,
    )
  })

  it('normalizar guarda a meta válida e descarta a inválida', () => {
    expect(
      normalizar({ versao: 1, aulas: {}, metaSemanal: 5 })?.metaSemanal,
    ).toBe(5)
    for (const ruim of [0, 8, 2.5, '3']) {
      expect(
        normalizar({ versao: 1, aulas: {}, metaSemanal: ruim })?.metaSemanal,
      ).toBeUndefined()
    }
  })

  it('sem meta guardada, vale 3', () => {
    expect(META_PADRAO).toBe(3)
    expect(metaDe(PROGRESSO_VAZIO)).toBe(3)
    expect(metaDe({ ...PROGRESSO_VAZIO, metaSemanal: 6 })).toBe(6)
  })
})
