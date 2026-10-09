import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { LuvSays } from './luv-says'

describe('LuvSays', () => {
  it('mostra a fala numa região de status', () => {
    render(<LuvSays>Bora pra primeira aula?</LuvSays>)

    expect(screen.getByRole('status')).toHaveTextContent(
      'Bora pra primeira aula?',
    )
  })

  it('na versão herói, mostra a ilustração decorativa e a fala', () => {
    const { container } = render(<LuvSays hero>Vou estudar com você!</LuvSays>)

    expect(screen.getByRole('status')).toHaveTextContent(
      'Vou estudar com você!',
    )
    expect(container.querySelector('img')).toHaveAttribute('alt', '')
  })

  it('esconde o nome "Luv" do avatar dos leitores de tela', () => {
    render(<LuvSays>Oi!</LuvSays>)

    // No jsdom a imagem nunca carrega, então o fallback fica visível.
    expect(screen.getByText('Luv')).toHaveAttribute('aria-hidden', 'true')
  })

  it('não cria região de status quando announce é false', () => {
    render(<LuvSays announce={false}>Quase!</LuvSays>)

    expect(screen.queryByRole('status')).not.toBeInTheDocument()
    expect(screen.getByText('Quase!')).toBeInTheDocument()
  })

  it('na versão herói, também respeita announce false', () => {
    render(
      <LuvSays hero announce={false}>
        Oi
      </LuvSays>,
    )

    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  })
})
