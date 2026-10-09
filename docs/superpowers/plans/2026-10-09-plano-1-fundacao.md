# Plano 1 — Fundação: Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Deixar o CodeLuv com a casca navegável e testada — tokens verificados, Luv, moldura retrô, estado vazio, cabeçalho com navegação (desktop e celular) e as cinco páginas da Fase 1 em estado inicial — sobre a base shadcn/ui já tematizada.

**Architecture:** Next.js 16 (App Router, `cacheComponents` ligado) com shadcn/ui (`base-nova`, Base UI) em `src/components/ui/`. Componentes do CodeLuv são composições em `src/components/` (`luv/`, `layout/`, raiz). Páginas do app ficam no grupo de rotas `src/app/(app)/`, que tem o cabeçalho; o Plano 2 criará outro grupo para a aula, sem o cabeçalho principal. Nada de estado persistido neste plano — progresso e nome da aluna chegam no Plano 4.

**Tech Stack:** Next.js 16.4, React 19.3, TypeScript, Tailwind CSS 4, shadcn/ui (Base UI, Lucide), Vitest 5 + Testing Library + jsdom, Playwright + axe-core.

**Documentos de referência (ler antes de começar):**

- `docs/briefing.md` — intenção do produto.
- `docs/design-system.md` — tokens, componentes e regras (versão 0.2.0). Seções 3, 5.3, 6.2, 8 e 9 são usadas aqui.
- `AGENTS.md` — esta versão do Next.js tem mudanças; consultar `node_modules/next/dist/docs/` antes de usar uma API do Next.
- Skill `shadcn` (`.claude/skills/shadcn`) — regras de composição: `gap-*` em vez de `space-*`, `size-*`, ícones com `data-icon`, sem `z-index` manual em sobreposições.

**Escolhas visuais (feitas no visual companion, 2026-10-09):** 1B cabeçalho com sublinhado rosa no destino ativo · 2A gaveta lateral no celular · 3C balão da Luv tingido · 4A janela retrô com três bolinhas · 5A estado vazio limpo · 6B Início com a Luv grande. Registradas no design system como DS-12.

**Convenções do repositório:**

- Prettier: sem ponto e vírgula, aspas simples, `trailingComma: 'all'`.
- ESLint ordena imports (`simple-import-sort`): `react`/`next` → pacotes → `@/` → relativos.
- Testes unitários: `src/**/*.spec.{ts,tsx}`, ao lado do código, sempre importando de `vitest` (`globals: false`).
- Commits: Conventional Commits em minúsculas (commitlint roda no `commit-msg`); `lint-staged` roda Prettier + ESLint no `pre-commit`.
- **Links com cara de botão** usam `buttonVariants` num `<Link>`; nunca `<Button render={<Link />}>` (vira `role="button"` — DS seção 8.2).

---

## Mapa de arquivos

| Arquivo                                      | Ação      | Responsabilidade                                                         |
| -------------------------------------------- | --------- | ------------------------------------------------------------------------ |
| `vitest.setup.ts`                            | criar     | limpeza do DOM entre testes + matchers do jest-dom                       |
| `vitest.config.mts`                          | modificar | registrar `setupFiles`                                                   |
| `src/lib/design/contrast.ts`                 | criar     | razão de contraste WCAG entre duas cores hex                             |
| `src/lib/design/contrast.spec.ts`            | criar     | testes da fórmula                                                        |
| `src/app/tokens.spec.ts`                     | criar     | garante que os pares de cor do DS (tabela 3.1) continuam passando        |
| `src/components/luv/luv-states.ts`           | criar     | estados da Luv e caminho da arte de cada um                              |
| `src/components/luv/luv-states.spec.ts`      | criar     | testes do mapeamento                                                     |
| `src/components/luv/luv-avatar.tsx`          | criar     | avatar da Luv (`Avatar` xl/lg + fallback)                                |
| `src/components/luv/luv-says.tsx`            | criar     | balão da Luv (`Message` + `Bubble`), região `status`                     |
| `src/components/luv/luv-says.spec.tsx`       | criar     | testes do balão                                                          |
| `src/components/retro-window.tsx`            | criar     | moldura "janela retrô"                                                   |
| `src/components/retro-window.spec.tsx`       | criar     | testes da moldura                                                        |
| `src/components/empty-state.tsx`             | criar     | estado vazio com Luv (`Empty` + `LuvAvatar` + link de ação)              |
| `src/components/empty-state.spec.tsx`        | criar     | testes do estado vazio                                                   |
| `src/components/layout/nav-items.ts`         | criar     | destinos da navegação + regra de item ativo                              |
| `src/components/layout/nav-items.spec.ts`    | criar     | testes da regra de item ativo                                            |
| `src/components/layout/site-header.tsx`      | criar     | cabeçalho: logotipo, navegação desktop, gaveta no celular, Configurações |
| `src/components/layout/site-header.spec.tsx` | criar     | testes do cabeçalho                                                      |
| `src/app/layout.tsx`                         | modificar | template de título                                                       |
| `src/app/page.tsx`                           | remover   | sai do scaffold; Início passa para o grupo `(app)`                       |
| `src/app/(app)/layout.tsx`                   | criar     | cabeçalho + área de conteúdo                                             |
| `src/app/(app)/page.tsx`                     | criar     | Início                                                                   |
| `src/app/(app)/aulas/page.tsx`               | criar     | Aulas (estado inicial)                                                   |
| `src/app/(app)/meu-site/page.tsx`            | criar     | Meu site (estado inicial)                                                |
| `src/app/(app)/conquistas/page.tsx`          | criar     | Conquistas (estado inicial)                                              |
| `src/app/(app)/configuracoes/page.tsx`       | criar     | Configurações (estado inicial)                                           |
| `e2e/home.spec.ts`                           | remover   | substituído                                                              |
| `e2e/navigation.spec.ts`                     | criar     | navegação desktop/celular + verificação de acessibilidade                |
| `src/app/preview/page.tsx`                   | remover   | rota provisória de validação visual                                      |
| `src/smoke.spec.ts`                          | remover   | substituído por testes reais                                             |
| `docs/design-system.md`                      | modificar | inventário e divergências após a entrega                                 |

