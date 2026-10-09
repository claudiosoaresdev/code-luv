import { describe, expect, it } from 'vitest'

import type { Aula } from '@/content/aulas/types'
import type { Modulo } from '@/content/modulos'

import { type Progresso, PROGRESSO_VAZIO } from './modelo'
import {
  diasDaSemana,
  falaDaSemana,
  fraseDaSemana,
  mapaDeDias,
  progressoPorModulo,
  vitrineDeConquistas,
} from './painel'

// Quinta-feira, 8 de outubro de 2026, 10h (horário local).
const QUINTA = new Date(2026, 9, 8, 10)

const com = (extra: Partial<Progresso>): Progresso => ({
  ...PROGRESSO_VAZIO,
  ...extra,
})

describe('diasDaSemana', () => {
  it('vai de segunda a domingo e marca hoje e o futuro', () => {
    const dias = diasDaSemana(PROGRESSO_VAZIO, QUINTA)
    expect(dias.map((d) => d.dia)).toEqual([
      '2026-10-05',
      '2026-10-06',
      '2026-10-07',
      '2026-10-08',
      '2026-10-09',
      '2026-10-10',
      '2026-10-11',
    ])
    expect(dias.map((d) => d.curto)).toEqual([
      'seg',
      'ter',
      'qua',
      'qui',
      'sex',
      'sáb',
      'dom',
    ])
    expect(dias[3]).toMatchObject({
      completo: 'quinta-feira',
      hoje: true,
      futuro: false,
    })
    expect(dias.filter((d) => d.futuro).map((d) => d.curto)).toEqual([
      'sex',
      'sáb',
      'dom',
    ])
  })

  it('no domingo, a semana ainda é a que começou na segunda', () => {
    const domingo = new Date(2026, 9, 11, 22)
    expect(diasDaSemana(PROGRESSO_VAZIO, domingo)[0].dia).toBe('2026-10-05')
    expect(diasDaSemana(PROGRESSO_VAZIO, domingo)[6]).toMatchObject({
      dia: '2026-10-11',
      hoje: true,
    })
  })

  it('atravessa a virada do ano', () => {
    const sextaDeAnoNovo = new Date(2027, 0, 1, 9)
    expect(
      diasDaSemana(PROGRESSO_VAZIO, sextaDeAnoNovo).map((d) => d.dia),
    ).toEqual([
      '2026-12-28',
      '2026-12-29',
      '2026-12-30',
      '2026-12-31',
      '2027-01-01',
      '2027-01-02',
      '2027-01-03',
    ])
  })

  it('marca só os dias estudados desta semana', () => {
    const p = com({
      diasEstudados: ['2026-09-30', '2026-10-05', '2026-10-07'],
    })
    expect(
      diasDaSemana(p, QUINTA)
        .filter((d) => d.estudou)
        .map((d) => d.curto),
    ).toEqual(['seg', 'qua'])
  })
})

describe('mapaDeDias', () => {
  it('tem 13 semanas de 7 dias, terminando na semana de hoje', () => {
    const mapa = mapaDeDias(PROGRESSO_VAZIO, QUINTA)
    expect(mapa).toHaveLength(13)
    expect(mapa.every((semana) => semana.length === 7)).toBe(true)
    expect(mapa[0][0].dia).toBe('2026-07-13')
    expect(mapa[12][0].dia).toBe('2026-10-05')
    expect(mapa[12].filter((c) => c.futuro).map((c) => c.dia)).toEqual([
      '2026-10-09',
      '2026-10-10',
      '2026-10-11',
    ])
  })

  it('dia de aula concluída vale mais que dia só estudado', () => {
    const p = com({
      diasEstudados: ['2026-10-05', '2026-10-07'],
      aulas: {
        a: {
          conferencias: 1,
          concluidaEm: new Date(2026, 9, 7, 15).toISOString(),
        },
      },
    })
    const semana = mapaDeDias(p, QUINTA)[12]
    expect(semana.map((c) => c.nivel)).toEqual([
      'estudou',
      'nada',
      'concluiu',
      'nada',
      'nada',
      'nada',
      'nada',
    ])
  })

  it('aceita outro número de semanas', () => {
    expect(mapaDeDias(PROGRESSO_VAZIO, QUINTA, 4)).toHaveLength(4)
  })
})

