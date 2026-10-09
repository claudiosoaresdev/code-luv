import { describe, expect, it } from 'vitest'

import { LUV_STATES, luvImage } from './luv-states'

describe('luv-states', () => {
  it('tem os oito estados do design system', () => {
    expect(LUV_STATES).toEqual([
      'ola',
      'aprender',
      'praticar',
      'pista',
      'incentivo',
      'comemorar',
      'descansar',
      'evoluir',
    ])
  })

  it('usa a arte própria quando existe', () => {
    expect(luvImage('ola')).toBe('/images/luv/ola.png')
  })

  it('usa a arte de boas-vindas para estados sem arte própria', () => {
    expect(luvImage('descansar')).toBe('/images/luv/ola.png')
  })

  it('devolve um caminho para todos os estados', () => {
    for (const state of LUV_STATES) {
      expect(luvImage(state)).toMatch(/^\/images\/luv\/.+\.png$/)
    }
  })
})
