import { describe, expect, it } from 'vitest'

import { paraFala } from './fala'

describe('paraFala', () => {
  it('não mexe em frase sem código', () => {
    expect(paraFala('O navegador lê esse texto.')).toBe(
      'O navegador lê esse texto.',
    )
  })

  it('lê tags de abertura como "tag"', () => {
    expect(paraFala('A tag <h1> diz que é um título.')).toBe(
      'A tag tag h1 diz que é um título.',
    )
  })

  it('lê tags de fechamento como "tag de fechamento"', () => {
    expect(paraFala('<p> abre, e </p> fecha.')).toBe(
      'tag p abre, e tag de fechamento p fecha.',
    )
  })

  it('não deixa espaço antes de pontuação nem espaços duplos', () => {
    expect(paraFala('Repare em </h1> .')).toBe(
      'Repare em tag de fechamento h1.',
    )
  })
})
