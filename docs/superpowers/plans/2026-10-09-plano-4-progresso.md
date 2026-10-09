# Plano 4 — Progresso e site pessoal: Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** O CodeLuv passa a lembrar da aluna: pergunta o nome no primeiro uso, guarda o código e as aulas concluídas no aparelho, mostra "Continuar" no Início, monta "Meu site" com as partes que ela já fez, dá as conquistas "Hello, World" e "Persistente", e deixa baixar, recuperar e apagar o progresso.

**Architecture:** Todo o estado da aluna mora num único objeto versionado (`Progresso`) guardado no `localStorage` (`codeluv:progresso`). Um módulo de armazenamento (`src/lib/progresso/store.ts`) lê, grava, avisa mudanças e funciona mesmo sem armazenamento (cai para a memória). Os componentes leem com `useSyncExternalStore` (`useProgresso`), que no servidor devolve `null` — por isso cada tela que depende do progresso tem um estado "carregando" e não há diferença entre servidor e cliente na hidratação. As mudanças são funções puras (`acoes.ts`, `conquistas.ts`, `site.ts`) testadas isoladamente. A velocidade da escuta, que no Plano 3 tinha chave própria, passa a morar no progresso (com migração da chave antiga).

**Tech Stack:** Next.js 16.4 (App Router, `cacheComponents` + `partialPrefetching`), React 19.3, TypeScript, Tailwind CSS 4, shadcn/ui (base-nova, Base UI, Lucide), Vitest 5 + Testing Library + jsdom, Playwright + axe-core.

**Documentos de referência:**

- `docs/briefing.md` — HU-01 (ser recebida pela Luv), HU-07 (ver o site pessoal atualizado), HU-08 (continuar de onde parou, incluindo "progresso não pôde ser recuperado"), HU-09 (conquistas), HU-11 (mostrar o progresso ao mentor), seção 11 (discrição, reversibilidade, ritmo próprio), Q3 (mais de um aparelho / cópia do progresso).
- `docs/design-system.md` (v0.4.1) — 9 padrões "Primeiro uso", "Retomada", "Conclusão de aula", "Estado vazio", "Formulários", "Campos opcionais", "Confirmação destrutiva", "Progresso não recuperado"; 8.2 `AchievementBadge`; 10 voz; 13.4 divergências a fechar ("Uma Luv por tela", "Velocidade guardada à parte", "Parte nova do site destacada na conclusão").
- `AGENTS.md` — consultar `node_modules/next/dist/docs/` antes de usar uma API do Next.
- Skill `shadcn` (`~/.claude/skills/shadcn/SKILL.md`) — formulários com `FieldGroup` + `Field`; `AlertDialog` para confirmação.

**Decisões deste plano (tomadas com a responsável pelo produto em 2026-10-09):**

- **Cópia do progresso**: em Configurações, "Baixar uma cópia" (arquivo `.json`) e "Recuperar de uma cópia". Responde à Q3 sem conta nem servidor.
- **Conquistas**: "Hello, World" (concluir a primeira aula) e "Persistente" (concluir uma aula depois de conferir 3 vezes ou mais), como pede a HU-09.
- **Conclusão mostra o site, não a Luv**: a celebração troca a Luv grande pelo site da aluna atualizado ("Seu site ganhou uma parte nova"). Resolve a divergência "Uma Luv por tela" e cumpre o padrão "Conclusão de aula" do DS.

**Decisões técnicas (e por quê):**

- **Um objeto, uma chave, com `versao: 1`.** Facilita a cópia (é o próprio JSON) e futuras migrações.
- **Leitura validada** (`normalizar`): JSON quebrado ou com formato estranho não derruba a tela — vira progresso vazio com `perdido: true`, e o Início explica com uma mensagem que não culpa a aluna (HU-08).
- **Sem armazenamento, segue em memória** (navegação privada, cota cheia): vale até recarregar a página.
- **Código salvo a cada mudança.** São poucos caracteres; não precisa de atraso.
- **O editor não "pisca" na hidratação:** a prática guarda só o que a aluna _editou_ nesta visita; o valor mostrado é `editado ?? salvo ?? inicial`. Sem `setState` em efeito.
- **"Meu site" = o código de cada aula concluída, na ordem das aulas.** Quando chegarem aulas de CSS, a montagem muda — fora deste plano.

**Convenções do repositório:** Prettier sem ponto e vírgula, aspas simples, `trailingComma: 'all'`; ESLint ordena imports; testes em `src/**/*.spec.{ts,tsx}` importando de `vitest` (`globals: false`, jest-dom + cleanup em `vitest.setup.ts`, `restoreMocks: true`); commits Conventional Commits em minúsculas com o trailer `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`; área de toque mínima 48px; links com cara de botão = `<Link className={buttonVariants()}>`; Base UI usa `render`, não `asChild`. Sem `.next`, rode `npx next typegen` antes de `npx tsc --noEmit`. Hoje: 22 arquivos / 140 testes no Vitest; 18 no Playwright.

---

## Mapa de arquivos

| Arquivo                                                   | Ação      | Responsabilidade                                                      |
| --------------------------------------------------------- | --------- | --------------------------------------------------------------------- |
| `src/lib/progresso/modelo.ts` (+ `.spec.ts`)              | criar     | tipo `Progresso`, velocidades, `normalizar`                           |
| `src/lib/progresso/store.ts` (+ `.spec.ts`)               | criar     | ler, gravar, assinar, apagar, exportar, importar                      |
| `src/lib/progresso/acoes.ts` (+ `.spec.ts`)               | criar     | mudanças puras: código, conferência, conclusão, nome, dia             |
| `src/lib/progresso/conquistas.ts` (+ `.spec.ts`)          | criar     | definição e registro das conquistas                                   |
| `src/lib/progresso/site.ts` (+ `.spec.ts`)                | criar     | montar "Meu site"; próxima aula; última concluída                     |
| `src/lib/progresso/use-progresso.ts`                      | criar     | hook `useSyncExternalStore` (servidor → `null`)                       |
| `src/lib/escuta/velocidade.ts` (+ spec)                   | modificar | velocidade passa a morar no progresso; migra a chave antiga           |
| `src/components/site-preview.tsx`                         | criar     | o site da aluna numa `RetroWindow` (usado na conclusão e em Meu site) |
| `src/components/aula/practice.tsx` (+ spec)               | modificar | retoma e salva código; conta conferências; conclui; conquistas        |
| `src/components/aula/lesson-done.tsx`                     | modificar | celebra com o site, sem a Luv                                         |
| `src/components/aula/estado-aula.tsx` (+ spec)            | criar     | selo "Concluída" na lista de aulas                                    |
| `src/app/(app)/aulas/page.tsx`                            | modificar | mostrar o selo                                                        |
| `src/components/inicio/inicio.tsx` (+ spec)               | criar     | primeiro uso, boas-vindas, "Continuar", progresso perdido             |
| `src/app/(app)/page.tsx`                                  | modificar | usar `Inicio`                                                         |
| `src/components/meu-site/meu-site.tsx` (+ spec)           | criar     | o site montado e as partes                                            |
| `src/app/(app)/meu-site/page.tsx`                         | modificar | usar `MeuSite`                                                        |
| `src/components/conquistas/lista-conquistas.tsx` (+ spec) | criar     | conquistas ganhas e a ganhar                                          |
| `src/app/(app)/conquistas/page.tsx`                       | modificar | usar `ListaConquistas`                                                |
| `src/components/configuracoes/configuracoes.tsx` (+ spec) | criar     | nome, cópia (baixar/recuperar), apagar                                |
| `src/app/(app)/configuracoes/page.tsx`                    | modificar | usar `Configuracoes`                                                  |
| `e2e/helpers.ts`                                          | criar     | `escrever` (editor), compartilhado                                    |
| `e2e/aula.spec.ts`, `e2e/navigation.spec.ts`              | modificar | usar o helper; Início com primeiro uso                                |
| `e2e/progresso.spec.ts`                                   | criar     | progresso de ponta a ponta                                            |
| `docs/design-system.md`, `docs/briefing.md`               | modificar | registrar a entrega e as decisões                                     |

---

### Task 0: Branch

- [ ] **Step 1:** Run: `git status --short && git checkout -b feat/plano-4-progresso`
      Expected: só `?? .claude/` (e este plano, se ainda não commitado); `Switched to a new branch 'feat/plano-4-progresso'`.

---

### Task 1: Modelo do progresso

**Files:**

- Create: `src/lib/progresso/modelo.ts`
- Test: `src/lib/progresso/modelo.spec.ts`

- [ ] **Step 1: Escrever o teste**

`src/lib/progresso/modelo.spec.ts`:

```ts
import { describe, expect, it } from 'vitest'

import { normalizar, PROGRESSO_VAZIO } from './modelo'

describe('normalizar', () => {
  it('aceita um progresso válido', () => {
    const dado = {
      versao: 1,
      nome: 'Ana',
      aulas: {
        'seu-primeiro-html': {
          codigo: '<h1>Oi</h1>',
          conferencias: 2,
          concluidaEm: '2026-10-09T20:00:00.000Z',
        },
      },
      conquistas: { 'hello-world': { em: '2026-10-09T20:00:00.000Z' } },
      diasEstudados: ['2026-10-09'],
      velocidade: 1.25,
    }
    expect(normalizar(dado)).toEqual(dado)
  })

  it('recusa o que não é progresso do CodeLuv', () => {
    expect(normalizar(null)).toBeNull()
    expect(normalizar('oi')).toBeNull()
    expect(normalizar({ versao: 2, aulas: {} })).toBeNull()
    expect(normalizar({ versao: 1, aulas: [] })).toBeNull()
  })

  it('descarta campos inválidos sem perder o resto', () => {
    expect(
      normalizar({
        versao: 1,
        nome: 42,
        aulas: { a: { codigo: 7, conferencias: 'x' }, b: 'lixo' },
        conquistas: { c: { em: 3 } },
        diasEstudados: ['2026-10-09', 5],
        velocidade: 9,
      }),
    ).toEqual({
      ...PROGRESSO_VAZIO,
      aulas: { a: { conferencias: 0 } },
      diasEstudados: ['2026-10-09'],
    })
  })

  it('o progresso vazio é ele mesmo válido', () => {
    expect(normalizar(PROGRESSO_VAZIO)).toEqual(PROGRESSO_VAZIO)
  })
})
```

- [ ] **Step 2: Rodar e ver falhar**

