import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

import { escrever } from './helpers'

test.use({ viewport: { width: 1280, height: 900 } })

const URL_AULA = '/aulas/seu-primeiro-html'

test('da lista de aulas até concluir a aula 1', async ({ page }) => {
  await page.goto('/aulas')
  await page.getByRole('link', { name: /Seu primeiro HTML/ }).click()
  await expect(page).toHaveURL(URL_AULA)
  await expect(
    page.getByRole('heading', { level: 1, name: 'Seu primeiro HTML' }),
  ).toBeVisible()

  const concluir = page.getByRole('button', { name: 'Concluir aula' })
  await expect(concluir).toHaveAttribute('aria-disabled', 'true')

  await escrever(page, '<h1>Olá, eu sou a Ana</h1>')
  const resultado = page.frameLocator('iframe[title="Resultado do seu código"]')
  await expect(
    resultado.getByRole('heading', { name: 'Olá, eu sou a Ana' }),
  ).toBeVisible()

  await page.getByRole('button', { name: 'Conferir' }).click()
  await expect(
    page.getByRole('status').filter({ hasText: 'Quase!' }),
  ).toContainText('Quase! Falta 1 item. Quer uma pista?')

  await page.getByRole('button', { name: 'Ver pista' }).click()
  await expect(page.getByText('Pista 1 de 2')).toBeVisible()

  await escrever(
    page,
    '<h1>Olá, eu sou a Ana</h1>\n<p>Eu gosto de gatos.</p>\n<p>Quero criar meu site.</p>',
  )
  await page.getByRole('button', { name: 'Conferir' }).click()
  await expect(
    page.getByText('Funcionou! Agora é só concluir a aula.'),
  ).toBeVisible()

  await expect(concluir).not.toHaveAttribute('aria-disabled', 'true')
  await concluir.click()
  await expect(
    page.getByRole('heading', { name: 'Aula concluída!' }),
  ).toBeFocused()
  await expect(
    page.getByRole('link', { name: 'Próxima aula: Títulos e destaques' }),
  ).toHaveAttribute('href', '/aulas/titulos-e-destaques')
  await page.getByRole('link', { name: 'Voltar para as aulas' }).click()
  await expect(page).toHaveURL('/aulas')
})

test('recomeçar volta ao início e desfazer devolve o código', async ({
  page,
}) => {
  await page.goto(URL_AULA)
  const editor = page.getByRole('textbox', { name: 'Seu código HTML' })

  await escrever(page, '<h1>Meu código</h1>')
  await page.getByRole('button', { name: 'Recomeçar' }).click()
  await expect(editor).toContainText('Escreva seu código aqui embaixo')

  await page.getByRole('button', { name: 'Desfazer' }).click()
  await expect(editor).toContainText('<h1>Meu código</h1>')
})

test('a aula não tem violações de acessibilidade', async ({ page }) => {
  await page.goto(URL_AULA)
  await escrever(page, '<h1>Oi</h1>')
  await page.getByRole('button', { name: 'Conferir' }).click()
  await page.getByRole('button', { name: 'Ver pista' }).click()

  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
    // O conteúdo do iframe é o site da aluna, fora do design system (DS-08).
    .exclude('iframe[title="Resultado do seu código"]')
    .analyze()
  expect(results.violations).toEqual([])
})

test('slug desconhecido mostra a página não encontrada', async ({ page }) => {
  await page.goto('/aulas/nao-existe')
  await expect(
    page.getByRole('heading', {
      level: 1,
      name: 'Não encontramos esta página',
    }),
  ).toBeVisible()
  await expect(page.locator('meta[name="robots"]').first()).toHaveAttribute(
    'content',
    /noindex/,
  )
  await expect(
    page.getByRole('link', { name: 'Ver as aulas' }),
  ).toHaveAttribute('href', '/aulas')
})

