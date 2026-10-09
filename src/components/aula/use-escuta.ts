'use client'

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from 'react'

import { paraFala } from '@/lib/escuta/fala'
import {
  assinarVelocidade,
  lerVelocidade,
  salvarVelocidade,
  type Velocidade,
} from '@/lib/escuta/velocidade'
import { escolherVoz } from '@/lib/escuta/vozes'

export type EstadoEscuta =
  | 'carregando' // antes de saber se o aparelho tem voz (servidor e hidratação)
  | 'indisponivel'
  | 'parado'
  | 'tocando'
  | 'pausado'
  | 'fim'

type Tocador = {
  estado: 'parado' | 'tocando' | 'pausado' | 'fim'
  atual: number
}

type OpcoesEscuta = {
  trechos: string[]
  /** Injetável nos testes; o padrão é window.speechSynthesis. */
  synth?: SpeechSynthesis | null
  criarFala?: (texto: string) => SpeechSynthesisUtterance
}

const semAssinatura = () => () => {}

function synthDoNavegador() {
  return typeof window !== 'undefined' && window.speechSynthesis
    ? window.speechSynthesis
    : null
}

/**
 * A Luv lendo a explicação (DS 8.2 — ListenControls). Fala um trecho por vez;
 * pausar cancela a fala e lembra o trecho (pause/resume são instáveis nos
 * navegadores). O contador de geração ignora eventos de falas canceladas.
 */
export function useEscuta({
  trechos,
  synth: synthInjetado,
  criarFala = (texto) => new SpeechSynthesisUtterance(texto),
}: OpcoesEscuta) {
  const synth = synthInjetado === undefined ? synthDoNavegador() : synthInjetado
  const suportado = useSyncExternalStore(
    semAssinatura,
    () => synth !== null,
    () => null,
  )
  // A lista de vozes costuma chegar depois da primeira renderização.
  const assinarVozes = useCallback(
    (aviso: () => void) => {
      if (!synth) return () => {}
      synth.addEventListener('voiceschanged', aviso)
      return () => synth.removeEventListener('voiceschanged', aviso)
    },
    [synth],
  )
  const totalDeVozes = useSyncExternalStore(
    assinarVozes,
    () => (synth ? synth.getVoices().length : 0),
    () => 0,
  )
  const vozPt = escolherVoz(synth?.getVoices() ?? [])
  const velocidade = useSyncExternalStore(
    assinarVelocidade,
    lerVelocidade,
    (): Velocidade => 1,
  )
  const [tocador, setTocador] = useState<Tocador>({
    estado: 'parado',
    atual: 0,
  })
  const geracao = useRef(0)
  // Guarda a fala atual: o Chrome pode coletá-la antes do evento end.
  const falaAtual = useRef<SpeechSynthesisUtterance | null>(null)
  const falarRef = useRef<(i: number) => void>(() => {})

  function falar(i: number, ritmo: number = velocidade) {
    if (!synth || trechos.length === 0) return
    const minha = ++geracao.current
    synth.cancel()

    const fala = criarFala(paraFala(trechos[i]))
    fala.lang = 'pt-BR'
    if (vozPt) fala.voice = vozPt
    fala.rate = ritmo
    fala.onend = () => {
      if (geracao.current !== minha) return
      if (i + 1 < trechos.length) falarRef.current(i + 1)
      else setTocador({ estado: 'fim', atual: i })
    }
    fala.onerror = () => {
      if (geracao.current !== minha) return
      setTocador({ estado: 'parado', atual: i })
    }

    setTocador({ estado: 'tocando', atual: i })
    falaAtual.current = fala
    synth.speak(fala)
  }

  useEffect(() => {
    falarRef.current = falar
  })

  // Saiu da página: cala a Luv.
  useEffect(
    () => () => {
      geracao.current++
      synth?.cancel()
    },
    [synth],
  )

  const { estado, atual } = tocador
  const ultimo = Math.max(0, trechos.length - 1)

  function pausar() {
    geracao.current++
    synth?.cancel()
    setTocador({ estado: 'pausado', atual })
  }

  function proximo() {
    if (atual >= ultimo) return
    falar(atual + 1)
  }

  function mudarVelocidade(nova: Velocidade) {
    salvarVelocidade(nova)
    if (estado === 'tocando') falar(atual, nova)
  }

  const semVozEmPortugues = totalDeVozes > 0 && !vozPt
  const estadoVisivel: EstadoEscuta =
    suportado === null || trechos.length === 0
      ? 'carregando'
      : !suportado || semVozEmPortugues
        ? 'indisponivel'
        : estado

  return {
    estado: estadoVisivel,
    atual,
    total: trechos.length,
    velocidade,
    ouvir: () => falar(estado === 'fim' ? 0 : atual),
    pausar,
    continuar: () => falar(atual),
    repetir: () => falar(atual),
    anterior: () => falar(Math.max(0, atual - 1)),
    proximo,
    irPara: (i: number) => falar(i),
    mudarVelocidade,
  }
}
