import type { Aula } from '@/content/aulas/types'
import type { Modulo } from '@/content/modulos'

import { hoje } from './acoes'
import { CONQUISTAS } from './conquistas'
import type { Progresso } from './modelo'

// Contas do dashboard do Início (spec 2026-10-09-dashboard-design). Nada aqui
// conta dias seguidos: a semana recomeça na segunda e o mapa só soma
// (briefing 10.4 e 11). Datas no horário local, como em hoje().

const CURTOS = ['seg', 'ter', 'qua', 'qui', 'sex', 'sáb', 'dom']
const COMPLETOS = [
  'segunda-feira',
  'terça-feira',
  'quarta-feira',
  'quinta-feira',
  'sexta-feira',
  'sábado',
  'domingo',
]
const EXTENSO = [
  'zero',
  'um',
  'dois',
  'três',
  'quatro',
  'cinco',
  'seis',
  'sete',
  'oito',
  'nove',
  'dez',
]

export type DiaDaSemana = {
  /** AAAA-MM-DD */
  dia: string
  curto: string
  completo: string
  hoje: boolean
  futuro: boolean
  estudou: boolean
}

export type NivelDoDia = 'nada' | 'estudou' | 'concluiu'
export type CelulaDoMapa = { dia: string; nivel: NivelDoDia; futuro: boolean }

function somarDias(data: Date, dias: number) {
  return new Date(data.getFullYear(), data.getMonth(), data.getDate() + dias)
}

function segundaDaSemana(agora: Date) {
  return somarDias(agora, -((agora.getDay() + 6) % 7))
}

/** Os sete dias da semana de `agora`, de segunda a domingo. */
export function diasDaSemana(p: Progresso, agora: Date): DiaDaSemana[] {
  const estudados = new Set(p.diasEstudados)
  const segunda = segundaDaSemana(agora)
  const hj = hoje(agora)
  return CURTOS.map((curto, i) => {
    const dia = hoje(somarDias(segunda, i))
    return {
      dia,
      curto,
      completo: COMPLETOS[i],
      hoje: dia === hj,
      futuro: dia > hj,
      estudou: estudados.has(dia),
    }
  })
}

/** `semanas` colunas de segunda a domingo; a última é a semana de `agora`. */
export function mapaDeDias(
  p: Progresso,
  agora: Date,
  semanas = 13,
): CelulaDoMapa[][] {
  const estudados = new Set(p.diasEstudados)
  const concluidos = new Set(
    Object.values(p.aulas).flatMap((aula) =>
      aula.concluidaEm ? [hoje(new Date(aula.concluidaEm))] : [],
    ),
  )
  const hj = hoje(agora)
  const inicio = somarDias(segundaDaSemana(agora), -7 * (semanas - 1))
  return Array.from({ length: semanas }, (_, s) =>
    Array.from({ length: 7 }, (_, d) => {
      const dia = hoje(somarDias(inicio, s * 7 + d))
      const nivel: NivelDoDia = concluidos.has(dia)
        ? 'concluiu'
        : estudados.has(dia)
          ? 'estudou'
          : 'nada'
      return { dia, nivel, futuro: dia > hj }
    }),
  )
}

export function progressoPorModulo(
  p: Progresso,
  aulas: Aula[],
  modulos: Modulo[],
) {
  return modulos.map(({ id, nome }) => {
    const doModulo = aulas.filter((aula) => aula.modulo === id)
    return {
      id,
      nome,
      concluidas: doModulo.filter((aula) => p.aulas[aula.slug]?.concluidaEm)
        .length,
      total: doModulo.length,
    }
  })
}

export function vitrineDeConquistas(p: Progresso) {
  const selos = CONQUISTAS.map(({ id, titulo }) => ({
    id,
    titulo,
    ganha: Boolean(p.conquistas[id]),
  }))
  const proxima = CONQUISTAS.find((c) => !p.conquistas[c.id])
  return {
    selos,
    proxima: proxima && {
      titulo: proxima.titulo,
      comoGanhar: proxima.comoGanhar,
    },
  }
}

/** A fala da Luv sobre a semana. Nunca lamenta (spec, regras de produto). */
export function falaDaSemana(estudados: number, meta: number) {
  if (estudados === 0)
    return 'Semana nova, corações novos. Que tal começar com uma aula?'
  if (estudados >= meta) return 'Meta da semana completa! A Luv está radiante.'
  const faltam = meta - estudados
  const guardou =
    estudados === 1 ? 'um coração' : `${EXTENSO[estudados]} corações`
  const falta = faltam === 1 ? 'Falta um' : `Faltam ${EXTENSO[faltam]}`
  return `A Luv guardou ${guardou} esta semana. ${falta} para a sua meta.`
}

const dias = (n: number) => (n === 1 ? '1 dia' : `${n} dias`)

export function fraseDaSemana(estudados: number, meta: number) {
  const metaTexto = `Meta: ${dias(meta)} por semana.`
  return estudados === 0
    ? `Nenhum dia ainda nesta semana. ${metaTexto}`
    : `Você estudou em ${dias(estudados)} desta semana. ${metaTexto}`
}
