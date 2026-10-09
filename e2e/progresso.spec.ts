import { expect, test } from '@playwright/test'

import { escrever } from './helpers'

test.use({ viewport: { width: 1280, height: 900 } })

const URL_AULA = '/aulas/seu-primeiro-html'
const SOLUCAO =
  '<h1>Olá, eu sou a Ana</h1>\n<p>Eu gosto de gatos.</p>\n<p>Quero criar meu site.</p>'

test('primeiro uso com nome e volta ao Início com "Continuar"', async ({
  page,
}) => {
  await page.goto('/')
  await page.getByLabel('Como você quer ser chamada? (opcional)').fill('Ana')
  await page.getByRole('button', { name: 'Começar a primeira aula' }).click()
  await expect(page).toHaveURL(URL_AULA)

  await page.goto('/')
  await expect(
    page.getByRole('heading', { level: 1, name: 'Oi, Ana!' }),
  ).toBeVisible()
  await expect(page.getByText('Continuar: Seu primeiro HTML')).toBeVisible()
})

test('o código fica salvo depois de recarregar', async ({ page }) => {
  await page.goto(URL_AULA)
  await escrever(page, '<h1>Guardado</h1>')
  await page.reload()

  await expect(
    page.getByRole('textbox', { name: 'Seu código HTML' }),
  ).toContainText('<h1>Guardado</h1>')
})

test('concluir a aula dá a conquista e monta o site', async ({ page }) => {
  await page.goto(URL_AULA)
  await escrever(page, SOLUCAO)
  await page.getByRole('button', { name: 'Conferir' }).click()
  await page.getByRole('button', { name: 'Concluir aula' }).click()

  await expect(page.getByText('Conquista: Hello, World')).toBeVisible()
  await expect(
    page.frameLocator('iframe[title="Seu site"]').getByRole('heading', {
      name: 'Olá, eu sou a Ana',
    }),
  ).toBeVisible()

  await page.goto('/meu-site')
  await expect(
    page.frameLocator('iframe[title="Seu site"]').getByRole('heading', {
      name: 'Olá, eu sou a Ana',
    }),
  ).toBeVisible()

  await page.goto('/conquistas')
  await expect(page.getByText('1 de 2 conquistas')).toBeVisible()

  await page.goto('/aulas')
  await expect(page.getByText('Concluída')).toBeVisible()
})

test('baixar, apagar e recuperar o progresso', async ({ page }) => {
  await page.goto('/')
  await page.getByLabel('Como você quer ser chamada? (opcional)').fill('Ana')
  await page.getByRole('button', { name: 'Começar a primeira aula' }).click()
  await expect(page).toHaveURL(URL_AULA)

  await page.goto('/configuracoes')
  const [download] = await Promise.all([
    page.waitForEvent('download'),
    page.getByRole('button', { name: 'Baixar uma cópia' }).click(),
  ])
  const copia = await download.path()

  await page.getByRole('button', { name: 'Apagar meu progresso' }).click()
  await page
    .getByRole('alertdialog')
    .getByRole('button', { name: 'Apagar meu progresso' })
    .click()
  await page.goto('/')
  await expect(
    page.getByRole('heading', { level: 1, name: 'Oi!' }),
  ).toBeVisible()
  await expect(page.getByRole('button', { name: 'Pular' })).toBeVisible()

  await page.goto('/configuracoes')
  await page.getByLabel('Recuperar de uma cópia').setInputFiles(copia)
  await expect(page.getByText('Progresso recuperado')).toBeVisible()
  await page.goto('/')
  await expect(
    page.getByRole('heading', { level: 1, name: 'Oi, Ana!' }),
  ).toBeVisible()
})
