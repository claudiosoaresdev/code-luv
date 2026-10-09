import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { EmptyState } from './empty-state'

describe('EmptyState', () => {
  it('mostra título e descrição', () => {
    render(
      <EmptyState
        title="Seu site aparece aqui"
        description="Cada parte que você criar vem morar nesta página."
      />,
    )

    expect(screen.getByText('Seu site aparece aqui')).toBeInTheDocument()
    expect(
      screen.getByText('Cada parte que você criar vem morar nesta página.'),
    ).toBeInTheDocument()
  })

  it('mostra a ação como link', () => {
    render(
      <EmptyState
        title="Nada por aqui"
        description="Ainda."
        action={{ label: 'Ver as aulas', href: '/aulas' }}
      />,
    )

    expect(screen.getByRole('link', { name: 'Ver as aulas' })).toHaveAttribute(
      'href',
      '/aulas',
    )
  })

  it('não mostra ação quando não há', () => {
    render(<EmptyState title="Nada por aqui" description="Ainda." />)

    expect(screen.queryByRole('link')).not.toBeInTheDocument()
  })
})
