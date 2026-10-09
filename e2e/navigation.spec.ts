import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

const PAGES = [
  { path: '/', heading: 'Oi!', nav: 'Início' },
  { path: '/aulas', heading: 'Aulas', nav: 'Aulas' },
  { path: '/meu-site', heading: 'Meu site', nav: 'Meu site' },
  { path: '/conquistas', heading: 'Conquistas', nav: 'Conquistas' },
  { path: '/configuracoes', heading: 'Configurações', nav: null },
]

test.describe('navegação no notebook', () => {
  test.use({ viewport: { width: 1280, height: 800 } })

  for (const { path, heading, nav } of PAGES) {
    test(`${path} tem título, destino ativo e nenhuma violação de acessibilidade`, async ({
      page,
    }) => {
      await page.goto(path)

      await expect(
        page.getByRole('heading', { level: 1, name: heading }),
      ).toBeVisible()

      if (nav) {
        await expect(
          page
            .getByRole('navigation', { name: 'Principal' })
            .getByRole('link', { name: nav }),
        ).toHaveAttribute('aria-current', 'page')
      }

      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
        .analyze()
      expect(results.violations).toEqual([])
    })
  }

  test('vai do Início às Aulas pelo botão principal', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('link', { name: 'Ver as aulas' }).click()
    await expect(page).toHaveURL('/aulas')
  })

  test('o link de pular leva o foco ao conteúdo', async ({ page }) => {
    await page.goto('/')
    await page.keyboard.press('Tab')
    await expect(
      page.getByRole('link', { name: 'Pular para o conteúdo' }),
    ).toBeFocused()
    await page.keyboard.press('Enter')
    await expect(page.locator('#conteudo')).toBeFocused()
  })
})

test.describe('navegação no celular', () => {
  test.use({ viewport: { width: 375, height: 812 } })

  test('a gaveta leva a outro destino e fecha', async ({ page }) => {
    await page.goto('/')

    await expect(
      page.getByRole('navigation', { name: 'Principal' }),
    ).toBeHidden()

    await page.getByRole('button', { name: 'Abrir menu' }).click()
    const drawer = page.getByRole('dialog', { name: 'Menu' })
    await expect(drawer).toBeVisible()

    await drawer.getByRole('link', { name: 'Conquistas' }).click()

    await expect(page).toHaveURL('/conquistas')
    await expect(drawer).toBeHidden()
  })
})