Run: `npx vitest run src/lib/progresso/modelo.spec.ts`
Expected: FAIL — `Failed to resolve import "./modelo"`.

- [ ] **Step 3: Implementar**

`src/lib/progresso/modelo.ts`:

```ts
export const VELOCIDADES = [0.75, 1, 1.25, 1.5] as const
export type Velocidade = (typeof VELOCIDADES)[number]

export function velocidadeValida(valor: unknown): valor is Velocidade {
  return (VELOCIDADES as readonly unknown[]).includes(valor)
}

export type ProgressoAula = {
  /** Último código escrito na prática. */
  codigo?: string
  /** Quantas vezes a aluna apertou "Conferir". */
  conferencias: number
  /** ISO 8601; a primeira conclusão. */
  concluidaEm?: string
}

export type Progresso = {
  versao: 1
  nome?: string
  /** A aluna escolheu não informar o nome no primeiro uso. */
  nomePulado?: boolean
  aulas: Record<string, ProgressoAula>
  conquistas: Record<string, { em: string }>
  /** Datas YYYY-MM-DD (horário local) em que ela estudou. */
  diasEstudados: string[]
  velocidade?: Velocidade
}

export const PROGRESSO_VAZIO: Progresso = {
  versao: 1,
  aulas: {},
  conquistas: {},
  diasEstudados: [],
}

function objeto(valor: unknown): valor is Record<string, unknown> {
  return typeof valor === 'object' && valor !== null && !Array.isArray(valor)
}

function aulaValida(valor: unknown): ProgressoAula | null {
  if (!objeto(valor)) return null
  const aula: ProgressoAula = {
    conferencias:
      typeof valor.conferencias === 'number' && valor.conferencias >= 0
        ? Math.floor(valor.conferencias)
        : 0,
  }
  if (typeof valor.codigo === 'string') aula.codigo = valor.codigo
  if (typeof valor.concluidaEm === 'string')
    aula.concluidaEm = valor.concluidaEm
  return aula
}

/**
 * Confere e limpa um progresso vindo do armazenamento ou de uma cópia.
 * Devolve null se não for um progresso do CodeLuv; campos inválidos são
 * descartados um a um, sem perder o resto.
 */
export function normalizar(dado: unknown): Progresso | null {
  if (!objeto(dado) || dado.versao !== 1 || !objeto(dado.aulas)) return null

  const progresso: Progresso = { ...PROGRESSO_VAZIO, aulas: {}, conquistas: {} }

  for (const [slug, valor] of Object.entries(dado.aulas)) {
    const aula = aulaValida(valor)
    if (aula) progresso.aulas[slug] = aula
  }
  if (objeto(dado.conquistas)) {
    for (const [id, valor] of Object.entries(dado.conquistas)) {
      if (objeto(valor) && typeof valor.em === 'string') {
        progresso.conquistas[id] = { em: valor.em }
      }
    }
  }
  if (Array.isArray(dado.diasEstudados)) {
    progresso.diasEstudados = dado.diasEstudados.filter(
      (dia): dia is string => typeof dia === 'string',
    )
  }
  if (typeof dado.nome === 'string' && dado.nome.trim()) {
    progresso.nome = dado.nome.trim()
  }
  if (dado.nomePulado === true) progresso.nomePulado = true
  if (velocidadeValida(dado.velocidade)) progresso.velocidade = dado.velocidade

  return progresso
}
```

- [ ] **Step 4: Rodar e ver passar**

Run: `npx vitest run src/lib/progresso/modelo.spec.ts`
Expected: PASS, `4 passed`.

- [ ] **Step 5: Commit**

```bash
git add src/lib/progresso/modelo.ts src/lib/progresso/modelo.spec.ts
git commit -m "feat: add versioned progress model with validation"
```

---

### Task 2: Armazenamento do progresso

**Files:**

- Create: `src/lib/progresso/store.ts`
- Test: `src/lib/progresso/store.spec.ts`

- [ ] **Step 1: Escrever o teste**

`src/lib/progresso/store.spec.ts`:

```ts
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { PROGRESSO_VAZIO } from './modelo'
import {
  apagarProgresso,
  assinarProgresso,
  atualizarProgresso,
  esquecerProgressoEmMemoria,
  exportarProgresso,
  importarProgresso,
  obterEstado,
} from './store'

describe('store do progresso', () => {
  beforeEach(() => {
    localStorage.clear()
    esquecerProgressoEmMemoria()
  })
  afterEach(() => vi.restoreAllMocks())

  it('começa vazio e sem perda', () => {
    expect(obterEstado()).toEqual({
      progresso: PROGRESSO_VAZIO,
      perdido: false,
    })
  })

  it('grava, lê de volta e devolve o mesmo objeto enquanto nada muda', () => {
    atualizarProgresso((p) => ({ ...p, nome: 'Ana' }))

    const primeiro = obterEstado()
    expect(primeiro.progresso.nome).toBe('Ana')
    expect(JSON.parse(localStorage.getItem('codeluv:progresso')!).nome).toBe(
      'Ana',
    )
    // useSyncExternalStore exige o mesmo objeto se nada mudou.
    expect(obterEstado()).toBe(primeiro)
  })

  it('progresso corrompido vira vazio, marcado como perdido', () => {
    localStorage.setItem('codeluv:progresso', '{isto não é json')
    expect(obterEstado()).toEqual({ progresso: PROGRESSO_VAZIO, perdido: true })

    atualizarProgresso((p) => ({ ...p, nome: 'Ana' }))
    expect(obterEstado().perdido).toBe(false)
  })

  it('sem armazenamento, segue em memória', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('bloqueado')
    })
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('bloqueado')
    })

    expect(() =>
      atualizarProgresso((p) => ({ ...p, nome: 'Ana' })),
    ).not.toThrow()
    expect(obterEstado().progresso.nome).toBe('Ana')
  })

  it('exporta e importa uma cópia; recusa arquivo que não é cópia', () => {
    atualizarProgresso((p) => ({ ...p, nome: 'Ana' }))
    const copia = exportarProgresso()

    apagarProgresso()
    expect(obterEstado().progresso).toEqual(PROGRESSO_VAZIO)

    expect(importarProgresso('{"qualquer": true}')).toBe(false)
    expect(importarProgresso('não é json')).toBe(false)
    expect(importarProgresso(copia)).toBe(true)
    expect(obterEstado().progresso.nome).toBe('Ana')
  })

  it('avisa quem assinou a cada mudança', () => {
    const aviso = vi.fn()
    const cancelar = assinarProgresso(aviso)

    atualizarProgresso((p) => ({ ...p, nome: 'Ana' }))
    apagarProgresso()
    expect(aviso).toHaveBeenCalledTimes(2)

    cancelar()
    atualizarProgresso((p) => ({ ...p, nome: 'Bia' }))
    expect(aviso).toHaveBeenCalledTimes(2)
  })
})
```

- [ ] **Step 2: Rodar e ver falhar**

Run: `npx vitest run src/lib/progresso/store.spec.ts`
Expected: FAIL — `Failed to resolve import "./store"`.

- [ ] **Step 3: Implementar**

`src/lib/progresso/store.ts`:

```ts
import { normalizar, PROGRESSO_VAZIO, type Progresso } from './modelo'

const CHAVE = 'codeluv:progresso'
const EVENTO = 'codeluv:progresso'

export type EstadoProgresso = {
  progresso: Progresso
  /** Havia algo guardado, mas não deu para ler (HU-08). */
  perdido: boolean
}

const ESTADO_VAZIO: EstadoProgresso = {
  progresso: PROGRESSO_VAZIO,
  perdido: false,
}

/** Último texto lido e seu estado — o mesmo objeto enquanto o texto não muda. */
let cache: { texto: string | null; estado: EstadoProgresso } | undefined
/** Usado quando gravar falhou (navegação privada, cota cheia). */
let memoria: EstadoProgresso | undefined

function lerTexto(): string | null | undefined {
  try {
    return localStorage.getItem(CHAVE)
  } catch {
    return undefined // armazenamento indisponível
  }
}

function interpretar(texto: string | null): EstadoProgresso {
  if (texto === null) return ESTADO_VAZIO
  try {
    const progresso = normalizar(JSON.parse(texto))
    return progresso
      ? { progresso, perdido: false }
      : { ...ESTADO_VAZIO, perdido: true }
  } catch {
    return { ...ESTADO_VAZIO, perdido: true }
  }
}

function avisar() {
  window.dispatchEvent(new Event(EVENTO))
}

function gravar(progresso: Progresso) {
  const texto = JSON.stringify(progresso)
  try {
    localStorage.setItem(CHAVE, texto)
    memoria = undefined
    cache = { texto, estado: { progresso, perdido: false } }
  } catch {
    memoria = { progresso, perdido: false }
  }
  avisar()
}

/** Snapshot para useSyncExternalStore: estável enquanto nada muda. */
export function obterEstado(): EstadoProgresso {
  if (memoria) return memoria
  const texto = lerTexto()
  if (texto === undefined) return cache?.estado ?? ESTADO_VAZIO
  if (cache && cache.texto === texto) return cache.estado
  const estado = interpretar(texto)
  cache = { texto, estado }
  return estado
}

export function atualizarProgresso(mudar: (atual: Progresso) => Progresso) {
  gravar(mudar(obterEstado().progresso))
}

export function apagarProgresso() {
  try {
    localStorage.removeItem(CHAVE)
  } catch {
    // Sem armazenamento: só a memória é limpa.
  }
  memoria = undefined
  cache = undefined
  avisar()
}

/** JSON legível para a aluna guardar (Configurações → Baixar uma cópia). */
export function exportarProgresso() {
  return JSON.stringify(obterEstado().progresso, null, 2)
}

/** Recupera de uma cópia. Devolve false se o texto não for um progresso do CodeLuv. */
export function importarProgresso(texto: string) {
  let dado: unknown
  try {
    dado = JSON.parse(texto)
  } catch {
    return false
  }
  const progresso = normalizar(dado)
  if (!progresso) return false
  gravar(progresso)
  return true
}

export function assinarProgresso(aviso: () => void) {
  window.addEventListener(EVENTO, aviso)
  window.addEventListener('storage', aviso)
  return () => {
    window.removeEventListener(EVENTO, aviso)
    window.removeEventListener('storage', aviso)
  }
}

/** Só para testes: esquece memória e cache entre um caso e outro. */
export function esquecerProgressoEmMemoria() {
  memoria = undefined
  cache = undefined
}
```

