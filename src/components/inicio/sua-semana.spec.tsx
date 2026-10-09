import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { PROGRESSO_VAZIO } from '@/lib/progresso/modelo'
import { diasDaSemana } from '@/lib/progresso/painel'

import { SuaSemana } from './sua-semana'

const QUINTA = new Date(2026, 9, 8, 10)

describe('SuaSemana', () => {
  it('lista os sete dias com o nome completo e o que aconteceu', () => {
    const dias = diasDaSemana(
      { ...PROGRESSO_VAZIO, diasEstudados: ['2026-10-05', '2026-10-07'] },
      QUINTA,
    )
    render(<SuaSemana dias={dias} meta={3} />)

    const semana = screen.getByRole('region', { name: 'Sua semana' })
    const itens = within(semana).getAllByRole('listitem')
    expect(itens).toHaveLength(7)
    expect(itens[0]).toHaveTextContent('segunda-feira, estudou')
    expect(itens[1]).toHaveTextContent('terça-feira')
    expect(itens[1]).not.toHaveTextContent('estudou')
    expect(itens[3]).toHaveTextContent('quinta-feira, hoje')
    expect(
      screen.getByText(
        'Você estudou em 2 dias desta semana. Meta: 3 dias por semana.',
      ),
    ).toBeInTheDocument()
  })

  it('semana vazia não cobra nada', () => {
    render(<SuaSemana dias={diasDaSemana(PROGRESSO_VAZIO, QUINTA)} meta={3} />)
    expect(
      screen.getByText(
        'Nenhum dia ainda nesta semana. Meta: 3 dias por semana.',
      ),
    ).toBeInTheDocument()
  })
})
