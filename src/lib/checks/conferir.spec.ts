import { describe, expect, it } from 'vitest'

import type { AulaCss, AulaHtml } from '@/content/aulas/types'

import { conferir } from './conferir'

const base = {
  slug: 'x',
  ordem: 1,
  titulo: 'X',
  objetivo: '',
  duracaoMin: 15,
}

const html: AulaHtml = {
  ...base,
  modulo: 'html',
  pratica: {
    enunciado: [],
    inicial: '',
    conferencia: [{ tipo: 'existe', seletor: 'h1', descricao: 'Tem h1' }],
    pistas: [],
    solucao: '',
  },
}

const css: AulaCss = {
  ...base,
  modulo: 'css',
  pratica: {
    enunciado: [],
    inicial: '',
    conferencia: [
      {
        tipo: 'regra',
        seletor: 'h1',
        propriedades: ['color'],
        descricao: 'h1 tem cor',
      },
    ],
    pistas: [],
    solucao: '',
  },
}

describe('conferir', () => {
  it('aula de HTML confere o documento', () => {
    expect(conferir(html, '<h1>Oi</h1>')).toEqual([
      { descricao: 'Tem h1', ok: true },
    ])
  })

  it('aula de CSS confere as regras', () => {
    expect(conferir(css, 'h1 { color: red; }')).toEqual([
      { descricao: 'h1 tem cor', ok: true },
    ])
    // o mesmo texto como HTML não é uma regra de CSS válida para h1
    expect(conferir(css, '<h1>Oi</h1>')).toEqual([
      { descricao: 'h1 tem cor', ok: false },
    ])
  })
})