- [ ] **Step 4: Rodar e ver passar**

Run: `npx vitest run src/lib/progresso/store.spec.ts`
Expected: PASS, `6 passed`.

- [ ] **Step 5: Commit**

```bash
git add src/lib/progresso/store.ts src/lib/progresso/store.spec.ts
git commit -m "feat: store progress on the device with memory fallback"
```

---

### Task 3: Ações, conquistas e site (funções puras)

**Files:**

- Create: `src/lib/progresso/acoes.ts`, `src/lib/progresso/conquistas.ts`, `src/lib/progresso/site.ts`, `src/lib/progresso/use-progresso.ts`
- Test: `src/lib/progresso/acoes.spec.ts`, `src/lib/progresso/conquistas.spec.ts`, `src/lib/progresso/site.spec.ts`

- [ ] **Step 1: Escrever os testes**

`src/lib/progresso/acoes.spec.ts`:

```ts
import { describe, expect, it } from 'vitest'

import {
  concluirAula,
  definirNome,
  hoje,
  pularNome,
  registrarConferencia,
  salvarCodigo,
} from './acoes'
import { PROGRESSO_VAZIO } from './modelo'

const SLUG = 'seu-primeiro-html'

describe('ações do progresso', () => {
  it('salva o código da aula sem mexer no resto', () => {
    const p = salvarCodigo(PROGRESSO_VAZIO, SLUG, '<h1>Oi</h1>')
    expect(p.aulas[SLUG]).toEqual({ codigo: '<h1>Oi</h1>', conferencias: 0 })
    expect(PROGRESSO_VAZIO.aulas).toEqual({}) // não muta
  })

  it('conta conferências e registra o dia uma vez só', () => {
    let p = registrarConferencia(PROGRESSO_VAZIO, SLUG, '2026-10-09')
    p = registrarConferencia(p, SLUG, '2026-10-09')
    expect(p.aulas[SLUG].conferencias).toBe(2)
    expect(p.diasEstudados).toEqual(['2026-10-09'])
  })

  it('guarda a primeira conclusão', () => {
    let p = concluirAula(
      PROGRESSO_VAZIO,
      SLUG,
      '2026-10-09T20:00:00.000Z',
      '2026-10-09',
    )
    p = concluirAula(p, SLUG, '2026-10-10T20:00:00.000Z', '2026-10-10')
    expect(p.aulas[SLUG].concluidaEm).toBe('2026-10-09T20:00:00.000Z')
    expect(p.diasEstudados).toEqual(['2026-10-09', '2026-10-10'])
  })

  it('nome: guarda limpo; vazio conta como pular', () => {
    expect(definirNome(PROGRESSO_VAZIO, '  Ana  ')).toMatchObject({
      nome: 'Ana',
      nomePulado: false,
    })
    expect(definirNome(PROGRESSO_VAZIO, '   ')).toMatchObject({
      nome: undefined,
      nomePulado: true,
    })
    expect(pularNome(PROGRESSO_VAZIO).nomePulado).toBe(true)
  })

  it('hoje usa a data local no formato AAAA-MM-DD', () => {
    expect(hoje(new Date(2026, 9, 9, 23, 30))).toBe('2026-10-09')
  })
})
```

`src/lib/progresso/conquistas.spec.ts`:

```ts
import { describe, expect, it } from 'vitest'

import { CONQUISTAS, registrarConquistas } from './conquistas'
import { PROGRESSO_VAZIO, type Progresso } from './modelo'

const AGORA = '2026-10-09T20:00:00.000Z'

function comAula(conferencias: number, concluida: boolean): Progresso {
  return {
    ...PROGRESSO_VAZIO,
    aulas: {
      'seu-primeiro-html': {
        conferencias,
        ...(concluida ? { concluidaEm: AGORA } : {}),
      },
    },
  }
}

describe('conquistas', () => {
  it('são duas: Hello, World e Persistente', () => {
    expect(CONQUISTAS.map((c) => c.titulo)).toEqual([
      'Hello, World',
      'Persistente',
    ])
  })

  it('nada concluído, nada ganho', () => {
    expect(registrarConquistas(comAula(5, false), AGORA).novas).toEqual([])
  })

  it('concluir a primeira aula dá Hello, World; com 3+ conferências, também Persistente', () => {
    expect(
      registrarConquistas(comAula(1, true), AGORA).novas.map((c) => c.id),
    ).toEqual(['hello-world'])

    const { progresso, novas } = registrarConquistas(comAula(3, true), AGORA)
    expect(novas.map((c) => c.id)).toEqual(['hello-world', 'persistente'])
    expect(progresso.conquistas['persistente']).toEqual({ em: AGORA })
  })

  it('não dá a mesma conquista duas vezes', () => {
    const primeira = registrarConquistas(comAula(1, true), AGORA).progresso
    expect(registrarConquistas(primeira, AGORA).novas).toEqual([])
  })
})
```

`src/lib/progresso/site.spec.ts`:

```ts
import { describe, expect, it } from 'vitest'

import type { Aula } from '@/content/aulas/types'

import { PROGRESSO_VAZIO, type Progresso } from './modelo'
import { montarSite, proximaParaEstudar, ultimaConcluida } from './site'

function aula(slug: string, ordem: number): Aula {
  return {
    slug,
    ordem,
    modulo: 'html',
    titulo: `Aula ${ordem}`,
    objetivo: '',
    duracaoMin: 15,
    pratica: {
      enunciado: [],
      inicial: '',
      conferencia: [],
      pistas: [],
      solucao: '',
    },
  }
}

const AULAS = [aula('a', 1), aula('b', 2), aula('c', 3)]
const FEITA = '2026-10-09T20:00:00.000Z'

describe('site e caminho', () => {
  it('sem aulas concluídas, o site está vazio e a próxima é a primeira', () => {
    expect(montarSite(PROGRESSO_VAZIO, AULAS)).toEqual({ html: '', partes: [] })
    expect(proximaParaEstudar(PROGRESSO_VAZIO, AULAS)?.slug).toBe('a')
    expect(ultimaConcluida(PROGRESSO_VAZIO, AULAS)).toBeUndefined()
  })

  it('o site junta o código das aulas concluídas, na ordem das aulas', () => {
    const p: Progresso = {
      ...PROGRESSO_VAZIO,
      aulas: {
        c: { codigo: '<p>três</p>\n', conferencias: 1, concluidaEm: FEITA },
        a: { codigo: '<h1>um</h1>', conferencias: 1, concluidaEm: FEITA },
        b: { codigo: '<p>dois (não concluída)</p>', conferencias: 1 },
      },
    }

    expect(montarSite(p, AULAS)).toEqual({
      html: '<h1>um</h1>\n\n<p>três</p>',
      partes: [
        { slug: 'a', titulo: 'Aula 1' },
        { slug: 'c', titulo: 'Aula 3' },
      ],
    })
    expect(proximaParaEstudar(p, AULAS)?.slug).toBe('b')
    expect(ultimaConcluida(p, AULAS)?.slug).toBe('c')
  })

  it('tudo concluído: não há próxima', () => {
    const p: Progresso = {
      ...PROGRESSO_VAZIO,
      aulas: Object.fromEntries(
        AULAS.map((a) => [a.slug, { conferencias: 1, concluidaEm: FEITA }]),
      ),
    }
    expect(proximaParaEstudar(p, AULAS)).toBeUndefined()
  })
})
```

- [ ] **Step 2: Rodar e ver falhar**

Run: `npx vitest run src/lib/progresso/acoes.spec.ts src/lib/progresso/conquistas.spec.ts src/lib/progresso/site.spec.ts`
Expected: FAIL nos três — imports não resolvidos.

- [ ] **Step 3: Implementar**

`src/lib/progresso/acoes.ts`:

```ts
import type { Progresso, ProgressoAula } from './modelo'

const AULA_NOVA: ProgressoAula = { conferencias: 0 }

function comAula(
  p: Progresso,
  slug: string,
  mudar: (aula: ProgressoAula) => ProgressoAula,
): Progresso {
  return {
    ...p,
    aulas: { ...p.aulas, [slug]: mudar(p.aulas[slug] ?? AULA_NOVA) },
  }
}

function comDia(p: Progresso, dia: string): Progresso {
  return p.diasEstudados.includes(dia)
    ? p
    : { ...p, diasEstudados: [...p.diasEstudados, dia] }
}

/** Data local AAAA-MM-DD (o "sv-SE" formata exatamente assim). */
export function hoje(data = new Date()) {
  return data.toLocaleDateString('sv-SE')
}

export function salvarCodigo(p: Progresso, slug: string, codigo: string) {
  return comAula(p, slug, (aula) => ({ ...aula, codigo }))
}

export function registrarConferencia(p: Progresso, slug: string, dia: string) {
  return comDia(
    comAula(p, slug, (aula) => ({
      ...aula,
      conferencias: aula.conferencias + 1,
    })),
    dia,
  )
}

export function concluirAula(
  p: Progresso,
  slug: string,
  agora: string,
  dia: string,
) {
  return comDia(
    comAula(p, slug, (aula) =>
      aula.concluidaEm ? aula : { ...aula, concluidaEm: agora },
    ),
    dia,
  )
}

/** Nome em branco conta como "pular" (o campo é opcional — DS 9). */
export function definirNome(p: Progresso, nome: string): Progresso {
  const limpo = nome.trim()
  return { ...p, nome: limpo || undefined, nomePulado: !limpo }
}

export function pularNome(p: Progresso): Progresso {
  return { ...p, nomePulado: true }
}
```

`src/lib/progresso/conquistas.ts`:

```ts
import type { Progresso } from './modelo'

export type Conquista = {
  id: 'hello-world' | 'persistente'
  titulo: string
  /** Mostrada quando já foi ganha. */
  descricao: string
  /** Mostrada enquanto falta ganhar. */
  comoGanhar: string
  ganhou: (p: Progresso) => boolean
}

const concluidas = (p: Progresso) =>
  Object.values(p.aulas).filter((aula) => aula.concluidaEm)

/** HU-09. Reconhece marcos; nunca tempo de uso nem sequência de dias (briefing 10.4). */
export const CONQUISTAS: Conquista[] = [
  {
    id: 'hello-world',
    titulo: 'Hello, World',
    descricao: 'Você concluiu a sua primeira aula.',
    comoGanhar: 'Conclua uma aula.',
    ganhou: (p) => concluidas(p).length > 0,
  },
  {
    id: 'persistente',
    titulo: 'Persistente',
    descricao: 'Você concluiu uma aula depois de conferir três vezes ou mais.',
    comoGanhar:
      'Conclua uma aula depois de conferir três vezes ou mais. Errar faz parte!',
    ganhou: (p) => concluidas(p).some((aula) => aula.conferencias >= 3),
  },
]

/** Marca as conquistas recém-ganhas e devolve quais foram (para o aviso). */
export function registrarConquistas(p: Progresso, agora: string) {
  const novas = CONQUISTAS.filter((c) => !p.conquistas[c.id] && c.ganhou(p))
  if (novas.length === 0) return { progresso: p, novas }
  const conquistas = { ...p.conquistas }
  for (const c of novas) conquistas[c.id] = { em: agora }
  return { progresso: { ...p, conquistas }, novas }
}
```

