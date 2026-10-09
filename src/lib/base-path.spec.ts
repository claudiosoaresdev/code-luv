import { describe, expect, it } from 'vitest'

import { comBase, paraIframe } from './base-path'

describe('base-path', () => {
  it('sem prefixo no desenvolvimento', () => {
    expect(comBase('/images/luv/ola.png')).toBe('/images/luv/ola.png')
  })

  it('o iframe ganha um <base> para os caminhos relativos', () => {
    expect(paraIframe('<h1>Oi</h1>')).toBe('<base href="/">\n<h1>Oi</h1>')
  })
})