---

### Task 0: Registrar o ponto de partida

O repositório tem trabalho não commitado: documentos, imagens, shadcn/ui instalado e tema aplicado. Ele vira a base do plano.

**Files:** nenhum arquivo novo.

- [ ] **Step 1: Conferir o estado**

Run: `git status --short`
Expected: alterações em `.gitignore`, `package.json`, `package-lock.json`, `src/app/globals.css`, `src/app/layout.tsx`; novos `components.json`, `docs/`, `public/`, `src/components/`, `src/hooks/`, `src/lib/`, `src/app/preview/`. `.superpowers/` **não** aparece (está no `.gitignore`).

- [ ] **Step 2: Verificar que tudo passa antes de commitar**

Run: `npx eslint . && npx tsc --noEmit && npm test`
Expected: sem erros de lint, sem erros de tipo, `1 passed`.

- [ ] **Step 3: Commit dos documentos e imagens**

```bash
git add docs/ public/images/
git commit -m "docs: add briefing, design system and brand assets"
```

- [ ] **Step 4: Commit da base shadcn/ui e do tema**

```bash
git add .gitignore package.json package-lock.json components.json src/
git commit -m "feat: add shadcn/ui base with codeluv y2k theme"
```

Expected: os hooks rodam (`lint-staged`, `commitlint`) e os dois commits entram. `git status --short` mostra só `.claude/` (configuração local, fora deste plano).

---

### Task 1: Infraestrutura de testes de componente

**Files:**

- Create: `vitest.setup.ts`
- Modify: `vitest.config.mts`

- [ ] **Step 1: Instalar as dependências de teste**

Run: `npm i -D @testing-library/jest-dom @testing-library/user-event @axe-core/playwright`
Expected: as três aparecem em `devDependencies`.

- [ ] **Step 2: Criar o setup**

`vitest.setup.ts`:

```ts
import '@testing-library/jest-dom/vitest'

import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

// Com globals: false, a Testing Library não limpa o DOM sozinha.
afterEach(() => {
  cleanup()
})
```

- [ ] **Step 3: Registrar o setup no Vitest**

Em `vitest.config.mts`, dentro de `test`, adicionar `setupFiles` logo após `environment`:

```ts
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    include: ['src/**/*.spec.{ts,tsx}'],
```

- [ ] **Step 4: Rodar a suíte**

Run: `npm test`
Expected: `1 passed` (o teste de fumaça continua passando com o setup novo).

- [ ] **Step 5: Commit**

```bash
git add vitest.setup.ts vitest.config.mts package.json package-lock.json
git commit -m "test: add testing library setup and axe for e2e"
```

---

### Task 2: Contraste dos tokens como teste

Garante que a tabela 3.1 do design system continua verdadeira: se alguém trocar uma cor em `globals.css`, o teste quebra.

**Files:**

- Create: `src/lib/design/contrast.ts`
- Test: `src/lib/design/contrast.spec.ts`
- Test: `src/app/tokens.spec.ts`

- [ ] **Step 1: Escrever o teste da fórmula**

`src/lib/design/contrast.spec.ts`:

```ts
import { describe, expect, it } from 'vitest'

import { contrastRatio } from './contrast'

describe('contrastRatio', () => {
  it('é 21 entre preto e branco', () => {
    expect(contrastRatio('#000000', '#ffffff')).toBeCloseTo(21, 1)
  })

  it('é 1 entre cores iguais', () => {
    expect(contrastRatio('#ff4ab3', '#ff4ab3')).toBeCloseTo(1, 5)
  })

  it('não depende da ordem', () => {
    expect(contrastRatio('#101017', '#f6e8d8')).toBeCloseTo(
      contrastRatio('#f6e8d8', '#101017'),
      5,
    )
  })

  it('bate com o valor do design system (rosa sobre escuro ≈ 6.21)', () => {
    expect(contrastRatio('#ff4ab3', '#101017')).toBeCloseTo(6.21, 2)
  })

  it('aceita maiúsculas', () => {
    expect(contrastRatio('#FF4AB3', '#101017')).toBeCloseTo(6.21, 2)
  })

  it('rejeita cor fora do formato #rrggbb', () => {
    expect(() => contrastRatio('pink', '#101017')).toThrow('Cor inválida: pink')
  })
})
```

- [ ] **Step 2: Rodar e ver falhar**

Run: `npx vitest run src/lib/design/contrast.spec.ts`
Expected: FAIL — `Failed to resolve import "./contrast"`.

- [ ] **Step 3: Implementar**

`src/lib/design/contrast.ts`:

