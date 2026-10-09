import type { Progresso } from './modelo'

export type Conquista = {
  id: 'hello-world' | 'persistente'
  titulo: string
  /** Mostrada quando já foi ganha. */
  descricao: string
  /** Mostrada enquanto falta ganhar. */
  comoGanhar: string
  ganhou: (p: Progresso) => boolean
}

// Conta toda aula concluída no progresso, mesmo que o slug não exista mais em AULAS.
const concluidas = (p: Progresso) =>
  Object.values(p.aulas).filter((aula) => aula.concluidaEm)

/** HU-09. Reconhece marcos; nunca tempo de uso nem sequência de dias (briefing 10.4). */
export const CONQUISTAS: Conquista[] = [
  {
    id: 'hello-world',
    titulo: 'Hello, World',
    descricao: 'Você concluiu a sua primeira aula.',
    comoGanhar: 'Conclua uma aula.',
    ganhou: (p) => concluidas(p).length > 0,
  },
  {
    id: 'persistente',
    titulo: 'Persistente',
    descricao: 'Você concluiu uma aula depois de conferir três vezes ou mais.',
    comoGanhar:
      'Conclua uma aula depois de conferir três vezes ou mais. Errar faz parte!',
    ganhou: (p) =>
      concluidas(p).some(
        (aula) => (aula.conferenciasAoConcluir ?? aula.conferencias) >= 3,
      ),
  },
]

/** Marca as conquistas recém-ganhas e devolve quais foram (para o aviso). */
export function registrarConquistas(p: Progresso, agora: string) {
  const novas = CONQUISTAS.filter((c) => !p.conquistas[c.id] && c.ganhou(p))
  if (novas.length === 0) return { progresso: p, novas }
  const conquistas = { ...p.conquistas }
  for (const c of novas) conquistas[c.id] = { em: agora }
  return { progresso: { ...p, conquistas }, novas }
}
