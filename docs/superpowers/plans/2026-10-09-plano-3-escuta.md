# Plano 3 — Escuta: Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Na aula, a aluna aperta "Ouvir explicação" e a Luv lê o texto em voz alta, frase por frase, com a frase lida destacada; ela pode pausar, continuar, voltar, repetir, pular e mudar a velocidade (lembrada no aparelho), e ao fim o foco vai para a prática.

**Architecture:** A explicação MDX (servidor) passa a ser filha de um Client Component `Escuta`. Ao montar, `Escuta` percorre o DOM do texto e monta os **trechos** (uma frase cada, com um `Range` apontando para o texto). O hook `useEscuta` fala os trechos um a um pela **Web Speech API** (`speechSynthesis`), escolhendo a melhor voz em português, e controla o estado (parado, tocando, pausado, fim, indisponível). O destaque usa a **CSS Custom Highlight API** (`CSS.highlights` + `::highlight(leitura)`): pinta o trecho sem mexer no DOM que o React renderizou. A velocidade fica no `localStorage`, lida por `useSyncExternalStore` (sem diferença entre servidor e cliente na hidratação).

**Tech Stack:** Next.js 16.4 (App Router, `cacheComponents` + `partialPrefetching`), React 19.3, TypeScript, Tailwind CSS 4, shadcn/ui (base-nova, Base UI, Lucide), Web Speech API, CSS Custom Highlight API, Vitest 5 + Testing Library + jsdom, Playwright + axe-core.

**Documentos de referência:**

- `docs/briefing.md` — CU-02 (ouvir uma explicação), HU-02 (ouvir com o texto destacado), HU-03 (controlar a escuta), seção 11.4 (escuta como acesso), Q1 (qualidade da voz).
- `docs/design-system.md` (v0.3.1) — 8.2 fichas `ListenControls` e `ReadAlongText`, 9 padrão "Escuta" e "Voz indisponível", 7 movimento (texto lido nunca é animado), 11 acessibilidade (mudanças de trecho não são anunciadas; nada toca sozinho), DS-06 (destaque por frase, fundo + sublinhado, sem transição).
- `AGENTS.md` — consultar `node_modules/next/dist/docs/` antes de usar uma API do Next.
- Skill `shadcn` (`~/.claude/skills/shadcn/SKILL.md`).

**Decisões deste plano (tomadas com a responsável pelo produto em 2026-10-09):**

- **Voz do navegador** (Web Speech API): custo zero, funciona sem internet, a qualidade depende do aparelho. Responde à Q1 do briefing na prática.
- **Velocidade lembrada no aparelho** (`localStorage`, chave `codeluv:velocidade`). O Plano 4 junta isso ao resto do progresso.

**Decisões técnicas (e por quê):**

- **Um trecho = uma frase** (DS-06). Títulos (`h2`, `h3`) são trechos próprios. **Blocos de código (`pre`) não são lidos**: ouvir código símbolo a símbolo está fora da HU-02.
- **Código dentro da frase é traduzido para fala** (`paraFala`): `<h1>` vira "tag h1", `</p>` vira "tag de fechamento p". Sem isso, a voz diz "menor que agá um maior que".
- **Pausar = cancelar e lembrar o trecho.** `speechSynthesis.pause()`/`resume()` são instáveis em vários navegadores; "Continuar" recomeça a frase atual, que é curta. Um contador de geração ignora eventos `end`/`error` de falas canceladas.
- **Destaque sem tocar no DOM do React** (CSS Custom Highlight API). Navegador sem a API (raro em 2026) lê normalmente, só sem o destaque.
- **Clique no texto só pula de trecho se a escuta já está em andamento.** O DS fala em "clicar num trecho começa a leitura a partir dele", mas um clique para selecionar texto não pode disparar som (briefing: "nada toca sozinho"). Registrado no DS (Task 9).
- **Controles fixos no topo também no celular** (abaixo da barra da aula), e **sem o avatar da Luv** nos controles: a página já tem a Luv do objetivo (DS: uma Luv por tela). Registrado no DS (Task 9).
- **Mudanças de trecho não são anunciadas** por leitor de tela (DS 11: evita voz sobre voz). O texto "Trecho 3 de 12" não fica em região viva.

**Convenções do repositório:** Prettier sem ponto e vírgula, aspas simples, `trailingComma: 'all'`; ESLint ordena imports; testes em `src/**/*.spec.{ts,tsx}` importando de `vitest` (`globals: false`, jest-dom + cleanup em `vitest.setup.ts`); commits Conventional Commits em minúsculas com o trailer `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`; área de toque mínima 48px; links com cara de botão = `<Link className={buttonVariants()}>`. Sem `.next`, rode `npx next typegen` antes de `npx tsc --noEmit`. Hoje: 16 arquivos / 89 testes no Vitest; 13 testes no Playwright.

---

## Mapa de arquivos

| Arquivo                                            | Ação      | Responsabilidade                                                   |
| -------------------------------------------------- | --------- | ------------------------------------------------------------------ |
| `src/lib/escuta/fala.ts` (+ `.spec.ts`)            | criar     | texto do trecho → texto bom de ouvir                               |
| `src/lib/escuta/vozes.ts` (+ `.spec.ts`)           | criar     | escolher a melhor voz em português                                 |
| `src/lib/escuta/velocidade.ts` (+ `.spec.ts`)      | criar     | velocidades possíveis; ler, salvar e assinar a velocidade lembrada |
| `src/lib/escuta/trechos.ts` (+ `.spec.ts`)         | criar     | dividir o texto renderizado em frases com `Range`                  |
| `src/components/aula/use-escuta.ts` (+ `.spec.ts`) | criar     | tocar os trechos com a Web Speech API e controlar o estado         |
| `src/components/aula/listen-controls.tsx` (+ spec) | criar     | controles da escuta (DS 8.2 — ListenControls)                      |
| `src/components/aula/escuta.tsx`                   | criar     | junta trechos, hook, controles, destaque, foco ao terminar         |
| `src/app/globals.css`                              | modificar | estilo `::highlight(leitura)`                                      |
| `src/app/(aula)/aulas/[slug]/page.tsx`             | modificar | envolver a explicação com `Escuta`; alvo de foco `#pratica`        |
| `e2e/escuta.spec.ts`                               | criar     | escuta de ponta a ponta com voz simulada                           |
| `docs/design-system.md`                            | modificar | inventário e divergências após a entrega                           |

