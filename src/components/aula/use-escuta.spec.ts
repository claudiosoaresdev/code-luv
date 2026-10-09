import { act, renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { esquecerVelocidadeEmMemoria } from '@/lib/escuta/velocidade'

import { useEscuta } from './use-escuta'

/** Uma fala de mentira: o teste dispara onend quando quiser. */
class FalaFalsa {
  text: string
  lang = ''
  rate = 1
  voice: SpeechSynthesisVoice | null = null
  onend: (() => void) | null = null
  onerror: (() => void) | null = null
  constructor(texto: string) {
    this.text = texto
  }
}

function criarSynth(
  vozes = [
    { name: 'Luciana', lang: 'pt-BR', localService: true },
  ] as SpeechSynthesisVoice[],
) {
  const faladas: FalaFalsa[] = []
  return {
    faladas,
    speak: vi.fn((fala: FalaFalsa) => faladas.push(fala)),
    cancel: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    getVoices: () => vozes,
  }
}

const TRECHOS = ['Um.', 'A tag <p> abre.', 'Três.']

function montar(
  synth: ReturnType<typeof criarSynth> | null,
  trechos: string[] = TRECHOS,
) {
  return renderHook(() =>
    useEscuta({
      trechos,
      synth: synth as unknown as SpeechSynthesis | null,
      criarFala: (texto) =>
        new FalaFalsa(texto) as unknown as SpeechSynthesisUtterance,
    }),
  )
}

describe('useEscuta', () => {
  beforeEach(() => {
    localStorage.clear()
    esquecerVelocidadeEmMemoria()
  })

  it('fica indisponível sem síntese de voz', () => {
    const { result } = montar(null)
    expect(result.current.estado).toBe('indisponivel')
  })

  it('nunca toca sozinho e, ao ouvir, fala o primeiro trecho em pt-BR', () => {
    const synth = criarSynth()
    const { result } = montar(synth)

    expect(result.current.estado).toBe('parado')
    expect(synth.speak).not.toHaveBeenCalled()

    act(() => result.current.ouvir())

    expect(result.current.estado).toBe('tocando')
    expect(result.current.atual).toBe(0)
    expect(synth.faladas[0]).toMatchObject({
      text: 'Um.',
      lang: 'pt-BR',
      rate: 1,
    })
    expect(synth.faladas[0].voice?.name).toBe('Luciana')
  })

  it('segue para o próximo trecho, traduz código e termina no último', () => {
    const synth = criarSynth()
    const { result } = montar(synth)

    act(() => result.current.ouvir())
    act(() => synth.faladas[0].onend?.())
    expect(result.current.atual).toBe(1)
    expect(synth.faladas[1].text).toBe('A tag tag p abre.')

    act(() => synth.faladas[1].onend?.())
    act(() => synth.faladas[2].onend?.())
    expect(result.current.estado).toBe('fim')
    expect(result.current.total).toBe(3)
  })

  it('pausa sem avançar e continua no mesmo trecho', () => {
    const synth = criarSynth()
    const { result } = montar(synth)

    act(() => result.current.ouvir())
    act(() => result.current.pausar())
    expect(result.current.estado).toBe('pausado')
    expect(synth.cancel).toHaveBeenCalled()

    // O navegador avisa o fim da fala cancelada: não pode avançar.
    act(() => synth.faladas[0].onend?.())
    expect(synth.faladas).toHaveLength(1)

    act(() => result.current.continuar())
    expect(result.current.estado).toBe('tocando')
    expect(synth.faladas[1].text).toBe('Um.')
  })

  it('volta e pula sem passar dos limites', () => {
    const synth = criarSynth()
    const { result } = montar(synth)

    act(() => result.current.ouvir())
    act(() => result.current.anterior())
    expect(result.current.atual).toBe(0)

    act(() => result.current.proximo())
    act(() => result.current.proximo())
    act(() => result.current.proximo())
    expect(result.current.atual).toBe(2)
  })

  it('muda a velocidade, lembra e reinicia o trecho atual na velocidade nova', () => {
    const synth = criarSynth()
    const { result } = montar(synth)

    act(() => result.current.ouvir())
    act(() => result.current.mudarVelocidade(1.25))

    expect(result.current.velocidade).toBe(1.25)
    expect(localStorage.getItem('codeluv:velocidade')).toBe('1.25')
    expect(synth.faladas.at(-1)).toMatchObject({ text: 'Um.', rate: 1.25 })
  })

  it('depois do fim, ouvir de novo recomeça do primeiro trecho', () => {
    const synth = criarSynth()
    const { result } = montar(synth)

    act(() => result.current.ouvir())
    act(() => synth.faladas[0].onend?.())
    act(() => synth.faladas[1].onend?.())
    act(() => synth.faladas[2].onend?.())
    act(() => result.current.ouvir())

    expect(result.current.atual).toBe(0)
    expect(synth.faladas.at(-1)?.text).toBe('Um.')
  })

  it('erro na fala atual para a escuta', () => {
    const synth = criarSynth()
    const { result } = montar(synth)

    act(() => result.current.ouvir())
    act(() => synth.faladas[0].onerror?.())
    expect(result.current.estado).toBe('parado')
  })

  it('erro de uma fala já cancelada não muda o estado', () => {
    const synth = criarSynth()
    const { result } = montar(synth)

    act(() => result.current.ouvir())
    act(() => result.current.pausar())
    act(() => synth.faladas[0].onerror?.())
    expect(result.current.estado).toBe('pausado')
  })

  it('cala a voz ao desmontar', () => {
    const synth = criarSynth()
    const { unmount } = montar(synth)

    synth.cancel.mockClear()
    unmount()
    expect(synth.cancel).toHaveBeenCalled()
  })

  it('com vozes só em outro idioma, fica indisponível', () => {
    const synth = criarSynth([
      { name: 'Samantha', lang: 'en-US' },
    ] as SpeechSynthesisVoice[])
    const { result } = montar(synth)

    expect(result.current.estado).toBe('indisponivel')
  })

  it('sem lista de vozes ainda, fala em pt-BR sem voz explícita', () => {
    const synth = criarSynth([])
    const { result } = montar(synth)

    expect(result.current.estado).toBe('parado')
    act(() => result.current.ouvir())
    expect(synth.faladas[0]).toMatchObject({ lang: 'pt-BR', voice: null })
  })

  it('irPara fala o trecho pedido', () => {
    const synth = criarSynth()
    const { result } = montar(synth)

    act(() => result.current.ouvir())
    act(() => result.current.irPara(2))
    expect(result.current.atual).toBe(2)
    expect(synth.faladas.at(-1)?.text).toBe('Três.')
  })

  it('sem trechos ainda, fica carregando', () => {
    const { result } = montar(criarSynth(), [])
    expect(result.current.estado).toBe('carregando')
  })

  it('próximo no último trecho não relê', () => {
    const synth = criarSynth()
    const { result } = montar(synth)

    act(() => result.current.irPara(2))
    const antes = synth.faladas.length
    act(() => result.current.proximo())
    expect(synth.faladas).toHaveLength(antes)
  })
})
