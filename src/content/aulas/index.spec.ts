import { describe, expect, it } from 'vitest'

import { runChecks } from '@/lib/checks/run-checks'

import { EXPLICACOES } from './explicacoes'
import { AULAS, getAula, proximaAula } from './index'

describe('registro de aulas', () => {
  it('tem as aulas em ordem, começando em 1, sem buracos', () => {
    expect(AULAS.map((a) => a.ordem)).toEqual(AULAS.map((_, i) => i + 1))
  })

  it('não repete slugs', () => {
    const slugs = AULAS.map((a) => a.slug)
    expect(new Set(slugs).size).toBe(slugs.length)
  })

  it('toda aula tem explicação, e toda explicação tem aula', () => {
    expect(Object.keys(EXPLICACOES).sort()).toEqual(
      AULAS.map((a) => a.slug).sort(),
    )
  })

  it('encontra uma aula pelo slug', () => {
    expect(getAula('seu-primeiro-html')?.titulo).toBe('Seu primeiro HTML')
    expect(getAula('nao-existe')).toBeUndefined()
  })

  it('não tem próxima aula depois da última, nem para slug desconhecido', () => {
    expect(proximaAula(AULAS[AULAS.length - 1].slug)).toBeUndefined()
    expect(proximaAula('nao-existe')).toBeUndefined()
  })

  describe.each(AULAS)('aula $ordem — $titulo', (aula) => {
    it('a solução passa em toda a conferência', () => {
      const resultados = runChecks(
        aula.pratica.solucao,
        aula.pratica.conferencia,
      )
      expect(resultados.filter((r) => !r.ok)).toEqual([])
    })

    it('o código inicial ainda não passa (a aula tem o que ensinar)', () => {
      const resultados = runChecks(
        aula.pratica.inicial,
        aula.pratica.conferencia,
      )
      expect(resultados.some((r) => !r.ok)).toBe(true)
    })

    it('tem pelo menos uma pista e nenhuma descrição repetida', () => {
      expect(aula.pratica.pistas.length).toBeGreaterThan(0)
      const descricoes = aula.pratica.conferencia.map((c) => c.descricao)
      expect(new Set(descricoes).size).toBe(descricoes.length)
    })
  })
})
