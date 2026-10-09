import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { concluirAula, definirNome } from '@/lib/progresso/acoes'
import {
  atualizarProgresso,
  esquecerProgressoEmMemoria,
  obterEstado,
} from '@/lib/progresso/store'

import { Inicio } from './inicio'

const { push } = vi.hoisted(() => ({ push: vi.fn() }))
vi.mock('next/navigation', () => ({ useRouter: () => ({ push }) }))

describe('Inicio', () => {
  beforeEach(() => {
    localStorage.clear()
    esquecerProgressoEmMemoria()
    push.mockClear()
  })

  it('primeiro uso: pergunta o nome (opcional) e leva à primeira aula', async () => {
    const user = userEvent.setup()
    render(<Inicio />)

    expect(
      screen.getByRole('heading', { level: 1, name: 'Oi!' }),
    ).toBeInTheDocument()
    await user.type(
      screen.getByLabelText('Como você quer ser chamada? (opcional)'),
      'Ana',
    )
    await user.click(
      screen.getByRole('button', { name: 'Começar a primeira aula' }),
    )

    expect(obterEstado().progresso.nome).toBe('Ana')
    expect(push).toHaveBeenCalledWith('/aulas/seu-primeiro-html')
  })

  it('primeiro uso: pular também leva à primeira aula, sem nome', async () => {
    const user = userEvent.setup()
    render(<Inicio />)

    await user.click(screen.getByRole('button', { name: 'Pular' }))

    expect(obterEstado().progresso).toMatchObject({ nomePulado: true })
    expect(obterEstado().progresso.nome).toBeUndefined()
    expect(push).toHaveBeenCalledWith('/aulas/seu-primeiro-html')
  })

  it('de volta: cumprimenta pelo nome e oferece continuar', () => {
    atualizarProgresso((p) => definirNome(p, 'Ana'))
    render(<Inicio />)

    expect(
      screen.getByRole('heading', { level: 1, name: 'Oi, Ana!' }),
    ).toBeInTheDocument()
    expect(screen.getByText('Continuar: Seu primeiro HTML')).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: /Começar a aula/ }),
    ).toHaveAttribute('href', '/aulas/seu-primeiro-html')
    expect(screen.getByText('0 de 1')).toBeInTheDocument()
  })

  it('tudo concluído: celebra e leva ao site', () => {
    atualizarProgresso((p) =>
      concluirAula(
        definirNome(p, 'Ana'),
        'seu-primeiro-html',
        '2026-10-09T20:00:00.000Z',
        '2026-10-09',
      ),
    )
    render(<Inicio />)

    expect(
      screen.getByText(/Você concluiu todas as aulas disponíveis por enquanto/),
    ).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Ver meu site' })).toHaveAttribute(
      'href',
      '/meu-site',
    )
    expect(screen.getByText('1 de 1')).toBeInTheDocument()
  })

  it('progresso que não deu para ler: explica sem culpar e aponta a cópia', () => {
    localStorage.setItem('codeluv:progresso', '{quebrado')
    render(<Inicio />)

    expect(
      screen.getByText('Não encontramos seu progresso neste aparelho'),
    ).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Configurações' })).toHaveAttribute(
      'href',
      '/configuracoes',
    )
  })
})