---

### Task 0: Branch

- [ ] **Step 1: Criar a branch**

Run: `git status --short && git checkout -b feat/plano-3-escuta`
Expected: só `?? .claude/` (e este plano, se ainda não commitado) no status; `Switched to a new branch 'feat/plano-3-escuta'`.

---

### Task 1: Texto bom de ouvir (`paraFala`)

**Files:**

- Create: `src/lib/escuta/fala.ts`
- Test: `src/lib/escuta/fala.spec.ts`

- [ ] **Step 1: Escrever o teste**

`src/lib/escuta/fala.spec.ts`:

```ts
import { describe, expect, it } from 'vitest'

import { paraFala } from './fala'

describe('paraFala', () => {
  it('não mexe em frase sem código', () => {
    expect(paraFala('O navegador lê esse texto.')).toBe(
      'O navegador lê esse texto.',
    )
  })

  it('lê tags de abertura como "tag"', () => {
    expect(paraFala('A tag <h1> diz que é um título.')).toBe(
      'A tag tag h1 diz que é um título.',
    )
  })

  it('lê tags de fechamento como "tag de fechamento"', () => {
    expect(paraFala('<p> abre, e </p> fecha.')).toBe(
      'tag p abre, e tag de fechamento p fecha.',
    )
  })

  it('não deixa espaço antes de pontuação nem espaços duplos', () => {
    expect(paraFala('Repare em </h1> .')).toBe(
      'Repare em tag de fechamento h1.',
    )
  })
})
```

- [ ] **Step 2: Rodar e ver falhar**

Run: `npx vitest run src/lib/escuta/fala.spec.ts`
Expected: FAIL — `Failed to resolve import "./fala"`.

- [ ] **Step 3: Implementar**

`src/lib/escuta/fala.ts`:

```ts
/**
 * Prepara o texto de um trecho para a voz. Sem isto, a voz lê "<h1>" como
 * "menor que agá um maior que". O texto na tela continua igual.
 */
export function paraFala(texto: string) {
  return texto
    .replace(/<\/(\w+)>/g, ' tag de fechamento $1 ')
    .replace(/<(\w+)>/g, ' tag $1 ')
    .replace(/\s+([,.!?:;])/g, '$1')
    .replace(/\s{2,}/g, ' ')
    .trim()
}
```

- [ ] **Step 4: Rodar e ver passar**

Run: `npx vitest run src/lib/escuta/fala.spec.ts`
Expected: PASS, `4 passed`.

- [ ] **Step 5: Commit**

```bash
git add src/lib/escuta/fala.ts src/lib/escuta/fala.spec.ts
git commit -m "feat: turn code in sentences into speakable text"
```

---

### Task 2: Escolher a voz (`escolherVoz`)

**Files:**

- Create: `src/lib/escuta/vozes.ts`
- Test: `src/lib/escuta/vozes.spec.ts`

- [ ] **Step 1: Escrever o teste**

`src/lib/escuta/vozes.spec.ts`:

```ts
import { describe, expect, it } from 'vitest'

import { escolherVoz } from './vozes'

function voz(
  name: string,
  lang: string,
  localService = false,
): SpeechSynthesisVoice {
  return { name, lang, localService, default: false, voiceURI: name }
}

describe('escolherVoz', () => {
  it('não escolhe nada sem voz em português', () => {
    expect(escolherVoz([voz('Samantha', 'en-US')])).toBeUndefined()
    expect(escolherVoz([])).toBeUndefined()
  })

  it('prefere português do Brasil a português de Portugal', () => {
    expect(
      escolherVoz([voz('Joana', 'pt-PT'), voz('Felipe', 'pt-BR')])?.name,
    ).toBe('Felipe')
  })

  it('prefere vozes conhecidas por soar melhor', () => {
    expect(
      escolherVoz([voz('Felipe', 'pt-BR'), voz('Luciana', 'pt-BR')])?.name,
    ).toBe('Luciana')
  })

  it('aceita o formato pt_BR', () => {
    expect(escolherVoz([voz('Luciana', 'pt_BR')])?.name).toBe('Luciana')
  })
})
```

- [ ] **Step 2: Rodar e ver falhar**

Run: `npx vitest run src/lib/escuta/vozes.spec.ts`
Expected: FAIL — `Failed to resolve import "./vozes"`.

- [ ] **Step 3: Implementar**

`src/lib/escuta/vozes.ts`:

```ts
/** Nomes de vozes que costumam soar mais naturais em português. */
const PREFERIDAS = ['luciana', 'google', 'francisca', 'natural', 'neural']

function idioma(voz: SpeechSynthesisVoice) {
  return voz.lang.toLowerCase().replace('_', '-')
}

function nota(voz: SpeechSynthesisVoice) {
  const nome = voz.name.toLowerCase()
  return (
    (idioma(voz) === 'pt-br' ? 10 : 0) +
    (PREFERIDAS.some((p) => nome.includes(p)) ? 5 : 0) +
    (voz.localService ? 1 : 0)
  )
}

/** A melhor voz em português disponível, ou undefined se não houver. */
export function escolherVoz(vozes: SpeechSynthesisVoice[]) {
  return vozes
    .filter((voz) => idioma(voz).startsWith('pt'))
    .sort((a, b) => nota(b) - nota(a))[0]
}
```

- [ ] **Step 4: Rodar e ver passar**

Run: `npx vitest run src/lib/escuta/vozes.spec.ts`
Expected: PASS, `4 passed`.

- [ ] **Step 5: Commit**

```bash
git add src/lib/escuta/vozes.ts src/lib/escuta/vozes.spec.ts
git commit -m "feat: pick the best portuguese voice"
```

---

### Task 3: Velocidade lembrada

**Files:**

- Create: `src/lib/escuta/velocidade.ts`
- Test: `src/lib/escuta/velocidade.spec.ts`

- [ ] **Step 1: Escrever o teste**

`src/lib/escuta/velocidade.spec.ts`:

```ts
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import {
  assinarVelocidade,
  lerVelocidade,
  salvarVelocidade,
} from './velocidade'

describe('velocidade', () => {
  beforeEach(() => localStorage.clear())
  afterEach(() => vi.restoreAllMocks())

  it('começa em 1×', () => {
    expect(lerVelocidade()).toBe(1)
  })

  it('lembra a velocidade salva', () => {
    salvarVelocidade(1.25)
    expect(lerVelocidade()).toBe(1.25)
  })

  it('ignora valor estranho guardado', () => {
    localStorage.setItem('codeluv:velocidade', '7')
    expect(lerVelocidade()).toBe(1)
  })

  it('segue funcionando sem armazenamento (navegação privada, cota cheia)', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('bloqueado')
    })
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('bloqueado')
    })

    expect(() => salvarVelocidade(1.5)).not.toThrow()
    expect(lerVelocidade()).toBe(1)
  })

  it('avisa quem assinou quando a velocidade muda', () => {
    const aviso = vi.fn()
    const cancelar = assinarVelocidade(aviso)

    salvarVelocidade(0.75)
    expect(aviso).toHaveBeenCalledTimes(1)

    cancelar()
    salvarVelocidade(1)
    expect(aviso).toHaveBeenCalledTimes(1)
  })
})
```

- [ ] **Step 2: Rodar e ver falhar**

Run: `npx vitest run src/lib/escuta/velocidade.spec.ts`
Expected: FAIL — `Failed to resolve import "./velocidade"`.

- [ ] **Step 3: Implementar**

`src/lib/escuta/velocidade.ts`:

```ts
export const VELOCIDADES = [0.75, 1, 1.25, 1.5] as const
export type Velocidade = (typeof VELOCIDADES)[number]

const CHAVE = 'codeluv:velocidade'
const EVENTO = 'codeluv:velocidade'

function valida(valor: number): valor is Velocidade {
  return (VELOCIDADES as readonly number[]).includes(valor)
}

/** Velocidade lembrada no aparelho (HU-03); 1× se não houver ou não der para ler. */
export function lerVelocidade(): Velocidade {
  try {
    const valor = Number(localStorage.getItem(CHAVE))
    return valida(valor) ? valor : 1
  } catch {
    return 1
  }
}

export function salvarVelocidade(valor: Velocidade) {
  try {
    localStorage.setItem(CHAVE, String(valor))
  } catch {
    // Armazenamento indisponível: a escolha vale só até recarregar a página.
  }
  window.dispatchEvent(new Event(EVENTO))
}

/** Para useSyncExternalStore: avisa quando a velocidade muda (nesta aba ou em outra). */
export function assinarVelocidade(aviso: () => void) {
  window.addEventListener(EVENTO, aviso)
  window.addEventListener('storage', aviso)
  return () => {
    window.removeEventListener(EVENTO, aviso)
    window.removeEventListener('storage', aviso)
  }
}
```

- [ ] **Step 4: Rodar e ver passar**

Run: `npx vitest run src/lib/escuta/velocidade.spec.ts`
Expected: PASS, `5 passed`. Observação: quando o `setItem` falha, a leitura seguinte volta para 1× — por isso o teste espera 1, não 1.5.

- [ ] **Step 5: Commit**

```bash
git add src/lib/escuta/velocidade.ts src/lib/escuta/velocidade.spec.ts
git commit -m "feat: remember listening speed on the device"
```

---

### Task 4: Trechos do texto (`dividirEmTrechos`)

**Files:**

- Create: `src/lib/escuta/trechos.ts`
- Test: `src/lib/escuta/trechos.spec.ts`

- [ ] **Step 1: Escrever o teste**

`src/lib/escuta/trechos.spec.ts`:

```ts
import { describe, expect, it } from 'vitest'

import { dividirEmTrechos } from './trechos'

function montar(html: string) {
  const container = document.createElement('div')
  container.innerHTML = html
  document.body.append(container)
  return container
}

describe('dividirEmTrechos', () => {
  it('faz um trecho por título e por frase, na ordem', () => {
    const container = montar(
      '<h2>O que é HTML</h2><p>Toda página é texto. O navegador desenha a página!</p>',
    )

    expect(dividirEmTrechos(container).map((t) => t.texto)).toEqual([
      'O que é HTML',
      'Toda página é texto.',
      'O navegador desenha a página!',
    ])
  })

  it('atravessa código dentro da frase e aponta o Range para o texto exato', () => {
    const container = montar(
      '<p>A tag <code>&lt;p&gt;</code> abre. A barra em <code>&lt;/p&gt;</code> fecha.</p>',
    )
    const trechos = dividirEmTrechos(container)

    expect(trechos.map((t) => t.texto)).toEqual([
      'A tag <p> abre.',
      'A barra em </p> fecha.',
    ])
    for (const trecho of trechos) {
      expect(trecho.range.toString()).toBe(trecho.texto)
    }
  })

  it('não lê blocos de código', () => {
    const container = montar(
      '<p>Veja o exemplo.</p><pre><code>&lt;h1&gt;Olá&lt;/h1&gt;</code></pre>',
    )

    expect(dividirEmTrechos(container).map((t) => t.texto)).toEqual([
      'Veja o exemplo.',
    ])
  })

  it('lê itens de lista, sem repetir parágrafos dentro deles', () => {
    const container = montar(
      '<ul><li>Primeiro item.</li><li><p>Segundo item.</p></li></ul>',
    )

    expect(dividirEmTrechos(container).map((t) => t.texto)).toEqual([
      'Primeiro item.',
      'Segundo item.',
    ])
  })
})
```

- [ ] **Step 2: Rodar e ver falhar**

Run: `npx vitest run src/lib/escuta/trechos.spec.ts`
Expected: FAIL — `Failed to resolve import "./trechos"`.

- [ ] **Step 3: Implementar**

`src/lib/escuta/trechos.ts`:

```ts
export type Trecho = {
  /** A frase como aparece na tela. */
  texto: string
  /** Onde a frase está no DOM — usado para destacar e para rolar até ela. */
  range: Range
}

const BLOCOS = 'h2, h3, p, li'
/** Uma frase: tudo até . ! ? … (com aspas/parênteses de fechamento), ou até o fim. */
const FRASE = /[^.!?…]+(?:[.!?…]+["”'»)]*|$)/g

function nosDeTexto(elemento: Element) {
  const caminhante = elemento.ownerDocument.createTreeWalker(
    elemento,
    NodeFilter.SHOW_TEXT,
  )
  const nos: Text[] = []
  while (caminhante.nextNode()) nos.push(caminhante.currentNode as Text)
  return nos
}

/** Converte um deslocamento no texto do bloco em (nó de texto, deslocamento no nó). */
function posicao(nos: Text[], deslocamento: number, ehFim: boolean) {
  let resto = deslocamento
  for (const no of nos) {
    if (ehFim ? resto <= no.length : resto < no.length) {
      return [no, resto] as const
    }
    resto -= no.length
  }
  const ultimo = nos[nos.length - 1]
  return [ultimo, ultimo.length] as const
}

/**
 * Divide o texto renderizado em trechos de leitura (DS-06: uma frase cada).
 * Títulos são trechos próprios; blocos de código (<pre>) não são lidos.
 */
export function dividirEmTrechos(container: Element): Trecho[] {
  const blocos = [...container.querySelectorAll(BLOCOS)].filter(
    (bloco) => !bloco.closest('pre') && !bloco.querySelector(BLOCOS),
  )
  const trechos: Trecho[] = []

  for (const bloco of blocos) {
    const nos = nosDeTexto(bloco)
    if (nos.length === 0) continue
    const texto = nos.map((no) => no.data).join('')

    for (const encontrado of texto.matchAll(FRASE)) {
      const bruto = encontrado[0]
      const frase = bruto.trim()
      if (!frase) continue
      const inicio =
        (encontrado.index ?? 0) + (bruto.length - bruto.trimStart().length)
      const fim = inicio + frase.length

      const range = container.ownerDocument.createRange()
      const [noInicio, deslocInicio] = posicao(nos, inicio, false)
      const [noFim, deslocFim] = posicao(nos, fim, true)
      range.setStart(noInicio, deslocInicio)
      range.setEnd(noFim, deslocFim)
      trechos.push({ texto: frase, range })
    }
  }
  return trechos
}
```

- [ ] **Step 4: Rodar e ver passar**

Run: `npx vitest run src/lib/escuta/trechos.spec.ts`
Expected: PASS, `4 passed`.

- [ ] **Step 5: Commit**

```bash
git add src/lib/escuta/trechos.ts src/lib/escuta/trechos.spec.ts
git commit -m "feat: split rendered explanation into sentences"
```

---

### Task 5: Tocar os trechos (`useEscuta`)

**Files:**

- Create: `src/components/aula/use-escuta.ts`
- Test: `src/components/aula/use-escuta.spec.ts`

- [ ] **Step 1: Escrever o teste**

`src/components/aula/use-escuta.spec.ts`:

```ts
import { act, renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useEscuta } from './use-escuta'

/** Uma fala de mentira: o teste dispara onend quando quiser. */
class FalaFalsa {
  text: string
  lang = ''
  rate = 1
  voice: SpeechSynthesisVoice | null = null
  onend: (() => void) | null = null
  onerror: (() => void) | null = null
  constructor(texto: string) {
    this.text = texto
  }
}

function criarSynth() {
  const faladas: FalaFalsa[] = []
  return {
    faladas,
    speak: vi.fn((fala: FalaFalsa) => faladas.push(fala)),
    cancel: vi.fn(),
    getVoices: () =>
      [
        { name: 'Luciana', lang: 'pt-BR', localService: true },
      ] as SpeechSynthesisVoice[],
  }
}

const TRECHOS = ['Um.', 'A tag <p> abre.', 'Três.']

function montar(synth: ReturnType<typeof criarSynth> | null) {
  return renderHook(() =>
    useEscuta({
      trechos: TRECHOS,
      synth: synth as unknown as SpeechSynthesis | null,
      criarFala: (texto) =>
        new FalaFalsa(texto) as unknown as SpeechSynthesisUtterance,
    }),
  )
}

describe('useEscuta', () => {
  beforeEach(() => localStorage.clear())

  it('fica indisponível sem síntese de voz', () => {
    const { result } = montar(null)
    expect(result.current.estado).toBe('indisponivel')
  })

  it('nunca toca sozinho e, ao ouvir, fala o primeiro trecho em pt-BR', () => {
    const synth = criarSynth()
    const { result } = montar(synth)

    expect(result.current.estado).toBe('parado')
    expect(synth.speak).not.toHaveBeenCalled()

    act(() => result.current.ouvir())

    expect(result.current.estado).toBe('tocando')
    expect(result.current.atual).toBe(0)
    expect(synth.faladas[0]).toMatchObject({
      text: 'Um.',
      lang: 'pt-BR',
      rate: 1,
    })
    expect(synth.faladas[0].voice?.name).toBe('Luciana')
  })

  it('segue para o próximo trecho, traduz código e termina no último', () => {
    const synth = criarSynth()
    const { result } = montar(synth)

    act(() => result.current.ouvir())
    act(() => synth.faladas[0].onend?.())
    expect(result.current.atual).toBe(1)
    expect(synth.faladas[1].text).toBe('A tag tag p abre.')

    act(() => synth.faladas[1].onend?.())
    act(() => synth.faladas[2].onend?.())
    expect(result.current.estado).toBe('fim')
    expect(result.current.total).toBe(3)
  })

  it('pausa sem avançar e continua no mesmo trecho', () => {
    const synth = criarSynth()
    const { result } = montar(synth)

    act(() => result.current.ouvir())
    act(() => result.current.pausar())
    expect(result.current.estado).toBe('pausado')
    expect(synth.cancel).toHaveBeenCalled()

    // O navegador avisa o fim da fala cancelada: não pode avançar.
    act(() => synth.faladas[0].onend?.())
    expect(synth.faladas).toHaveLength(1)

    act(() => result.current.continuar())
    expect(result.current.estado).toBe('tocando')
    expect(synth.faladas[1].text).toBe('Um.')
  })

  it('volta e pula sem passar dos limites', () => {
    const synth = criarSynth()
    const { result } = montar(synth)

    act(() => result.current.ouvir())
    act(() => result.current.anterior())
    expect(result.current.atual).toBe(0)

    act(() => result.current.proximo())
    act(() => result.current.proximo())
    act(() => result.current.proximo())
    expect(result.current.atual).toBe(2)
  })

  it('muda a velocidade, lembra e reinicia o trecho atual na velocidade nova', () => {
    const synth = criarSynth()
    const { result } = montar(synth)

    act(() => result.current.ouvir())
    act(() => result.current.mudarVelocidade(1.25))

    expect(result.current.velocidade).toBe(1.25)
    expect(localStorage.getItem('codeluv:velocidade')).toBe('1.25')
    expect(synth.faladas.at(-1)).toMatchObject({ text: 'Um.', rate: 1.25 })
  })

  it('depois do fim, ouvir de novo recomeça do primeiro trecho', () => {
    const synth = criarSynth()
    const { result } = montar(synth)

    act(() => result.current.ouvir())
    act(() => synth.faladas[0].onend?.())
    act(() => synth.faladas[1].onend?.())
    act(() => synth.faladas[2].onend?.())
    act(() => result.current.ouvir())

    expect(result.current.atual).toBe(0)
    expect(synth.faladas.at(-1)?.text).toBe('Um.')
  })
})
```

