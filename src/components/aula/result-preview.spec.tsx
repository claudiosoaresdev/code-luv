import { act, render, screen } from '@testing-library/react'
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
})
