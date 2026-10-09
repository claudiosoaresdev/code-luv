import { metaValida, type Progresso, type ProgressoAula } from './modelo'

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

/** Data local AAAA-MM-DD, montada à mão (sem depender de ICU). */
export function hoje(data = new Date()) {
  const mes = String(data.getMonth() + 1).padStart(2, '0')
  const dia = String(data.getDate()).padStart(2, '0')
  return `${data.getFullYear()}-${mes}-${dia}`
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
    comAula(p, slug, (aula) => ({
      ...aula,
      codigoConcluido: aula.codigo,
      ...(aula.concluidaEm
        ? {}
        : { concluidaEm: agora, conferenciasAoConcluir: aula.conferencias }),
    })),
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

/** Meta da semana (1 a 7 dias). Valor fora disso não muda nada. */
export function definirMeta(p: Progresso, meta: number): Progresso {
  return metaValida(meta) ? { ...p, metaSemanal: meta } : p
}
