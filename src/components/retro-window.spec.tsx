import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { RetroWindow } from './retro-window'

describe('RetroWindow', () => {
  it('é uma região nomeada pelo título', () => {
    render(
      <RetroWindow title="Meu site">
        <p>Olá, eu sou a Ana</p>
      </RetroWindow>,
    )

    const region = screen.getByRole('region', { name: 'Meu site' })
    expect(region).toHaveTextContent('Olá, eu sou a Ana')
  })

  it('tem bolinhas apenas decorativas, fora do foco', () => {
    const { container } = render(
      <RetroWindow title="Meu site">conteúdo</RetroWindow>,
    )

    const dots = container.querySelectorAll('[data-slot="retro-window-dot"]')
    expect(dots).toHaveLength(3)
    for (const dot of dots) {
      expect(dot).toHaveAttribute('aria-hidden', 'true')
      expect(dot).not.toHaveAttribute('tabindex')
    }
  })
})
