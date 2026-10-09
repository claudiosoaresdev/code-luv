import type { Page } from '@playwright/test'

/** Substitui todo o código do editor (insertText não dispara atalhos por tecla). */
export async function escrever(
  page: Page,
  codigo: string,
  linguagem: 'HTML' | 'CSS' = 'HTML',
) {
  await page.getByRole('textbox', { name: `Seu código ${linguagem}` }).click()
  await page.keyboard.press('ControlOrMeta+A')
  await page.keyboard.insertText(codigo)
}
