import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { VitrineConquistas } from './vitrine-conquistas'

describe('VitrineConquistas', () => {
  it('mostra as ganhas, as a ganhar e a próxima', () => {
    render(
      <VitrineConquistas
        selos={[
          { id: 'hello-world', titulo: 'Hello, World', ganha: true },
          { id: 'persistente', titulo: 'Persistente', ganha: false },
        ]}
        proxima={{
          titulo: 'Persistente',
          comoGanhar: 'Conclua uma aula depois de conferir três vezes ou mais.',
        }}
      />,
    )

    expect(screen.getByText('Hello, World, ganha')).toBeInTheDocument()
    expect(screen.getByText('Persistente, ainda não')).toBeInTheDocument()
    expect(screen.getByText(/Próxima:/)).toHaveTextContent(
      'Próxima: Persistente — Conclua uma aula depois de conferir três vezes ou mais.',
    )
    expect(
      screen.getByRole('link', { name: 'Ver conquistas' }),
    ).toHaveAttribute('href', '/conquistas')
  })

  it('com todas ganhas, não fala de próxima', () => {
    render(
      <VitrineConquistas
        selos={[{ id: 'hello-world', titulo: 'Hello, World', ganha: true }]}
      />,
    )
    expect(screen.queryByText(/Próxima:/)).not.toBeInTheDocument()
  })
})
