import type { CheckHtml, CheckResult } from './types'

function passes(doc: Document, check: CheckHtml) {
  switch (check.tipo) {
    case 'existe':
      return doc.querySelector(check.seletor) !== null
    case 'texto':
      return (doc.querySelector(check.seletor)?.textContent ?? '').trim() !== ''
    case 'quantidade':
      return doc.querySelectorAll(check.seletor).length >= check.minimo
  }
}

/**
 * Confere o HTML da aluna sem executá-lo: o DOMParser monta o documento,
 * mas não roda scripts. Serve para aulas de HTML; aulas de CSS usam
 * runCssChecks; aulas com JavaScript vão precisar conferir dentro do iframe
 * do resultado.
 */
export function runChecks(html: string, checks: CheckHtml[]): CheckResult[] {
  const doc = new DOMParser().parseFromString(html, 'text/html')
  return checks.map((check) => ({
    descricao: check.descricao,
    ok: passes(doc, check),
  }))
}
