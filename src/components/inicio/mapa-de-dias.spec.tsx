import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { PROGRESSO_VAZIO } from '@/lib/progresso/modelo'
import { mapaDeDias } from '@/lib/progresso/painel'

import { MapaDeDias } from './mapa-de-dias'

const QUINTA = new Date(2026, 9, 8, 10)

describe('MapaDeDias', () => {
  it('mostra o total em texto e a legenda com os três níveis', () => {
    const p = {
      ...PROGRESSO_VAZIO,
      diasEstudados: ['2026-10-05', '2026-10-07'],
    }
    render(<MapaDeDias semanas={mapaDeDias(p, QUINTA)} total={2} />)

    expect(
      screen.getByRole('heading', { level: 3, name: 'Seus dias de estudo' }),
    ).toBeInTheDocument()
    expect(
      screen.getByText('2 dias estudados desde o começo.'),
    ).toBeInTheDocument()
    for (const nome of ['sem estudo', 'estudou', 'concluiu aula']) {
      expect(screen.getByText(nome)).toBeInTheDocument()
    }
  })

  it('a grade é escondida de leitores de tela (o resumo em texto basta)', () => {
    const { container } = render(
      <MapaDeDias semanas={mapaDeDias(PROGRESSO_VAZIO, QUINTA)} total={0} />,
    )
    expect(container.querySelector('[data-mapa]')).toHaveAttribute(
      'aria-hidden',
      'true',
    )
    expect(container.querySelectorAll('[data-mapa] [data-dia]')).toHaveLength(
      91,
    )
  })

  it('sem dias: explica quando o mapa começa a encher', () => {
    render(
      <MapaDeDias semanas={mapaDeDias(PROGRESSO_VAZIO, QUINTA)} total={0} />,
    )
    expect(
      screen.getByText(
        'Seus dias de estudo aparecem aqui quando você fizer a primeira aula.',
      ),
    ).toBeInTheDocument()
  })

  it('um dia: singular', () => {
    render(
      <MapaDeDias semanas={mapaDeDias(PROGRESSO_VAZIO, QUINTA)} total={1} />,
    )
    expect(
      screen.getByText('1 dia estudado desde o começo.'),
    ).toBeInTheDocument()
  })
})
