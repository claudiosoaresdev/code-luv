# Plano 6 — Dashboard com habit tracker: Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Trocar as boas-vindas do Início por um dashboard em uma coluna: a nova Luv com os corações da semana, o "Continuar", a semana em sete quadrados e a seção "Seu progresso" (anéis por módulo, mapa de 13 semanas e vitrine de conquistas), com a meta da semana escolhida em Configurações.

**Architecture:** Toda conta sai de funções puras em `src/lib/progresso/painel.ts` (semana, mapa, módulos, conquistas, falas), testadas com datas fixas. Cada bloco do dashboard é um componente de apresentação em `src/components/inicio/`, que recebe dados prontos por props. O `Inicio` continua sendo o único que lê o progresso (`useProgresso`, que no servidor devolve `null`), então as datas são calculadas só no cliente e não há diferença de hidratação. A meta mora no progresso (`metaSemanal`, 1–7, padrão 3).

**Tech Stack:** Next.js 16.4 (App Router, `cacheComponents` + `partialPrefetching`), React 19.3, TypeScript, Tailwind CSS 4, shadcn/ui (base-nova, Base UI, Lucide), `next/image`, Vitest 5 + Testing Library + jsdom, Playwright + axe-core.

**Documentos de referência:**

- `docs/superpowers/specs/2026-10-09-dashboard-design.md` — **a spec aprovada** (regras inegociáveis, layout, falas, estados).
- `docs/briefing.md` — 10 (métrica "≥ 3 sessões por semana"), 10.4 (não perseguir sequência de dias, tempo de uso, número de conquistas), 11 (sem sequências que quebram e geram culpa).
- `docs/design-system.md` (v0.6.0) — DS-13 (uma Luv por tela), 3.1 (cores), 8.2 (componentes), 10 (voz: números por extenso até dez na fala da Luv; palavras proibidas), 11 (acessibilidade: 48px, cor nunca é o único sinal).
- `AGENTS.md` — consultar `node_modules/next/dist/docs/` antes de usar uma API do Next (aqui: `next/image`).

**Regras de produto que os testes garantem:** nada conta dias seguidos; nada "quebra" (a semana recomeça na segunda, o mapa só soma); a Luv nunca lamenta (zero dias = convite); nenhum tempo de uso.

**Convenções do repositório:** Prettier sem ponto e vírgula, aspas simples, `trailingComma: 'all'`; ESLint ordena imports; testes em `src/**/*.spec.{ts,tsx}` importando de `vitest` (`globals: false`, jest-dom + cleanup em `vitest.setup.ts`, `restoreMocks: true`); commits Conventional Commits em minúsculas com o trailer `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`; área de toque mínima 48px; links com cara de botão = `<Link className={buttonVariants()}>`; Base UI usa `render`, não `asChild`; `cn` vem de `@/lib/utils`. Sem `.next`, rode `npx next typegen` antes de `npx tsc --noEmit`. Hoje: 35 arquivos / 280 testes no Vitest; 37 no Playwright. O servidor de desenvolvimento da responsável roda na porta 3001 (não pare); o Playwright sobe o seu na 3000.

---

## Mapa de arquivos

| Arquivo                                                   | Ação      | Responsabilidade                                                   |
| --------------------------------------------------------- | --------- | ------------------------------------------------------------------ |
| `src/lib/progresso/modelo.ts` (+ spec)                    | modificar | `metaSemanal`, `META_PADRAO`, `metaValida`, `metaDe`, `normalizar` |
| `src/lib/progresso/acoes.ts` (+ spec)                     | modificar | `definirMeta`                                                      |
| `src/lib/progresso/painel.ts` (+ `.spec.ts`)              | criar     | semana, mapa, módulos, conquistas, falas                           |
| `public/images/luv/luv-notebook.webp`                     | criar     | a nova ilustração da Luv                                           |
| `src/components/inicio/estilos.ts`                        | criar     | classes compartilhadas dos cartões                                 |
| `src/components/inicio/luv-da-semana.tsx` (+ spec)        | criar     | Luv, "Oi, Ana!", fala, corações                                    |
| `src/components/inicio/continuar-card.tsx` (+ spec)       | criar     | "Continuar" ou "Você concluiu todas as aulas…"                     |
| `src/components/inicio/sua-semana.tsx` (+ spec)           | criar     | os sete dias                                                       |
| `src/components/inicio/progresso-modulos.tsx` (+ spec)    | criar     | anéis por módulo + JavaScript em breve                             |
| `src/components/inicio/mapa-de-dias.tsx` (+ spec)         | criar     | 13 semanas × 7 dias + legenda                                      |
| `src/components/inicio/vitrine-conquistas.tsx` (+ spec)   | criar     | selos + próxima conquista                                          |
| `src/components/inicio/inicio.tsx` (+ spec)               | modificar | `Painel` no lugar de `BoasVindas`; esqueleto novo                  |
| `src/components/ui/native-select.tsx`                     | modificar | altura 48px (DS 5.3)                                               |
| `src/components/configuracoes/configuracoes.tsx` (+ spec) | modificar | campo "Meta da semana"                                             |
| `e2e/inicio.spec.ts`                                      | criar     | dashboard com data fixa, acessibilidade, celular                   |
| `docs/design-system.md`                                   | modificar | v0.7.0, DS-15, inventário, divergências, histórico                 |

---

### Task 1: Meta da semana no progresso

**Files:**

- Modify: `src/lib/progresso/modelo.ts`, `src/lib/progresso/modelo.spec.ts`
- Modify: `src/lib/progresso/acoes.ts`, `src/lib/progresso/acoes.spec.ts`

- [ ] **Step 1: Testes que falham**

Em `src/lib/progresso/modelo.spec.ts`, acrescente ao import de `./modelo` os nomes `META_PADRAO`, `metaDe`, `metaValida` e, no fim do arquivo, um `describe` novo:

```ts
describe('meta da semana', () => {
  it('aceita só inteiros de 1 a 7', () => {
    expect([1, 3, 7].every(metaValida)).toBe(true)
    expect([0, 8, 2.5, '3', null, undefined, Number.NaN].some(metaValida)).toBe(
      false,
    )
  })

  it('normalizar guarda a meta válida e descarta a inválida', () => {
    expect(
      normalizar({ versao: 1, aulas: {}, metaSemanal: 5 })?.metaSemanal,
    ).toBe(5)
    for (const ruim of [0, 8, 2.5, '3']) {
      expect(
        normalizar({ versao: 1, aulas: {}, metaSemanal: ruim })?.metaSemanal,
      ).toBeUndefined()
    }
  })

  it('sem meta guardada, vale 3', () => {
    expect(META_PADRAO).toBe(3)
    expect(metaDe(PROGRESSO_VAZIO)).toBe(3)
    expect(metaDe({ ...PROGRESSO_VAZIO, metaSemanal: 6 })).toBe(6)
  })
})
```

(Se `normalizar` ou `PROGRESSO_VAZIO` ainda não estiverem importados no arquivo, acrescente-os ao mesmo import.)

Em `src/lib/progresso/acoes.spec.ts`, acrescente `definirMeta` ao import de `./acoes` e:

```ts
describe('definirMeta', () => {
  it('grava uma meta válida', () => {
    expect(definirMeta(PROGRESSO_VAZIO, 5).metaSemanal).toBe(5)
  })

  it('ignora meta fora de 1 a 7', () => {
    expect(definirMeta(PROGRESSO_VAZIO, 0)).toBe(PROGRESSO_VAZIO)
    expect(definirMeta(PROGRESSO_VAZIO, 9)).toBe(PROGRESSO_VAZIO)
  })
})
```

(Importe `PROGRESSO_VAZIO` de `./modelo` se o arquivo ainda não importar.)

Run: `npx vitest run src/lib/progresso/modelo.spec.ts src/lib/progresso/acoes.spec.ts` → FAIL.

- [ ] **Step 2: Implementar em `src/lib/progresso/modelo.ts`**

1. No tipo `Progresso`, depois de `velocidade?: Velocidade`, acrescente:

```ts
  /** Dias por semana que ela quer estudar (1–7). Ausente = META_PADRAO. */
  metaSemanal?: number
```

2. Depois de `velocidadeValida`, acrescente:

