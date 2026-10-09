import { normalizar, type Progresso, PROGRESSO_VAZIO } from './modelo'

const CHAVE = 'codeluv:progresso'
const EVENTO = 'codeluv:progresso'

export type EstadoProgresso = {
  progresso: Progresso
  /** Havia algo guardado, mas não deu para ler (HU-08). */
  perdido: boolean
}

const ESTADO_VAZIO: EstadoProgresso = {
  progresso: PROGRESSO_VAZIO,
  perdido: false,
}

/** Último texto lido e seu estado — o mesmo objeto enquanto o texto não muda. */
let cache: { texto: string | null; estado: EstadoProgresso } | undefined
/** Usado quando gravar falhou (navegação privada, cota cheia). */
let memoria: EstadoProgresso | undefined

function lerTexto(): string | null | undefined {
  try {
    return localStorage.getItem(CHAVE)
  } catch {
    return undefined // armazenamento indisponível
  }
}

function interpretar(texto: string | null): EstadoProgresso {
  if (texto === null) return ESTADO_VAZIO
  try {
    const progresso = normalizar(JSON.parse(texto))
    return progresso
      ? { progresso, perdido: false }
      : { ...ESTADO_VAZIO, perdido: true }
  } catch {
    return { ...ESTADO_VAZIO, perdido: true }
  }
}

function avisar() {
  window.dispatchEvent(new Event(EVENTO))
}

const CHAVE_RECUPERACAO = 'codeluv:progresso:recuperacao'

/** Antes de sobrescrever algo ilegível, guarda o texto original (só a primeira vez). */
function guardarCopiaDoIlegivel() {
  const atual = obterEstado()
  const texto = cache?.texto
  if (!atual.perdido || typeof texto !== 'string') return
  try {
    if (localStorage.getItem(CHAVE_RECUPERACAO) === null) {
      localStorage.setItem(CHAVE_RECUPERACAO, texto)
    }
  } catch {
    // Sem armazenamento: não há como guardar a cópia.
  }
}

function gravar(progresso: Progresso) {
  guardarCopiaDoIlegivel()
  const texto = JSON.stringify(progresso)
  try {
    localStorage.setItem(CHAVE, texto)
    memoria = undefined
    cache = { texto, estado: { progresso, perdido: false } }
  } catch {
    memoria = { progresso, perdido: false }
  }
  avisar()
}

/** Snapshot para useSyncExternalStore: estável enquanto nada muda. */
export function obterEstado(): EstadoProgresso {
  // Enquanto uma gravação falhou, mudanças de outras abas são ignoradas até uma gravação dar certo.
  if (memoria) return memoria
  const texto = lerTexto()
  if (texto === undefined) return cache?.estado ?? ESTADO_VAZIO
  if (cache && cache.texto === texto) return cache.estado
  const estado = interpretar(texto)
  cache = { texto, estado }
  return estado
}

export function atualizarProgresso(mudar: (atual: Progresso) => Progresso) {
  gravar(mudar(obterEstado().progresso))
}

export function apagarProgresso() {
  try {
    localStorage.removeItem(CHAVE)
  } catch {
    // Sem armazenamento: só a memória é limpa.
  }
  memoria = undefined
  cache = undefined
  avisar()
}

/** JSON legível para a aluna guardar (Configurações → Baixar uma cópia). */
export function exportarProgresso() {
  return JSON.stringify(obterEstado().progresso, null, 2)
}

/** Recupera de uma cópia. Devolve false se o texto não for um progresso do CodeLuv. */
export function importarProgresso(texto: string) {
  let dado: unknown
  try {
    dado = JSON.parse(texto)
  } catch {
    return false
  }
  const progresso = normalizar(dado)
  if (!progresso) return false
  gravar(progresso)
  return true
}

export function assinarProgresso(aviso: () => void) {
  window.addEventListener(EVENTO, aviso)
  window.addEventListener('storage', aviso)
  return () => {
    window.removeEventListener(EVENTO, aviso)
    window.removeEventListener('storage', aviso)
  }
}

/** Só para testes: esquece memória e cache entre um caso e outro. */
export function esquecerProgressoEmMemoria() {
  memoria = undefined
  cache = undefined
}
