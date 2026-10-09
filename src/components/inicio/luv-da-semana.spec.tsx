import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { LuvDaSemana } from './luv-da-semana'

describe('LuvDaSemana', () => {
  it('cumprimenta pelo nome, fala da semana e mostra os corações', () => {
    render(<LuvDaSemana nome="Ana" estudados={2} meta={3} />)

    expect(
      screen.getByRole('heading', { level: 1, name: 'Oi, Ana!' }),
    ).toBeInTheDocument()
    expect(
      screen.getByText(
        'A Luv guardou dois corações esta semana. Falta um para a sua meta.',
      ),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('img', { name: '2 de 3 corações' }),
    ).toBeInTheDocument()
  })

  it('sem nome, diz só "Oi!"; com zero dias, convida', () => {
    render(<LuvDaSemana estudados={0} meta={3} />)

    expect(
      screen.getByRole('heading', { level: 1, name: 'Oi!' }),
    ).toBeInTheDocument()
    expect(
      screen.getByText(/Que tal começar com uma aula\?/),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('img', { name: '0 de 3 corações' }),
    ).toBeInTheDocument()
  })

  it('passou da meta: os corações param na meta', () => {
    render(<LuvDaSemana nome="Ana" estudados={5} meta={3} />)
    expect(
      screen.getByRole('img', { name: '3 de 3 corações' }),
    ).toBeInTheDocument()
  })

  it('a ilustração é decorativa (o texto ao lado leva a informação)', () => {
    const { container } = render(
      <LuvDaSemana nome="Ana" estudados={1} meta={3} />,
    )
    const ilustracao = container.querySelector('img[src*="luv-notebook"]')
    expect(ilustracao).toHaveAttribute('alt', '')
  })
})