```ts
/** A métrica do briefing (seção 10): três sessões por semana. */
export const META_PADRAO = 3

export function metaValida(valor: unknown): valor is number {
  return (
    Number.isInteger(valor) && (valor as number) >= 1 && (valor as number) <= 7
  )
}

export function metaDe(p: Progresso) {
  return p.metaSemanal ?? META_PADRAO
}
```

(`metaDe` fica depois da declaração do tipo `Progresso`; se o ESLint reclamar de uso antes da definição, mova `META_PADRAO`, `metaValida` e `metaDe` para logo depois de `PROGRESSO_VAZIO`.)

3. Em `normalizar`, depois da linha da velocidade:

```ts
if (metaValida(dado.metaSemanal)) progresso.metaSemanal = dado.metaSemanal
```

- [ ] **Step 3: Implementar em `src/lib/progresso/acoes.ts`**

Acrescente `metaValida` ao import de `./modelo` (`import { metaValida, type Progresso, type ProgressoAula } from './modelo'`) e, no fim do arquivo:

```ts
/** Meta da semana (1 a 7 dias). Valor fora disso não muda nada. */
export function definirMeta(p: Progresso, meta: number): Progresso {
  return metaValida(meta) ? { ...p, metaSemanal: meta } : p
}
```

Run: `npx vitest run src/lib/progresso` → PASS.

- [ ] **Step 4: Verificar e commitar**

Run: `npx eslint src/lib/progresso && npx tsc --noEmit`

```bash
git add src/lib/progresso/modelo.ts src/lib/progresso/modelo.spec.ts src/lib/progresso/acoes.ts src/lib/progresso/acoes.spec.ts
git commit -m "feat: weekly study goal in the progress, defaulting to three days

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 2: As contas do painel

**Files:**

- Create: `src/lib/progresso/painel.ts`
- Test: `src/lib/progresso/painel.spec.ts`

- [ ] **Step 1: Teste que falha**

`src/lib/progresso/painel.spec.ts`:

```ts
import { describe, expect, it } from 'vitest'

import type { Aula } from '@/content/aulas/types'
import type { Modulo } from '@/content/modulos'

import { type Progresso, PROGRESSO_VAZIO } from './modelo'
import {
  diasDaSemana,
  falaDaSemana,
  fraseDaSemana,
  mapaDeDias,
  progressoPorModulo,
  vitrineDeConquistas,
} from './painel'

// Quinta-feira, 8 de outubro de 2026, 10h (horário local).
const QUINTA = new Date(2026, 9, 8, 10)

const com = (extra: Partial<Progresso>): Progresso => ({
  ...PROGRESSO_VAZIO,
  ...extra,
})

describe('diasDaSemana', () => {
  it('vai de segunda a domingo e marca hoje e o futuro', () => {
    const dias = diasDaSemana(PROGRESSO_VAZIO, QUINTA)
    expect(dias.map((d) => d.dia)).toEqual([
      '2026-10-05',
      '2026-10-06',
      '2026-10-07',
      '2026-10-08',
      '2026-10-09',
      '2026-10-10',
      '2026-10-11',
    ])
    expect(dias.map((d) => d.curto)).toEqual([
      'seg',
      'ter',
      'qua',
      'qui',
      'sex',
      'sáb',
      'dom',
    ])
    expect(dias[3]).toMatchObject({
      completo: 'quinta-feira',
      hoje: true,
      futuro: false,
    })
    expect(dias.filter((d) => d.futuro).map((d) => d.curto)).toEqual([
      'sex',
      'sáb',
      'dom',
    ])
  })

  it('no domingo, a semana ainda é a que começou na segunda', () => {
    const domingo = new Date(2026, 9, 11, 22)
    expect(diasDaSemana(PROGRESSO_VAZIO, domingo)[0].dia).toBe('2026-10-05')
    expect(diasDaSemana(PROGRESSO_VAZIO, domingo)[6]).toMatchObject({
      dia: '2026-10-11',
      hoje: true,
    })
  })

  it('atravessa a virada do ano', () => {
    const sextaDeAnoNovo = new Date(2027, 0, 1, 9)
    expect(
      diasDaSemana(PROGRESSO_VAZIO, sextaDeAnoNovo).map((d) => d.dia),
    ).toEqual([
      '2026-12-28',
      '2026-12-29',
      '2026-12-30',
      '2026-12-31',
      '2027-01-01',
      '2027-01-02',
      '2027-01-03',
    ])
  })

  it('marca só os dias estudados desta semana', () => {
    const p = com({
      diasEstudados: ['2026-09-30', '2026-10-05', '2026-10-07'],
    })
    expect(
      diasDaSemana(p, QUINTA)
        .filter((d) => d.estudou)
        .map((d) => d.curto),
    ).toEqual(['seg', 'qua'])
  })
})

describe('mapaDeDias', () => {
  it('tem 13 semanas de 7 dias, terminando na semana de hoje', () => {
    const mapa = mapaDeDias(PROGRESSO_VAZIO, QUINTA)
    expect(mapa).toHaveLength(13)
    expect(mapa.every((semana) => semana.length === 7)).toBe(true)
    expect(mapa[0][0].dia).toBe('2026-07-13')
    expect(mapa[12][0].dia).toBe('2026-10-05')
    expect(mapa[12].filter((c) => c.futuro).map((c) => c.dia)).toEqual([
      '2026-10-09',
      '2026-10-10',
      '2026-10-11',
    ])
  })

  it('dia de aula concluída vale mais que dia só estudado', () => {
    const p = com({
      diasEstudados: ['2026-10-05', '2026-10-07'],
      aulas: {
        a: {
          conferencias: 1,
          concluidaEm: new Date(2026, 9, 7, 15).toISOString(),
        },
      },
    })
    const semana = mapaDeDias(p, QUINTA)[12]
    expect(semana.map((c) => c.nivel)).toEqual([
      'estudou',
      'nada',
      'concluiu',
      'nada',
      'nada',
      'nada',
      'nada',
    ])
  })

  it('aceita outro número de semanas', () => {
    expect(mapaDeDias(PROGRESSO_VAZIO, QUINTA, 4)).toHaveLength(4)
  })
})

describe('progressoPorModulo', () => {
  const aula = (slug: string, modulo: 'html' | 'css'): Aula =>
    ({
      slug,
      modulo,
      ordem: 1,
      titulo: slug,
      objetivo: '',
      duracaoMin: 15,
      pratica: {
        enunciado: [],
        inicial: '',
        conferencia: [],
        pistas: [],
        solucao: '',
      },
    }) as Aula
  const modulos: Modulo[] = [
    { id: 'html', nome: 'HTML', titulo: 'HTML' },
    { id: 'css', nome: 'CSS', titulo: 'CSS' },
  ]

  it('conta as concluídas e o total de cada módulo', () => {
    const p = com({
      aulas: {
        h1: { conferencias: 1, concluidaEm: '2026-10-01T10:00:00.000Z' },
        h2: { conferencias: 3 },
      },
    })
    expect(
      progressoPorModulo(
        p,
        [aula('h1', 'html'), aula('h2', 'html'), aula('c1', 'css')],
        modulos,
      ),
    ).toEqual([
      { id: 'html', nome: 'HTML', concluidas: 1, total: 2 },
      { id: 'css', nome: 'CSS', concluidas: 0, total: 1 },
    ])
  })
})

describe('vitrineDeConquistas', () => {
  it('sem conquistas: todas a ganhar, e a próxima é a primeira', () => {
    const { selos, proxima } = vitrineDeConquistas(PROGRESSO_VAZIO)
    expect(selos.map((s) => s.ganha)).toEqual([false, false])
    expect(proxima?.titulo).toBe('Hello, World')
  })

  it('com a primeira ganha: a próxima é a seguinte', () => {
    const p = com({ conquistas: { 'hello-world': { em: '2026-10-05' } } })
    const { selos, proxima } = vitrineDeConquistas(p)
    expect(selos.map((s) => s.ganha)).toEqual([true, false])
    expect(proxima?.titulo).toBe('Persistente')
  })

  it('com todas ganhas: sem próxima', () => {
    const p = com({
      conquistas: {
        'hello-world': { em: '2026-10-05' },
        persistente: { em: '2026-10-06' },
      },
    })
    expect(vitrineDeConquistas(p).proxima).toBeUndefined()
  })
})

