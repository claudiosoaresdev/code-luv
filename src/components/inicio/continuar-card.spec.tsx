import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { ContinuarCard } from './continuar-card'

const imagens = {
  slug: 'imagens',
  titulo: 'Imagens',
  ordem: 5,
  modulo: 'html' as const,
  duracaoMin: 15,
}

describe('ContinuarCard', () => {
  it('primeira aula: "Começar a aula", com módulo e duração', () => {
    render(<ContinuarCard proxima={imagens} />)

    expect(
      screen.getByRole('heading', { level: 2, name: 'Continuar: Imagens' }),
    ).toBeInTheDocument()
    expect(
      screen.getByText('Aula 5 de HTML · cerca de 15 minutos'),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: 'Começar a aula' }),
    ).toHaveAttribute('href', '/aulas/imagens')
  })

  it('depois de concluir uma: lembra a última e diz "Continuar"', () => {
    render(<ContinuarCard proxima={imagens} ultima={{ titulo: 'Links' }} />)

    expect(
      screen.getByText('Na última vez você concluiu “Links”.'),
    ).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Continuar' })).toHaveAttribute(
      'href',
      '/aulas/imagens',
    )
  })

  it('sem próxima: celebra e leva ao site', () => {
    render(<ContinuarCard ultima={{ titulo: 'Pequenos movimentos' }} />)

    expect(
      screen.getByText(/Você concluiu todas as aulas disponíveis por enquanto/),
    ).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Ver meu site' })).toHaveAttribute(
      'href',
      '/meu-site',
    )
  })
})
