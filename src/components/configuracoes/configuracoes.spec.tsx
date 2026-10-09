import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { definirNome } from '@/lib/progresso/acoes'
import {
  atualizarProgresso,
  esquecerProgressoEmMemoria,
  exportarProgresso,
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
    expect(screen.getByRole('button', { name: 'Salvar nome' })).toHaveFocus()
    expect(add).toHaveBeenCalledWith({ title: 'Nome salvo' })
  })

  it('avisa quando o nome é removido', async () => {
    const user = userEvent.setup()
    atualizarProgresso((p) => definirNome(p, 'Ana'))
    render(<Configuracoes />)

    await user.clear(
      screen.getByLabelText('Como você quer ser chamada? (opcional)'),
    )
    await user.click(screen.getByRole('button', { name: 'Salvar nome' }))

    expect(add).toHaveBeenCalledWith({ title: 'Nome removido' })
  })

  it('recupera de uma cópia e dá para desfazer', async () => {
    const user = userEvent.setup()
    atualizarProgresso((p) => definirNome(p, 'Ana'))
    const copia = JSON.stringify({
      ...JSON.parse(exportarProgresso()),
      nome: 'Bia',
    })
    render(<Configuracoes />)

    await user.upload(
      screen.getByLabelText('Recuperar de uma cópia'),
      new File([copia], 'copia.json', { type: 'application/json' }),
    )

    await vi.waitFor(() => expect(obterEstado().progresso.nome).toBe('Bia'))
    const aviso = add.mock.calls.at(-1)![0]
    expect(aviso.title).toBe('Progresso recuperado')
    act(() => aviso.actionProps.onClick())
    expect(obterEstado().progresso.nome).toBe('Ana')
  })

  it('recusa um arquivo grande demais', async () => {
    const user = userEvent.setup()
    render(<Configuracoes />)

    await user.upload(
      screen.getByLabelText('Recuperar de uma cópia'),
      new File(['x'.repeat(1_000_001)], 'grande.json', {
        type: 'application/json',
      }),
    )

    expect(
      await screen.findByText(
        'Esse arquivo é grande demais para ser uma cópia do CodeLuv.',
      ),
    ).toBeInTheDocument()
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