describe('falaDaSemana (a Luv nunca lamenta)', () => {
  it('zero dias: convida', () => {
    expect(falaDaSemana(0, 3)).toBe(
      'Semana nova, corações novos. Que tal começar com uma aula?',
    )
  })

  it('no caminho: diz quantos guardou e quantos faltam, por extenso', () => {
    expect(falaDaSemana(1, 3)).toBe(
      'A Luv guardou um coração esta semana. Faltam dois para a sua meta.',
    )
    expect(falaDaSemana(2, 3)).toBe(
      'A Luv guardou dois corações esta semana. Falta um para a sua meta.',
    )
    expect(falaDaSemana(3, 7)).toBe(
      'A Luv guardou três corações esta semana. Faltam quatro para a sua meta.',
    )
  })

  it('meta cumprida (ou passada): comemora', () => {
    expect(falaDaSemana(3, 3)).toBe(
      'Meta da semana completa! A Luv está radiante.',
    )
    expect(falaDaSemana(5, 3)).toBe(
      'Meta da semana completa! A Luv está radiante.',
    )
  })
})

describe('fraseDaSemana', () => {
  it('descreve a semana com a meta', () => {
    expect(fraseDaSemana(0, 3)).toBe(
      'Nenhum dia ainda nesta semana. Meta: 3 dias por semana.',
    )
    expect(fraseDaSemana(1, 1)).toBe(
      'Você estudou em 1 dia desta semana. Meta: 1 dia por semana.',
    )
    expect(fraseDaSemana(2, 3)).toBe(
      'Você estudou em 2 dias desta semana. Meta: 3 dias por semana.',
    )
  })
})
```

Run: `npx vitest run src/lib/progresso/painel.spec.ts` → FAIL (`./painel` não existe).

- [ ] **Step 2: Implementar `src/lib/progresso/painel.ts`**

```ts
import type { Aula } from '@/content/aulas/types'
import type { Modulo } from '@/content/modulos'

import { hoje } from './acoes'
import { CONQUISTAS } from './conquistas'
import type { Progresso } from './modelo'

// Contas do dashboard do Início (spec 2026-10-09-dashboard-design). Nada aqui
// conta dias seguidos: a semana recomeça na segunda e o mapa só soma
// (briefing 10.4 e 11). Datas no horário local, como em hoje().

const CURTOS = ['seg', 'ter', 'qua', 'qui', 'sex', 'sáb', 'dom']
const COMPLETOS = [
  'segunda-feira',
  'terça-feira',
  'quarta-feira',
  'quinta-feira',
  'sexta-feira',
  'sábado',
  'domingo',
]
const EXTENSO = [
  'zero',
  'um',
  'dois',
  'três',
  'quatro',
  'cinco',
  'seis',
  'sete',
]

export type DiaDaSemana = {
  /** AAAA-MM-DD */
  dia: string
  curto: string
  completo: string
  hoje: boolean
  futuro: boolean
  estudou: boolean
}

export type NivelDoDia = 'nada' | 'estudou' | 'concluiu'
export type CelulaDoMapa = { dia: string; nivel: NivelDoDia; futuro: boolean }

function somarDias(data: Date, dias: number) {
  return new Date(data.getFullYear(), data.getMonth(), data.getDate() + dias)
}

function segundaDaSemana(agora: Date) {
  return somarDias(agora, -((agora.getDay() + 6) % 7))
}

/** Os sete dias da semana de `agora`, de segunda a domingo. */
export function diasDaSemana(p: Progresso, agora: Date): DiaDaSemana[] {
  const estudados = new Set(p.diasEstudados)
  const segunda = segundaDaSemana(agora)
  const hj = hoje(agora)
  return CURTOS.map((curto, i) => {
    const dia = hoje(somarDias(segunda, i))
    return {
      dia,
      curto,
      completo: COMPLETOS[i],
      hoje: dia === hj,
      futuro: dia > hj,
      estudou: estudados.has(dia),
    }
  })
}

/** `semanas` colunas de segunda a domingo; a última é a semana de `agora`. */
export function mapaDeDias(
  p: Progresso,
  agora: Date,
  semanas = 13,
): CelulaDoMapa[][] {
  const estudados = new Set(p.diasEstudados)
  const concluidos = new Set(
    Object.values(p.aulas).flatMap((aula) =>
      aula.concluidaEm ? [hoje(new Date(aula.concluidaEm))] : [],
    ),
  )
  const hj = hoje(agora)
  const inicio = somarDias(segundaDaSemana(agora), -7 * (semanas - 1))
  return Array.from({ length: semanas }, (_, s) =>
    Array.from({ length: 7 }, (_, d) => {
      const dia = hoje(somarDias(inicio, s * 7 + d))
      const nivel: NivelDoDia = concluidos.has(dia)
        ? 'concluiu'
        : estudados.has(dia)
          ? 'estudou'
          : 'nada'
      return { dia, nivel, futuro: dia > hj }
    }),
  )
}

export function progressoPorModulo(
  p: Progresso,
  aulas: Aula[],
  modulos: Modulo[],
) {
  return modulos.map(({ id, nome }) => {
    const doModulo = aulas.filter((aula) => aula.modulo === id)
    return {
      id,
      nome,
      concluidas: doModulo.filter((aula) => p.aulas[aula.slug]?.concluidaEm)
        .length,
      total: doModulo.length,
    }
  })
}

export function vitrineDeConquistas(p: Progresso) {
  const selos = CONQUISTAS.map(({ id, titulo }) => ({
    id,
    titulo,
    ganha: Boolean(p.conquistas[id]),
  }))
  const proxima = CONQUISTAS.find((c) => !p.conquistas[c.id])
  return {
    selos,
    proxima: proxima && {
      titulo: proxima.titulo,
      comoGanhar: proxima.comoGanhar,
    },
  }
}

/** A fala da Luv sobre a semana. Nunca lamenta (spec, regras de produto). */
export function falaDaSemana(estudados: number, meta: number) {
  if (estudados === 0)
    return 'Semana nova, corações novos. Que tal começar com uma aula?'
  if (estudados >= meta) return 'Meta da semana completa! A Luv está radiante.'
  const faltam = meta - estudados
  const guardou =
    estudados === 1 ? 'um coração' : `${EXTENSO[estudados]} corações`
  const falta = faltam === 1 ? 'Falta um' : `Faltam ${EXTENSO[faltam]}`
  return `A Luv guardou ${guardou} esta semana. ${falta} para a sua meta.`
}

const dias = (n: number) => (n === 1 ? '1 dia' : `${n} dias`)

export function fraseDaSemana(estudados: number, meta: number) {
  const metaTexto = `Meta: ${dias(meta)} por semana.`
  return estudados === 0
    ? `Nenhum dia ainda nesta semana. ${metaTexto}`
    : `Você estudou em ${dias(estudados)} desta semana. ${metaTexto}`
}
```

Run: `npx vitest run src/lib/progresso/painel.spec.ts` → PASS.

- [ ] **Step 3: Verificar e commitar**

Run: `npx eslint src/lib/progresso && npx tsc --noEmit && npm test`

```bash
git add src/lib/progresso/painel.ts src/lib/progresso/painel.spec.ts
git commit -m "feat: dashboard math for the week, the day map, modules and badges

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 3: A nova Luv e os corações da semana

**Files:**

- Create: `public/images/luv/luv-notebook.webp`
- Create: `src/components/inicio/estilos.ts`
- Create: `src/components/inicio/luv-da-semana.tsx`, `src/components/inicio/luv-da-semana.spec.tsx`

- [ ] **Step 1: Copiar a ilustração**

```bash
cp /private/tmp/claude-501/-Users-claudiosoares-www-claudiosoaresdev-code-luv/cd8755ac-244b-40ce-baaf-3e5f2e7f63a8/images/4.webp public/images/luv/luv-notebook.webp
sips -g pixelWidth -g pixelHeight public/images/luv/luv-notebook.webp
```

Expected: 1224 × 1285. (Se o arquivo de origem não existir, a cópia também está em `.superpowers/brainstorm/96999-1791581901/content/luv-mascote.webp`.) O `next/image` gera os tamanhos menores sozinho; não precisa de outra versão.

- [ ] **Step 2: `src/components/inicio/estilos.ts`**

```ts
/** Cartão do dashboard (DS 8.2 — superfície `bg-card`, contorno de 2px). */
export const CARTAO =
  'rounded-2xl border-2 border-border bg-card p-5 text-card-foreground md:p-6'
/** Título de bloco (h2). Orbitron só a partir de 18px (DS-04). */
export const TITULO_BLOCO = 'font-display text-xl font-semibold'
/** Título dentro de "Seu progresso" (h3). */
export const TITULO_SUB = 'font-display text-lg font-semibold'
```

