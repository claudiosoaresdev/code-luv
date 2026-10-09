export type ModuloId = 'html' | 'css'

export type Modulo = {
  id: ModuloId
  /** Nome curto, usado em "Aula 1 · CSS". */
  nome: string
  /** Título da seção na lista de aulas. */
  titulo: string
}

/** Na ordem em que a aluna estuda (briefing, seção 15). */
export const MODULOS: Modulo[] = [
  { id: 'html', nome: 'HTML', titulo: 'HTML · Estrutura da web' },
  { id: 'css', nome: 'CSS', titulo: 'CSS · A cara do seu site' },
]

export function getModulo(id: ModuloId): Modulo {
  const modulo = MODULOS.find((m) => m.id === id)
  if (!modulo) throw new Error(`Módulo desconhecido: ${id}`)
  return modulo
}
