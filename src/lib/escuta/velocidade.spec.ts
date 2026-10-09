import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import {
  assinarVelocidade,
  lerVelocidade,
  salvarVelocidade,
} from './velocidade'

describe('velocidade', () => {
  beforeEach(() => localStorage.clear())
  afterEach(() => vi.restoreAllMocks())

  it('começa em 1×', () => {
    expect(lerVelocidade()).toBe(1)
  })

  it('lembra a velocidade salva', () => {
    salvarVelocidade(1.25)
    expect(lerVelocidade()).toBe(1.25)
  })

  it('ignora valor estranho guardado', () => {
    localStorage.setItem('codeluv:velocidade', '7')
    expect(lerVelocidade()).toBe(1)
  })

  it('segue funcionando sem armazenamento (navegação privada, cota cheia)', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('bloqueado')
    })
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('bloqueado')
    })

    expect(() => salvarVelocidade(1.5)).not.toThrow()
    expect(lerVelocidade()).toBe(1)
  })

  it('avisa quem assinou quando a velocidade muda', () => {
    const aviso = vi.fn()
    const cancelar = assinarVelocidade(aviso)

    salvarVelocidade(0.75)
    expect(aviso).toHaveBeenCalledTimes(1)

    cancelar()
    salvarVelocidade(1)
    expect(aviso).toHaveBeenCalledTimes(1)
  })
})
