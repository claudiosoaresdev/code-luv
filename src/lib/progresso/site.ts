import type { Aula } from '@/content/aulas/types'

import type { Progresso } from './modelo'

const concluida = (p: Progresso, aula: Aula) =>
  Boolean(p.aulas[aula.slug]?.concluidaEm)

/** Código que a aluna está editando agora (resultado da prática de CSS). */
export type EmEdicao = { slug: string; codigo: string }

/**
 * "Meu site" (HU-07): o HTML das aulas de HTML concluídas e o CSS das aulas
 * de CSS concluídas, cada um na ordem das aulas. Com `emEdicao`, aquela aula
 * entra com o código do editor, mesmo sem estar concluída.
 */
export function montarSite(p: Progresso, aulas: Aula[], emEdicao?: EmEdicao) {
  const codigoDe = (aula: Aula) =>
    emEdicao && aula.slug === emEdicao.slug
      ? emEdicao.codigo
      : (p.aulas[aula.slug]?.codigoConcluido ??
        p.aulas[aula.slug]?.codigo ??
        '')
  const entram = aulas.filter(
    (aula) => aula.slug === emEdicao?.slug || concluida(p, aula),
  )
  const juntar = (modulo: Aula['modulo']) =>
    entram
      .filter((aula) => aula.modulo === modulo)
      .map((aula) => codigoDe(aula).trim())
      .filter(Boolean)
      .join('\n\n')
  return {
    html: juntar('html'),
    css: juntar('css'),
    partes: aulas
      .filter((aula) => concluida(p, aula))
      .map(({ slug, titulo }) => ({ slug, titulo })),
  }
}

/**
 * O documento do iframe: o CSS num <style> antes do HTML. Sem CSS, é o HTML
 * como está. `htmlDeExemplo` entra quando a aluna ainda não tem HTML.
 */
export function documentoDoSite(
  site: { html: string; css: string },
  htmlDeExemplo = '',
) {
  const corpo = site.html || htmlDeExemplo
  if (!site.css) return corpo
  // Dentro de uma string do CSS, "<\/style" é o mesmo texto; fora dela,
  // "</style" já não é CSS válido. Assim o CSS não fecha a tag antes da hora.
  const css = site.css.replace(/<\/style/gi, '<\\/style')
  return `<style>\n${css}\n</style>\n${corpo}`
}

/**
 * O que o iframe mostra: o documento do site e se ele usa o HTML de exemplo
 * (a aluna ainda não tem HTML). O exemplo vem de fora para lib não depender
 * do conteúdo.
 */
export function siteParaMostrar(
  site: { html: string; css: string },
  htmlDeExemplo: string,
) {
  return {
    documento: documentoDoSite(site, htmlDeExemplo),
    usaExemplo: site.html === '',
  }
}

export function proximaParaEstudar(p: Progresso, aulas: Aula[]) {
  return aulas.find((aula) => !concluida(p, aula))
}

export function ultimaConcluida(p: Progresso, aulas: Aula[]) {
  return [...aulas].reverse().find((aula) => concluida(p, aula))
}
