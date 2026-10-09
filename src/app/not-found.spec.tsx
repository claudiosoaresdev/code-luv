import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import NotFound from './not-found'

describe('NotFound', () => {
  it('explica em português e leva de volta às aulas ou ao início', () => {
    render(<NotFound />)

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: 'Não encontramos esta página',
      }),
    ).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Ver as aulas' })).toHaveAttribute(
      'href',
      '/aulas',
    )
    expect(
      screen.getByRole('link', { name: 'Ir para o início' }),
    ).toHaveAttribute('href', '/')
  })
})
