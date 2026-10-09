import { describe, expect, it } from 'vitest'

import { runCssChecks } from './run-css-checks'
import type { CheckCss } from './types'

const regra = (
  seletor: string,
  propriedades: string[],
  extra: Partial<CheckCss> = {},
): CheckCss => ({
  tipo: 'regra',
  seletor,
  propriedades,
  descricao: `${seletor} ${propriedades.join('/')}`,
  ...extra,
})

const passa = (css: string, check: CheckCss) => runCssChecks(css, [check])[0].ok

describe('runCssChecks', () => {
  it('passa quando a regra tem o seletor e a propriedade', () => {
    expect(passa('h1 { color: purple; }', regra('h1', ['color']))).toBe(true)
    expect(passa('h2 { color: purple; }', regra('h1', ['color']))).toBe(false)
    expect(passa('h1 { margin: 0; }', regra('h1', ['color']))).toBe(false)
  })

  it('aceita qualquer uma das propriedades da lista', () => {
    const fundo = regra('body', ['background-color', 'background'])
    expect(passa('body { background: pink; }', fundo)).toBe(true)
    expect(passa('body { background-color: pink; }', fundo)).toBe(true)
  })

  it('casa com um item de uma lista de seletores', () => {
    expect(passa('h1, h2 { color: purple; }', regra('h2', ['color']))).toBe(
      true,
    )
  })

  it('não diferencia maiúsculas nem espaços no seletor', () => {
    expect(
      passa('UL  >  LI { color: red; }', regra('ul > li', ['color'])),
    ).toBe(true)
    expect(passa('A:HOVER { color: red; }', regra('a:hover', ['color']))).toBe(
      true,
    )
  })

  it('declaração inválida não conta, como no navegador', () => {
    // faltou o ponto e vírgula: o navegador descarta as duas
    expect(
      passa('body { color: red background: blue }', regra('body', ['color'])),
    ).toBe(false)
    // nome da propriedade com letra trocada
    expect(passa('h1 { colr: red; }', regra('h1', ['color']))).toBe(false)
    // valor que não existe para a propriedade
    expect(passa('h1 { color: 12px; }', regra('h1', ['color']))).toBe(false)
  })

  it('confere o valor quando a conferência pede', () => {
    const flex = regra('form', ['display'], { valor: 'flex' })
    expect(passa('form { display: flex; }', flex)).toBe(true)
    expect(passa('form { display: FLEX; }', flex)).toBe(true)
    expect(passa('form { display: block; }', flex)).toBe(false)
  })

  it('com emMidia, a regra tem de estar dentro de um @media', () => {
    const noCelular = regra('h1', ['font-size'], { emMidia: true })
    expect(passa('h1 { font-size: 2rem; }', noCelular)).toBe(false)
    expect(
      passa('@media (max-width: 400px) { h1 { font-size: 2rem; } }', noCelular),
    ).toBe(true)
    // sem emMidia, a regra dentro do @media também vale
    expect(
      passa(
        '@media (max-width: 400px) { h1 { font-size: 2rem; } }',
        regra('h1', ['font-size']),
      ),
    ).toBe(true)
  })

  it('chave sem fechar no fim ainda vale, como no navegador', () => {
    expect(passa('ul { display: flex', regra('ul', ['display']))).toBe(true)
  })

  it('CSS quebrado ou vazio não derruba a conferência', () => {
    expect(() =>
      runCssChecks('}}} h1 {{ color: ; @media {', [regra('h1', ['color'])]),
    ).not.toThrow()
    expect(runCssChecks('', [regra('h1', ['color'])])).toEqual([
      { descricao: 'h1 color', ok: false },
    ])
  })

  it('devolve um resultado por item, na ordem, com a descrição', () => {
    const resultados = runCssChecks('h1 { color: red; }', [
      regra('h1', ['color']),
      regra('h2', ['color']),
    ])
    expect(resultados).toEqual([
      { descricao: 'h1 color', ok: true },
      { descricao: 'h2 color', ok: false },
    ])
  })
})