- [ ] **Step 2: Rodar e ver falhar**

Run: `npx vitest run src/components/aula/use-escuta.spec.ts`
Expected: FAIL — `Failed to resolve import "./use-escuta"`.

- [ ] **Step 3: Implementar**

`src/components/aula/use-escuta.ts`:

```ts
'use client'

import { useEffect, useRef, useState, useSyncExternalStore } from 'react'

import { paraFala } from '@/lib/escuta/fala'
import {
  assinarVelocidade,
  lerVelocidade,
  salvarVelocidade,
  type Velocidade,
} from '@/lib/escuta/velocidade'
import { escolherVoz } from '@/lib/escuta/vozes'

export type EstadoEscuta =
  | 'carregando' // antes de saber se o aparelho tem voz (servidor e hidratação)
  | 'indisponivel'
  | 'parado'
  | 'tocando'
  | 'pausado'
  | 'fim'

type Tocador = {
  estado: 'parado' | 'tocando' | 'pausado' | 'fim'
  atual: number
}

type OpcoesEscuta = {
  trechos: string[]
  /** Injetável nos testes; o padrão é window.speechSynthesis. */
  synth?: SpeechSynthesis | null
  criarFala?: (texto: string) => SpeechSynthesisUtterance
}

const semAssinatura = () => () => {}

function synthDoNavegador() {
  return typeof window !== 'undefined' && window.speechSynthesis
    ? window.speechSynthesis
    : null
}

/**
 * A Luv lendo a explicação (DS 8.2 — ListenControls). Fala um trecho por vez;
 * pausar cancela a fala e lembra o trecho (pause/resume são instáveis nos
 * navegadores). O contador de geração ignora eventos de falas canceladas.
 */
export function useEscuta({
  trechos,
  synth: synthInjetado,
  criarFala = (texto) => new SpeechSynthesisUtterance(texto),
}: OpcoesEscuta) {
  const synth = synthInjetado === undefined ? synthDoNavegador() : synthInjetado
  const suportado = useSyncExternalStore(
    semAssinatura,
    () => synth !== null,
    () => null,
  )
  const velocidade = useSyncExternalStore(
    assinarVelocidade,
    lerVelocidade,
    (): Velocidade => 1,
  )
  const [tocador, setTocador] = useState<Tocador>({
    estado: 'parado',
    atual: 0,
  })
  const geracao = useRef(0)
  const falarRef = useRef<(i: number) => void>(() => {})

  function falar(i: number, ritmo: number = velocidade) {
    if (!synth || trechos.length === 0) return
    const minha = ++geracao.current
    synth.cancel()

    const fala = criarFala(paraFala(trechos[i]))
    fala.lang = 'pt-BR'
    const voz = escolherVoz(synth.getVoices())
    if (voz) fala.voice = voz
    fala.rate = ritmo
    fala.onend = () => {
      if (geracao.current !== minha) return
      if (i + 1 < trechos.length) falarRef.current(i + 1)
      else setTocador({ estado: 'fim', atual: i })
    }
    fala.onerror = () => {
      if (geracao.current !== minha) return
      setTocador({ estado: 'parado', atual: i })
    }

    setTocador({ estado: 'tocando', atual: i })
    synth.speak(fala)
  }

  useEffect(() => {
    falarRef.current = falar
  })

  // Saiu da página: cala a Luv.
  useEffect(
    () => () => {
      geracao.current++
      synth?.cancel()
    },
    [synth],
  )

  const { estado, atual } = tocador
  const ultimo = Math.max(0, trechos.length - 1)

  function pausar() {
    geracao.current++
    synth?.cancel()
    setTocador({ estado: 'pausado', atual })
  }

  function mudarVelocidade(nova: Velocidade) {
    salvarVelocidade(nova)
    if (estado === 'tocando') falar(atual, nova)
  }

  const estadoVisivel: EstadoEscuta =
    suportado === null ? 'carregando' : suportado ? estado : 'indisponivel'

  return {
    estado: estadoVisivel,
    atual,
    total: trechos.length,
    velocidade,
    ouvir: () => falar(estado === 'fim' ? 0 : atual),
    pausar,
    continuar: () => falar(atual),
    repetir: () => falar(atual),
    anterior: () => falar(Math.max(0, atual - 1)),
    proximo: () => falar(Math.min(ultimo, atual + 1)),
    irPara: (i: number) => falar(i),
    mudarVelocidade,
  }
}
```

- [ ] **Step 4: Rodar e ver passar**

Run: `npx vitest run src/components/aula/use-escuta.spec.ts`
Expected: PASS, `7 passed`.

- [ ] **Step 5: Commit**

```bash
git add src/components/aula/use-escuta.ts src/components/aula/use-escuta.spec.ts
git commit -m "feat: read explanation sentences with the web speech api"
```

---

### Task 6: Controles da escuta (`ListenControls`)

**Files:**

- Create: `src/components/aula/listen-controls.tsx`
- Test: `src/components/aula/listen-controls.spec.tsx`

- [ ] **Step 1: Escrever o teste**

`src/components/aula/listen-controls.spec.tsx`:

```tsx
import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { ListenControls } from './listen-controls'
import type { EstadoEscuta } from './use-escuta'

function montar(estado: EstadoEscuta, atual = 0) {
  const acoes = {
    onOuvir: vi.fn(),
    onPausar: vi.fn(),
    onContinuar: vi.fn(),
    onAnterior: vi.fn(),
    onProximo: vi.fn(),
    onRepetir: vi.fn(),
    onVelocidade: vi.fn(),
  }
  render(
    <ListenControls
      estado={estado}
      atual={atual}
      total={12}
      velocidade={1}
      {...acoes}
    />,
  )
  return acoes
}

describe('ListenControls', () => {
  it('parado: oferece ouvir e desliga a navegação entre trechos', async () => {
    const user = userEvent.setup()
    const acoes = montar('parado')

    await user.click(screen.getByRole('button', { name: 'Ouvir explicação' }))
    expect(acoes.onOuvir).toHaveBeenCalled()
    expect(
      screen.getByRole('button', { name: 'Próximo trecho' }),
    ).toBeDisabled()
    expect(screen.queryByText(/Trecho/)).not.toBeInTheDocument()
  })

  it('tocando: oferece pausar e mostra em que trecho está', async () => {
    const user = userEvent.setup()
    const acoes = montar('tocando', 2)

    expect(screen.getByText('Trecho 3 de 12')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Pausar' }))
    expect(acoes.onPausar).toHaveBeenCalled()
    await user.click(screen.getByRole('button', { name: 'Repetir trecho' }))
    expect(acoes.onRepetir).toHaveBeenCalled()
  })

  it('pausado: oferece continuar', async () => {
    const user = userEvent.setup()
    const acoes = montar('pausado')

    await user.click(screen.getByRole('button', { name: 'Continuar' }))
    expect(acoes.onContinuar).toHaveBeenCalled()
  })

  it('fim: oferece ouvir de novo', async () => {
    const user = userEvent.setup()
    const acoes = montar('fim')

    await user.click(screen.getByRole('button', { name: 'Ouvir de novo' }))
    expect(acoes.onOuvir).toHaveBeenCalled()
  })

  it('indisponível: explica e não deixa ouvir', () => {
    montar('indisponivel')

    expect(
      screen.getByText(
        'A voz não está disponível neste aparelho. O texto está todo aqui.',
      ),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Ouvir explicação' }),
    ).toBeDisabled()
  })

  it('setas do teclado voltam e pulam trechos durante a escuta', () => {
    const acoes = montar('tocando', 1)
    const grupo = screen.getByRole('group', { name: 'Controle da escuta' })

    fireEvent.keyDown(grupo, { key: 'ArrowLeft' })
    fireEvent.keyDown(grupo, { key: 'ArrowRight' })
    expect(acoes.onAnterior).toHaveBeenCalledTimes(1)
    expect(acoes.onProximo).toHaveBeenCalledTimes(1)
  })

  it('escolhe a velocidade', async () => {
    const user = userEvent.setup()
    const acoes = montar('parado')

    expect(
      screen.getByRole('button', { name: 'Velocidade 1×' }),
    ).toHaveAttribute('aria-pressed', 'true')
    await user.click(screen.getByRole('button', { name: 'Velocidade 1,25×' }))
    expect(acoes.onVelocidade).toHaveBeenCalledWith(1.25)
  })
})
```

- [ ] **Step 2: Rodar e ver falhar**

Run: `npx vitest run src/components/aula/listen-controls.spec.tsx`
Expected: FAIL — `Failed to resolve import "./listen-controls"`.

- [ ] **Step 3: Implementar**

`src/components/aula/listen-controls.tsx`:

```tsx
'use client'

import {
  PauseIcon,
  PlayIcon,
  RotateCcwIcon,
  SkipBackIcon,
  SkipForwardIcon,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { VELOCIDADES, type Velocidade } from '@/lib/escuta/velocidade'

import type { EstadoEscuta } from './use-escuta'

const ROTULO: Record<Velocidade, string> = {
  0.75: '0,75×',
  1: '1×',
  1.25: '1,25×',
  1.5: '1,5×',
}

type ListenControlsProps = {
  estado: EstadoEscuta
  atual: number
  total: number
  velocidade: Velocidade
  onOuvir: () => void
  onPausar: () => void
  onContinuar: () => void
  onAnterior: () => void
  onProximo: () => void
  onRepetir: () => void
  onVelocidade: (velocidade: Velocidade) => void
}

/**
 * Controle da escuta (DS 8.2 — ListenControls). Nunca começa sozinho.
 * "Trecho N de M" não fica em região viva: mudanças de trecho não são
 * anunciadas (evita voz sobre voz — DS 11).
 */
export function ListenControls(props: ListenControlsProps) {
  const { estado } = props
  const emAndamento = estado === 'tocando' || estado === 'pausado'

  const principal =
    estado === 'tocando'
      ? { rotulo: 'Pausar', Icone: PauseIcon, acao: props.onPausar }
      : estado === 'pausado'
        ? { rotulo: 'Continuar', Icone: PlayIcon, acao: props.onContinuar }
        : estado === 'fim'
          ? {
              rotulo: 'Ouvir de novo',
              Icone: RotateCcwIcon,
              acao: props.onOuvir,
            }
          : { rotulo: 'Ouvir explicação', Icone: PlayIcon, acao: props.onOuvir }

  function atalhos(evento: React.KeyboardEvent) {
    if (!emAndamento) return
    if (evento.key === 'ArrowLeft') {
      evento.preventDefault()
      props.onAnterior()
    } else if (evento.key === 'ArrowRight') {
      evento.preventDefault()
      props.onProximo()
    }
  }

  return (
    <Card size="sm">
      <CardContent className="flex flex-col gap-2">
        <div
          role="group"
          aria-label="Controle da escuta"
          className="flex flex-wrap items-center gap-2"
          onKeyDown={atalhos}
        >
          <Button
            onClick={principal.acao}
            disabled={estado === 'carregando' || estado === 'indisponivel'}
          >
            <principal.Icone data-icon="inline-start" />
            {principal.rotulo}
          </Button>
          <Button
            variant="outline"
            size="icon"
            aria-label="Trecho anterior"
            disabled={!emAndamento}
            onClick={props.onAnterior}
          >
            <SkipBackIcon />
          </Button>
          <Button
            variant="outline"
            size="icon"
            aria-label="Repetir trecho"
            disabled={!emAndamento}
            onClick={props.onRepetir}
          >
            <RotateCcwIcon />
          </Button>
          <Button
            variant="outline"
            size="icon"
            aria-label="Próximo trecho"
            disabled={!emAndamento}
            onClick={props.onProximo}
          >
            <SkipForwardIcon />
          </Button>
          <ToggleGroup
            aria-label="Velocidade da voz"
            variant="outline"
            value={[String(props.velocidade)]}
            onValueChange={(valores) => {
              const escolhida = Number(valores[0])
              if ((VELOCIDADES as readonly number[]).includes(escolhida)) {
                props.onVelocidade(escolhida as Velocidade)
              }
            }}
          >
            {VELOCIDADES.map((v) => (
              <ToggleGroupItem
                key={v}
                value={String(v)}
                aria-label={`Velocidade ${ROTULO[v]}`}
              >
                {ROTULO[v]}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>

        {emAndamento && (
          <p className="text-sm text-muted-foreground">
            Trecho {props.atual + 1} de {props.total}
          </p>
        )}
        {estado === 'indisponivel' && (
          <p className="text-sm text-muted-foreground">
            A voz não está disponível neste aparelho. O texto está todo aqui.
          </p>
        )}
      </CardContent>
    </Card>
  )
}
```

