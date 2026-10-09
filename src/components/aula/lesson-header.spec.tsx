import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { LessonHeader } from './lesson-header'

describe('LessonHeader', () => {
  it('volta para a lista de aulas e diz em que aula a aluna está', () => {
    render(<LessonHeader ordem={1} modulo="HTML" />)

    expect(
      screen.getByRole('link', { name: 'Voltar para aulas' }),
    ).toHaveAttribute('href', '/aulas')
    expect(screen.getByRole('banner')).toHaveTextContent('Aula 1 · HTML')
  })

  it('diz o módulo da aula', () => {
    render(<LessonHeader ordem={3} modulo="CSS" />)
    expect(screen.getByRole('banner')).toHaveTextContent('Aula 3 · CSS')
  })

  it('sem a ordem (carregando), mostra só o link de voltar', () => {
    render(<LessonHeader />)

    expect(
      screen.getByRole('link', { name: 'Voltar para aulas' }),
    ).toBeInTheDocument()
    expect(screen.getByRole('banner')).not.toHaveTextContent('Aula')
  })
})
