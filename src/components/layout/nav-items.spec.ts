import { describe, expect, it } from 'vitest'

import { isActive, NAV_ITEMS } from './nav-items'

describe('NAV_ITEMS', () => {
  it('tem os quatro destinos principais, nesta ordem (DS 5.3)', () => {
    expect(NAV_ITEMS.map((item) => item.label)).toEqual([
      'Início',
      'Aulas',
      'Meu site',
      'Conquistas',
    ])
    expect(NAV_ITEMS.map((item) => item.href)).toEqual([
      '/',
      '/aulas',
      '/meu-site',
      '/conquistas',
    ])
  })
})

describe('isActive', () => {
  it('Início só fica ativo na raiz', () => {
    expect(isActive('/', '/')).toBe(true)
    expect(isActive('/aulas', '/')).toBe(false)
  })

  it('ativa o destino e as páginas dentro dele', () => {
    expect(isActive('/aulas', '/aulas')).toBe(true)
    expect(isActive('/aulas/seu-primeiro-html', '/aulas')).toBe(true)
  })

  it('não confunde destinos com prefixo parecido', () => {
    expect(isActive('/aulas-extras', '/aulas')).toBe(false)
  })
})