- [ ] **Step 3: Teste que falha**

`src/components/inicio/luv-da-semana.spec.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { LuvDaSemana } from './luv-da-semana'

describe('LuvDaSemana', () => {
  it('cumprimenta pelo nome, fala da semana e mostra os corações', () => {
    render(<LuvDaSemana nome="Ana" estudados={2} meta={3} />)

    expect(
      screen.getByRole('heading', { level: 1, name: 'Oi, Ana!' }),
    ).toBeInTheDocument()
    expect(
      screen.getByText(
        'A Luv guardou dois corações esta semana. Falta um para a sua meta.',
      ),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('img', { name: '2 de 3 corações' }),
    ).toBeInTheDocument()
  })

  it('sem nome, diz só "Oi!"; com zero dias, convida', () => {
    render(<LuvDaSemana estudados={0} meta={3} />)

    expect(
      screen.getByRole('heading', { level: 1, name: 'Oi!' }),
    ).toBeInTheDocument()
    expect(
      screen.getByText(/Que tal começar com uma aula\?/),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('img', { name: '0 de 3 corações' }),
    ).toBeInTheDocument()
  })

  it('passou da meta: os corações param na meta', () => {
    render(<LuvDaSemana nome="Ana" estudados={5} meta={3} />)
    expect(
      screen.getByRole('img', { name: '3 de 3 corações' }),
    ).toBeInTheDocument()
  })

  it('a ilustração é decorativa (o texto ao lado leva a informação)', () => {
    const { container } = render(
      <LuvDaSemana nome="Ana" estudados={1} meta={3} />,
    )
    const ilustracao = container.querySelector('img[src*="luv-notebook"]')
    expect(ilustracao).toHaveAttribute('alt', '')
  })
})
```

Run: `npx vitest run src/components/inicio/luv-da-semana.spec.tsx` → FAIL.

- [ ] **Step 4: `src/components/inicio/luv-da-semana.tsx`**

Antes, leia `node_modules/next/dist/docs/` sobre `next/image` (procure "image" no índice) para confirmar `loading="eager"` (o `priority` está descontinuado nesta versão).

```tsx
import Image from 'next/image'

import { HeartIcon } from 'lucide-react'

import { falaDaSemana } from '@/lib/progresso/painel'
import { cn } from '@/lib/utils'

import { CARTAO } from './estilos'

type LuvDaSemanaProps = {
  nome?: string
  /** Dias estudados na semana atual. */
  estudados: number
  meta: number
}

/**
 * Topo do dashboard: a Luv (a única da tela — DS-13), o cumprimento e os
 * corações da semana. Os corações só mostram a semana; não desbloqueiam nada.
 */
export function LuvDaSemana({ nome, estudados, meta }: LuvDaSemanaProps) {
  const cheios = Math.min(estudados, meta)
  return (
    <div
      className={cn(
        CARTAO,
        'mt-12 flex flex-wrap items-end gap-x-6 gap-y-3 bg-linear-to-br from-card to-accent',
      )}
    >
      <Image
        src="/images/luv/luv-notebook.webp"
        alt=""
        width={200}
        height={210}
        loading="eager"
        className="-mt-16 -mb-2 h-auto w-[clamp(140px,30vw,200px)] drop-shadow-[4px_6px_0_var(--chart-2)]"
      />
      <div className="flex min-w-0 flex-1 basis-60 flex-col gap-2 pb-1">
        <h1 className="font-display text-4xl leading-tight font-extrabold md:text-5xl">
          {nome ? `Oi, ${nome}!` : 'Oi!'}
        </h1>
        <p className="text-lg text-muted-foreground">
          {falaDaSemana(estudados, meta)}
        </p>
        <div
          role="img"
          aria-label={`${cheios} de ${meta} corações`}
          className="flex flex-wrap gap-2"
        >
          {Array.from({ length: meta }, (_, i) => (
            <span
              key={i}
              className={cn(
                'grid size-9 place-items-center rounded-lg border-2',
                i < cheios
                  ? 'border-line-strong bg-primary text-primary-foreground shadow-sticker'
                  : 'border-muted bg-muted text-muted-foreground',
              )}
            >
              <HeartIcon
                aria-hidden
                className={cn('size-5', i < cheios && 'fill-current')}
              />
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
```

Confira em `src/app/globals.css` que existem `shadow-sticker` e `--chart-2` (usados por outros componentes). Se a classe `bg-linear-to-br` não gerar gradiente nesta versão do Tailwind 4, use `bg-gradient-to-br`.

Run: `npx vitest run src/components/inicio/luv-da-semana.spec.tsx` → PASS.

- [ ] **Step 5: Verificar e commitar**

Run: `npx eslint src/components/inicio && npx tsc --noEmit`

```bash
git add public/images/luv/luv-notebook.webp src/components/inicio/estilos.ts src/components/inicio/luv-da-semana.tsx src/components/inicio/luv-da-semana.spec.tsx
git commit -m "feat: the new luv with this week's hearts

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 4: Continuar e Sua semana

**Files:**

- Create: `src/components/inicio/continuar-card.tsx`, `src/components/inicio/continuar-card.spec.tsx`
- Create: `src/components/inicio/sua-semana.tsx`, `src/components/inicio/sua-semana.spec.tsx`

- [ ] **Step 1: Testes que falham**

`src/components/inicio/continuar-card.spec.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { ContinuarCard } from './continuar-card'

const imagens = {
  slug: 'imagens',
  titulo: 'Imagens',
  ordem: 5,
  modulo: 'html' as const,
  duracaoMin: 15,
}

describe('ContinuarCard', () => {
  it('primeira aula: "Começar a aula", com módulo e duração', () => {
    render(<ContinuarCard proxima={imagens} />)

    expect(
      screen.getByRole('heading', { level: 2, name: 'Continuar: Imagens' }),
    ).toBeInTheDocument()
    expect(
      screen.getByText('Aula 5 de HTML · cerca de 15 minutos'),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: 'Começar a aula' }),
    ).toHaveAttribute('href', '/aulas/imagens')
  })

  it('depois de concluir uma: lembra a última e diz "Continuar"', () => {
    render(<ContinuarCard proxima={imagens} ultima={{ titulo: 'Links' }} />)

    expect(
      screen.getByText('Na última vez você concluiu “Links”.'),
    ).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Continuar' })).toHaveAttribute(
      'href',
      '/aulas/imagens',
    )
  })

  it('sem próxima: celebra e leva ao site', () => {
    render(<ContinuarCard ultima={{ titulo: 'Pequenos movimentos' }} />)

    expect(
      screen.getByText(/Você concluiu todas as aulas disponíveis por enquanto/),
    ).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Ver meu site' })).toHaveAttribute(
      'href',
      '/meu-site',
    )
  })
})
```

`src/components/inicio/sua-semana.spec.tsx`:

```tsx
import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { PROGRESSO_VAZIO } from '@/lib/progresso/modelo'
import { diasDaSemana } from '@/lib/progresso/painel'

import { SuaSemana } from './sua-semana'

const QUINTA = new Date(2026, 9, 8, 10)

describe('SuaSemana', () => {
  it('lista os sete dias com o nome completo e o que aconteceu', () => {
    const dias = diasDaSemana(
      { ...PROGRESSO_VAZIO, diasEstudados: ['2026-10-05', '2026-10-07'] },
      QUINTA,
    )
    render(<SuaSemana dias={dias} meta={3} />)

    const semana = screen.getByRole('region', { name: 'Sua semana' })
    const itens = within(semana).getAllByRole('listitem')
    expect(itens).toHaveLength(7)
    expect(itens[0]).toHaveTextContent('segunda-feira, estudou')
    expect(itens[1]).toHaveTextContent('terça-feira')
    expect(itens[1]).not.toHaveTextContent('estudou')
    expect(itens[3]).toHaveTextContent('quinta-feira, hoje')
    expect(
      screen.getByText(
        'Você estudou em 2 dias desta semana. Meta: 3 dias por semana.',
      ),
    ).toBeInTheDocument()
  })

  it('semana vazia não cobra nada', () => {
    render(<SuaSemana dias={diasDaSemana(PROGRESSO_VAZIO, QUINTA)} meta={3} />)
    expect(
      screen.getByText(
        'Nenhum dia ainda nesta semana. Meta: 3 dias por semana.',
      ),
    ).toBeInTheDocument()
  })
})
```

Run: `npx vitest run src/components/inicio/continuar-card.spec.tsx src/components/inicio/sua-semana.spec.tsx` → FAIL.

- [ ] **Step 2: `src/components/inicio/continuar-card.tsx`**

```tsx
import { useId } from 'react'
import Link from 'next/link'

