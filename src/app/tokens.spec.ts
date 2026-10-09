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
  ['pink-100', 'ink-800', TEXT, 'valores de atributo no editor'],
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
