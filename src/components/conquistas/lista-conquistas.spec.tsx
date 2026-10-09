import { render, screen, within } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'

import {
  atualizarProgresso,
  esquecerProgressoEmMemoria,
} from '@/lib/progresso/store'

import { ListaConquistas } from './lista-conquistas'

describe('ListaConquistas', () => {
  beforeEach(() => {
    localStorage.clear()
    esquecerProgressoEmMemoria()
  })

  it('mostra as ganhas com a data e as que faltam com como ganhar', () => {
    atualizarProgresso((p) => ({
      ...p,
      conquistas: { 'hello-world': { em: '2026-10-09T15:00:00.000Z' } },
    }))
    render(<ListaConquistas />)

    expect(screen.getByText('1 de 2 conquistas')).toBeInTheDocument()

    const [hello, persistente] = screen.getAllByRole('listitem')
    expect(within(hello).getByText('Hello, World')).toBeInTheDocument()
    expect(within(hello).getByText(/Ganha em 9 de outubro/)).toBeInTheDocument()
    expect(within(persistente).getByText(/Como ganhar:/)).toBeInTheDocument()
  })
})
