import { MODULOS } from '../modulos'
import { aula as seuPrimeiroHtml } from './01-seu-primeiro-html/aula'
import { aula as titulosEDestaques } from './02-titulos-e-destaques/aula'
import { aula as listas } from './03-listas/aula'
import { aula as links } from './04-links/aula'
import { aula as imagens } from './05-imagens/aula'
import { aula as formularios } from './06-formularios/aula'
import { aula as secoesERodape } from './07-secoes-e-rodape/aula'
import { aula as cores } from './css-01-cores/aula'
import { aula as letras } from './css-02-letras/aula'
import type { Aula } from './types'

const posicao = (aula: Aula) => MODULOS.findIndex((m) => m.id === aula.modulo)

/**
 * Todas as aulas, por módulo (na ordem de MODULOS) e, dentro dele, por
 * `ordem`. Para acrescentar uma aula: criar a pasta
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
  cores,
  letras,
].sort((a, b) => posicao(a) - posicao(b) || a.ordem - b.ordem)

export function getAula(slug: string) {
  return AULAS.find((aula) => aula.slug === slug)
}

export function proximaAula(slug: string) {
  const i = AULAS.findIndex((aula) => aula.slug === slug)
  return i === -1 ? undefined : AULAS[i + 1]
}

/**
 * Para as aulas de CSS quando a aluna ainda não tem HTML no site: as
 * soluções das aulas de HTML, juntas, como se fossem o site da Ana.
 */
export function siteDeExemplo() {
  return AULAS.filter((aula) => aula.modulo === 'html')
    .map((aula) => aula.pratica.solucao.trim())
    .join('\n\n')
}
