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

/**
 * Arte disponível em public/images/luv/. Estados sem arte própria usam a de
 * boas-vindas até os recortes existirem (design system, seção 13.4).
 */
const LUV_ART: Partial<Record<LuvState, string>> = {
  ola: '/images/luv/ola.png',
}

export function luvImage(state: LuvState) {
  return LUV_ART[state] ?? '/images/luv/ola.png'
}
