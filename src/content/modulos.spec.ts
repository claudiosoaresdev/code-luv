import { describe, expect, it } from 'vitest'

import { getModulo, MODULOS } from './modulos'

describe('módulos', () => {
  it('HTML vem antes de CSS', () => {
    expect(MODULOS.map((m) => m.id)).toEqual(['html', 'css'])
  })

  it('encontra o módulo pelo id', () => {
    expect(getModulo('css').nome).toBe('CSS')
    expect(getModulo('html').titulo).toBe('HTML · Estrutura da web')
  })
})
