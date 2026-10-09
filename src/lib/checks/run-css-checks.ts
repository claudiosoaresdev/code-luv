import * as csstree from 'css-tree'

import type { CheckCss, CheckResult } from './types'

type Regra = {
  seletores: string[]
  emMidia: boolean
  declaracoes: { propriedade: string; valor: string }[]
}

function normalizarSeletor(texto: string) {
  return csstree
    .generate(csstree.parse(texto, { context: 'selector' }))
    .toLowerCase()
}

/**
 * Lê as regras como o navegador: declaração com valor inválido não conta
 * (DS-14). Erros de sintaxe não interrompem a leitura.
 */
function lerRegras(css: string): Regra[] {
  const regras: Regra[] = []
  const ast = csstree.parse(css, { onParseError: () => {} })
  csstree.walk(ast, {
    visit: 'Rule',
    enter(node) {
      if (node.prelude.type !== 'SelectorList') return
      const declaracoes = node.block.children.toArray().flatMap((item) =>
        item.type === 'Declaration' &&
        !csstree.lexer.matchDeclaration(item).error
          ? [
              {
                propriedade: item.property.toLowerCase(),
                valor: csstree.generate(item.value).trim().toLowerCase(),
              },
            ]
          : [],
      )
      regras.push({
        seletores: node.prelude.children
          .toArray()
          .map((seletor) => csstree.generate(seletor).toLowerCase()),
        emMidia: this.atrule?.name === 'media',
        declaracoes,
      })
    },
  })
  return regras
}

function passa(regras: Regra[], check: CheckCss) {
  const alvo = normalizarSeletor(check.seletor)
  return regras.some(
    (regra) =>
      (!check.emMidia || regra.emMidia) &&
      regra.seletores.includes(alvo) &&
      regra.declaracoes.some(
        (d) =>
          check.propriedades.includes(d.propriedade) &&
          (check.valor === undefined || d.valor === check.valor.toLowerCase()),
      ),
  )
}

/** Confere o CSS da aluna pelas regras escritas (aulas do módulo de CSS). */
export function runCssChecks(css: string, checks: CheckCss[]): CheckResult[] {
  const regras = lerRegras(css)
  return checks.map((check) => ({
    descricao: check.descricao,
    ok: passa(regras, check),
  }))
}
