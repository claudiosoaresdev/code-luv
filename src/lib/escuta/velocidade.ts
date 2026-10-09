import { type Velocidade, velocidadeValida } from '@/lib/progresso/modelo'
import {
  assinarProgresso,
  atualizarProgresso,
  esquecerProgressoEmMemoria,
  obterEstado,
} from '@/lib/progresso/store'

export { type Velocidade, VELOCIDADES } from '@/lib/progresso/modelo'

/** Chave do Plano 3; migrada para o progresso na primeira escolha nova. */
const CHAVE_ANTIGA = 'codeluv:velocidade'

/** Velocidade lembrada (HU-03): a do progresso, senão a antiga, senão 1×. */
export function lerVelocidade(): Velocidade {
  const salva = obterEstado().progresso.velocidade
  if (salva) return salva
  try {
    const antiga = Number(localStorage.getItem(CHAVE_ANTIGA))
    if (velocidadeValida(antiga)) return antiga
  } catch {
    // Sem armazenamento: fica a padrão.
  }
  return 1
}

export function salvarVelocidade(valor: Velocidade) {
  atualizarProgresso((p) => ({ ...p, velocidade: valor }))
  try {
    localStorage.removeItem(CHAVE_ANTIGA)
  } catch {
    // Sem armazenamento: nada a migrar.
  }
}

/** Para useSyncExternalStore: a velocidade muda junto com o progresso. */
export const assinarVelocidade = assinarProgresso

/** Só para testes: esquece o que ficou em memória. */
export function esquecerVelocidadeEmMemoria() {
  esquecerProgressoEmMemoria()
}
