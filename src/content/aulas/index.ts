import { aula as seuPrimeiroHtml } from './01-seu-primeiro-html/aula'
import type { Aula } from './types'

/**
 * Todas as aulas, em ordem. Para acrescentar uma aula: criar a pasta
 * nn-slug/ com aula.ts e explicacao.mdx, importar aqui e registrar o MDX
 * em explicacoes.ts. Este arquivo não importa MDX, para poder ser testado.
 */
export const AULAS: Aula[] = [seuPrimeiroHtml].sort((a, b) => a.ordem - b.ordem)

export function getAula(slug: string) {
  return AULAS.find((aula) => aula.slug === slug)
}

export function proximaAula(slug: string) {
  const i = AULAS.findIndex((aula) => aula.slug === slug)
  return i === -1 ? undefined : AULAS[i + 1]
}
