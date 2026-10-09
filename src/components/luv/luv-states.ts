import { comBase } from '@/lib/base-path'

export const LUV_STATES = [
  'ola',
  'aprender',
  'praticar',
  'pista',
  'incentivo',
  'comemorar',
  'descansar',
  'evoluir',
] as const

export type LuvState = (typeof LUV_STATES)[number]

const DEFAULT_ART = comBase('/images/luv/ola.png')

/**
 * Arte disponível em public/images/luv/. Estados sem arte própria usam a de
 * boas-vindas até os recortes existirem (design system, seção 13.4).
 */
const LUV_ART: Partial<Record<LuvState, string>> = {
  ola: DEFAULT_ART,
}

export function luvImage(state: LuvState) {
  return LUV_ART[state] ?? DEFAULT_ART
}
