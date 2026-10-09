import { describe, expect, it } from 'vitest'

import type { AulaCss, AulaHtml } from '@/content/aulas/types'

import { concluirAula, salvarCodigo } from './acoes'
import { type Progresso, PROGRESSO_VAZIO } from './modelo'
import {
  documentoDoSite,
  montarSite,
  proximaParaEstudar,
  siteParaMostrar,
  ultimaConcluida,
} from './site'

function aula(slug: string, ordem: number): AulaHtml {
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

function aulaCss(slug: string, ordem: number): AulaCss {
  const base = aula(slug, ordem)
  return {
    ...base,
    modulo: 'css',
    pratica: { ...base.pratica, conferencia: [] },
  }
}

const AULAS = [aula('a', 1), aula('b', 2), aula('c', 3)]
const FEITA = '2026-10-09T20:00:00.000Z'

describe('site e caminho', () => {
  it('sem aulas concluídas, o site está vazio e a próxima é a primeira', () => {
    expect(montarSite(PROGRESSO_VAZIO, AULAS)).toEqual({
      html: '',
      css: '',
      partes: [],
    })
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
      css: '',
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

  it('o site mostra o código com que a aula foi concluída, não as edições depois', () => {
    const slug = 'a'
    let p = salvarCodigo(PROGRESSO_VAZIO, slug, '<h1>A</h1>')
    p = concluirAula(p, slug, FEITA, '2026-10-09')
    p = salvarCodigo(p, slug, '<h1>B</h1>')
    expect(montarSite(p, AULAS).html).toBe('<h1>A</h1>')

    p = concluirAula(p, slug, FEITA, '2026-10-10')
    expect(montarSite(p, AULAS).html).toBe('<h1>B</h1>')
  })

  it('dados antigos, sem codigoConcluido, usam o código salvo', () => {
    const p: Progresso = {
      ...PROGRESSO_VAZIO,
      aulas: {
        a: { codigo: '<p>velho</p>', conferencias: 1, concluidaEm: FEITA },
      },
    }
    expect(montarSite(p, AULAS).html).toBe('<p>velho</p>')
  })

  it('o CSS das aulas de CSS concluídas fica à parte, na ordem das aulas', () => {
    const aulas = [aula('a', 1), aulaCss('c1', 1), aulaCss('c2', 2)]
    const p: Progresso = {
      ...PROGRESSO_VAZIO,
      aulas: {
        a: { codigo: '<h1>A</h1>', conferencias: 1, concluidaEm: FEITA },
        c2: {
          codigo: 'h2 { color: red; }',
          conferencias: 1,
          concluidaEm: FEITA,
        },
        c1: {
          codigo: 'h1 { color: blue; }\n',
          conferencias: 1,
          concluidaEm: FEITA,
        },
      },
    }
    expect(montarSite(p, aulas)).toEqual({
      html: '<h1>A</h1>',
      css: 'h1 { color: blue; }\n\nh2 { color: red; }',
      partes: [
        { slug: 'a', titulo: 'Aula 1' },
        { slug: 'c1', titulo: 'Aula 1' },
        { slug: 'c2', titulo: 'Aula 2' },
      ],
    })
  })

  it('o código em edição entra no lugar desta aula, mesmo sem concluir', () => {
    const aulas = [aula('a', 1), aulaCss('c1', 1), aulaCss('c2', 2)]
    const p: Progresso = {
      ...PROGRESSO_VAZIO,
      aulas: {
        c1: {
          codigo: 'h1 { color: blue; }',
          conferencias: 1,
          concluidaEm: FEITA,
        },
      },
    }
    const site = montarSite(p, aulas, {
      slug: 'c2',
      codigo: 'h2 { color: red; }',
    })
    expect(site.css).toBe('h1 { color: blue; }\n\nh2 { color: red; }')
    // não concluída: não vira parte do site
    expect(site.partes).toEqual([{ slug: 'c1', titulo: 'Aula 1' }])
    // aula concluída em edição: vale o código do editor
    expect(
      montarSite(p, aulas, { slug: 'c1', codigo: 'h1 { color: green; }' }).css,
    ).toBe('h1 { color: green; }')
    // o editor vale mesmo vazio
    expect(montarSite(p, aulas, { slug: 'c1', codigo: '' }).css).toBe('')
  })

  it('o documento põe o CSS num <style> antes do HTML', () => {
    expect(documentoDoSite({ html: '<h1>A</h1>', css: '' })).toBe('<h1>A</h1>')
    expect(
      documentoDoSite({ html: '<h1>A</h1>', css: 'h1 { color: red; }' }),
    ).toBe('<style>\nh1 { color: red; }\n</style>\n<h1>A</h1>')
  })

  it('sem HTML, o documento usa o HTML de exemplo', () => {
    expect(
      documentoDoSite({ html: '', css: 'h1 {}' }, '<h1>Exemplo</h1>'),
    ).toBe('<style>\nh1 {}\n</style>\n<h1>Exemplo</h1>')
    expect(
      documentoDoSite({ html: '<h1>Meu</h1>', css: '' }, '<h1>Exemplo</h1>'),
    ).toBe('<h1>Meu</h1>')
  })

  it('"</style" no CSS não fecha a tag antes da hora', () => {
    const doc = documentoDoSite({
      html: '<p>oi</p>',
      css: 'p {} </style><h1>fora</h1>',
    })
    expect(doc).toBe(
      '<style>\np {} <\\/style><h1>fora</h1>\n</style>\n<p>oi</p>',
    )
  })

  it('sem HTML, siteParaMostrar usa o exemplo e avisa', () => {
    const { documento, usaExemplo } = siteParaMostrar(
      { html: '', css: 'h1 {}' },
      '<h1>Exemplo</h1>',
    )
    expect(usaExemplo).toBe(true)
    expect(documento).toContain('<h1>Exemplo</h1>')
  })

  it('com HTML, siteParaMostrar não usa o exemplo', () => {
    const { documento, usaExemplo } = siteParaMostrar(
      { html: '<h1>Meu</h1>', css: '' },
      '<h1>Exemplo</h1>',
    )
    expect(usaExemplo).toBe(false)
    expect(documento).toBe('<h1>Meu</h1>')
    expect(documento).not.toContain('Exemplo')
  })
})