`src/lib/progresso/site.ts`:

```ts
import type { Aula } from '@/content/aulas/types'

import type { Progresso } from './modelo'

const concluida = (p: Progresso, aula: Aula) =>
  Boolean(p.aulas[aula.slug]?.concluidaEm)

/** "Meu site" (HU-07): o código de cada aula concluída, na ordem das aulas. */
export function montarSite(p: Progresso, aulas: Aula[]) {
  const feitas = aulas.filter((aula) => concluida(p, aula))
  return {
    html: feitas
      .map((aula) => (p.aulas[aula.slug]?.codigo ?? '').trim())
      .filter(Boolean)
      .join('\n\n'),
    partes: feitas.map(({ slug, titulo }) => ({ slug, titulo })),
  }
}

export function proximaParaEstudar(p: Progresso, aulas: Aula[]) {
  return aulas.find((aula) => !concluida(p, aula))
}

export function ultimaConcluida(p: Progresso, aulas: Aula[]) {
  return [...aulas].reverse().find((aula) => concluida(p, aula))
}
```

`src/lib/progresso/use-progresso.ts`:

```ts
import { useSyncExternalStore } from 'react'

import { assinarProgresso, type EstadoProgresso, obterEstado } from './store'

/**
 * O progresso da aluna. No servidor (e na hidratação) é null: quem usa mostra
 * um estado "carregando" e só depois o que está guardado no aparelho.
 */
export function useProgresso(): EstadoProgresso | null {
  return useSyncExternalStore(assinarProgresso, obterEstado, () => null)
}
```

- [ ] **Step 4: Rodar e ver passar**

Run: `npx vitest run src/lib/progresso`
Expected: PASS — modelo 4, store 6, acoes 5, conquistas 4, site 3 (`22 passed`).

- [ ] **Step 5: Commit**

```bash
git add src/lib/progresso
git commit -m "feat: add progress actions, achievements and personal site assembly"
```

---

### Task 4: Velocidade dentro do progresso

**Files:**

- Modify: `src/lib/escuta/velocidade.ts`
- Test: `src/lib/escuta/velocidade.spec.ts`

- [ ] **Step 1: Teste da migração**

Acrescentar ao `describe('velocidade', …)` de `src/lib/escuta/velocidade.spec.ts`:

```ts
it('migra a velocidade guardada pelo Plano 3 para o progresso', () => {
  localStorage.setItem('codeluv:velocidade', '1.25')
  expect(lerVelocidade()).toBe(1.25)

  salvarVelocidade(0.75)
  expect(localStorage.getItem('codeluv:velocidade')).toBeNull()
  expect(
    JSON.parse(localStorage.getItem('codeluv:progresso')!).velocidade,
  ).toBe(0.75)
})
```

Run: `npx vitest run src/lib/escuta/velocidade.spec.ts`
Expected: FAIL no caso novo (a chave antiga continua lá; não existe `codeluv:progresso`).

- [ ] **Step 2: Reescrever `velocidade.ts` sobre o progresso**

`src/lib/escuta/velocidade.ts` inteiro (a API pública não muda — `useEscuta` continua igual):

```ts
import { type Velocidade, velocidadeValida } from '@/lib/progresso/modelo'
import {
  assinarProgresso,
  atualizarProgresso,
  esquecerProgressoEmMemoria,
  obterEstado,
} from '@/lib/progresso/store'

export { type Velocidade, VELOCIDADES } from '@/lib/progresso/modelo'

/** Chave do Plano 3; migrada para o progresso na primeira escolha nova. */
const CHAVE_ANTIGA = 'codeluv:velocidade'

/** Velocidade lembrada (HU-03): a do progresso, senão a antiga, senão 1×. */
export function lerVelocidade(): Velocidade {
  const salva = obterEstado().progresso.velocidade
  if (salva) return salva
  try {
    const antiga = Number(localStorage.getItem(CHAVE_ANTIGA))
    if (velocidadeValida(antiga)) return antiga
  } catch {
    // Sem armazenamento: fica a padrão.
  }
  return 1
}

export function salvarVelocidade(valor: Velocidade) {
  atualizarProgresso((p) => ({ ...p, velocidade: valor }))
  try {
    localStorage.removeItem(CHAVE_ANTIGA)
  } catch {
    // Sem armazenamento: nada a migrar.
  }
}

/** Para useSyncExternalStore: a velocidade muda junto com o progresso. */
export const assinarVelocidade = assinarProgresso

/** Só para testes: esquece o que ficou em memória. */
export function esquecerVelocidadeEmMemoria() {
  esquecerProgressoEmMemoria()
}
```

- [ ] **Step 3: Ajustar o teste do hook da escuta**

Em `src/components/aula/use-escuta.spec.ts`, no caso "muda a velocidade, lembra e reinicia…", trocar
`expect(localStorage.getItem('codeluv:velocidade')).toBe('1.25')` por
`expect(JSON.parse(localStorage.getItem('codeluv:progresso')!).velocidade).toBe(1.25)`
(a velocidade agora mora no progresso).

- [ ] **Step 4: Rodar a escuta inteira**

Run: `npx vitest run src/lib/escuta src/components/aula/use-escuta.spec.ts src/components/aula/listen-controls.spec.tsx`
Expected: PASS em todos (os casos antigos de velocidade continuam valendo, mais o novo).

- [ ] **Step 5: Commit**

```bash
git add src/lib/escuta/velocidade.ts src/lib/escuta/velocidade.spec.ts src/components/aula/use-escuta.spec.ts
git commit -m "refactor: keep listening speed inside the progress"
```

---

### Task 5: Prática que lembra e conclusão com o site

**Files:**

- Create: `src/components/site-preview.tsx`
- Modify: `src/components/aula/lesson-done.tsx`
- Modify: `src/components/aula/practice.tsx`
- Test: `src/components/aula/practice.spec.tsx`

- [ ] **Step 1: Testes novos da prática**

Em `src/components/aula/practice.spec.tsx`:

1. Importar `import { atualizarProgresso, esquecerProgressoEmMemoria, obterEstado } from '@/lib/progresso/store'` e `import { salvarCodigo } from '@/lib/progresso/acoes'`.
2. No `beforeEach` existente, acrescentar `localStorage.clear()` e `esquecerProgressoEmMemoria()`.
3. Acrescentar:

```tsx
it('retoma o código salvo da aula', () => {
  atualizarProgresso((p) => salvarCodigo(p, aula.slug, '<h1>Guardado</h1>'))
  render(<Practice aula={aula} />)

  expect(editor()).toHaveValue('<h1>Guardado</h1>')
})

it('salva o código a cada mudança e conta as conferências', async () => {
  const user = userEvent.setup()
  render(<Practice aula={aula} />)

  escrever('<h1>Oi</h1>')
  await user.click(screen.getByRole('button', { name: 'Conferir' }))

  expect(obterEstado().progresso.aulas[aula.slug]).toMatchObject({
    codigo: '<h1>Oi</h1>',
    conferencias: 1,
  })
})

it('na conclusão mostra o site da aluna e avisa a conquista', async () => {
  const user = userEvent.setup()
  render(<Practice aula={aula} />)

  escrever(aula.pratica.solucao)
  await user.click(screen.getByRole('button', { name: 'Conferir' }))
  await user.click(screen.getByRole('button', { name: 'Concluir aula' }))

  expect(screen.getByText(/Seu site ganhou uma parte nova/)).toBeInTheDocument()
  expect(screen.getByTitle('Seu site').getAttribute('srcdoc')).toContain(
    'Olá, eu sou a Ana',
  )
  expect(screen.queryByRole('img')).not.toBeInTheDocument() // sem a Luv grande
  expect(add).toHaveBeenCalledWith(
    expect.objectContaining({ title: 'Conquista: Hello, World' }),
  )
  expect(obterEstado().progresso.aulas[aula.slug].concluidaEm).toBeDefined()
})
```

Run: `npx vitest run src/components/aula/practice.spec.tsx`
Expected: FAIL nos 3 casos novos.

- [ ] **Step 2: `SitePreview`**

`src/components/site-preview.tsx`:

```tsx
import { RetroWindow } from '@/components/retro-window'
import { cn } from '@/lib/utils'

type SitePreviewProps = {
  html: string
  /** Nome acessível do iframe. */
  titulo?: string
  className?: string
}

/** O site da aluna como ela escreveu (DS-08: sem estilos do CodeLuv, sem scripts). */
export function SitePreview({
  html,
  titulo = 'Seu site',
  className,
}: SitePreviewProps) {
  return (
    <RetroWindow title="Meu site">
      <iframe
        title={titulo}
        srcDoc={html}
        sandbox=""
        className={cn('h-64 w-full bg-white', className)}
      />
    </RetroWindow>
  )
}
```

- [ ] **Step 3: Conclusão com o site (sem a Luv)**

`src/components/aula/lesson-done.tsx` inteiro:

