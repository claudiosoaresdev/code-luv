import type { Aula } from '@/content/aulas/types'

import { runChecks } from './run-checks'
import { runCssChecks } from './run-css-checks'
import type { CheckResult } from './types'

/** Confere a prática com o conferidor da linguagem do módulo. */
export function conferir(aula: Aula, codigo: string): CheckResult[] {
  return aula.modulo === 'css'
    ? runCssChecks(codigo, aula.pratica.conferencia)
    : runChecks(codigo, aula.pratica.conferencia)
}