describe('progressoPorModulo', () => {
  const aula = (slug: string, modulo: 'html' | 'css'): Aula =>
    ({
      slug,
      modulo,
      ordem: 1,
      titulo: slug,
      objetivo: '',
      duracaoMin: 15,
      pratica: {
        enunciado: [],
        inicial: '',
        conferencia: [],
        pistas: [],
        solucao: '',
      },
    }) as Aula
  const modulos: Modulo[] = [
    { id: 'html', nome: 'HTML', titulo: 'HTML' },
    { id: 'css', nome: 'CSS', titulo: 'CSS' },
  ]

  it('conta as concluídas e o total de cada módulo', () => {
    const p = com({
      aulas: {
        h1: { conferencias: 1, concluidaEm: '2026-10-01T10:00:00.000Z' },
        h2: { conferencias: 3 },
      },
    })
    expect(
      progressoPorModulo(
        p,
        [aula('h1', 'html'), aula('h2', 'html'), aula('c1', 'css')],
        modulos,
      ),
    ).toEqual([
      { id: 'html', nome: 'HTML', concluidas: 1, total: 2 },
      { id: 'css', nome: 'CSS', concluidas: 0, total: 1 },
    ])
  })
})

describe('vitrineDeConquistas', () => {
  it('sem conquistas: todas a ganhar, e a próxima é a primeira', () => {
    const { selos, proxima } = vitrineDeConquistas(PROGRESSO_VAZIO)
    expect(selos.map((s) => s.ganha)).toEqual([false, false])
    expect(proxima?.titulo).toBe('Hello, World')
  })

  it('com a primeira ganha: a próxima é a seguinte', () => {
    const p = com({ conquistas: { 'hello-world': { em: '2026-10-05' } } })
    const { selos, proxima } = vitrineDeConquistas(p)
    expect(selos.map((s) => s.ganha)).toEqual([true, false])
    expect(proxima?.titulo).toBe('Persistente')
  })

  it('com todas ganhas: sem próxima', () => {
    const p = com({
      conquistas: {
        'hello-world': { em: '2026-10-05' },
        persistente: { em: '2026-10-06' },
      },
    })
    expect(vitrineDeConquistas(p).proxima).toBeUndefined()
  })
})

describe('falaDaSemana (a Luv nunca lamenta)', () => {
  it('zero dias: convida', () => {
    expect(falaDaSemana(0, 3)).toBe(
      'Semana nova, corações novos. Que tal começar com uma aula?',
    )
  })

  it('no caminho: diz quantos guardou e quantos faltam, por extenso', () => {
    expect(falaDaSemana(1, 3)).toBe(
      'A Luv guardou um coração esta semana. Faltam dois para a sua meta.',
    )
    expect(falaDaSemana(2, 3)).toBe(
      'A Luv guardou dois corações esta semana. Falta um para a sua meta.',
    )
    expect(falaDaSemana(3, 7)).toBe(
      'A Luv guardou três corações esta semana. Faltam quatro para a sua meta.',
    )
  })

  it('meta cumprida (ou passada): comemora', () => {
    expect(falaDaSemana(3, 3)).toBe(
      'Meta da semana completa! A Luv está radiante.',
    )
    expect(falaDaSemana(5, 3)).toBe(
      'Meta da semana completa! A Luv está radiante.',
    )
  })
})

describe('fraseDaSemana', () => {
  it('descreve a semana com a meta', () => {
    expect(fraseDaSemana(0, 3)).toBe(
      'Nenhum dia ainda nesta semana. Meta: 3 dias por semana.',
    )
    expect(fraseDaSemana(1, 1)).toBe(
      'Você estudou em 1 dia desta semana. Meta: 1 dia por semana.',
    )
    expect(fraseDaSemana(2, 3)).toBe(
      'Você estudou em 2 dias desta semana. Meta: 3 dias por semana.',
    )
  })
})
