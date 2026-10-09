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

  it('lê comentários HTML como "comentário"', () => {
    expect(paraFala('Isto <!-- nota --> é um comentário.')).toBe(
      'Isto comentário é um comentário.',
    )
  })

  it('lê o doctype', () => {
    expect(paraFala('Comece com <!DOCTYPE html> no topo.')).toBe(
      'Comece com doctype html no topo.',
    )
  })

  it('aceita espaços na tag de fechamento', () => {
    expect(paraFala('Feche com </p >.')).toBe('Feche com tag de fechamento p.')
  })

  it('descarta atributos e lê tags autofechadas', () => {
    expect(paraFala('<p class="x"> e <img src="a.png" /> e <br/> ok.')).toBe(
      'tag p e tag img e tag br ok.',
    )
  })

  it('não mexe em comparações como 5 < 6', () => {
    expect(paraFala('Veja que 5 < 6 é verdade.')).toBe(
      'Veja que 5 < 6 é verdade.',
    )
  })
})
