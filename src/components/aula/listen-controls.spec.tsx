import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { ListenControls } from './listen-controls'
import type { EstadoEscuta } from './use-escuta'

function montar(estado: EstadoEscuta, atual = 0) {
  const acoes = {
    onOuvir: vi.fn(),
    onPausar: vi.fn(),
    onContinuar: vi.fn(),
    onAnterior: vi.fn(),
    onProximo: vi.fn(),
    onRepetir: vi.fn(),
    onVelocidade: vi.fn(),
  }
  render(
    <ListenControls
      estado={estado}
      atual={atual}
      total={12}
      velocidade={1}
      {...acoes}
    />,
  )
  return acoes
}

describe('ListenControls', () => {
  it('parado: oferece ouvir e desliga a navegação entre trechos', async () => {
    const user = userEvent.setup()
    const acoes = montar('parado')

    await user.click(screen.getByRole('button', { name: 'Ouvir explicação' }))
    expect(acoes.onOuvir).toHaveBeenCalled()
    expect(
      screen.getByRole('button', { name: 'Próximo trecho' }),
    ).toHaveAttribute('aria-disabled', 'true')
    expect(screen.queryByText(/Trecho/)).not.toBeInTheDocument()
  })

  it('tocando: oferece pausar e mostra em que trecho está', async () => {
    const user = userEvent.setup()
    const acoes = montar('tocando', 2)

    expect(screen.getByText('Trecho 3 de 12')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Pausar' }))
    expect(acoes.onPausar).toHaveBeenCalled()
    await user.click(screen.getByRole('button', { name: 'Repetir trecho' }))
    expect(acoes.onRepetir).toHaveBeenCalled()
  })

  it('pausado: oferece continuar', async () => {
    const user = userEvent.setup()
    const acoes = montar('pausado')

    await user.click(screen.getByRole('button', { name: 'Continuar' }))
    expect(acoes.onContinuar).toHaveBeenCalled()
  })

  it('fim: oferece ouvir de novo', async () => {
    const user = userEvent.setup()
    const acoes = montar('fim')

    await user.click(screen.getByRole('button', { name: 'Ouvir de novo' }))
    expect(acoes.onOuvir).toHaveBeenCalled()
  })

  it('indisponível: explica e não deixa ouvir', () => {
    montar('indisponivel')

    expect(
      screen.getByText(
        'A voz não está disponível neste aparelho. O texto está todo aqui.',
      ),
    ).toBeInTheDocument()
    const botao = screen.getByRole('button', { name: 'Ouvir explicação' })
    expect(botao).toHaveAttribute('aria-disabled', 'true')
    expect(botao).toHaveAccessibleDescription(
      'A voz não está disponível neste aparelho. O texto está todo aqui.',
    )
  })

  it('carregando: o botão principal fica desligado', () => {
    montar('carregando')
    expect(
      screen.getByRole('button', { name: 'Ouvir explicação' }),
    ).toHaveAttribute('aria-disabled', 'true')
  })

  it('setas são ignoradas quando parado', () => {
    const acoes = montar('parado')
    const grupo = screen.getByRole('group', { name: 'Controle da escuta' })

    fireEvent.keyDown(grupo, { key: 'ArrowLeft' })
    fireEvent.keyDown(grupo, { key: 'ArrowRight' })
    expect(acoes.onAnterior).not.toHaveBeenCalled()
    expect(acoes.onProximo).not.toHaveBeenCalled()
  })

  it('desliga o próximo no último trecho e o anterior no primeiro', () => {
    montar('tocando', 11)
    expect(
      screen.getByRole('button', { name: 'Próximo trecho' }),
    ).toHaveAttribute('aria-disabled', 'true')
    expect(
      screen.getByRole('button', { name: 'Trecho anterior' }),
    ).not.toHaveAttribute('aria-disabled', 'true')
  })

  it('desliga o anterior no primeiro trecho', () => {
    montar('tocando', 0)
    expect(
      screen.getByRole('button', { name: 'Trecho anterior' }),
    ).toHaveAttribute('aria-disabled', 'true')
  })

  it('setas do teclado voltam e pulam trechos durante a escuta', () => {
    const acoes = montar('tocando', 1)
    const grupo = screen.getByRole('group', { name: 'Controle da escuta' })

    fireEvent.keyDown(grupo, { key: 'ArrowLeft' })
    fireEvent.keyDown(grupo, { key: 'ArrowRight' })
    expect(acoes.onAnterior).toHaveBeenCalledTimes(1)
    expect(acoes.onProximo).toHaveBeenCalledTimes(1)
  })

  it('escolhe a velocidade', async () => {
    const user = userEvent.setup()
    const acoes = montar('parado')

    expect(
      screen.getByRole('button', { name: 'Velocidade 1×' }),
    ).toHaveAttribute('aria-pressed', 'true')
    await user.click(screen.getByRole('button', { name: 'Velocidade 1,25×' }))
    expect(acoes.onVelocidade).toHaveBeenCalledWith(1.25)
  })
})
