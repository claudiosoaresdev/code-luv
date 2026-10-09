import type { Aula } from '@/content/aulas/types'

import type { Progresso } from './modelo'

const concluida = (p: Progresso, aula: Aula) =>
  Boolean(p.aulas[aula.slug]?.concluidaEm)

/** "Meu site" (HU-07): o código de cada aula concluída, na ordem das aulas. */
export function montarSite(p: Progresso, aulas: Aula[]) {
  const feitas = aulas.filter((aula) => concluida(p, aula))
  return {
    html: feitas
      .map((aula) =>
        (
          p.aulas[aula.slug]?.codigoConcluido ??
          p.aulas[aula.slug]?.codigo ??
          ''
        ).trim(),
      )
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
