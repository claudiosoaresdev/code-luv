import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'

import { concluirAula } from '@/lib/progresso/acoes'
import {
  atualizarProgresso,
  esquecerProgressoEmMemoria,
} from '@/lib/progresso/store'

import { EstadoAula } from './estado-aula'

describe('EstadoAula', () => {
  beforeEach(() => {
    localStorage.clear()
    esquecerProgressoEmMemoria()
  })

  it('não mostra nada para aula não concluída', () => {
    const { container } = render(<EstadoAula slug="seu-primeiro-html" />)
    expect(container).toBeEmptyDOMElement()
  })

  it('mostra "Concluída" para aula concluída', () => {
    atualizarProgresso((p) =>
      concluirAula(
        p,
        'seu-primeiro-html',
        '2026-10-09T20:00:00.000Z',
        '2026-10-09',
      ),
    )
    render(<EstadoAula slug="seu-primeiro-html" />)
    expect(screen.getByText('Concluída')).toBeInTheDocument()
  })
})
