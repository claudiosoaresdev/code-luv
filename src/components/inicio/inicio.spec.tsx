import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { AULAS } from '@/content/aulas'
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

  it('primeiro uso: continua na tela enquanto navega, sem trocar o título', async () => {
    const user = userEvent.setup()
    render(<Inicio />)

    await user.type(
      screen.getByLabelText('Como você quer ser chamada? (opcional)'),
      'Ana',
    )
    await user.click(
      screen.getByRole('button', { name: 'Começar a primeira aula' }),
    )

    expect(
      screen.getByRole('heading', { level: 1, name: 'Oi!' }),
    ).toBeInTheDocument()
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
    const totalHtml = AULAS.filter((a) => a.modulo === 'html').length
    expect(
      screen.getByRole('img', {
        name: `HTML: 0 de ${totalHtml} aulas concluídas`,
      }),
    ).toBeInTheDocument()
  })

  it('tudo concluído: celebra e leva ao site', () => {
    atualizarProgresso((p) =>
      AULAS.reduce(
        (feito, aula) =>
          concluirAula(
            feito,
            aula.slug,
            '2026-10-09T20:00:00.000Z',
            '2026-10-09',
          ),
        definirNome(p, 'Ana'),
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
    const totalCss = AULAS.filter((a) => a.modulo === 'css').length
    expect(
      screen.getByRole('img', {
        name: `CSS: ${totalCss} de ${totalCss} aulas concluídas`,
      }),
    ).toBeInTheDocument()
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

  it('terminou o HTML: segue para a primeira aula de CSS', () => {
    atualizarProgresso((p) =>
      AULAS.filter((aula) => aula.modulo === 'html').reduce(
        (feito, aula) =>
          concluirAula(
            feito,
            aula.slug,
            '2026-10-09T20:00:00.000Z',
            '2026-10-09',
          ),
        definirNome(p, 'Ana'),
      ),
    )
    render(<Inicio />)

    expect(screen.getByText('Continuar: Cores')).toBeInTheDocument()
  })
})

describe('Inicio — dashboard', () => {
  beforeEach(() => {
    localStorage.clear()
    esquecerProgressoEmMemoria()
    vi.useFakeTimers({ toFake: ['Date'] })
    // quinta-feira, 8 de outubro de 2026
    vi.setSystemTime(new Date(2026, 9, 8, 10))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('mostra a Luv com os corações, a semana e o progresso', () => {
    atualizarProgresso((p) => ({
      ...definirNome(p, 'Ana'),
      diasEstudados: ['2026-10-05', '2026-10-07'],
    }))
    render(<Inicio />)

    expect(
      screen.getByRole('heading', { level: 1, name: 'Oi, Ana!' }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('img', { name: '2 de 3 corações' }),
    ).toBeInTheDocument()
    expect(
      screen.getByText(
        'A Luv guardou dois corações esta semana. Falta um para a sua meta.',
      ),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('region', { name: 'Sua semana' }),
    ).toHaveTextContent('quinta-feira, hoje')
    expect(
      screen.getByRole('heading', { level: 2, name: 'Seu progresso' }),
    ).toBeInTheDocument()
    expect(
      screen.getByText('2 dias estudados desde o começo.'),
    ).toBeInTheDocument()
    expect(screen.getByText(/Próxima:/)).toHaveTextContent('Hello, World')
  })

  it('usa a meta que ela escolheu', () => {
    atualizarProgresso((p) => ({
      ...definirNome(p, 'Ana'),
      metaSemanal: 5,
      diasEstudados: ['2026-10-05'],
    }))
    render(<Inicio />)

    expect(
      screen.getByRole('img', { name: '1 de 5 corações' }),
    ).toBeInTheDocument()
    expect(
      screen.getByText(
        'Você estudou em 1 dia desta semana. Meta: 5 dias por semana.',
      ),
    ).toBeInTheDocument()
  })

  it('progresso não recuperado: o aviso aparece no dashboard', () => {
    localStorage.setItem('codeluv:progresso', '{quebrado')
    render(<Inicio />)

    expect(
      screen.getByText('Não encontramos seu progresso neste aparelho'),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('img', { name: '0 de 3 corações' }),
    ).toBeInTheDocument()
  })
})
