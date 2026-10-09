import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'

import { concluirAula, salvarCodigo } from '@/lib/progresso/acoes'
import {
  atualizarProgresso,
  esquecerProgressoEmMemoria,
} from '@/lib/progresso/store'

import { MeuSite } from './meu-site'

describe('MeuSite', () => {
  beforeEach(() => {
    localStorage.clear()
    esquecerProgressoEmMemoria()
  })

  it('sem partes: convida para a primeira aula', () => {
    render(<MeuSite />)

    expect(screen.getByText('Seu site aparece aqui')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Ver as aulas' })).toHaveAttribute(
      'href',
      '/aulas',
    )
  })

  it('com aulas concluídas: mostra o site e as partes, com link para editar', () => {
    atualizarProgresso((p) =>
      concluirAula(
        salvarCodigo(p, 'seu-primeiro-html', '<h1>Olá, eu sou a Ana</h1>'),
        'seu-primeiro-html',
        '2026-10-09T20:00:00.000Z',
        '2026-10-09',
      ),
    )
    render(<MeuSite />)

    expect(screen.getByTitle('Seu site').getAttribute('srcdoc')).toBe(
      '<h1>Olá, eu sou a Ana</h1>',
    )
    expect(
      screen.getByRole('link', { name: 'Aula 1 · Seu primeiro HTML' }),
    ).toHaveAttribute('href', '/aulas/seu-primeiro-html')
  })
})
