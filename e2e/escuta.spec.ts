import { expect, type Page, test } from '@playwright/test'

test.use({ viewport: { width: 1280, height: 900 } })

const URL_AULA = '/aulas/seu-primeiro-html'

declare global {
  interface Window {
    __falas: string[]
  }
}

interface VozSimuladaDef {
  name: string
  lang: string
  localService: boolean
  default: boolean
  voiceURI: string
}

const VOZ_PT: VozSimuladaDef = {
  name: 'Teste',
  lang: 'pt-BR',
  localService: true,
  default: true,
  voiceURI: 'teste',
}

/** Instala uma síntese de voz simulada; cada fala termina depois de `duracaoMs`. */
async function vozSimulada(
  page: Page,
  duracaoMs: number,
  vozes: VozSimuladaDef[] = [VOZ_PT],
) {
  await page.addInitScript(
    ({ duracao, vozes }) => {
      window.__falas = []
      class FalaSimulada {
        text: string
        lang = ''
        rate = 1
        voice: unknown = null
        onend: (() => void) | null = null
        onerror: (() => void) | null = null
        constructor(texto: string) {
          this.text = texto
        }
      }
      let timer: ReturnType<typeof setTimeout> | undefined
      const synth = {
        getVoices: () => vozes,
        speak(fala: FalaSimulada) {
          window.__falas.push(fala.text)
          timer = setTimeout(() => fala.onend?.(), duracao)
        },
        cancel() {
          clearTimeout(timer)
        },
        pause() {},
        resume() {},
        addEventListener() {},
        removeEventListener() {},
      }
      Object.defineProperty(window, 'SpeechSynthesisUtterance', {
        value: FalaSimulada,
        configurable: true,
      })
      Object.defineProperty(window, 'speechSynthesis', {
        value: synth,
        configurable: true,
      })
    },
    { duracao: duracaoMs, vozes },
  )
}

test('a Luv lê a explicação inteira e o foco vai para a prática', async ({
  page,
}) => {
  await vozSimulada(page, 20)
  await page.goto(URL_AULA)

  await page.getByRole('button', { name: 'Ouvir explicação' }).click()
  await expect(
    page.getByRole('button', { name: 'Ouvir de novo' }),
  ).toBeVisible()

  const falas = await page.evaluate(() => window.__falas)
  expect(falas[0]).toBe('O que é HTML')
  expect(falas.some((f) => f.includes('tag de fechamento p'))).toBe(true)
  // O bloco de código do exemplo não é lido.
  expect(falas.some((f) => f.includes('Olá, eu sou a Luv'))).toBe(false)

  await expect(page.locator('#pratica')).toBeFocused()
})

test('pausar, continuar e pular trechos', async ({ page }) => {
  await vozSimulada(page, 60_000)
  await page.goto(URL_AULA)

  await page.getByRole('button', { name: 'Ouvir explicação' }).click()
  await expect(page.getByText(/^Trecho 1 de \d+$/)).toBeVisible()
  expect(await page.evaluate(() => CSS.highlights.has('leitura'))).toBe(true)

  await page.getByRole('button', { name: 'Pausar' }).click()
  await expect(page.getByRole('button', { name: 'Continuar' })).toBeVisible()

  await page.getByRole('button', { name: 'Próximo trecho' }).click()
  await expect(page.getByText(/^Trecho 2 de \d+$/)).toBeVisible()
  await expect(page.getByRole('button', { name: 'Pausar' })).toBeVisible()

  await page.keyboard.press('ArrowLeft')
  await expect(page.getByText(/^Trecho 1 de \d+$/)).toBeVisible()
})

test('a velocidade escolhida continua depois de recarregar', async ({
  page,
}) => {
  await vozSimulada(page, 20)
  await page.goto(URL_AULA)

  await page.getByRole('button', { name: 'Velocidade 1,25×' }).click()
  await page.reload()

  await expect(
    page.getByRole('button', { name: 'Velocidade 1,25×' }),
  ).toHaveAttribute('aria-pressed', 'true')
})

test('sem voz no aparelho, a aula segue pelo texto', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(window, 'speechSynthesis', {
      value: undefined,
      configurable: true,
    })
  })
  await page.goto(URL_AULA)

  await expect(
    page.getByText(
      'A voz não está disponível neste aparelho. O texto está todo aqui.',
    ),
  ).toBeVisible()
  await expect(
    page.getByRole('button', { name: 'Ouvir explicação' }),
  ).toHaveAttribute('aria-disabled', 'true')
  await expect(
    page.getByRole('heading', { name: 'O que é HTML' }),
  ).toBeVisible()
})

test('sem voz em português, avisa e segue pelo texto', async ({ page }) => {
  await vozSimulada(page, 20, [
    {
      name: 'Samantha',
      lang: 'en-US',
      localService: true,
      default: true,
      voiceURI: 's',
    },
  ])
  await page.goto(URL_AULA)

  await expect(
    page.getByText(
      'A voz não está disponível neste aparelho. O texto está todo aqui.',
    ),
  ).toBeVisible()
  await expect(
    page.getByRole('button', { name: 'Ouvir explicação' }),
  ).toHaveAttribute('aria-disabled', 'true')
})
