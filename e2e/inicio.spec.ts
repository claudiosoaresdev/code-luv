import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

// Ana concluiu a aula 1 na segunda e estudou na quarta; hoje é quinta.
const PROGRESSO = {
  versao: 1,
  nome: 'Ana',
  aulas: {
    'seu-primeiro-html': {
      conferencias: 2,
      codigo: '<h1>Oi</h1>',
      codigoConcluido: '<h1>Oi</h1>',
      concluidaEm: '2026-10-05T15:00:00.000Z',
      conferenciasAoConcluir: 2,
    },
  },
  conquistas: { 'hello-world': { em: '2026-10-05T15:00:00.000Z' } },
  diasEstudados: ['2026-10-05', '2026-10-07'],
}

test.beforeEach(async ({ page }) => {
  await page.clock.setFixedTime(new Date('2026-10-08T12:00:00'))
  // Roda em toda navegação: só grava se ainda não há progresso, para não
  // desfazer o que o teste mudou (ex.: a meta).
  await page.addInitScript((progresso) => {
    if (!localStorage.getItem('codeluv:progresso')) {
      localStorage.setItem('codeluv:progresso', JSON.stringify(progresso))
    }
  }, PROGRESSO)
})

test('o dashboard mostra a semana, o próximo passo e o progresso', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 900 })
  await page.goto('/')

  await expect(
    page.getByRole('heading', { level: 1, name: 'Oi, Ana!' }),
  ).toBeVisible()
  await expect(page.getByRole('img', { name: '2 de 3 corações' })).toBeVisible()
  await expect(
    page.getByRole('heading', { name: 'Continuar: Títulos e destaques' }),
  ).toBeVisible()
  await expect(page.getByRole('region', { name: 'Sua semana' })).toContainText(
    'quinta-feira, hoje',
  )
  await expect(
    page.getByRole('img', { name: /^HTML: 1 de \d+ aulas concluídas$/ }),
  ).toBeVisible()
  await expect(page.getByText('2 dias estudados desde o começo.')).toBeVisible()

  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
    .analyze()
  expect(results.violations).toEqual([])
})

test('a meta escolhida em Configurações muda os corações', async ({ page }) => {
  await page.goto('/configuracoes')
  await page
    .getByLabel('Quantos dias por semana você quer estudar?')
    .selectOption('5')
  await page.goto('/')
  await expect(page.getByRole('img', { name: '2 de 5 corações' })).toBeVisible()
})

test('no celular, nada vaza para o lado', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 })
  await page.goto('/')
  await expect(
    page.getByRole('heading', { level: 1, name: 'Oi, Ana!' }),
  ).toBeVisible()
  const vaza = await page.evaluate(
    () =>
      document.documentElement.scrollWidth >
      document.documentElement.clientWidth,
  )
  expect(vaza).toBe(false)
})
