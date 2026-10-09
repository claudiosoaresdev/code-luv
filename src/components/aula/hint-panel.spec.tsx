import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'

import { HintPanel } from './hint-panel'

const PISTAS = ['Olhe o título.', 'Feche a tag com </h1>.']
const SOLUCAO = '<h1>Olá</h1>'

describe('HintPanel', () => {
  it('começa sem pista aberta, oferecendo a primeira', () => {
    render(<HintPanel pistas={PISTAS} solucao={SOLUCAO} />)

    expect(
      screen.getByRole('button', { name: 'Ver pista' }),
    ).toBeInTheDocument()
    expect(screen.queryByText('Pista 1 de 2')).not.toBeInTheDocument()
  })

  it('anuncia a pista com educação (status, não alerta)', async () => {
    const user = userEvent.setup()
    render(<HintPanel pistas={PISTAS} solucao={SOLUCAO} />)

    await user.click(screen.getByRole('button', { name: 'Ver pista' }))

    expect(screen.getByRole('status')).toHaveTextContent('Pista 1 de 2')
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('abre as pistas uma de cada vez, e só então oferece a solução', async () => {
    const user = userEvent.setup()
    render(<HintPanel pistas={PISTAS} solucao={SOLUCAO} />)

    await user.click(screen.getByRole('button', { name: 'Ver pista' }))
    expect(screen.getByText('Pista 1 de 2')).toBeInTheDocument()
    expect(screen.getByText('Olhe o título.')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Ver próxima pista' }))
    expect(screen.getByText('Pista 2 de 2')).toBeInTheDocument()
    expect(screen.getByText('Feche a tag com </h1>.')).toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: 'Ver próxima pista' }),
    ).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Ver solução' }))
    expect(screen.getByText(SOLUCAO)).toBeInTheDocument()
    expect(
      screen.getByText('Uma solução possível').closest('[tabindex="-1"]'),
    ).toHaveFocus()
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })
})
