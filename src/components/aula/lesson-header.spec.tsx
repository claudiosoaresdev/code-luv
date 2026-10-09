import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { LessonHeader } from './lesson-header'

describe('LessonHeader', () => {
  it('volta para a lista de aulas e diz em que aula a aluna está', () => {
    render(<LessonHeader ordem={1} />)

    expect(
      screen.getByRole('link', { name: 'Voltar para aulas' }),
    ).toHaveAttribute('href', '/aulas')
    expect(screen.getByRole('banner')).toHaveTextContent('Aula 1 · HTML')
  })
})