import { PlayIcon } from 'lucide-react'

import { buttonVariants } from '@/components/ui/button'
import type { Aula } from '@/content/aulas/types'
import { getModulo } from '@/content/modulos'
import { cn } from '@/lib/utils'

import { CARTAO, TITULO_BLOCO } from './estilos'

type ContinuarCardProps = {
  proxima?: Pick<Aula, 'slug' | 'titulo' | 'ordem' | 'modulo' | 'duracaoMin'>
  ultima?: { titulo: string }
}

/** O próximo passo (HU-08). Sem próxima aula, leva ao site. */
export function ContinuarCard({ proxima, ultima }: ContinuarCardProps) {
  const tituloId = useId()

  if (!proxima) {
    return (
      <div className={cn(CARTAO, 'flex flex-col gap-3')}>
        <p className="text-lg">
          Você concluiu todas as aulas disponíveis por enquanto. Que tal olhar o
          seu site?
        </p>
        <Link
          href="/meu-site"
          className={cn(buttonVariants({ size: 'lg' }), 'w-fit')}
        >
          Ver meu site
        </Link>
      </div>
    )
  }

  return (
    <section
      aria-labelledby={tituloId}
      className={cn(
        CARTAO,
        'flex flex-col gap-3 border-primary shadow-sticker-lg',
      )}
    >
      <h2 id={tituloId} className={TITULO_BLOCO}>
        Continuar: {proxima.titulo}
      </h2>
      <p className="text-muted-foreground">
        {ultima
          ? `Na última vez você concluiu “${ultima.titulo}”.`
          : `Aula ${proxima.ordem} de ${getModulo(proxima.modulo).nome} · cerca de ${proxima.duracaoMin} minutos`}
      </p>
      <Link
        href={`/aulas/${proxima.slug}`}
        className={cn(buttonVariants({ size: 'lg' }), 'w-fit')}
      >
        <PlayIcon data-icon="inline-start" />
        {ultima ? 'Continuar' : 'Começar a aula'}
      </Link>
    </section>
  )
}
```

- [ ] **Step 3: `src/components/inicio/sua-semana.tsx`**

```tsx
import { useId } from 'react'

import { HeartIcon } from 'lucide-react'

import { type DiaDaSemana, fraseDaSemana } from '@/lib/progresso/painel'
import { cn } from '@/lib/utils'

import { CARTAO, TITULO_BLOCO } from './estilos'

function rotuloDoDia(dia: DiaDaSemana) {
  return [dia.completo, dia.hoje && 'hoje', dia.estudou && 'estudou']
    .filter(Boolean)
    .join(', ')
}

/**
 * A semana de segunda a domingo (habit tracker sem sequência — briefing
 * 10.4): coração nos dias estudados, hoje tracejado, futuro vazio.
 */