- [ ] **Step 4: Rodar e ver passar**

Run: `npx vitest run src/components/aula/listen-controls.spec.tsx`
Expected: PASS, `7 passed`.

Se o teste de velocidade não achar `aria-pressed` no item do `ToggleGroup`, confira em `src/components/ui/toggle-group.tsx`/`toggle.tsx` que atributo o Base UI usa para o estado pressionado (`aria-pressed` é o padrão do `Toggle`) — ajuste só a asserção, mantendo a verificação de qual velocidade está ativa.

- [ ] **Step 5: Commit**

```bash
git add src/components/aula/listen-controls.tsx src/components/aula/listen-controls.spec.tsx
git commit -m "feat: add listen controls"
```

---

### Task 7: `Escuta` na página da aula

**Files:**

- Create: `src/components/aula/escuta.tsx`
- Modify: `src/app/globals.css`
- Modify: `src/app/(aula)/aulas/[slug]/page.tsx`

- [ ] **Step 1: Estilo do trecho em leitura (DS-06)**

Em `src/app/globals.css`, logo depois do bloco `@media (prefers-reduced-motion: reduce) { … }` no fim do arquivo:

```css
/* Trecho em leitura na escuta (DS-06): dois sinais — fundo e sublinhado — e sem transição. */
::highlight(leitura) {
  background-color: var(--highlight);
  text-decoration: underline 2px var(--primary);
  text-underline-offset: 4px;
}
```

- [ ] **Step 2: Componente `Escuta`**

`src/components/aula/escuta.tsx`:

```tsx
'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'

import { dividirEmTrechos, type Trecho } from '@/lib/escuta/trechos'

import { ListenControls } from './listen-controls'
import { useEscuta } from './use-escuta'

type EscutaProps = {
  children: React.ReactNode
  /** id do elemento que recebe o foco quando a leitura termina (DS 8.2). */
  focoAoTerminar?: string
}

/** Ponto do clique → posição no texto (Chrome/Firefox e Safari têm APIs diferentes). */
function pontoNoTexto(x: number, y: number) {
  const posicao = document.caretPositionFromPoint?.(x, y)
  if (posicao) return { no: posicao.offsetNode, deslocamento: posicao.offset }
  const range = document.caretRangeFromPoint?.(x, y)
  if (range)
    return { no: range.startContainer, deslocamento: range.startOffset }
  return null
}

/**
 * A explicação com a escuta (DS 9 — Escuta): controles fixos no topo, trecho
 * destacado com a CSS Custom Highlight API (sem mexer no DOM do React) e foco
 * na prática ao terminar.
 */
export function Escuta({ children, focoAoTerminar }: EscutaProps) {
  const [trechos, setTrechos] = useState<Trecho[]>([])
  // Ref callback: mede o texto quando ele entra no DOM (sem setState em efeito).
  const medir = useCallback((elemento: HTMLDivElement | null) => {
    if (elemento) setTrechos(dividirEmTrechos(elemento))
  }, [])
  const textos = useMemo(() => trechos.map((t) => t.texto), [trechos])
  const escuta = useEscuta({ trechos: textos })
  const { estado, atual } = escuta

  useEffect(() => {
    if (typeof CSS === 'undefined' || !('highlights' in CSS)) return
    const trecho = trechos[atual]
    if ((estado === 'tocando' || estado === 'pausado') && trecho) {
      CSS.highlights.set('leitura', new Highlight(trecho.range))
      trecho.range.startContainer.parentElement?.scrollIntoView({
        block: 'nearest',
      })
    } else {
      CSS.highlights.delete('leitura')
    }
    return () => {
      CSS.highlights.delete('leitura')
    }
  }, [estado, atual, trechos])

  useEffect(() => {
    if (estado === 'fim' && focoAoTerminar) {
      document.getElementById(focoAoTerminar)?.focus()
    }
  }, [estado, focoAoTerminar])

  // Clicar numa frase pula para ela — só com a escuta em andamento, para um
  // clique de seleção nunca disparar som (briefing: nada toca sozinho).
  function pularParaOClique(evento: React.MouseEvent) {
    if (estado !== 'tocando' && estado !== 'pausado') return
    const ponto = pontoNoTexto(evento.clientX, evento.clientY)
    if (!ponto) return
    const i = trechos.findIndex((t) =>
      t.range.isPointInRange(ponto.no, ponto.deslocamento),
    )
    if (i >= 0) escuta.irPara(i)
  }

  return (
    <section aria-label="Explicação" className="flex flex-col gap-5">
      <div className="sticky top-[calc(4rem+2px)] z-10 bg-background py-2">
        <ListenControls
          estado={estado}
          atual={atual}
          total={escuta.total}
          velocidade={escuta.velocidade}
          onOuvir={escuta.ouvir}
          onPausar={escuta.pausar}
          onContinuar={escuta.continuar}
          onAnterior={escuta.anterior}
          onProximo={escuta.proximo}
          onRepetir={escuta.repetir}
          onVelocidade={escuta.mudarVelocidade}
        />
      </div>
      <div
        ref={medir}
        onClick={pularParaOClique}
        className="flex flex-col gap-4"
      >
        {children}
      </div>
    </section>
  )
}
```

Observação: `top-[calc(4rem+2px)]` é a altura da `LessonHeader` (`h-16` + borda de 2px), para os controles ficarem logo abaixo dela.

- [ ] **Step 3: Usar na página da aula**

Em `src/app/(aula)/aulas/[slug]/page.tsx`, dentro de `AulaConteudo`:

1. Importar `import { Escuta } from '@/components/aula/escuta'`.
2. Trocar `<Explicacao />` por:

```tsx
<Escuta focoAoTerminar="pratica">
  <Explicacao />
</Escuta>
```

3. Envolver o `<Practice … />` para ele poder receber o foco ao fim da escuta:

```tsx
<div id="pratica" tabIndex={-1} className="outline-none">
  <Practice
    aula={aula}
    proxima={proxima && { slug: proxima.slug, titulo: proxima.titulo }}
  />
</div>
```

- [ ] **Step 4: Verificar**

