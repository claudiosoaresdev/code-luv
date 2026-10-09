export const VELOCIDADES = [0.75, 1, 1.25, 1.5] as const
export type Velocidade = (typeof VELOCIDADES)[number]

const CHAVE = 'codeluv:velocidade'
const EVENTO = 'codeluv:velocidade'

function valida(valor: number): valor is Velocidade {
  return (VELOCIDADES as readonly number[]).includes(valor)
}

/** Velocidade lembrada no aparelho (HU-03); 1× se não houver ou não der para ler. */
export function lerVelocidade(): Velocidade {
  try {
    const valor = Number(localStorage.getItem(CHAVE))
    return valida(valor) ? valor : 1
  } catch {
    return 1
  }
}

export function salvarVelocidade(valor: Velocidade) {
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