test.describe('no celular', () => {
  test.use({ viewport: { width: 360, height: 800 } })

  test('a aula não rola para o lado no celular', async ({ page }) => {
    await page.goto(URL_AULA)
    await escrever(page, '<h1>Oi</h1>')
    await page.getByRole('button', { name: 'Conferir' }).click()
    await page.getByRole('button', { name: 'Ver pista' }).click()
    await page.getByRole('button', { name: 'Ver próxima pista' }).click()
    await page.getByRole('button', { name: 'Ver solução' }).click()

    const semRolagemLateral = await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    )
    expect(semRolagemLateral).toBe(true)
  })
})

test('a imagem da aula de imagens aparece no resultado', async ({ page }) => {
  await page.goto('/aulas/imagens')
  await escrever(
    page,
    '<img src="/images/luv/ola.png" alt="A gatinha Luv acenando" width="200">',
  )
  const imagem = page
    .frameLocator('iframe[title="Resultado do seu código"]')
    .getByRole('img', { name: 'A gatinha Luv acenando' })
  await expect(imagem).toBeVisible()
  await expect
    .poll(() => imagem.evaluate((img: HTMLImageElement) => img.naturalWidth))
    .toBeGreaterThan(0)
})

for (const slug of [
  'titulos-e-destaques',
  'listas',
  'links',
  'imagens',
  'formularios',
  'secoes-e-rodape',
  'cores',
  'letras',
  'espacamento',
  'organizacao',
  'celular',
  'movimentos',
]) {
  test(`/aulas/${slug} abre sem violação de acessibilidade`, async ({
    page,
  }) => {
    await page.goto(`/aulas/${slug}`)
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
      .exclude('iframe[title="Resultado do seu código"]')
      .analyze()
    expect(results.violations).toEqual([])
  })
}

const resultado = (page: import('@playwright/test').Page) =>
  page.frameLocator('iframe[title="Resultado do seu código"]')

test('aula de CSS: o estilo aparece no site e a conferência lê as regras', async ({
  page,
}) => {
  await page.goto('/aulas/cores')
  await expect(page.getByText(/site de exemplo/)).toBeVisible()

  await escrever(
    page,
    'body {\n  background-color: lavenderblush;\n}\n\nh1 {\n  color: mediumvioletred;\n}\n\nh2 {\n  color: rebeccapurple;\n}\n',
    'CSS',
  )
  await expect
    .poll(() =>
      resultado(page)
        .locator('h1')
        .first()
        .evaluate((h1) => getComputedStyle(h1).color),
    )
    .toBe('rgb(199, 21, 133)')

  await page.getByRole('button', { name: 'Conferir' }).click()
  await expect(
    page.getByText('Funcionou! Agora é só concluir a aula.'),
  ).toBeVisible()
  await page.getByRole('button', { name: 'Concluir aula' }).click()
  await expect(
    page.getByRole('link', { name: 'Próxima aula: Letras' }),
  ).toHaveAttribute('href', '/aulas/letras')

  await page.goto('/meu-site')
  await expect
    .poll(() =>
      page
        .frameLocator('iframe[title="Seu site"]')
        .locator('h1')
        .first()
        .evaluate((h1) => getComputedStyle(h1).color),
    )
    .toBe('rgb(199, 21, 133)')
})

test('aula de CSS: "Ver como celular" liga a media query', async ({ page }) => {
  await page.goto('/aulas/celular')
  await escrever(
    page,
    '@media (max-width: 400px) {\n  h1 {\n    font-size: 1.75rem;\n  }\n}\n',
    'CSS',
  )
  const tamanhoDoTitulo = () =>
    resultado(page)
      .locator('h1')
      .first()
      .evaluate((h1) => getComputedStyle(h1).fontSize)

  // largo: vale o tamanho normal do h1 (2em = 32px)
  await expect.poll(tamanhoDoTitulo).toBe('32px')

  const botao = page.getByRole('button', { name: 'Ver como celular' })
  await botao.click()
  await expect(botao).toHaveAttribute('aria-pressed', 'true')
  await expect.poll(tamanhoDoTitulo).toBe('28px')
})
