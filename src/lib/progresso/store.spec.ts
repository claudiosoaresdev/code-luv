import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { definirMeta } from './acoes'
import { metaDe, PROGRESSO_VAZIO } from './modelo'
import {
  apagarProgresso,
  assinarProgresso,
  atualizarProgresso,
  esquecerProgressoEmMemoria,
  exportarProgresso,
  importarProgresso,
  obterEstado,
} from './store'

describe('store do progresso', () => {
  beforeEach(() => {
    localStorage.clear()
    esquecerProgressoEmMemoria()
  })
  afterEach(() => vi.restoreAllMocks())

  it('começa vazio e sem perda', () => {
    expect(obterEstado()).toEqual({
      progresso: PROGRESSO_VAZIO,
      perdido: false,
    })
  })

  it('grava, lê de volta e devolve o mesmo objeto enquanto nada muda', () => {
    atualizarProgresso((p) => ({ ...p, nome: 'Ana' }))

    const primeiro = obterEstado()
    expect(primeiro.progresso.nome).toBe('Ana')
    expect(JSON.parse(localStorage.getItem('codeluv:progresso')!).nome).toBe(
      'Ana',
    )
    // useSyncExternalStore exige o mesmo objeto se nada mudou.
    expect(obterEstado()).toBe(primeiro)
  })

  it('progresso corrompido vira vazio, marcado como perdido', () => {
    localStorage.setItem('codeluv:progresso', '{isto não é json')
    expect(obterEstado()).toEqual({ progresso: PROGRESSO_VAZIO, perdido: true })

    atualizarProgresso((p) => ({ ...p, nome: 'Ana' }))
    expect(obterEstado().perdido).toBe(false)
  })

  it('sem armazenamento, segue em memória', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('bloqueado')
    })
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('bloqueado')
    })

    expect(() =>
      atualizarProgresso((p) => ({ ...p, nome: 'Ana' })),
    ).not.toThrow()
    expect(obterEstado().progresso.nome).toBe('Ana')
  })

  it('exporta e importa uma cópia; recusa arquivo que não é cópia', () => {
    atualizarProgresso((p) => ({ ...p, nome: 'Ana' }))
    const copia = exportarProgresso()

    apagarProgresso()
    expect(obterEstado().progresso).toEqual(PROGRESSO_VAZIO)

    expect(importarProgresso('{"qualquer": true}')).toBe(false)
    expect(importarProgresso('não é json')).toBe(false)
    expect(importarProgresso(copia)).toBe(true)
    expect(obterEstado().progresso.nome).toBe('Ana')
  })

  it('avisa quem assinou a cada mudança', () => {
    const aviso = vi.fn()
    const cancelar = assinarProgresso(aviso)

    atualizarProgresso((p) => ({ ...p, nome: 'Ana' }))
    apagarProgresso()
    expect(aviso).toHaveBeenCalledTimes(2)

    cancelar()
    atualizarProgresso((p) => ({ ...p, nome: 'Bia' }))
    expect(aviso).toHaveBeenCalledTimes(2)
  })

  it('guarda uma cópia do que não deu para ler antes de sobrescrever', () => {
    localStorage.setItem('codeluv:progresso', '{isto não é json')
    atualizarProgresso((p) => ({ ...p, nome: 'Ana' }))
    expect(localStorage.getItem('codeluv:progresso:recuperacao')).toBe(
      '{isto não é json',
    )

    localStorage.setItem('codeluv:progresso', '{outro lixo')
    esquecerProgressoEmMemoria()
    atualizarProgresso((p) => ({ ...p, nome: 'Bia' }))
    expect(localStorage.getItem('codeluv:progresso:recuperacao')).toBe(
      '{isto não é json',
    )
  })

  it('guarda cópia também de uma versão futura', () => {
    const futuro = JSON.stringify({ versao: 2, aulas: {} })
    localStorage.setItem('codeluv:progresso', futuro)
    atualizarProgresso((p) => ({ ...p, nome: 'Ana' }))
    expect(localStorage.getItem('codeluv:progresso:recuperacao')).toBe(futuro)
  })

  it('acompanha mudanças feitas em outra aba', () => {
    const aviso = vi.fn()
    const cancelar = assinarProgresso(aviso)
    atualizarProgresso((p) => ({ ...p, nome: 'Ana' }))
    aviso.mockClear()

    localStorage.setItem(
      'codeluv:progresso',
      JSON.stringify({ ...obterEstado().progresso, nome: 'Bia' }),
    )
    window.dispatchEvent(
      new StorageEvent('storage', { key: 'codeluv:progresso' }),
    )

    expect(aviso).toHaveBeenCalledTimes(1)
    expect(obterEstado().progresso.nome).toBe('Bia')
    cancelar()
  })

  it('o snapshot é estável no caminho corrompido e sem armazenamento', () => {
    localStorage.setItem('codeluv:progresso', '{quebrado')
    expect(obterEstado()).toBe(obterEstado())

    esquecerProgressoEmMemoria()
    localStorage.clear()
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('bloqueado')
    })
    expect(obterEstado()).toBe(obterEstado())
  })

  it('importar sobrescreve o progresso existente', () => {
    atualizarProgresso((p) => ({ ...p, nome: 'Ana' }))
    const copia = JSON.stringify({ ...PROGRESSO_VAZIO, nome: 'Bia' })
    expect(importarProgresso(copia)).toBe(true)
    expect(obterEstado().progresso.nome).toBe('Bia')
  })

  it('apagar também remove a cópia do que não deu para ler', () => {
    localStorage.setItem('codeluv:progresso', '{isto não é json')
    atualizarProgresso((p) => ({ ...p, nome: 'Ana' }))
    expect(localStorage.getItem('codeluv:progresso:recuperacao')).not.toBeNull()

    apagarProgresso()

    expect(localStorage.getItem('codeluv:progresso:recuperacao')).toBeNull()
  })

  it('importar uma cópia reconhece as conquistas já merecidas', () => {
    const copia = JSON.stringify({
      ...PROGRESSO_VAZIO,
      aulas: {
        a: { conferencias: 1, concluidaEm: '2026-10-09T20:00:00.000Z' },
      },
    })
    expect(importarProgresso(copia)).toBe(true)
    expect(obterEstado().progresso.conquistas['hello-world']).toBeDefined()
  })

  it('apagar também remove a chave antiga da velocidade', () => {
    localStorage.setItem('codeluv:velocidade', '1.25')
    apagarProgresso()
    expect(localStorage.getItem('codeluv:velocidade')).toBeNull()
  })

  it('a meta da semana vai e volta na cópia do progresso', () => {
    atualizarProgresso((p) => definirMeta(p, 5))
    const copia = exportarProgresso()

    apagarProgresso()
    expect(metaDe(obterEstado().progresso)).toBe(3)

    importarProgresso(copia)
    expect(obterEstado().progresso.metaSemanal).toBe(5)
  })
})
