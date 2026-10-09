import { describe, expect, it } from 'vitest'

import {
  concluirAula,
  definirNome,
  hoje,
  pularNome,
  registrarConferencia,
  salvarCodigo,
} from './acoes'
import { PROGRESSO_VAZIO } from './modelo'

const SLUG = 'seu-primeiro-html'

describe('ações do progresso', () => {
  it('salva o código da aula sem mexer no resto', () => {
    const p = salvarCodigo(PROGRESSO_VAZIO, SLUG, '<h1>Oi</h1>')
    expect(p.aulas[SLUG]).toEqual({ codigo: '<h1>Oi</h1>', conferencias: 0 })
    expect(PROGRESSO_VAZIO.aulas).toEqual({}) // não muta
  })

  it('conta conferências e registra o dia uma vez só', () => {
    let p = registrarConferencia(PROGRESSO_VAZIO, SLUG, '2026-10-09')
    p = registrarConferencia(p, SLUG, '2026-10-09')
    expect(p.aulas[SLUG].conferencias).toBe(2)
    expect(p.diasEstudados).toEqual(['2026-10-09'])
  })

  it('guarda a primeira conclusão', () => {
    let p = concluirAula(
      PROGRESSO_VAZIO,
      SLUG,
      '2026-10-09T20:00:00.000Z',
      '2026-10-09',
    )
    p = concluirAula(p, SLUG, '2026-10-10T20:00:00.000Z', '2026-10-10')
    expect(p.aulas[SLUG].concluidaEm).toBe('2026-10-09T20:00:00.000Z')
    expect(p.diasEstudados).toEqual(['2026-10-09', '2026-10-10'])
  })

  it('nome: guarda limpo; vazio conta como pular', () => {
    expect(definirNome(PROGRESSO_VAZIO, '  Ana  ')).toMatchObject({
      nome: 'Ana',
      nomePulado: false,
    })
    expect(definirNome(PROGRESSO_VAZIO, '   ')).toMatchObject({
      nome: undefined,
      nomePulado: true,
    })
    expect(pularNome(PROGRESSO_VAZIO).nomePulado).toBe(true)
  })

  it('hoje usa a data local no formato AAAA-MM-DD', () => {
    expect(hoje(new Date(2026, 9, 9, 23, 30))).toBe('2026-10-09')
  })

  it('guarda quantas conferências havia ao concluir, só na primeira vez', () => {
    let p = registrarConferencia(PROGRESSO_VAZIO, SLUG, '2026-10-09')
    p = concluirAula(p, SLUG, '2026-10-09T20:00:00.000Z', '2026-10-09')
    p = registrarConferencia(p, SLUG, '2026-10-09')
    p = concluirAula(p, SLUG, '2026-10-10T20:00:00.000Z', '2026-10-10')
    expect(p.aulas[SLUG].conferenciasAoConcluir).toBe(1)
    expect(p.aulas[SLUG].conferencias).toBe(2)
  })
})