```tsx
'use client'

import { useEffect, useId, useRef } from 'react'
import Link from 'next/link'

import { SitePreview } from '@/components/site-preview'
import { buttonVariants } from '@/components/ui/button'

type LessonDoneProps = {
  titulo: string
  proxima?: { slug: string; titulo: string }
  /** O site da aluna já com a parte desta aula. */
  siteHtml: string
}

/**
 * Padrão "Conclusão de aula" (DS 9): o site com a parte nova, no lugar da
 * Luv grande (a Luv do objetivo já está na tela — uma Luv por tela).
 * O foco vai para o título ao aparecer.
 */
export function LessonDone({ titulo, proxima, siteHtml }: LessonDoneProps) {
  const tituloId = useId()
  const heading = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    heading.current?.focus()
  }, [])

  return (
    <section aria-labelledby={tituloId} className="flex flex-col gap-5">
      <h2
        id={tituloId}
        ref={heading}
        tabIndex={-1}
        className="font-display text-3xl font-bold outline-none"
      >
        Aula concluída!
      </h2>
      <p className="text-lg">
        Seu site ganhou uma parte nova: <strong>{titulo}</strong>.
      </p>
      <SitePreview html={siteHtml} />
      <div className="flex flex-wrap gap-3">
        {proxima && (
          <Link
            href={`/aulas/${proxima.slug}`}
            className={buttonVariants({ size: 'lg' })}
          >
            Próxima aula: {proxima.titulo}
          </Link>
        )}
        <Link
          href="/meu-site"
          className={buttonVariants({
            variant: proxima ? 'outline' : 'default',
            size: 'lg',
          })}
        >
          Ver meu site
        </Link>
        <Link
          href="/aulas"
          className={buttonVariants({ variant: 'outline', size: 'lg' })}
        >
          Voltar para as aulas
        </Link>
      </div>
    </section>
  )
}
```

- [ ] **Step 4: Prática que lembra**

Em `src/components/aula/practice.tsx`:

1. Imports novos:

```tsx
import { Badge } from '@/components/ui/badge'
import { AULAS } from '@/content/aulas'
import {
  concluirAula,
  hoje,
  registrarConferencia,
  salvarCodigo,
} from '@/lib/progresso/acoes'
import { type Conquista, registrarConquistas } from '@/lib/progresso/conquistas'
import { PROGRESSO_VAZIO } from '@/lib/progresso/modelo'
import { montarSite } from '@/lib/progresso/site'
import { atualizarProgresso } from '@/lib/progresso/store'
import { useProgresso } from '@/lib/progresso/use-progresso'
```

2. Trocar `const [codigo, setCodigo] = useState(pratica.inicial)` por:

```tsx
const estado = useProgresso()
const progresso = estado?.progresso ?? PROGRESSO_VAZIO
const salva = progresso.aulas[aula.slug]
// Só o que foi editado nesta visita fica no estado local: o valor mostrado
// é editado → salvo no aparelho → código inicial (sem setState em efeito).
const [editado, setEditado] = useState<string | null>(null)
const codigo = editado ?? salva?.codigo ?? pratica.inicial
```

3. `mudarCodigo`:

```tsx
function mudarCodigo(novo: string) {
  setEditado(novo)
  setResultados(null) // conferência antiga não vale para o código novo
  atualizarProgresso((p) => salvarCodigo(p, aula.slug, novo))
}
```

4. Em `conferir`, depois de `setResultados(novos)`: `atualizarProgresso((p) => registrarConferencia(p, aula.slug, hoje()))`.

5. `concluir`:

```tsx
function concluir() {
  const agora = new Date().toISOString()
  let novas: Conquista[] = []
  atualizarProgresso((p) => {
    const resultado = registrarConquistas(
      concluirAula(p, aula.slug, agora, hoje()),
      agora,
    )
    novas = resultado.novas
    return resultado.progresso
  })
  setConcluida(true)
  toast.add({ title: 'Aula concluída', description: aula.titulo })
  for (const conquista of novas) {
    toast.add({
      title: `Conquista: ${conquista.titulo}`,
      description: conquista.descricao,
    })
  }
}
```

6. Conclusão: trocar `return <LessonDone titulo={aula.titulo} proxima={proxima} />` por:

```tsx
return (
  <LessonDone
    titulo={aula.titulo}
    proxima={proxima}
    siteHtml={montarSite(progresso, AULAS).html}
  />
)
```

7. Logo depois do `<h2 …>Prática</h2>`, mostrar quando a aula já foi concluída antes:

```tsx
{
  salva?.concluidaEm && (
    <Badge variant="outline" className="w-fit">
      Você já concluiu esta aula
    </Badge>
  )
}
```

8. Atualizar o JSDoc do componente: trocar "Nada é salvo ainda (Plano 4)." por "Código, conferências e conclusão ficam no progresso da aluna (Plano 4)."

- [ ] **Step 5: Rodar e ver passar**

Run: `npx vitest run src/components/aula/practice.spec.tsx && npm test`
Expected: PASS na prática (casos antigos + 3 novos) e na suíte toda.

- [ ] **Step 6: Commit**

```bash
git add src/components/site-preview.tsx src/components/aula/lesson-done.tsx src/components/aula/practice.tsx src/components/aula/practice.spec.tsx
git commit -m "feat: remember lesson code and celebrate with the student's site"
```

---

### Task 6: Selo "Concluída" na lista de aulas

**Files:**

- Create: `src/components/aula/estado-aula.tsx`
- Test: `src/components/aula/estado-aula.spec.tsx`
- Modify: `src/app/(app)/aulas/page.tsx`

- [ ] **Step 1: Teste**

`src/components/aula/estado-aula.spec.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'

import { concluirAula } from '@/lib/progresso/acoes'
import {
  atualizarProgresso,
  esquecerProgressoEmMemoria,
} from '@/lib/progresso/store'

import { EstadoAula } from './estado-aula'

describe('EstadoAula', () => {
  beforeEach(() => {
    localStorage.clear()
    esquecerProgressoEmMemoria()
  })

  it('não mostra nada para aula não concluída', () => {
    const { container } = render(<EstadoAula slug="seu-primeiro-html" />)
    expect(container).toBeEmptyDOMElement()
  })

  it('mostra "Concluída" para aula concluída', () => {
    atualizarProgresso((p) =>
      concluirAula(
        p,
        'seu-primeiro-html',
        '2026-10-09T20:00:00.000Z',
        '2026-10-09',
      ),
    )
    render(<EstadoAula slug="seu-primeiro-html" />)
    expect(screen.getByText('Concluída')).toBeInTheDocument()
  })
})
```

Run: `npx vitest run src/components/aula/estado-aula.spec.tsx`
Expected: FAIL — import não resolvido.

- [ ] **Step 2: Implementar**

`src/components/aula/estado-aula.tsx`:

```tsx
'use client'

import { CheckIcon } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { useProgresso } from '@/lib/progresso/use-progresso'

/** Selo da lista de aulas (HU-11: a aluna mostra ao mentor onde está). */
export function EstadoAula({ slug }: { slug: string }) {
  const estado = useProgresso()
  if (!estado?.progresso.aulas[slug]?.concluidaEm) return null
  return (
    <Badge variant="outline">
      <CheckIcon data-icon="inline-start" aria-hidden />
      Concluída
    </Badge>
  )
}
```

Em `src/app/(app)/aulas/page.tsx`: importar `EstadoAula` de `@/components/aula/estado-aula` e, dentro de `<ItemActions>`, antes do `<span>` da duração, colocar `<EstadoAula slug={aula.slug} />`. Trocar o `<ItemActions>` para `<ItemActions className="flex-wrap justify-end gap-2">` se o selo e a duração não couberem lado a lado.

Run: `npx vitest run src/components/aula/estado-aula.spec.tsx`
Expected: PASS, `2 passed`.

- [ ] **Step 3: Commit**

```bash
git add src/components/aula/estado-aula.tsx src/components/aula/estado-aula.spec.tsx "src/app/(app)/aulas/page.tsx"
git commit -m "feat: show completed badge in the lessons list"
```

---

### Task 7: Início — primeiro uso, boas-vindas e "Continuar"

**Files:**

- Create: `src/components/inicio/inicio.tsx`
- Test: `src/components/inicio/inicio.spec.tsx`
- Modify: `src/app/(app)/page.tsx`

- [ ] **Step 1: Teste**

`src/components/inicio/inicio.spec.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { concluirAula, definirNome } from '@/lib/progresso/acoes'
import {
  atualizarProgresso,
  esquecerProgressoEmMemoria,
  obterEstado,
} from '@/lib/progresso/store'

import { Inicio } from './inicio'

const { push } = vi.hoisted(() => ({ push: vi.fn() }))
vi.mock('next/navigation', () => ({ useRouter: () => ({ push }) }))

describe('Inicio', () => {
  beforeEach(() => {
    localStorage.clear()
    esquecerProgressoEmMemoria()
    push.mockClear()
  })

  it('primeiro uso: pergunta o nome (opcional) e leva à primeira aula', async () => {
    const user = userEvent.setup()
    render(<Inicio />)

    expect(
      screen.getByRole('heading', { level: 1, name: 'Oi!' }),
    ).toBeInTheDocument()
    await user.type(
      screen.getByLabelText('Como você quer ser chamada? (opcional)'),
      'Ana',
    )
    await user.click(
      screen.getByRole('button', { name: 'Começar a primeira aula' }),
    )

    expect(obterEstado().progresso.nome).toBe('Ana')
    expect(push).toHaveBeenCalledWith('/aulas/seu-primeiro-html')
  })

  it('primeiro uso: pular também leva à primeira aula, sem nome', async () => {
    const user = userEvent.setup()
    render(<Inicio />)

    await user.click(screen.getByRole('button', { name: 'Pular' }))

    expect(obterEstado().progresso).toMatchObject({ nomePulado: true })
    expect(obterEstado().progresso.nome).toBeUndefined()
    expect(push).toHaveBeenCalledWith('/aulas/seu-primeiro-html')
  })

  it('de volta: cumprimenta pelo nome e oferece continuar', () => {
    atualizarProgresso((p) => definirNome(p, 'Ana'))
    render(<Inicio />)

    expect(
      screen.getByRole('heading', { level: 1, name: 'Oi, Ana!' }),
    ).toBeInTheDocument()
    expect(screen.getByText('Continuar: Seu primeiro HTML')).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: /Começar a aula/ }),
    ).toHaveAttribute('href', '/aulas/seu-primeiro-html')
    expect(screen.getByText('0 de 1')).toBeInTheDocument()
  })

  it('tudo concluído: celebra e leva ao site', () => {
    atualizarProgresso((p) =>
      concluirAula(
        definirNome(p, 'Ana'),
        'seu-primeiro-html',
        '2026-10-09T20:00:00.000Z',
        '2026-10-09',
      ),
    )
    render(<Inicio />)

    expect(
      screen.getByText(/Você concluiu todas as aulas disponíveis por enquanto/),
    ).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Ver meu site' })).toHaveAttribute(
      'href',
      '/meu-site',
    )
    expect(screen.getByText('1 de 1')).toBeInTheDocument()
  })

  it('progresso que não deu para ler: explica sem culpar e aponta a cópia', () => {
    localStorage.setItem('codeluv:progresso', '{quebrado')
    render(<Inicio />)

    expect(
      screen.getByText('Não encontramos seu progresso neste aparelho'),
    ).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Configurações' })).toHaveAttribute(
      'href',
      '/configuracoes',
    )
  })
})
```

