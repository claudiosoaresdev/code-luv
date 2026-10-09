import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { PREVIEW_DELAY_MS, ResultPreview } from './result-preview'

describe('ResultPreview', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  const frame = () => screen.getByTitle('Resultado do seu código')

  it('mostra o código na janela "Meu site", isolado', () => {
    render(<ResultPreview html="<h1>Oi</h1>" />)

    expect(screen.getByRole('region', { name: 'Meu site' })).toContainElement(
      frame(),
    )
    expect(frame()).toHaveAttribute('srcdoc', '<h1>Oi</h1>')
    // sandbox vazio = sem scripts e sem acesso ao CodeLuv
    expect(frame()).toHaveAttribute('sandbox', '')
  })

  it('espera a aluna parar de digitar antes de atualizar', () => {
    const { rerender } = render(<ResultPreview html="<h1>Oi</h1>" />)

    rerender(<ResultPreview html="<h1>Olá</h1>" />)
    expect(frame()).toHaveAttribute('srcdoc', '<h1>Oi</h1>')

    act(() => {
      vi.advanceTimersByTime(PREVIEW_DELAY_MS)
    })
    expect(frame()).toHaveAttribute('srcdoc', '<h1>Olá</h1>')
  })

  it('uma segunda mudança dentro da janela reinicia a espera', () => {
    const { rerender } = render(<ResultPreview html="a" />)

    rerender(<ResultPreview html="b" />)
    act(() => {
      vi.advanceTimersByTime(300)
    })
    rerender(<ResultPreview html="c" />)
    act(() => {
      vi.advanceTimersByTime(300)
    })
    expect(frame()).toHaveAttribute('srcdoc', 'a')

    act(() => {
      vi.advanceTimersByTime(100)
    })
    expect(frame()).toHaveAttribute('srcdoc', 'c')
  })
})

describe('ResultPreview, celular e altura', () => {
  const frame = () => screen.getByTitle('Resultado do seu código')

  it('sem pedir, não oferece ver como celular', () => {
    render(<ResultPreview html="<h1>Oi</h1>" />)
    expect(
      screen.queryByRole('button', { name: 'Ver como celular' }),
    ).not.toBeInTheDocument()
  })

  it('"Ver como celular" estreita o resultado e volta', async () => {
    const user = userEvent.setup()
    render(<ResultPreview html="<h1>Oi</h1>" podeVerComoCelular />)
    const botao = screen.getByRole('button', { name: 'Ver como celular' })

    expect(botao).toHaveAttribute('aria-pressed', 'false')
    expect(frame()).toHaveClass('w-full')

    await user.click(botao)
    expect(botao).toHaveAttribute('aria-pressed', 'true')
    expect(frame()).toHaveClass('w-[360px]')
    expect(frame()).not.toHaveClass('w-full')

    await user.click(botao)
    expect(frame()).toHaveClass('w-full')
  })

  it('aceita uma altura própria', () => {
    render(<ResultPreview html="<h1>Oi</h1>" className="h-96" />)
    expect(frame()).toHaveClass('h-96')
    expect(frame()).not.toHaveClass('h-64')
  })
})