Run: `npx eslint . && npx next typegen && npx tsc --noEmit && npm test && npm run build`
Expected: tudo verde; `/aulas/[slug]` continua `◐` com `/aulas/seu-primeiro-html` pré-renderizada.

Se o `tsc` reclamar de `Highlight`, `CSS.highlights` ou `caretPositionFromPoint` (tipos do DOM), confira a versão do TypeScript (`npx tsc -v`, precisa ser 5.x recente). Não use `any`: se faltar tipo, declare só o que falta num `src/types/dom-extra.d.ts` e explique no commit.

- [ ] **Step 5: Ouvir de verdade**

Com o servidor de desenvolvimento rodando, abra `/aulas/seu-primeiro-html` no Chrome ou no Safari, clique em "Ouvir explicação" e confira:

- a voz é em português e fala "tag h1"/"tag de fechamento p" nos trechos com código;
- o trecho lido aparece com fundo e sublinhado, sem animação;
- "Pausar" para; "Continuar" recomeça a frase; ←/→ com o foco nos controles voltam e pulam;
- mudar para 1,25× acelera e continua 1,25× depois de recarregar;
- ao terminar, o foco vai para a prática.

Anote no relatório a voz que o navegador escolheu e como soou (isso responde a Q1 do briefing).

- [ ] **Step 6: Commit**

```bash
git add src/components/aula/escuta.tsx src/app/globals.css "src/app/(aula)/aulas/[slug]/page.tsx"
git commit -m "feat: let the luv read the lesson explanation aloud"
```

---

### Task 8: Escuta de ponta a ponta

A voz de verdade não existe no Chromium do Playwright (e não daria para conferir o que foi dito). O teste instala uma síntese de voz simulada antes de a página carregar, que guarda o que foi falado em `window.__falas`.

**Files:**

- Create: `e2e/escuta.spec.ts`

- [ ] **Step 1: Escrever o teste**

`e2e/escuta.spec.ts`:

```ts
import { expect, type Page, test } from '@playwright/test'

test.use({ viewport: { width: 1280, height: 900 } })

const URL_AULA = '/aulas/seu-primeiro-html'

declare global {
  interface Window {
    __falas: string[]
  }
}

/** Instala uma síntese de voz simulada; cada fala termina depois de `duracaoMs`. */
async function vozSimulada(page: Page, duracaoMs: number) {
  await page.addInitScript((duracao) => {
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
      getVoices: () => [
        {
          name: 'Teste',
          lang: 'pt-BR',
          localService: true,
          default: true,
          voiceURI: 'teste',
        },
      ],
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
  }, duracaoMs)
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
  ).toBeDisabled()
  await expect(
    page.getByRole('heading', { name: 'O que é HTML' }),
  ).toBeVisible()
})
```

Observação: o teste "pausar…" pressiona `ArrowLeft` logo depois de clicar em "Próximo trecho" — o foco continua nesse botão, dentro do grupo, então o atalho vale.

- [ ] **Step 2: Rodar**

Garanta que nada escuta na porta 3000 (`lsof -iTCP:3000 -sTCP:LISTEN`) e rode `npm run test:e2e`.
Expected: `17 passed` (13 anteriores + 4 novos). O teste de acessibilidade da aula (em `aula.spec.ts`) agora também cobre os controles da escuta — se o axe apontar algo neles, corrija o componente, nunca a regra.

- [ ] **Step 3: Commit**

```bash
git add e2e/escuta.spec.ts
git commit -m "test: cover listening end to end with a simulated voice"
```

---

### Task 9: Design system e verificação final

**Files:**

- Modify: `docs/design-system.md`

- [ ] **Step 1: Inventário (DS 8.1)**

Marcar `pronto` e ajustar a coluna "Base shadcn" destas linhas:

| Componente       | Base shadcn (novo texto)                                                                                                             |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `ListenControls` | `card` + `button` + `toggle-group` — `src/components/aula/listen-controls.tsx`                                                       |
| `ReadAlongText`  | CSS Custom Highlight API (`::highlight(leitura)`) sobre o texto MDX — `src/components/aula/escuta.tsx` + `src/lib/escuta/trechos.ts` |

- [ ] **Step 2: Divergências (DS 13.4)**

Acrescentar:

```markdown
| Controles da escuta no celular | código | ficam fixos no topo (abaixo da barra da aula), não na base | avaliar com a aluna no celular | Fase 2 |
| Avatar da Luv nos controles da escuta | código | os controles não mostram a Luv (a página já tem a Luv do objetivo — uma Luv por tela) | manter | — |
| Clique no texto para ouvir dali | código | só pula de trecho com a escuta em andamento; parada, um clique não toca nada (nada toca sozinho) | manter | — |
| Destaque do trecho sem a CSS Custom Highlight API | código | navegadores sem a API leem normalmente, sem destaque | aceitar (API presente em Chrome, Safari e Firefox atuais) | — |
| Velocidade guardada à parte | código | fica em `localStorage` (`codeluv:velocidade`), fora do progresso | juntar ao progresso no Plano 4 | Plano 4 |
```

- [ ] **Step 3: Histórico do DS**

Versão `0.4.0` no cabeçalho e, no fim da tabela "Histórico deste documento":

```markdown
| 2026-10-09 | 0.4.0 — Plano 3 entregue: escuta com ListenControls e destaque do trecho (ReadAlongText) | Claudio Soares |
```

- [ ] **Step 4: Verificação final**

Run: `npx eslint . && npx next typegen && npx tsc --noEmit && npm test && npm run build && npm run test:e2e`
Expected: lint e tipos limpos; Vitest com 22 arquivos / 120 testes (16/89 + fala 4, vozes 4, velocidade 5, trechos 4, use-escuta 7, listen-controls 7); build verde; Playwright `17 passed`.

- [ ] **Step 5: Commit**

```bash
git add docs/design-system.md
git commit -m "docs: update design system after plano 3"
```

---

## Fora deste plano (próximos)

- **Plano 4 — Progresso e site pessoal:** salvar progresso e código, juntar a velocidade ao progresso, "Continuar" no Início, Meu site, primeira conquista.
- **Q1 do briefing:** a Task 7 (Step 5) registra a voz escolhida e a impressão; a decisão de manter a voz do navegador ou gerar áudio fica para depois de a aluna usar.
- **Ler o código do exemplo** (símbolo a símbolo) e **vozes diferentes por personagem**: fora da HU-02.
