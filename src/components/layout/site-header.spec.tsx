import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { SiteHeader } from './site-header'

let pathname = '/aulas'

vi.mock('next/navigation', () => ({
  usePathname: () => pathname,
}))

describe('SiteHeader', () => {
  beforeEach(() => {
    pathname = '/aulas'
  })

  it('marca o destino atual na navegação principal', () => {
    render(<SiteHeader />)

    const nav = screen.getByRole('navigation', { name: 'Principal' })
    expect(within(nav).getByRole('link', { name: 'Aulas' })).toHaveAttribute(
      'aria-current',
      'page',
    )
    expect(
      within(nav).getByRole('link', { name: 'Início' }),
    ).not.toHaveAttribute('aria-current')
  })

  it('usa links de verdade, não botões, na navegação', () => {
    render(<SiteHeader />)

    const nav = screen.getByRole('navigation', { name: 'Principal' })
    expect(within(nav).queryAllByRole('button')).toHaveLength(0)
    expect(within(nav).getAllByRole('link')).toHaveLength(4)
  })

  it('leva para Configurações pelo ícone', () => {
    render(<SiteHeader />)

    expect(screen.getByRole('link', { name: 'Configurações' })).toHaveAttribute(
      'href',
      '/configuracoes',
    )
  })

  it('abre a gaveta com os mesmos destinos no celular', async () => {
    const user = userEvent.setup()
    render(<SiteHeader />)

    await user.click(screen.getByRole('button', { name: 'Abrir menu' }))

    const drawer = await screen.findByRole('dialog', { name: 'Menu' })
    expect(within(drawer).getByRole('link', { name: 'Aulas' })).toHaveAttribute(
      'aria-current',
      'page',
    )
    expect(within(drawer).getAllByRole('link')).toHaveLength(4)
  })

  it('marca Configurações quando é a página atual', () => {
    pathname = '/configuracoes'
    render(<SiteHeader />)

    expect(screen.getByRole('link', { name: 'Configurações' })).toHaveAttribute(
      'aria-current',
      'page',
    )
    const nav = screen.getByRole('navigation', { name: 'Principal' })
    for (const link of within(nav).getAllByRole('link')) {
      expect(link).not.toHaveAttribute('aria-current')
    }
  })

  it('tem botão de fechar na gaveta', async () => {
    const user = userEvent.setup()
    render(<SiteHeader />)

    await user.click(screen.getByRole('button', { name: 'Abrir menu' }))

    const drawer = await screen.findByRole('dialog', { name: 'Menu' })
    expect(
      within(drawer).getByRole('button', { name: 'Fechar' }),
    ).toBeInTheDocument()
  })

  it('fecha a gaveta ao escolher um destino', async () => {
    const user = userEvent.setup()
    render(<SiteHeader />)

    await user.click(screen.getByRole('button', { name: 'Abrir menu' }))
    const drawer = await screen.findByRole('dialog', { name: 'Menu' })
    await user.click(within(drawer).getByRole('link', { name: 'Conquistas' }))

    await waitFor(() =>
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument(),
    )
  })
})
