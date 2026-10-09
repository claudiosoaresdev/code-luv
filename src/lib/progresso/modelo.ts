export const VELOCIDADES = [0.75, 1, 1.25, 1.5] as const
export type Velocidade = (typeof VELOCIDADES)[number]

export function velocidadeValida(valor: unknown): valor is Velocidade {
  return (VELOCIDADES as readonly unknown[]).includes(valor)
}

export type ProgressoAula = {
  /** Último código escrito na prática. */
  codigo?: string
  /** Quantas vezes a aluna apertou "Conferir". */
  conferencias: number
  /** ISO 8601; a primeira conclusão. */
  concluidaEm?: string
  /** O código com que a aula foi concluída pela última vez (alimenta Meu site). */
  codigoConcluido?: string
  /** Quantas conferências havia quando concluiu pela primeira vez. */
  conferenciasAoConcluir?: number
}

export type Progresso = {
  versao: 1
  nome?: string
  /** A aluna escolheu não informar o nome no primeiro uso. */
  nomePulado?: boolean
  aulas: Record<string, ProgressoAula>
  conquistas: Record<string, { em: string }>
  /** Datas YYYY-MM-DD (horário local) em que ela estudou. */
  diasEstudados: string[]
  velocidade?: Velocidade
  /** Dias por semana que ela quer estudar (1–7). Ausente = META_PADRAO. */
  metaSemanal?: number
}

export const PROGRESSO_VAZIO: Progresso = {
  versao: 1,
  aulas: {},
  conquistas: {},
  diasEstudados: [],
}

/** A métrica do briefing (seção 10): três sessões por semana. */
export const META_PADRAO = 3

export function metaValida(valor: unknown): valor is number {
  return (
    Number.isInteger(valor) && (valor as number) >= 1 && (valor as number) <= 7
  )
}

export function metaDe(p: Progresso) {
  return p.metaSemanal ?? META_PADRAO
}

function objeto(valor: unknown): valor is Record<string, unknown> {
  return typeof valor === 'object' && valor !== null && !Array.isArray(valor)
}

const CHAVES_PROIBIDAS = new Set(['__proto__', 'constructor', 'prototype'])

function contagem(valor: unknown): number | undefined {
  return typeof valor === 'number' && Number.isFinite(valor) && valor >= 0
    ? Math.floor(valor)
    : undefined
}

function aulaValida(valor: unknown): ProgressoAula | null {
  if (!objeto(valor)) return null
  const aula: ProgressoAula = {
    conferencias: contagem(valor.conferencias) ?? 0,
  }
  if (typeof valor.codigoConcluido === 'string')
    aula.codigoConcluido = valor.codigoConcluido
  const aoConcluir = contagem(valor.conferenciasAoConcluir)
  if (aoConcluir !== undefined) aula.conferenciasAoConcluir = aoConcluir
  if (typeof valor.codigo === 'string') aula.codigo = valor.codigo
  if (typeof valor.concluidaEm === 'string')
    aula.concluidaEm = valor.concluidaEm
  return aula
}

/**
 * Confere e limpa um progresso vindo do armazenamento ou de uma cópia.
 * Devolve null se não for um progresso do CodeLuv; campos inválidos são
 * descartados um a um, sem perder o resto.
 */
export function normalizar(dado: unknown): Progresso | null {
  if (!objeto(dado) || dado.versao !== 1 || !objeto(dado.aulas)) return null

  const progresso: Progresso = { ...PROGRESSO_VAZIO, aulas: {}, conquistas: {} }

  for (const [slug, valor] of Object.entries(dado.aulas)) {
    if (CHAVES_PROIBIDAS.has(slug)) continue
    const aula = aulaValida(valor)
    if (aula) progresso.aulas[slug] = aula
  }
  if (objeto(dado.conquistas)) {
    for (const [id, valor] of Object.entries(dado.conquistas)) {
      if (CHAVES_PROIBIDAS.has(id)) continue
      if (objeto(valor) && typeof valor.em === 'string') {
        progresso.conquistas[id] = { em: valor.em }
      }
    }
  }
  if (Array.isArray(dado.diasEstudados)) {
    progresso.diasEstudados = dado.diasEstudados.filter(
      (dia): dia is string => typeof dia === 'string',
    )
  }
  if (typeof dado.nome === 'string' && dado.nome.trim()) {
    progresso.nome = dado.nome.trim()
  }
  if (dado.nomePulado === true) progresso.nomePulado = true
  if (velocidadeValida(dado.velocidade)) progresso.velocidade = dado.velocidade
  if (metaValida(dado.metaSemanal)) progresso.metaSemanal = dado.metaSemanal

  return progresso
}
