import { useSyncExternalStore } from 'react'

import { assinarProgresso, type EstadoProgresso, obterEstado } from './store'

/**
 * O progresso da aluna. No servidor (e na hidratação) é null: quem usa mostra
 * um estado "carregando" e só depois o que está guardado no aparelho.
 */
export function useProgresso(): EstadoProgresso | null {
  return useSyncExternalStore(assinarProgresso, obterEstado, () => null)
}