export function SuaSemana({
  dias,
  meta,
}: {
  dias: DiaDaSemana[]
  meta: number
}) {
  const tituloId = useId()
  const estudados = dias.filter((dia) => dia.estudou).length
  return (
    <section aria-labelledby={tituloId} className={CARTAO}>
      <h2 id={tituloId} className={TITULO_BLOCO}>
        Sua semana
      </h2>
      <p className="mt-1 text-muted-foreground">
        {fraseDaSemana(estudados, meta)}
      </p>
      <ul className="mt-4 grid max-w-md grid-cols-7 gap-1.5 sm:gap-3">
        {dias.map((dia) => (
          <li
            key={dia.dia}
            className="flex flex-col items-center gap-1 text-sm text-muted-foreground"
          >
            <span
              aria-hidden
              className={cn(
                'grid aspect-square w-full max-w-12 place-items-center rounded-xl border-2',
                dia.estudou
                  ? 'border-line-strong bg-primary text-primary-foreground shadow-sticker'
                  : 'border-muted bg-muted',
                dia.hoje &&
                  'outline-2 outline-offset-2 outline-ring outline-dashed',
              )}
            >
              {dia.estudou && <HeartIcon className="size-5 fill-current" />}
            </span>
            <span aria-hidden>{dia.hoje ? 'hoje' : dia.curto}</span>
            <span className="sr-only">{rotuloDoDia(dia)}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}
```

Run: `npx vitest run src/components/inicio` → PASS.

- [ ] **Step 4: Verificar e commitar**

Run: `npx eslint src/components/inicio && npx tsc --noEmit`

```bash
git add src/components/inicio/continuar-card.tsx src/components/inicio/continuar-card.spec.tsx src/components/inicio/sua-semana.tsx src/components/inicio/sua-semana.spec.tsx
git commit -m "feat: continue card and the week tracker

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 5: Seu progresso — módulos, mapa e conquistas

**Files:**

- Create: `src/components/inicio/progresso-modulos.tsx` (+ `.spec.tsx`)
- Create: `src/components/inicio/mapa-de-dias.tsx` (+ `.spec.tsx`)
- Create: `src/components/inicio/vitrine-conquistas.tsx` (+ `.spec.tsx`)

- [ ] **Step 1: Testes que falham**

`src/components/inicio/progresso-modulos.spec.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { ProgressoModulos } from './progresso-modulos'

describe('ProgressoModulos', () => {
  it('um anel por módulo, com nome acessível, e JavaScript em breve', () => {
    render(
      <ProgressoModulos
        modulos={[
          { id: 'html', nome: 'HTML', concluidas: 4, total: 7 },
          { id: 'css', nome: 'CSS', concluidas: 0, total: 6 },
        ]}
      />,
    )

    expect(
      screen.getByRole('heading', { level: 3, name: 'Módulos' }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('img', { name: 'HTML: 4 de 7 aulas concluídas' }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('img', { name: 'CSS: 0 de 6 aulas concluídas' }),
    ).toBeInTheDocument()
    expect(screen.getByText('JavaScript')).toBeInTheDocument()
    expect(screen.getByText('em breve')).toBeInTheDocument()
  })
})
```

`src/components/inicio/mapa-de-dias.spec.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { PROGRESSO_VAZIO } from '@/lib/progresso/modelo'
import { mapaDeDias } from '@/lib/progresso/painel'

import { MapaDeDias } from './mapa-de-dias'

const QUINTA = new Date(2026, 9, 8, 10)

describe('MapaDeDias', () => {
  it('mostra o total em texto e a legenda com os três níveis', () => {
    const p = {
      ...PROGRESSO_VAZIO,
      diasEstudados: ['2026-10-05', '2026-10-07'],
    }
    render(<MapaDeDias semanas={mapaDeDias(p, QUINTA)} total={2} />)

    expect(
      screen.getByRole('heading', { level: 3, name: 'Seus dias de estudo' }),
    ).toBeInTheDocument()
    expect(
      screen.getByText('2 dias estudados desde o começo.'),
    ).toBeInTheDocument()
    for (const nome of ['sem estudo', 'estudou', 'concluiu aula']) {
      expect(screen.getByText(nome)).toBeInTheDocument()
    }
  })

  it('a grade é escondida de leitores de tela (o resumo em texto basta)', () => {
    const { container } = render(
      <MapaDeDias semanas={mapaDeDias(PROGRESSO_VAZIO, QUINTA)} total={0} />,
    )
    expect(container.querySelector('[data-mapa]')).toHaveAttribute(
      'aria-hidden',
      'true',
    )
    expect(container.querySelectorAll('[data-mapa] [data-dia]')).toHaveLength(
      91,
    )
  })

  it('sem dias: explica quando o mapa começa a encher', () => {
    render(
      <MapaDeDias semanas={mapaDeDias(PROGRESSO_VAZIO, QUINTA)} total={0} />,
    )
    expect(
      screen.getByText(
        'Seus dias de estudo aparecem aqui quando você fizer a primeira aula.',
      ),
    ).toBeInTheDocument()
  })

  it('um dia: singular', () => {
    render(
      <MapaDeDias semanas={mapaDeDias(PROGRESSO_VAZIO, QUINTA)} total={1} />,
    )
    expect(
      screen.getByText('1 dia estudado desde o começo.'),
    ).toBeInTheDocument()
  })
})
```

`src/components/inicio/vitrine-conquistas.spec.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { VitrineConquistas } from './vitrine-conquistas'

describe('VitrineConquistas', () => {
  it('mostra as ganhas, as a ganhar e a próxima', () => {
    render(
      <VitrineConquistas
        selos={[
          { id: 'hello-world', titulo: 'Hello, World', ganha: true },
          { id: 'persistente', titulo: 'Persistente', ganha: false },
        ]}
        proxima={{
          titulo: 'Persistente',
          comoGanhar: 'Conclua uma aula depois de conferir três vezes ou mais.',
        }}
      />,
    )

    expect(screen.getByText('Hello, World, ganha')).toBeInTheDocument()
    expect(screen.getByText('Persistente, ainda não')).toBeInTheDocument()
    expect(screen.getByText(/Próxima:/)).toHaveTextContent(
      'Próxima: Persistente — Conclua uma aula depois de conferir três vezes ou mais.',
    )
    expect(
      screen.getByRole('link', { name: 'Ver conquistas' }),
    ).toHaveAttribute('href', '/conquistas')
  })

  it('com todas ganhas, não fala de próxima', () => {
    render(
      <VitrineConquistas
        selos={[{ id: 'hello-world', titulo: 'Hello, World', ganha: true }]}
      />,
    )
    expect(screen.queryByText(/Próxima:/)).not.toBeInTheDocument()
  })
})
```

Run: `npx vitest run src/components/inicio` → FAIL (três componentes não existem).

- [ ] **Step 2: `src/components/inicio/progresso-modulos.tsx`**

```tsx
import { useId } from 'react'

import { cn } from '@/lib/utils'

import { CARTAO, TITULO_SUB } from './estilos'

type ModuloComProgresso = {
  id: string
  nome: string
  concluidas: number
  total: number
}

const RAIO = 34
const VOLTA = 2 * Math.PI * RAIO
const CORES = ['text-primary', 'text-chart-5']

function Anel({
  valor,
  rotulo,
  cor,
  children,
}: {
  valor: number
  rotulo: string
  cor: string
  children: React.ReactNode
}) {
  return (
    <div
      role="img"
      aria-label={rotulo}
      className="relative grid size-20 place-items-center"
    >
      <svg
        aria-hidden
        viewBox="0 0 80 80"
        className="absolute inset-0 -rotate-90"
      >
        <circle
          cx="40"
          cy="40"
          r={RAIO}
          fill="none"
          strokeWidth="8"
          className="stroke-muted"
        />
        {valor > 0 && (
          <circle
            cx="40"
            cy="40"
            r={RAIO}
            fill="none"
            strokeWidth="8"
            strokeLinecap="round"
            stroke="currentColor"
            strokeDasharray={VOLTA}
            strokeDashoffset={VOLTA * (1 - valor)}
            className={cor}
          />
        )}
      </svg>
      <span aria-hidden className="font-bold tabular-nums">
        {children}
      </span>
    </div>
  )
}

/** Um anel por módulo; JavaScript aparece como "em breve" (briefing, Fase 3). */
export function ProgressoModulos({
  modulos,
}: {
  modulos: ModuloComProgresso[]
}) {
  const tituloId = useId()
  return (
    <section aria-labelledby={tituloId} className={CARTAO}>
      <h3 id={tituloId} className={TITULO_SUB}>
        Módulos
      </h3>
      <ul className="mt-4 flex flex-wrap gap-6">
        {modulos.map((modulo, i) => (
          <li key={modulo.id} className="flex flex-col items-center gap-2">
            <Anel
              valor={modulo.total ? modulo.concluidas / modulo.total : 0}
              rotulo={`${modulo.nome}: ${modulo.concluidas} de ${modulo.total} aulas concluídas`}
              cor={CORES[i % CORES.length]}
            >
              {modulo.concluidas}/{modulo.total}
            </Anel>
            <span aria-hidden className="font-medium">
              {modulo.nome}
            </span>
          </li>
        ))}
        <li className="flex flex-col items-center gap-2 text-muted-foreground">
          <span
            className={cn(
              'grid size-20 place-items-center rounded-full border-2 border-dashed border-muted-foreground/60 text-sm',
            )}
          >
            em breve
          </span>
          <span className="font-medium">JavaScript</span>
        </li>
      </ul>
    </section>
  )
}
```

Confira em `src/app/globals.css` (`@theme inline`) que `--color-chart-5` existe (é o `text-chart-5`); se não existir, use `text-chart-2`.

- [ ] **Step 3: `src/components/inicio/mapa-de-dias.tsx`**

```tsx
import { useId } from 'react'

import type { CelulaDoMapa, NivelDoDia } from '@/lib/progresso/painel'
import { cn } from '@/lib/utils'

import { CARTAO, TITULO_SUB } from './estilos'

const COR: Record<NivelDoDia, string> = {
  nada: 'bg-muted',
  estudou: 'bg-chart-2',
  concluiu: 'bg-primary',
}
const NOME: Record<NivelDoDia, string> = {
  nada: 'sem estudo',
  estudou: 'estudou',
  concluiu: 'concluiu aula',
}

function resumo(total: number) {
  if (total === 0)
    return 'Seus dias de estudo aparecem aqui quando você fizer a primeira aula.'
  return total === 1
    ? '1 dia estudado desde o começo.'
    : `${total} dias estudados desde o começo.`
}

/**
 * Os últimos três meses em quadradinhos. Só soma, nunca zera (briefing 10.4).
 * A grade é decorativa para leitores de tela: o resumo e a legenda dizem tudo.
 */
export function MapaDeDias({
  semanas,
  total,
}: {
  semanas: CelulaDoMapa[][]
  total: number
}) {
  const tituloId = useId()
  return (
    <section aria-labelledby={tituloId} className={CARTAO}>
      <h3 id={tituloId} className={TITULO_SUB}>
        Seus dias de estudo
      </h3>
      <p className="mt-1 text-muted-foreground">{resumo(total)}</p>
      <div data-mapa aria-hidden="true" className="mt-4 overflow-x-auto pb-1">
        <div className="grid w-max grid-flow-col grid-rows-7 gap-1">
          {semanas.flat().map((celula) => (
            <span
              key={celula.dia}
              data-dia={celula.dia}
              title={
                celula.futuro
                  ? undefined
                  : `${celula.dia}: ${NOME[celula.nivel]}`
              }
              className={cn(
                'size-3.5 rounded-[3px]',
                celula.futuro ? 'bg-transparent' : COR[celula.nivel],
              )}
            />
          ))}
        </div>
      </div>
      <ul className="mt-3 flex flex-wrap gap-4 text-sm text-muted-foreground">
        {(['nada', 'estudou', 'concluiu'] as const).map((nivel) => (
          <li key={nivel} className="flex items-center gap-1.5">
            <span
              aria-hidden
              className={cn(
                'size-3.5 rounded-[3px]',
                COR[nivel],
                nivel === 'nada' && 'border border-border',
              )}
            />
            {NOME[nivel]}
          </li>
        ))}
      </ul>
    </section>
  )
}
```

- [ ] **Step 4: `src/components/inicio/vitrine-conquistas.tsx`**

```tsx
import { useId } from 'react'
import Link from 'next/link'

import { HeartIcon, LockIcon } from 'lucide-react'

import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

import { CARTAO, TITULO_SUB } from './estilos'

type VitrineConquistasProps = {
  selos: { id: string; titulo: string; ganha: boolean }[]
  proxima?: { titulo: string; comoGanhar: string }
}

/** As conquistas em selos e a próxima ao alcance (HU-09). */
export function VitrineConquistas({ selos, proxima }: VitrineConquistasProps) {
  const tituloId = useId()
  return (
    <section aria-labelledby={tituloId} className={CARTAO}>
      <h3 id={tituloId} className={TITULO_SUB}>
        Conquistas
      </h3>
      <ul className="mt-4 flex flex-wrap gap-3">
        {selos.map((selo) => (
          <li
            key={selo.id}
            className={cn(
              'grid size-14 place-items-center rounded-xl border-2',
              selo.ganha
                ? 'border-chart-5 bg-muted text-primary'
                : 'border-dashed border-muted-foreground/60 text-muted-foreground',
            )}
          >
            {selo.ganha ? (
              <HeartIcon aria-hidden className="size-6 fill-current" />
            ) : (
              <LockIcon aria-hidden className="size-5" />
            )}
            <span className="sr-only">
              {selo.ganha
                ? `${selo.titulo}, ganha`
                : `${selo.titulo}, ainda não`}
            </span>
          </li>
        ))}
      </ul>
      {proxima && (
        <p className="mt-4 text-muted-foreground">
          Próxima: <strong className="text-foreground">{proxima.titulo}</strong>{' '}
          — {proxima.comoGanhar}
        </p>
      )}
      <Link
        href="/conquistas"
        className={cn(buttonVariants({ variant: 'outline' }), 'mt-4 w-fit')}
      >
        Ver conquistas
      </Link>
    </section>
  )
}
```

Run: `npx vitest run src/components/inicio` → PASS.

- [ ] **Step 5: Verificar e commitar**

Run: `npx eslint src/components/inicio && npx tsc --noEmit`

```bash
git add src/components/inicio/progresso-modulos.tsx src/components/inicio/progresso-modulos.spec.tsx src/components/inicio/mapa-de-dias.tsx src/components/inicio/mapa-de-dias.spec.tsx src/components/inicio/vitrine-conquistas.tsx src/components/inicio/vitrine-conquistas.spec.tsx
git commit -m "feat: module rings, the day map and the badge showcase

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 6: O dashboard no Início

**Files:**

- Modify: `src/components/inicio/inicio.tsx`, `src/components/inicio/inicio.spec.tsx`

- [ ] **Step 1: Atualizar os testes (falham)**

Em `src/components/inicio/inicio.spec.tsx`:

1. Imports: acrescente `afterEach` ao import do vitest.
2. No teste `'de volta: cumprimenta pelo nome e oferece continuar'`, troque a última asserção (``getByText(`0 de ${AULAS.length}`)``) por:

```tsx
const totalHtml = AULAS.filter((a) => a.modulo === 'html').length
expect(
  screen.getByRole('img', {
    name: `HTML: 0 de ${totalHtml} aulas concluídas`,
  }),
).toBeInTheDocument()
```

3. No teste `'tudo concluído: celebra e leva ao site'`, troque a última asserção (`` `${AULAS.length} de ${AULAS.length}` ``) por:

```tsx
const totalCss = AULAS.filter((a) => a.modulo === 'css').length
expect(
  screen.getByRole('img', {
    name: `CSS: ${totalCss} de ${totalCss} aulas concluídas`,
  }),
).toBeInTheDocument()
```

4. Acrescente no fim do arquivo:

```tsx
describe('Inicio — dashboard', () => {
  beforeEach(() => {
    localStorage.clear()
    esquecerProgressoEmMemoria()
    vi.useFakeTimers({ toFake: ['Date'] })
    // quinta-feira, 8 de outubro de 2026
    vi.setSystemTime(new Date(2026, 9, 8, 10))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('mostra a Luv com os corações, a semana e o progresso', () => {
    atualizarProgresso((p) => ({
      ...definirNome(p, 'Ana'),
      diasEstudados: ['2026-10-05', '2026-10-07'],
    }))
    render(<Inicio />)

    expect(
      screen.getByRole('heading', { level: 1, name: 'Oi, Ana!' }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('img', { name: '2 de 3 corações' }),
    ).toBeInTheDocument()
    expect(
      screen.getByText(
        'A Luv guardou dois corações esta semana. Falta um para a sua meta.',
      ),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('region', { name: 'Sua semana' }),
    ).toHaveTextContent('quinta-feira, hoje')
    expect(
      screen.getByRole('heading', { level: 2, name: 'Seu progresso' }),
    ).toBeInTheDocument()
    expect(
      screen.getByText('2 dias estudados desde o começo.'),
    ).toBeInTheDocument()
    expect(screen.getByText(/Próxima:/)).toHaveTextContent('Hello, World')
  })

  it('usa a meta que ela escolheu', () => {
    atualizarProgresso((p) => ({
      ...definirNome(p, 'Ana'),
      metaSemanal: 5,
      diasEstudados: ['2026-10-05'],
    }))
    render(<Inicio />)

    expect(
      screen.getByRole('img', { name: '1 de 5 corações' }),
    ).toBeInTheDocument()
    expect(
      screen.getByText(
        'Você estudou em 1 dia desta semana. Meta: 5 dias por semana.',
      ),
    ).toBeInTheDocument()
  })

  it('progresso não recuperado: o aviso aparece no dashboard', () => {
    localStorage.setItem('codeluv:progresso', '{quebrado')
    render(<Inicio />)

    expect(
      screen.getByText('Não encontramos seu progresso neste aparelho'),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('img', { name: '0 de 3 corações' }),
    ).toBeInTheDocument()
  })
})
```

Run: `npx vitest run src/components/inicio/inicio.spec.tsx` → FAIL.

- [ ] **Step 2: Trocar `BoasVindas` por `Painel` em `src/components/inicio/inicio.tsx`**

1. Apague a função `BoasVindas` inteira e escreva no lugar:

```tsx
/** O dashboard de quem já começou (spec 2026-10-09-dashboard-design). */
function Painel({
  progresso,
  perdido,
}: {
  progresso: Progresso
  perdido: boolean
}) {
  const progressoId = useId()
  // Só roda no cliente: useProgresso devolve null no servidor.
  const agora = new Date()
  const meta = metaDe(progresso)
  const dias = diasDaSemana(progresso, agora)
  const estudados = dias.filter((dia) => dia.estudou).length
  const conquistas = vitrineDeConquistas(progresso)

  return (
    <div className={PAINEL}>
      <LuvDaSemana nome={progresso.nome} estudados={estudados} meta={meta} />

      {perdido && (
        <Alert variant="warning">
          <TriangleAlertIcon />
          <AlertTitle>Não encontramos seu progresso neste aparelho</AlertTitle>
          <AlertDescription>
            Se você guardou uma cópia, dá para recuperar em{' '}
            <Link href="/configuracoes">Configurações</Link>.
          </AlertDescription>
        </Alert>
      )}

      <ContinuarCard
        proxima={proximaParaEstudar(progresso, AULAS)}
        ultima={ultimaConcluida(progresso, AULAS)}
      />
      <SuaSemana dias={dias} meta={meta} />

      <section
        aria-labelledby={progressoId}
        className="mt-4 flex flex-col gap-6"
      >
        <h2 id={progressoId} className="font-display text-2xl font-semibold">
          Seu progresso
        </h2>
        <ProgressoModulos
          modulos={progressoPorModulo(progresso, AULAS, MODULOS)}
        />
        <MapaDeDias
          semanas={mapaDeDias(progresso, agora)}
          total={progresso.diasEstudados.length}
        />
        <VitrineConquistas
          selos={conquistas.selos}
          proxima={conquistas.proxima}
        />
      </section>
    </div>
  )
}
```

2. Logo depois das constantes `TITULO` e `GRADE`, acrescente:

```tsx
const PAINEL = 'mx-auto flex w-full max-w-3xl flex-col gap-6'
```

3. No `Inicio`, troque o esqueleto de carregamento (o `return` dentro de `if (!estado)`) por:

```tsx
return (
  <div className={PAINEL}>
    <div className={cn(CARTAO, 'mt-12 flex flex-col gap-3')}>
      <h1 className={TITULO}>Oi!</h1>
      <Skeleton className="h-6 w-2/3" />
    </div>
    <Skeleton className="h-40 w-full" />
    <Skeleton className="h-40 w-full" />
  </div>
)
```

e troque `<BoasVindas progresso={progresso} perdido={perdido} />` por `<Painel progresso={progresso} perdido={perdido} />`.

4. Imports: acrescente

```tsx
import { MODULOS } from '@/content/modulos'
import { metaDe } from '@/lib/progresso/modelo'
import {
  diasDaSemana,
  mapaDeDias,
  progressoPorModulo,
  vitrineDeConquistas,
} from '@/lib/progresso/painel'
import { cn } from '@/lib/utils'

import { ContinuarCard } from './continuar-card'
import { CARTAO } from './estilos'
import { LuvDaSemana } from './luv-da-semana'
import { MapaDeDias } from './mapa-de-dias'
import { ProgressoModulos } from './progresso-modulos'
import { SuaSemana } from './sua-semana'
import { VitrineConquistas } from './vitrine-conquistas'
```

(junte `metaDe` com o import de tipo `Progresso` que já existe: `import { metaDe, type Progresso } from '@/lib/progresso/modelo'`) e remova os que ficaram sem uso: `PlayIcon`, `Card*`, `Progress`, `ProgressLabel`, `getModulo` — o ESLint/TypeScript apontam. A tela de primeiro uso (`PrimeiroUso`) e a `Luv` dela não mudam.

Run: `npx vitest run src/components/inicio` → PASS.

- [ ] **Step 3: Conferir no navegador**

Com o servidor da responsável em `http://localhost:3001`, abra `/` (com progresso: conclua uma aula antes, ou use o Playwright da Task 8). Confirme: a Luv sai pelo topo do cartão sem cortar, os sete dias cabem a 375px de largura, o mapa rola para o lado só dentro do cartão se faltar espaço.

- [ ] **Step 4: Verificar e commitar**

Run: `npx eslint . && npx tsc --noEmit && npm test`

```bash
git add src/components/inicio/inicio.tsx src/components/inicio/inicio.spec.tsx
git commit -m "feat: the home dashboard with the week tracker and progress

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 7: Meta da semana em Configurações

**Files:**

- Modify: `src/components/ui/native-select.tsx`
- Modify: `src/components/configuracoes/configuracoes.tsx`, `src/components/configuracoes/configuracoes.spec.tsx`

- [ ] **Step 1: Teste que falha**

Em `src/components/configuracoes/configuracoes.spec.tsx`, acrescente (siga o padrão do arquivo para `render`, `userEvent` e o mock de `toast`, se houver):

```tsx
it('a meta da semana começa em 3 e muda na hora', async () => {
  const user = userEvent.setup()
  render(<Configuracoes />)

  const meta = screen.getByLabelText(
    'Quantos dias por semana você quer estudar?',
  )
  expect(meta).toHaveValue('3')

  await user.selectOptions(meta, '5')
  expect(obterEstado().progresso.metaSemanal).toBe(5)
  expect(meta).toHaveValue('5')
})
```

(Importe `obterEstado` de `@/lib/progresso/store` se o arquivo ainda não importar. Se o arquivo mocka `toast`, acrescente `expect(add).toHaveBeenCalledWith({ title: 'Meta salva' })`.)

Run: `npx vitest run src/components/configuracoes` → FAIL.

- [ ] **Step 2: `NativeSelect` com 48px**

Em `src/components/ui/native-select.tsx`, na classe do `<select>`, troque `h-8` por `h-12` e `text-sm` por `text-base` (área de toque de 48px — DS 5.3, como já foi feito no `Input`). Antes, rode `grep -rn "NativeSelect" src --include=*.tsx` para conferir quem mais usa (se houver, confira que nada quebra).

- [ ] **Step 3: O campo em `src/components/configuracoes/configuracoes.tsx`**

1. Imports: acrescente `definirMeta` ao import de `@/lib/progresso/acoes`; `import { metaDe } from '@/lib/progresso/modelo'`; `import { NativeSelect, NativeSelectOption } from '@/components/ui/native-select'`.
2. Junto dos outros `useId`: `const metaId = useId()`.
3. Depois de `salvarNome`, acrescente:

```tsx
function mudarMeta(evento: React.ChangeEvent<HTMLSelectElement>) {
  const meta = Number(evento.target.value)
  atualizarProgresso((p) => definirMeta(p, meta))
  toast.add({ title: 'Meta salva' })
}
```

4. Entre a seção do nome e o primeiro `<Separator />`, acrescente:

```tsx
      <Separator />

      <section aria-labelledby="sec-meta" className={SECAO}>
        <h2 id="sec-meta" className={TITULO}>
          Meta da semana
        </h2>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor={metaId}>
              Quantos dias por semana você quer estudar?
            </FieldLabel>
            <NativeSelect
              id={metaId}
              value={metaDe(estado.progresso)}
              onChange={mudarMeta}
            >
              {[1, 2, 3, 4, 5, 6, 7].map((n) => (
                <NativeSelectOption key={n} value={n}>
                  {n === 1 ? '1 dia por semana' : `${n} dias por semana`}
                </NativeSelectOption>
              ))}
            </NativeSelect>
            <FieldDescription>
              Dá para mudar quando quiser. A semana recomeça toda segunda, sem
              perder nada.
            </FieldDescription>
          </Field>
        </FieldGroup>
      </section>
```

(O `<Separator />` que já existe depois do formulário do nome continua separando a meta da cópia.)

Run: `npx vitest run src/components/configuracoes` → PASS.

- [ ] **Step 4: Verificar e commitar**

Run: `npx eslint . && npx tsc --noEmit && npm test`

```bash
git add src/components/ui/native-select.tsx src/components/configuracoes/configuracoes.tsx src/components/configuracoes/configuracoes.spec.tsx
git commit -m "feat: choose the weekly goal in settings

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 8: Ponta a ponta

**Files:**

- Create: `e2e/inicio.spec.ts`

- [ ] **Step 1: Escrever os testes**

`e2e/inicio.spec.ts`:

```ts
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
```

- [ ] **Step 2: Rodar**

Run: `npx playwright test`
Expected: todos passam (37 antigos + 3 novos = 40). Os testes antigos que passam pelo Início (`navigation.spec.ts`, `progresso.spec.ts`) precisam continuar verdes: "Oi, Ana!" segue como `h1` e "Continuar: Seu primeiro HTML" segue na tela. Se o axe acusar contraste, confira as cores usadas contra `src/app/tokens.spec.ts` e troque pela combinação conferida.

- [ ] **Step 3: Commit**

```bash
git add e2e/inicio.spec.ts
git commit -m "test: cover the home dashboard end to end

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 9: Documentação e verificação final

**Files:**

- Modify: `docs/design-system.md`

- [ ] **Step 1: Design system**

1. Cabeçalho: versão `0.6.0` → `0.7.0`.
2. Inventário 8.1: acrescente linhas (mesmo formato da tabela) para `LuvDaSemana`, `SuaSemana`, `ProgressoModulos`, `MapaDeDias`, `VitrineConquistas` e `ContinuarCard`, categoria "progresso", base "componente próprio — `src/components/inicio/…`", status "pronto". `NativeSelect`: anote na coluna de mudanças "altura 48px".
3. 13.4, linha "Recortes da Luv": troque a diferença por "existem `ola.png` (recortada do logo) e `luv-notebook.webp` (ilustração do dashboard); os outros estados existem só no moodboard" e mantenha o plano.
4. 14, depois de DS-14:

```markdown
**DS-15 — Habit tracker sem sequência**

- **Data:** 2026-10-09
- **Contexto:** o dashboard ganhou um habit tracker (corações da Luv, semana em sete quadrados, mapa de 13 semanas). O briefing mede hábito ("≥ 3 sessões por semana") mas proíbe perseguir dias seguidos e sequências que quebram (10.4 e 11).
- **Alternativas consideradas:** contador de dias seguidos (streak); tracker semanal com meta; mapa de dias; bichinho virtual com acessórios.
- **Decisão:** semana de segunda a domingo com meta escolhida pela aluna (1–7, padrão 3) + mapa de 13 semanas que só soma + corações da Luv até a meta. Nenhum número de sequência; a Luv nunca lamenta.
- **Por quê:** mostra constância sem culpa por pausar; a semana recomeça sem perder nada.
- **O que abrimos mão:** o empurrão de "não quebre a sequência".
- **Revisar se:** a aluna disser que sente falta de um desafio maior.
```

5. Histórico: `| 2026-10-09 | 0.7.0 — Plano 6 entregue: dashboard do Início com habit tracker (DS-15) e meta da semana | Claudio Soares |`.

Run: `npx prettier --write docs/design-system.md`

- [ ] **Step 2: Verificação final**

Run: `npx eslint . && npx next typegen && npx tsc --noEmit && npm test && npm run build && npx playwright test`
Expected: tudo verde; Playwright `40 passed`.

- [ ] **Step 3: Commit**

```bash
git add docs/design-system.md
git commit -m "docs: record plano 6 delivery and the streak-free habit tracker

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

## Fora deste plano

- Animações (corações enchendo, `sparkle` na meta completa) — com a celebração de módulo.
- Novas conquistas (concluir um módulo).
- Curiosidade do dia, relembrar uma aula, trilha de fases, miniatura do site, números do caminho (descartados na sessão de 2026-10-09).