Run: `npx vitest run src/components/inicio/inicio.spec.tsx`
Expected: FAIL — import não resolvido.

- [ ] **Step 2: Implementar**

`src/components/inicio/inicio.tsx`:

```tsx
'use client'

import { useId } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { PlayIcon, TriangleAlertIcon } from 'lucide-react'

import { LuvSays } from '@/components/luv/luv-says'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button, buttonVariants } from '@/components/ui/button'
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Progress, ProgressLabel } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import { AULAS } from '@/content/aulas'
import { definirNome, pularNome } from '@/lib/progresso/acoes'
import type { Progresso } from '@/lib/progresso/modelo'
import { proximaParaEstudar, ultimaConcluida } from '@/lib/progresso/site'
import { atualizarProgresso } from '@/lib/progresso/store'
import { useProgresso } from '@/lib/progresso/use-progresso'

const TITULO = 'font-display text-4xl leading-tight font-extrabold md:text-6xl'
const GRADE = 'grid items-center gap-10 lg:grid-cols-[1.2fr_1fr]'

function Luv() {
  return (
    <LuvSays hero announce={false}>
      Eu sou a Luv. Vou estudar com você! <span aria-hidden="true">✦</span>
    </LuvSays>
  )
}

/** DS 9 — Primeiro uso: a Luv, o combinado e um único caminho (nome opcional). */
function PrimeiroUso() {
  const router = useRouter()
  const nomeId = useId()
  const primeira = AULAS[0]

  function comecar(evento: React.FormEvent<HTMLFormElement>) {
    evento.preventDefault()
    const nome = new FormData(evento.currentTarget).get('nome')
    atualizarProgresso((p) =>
      definirNome(p, typeof nome === 'string' ? nome : ''),
    )
    router.push(`/aulas/${primeira.slug}`)
  }

  function pular() {
    atualizarProgresso(pularNome)
    router.push(`/aulas/${primeira.slug}`)
  }

  return (
    <section className={GRADE}>
      <div className="flex flex-col gap-6">
        <h1 className={TITULO}>Oi!</h1>
        <ul className="flex list-disc flex-col gap-1 pl-6 text-lg text-muted-foreground">
          <li>As aulas são curtas, de uns 15 minutos.</li>
          <li>Você pode ouvir cada explicação.</li>
          <li>Cada aula acrescenta uma parte ao seu site.</li>
        </ul>
        <form onSubmit={comecar} className="flex flex-col gap-4">
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor={nomeId}>
                Como você quer ser chamada? (opcional)
              </FieldLabel>
              <Input
                id={nomeId}
                name="nome"
                autoComplete="given-name"
                maxLength={40}
              />
            </Field>
          </FieldGroup>
          <div className="flex flex-wrap gap-3">
            <Button type="submit" size="lg">
              <PlayIcon data-icon="inline-start" />
              Começar a primeira aula
            </Button>
            <Button type="button" variant="ghost" size="lg" onClick={pular}>
              Pular
            </Button>
          </div>
        </form>
      </div>
      <Luv />
    </section>
  )
}

/** DS 9 — Retomada: "Continuar" em destaque e o progresso do módulo. */
function BoasVindas({
  progresso,
  perdido,
}: {
  progresso: Progresso
  perdido: boolean
}) {
  const proxima = proximaParaEstudar(progresso, AULAS)
  const ultima = ultimaConcluida(progresso, AULAS)
  const concluidas = AULAS.filter(
    (a) => progresso.aulas[a.slug]?.concluidaEm,
  ).length

  return (
    <section className={GRADE}>
      <div className="flex flex-col gap-6">
        <h1 className={TITULO}>
          {progresso.nome ? `Oi, ${progresso.nome}!` : 'Oi!'}
        </h1>

        {perdido && (
          <Alert variant="warning">
            <TriangleAlertIcon />
            <AlertTitle>
              Não encontramos seu progresso neste aparelho
            </AlertTitle>
            <AlertDescription>
              Se você guardou uma cópia, dá para recuperar em{' '}
              <Link href="/configuracoes">Configurações</Link>.
            </AlertDescription>
          </Alert>
        )}

        {proxima ? (
          <Card className="border-primary shadow-sticker-lg">
            <CardHeader>
              <CardTitle>Continuar: {proxima.titulo}</CardTitle>
              <CardDescription>
                {ultima
                  ? `Na última vez você concluiu “${ultima.titulo}”.`
                  : `Aula ${proxima.ordem} · cerca de ${proxima.duracaoMin} minutos`}
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Link
                href={`/aulas/${proxima.slug}`}
                className={buttonVariants({ size: 'lg' })}
              >
                <PlayIcon data-icon="inline-start" />
                {ultima ? 'Continuar' : 'Começar a aula'}
              </Link>
            </CardFooter>
          </Card>
        ) : (
          <div className="flex flex-col gap-3">
            <p className="text-lg">
              Você concluiu todas as aulas disponíveis por enquanto. Que tal
              olhar o seu site?
            </p>
            <Link href="/meu-site" className={buttonVariants({ size: 'lg' })}>
              Ver meu site
            </Link>
          </div>
        )}

        <Progress value={(concluidas / AULAS.length) * 100}>
          <ProgressLabel>Aulas de HTML</ProgressLabel>
          <span className="ml-auto text-sm text-muted-foreground tabular-nums">
            {concluidas} de {AULAS.length}
          </span>
        </Progress>
      </div>
      <Luv />
    </section>
  )
}

export function Inicio() {
  const estado = useProgresso()

  if (!estado) {
    return (
      <section className={GRADE}>
        <div className="flex flex-col gap-6">
          <h1 className={TITULO}>Oi!</h1>
          <Skeleton className="h-32 w-full" />
        </div>
      </section>
    )
  }

  const { progresso, perdido } = estado
  const primeiroUso =
    !perdido &&
    !progresso.nome &&
    !progresso.nomePulado &&
    Object.keys(progresso.aulas).length === 0

  return primeiroUso ? (
    <PrimeiroUso />
  ) : (
    <BoasVindas progresso={progresso} perdido={perdido} />
  )
}
```

`src/app/(app)/page.tsx` inteiro:

```tsx
import { Inicio } from '@/components/inicio/inicio'

export default function InicioPage() {
  return <Inicio />
}
```

- [ ] **Step 3: Rodar e ver passar**

Run: `npx vitest run src/components/inicio/inicio.spec.tsx`
Expected: PASS, `5 passed`.

- [ ] **Step 4: Commit**

```bash
git add src/components/inicio "src/app/(app)/page.tsx"
git commit -m "feat: welcome with name, continue card and lost progress notice"
```

---

### Task 8: Meu site e Conquistas

**Files:**

- Create: `src/components/meu-site/meu-site.tsx` (+ `.spec.tsx`)
- Create: `src/components/conquistas/lista-conquistas.tsx` (+ `.spec.tsx`)
- Modify: `src/app/(app)/meu-site/page.tsx`, `src/app/(app)/conquistas/page.tsx`

- [ ] **Step 1: Testes**

`src/components/meu-site/meu-site.spec.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'

import { concluirAula, salvarCodigo } from '@/lib/progresso/acoes'
import {
  atualizarProgresso,
  esquecerProgressoEmMemoria,
} from '@/lib/progresso/store'

import { MeuSite } from './meu-site'

describe('MeuSite', () => {
  beforeEach(() => {
    localStorage.clear()
    esquecerProgressoEmMemoria()
  })

  it('sem partes: convida para a primeira aula', () => {
    render(<MeuSite />)

    expect(screen.getByText('Seu site aparece aqui')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Ver as aulas' })).toHaveAttribute(
      'href',
      '/aulas',
    )
  })

  it('com aulas concluídas: mostra o site e as partes, com link para editar', () => {
    atualizarProgresso((p) =>
      concluirAula(
        salvarCodigo(p, 'seu-primeiro-html', '<h1>Olá, eu sou a Ana</h1>'),
        'seu-primeiro-html',
        '2026-10-09T20:00:00.000Z',
        '2026-10-09',
      ),
    )
    render(<MeuSite />)

    expect(screen.getByTitle('Seu site').getAttribute('srcdoc')).toBe(
      '<h1>Olá, eu sou a Ana</h1>',
    )
    expect(
      screen.getByRole('link', { name: 'Aula 1 · Seu primeiro HTML' }),
    ).toHaveAttribute('href', '/aulas/seu-primeiro-html')
  })
})
```

`src/components/conquistas/lista-conquistas.spec.tsx`:

```tsx
import { render, screen, within } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'

import {
  atualizarProgresso,
  esquecerProgressoEmMemoria,
} from '@/lib/progresso/store'

import { ListaConquistas } from './lista-conquistas'

describe('ListaConquistas', () => {
  beforeEach(() => {
    localStorage.clear()
    esquecerProgressoEmMemoria()
  })

  it('mostra as ganhas com a data e as que faltam com como ganhar', () => {
    atualizarProgresso((p) => ({
      ...p,
      conquistas: { 'hello-world': { em: '2026-10-09T15:00:00.000Z' } },
    }))
    render(<ListaConquistas />)

    expect(screen.getByText('1 de 2 conquistas')).toBeInTheDocument()

    const [hello, persistente] = screen.getAllByRole('listitem')
    expect(within(hello).getByText('Hello, World')).toBeInTheDocument()
    expect(within(hello).getByText(/Ganha em 9 de outubro/)).toBeInTheDocument()
    expect(within(persistente).getByText(/Como ganhar:/)).toBeInTheDocument()
  })
})
```

Run: `npx vitest run src/components/meu-site src/components/conquistas`
Expected: FAIL — imports não resolvidos.

- [ ] **Step 2: Implementar `MeuSite`**

`src/components/meu-site/meu-site.tsx`:

```tsx
'use client'

import Link from 'next/link'

import { EmptyState } from '@/components/empty-state'
import { SitePreview } from '@/components/site-preview'
import { Skeleton } from '@/components/ui/skeleton'
import { AULAS } from '@/content/aulas'
import { montarSite } from '@/lib/progresso/site'
import { useProgresso } from '@/lib/progresso/use-progresso'

/** HU-07: o site que a aluna está construindo, parte por parte. */
export function MeuSite() {
  const estado = useProgresso()
  if (!estado) return <Skeleton className="h-96 w-full" />

  const { html, partes } = montarSite(estado.progresso, AULAS)
  if (partes.length === 0) {
    return (
      <EmptyState
        title="Seu site aparece aqui"
        description="Depois da primeira aula, cada parte que você criar vem morar nesta página."
        action={{ label: 'Ver as aulas', href: '/aulas' }}
      />
    )
  }

  return (
    <div className="flex flex-col gap-8">
      <SitePreview html={html} className="h-[60vh]" />
      <section aria-labelledby="partes" className="flex flex-col gap-3">
        <h2 id="partes" className="font-display text-2xl font-semibold">
          Partes do seu site
        </h2>
        <ol className="flex list-decimal flex-col gap-2 pl-6 text-lg">
          {partes.map((parte) => {
            const ordem = AULAS.find((a) => a.slug === parte.slug)?.ordem
            return (
              <li key={parte.slug}>
                <Link
                  href={`/aulas/${parte.slug}`}
                  className="text-link underline underline-offset-4"
                >
                  Aula {ordem} · {parte.titulo}
                </Link>
              </li>
            )
          })}
        </ol>
      </section>
    </div>
  )
}
```

`src/app/(app)/meu-site/page.tsx` inteiro:

```tsx
import type { Metadata } from 'next'

import { MeuSite } from '@/components/meu-site/meu-site'

export const metadata: Metadata = { title: 'Meu site' }

export default function MeuSitePage() {
  return (
    <>
      <h1 className="font-display text-3xl font-bold md:text-4xl">Meu site</h1>
      <MeuSite />
    </>
  )
}
```

- [ ] **Step 3: Implementar `ListaConquistas`**

`src/components/conquistas/lista-conquistas.tsx`:

```tsx
'use client'

import { HeartIcon, LockIcon } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { CONQUISTAS } from '@/lib/progresso/conquistas'
import { useProgresso } from '@/lib/progresso/use-progresso'

const DATA = new Intl.DateTimeFormat('pt-BR', { day: 'numeric', month: 'long' })

/** DS 8.2 — AchievementBadge: ganha (cores plenas) ou bloqueada (como ganhar). */
export function ListaConquistas() {
  const estado = useProgresso()
  if (!estado) return <Skeleton className="h-40 w-full" />

  const { conquistas } = estado.progresso
  const ganhas = CONQUISTAS.filter((c) => conquistas[c.id]).length

  return (
    <div className="flex flex-col gap-4">
      <p className="text-lg text-muted-foreground">
        {ganhas} de {CONQUISTAS.length} conquistas
      </p>
      <ul className="grid gap-4 md:grid-cols-2">
        {CONQUISTAS.map((conquista) => {
          const ganha = conquistas[conquista.id]
          return (
            <li key={conquista.id}>
              <Card className={ganha ? 'border-line-strong' : 'opacity-80'}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {ganha ? (
                      <HeartIcon aria-hidden className="text-primary" />
                    ) : (
                      <LockIcon aria-hidden className="text-muted-foreground" />
                    )}
                    {conquista.titulo}
                  </CardTitle>
                  <CardDescription>
                    {ganha
                      ? conquista.descricao
                      : `Como ganhar: ${conquista.comoGanhar}`}
                  </CardDescription>
                  {ganha && (
                    <Badge className="w-fit">
                      Ganha em {DATA.format(new Date(ganha.em))}
                    </Badge>
                  )}
                </CardHeader>
              </Card>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
```

`src/app/(app)/conquistas/page.tsx` inteiro:

```tsx
import type { Metadata } from 'next'

import { ListaConquistas } from '@/components/conquistas/lista-conquistas'

export const metadata: Metadata = { title: 'Conquistas' }

export default function ConquistasPage() {
  return (
    <>
      <h1 className="font-display text-3xl font-bold md:text-4xl">
        Conquistas
      </h1>
      <ListaConquistas />
    </>
  )
}
```

- [ ] **Step 4: Rodar e ver passar**

Run: `npx vitest run src/components/meu-site src/components/conquistas`
Expected: PASS — `2 passed` e `1 passed`. (Se a data sair "9 de outubro" em outro fuso, o teste usa 15h UTC justamente para cair no dia 9 em qualquer fuso do Brasil.)

- [ ] **Step 5: Commit**

```bash
git add src/components/meu-site src/components/conquistas "src/app/(app)/meu-site/page.tsx" "src/app/(app)/conquistas/page.tsx"
git commit -m "feat: show the personal site and achievements"
```

---

### Task 9: Configurações — nome, cópia e apagar

**Files:**

- Create: `src/components/configuracoes/configuracoes.tsx` (+ `.spec.tsx`)
- Modify: `src/app/(app)/configuracoes/page.tsx`

- [ ] **Step 1: Teste**

`src/components/configuracoes/configuracoes.spec.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { definirNome } from '@/lib/progresso/acoes'
import {
  atualizarProgresso,
  esquecerProgressoEmMemoria,
  obterEstado,
} from '@/lib/progresso/store'

import { Configuracoes } from './configuracoes'

const { add } = vi.hoisted(() => ({ add: vi.fn() }))
vi.mock('@/components/ui/toast', () => ({ toast: { add } }))

describe('Configuracoes', () => {
  beforeEach(() => {
    localStorage.clear()
    esquecerProgressoEmMemoria()
    add.mockClear()
  })

  it('muda o nome', async () => {
    const user = userEvent.setup()
    atualizarProgresso((p) => definirNome(p, 'Ana'))
    render(<Configuracoes />)

    const campo = screen.getByLabelText(
      'Como você quer ser chamada? (opcional)',
    )
    expect(campo).toHaveValue('Ana')
    await user.clear(campo)
    await user.type(campo, 'Bia')
    await user.click(screen.getByRole('button', { name: 'Salvar nome' }))

    expect(obterEstado().progresso.nome).toBe('Bia')
  })

  it('recusa um arquivo que não é cópia, sem perder nada', async () => {
    const user = userEvent.setup()
    atualizarProgresso((p) => definirNome(p, 'Ana'))
    render(<Configuracoes />)

    await user.upload(
      screen.getByLabelText('Recuperar de uma cópia'),
      new File(['oi'], 'qualquer.json', { type: 'application/json' }),
    )

    expect(
      await screen.findByText('Esse arquivo não parece uma cópia do CodeLuv.'),
    ).toBeInTheDocument()
    expect(obterEstado().progresso.nome).toBe('Ana')
  })

  it('apagar pede confirmação, começa no Cancelar e apaga tudo ao confirmar', async () => {
    const user = userEvent.setup()
    atualizarProgresso((p) => definirNome(p, 'Ana'))
    render(<Configuracoes />)

    await user.click(
      screen.getByRole('button', { name: 'Apagar meu progresso' }),
    )
    const dialogo = await screen.findByRole('alertdialog', {
      name: 'Apagar todo o progresso?',
    })
    expect(screen.getByRole('button', { name: 'Cancelar' })).toHaveFocus()

    await user.click(
      screen.getAllByRole('button', { name: 'Apagar meu progresso' }).at(-1)!,
    )

    expect(obterEstado().progresso.nome).toBeUndefined()
    expect(dialogo).not.toBeInTheDocument()
  })
})
```

Run: `npx vitest run src/components/configuracoes`
Expected: FAIL — import não resolvido.

- [ ] **Step 2: Implementar**

`src/components/configuracoes/configuracoes.tsx`:

```tsx
'use client'

import { useId, useRef, useState } from 'react'
import { DownloadIcon } from 'lucide-react'

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from '@/components/ui/toast'
import { definirNome, hoje } from '@/lib/progresso/acoes'
import {
  apagarProgresso,
  atualizarProgresso,
  exportarProgresso,
  importarProgresso,
} from '@/lib/progresso/store'
import { useProgresso } from '@/lib/progresso/use-progresso'

const SECAO = 'flex flex-col gap-4'
const TITULO = 'font-display text-2xl font-semibold'

function baixarCopia() {
  const blob = new Blob([exportarProgresso()], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `codeluv-progresso-${hoje()}.json`
  link.click()
  URL.revokeObjectURL(url)
}

export function Configuracoes() {
  const estado = useProgresso()
  const nomeId = useId()
  const arquivoId = useId()
  const [erroCopia, setErroCopia] = useState<string | null>(null)
  const [confirmando, setConfirmando] = useState(false)
  const cancelar = useRef<HTMLButtonElement>(null)

  if (!estado) return <Skeleton className="h-96 w-full" />

  function salvarNome(evento: React.FormEvent<HTMLFormElement>) {
    evento.preventDefault()
    const nome = new FormData(evento.currentTarget).get('nome')
    atualizarProgresso((p) =>
      definirNome(p, typeof nome === 'string' ? nome : ''),
    )
    toast.add({ title: 'Nome salvo' })
  }

  async function recuperar(evento: React.ChangeEvent<HTMLInputElement>) {
    const arquivo = evento.target.files?.[0]
    evento.target.value = ''
    if (!arquivo) return
    if (importarProgresso(await arquivo.text())) {
      setErroCopia(null)
      toast.add({ title: 'Progresso recuperado' })
    } else {
      setErroCopia('Esse arquivo não parece uma cópia do CodeLuv.')
    }
  }

  function apagar() {
    apagarProgresso()
    setConfirmando(false)
    toast.add({ title: 'Progresso apagado' })
  }

  return (
    <div className="flex max-w-2xl flex-col gap-10">
      <section aria-labelledby="sec-nome" className={SECAO}>
        <h2 id="sec-nome" className={TITULO}>
          Seu nome
        </h2>
        {/* key: o campo recomeça com o nome guardado quando ele muda */}
        <form
          key={estado.progresso.nome ?? ''}
          onSubmit={salvarNome}
          className={SECAO}
        >
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor={nomeId}>
                Como você quer ser chamada? (opcional)
              </FieldLabel>
              <Input
                id={nomeId}
                name="nome"
                autoComplete="given-name"
                maxLength={40}
                defaultValue={estado.progresso.nome ?? ''}
              />
            </Field>
          </FieldGroup>
          <Button type="submit" className="w-fit">
            Salvar nome
          </Button>
        </form>
      </section>

      <Separator />

      <section aria-labelledby="sec-copia" className={SECAO}>
        <h2 id="sec-copia" className={TITULO}>
          Cópia do progresso
        </h2>
        <p className="text-muted-foreground">
          O progresso fica só neste aparelho. Guarde uma cópia para não perder
          nada ao limpar o navegador ou ao trocar de computador.
        </p>
        <Button variant="outline" className="w-fit" onClick={baixarCopia}>
          <DownloadIcon data-icon="inline-start" />
          Baixar uma cópia
        </Button>
        <FieldGroup>
          <Field data-invalid={erroCopia ? true : undefined}>
            <FieldLabel htmlFor={arquivoId}>Recuperar de uma cópia</FieldLabel>
            <Input
              id={arquivoId}
              type="file"
              accept="application/json,.json"
              aria-invalid={erroCopia ? true : undefined}
              onChange={recuperar}
            />
            <FieldDescription>
              Escolha o arquivo que você baixou. Ele substitui o progresso deste
              aparelho.
            </FieldDescription>
            {erroCopia && <FieldError>{erroCopia}</FieldError>}
          </Field>
        </FieldGroup>
      </section>

      <Separator />

      <section aria-labelledby="sec-apagar" className={SECAO}>
        <h2 id="sec-apagar" className={TITULO}>
          Apagar progresso
        </h2>
        <AlertDialog open={confirmando} onOpenChange={setConfirmando}>
          <AlertDialogTrigger
            render={<Button variant="destructive" className="w-fit" />}
          >
            Apagar meu progresso
          </AlertDialogTrigger>
          <AlertDialogContent initialFocus={cancelar}>
            <AlertDialogHeader>
              <AlertDialogTitle>Apagar todo o progresso?</AlertDialogTitle>
              <AlertDialogDescription>
                Isso apaga as aulas concluídas, o seu código, as conquistas e o
                seu nome neste aparelho. Não dá para desfazer. Se quiser, baixe
                uma cópia antes.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel ref={cancelar}>Cancelar</AlertDialogCancel>
              <Button variant="destructive" onClick={apagar}>
                Apagar meu progresso
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </section>
    </div>
  )
}
```