```ts
const HEX = /^#([0-9a-f]{6})$/i

function channel(value: number) {
  const c = value / 255
  return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
}

function luminance(hex: string) {
  const match = HEX.exec(hex)
  if (!match) throw new Error(`Cor inválida: ${hex}`)
  const n = parseInt(match[1], 16)
  const r = channel((n >> 16) & 0xff)
  const g = channel((n >> 8) & 0xff)
  const b = channel(n & 0xff)
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

/** Razão de contraste WCAG 2.x entre duas cores `#rrggbb`. */
export function contrastRatio(a: string, b: string) {
  const la = luminance(a)
  const lb = luminance(b)
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05)
}
```

- [ ] **Step 4: Rodar e ver passar**

Run: `npx vitest run src/lib/design/contrast.spec.ts`
Expected: PASS, `6 passed`.

- [ ] **Step 5: Escrever o teste dos tokens**

`src/app/tokens.spec.ts` (roda no ambiente `node`: no jsdom, `import.meta.url` não é uma URL `file:`):

```ts
// @vitest-environment node
import { readFileSync } from 'node:fs'

import { describe, expect, it } from 'vitest'

import { contrastRatio } from '@/lib/design/contrast'

const css = readFileSync(new URL('./globals.css', import.meta.url), 'utf8')

