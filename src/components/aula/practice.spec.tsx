import { act, fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { aula } from '@/content/aulas/01-seu-primeiro-html/aula'

import { Practice } from './practice'

// O CodeMirror não roda no jsdom; aqui ele vira um textarea com o mesmo contrato.
vi.mock('./code-editor', () => ({
  CodeEditor: ({
    value,
    onChange,
    label,
  }: {
    value: string
    onChange: (v: string) => void
    label: string
  }) => (
    <textarea
      aria-label={label}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  ),
}))

const { add } = vi.hoisted(() => ({ add: vi.fn() }))
vi.mock('@/components/ui/toast', () => ({ toast: { add } }))

const editor = () => screen.getByRole('textbox', { name: 'Seu código HTML' })
const escrever = (codigo: string) =>
  fireEvent.change(editor(), { target: { value: codigo } })

describe('Practice', () => {
  beforeEach(() => add.mockClear())

  it('começa com o código inicial e sem poder concluir', () => {
    render(<Practice aula={aula} />)

    expect(editor()).toHaveValue(aula.pratica.inicial)
    expect(
      screen.getByRole('button', { name: 'Concluir aula' }),
    ).toHaveAttribute('aria-disabled', 'true')
    expect(
      screen.getByText(/quando todos os itens estiverem certos/),
    ).toBeInTheDocument()
    expect(screen.getByRole('status')).toBeEmptyDOMElement()
  })

  it('confere, incentiva e oferece pista quando algo falta', async () => {
    const user = userEvent.setup()
    render(<Practice aula={aula} />)

    escrever('<h1>Olá, eu sou a Ana</h1>')
    await user.click(screen.getByRole('button', { name: 'Conferir' }))

    expect(screen.getAllByRole('status')[0]).toHaveTextContent(
      'Quase! Falta 1 item. Quer uma pista?',
    )
    expect(screen.getAllByText(/— certo!/)).toHaveLength(2)
    expect(screen.getAllByText(/— ainda não/)).toHaveLength(1)
    expect(
      screen.getByRole('button', { name: 'Ver pista' }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Concluir aula' }),
    ).toHaveAttribute('aria-disabled', 'true')
  })

  it('libera a conclusão quando tudo está certo', async () => {
    const user = userEvent.setup()
    render(<Practice aula={aula} />)

    escrever(aula.pratica.solucao)
    await user.click(screen.getByRole('button', { name: 'Conferir' }))

    expect(screen.getByRole('status')).toHaveTextContent(
      'Funcionou! Agora é só concluir a aula.',
    )
    expect(
      screen.getByRole('button', { name: 'Concluir aula' }),
    ).not.toHaveAttribute('aria-disabled', 'true')
  })

  it('apaga a conferência antiga quando a aluna volta a editar', async () => {
    const user = userEvent.setup()
    render(<Practice aula={aula} />)

    escrever(aula.pratica.solucao)
    await user.click(screen.getByRole('button', { name: 'Conferir' }))
    escrever('<h1>Oi</h1>')

    expect(screen.queryByText(/— certo!/)).not.toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Concluir aula' }),
    ).toHaveAttribute('aria-disabled', 'true')
  })

  it('recomeça sem confirmação e oferece desfazer (DS 9)', async () => {
    const user = userEvent.setup()
    render(<Practice aula={aula} />)

    escrever('<h1>Meu código</h1>')
    await user.click(screen.getByRole('button', { name: 'Recomeçar' }))

    expect(editor()).toHaveValue(aula.pratica.inicial)
    expect(add).toHaveBeenCalledTimes(1)
    const aviso = add.mock.calls[0][0]
    expect(aviso.actionProps.children).toBe('Desfazer')

    act(() => aviso.actionProps.onClick())
    expect(
      await screen.findByDisplayValue('<h1>Meu código</h1>'),
    ).toBeInTheDocument()
  })

  it('não mostra aviso de desfazer quando não há nada a desfazer', async () => {
    const user = userEvent.setup()
    render(<Practice aula={aula} />)

    await user.click(screen.getByRole('button', { name: 'Recomeçar' }))

    expect(add).not.toHaveBeenCalled()
  })

  it('explica por que concluir está bloqueado, até a conferência passar', async () => {
    const user = userEvent.setup()
    render(<Practice aula={aula} />)

    const botao = screen.getByRole('button', { name: 'Concluir aula' })
    await user.click(botao)
    expect(add).not.toHaveBeenCalled() // focável, mas não conclui
    expect(botao).toHaveAccessibleDescription(
      /quando todos os itens estiverem certos/,
    )

    escrever(aula.pratica.solucao)
    await user.click(screen.getByRole('button', { name: 'Conferir' }))

    expect(botao).not.toHaveAttribute('aria-describedby')
  })

  it('mantém a pista aberta quando a aluna edita o código', async () => {
    const user = userEvent.setup()
    render(<Practice aula={aula} />)

    escrever('<h1>Olá, eu sou a Ana</h1>')
    await user.click(screen.getByRole('button', { name: 'Conferir' }))
    await user.click(screen.getByRole('button', { name: 'Ver pista' }))
    escrever('<h1>Olá, eu sou a Ana</h1><p>')

    expect(screen.getByText(/Pista 1 de/)).toBeInTheDocument()
  })

  it('conclui a aula, avisa e leva o foco para a celebração', async () => {
    const user = userEvent.setup()
    render(<Practice aula={aula} />)

    escrever(aula.pratica.solucao)
    await user.click(screen.getByRole('button', { name: 'Conferir' }))
    await user.click(screen.getByRole('button', { name: 'Concluir aula' }))

    const titulo = screen.getByRole('heading', { name: 'Aula concluída!' })
    expect(titulo).toHaveFocus()
    expect(
      screen.getByRole('link', { name: 'Voltar para as aulas' }),
    ).toHaveAttribute('href', '/aulas')
    expect(add).toHaveBeenCalledWith(
      expect.objectContaining({ title: 'Aula concluída' }),
    )
  })

  it('oferece a próxima aula quando existe', async () => {
    const user = userEvent.setup()
    render(
      <Practice
        aula={aula}
        proxima={{
          slug: 'titulos-e-paragrafos',
          titulo: 'Títulos e parágrafos',
        }}
      />,
    )

    escrever(aula.pratica.solucao)
    await user.click(screen.getByRole('button', { name: 'Conferir' }))
    await user.click(screen.getByRole('button', { name: 'Concluir aula' }))

    expect(
      screen.getByRole('link', { name: 'Próxima aula: Títulos e parágrafos' }),
    ).toHaveAttribute('href', '/aulas/titulos-e-paragrafos')
  })
})