Observações para quem implementa:

- `AlertDialogContent` repassa as props do `Popup` do Base UI, que aceita `initialFocus` com uma ref. O teste exige o foco inicial no "Cancelar" (DS 9 — Confirmação destrutiva). Se a `ref` passada ao `AlertDialogCancel` não chegar ao botão (leia `src/components/ui/alert-dialog.tsx`), passe-a pelo `render` do `Close`: `<AlertDialogCancel render={<Button ref={cancelar} variant="outline" />}>Cancelar</AlertDialogCancel>`.
- O "Apagar meu progresso" de dentro do diálogo é um `Button` comum (não o `AlertDialogAction`) porque precisa apagar e fechar pelo estado controlado.

`src/app/(app)/configuracoes/page.tsx` inteiro:

```tsx
import type { Metadata } from 'next'

import { Configuracoes } from '@/components/configuracoes/configuracoes'

export const metadata: Metadata = { title: 'Configurações' }

export default function ConfiguracoesPage() {
  return (
    <>
      <h1 className="font-display text-3xl font-bold md:text-4xl">
        Configurações
      </h1>
      <Configuracoes />
    </>
  )
}
```

- [ ] **Step 3: Rodar e ver passar**

Run: `npx vitest run src/components/configuracoes && npm test && npx eslint . && npx tsc --noEmit`
Expected: PASS, `3 passed` nas Configurações; suíte, lint e tipos limpos.

- [ ] **Step 4: Commit**

```bash
git add src/components/configuracoes "src/app/(app)/configuracoes/page.tsx"
git commit -m "feat: settings with name, progress backup and erase"
```

---

### Task 10: Ponta a ponta

**Files:**

- Create: `e2e/helpers.ts`, `e2e/progresso.spec.ts`
- Modify: `e2e/aula.spec.ts`, `e2e/navigation.spec.ts`

- [ ] **Step 1: Helper compartilhado**

`e2e/helpers.ts`:

```ts
import type { Page } from '@playwright/test'

/** Substitui todo o código do editor (insertText não dispara atalhos por tecla). */
export async function escrever(page: Page, codigo: string) {
  await page.getByRole('textbox', { name: 'Seu código HTML' }).click()
  await page.keyboard.press('ControlOrMeta+A')
  await page.keyboard.insertText(codigo)
}
```

Em `e2e/aula.spec.ts`, apagar a função `escrever` local e importar `import { escrever } from './helpers'`.

- [ ] **Step 2: Início com primeiro uso**

Em `e2e/navigation.spec.ts`, trocar o teste `'vai do Início às Aulas pelo botão principal'` por:

```ts
test('no primeiro uso, pular leva à primeira aula', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: 'Pular' }).click()
  await expect(page).toHaveURL('/aulas/seu-primeiro-html')
})
```

- [ ] **Step 3: Testes do progresso**

`e2e/progresso.spec.ts`:

```ts
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
```

- [ ] **Step 4: Rodar**

Garanta a porta 3000 livre (`lsof -iTCP:3000 -sTCP:LISTEN`) e rode `npm run test:e2e`.
Expected: `22 passed` (18 anteriores — um deles trocado — + 4 novos). Os testes de acessibilidade de navegação (axe) agora cobrem o Início com o formulário, Meu site, Conquistas e Configurações reais: se o axe apontar algo, corrija o componente, nunca a regra.

- [ ] **Step 5: Commit**

```bash
git add e2e
git commit -m "test: cover progress, personal site and backup end to end"
```

---

### Task 11: Documentos e verificação final

**Files:**

- Modify: `docs/design-system.md`, `docs/briefing.md`

- [ ] **Step 1: Design system**

1. §8.1 inventário — marcar `pronto` e ajustar a coluna "Base shadcn":

| Componente         | Base shadcn (novo texto)                                                                                           |
| ------------------ | ------------------------------------------------------------------------------------------------------------------ |
| `AchievementBadge` | `card` + `badge` — `src/components/conquistas/lista-conquistas.tsx`                                                |
| `Dialog`           | `alert-dialog` (Apagar progresso, com foco inicial no Cancelar) — `src/components/configuracoes/configuracoes.tsx` |
| `TextField`        | `field` + `input` — Início e Configurações                                                                         |
| `LessonListItem`   | `item` (`outline`) + selo "Concluída" (`EstadoAula`)                                                               |

2. §9 "Conclusão de aula": trocar a descrição por "'Concluir aula' só habilita com a conferência completa. Ao concluir: aviso 'Aula concluída' (e um aviso por conquista nova) + o site da aluna com a parte nova, no lugar da Luv grande (a Luv do objetivo já está na tela — DS-13)."

3. §13.4 — remover as linhas "Uma Luv por tela (DS 8.2)", "Velocidade guardada à parte" e "Parte nova do site destacada na conclusão" (resolvidas). Acrescentar:

```markdown
| Destaque da parte nova no site | código | a conclusão mostra o site inteiro com a parte nova, sem destacá-la dentro do site (DS-08: o site da aluna não recebe estilos do CodeLuv) | manter | — |
| `sparkle` na conclusão | código | a conclusão ainda não tem os brilhos | implementar junto com a celebração de módulo | Fase 1 |
```

(Se a linha "Movimento `sparkle` na conclusão" já existir, mantenha só ela.)

4. §14 — acrescentar ao fim do registro de decisões:

```markdown
**DS-13 — A conclusão de aula celebra com o site, não com a Luv**

- **Data:** 2026-10-09
- **Contexto:** a celebração com a Luv grande deixava duas Luvs na tela (a do objetivo e a da celebração).
- **Alternativas consideradas:** esconder a Luv do objetivo; trocar a Luv da celebração pelo site da aluna.
- **Decisão:** a celebração mostra o site da aluna atualizado ("Seu site ganhou uma parte nova").
- **Por quê:** cumpre "uma Luv por tela" e reforça o fio condutor do briefing (o site que cresce aula a aula).
- **Tokens / componentes afetados:** `LessonDone`, `SitePreview`, padrão "Conclusão de aula".
- **Revisar se:** a aluna sentir falta da Luv comemorando.
```

5. Versão `0.5.0` e histórico: `| 2026-10-09 | 0.5.0 — Plano 4 entregue: progresso no aparelho, primeiro uso, Meu site, conquistas e cópia do progresso (DS-13) | Claudio Soares |`.

- [ ] **Step 2: Briefing**

Em `docs/briefing.md`:

1. §14, linha Q3: trocar o estado `aberta` por `parcial` e acrescentar ao fim da pergunta: "Hoje: cópia do progresso em arquivo (Configurações)."
2. §15, acrescentar depois da D-07:

```markdown
**D-08 — Cópia do progresso em arquivo, sem conta**

- **Data:** 2026-10-09
- **Contexto:** o progresso fica só no aparelho (D-05); limpar o navegador ou trocar de computador perderia tudo.
- **Alternativas consideradas:** conta com login; nada; cópia em arquivo que a aluna baixa e recupera.
- **Decisão:** cópia em arquivo, em Configurações ("Baixar uma cópia" e "Recuperar de uma cópia").
- **Por quê:** protege contra perda sem pedir cadastro nem dados pessoais (discrição, respeito ao tempo).
- **O que abrimos mão:** sincronização automática entre aparelhos.
- **Revisar se:** Q3 mostrar que ela estuda em mais de um aparelho com frequência.
```

3. Histórico: `| 2026-10-09 | Q3 parcialmente respondida e D-08 (cópia do progresso) | Claudio Soares |`.

- [ ] **Step 3: Verificação final**

Run: `npx eslint . && npx next typegen && npx tsc --noEmit && npm test && npm run build && npm run test:e2e`
Expected: lint e tipos limpos; Vitest com 32 arquivos (22 + modelo, store, acoes, conquistas, site, estado-aula, inicio, meu-site, lista-conquistas, configuracoes); build verde (as páginas do app continuam `○` — o progresso é lido só no cliente); Playwright `22 passed`.

- [ ] **Step 4: Commit**

```bash
git add docs/design-system.md docs/briefing.md
git commit -m "docs: record plano 4 delivery and progress backup decision"
```

---

## Fora deste plano (próximos)

- **Publicar o site** (HU-10, briefing Q4) — Fase 2.
- **Módulo de CSS** e a montagem do site com estilos — Fase 2.
- **Sincronizar entre aparelhos** (conta) — só se a Q3 mostrar necessidade.
- **Mostrar ao mentor onde ela precisou de mais pistas** (HU-11 completa) — hoje só há o selo "Concluída" e o contador de conferências guardado.
