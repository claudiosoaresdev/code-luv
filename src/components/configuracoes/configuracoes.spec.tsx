import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { definirNome } from '@/lib/progresso/acoes'
import {
  atualizarProgresso,
  esquecerProgressoEmMemoria,
  obterEstado,
} from '@/lib/progresso/store'

import { Configuracoes } from './configuracoes'

const { add } = vi.hoisted(() => ({ add: vi.fn() }))
vi.mock('@/components/ui/toast', () => ({ toast: { add } }))

describe('Configuracoes', () => {
  beforeEach(() => {
    localStorage.clear()
    esquecerProgressoEmMemoria()
    add.mockClear()
  })

  it('muda o nome', async () => {
    const user = userEvent.setup()
    atualizarProgresso((p) => definirNome(p, 'Ana'))
    render(<Configuracoes />)

    const campo = screen.getByLabelText(
      'Como você quer ser chamada? (opcional)',
    )
    expect(campo).toHaveValue('Ana')
    await user.clear(campo)
    await user.type(campo, 'Bia')
    await user.click(screen.getByRole('button', { name: 'Salvar nome' }))

    expect(obterEstado().progresso.nome).toBe('Bia')
  })

  it('recusa um arquivo que não é cópia, sem perder nada', async () => {
    const user = userEvent.setup()
    atualizarProgresso((p) => definirNome(p, 'Ana'))
    render(<Configuracoes />)

    await user.upload(
      screen.getByLabelText('Recuperar de uma cópia'),
      new File(['oi'], 'qualquer.json', { type: 'application/json' }),
    )

    expect(
      await screen.findByText('Esse arquivo não parece uma cópia do CodeLuv.'),
    ).toBeInTheDocument()
    expect(obterEstado().progresso.nome).toBe('Ana')
  })

  it('apagar pede confirmação, começa no Cancelar e apaga tudo ao confirmar', async () => {
    const user = userEvent.setup()
    atualizarProgresso((p) => definirNome(p, 'Ana'))
    render(<Configuracoes />)

    await user.click(
      screen.getByRole('button', { name: 'Apagar meu progresso' }),
    )
    const dialogo = await screen.findByRole('alertdialog', {
      name: 'Apagar todo o progresso?',
    })
    expect(screen.getByRole('button', { name: 'Cancelar' })).toHaveFocus()

    await user.click(
      screen.getAllByRole('button', { name: 'Apagar meu progresso' }).at(-1)!,
    )

    expect(obterEstado().progresso.nome).toBeUndefined()
    expect(dialogo).not.toBeInTheDocument()
  })
})
