import { describe, expect, it } from 'vitest'

import type { Aula } from '@/content/aulas/types'

import { type Progresso, PROGRESSO_VAZIO } from './modelo'
import { montarSite, proximaParaEstudar, ultimaConcluida } from './site'

function aula(slug: string, ordem: number): Aula {
  return {
    slug,
    ordem,
    modulo: 'html',
    titulo: `Aula ${ordem}`,
    objetivo: '',
    duracaoMin: 15,
    pratica: {
      enunciado: [],
      inicial: '',
      conferencia: [],
      pistas: [],
      solucao: '',
    },
  }
}

const AULAS = [aula('a', 1), aula('b', 2), aula('c', 3)]
const FEITA = '2026-10-09T20:00:00.000Z'

describe('site e caminho', () => {
  it('sem aulas concluídas, o site está vazio e a próxima é a primeira', () => {
    expect(montarSite(PROGRESSO_VAZIO, AULAS)).toEqual({ html: '', partes: [] })
    expect(proximaParaEstudar(PROGRESSO_VAZIO, AULAS)?.slug).toBe('a')
    expect(ultimaConcluida(PROGRESSO_VAZIO, AULAS)).toBeUndefined()
  })

  it('o site junta o código das aulas concluídas, na ordem das aulas', () => {
    const p: Progresso = {
      ...PROGRESSO_VAZIO,
      aulas: {
        c: { codigo: '<p>três</p>\n', conferencias: 1, concluidaEm: FEITA },
        a: { codigo: '<h1>um</h1>', conferencias: 1, concluidaEm: FEITA },
        b: { codigo: '<p>dois (não concluída)</p>', conferencias: 1 },
      },
    }

    expect(montarSite(p, AULAS)).toEqual({
      html: '<h1>um</h1>\n\n<p>três</p>',
      partes: [
        { slug: 'a', titulo: 'Aula 1' },
        { slug: 'c', titulo: 'Aula 3' },
      ],
    })
    expect(proximaParaEstudar(p, AULAS)?.slug).toBe('b')
    expect(ultimaConcluida(p, AULAS)?.slug).toBe('c')
  })

  it('tudo concluído: não há próxima', () => {
    const p: Progresso = {
      ...PROGRESSO_VAZIO,
      aulas: Object.fromEntries(
        AULAS.map((a) => [a.slug, { conferencias: 1, concluidaEm: FEITA }]),
      ),
    }
    expect(proximaParaEstudar(p, AULAS)).toBeUndefined()
  })
})
