export const VELOCIDADES = [0.75, 1, 1.25, 1.5] as const
export type Velocidade = (typeof VELOCIDADES)[number]

const CHAVE = 'codeluv:velocidade'
const EVENTO = 'codeluv:velocidade'

function valida(valor: number): valor is Velocidade {
  return (VELOCIDADES as readonly number[]).includes(valor)
}

/** Escolha desta página, para valer mesmo quando o armazenamento falha. */
let memoria: Velocidade | undefined

/** Só para testes: esquece a escolha guardada em memória. */
export function esquecerVelocidadeEmMemoria() {
  memoria = undefined
}

/**
 * Velocidade lembrada no aparelho (HU-03). Se o armazenamento não der para ler,
 * vale a escolha feita nesta página; sem nenhuma, 1×.
 */
export function lerVelocidade(): Velocidade {
  try {
    const valor = Number(localStorage.getItem(CHAVE))
    if (valida(valor)) return valor
  } catch {
    // Armazenamento indisponível: cai para a memória.
  }
  return memoria ?? 1
}

export function salvarVelocidade(valor: Velocidade) {
  memoria = valor
  try {
    localStorage.setItem(CHAVE, String(valor))
  } catch {
    // Armazenamento indisponível: a escolha vale só até recarregar a página.
  }
  window.dispatchEvent(new Event(EVENTO))
}

/** Para useSyncExternalStore: avisa quando a velocidade muda (nesta aba ou em outra). */
export function assinarVelocidade(aviso: () => void) {
  window.addEventListener(EVENTO, aviso)
  window.addEventListener('storage', aviso)
  return () => {
    window.removeEventListener(EVENTO, aviso)
    window.removeEventListener('storage', aviso)
  }
}
