import type { Progresso, ProgressoAula } from './modelo'

const AULA_NOVA: ProgressoAula = { conferencias: 0 }

function comAula(
  p: Progresso,
  slug: string,
  mudar: (aula: ProgressoAula) => ProgressoAula,
): Progresso {
  return {
    ...p,
    aulas: { ...p.aulas, [slug]: mudar(p.aulas[slug] ?? AULA_NOVA) },
  }
}

function comDia(p: Progresso, dia: string): Progresso {
  return p.diasEstudados.includes(dia)
    ? p
    : { ...p, diasEstudados: [...p.diasEstudados, dia] }
}

/** Data local AAAA-MM-DD (o "sv-SE" formata exatamente assim). */
export function hoje(data = new Date()) {
  return data.toLocaleDateString('sv-SE')
}

export function salvarCodigo(p: Progresso, slug: string, codigo: string) {
  return comAula(p, slug, (aula) => ({ ...aula, codigo }))
}

export function registrarConferencia(p: Progresso, slug: string, dia: string) {
  return comDia(
    comAula(p, slug, (aula) => ({
      ...aula,
      conferencias: aula.conferencias + 1,
    })),
    dia,
  )
}

export function concluirAula(
  p: Progresso,
  slug: string,
  agora: string,
  dia: string,
) {
  return comDia(
    comAula(p, slug, (aula) =>
      aula.concluidaEm ? aula : { ...aula, concluidaEm: agora },
    ),
    dia,
  )
}

/** Nome em branco conta como "pular" (o campo é opcional — DS 9). */
export function definirNome(p: Progresso, nome: string): Progresso {
  const limpo = nome.trim()
  return { ...p, nome: limpo || undefined, nomePulado: !limpo }
}

export function pularNome(p: Progresso): Progresso {
  return { ...p, nomePulado: true }
}