/** Primitivos declarados como `--familia-tom: #rrggbb;` em globals.css. */
const primitives = Object.fromEntries(
  [...css.matchAll(/--([a-z]+-\d+):\s*(#[0-9a-f]{6});/gi)].map(([, n, v]) => [
    n,
    v,
  ]),
)

const TEXT = 4.5
const NON_TEXT = 3

// [frente, fundo, mínimo, uso] — tabela 3.1 de docs/design-system.md
const PAIRS: [string, string, number, string][] = [
  // tema escuro
  ['cream-100', 'ink-950', TEXT, 'texto principal'],
  ['pink-100', 'ink-950', TEXT, 'texto de apoio'],
  ['pink-400', 'ink-950', TEXT, 'link'],
  ['ink-950', 'pink-500', TEXT, 'texto sobre o botão rosa'],
  ['pink-500', 'ink-950', NON_TEXT, 'foco e ação'],
  ['violet-500', 'ink-950', NON_TEXT, 'contorno'],
  ['success-400', 'ink-950', TEXT, 'conferência certa'],
  ['warning-300', 'ink-950', TEXT, 'pista'],
  ['danger-400', 'ink-950', TEXT, 'ainda não'],
  ['cream-100', 'ink-800', TEXT, 'texto no editor'],
  ['pink-400', 'ink-800', TEXT, 'tags no editor'],
  ['violet-300', 'ink-800', TEXT, 'atributos no editor'],
  ['ink-400', 'ink-800', TEXT, 'comentários no editor'],
  // tema claro
  ['ink-950', 'cream-100', TEXT, 'texto principal (claro)'],
  ['ink-600', 'cream-100', TEXT, 'texto de apoio (claro)'],
  ['pink-700', 'cream-100', TEXT, 'link e foco (claro)'],
  ['violet-700', 'cream-100', NON_TEXT, 'contorno (claro)'],
  ['success-700', 'cream-100', TEXT, 'conferência certa (claro)'],
  ['warning-700', 'cream-100', TEXT, 'pista (claro)'],
  ['danger-700', 'cream-100', TEXT, 'ainda não (claro)'],
]

describe('tokens de cor', () => {
  it('encontra os primitivos em globals.css', () => {
    expect(Object.keys(primitives).length).toBeGreaterThanOrEqual(20)
  })

  it.each(PAIRS)('%s sobre %s ≥ %s (%s)', (fg, bg, min) => {
    expect(primitives[fg], `primitivo --${fg} não encontrado`).toBeDefined()
    expect(primitives[bg], `primitivo --${bg} não encontrado`).toBeDefined()
    expect(
      contrastRatio(primitives[fg], primitives[bg]),
    ).toBeGreaterThanOrEqual(min)
  })
})
```

- [ ] **Step 6: Rodar**

Run: `npx vitest run src/app/tokens.spec.ts`
Expected: PASS, `21 passed`. (Se algum par falhar, o token está errado em `globals.css` — corrigir a cor, não o teste.)

- [ ] **Step 7: Commit**

```bash
git add src/lib/design src/app/tokens.spec.ts
git commit -m "test: guard design system color contrast"
```

---

### Task 3: Estados e avatar da Luv

**Files:**

- Create: `src/components/luv/luv-states.ts`
- Test: `src/components/luv/luv-states.spec.ts`
- Create: `src/components/luv/luv-avatar.tsx`

- [ ] **Step 1: Escrever o teste dos estados**

`src/components/luv/luv-states.spec.ts`:

```ts
import { describe, expect, it } from 'vitest'

import { LUV_STATES, luvImage } from './luv-states'

describe('luv-states', () => {
  it('tem os oito estados do design system', () => {
    expect(LUV_STATES).toEqual([
      'ola',
      'aprender',
      'praticar',
      'pista',
      'incentivo',
      'comemorar',
      'descansar',
      'evoluir',
    ])
  })

  it('usa a arte própria quando existe', () => {
    expect(luvImage('ola')).toBe('/images/luv/ola.png')
  })

  it('usa a arte de boas-vindas para estados sem arte própria', () => {
    expect(luvImage('descansar')).toBe('/images/luv/ola.png')
  })

  it('devolve um caminho para todos os estados', () => {
    for (const state of LUV_STATES) {
      expect(luvImage(state)).toMatch(/^\/images\/luv\/.+\.png$/)
    }
  })
})
```

- [ ] **Step 2: Rodar e ver falhar**

Run: `npx vitest run src/components/luv/luv-states.spec.ts`
Expected: FAIL — `Failed to resolve import "./luv-states"`.

- [ ] **Step 3: Implementar**

`src/components/luv/luv-states.ts`:

```ts
export const LUV_STATES = [
  'ola',
  'aprender',
  'praticar',
  'pista',
  'incentivo',
  'comemorar',
  'descansar',
  'evoluir',
] as const

export type LuvState = (typeof LUV_STATES)[number]

/**
 * Arte disponível em public/images/luv/. Estados sem arte própria usam a de
 * boas-vindas até os recortes existirem (design system, seção 13.4).
 */
const LUV_ART: Partial<Record<LuvState, string>> = {
  ola: '/images/luv/ola.png',
}

export function luvImage(state: LuvState) {
  return LUV_ART[state] ?? '/images/luv/ola.png'
}
```

- [ ] **Step 4: Rodar e ver passar**

Run: `npx vitest run src/components/luv/luv-states.spec.ts`
Expected: PASS, `4 passed`.

- [ ] **Step 5: Criar o avatar**

`src/components/luv/luv-avatar.tsx` (sem teste próprio: é só composição e é coberto pelos testes do `LuvSays` e do `EmptyState`):

```tsx
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

import { type LuvState, luvImage } from './luv-states'

type LuvAvatarProps = {
  state?: LuvState
  size?: 'lg' | 'xl'
}

/** A Luv é decorativa quando acompanha texto: alt vazio (DS, seção 6.2). */
export function LuvAvatar({ state = 'ola', size = 'xl' }: LuvAvatarProps) {
  return (
    <Avatar size={size}>
      <AvatarImage src={luvImage(state)} alt="" />
      <AvatarFallback aria-hidden>Luv</AvatarFallback>
    </Avatar>
  )
}
```

- [ ] **Step 6: Verificar tipos**

Run: `npx tsc --noEmit`
Expected: sem erros.

- [ ] **Step 7: Commit**

```bash
git add src/components/luv
git commit -m "feat: add luv states and avatar"
```

---

### Task 4: Balão da Luv (`LuvSays`)

**Files:**

- Create: `src/components/luv/luv-says.tsx`
- Test: `src/components/luv/luv-says.spec.tsx`

- [ ] **Step 1: Escrever o teste**

`src/components/luv/luv-says.spec.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { LuvSays } from './luv-says'

describe('LuvSays', () => {
  it('mostra a fala numa região de status', () => {
    render(<LuvSays>Bora pra primeira aula?</LuvSays>)

    expect(screen.getByRole('status')).toHaveTextContent(
      'Bora pra primeira aula?',
    )
  })

  it('na versão herói, mostra a ilustração decorativa e a fala', () => {
    const { container } = render(<LuvSays hero>Vou estudar com você!</LuvSays>)

    expect(screen.getByRole('status')).toHaveTextContent(
      'Vou estudar com você!',
    )
    expect(container.querySelector('img')).toHaveAttribute('alt', '')
  })

  it('esconde o nome "Luv" do avatar dos leitores de tela', () => {
    render(<LuvSays>Oi!</LuvSays>)

    // No jsdom a imagem nunca carrega, então o fallback fica visível.
    expect(screen.getByText('Luv')).toHaveAttribute('aria-hidden', 'true')
  })
})
```

- [ ] **Step 2: Rodar e ver falhar**

Run: `npx vitest run src/components/luv/luv-says.spec.tsx`
Expected: FAIL — `Failed to resolve import "./luv-says"`.

- [ ] **Step 3: Implementar**

`src/components/luv/luv-says.tsx`:

```tsx
import Image from 'next/image'

import { Bubble, BubbleContent } from '@/components/ui/bubble'
import { Message, MessageAvatar, MessageContent } from '@/components/ui/message'

import { LuvAvatar } from './luv-avatar'
import { type LuvState, luvImage } from './luv-states'

type LuvSaysProps = {
  state?: LuvState
  /** Ilustração grande (até 240px) com a fala embaixo — herói e celebrações. */
  hero?: boolean
  children: React.ReactNode
}

/**
 * A Luv falando (DS, seção 8.2 — LuvBubble). Até duas frases, em balão
 * tingido (escolha 3C). role="status" = aria-live="polite": a fala é
 * anunciada sem interromper.
 */
export function LuvSays({
  state = 'ola',
  hero = false,
  children,
}: LuvSaysProps) {
  const bubble = (
    <Bubble variant="tinted">
      <BubbleContent className="text-base">{children}</BubbleContent>
    </Bubble>
  )

  if (hero) {
    return (
      <div role="status" className="flex flex-col items-center gap-4">
        <Image
          src={luvImage(state)}
          alt=""
          width={240}
          height={240}
          loading="eager"
          className="size-48 rounded-full border-2 border-border shadow-sticker-lg md:size-60"
        />
        {bubble}
      </div>
    )
  }

  return (
    <Message role="status">
      <MessageAvatar>
        <LuvAvatar state={state} />
      </MessageAvatar>
      <MessageContent>{bubble}</MessageContent>
    </Message>
  )
}
```

- [ ] **Step 4: Rodar e ver passar**

Run: `npx vitest run src/components/luv/luv-says.spec.tsx`
Expected: PASS, `3 passed`.

- [ ] **Step 5: Commit**

```bash
git add src/components/luv/luv-says.tsx src/components/luv/luv-says.spec.tsx
git commit -m "feat: add luv speech bubble"
```

---

### Task 5: Janela retrô (`RetroWindow`)

**Files:**

- Create: `src/components/retro-window.tsx`
- Test: `src/components/retro-window.spec.tsx`

- [ ] **Step 1: Escrever o teste**

`src/components/retro-window.spec.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { RetroWindow } from './retro-window'

describe('RetroWindow', () => {
  it('é uma região nomeada pelo título', () => {
    render(
      <RetroWindow title="Meu site">
        <p>Olá, eu sou a Ana</p>
      </RetroWindow>,
    )

    const region = screen.getByRole('region', { name: 'Meu site' })
    expect(region).toHaveTextContent('Olá, eu sou a Ana')
  })

  it('tem bolinhas apenas decorativas, fora do foco', () => {
    const { container } = render(
      <RetroWindow title="Meu site">conteúdo</RetroWindow>,
    )

    const dots = container.querySelectorAll('[data-slot="retro-window-dot"]')
    expect(dots).toHaveLength(3)
    for (const dot of dots) {
      expect(dot).toHaveAttribute('aria-hidden', 'true')
      expect(dot).not.toHaveAttribute('tabindex')
    }
  })
})
```

- [ ] **Step 2: Rodar e ver falhar**

Run: `npx vitest run src/components/retro-window.spec.tsx`
Expected: FAIL — `Failed to resolve import "./retro-window"`.

- [ ] **Step 3: Implementar**

`src/components/retro-window.tsx`:

```tsx
import { useId } from 'react'

import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'

type RetroWindowProps = {
  title: string
  children: React.ReactNode
}

const DOTS = ['bg-destructive', 'bg-warning', 'bg-success']

/** Moldura de "programa antigo" (DS, seção 8.2). O conteúdo é livre. */
export function RetroWindow({ title, children }: RetroWindowProps) {
  const titleId = useId()

  return (
    <Card
      role="region"
      aria-labelledby={titleId}
      size="sm"
      className="gap-0 py-0"
    >
      <div className="flex h-8 items-center gap-1.5 border-b-2 bg-popover px-3">
        {DOTS.map((color) => (
          <span
            key={color}
            data-slot="retro-window-dot"
            aria-hidden="true"
            className={cn('size-2.5 rounded-full', color)}
          />
        ))}
        <span
          id={titleId}
          className="ml-2 text-xs font-semibold text-muted-foreground"
        >
          {title}
        </span>
      </div>
      {children}
    </Card>
  )
}
```

- [ ] **Step 4: Rodar e ver passar**

Run: `npx vitest run src/components/retro-window.spec.tsx`
Expected: PASS, `2 passed`.

- [ ] **Step 5: Commit**

```bash
git add src/components/retro-window.tsx src/components/retro-window.spec.tsx
git commit -m "feat: add retro window frame"
```

---

### Task 6: Estado vazio (`EmptyState`)

Usado em quatro páginas deste plano (Aulas, Meu site, Conquistas, Configurações) — por isso vira componente (DS, "um componente só entra quando aparece duas vezes").

**Files:**

- Create: `src/components/empty-state.tsx`
- Test: `src/components/empty-state.spec.tsx`

- [ ] **Step 1: Escrever o teste**

`src/components/empty-state.spec.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { EmptyState } from './empty-state'

describe('EmptyState', () => {
  it('mostra título e descrição', () => {
    render(
      <EmptyState
        title="Seu site aparece aqui"
        description="Cada parte que você criar vem morar nesta página."
      />,
    )

    expect(screen.getByText('Seu site aparece aqui')).toBeInTheDocument()
    expect(
      screen.getByText('Cada parte que você criar vem morar nesta página.'),
    ).toBeInTheDocument()
  })

  it('mostra a ação como link', () => {
    render(
      <EmptyState
        title="Nada por aqui"
        description="Ainda."
        action={{ label: 'Ver as aulas', href: '/aulas' }}
      />,
    )

    expect(screen.getByRole('link', { name: 'Ver as aulas' })).toHaveAttribute(
      'href',
      '/aulas',
    )
  })

  it('não mostra ação quando não há', () => {
    render(<EmptyState title="Nada por aqui" description="Ainda." />)

    expect(screen.queryByRole('link')).not.toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Rodar e ver falhar**

Run: `npx vitest run src/components/empty-state.spec.tsx`
Expected: FAIL — `Failed to resolve import "./empty-state"`.

- [ ] **Step 3: Implementar**

`src/components/empty-state.tsx`:

```tsx
import Link from 'next/link'

import { LuvAvatar } from '@/components/luv/luv-avatar'
import type { LuvState } from '@/components/luv/luv-states'
import { buttonVariants } from '@/components/ui/button'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'

type EmptyStateProps = {
  title: string
  description: string
  luv?: LuvState
  action?: { label: string; href: string }
}

/** Padrão "Estado vazio" (DS, seção 9): Luv + uma frase + a primeira ação. */
export function EmptyState({
  title,
  description,
  luv = 'descansar',
  action,
}: EmptyStateProps) {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia>
          <LuvAvatar state={luv} />
        </EmptyMedia>
        <EmptyTitle>{title}</EmptyTitle>
        <EmptyDescription>{description}</EmptyDescription>
      </EmptyHeader>
      {action && (
        <EmptyContent>
          <Link href={action.href} className={buttonVariants()}>
            {action.label}
          </Link>
        </EmptyContent>
      )}
    </Empty>
  )
}
```

- [ ] **Step 4: Rodar e ver passar**

Run: `npx vitest run src/components/empty-state.spec.tsx`
Expected: PASS, `3 passed`.

- [ ] **Step 5: Commit**

```bash
git add src/components/empty-state.tsx src/components/empty-state.spec.tsx
git commit -m "feat: add empty state with luv"
```

---

### Task 7: Destinos da navegação

**Files:**

- Create: `src/components/layout/nav-items.ts`
- Test: `src/components/layout/nav-items.spec.ts`

- [ ] **Step 1: Escrever o teste**

`src/components/layout/nav-items.spec.ts`:

```ts
import { describe, expect, it } from 'vitest'

import { isActive, NAV_ITEMS } from './nav-items'

describe('NAV_ITEMS', () => {
  it('tem os quatro destinos principais, nesta ordem (DS 5.3)', () => {
    expect(NAV_ITEMS.map((item) => item.label)).toEqual([
      'Início',
      'Aulas',
      'Meu site',
      'Conquistas',
    ])
  })
})

describe('isActive', () => {
  it('Início só fica ativo na raiz', () => {
    expect(isActive('/', '/')).toBe(true)
    expect(isActive('/aulas', '/')).toBe(false)
  })

  it('ativa o destino e as páginas dentro dele', () => {
    expect(isActive('/aulas', '/aulas')).toBe(true)
    expect(isActive('/aulas/seu-primeiro-html', '/aulas')).toBe(true)
  })

  it('não confunde destinos com prefixo parecido', () => {
    expect(isActive('/aulas-extras', '/aulas')).toBe(false)
  })
})
```

- [ ] **Step 2: Rodar e ver falhar**

Run: `npx vitest run src/components/layout/nav-items.spec.ts`
Expected: FAIL — `Failed to resolve import "./nav-items"`.

- [ ] **Step 3: Implementar**

`src/components/layout/nav-items.ts`:

```ts
export const NAV_ITEMS = [
  { label: 'Início', href: '/' },
  { label: 'Aulas', href: '/aulas' },
  { label: 'Meu site', href: '/meu-site' },
  { label: 'Conquistas', href: '/conquistas' },
] as const

export function isActive(pathname: string, href: string) {
  if (href === '/') return pathname === '/'
  return pathname === href || pathname.startsWith(`${href}/`)
}
```

- [ ] **Step 4: Rodar e ver passar**

Run: `npx vitest run src/components/layout/nav-items.spec.ts`
Expected: PASS, `4 passed`.

- [ ] **Step 5: Commit**

```bash
git add src/components/layout/nav-items.ts src/components/layout/nav-items.spec.ts
git commit -m "feat: add navigation destinations"
```

---

### Task 8: Cabeçalho (`SiteHeader`)

DS 5.3: barra no topo; a partir de `md` os links ficam visíveis; abaixo, botão de menu abre gaveta lateral. Configurações por ícone com rótulo acessível.

**Files:**

- Create: `src/components/layout/site-header.tsx`
- Test: `src/components/layout/site-header.spec.tsx`

- [ ] **Step 1: Escrever o teste**

`src/components/layout/site-header.spec.tsx`:

```tsx
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { SiteHeader } from './site-header'

vi.mock('next/navigation', () => ({
  usePathname: () => '/aulas',
}))

describe('SiteHeader', () => {
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
})
```

- [ ] **Step 2: Rodar e ver falhar**

Run: `npx vitest run src/components/layout/site-header.spec.tsx`
Expected: FAIL — `Failed to resolve import "./site-header"`.

- [ ] **Step 3: Implementar**

`src/components/layout/site-header.tsx`:

```tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { CodeXmlIcon, MenuIcon, SettingsIcon } from 'lucide-react'

import { Button, buttonVariants } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { cn } from '@/lib/utils'

import { isActive, NAV_ITEMS } from './nav-items'

/**
 * bar: barra do topo, destino ativo com sublinhado rosa (escolha 1B).
 * drawer: gaveta lateral do celular, destino ativo com fundo (escolha 2A).
 * Os dois mantêm 48px de altura (área de toque, DS 5.3).
 */
function NavLinks({
  pathname,
  variant,
  onNavigate,
}: {
  pathname: string
  variant: 'bar' | 'drawer'
  onNavigate?: () => void
}) {
  return NAV_ITEMS.map((item) => {
    const active = isActive(pathname, item.href)
    return (
      <Link
        key={item.href}
        href={item.href}
        onClick={onNavigate}
        aria-current={active ? 'page' : undefined}
        className={cn(
          variant === 'bar'
            ? 'inline-flex h-12 items-center border-b-2 border-transparent px-1 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground'
            : cn(buttonVariants({ variant: 'ghost' }), 'justify-start'),
          variant === 'bar' && active && 'border-primary text-foreground',
          variant === 'drawer' && active && 'bg-muted',
        )}
      >
        {item.label}
      </Link>
    )
  })
}

export function SiteHeader() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-10 border-b-2 border-muted bg-background">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-4 md:px-6">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger
            render={
              <Button
                variant="outline"
                size="icon-sm"
                aria-label="Abrir menu"
                className="md:hidden"
              />
            }
          >
            <MenuIcon />
          </SheetTrigger>
          <SheetContent side="left">
            <SheetHeader>
              <SheetTitle>Menu</SheetTitle>
            </SheetHeader>
            <nav aria-label="Menu" className="flex flex-col gap-1 px-4">
              <NavLinks
                pathname={pathname}
                variant="drawer"
                onNavigate={() => setOpen(false)}
              />
            </nav>
          </SheetContent>
        </Sheet>

        <Link
          href="/"
          className="flex items-center gap-2 font-display text-xl font-bold"
        >
          <CodeXmlIcon aria-hidden className="text-link" />
          CodeLuv
        </Link>

        <nav
          aria-label="Principal"
          className="hidden flex-1 items-center gap-5 md:flex"
        >
          <NavLinks pathname={pathname} variant="bar" />
        </nav>

        <Link
          href="/configuracoes"
          aria-label="Configurações"
          className={cn(
            buttonVariants({ variant: 'outline', size: 'icon-sm' }),
            'ml-auto md:ml-0',
          )}
        >
          <SettingsIcon />
        </Link>
      </div>
    </header>
  )
}
```

- [ ] **Step 4: Rodar e ver passar**

Run: `npx vitest run src/components/layout/site-header.spec.tsx`
Expected: PASS, `4 passed`.

Se o teste da gaveta falhar com `Unable to find role="dialog"`, confira em `src/components/ui/sheet.tsx` se `SheetContent` usa `SheetPrimitive.Popup` dentro de `SheetPortal` (padrão do `base-nova`) — o papel `dialog` vem do Base UI. Não troque o teste por `getByText`.

- [ ] **Step 5: Commit**

```bash
git add src/components/layout/site-header.tsx src/components/layout/site-header.spec.tsx
git commit -m "feat: add site header with mobile drawer"
```

---

### Task 9: Grupo de rotas do app e as cinco páginas

**Files:**

- Modify: `src/app/layout.tsx`
- Delete: `src/app/page.tsx`
- Create: `src/app/(app)/layout.tsx`
- Create: `src/app/(app)/page.tsx`
- Create: `src/app/(app)/aulas/page.tsx`
- Create: `src/app/(app)/meu-site/page.tsx`
- Create: `src/app/(app)/conquistas/page.tsx`
- Create: `src/app/(app)/configuracoes/page.tsx`

- [ ] **Step 1: Template de título no layout raiz**

Em `src/app/layout.tsx`, trocar o `metadata` por:

```tsx
export const metadata: Metadata = {
  title: { default: 'CodeLuv', template: '%s · CodeLuv' },
  description: 'Pequenos projetos, grandes conquistas.',
}
```

- [ ] **Step 2: Remover a página do scaffold**

Run: `git rm src/app/page.tsx`
Expected: `rm 'src/app/page.tsx'`.

- [ ] **Step 3: Layout do grupo `(app)`**

`src/app/(app)/layout.tsx`:

```tsx
import { Suspense } from 'react'

import { SiteHeader } from '@/components/layout/site-header'

// SiteHeader lê o pathname. Com cacheComponents, rotas com parâmetro dinâmico
// sem generateStaticParams suspendem usePathname — o Suspense mantém o resto
// do layout pré-renderizado (node_modules/next/dist/docs/.../use-pathname.md).
export default function AppLayout({ children }: LayoutProps<'/'>) {
  return (
    <div className="flex min-h-dvh flex-col">
      <Suspense fallback={<div className="h-16 border-b-2 border-muted" />}>
        <SiteHeader />
      </Suspense>
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-12 px-4 py-12 md:px-6">
        {children}
      </main>
    </div>
  )
}
```

- [ ] **Step 4: Início**

`src/app/(app)/page.tsx`:

```tsx
import Link from 'next/link'
import { PlayIcon } from 'lucide-react'

import { LuvSays } from '@/components/luv/luv-says'
import { buttonVariants } from '@/components/ui/button'

export default function InicioPage() {
  return (
    <section className="grid items-center gap-10 lg:grid-cols-[1.2fr_1fr]">
      <div className="flex flex-col gap-6">
        <h1 className="font-display text-4xl leading-tight font-extrabold md:text-6xl">
          Oi!
        </h1>
        <p className="max-w-[52ch] text-lg text-muted-foreground">
          Aqui você vai construir o seu próprio site, uma parte por aula. Cada
          explicação pode ser ouvida, e você pratica no mesmo lugar.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link href="/aulas" className={buttonVariants({ size: 'lg' })}>
            <PlayIcon data-icon="inline-start" />
            Ver as aulas
          </Link>
        </div>
      </div>
      <LuvSays hero>Eu sou a Luv. Vou estudar com você! ✦</LuvSays>
    </section>
  )
}
```

- [ ] **Step 5: Aulas**

`src/app/(app)/aulas/page.tsx`:

```tsx
import type { Metadata } from 'next'

import { EmptyState } from '@/components/empty-state'

export const metadata: Metadata = { title: 'Aulas' }

export default function AulasPage() {
  return (
    <>
      <h1 className="font-display text-3xl font-bold md:text-4xl">Aulas</h1>
      <EmptyState
        luv="aprender"
        title="As aulas estão chegando"
        description="O módulo de HTML vai aparecer aqui, com uma aula por parte do seu site."
      />
    </>
  )
}
```

- [ ] **Step 6: Meu site**

`src/app/(app)/meu-site/page.tsx`:

```tsx
import type { Metadata } from 'next'

import { EmptyState } from '@/components/empty-state'

export const metadata: Metadata = { title: 'Meu site' }

export default function MeuSitePage() {
  return (
    <>
      <h1 className="font-display text-3xl font-bold md:text-4xl">Meu site</h1>
      <EmptyState
        title="Seu site aparece aqui"
        description="Depois da primeira aula, cada parte que você criar vem morar nesta página."
        action={{ label: 'Ver as aulas', href: '/aulas' }}
      />
    </>
  )
}
```

- [ ] **Step 7: Conquistas**

`src/app/(app)/conquistas/page.tsx`:

```tsx
import type { Metadata } from 'next'

import { EmptyState } from '@/components/empty-state'

export const metadata: Metadata = { title: 'Conquistas' }

export default function ConquistasPage() {
  return (
    <>
      <h1 className="font-display text-3xl font-bold md:text-4xl">
        Conquistas
      </h1>
      <EmptyState
        luv="comemorar"
        title="Sua primeira conquista vem logo"
        description="Ela chega quando você concluir a primeira aula."
        action={{ label: 'Ver as aulas', href: '/aulas' }}
      />
    </>
  )
}
```

- [ ] **Step 8: Configurações**

`src/app/(app)/configuracoes/page.tsx`:

```tsx
import type { Metadata } from 'next'

import { EmptyState } from '@/components/empty-state'

export const metadata: Metadata = { title: 'Configurações' }

export default function ConfiguracoesPage() {
  return (
    <>
      <h1 className="font-display text-3xl font-bold md:text-4xl">
        Configurações
      </h1>
      <EmptyState
        title="Nada para ajustar ainda"
        description="Aqui você vai poder mudar seu nome, a velocidade da voz e as animações."
      />
    </>
  )
}
```

- [ ] **Step 9: Verificar tipos, lint e build**

Run: `npx tsc --noEmit && npx eslint . && npm run build`
Expected: sem erros; a tabela de rotas do build lista `/`, `/aulas`, `/meu-site`, `/conquistas`, `/configuracoes` (e ainda `/preview`) como `○ (Static)`.

- [ ] **Step 10: Conferir no navegador**

Run (se não estiver rodando): `npm run dev`
Abrir `http://localhost:3000`, navegar pelos quatro destinos e pelo ícone de Configurações. Reduzir a janela para ~375px e abrir a gaveta pelo botão de menu.
Expected: na barra, o destino atual aparece com sublinhado rosa; na gaveta lateral, com fundo `bg-muted`; a gaveta fecha ao escolher um destino; os títulos de página estão em Orbitron; os títulos dos estados vazios, em Poppins.

- [ ] **Step 11: Commit**

```bash
git add src/app
git commit -m "feat: add app shell and phase 1 pages"
```

---

### Task 10: Teste de ponta a ponta da navegação, com acessibilidade

**Files:**

- Delete: `e2e/home.spec.ts`
- Create: `e2e/navigation.spec.ts`

- [ ] **Step 1: Escrever o teste**

`e2e/navigation.spec.ts`:

```ts
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
```

- [ ] **Step 2: Remover o teste antigo**

Run: `git rm e2e/home.spec.ts`
Expected: `rm 'e2e/home.spec.ts'`.

- [ ] **Step 3: Rodar**

Run: `npm run test:e2e`
Expected: `7 passed`. (O Playwright faz `build` + `start` sozinho; leva ~1 minuto.)

Se o axe apontar violação, ler `results.violations[n].id` e `nodes[].target`, corrigir o componente ou o token — nunca desligar a regra no teste. Se um contraste falhar, conferir também a Task 2.

- [ ] **Step 4: Commit**

```bash
git add e2e/navigation.spec.ts
git commit -m "test: cover navigation and accessibility end to end"
```

---

### Task 11: Limpeza e atualização do design system

**Files:**

- Delete: `src/app/preview/page.tsx`
- Delete: `src/smoke.spec.ts`
- Modify: `docs/design-system.md`

- [ ] **Step 1: Remover a rota provisória e o teste de fumaça**

Run: `git rm -r src/app/preview src/smoke.spec.ts`
Expected: os dois removidos.

- [ ] **Step 2: Atualizar o inventário (DS, seção 8.1)**

Em `docs/design-system.md`, na tabela do inventário, mudar a coluna "Estado no código" para `pronto` nas linhas:

- `RetroWindow` (agora `src/components/retro-window.tsx`)
- `Header` / `NavDrawer` (agora `src/components/layout/site-header.tsx`)
- `LuvBubble` (agora `src/components/luv/luv-says.tsx` + `luv-avatar.tsx`)
- `EmptyState` (agora `src/components/empty-state.tsx`)

- [ ] **Step 3: Atualizar as divergências (DS, seção 13.4)**

Remover a linha "Rota `/preview`".

- [ ] **Step 4: Registrar no histórico do DS**

Acrescentar ao fim da tabela "Histórico deste documento":

```markdown
| 2026-10-09 | Plano 1 entregue: RetroWindow, SiteHeader, LuvSays/LuvAvatar e EmptyState prontos; `/preview` removida | Claudio Soares |
```

- [ ] **Step 5: Verificação final completa**

Run: `npx eslint . && npx tsc --noEmit && npm test && npm run build && npm run test:e2e`
Expected: lint e tipos limpos; Vitest com todos os arquivos `*.spec.*` passando (contrast, tokens, luv-states, luv-says, retro-window, empty-state, nav-items, site-header); build sem `/preview`; `7 passed` no Playwright.

- [ ] **Step 6: Commit**

```bash
git add docs/design-system.md
git commit -m "chore: remove visual preview and update design system inventory"
```

---

## Fora deste plano (próximos)

- **Plano 2 — Aula:** grupo de rotas `(aula)`, conteúdo das aulas, editor de código, `RetroWindow` com o resultado, conferência (`CheckList`) e pistas (`HintPanel`).
- **Plano 3 — Escuta:** `ListenControls`, `ReadAlongText` e a voz da Luv (briefing Q1).
- **Plano 4 — Progresso e site pessoal:** primeiro uso com nome, progresso no aparelho, Início com "Continuar", Meu site montado a partir das aulas, primeira conquista.
- **Arte da Luv:** recortes dos outros sete estados (DS 13.4) — trabalho de design, não de código.
