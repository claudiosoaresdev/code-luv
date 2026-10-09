import { describe, expect, it } from 'vitest'

import { contrastRatio } from './contrast'

describe('contrastRatio', () => {
  it('é 21 entre preto e branco', () => {
    expect(contrastRatio('#000000', '#ffffff')).toBeCloseTo(21, 1)
  })

  it('é 1 entre cores iguais', () => {
    expect(contrastRatio('#ff4ab3', '#ff4ab3')).toBeCloseTo(1, 5)
  })

  it('não depende da ordem', () => {
    expect(contrastRatio('#101017', '#f6e8d8')).toBeCloseTo(
      contrastRatio('#f6e8d8', '#101017'),
      5,
    )
  })

  it('bate com o valor do design system (rosa sobre escuro ≈ 6.21)', () => {
    expect(contrastRatio('#ff4ab3', '#101017')).toBeCloseTo(6.21, 2)
  })

  it('aceita maiúsculas', () => {
    expect(contrastRatio('#FF4AB3', '#101017')).toBeCloseTo(6.21, 2)
  })

  it('rejeita cor fora do formato #rrggbb', () => {
    expect(() => contrastRatio('pink', '#101017')).toThrow('Cor inválida: pink')
  })
})
