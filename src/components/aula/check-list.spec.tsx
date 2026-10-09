import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { CheckList } from './check-list'

const ITENS = ['Existe um título <h1>', 'Existem pelo menos 2 parágrafos <p>']

describe('CheckList', () => {
  it('antes de conferir, mostra só os critérios', () => {
    render(<CheckList itens={ITENS} resultados={null} />)

    expect(screen.getAllByRole('listitem')).toHaveLength(2)
    expect(screen.queryByText(/certo!/)).not.toBeInTheDocument()
    expect(screen.queryByText(/ainda não/)).not.toBeInTheDocument()
  })

  it('depois de conferir, diz em texto o que está certo e o que ainda não está', () => {
    render(
      <CheckList
        itens={ITENS}
        resultados={[
          { descricao: ITENS[0], ok: true },
          { descricao: ITENS[1], ok: false },
        ]}
      />,
    )

    const [titulo, paragrafos] = screen.getAllByRole('listitem')
    expect(titulo).toHaveTextContent('Existe um título <h1> — certo!')
    expect(paragrafos).toHaveTextContent(
      'Existem pelo menos 2 parágrafos <p> — ainda não',
    )
  })

  it('tem nome acessível', () => {
    render(<CheckList itens={ITENS} resultados={null} />)

    expect(
      screen.getByRole('list', { name: 'Conferência' }),
    ).toBeInTheDocument()
  })
})
