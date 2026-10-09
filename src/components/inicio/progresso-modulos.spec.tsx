import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { ProgressoModulos } from './progresso-modulos'

describe('ProgressoModulos', () => {
  it('um anel por módulo, com nome acessível, e JavaScript em breve', () => {
    render(
      <ProgressoModulos
        modulos={[
          { id: 'html', nome: 'HTML', concluidas: 4, total: 7 },
          { id: 'css', nome: 'CSS', concluidas: 0, total: 6 },
        ]}
      />,
    )

    expect(
      screen.getByRole('heading', { level: 3, name: 'Módulos' }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('img', { name: 'HTML: 4 de 7 aulas concluídas' }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('img', { name: 'CSS: 0 de 6 aulas concluídas' }),
    ).toBeInTheDocument()
    expect(screen.getByText('JavaScript')).toBeInTheDocument()
    expect(screen.getByText('em breve')).toBeInTheDocument()
  })
})
