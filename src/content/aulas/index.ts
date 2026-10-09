import { aula as seuPrimeiroHtml } from './01-seu-primeiro-html/aula'
import { aula as titulosEDestaques } from './02-titulos-e-destaques/aula'
import { aula as listas } from './03-listas/aula'
import { aula as links } from './04-links/aula'
import { aula as imagens } from './05-imagens/aula'
import { aula as formularios } from './06-formularios/aula'
import { aula as secoesERodape } from './07-secoes-e-rodape/aula'
import type { Aula } from './types'

/**
 * Todas as aulas, em ordem. Para acrescentar uma aula: criar a pasta
 * nn-slug/ com aula.ts e explicacao.mdx, importar aqui e registrar o MDX
 * em explicacoes.ts. Este arquivo não importa MDX, para poder ser testado.
 */
export const AULAS: Aula[] = [
  seuPrimeiroHtml,
  titulosEDestaques,
  listas,
  links,
  imagens,
  formularios,
  secoesERodape,
].sort((a, b) => a.ordem - b.ordem)

export function getAula(slug: string) {
  return AULAS.find((aula) => aula.slug === slug)
}

export function proximaAula(slug: string) {
  const i = AULAS.findIndex((aula) => aula.slug === slug)
  return i === -1 ? undefined : AULAS[i + 1]
}
