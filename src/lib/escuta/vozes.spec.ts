import { describe, expect, it } from 'vitest'

import { escolherVoz } from './vozes'

function voz(
  name: string,
  lang: string,
  localService = false,
): SpeechSynthesisVoice {
  return { name, lang, localService, default: false, voiceURI: name }
}

describe('escolherVoz', () => {
  it('não escolhe nada sem voz em português', () => {
    expect(escolherVoz([voz('Samantha', 'en-US')])).toBeUndefined()
    expect(escolherVoz([])).toBeUndefined()
  })

  it('prefere português do Brasil a português de Portugal', () => {
    expect(
      escolherVoz([voz('Joana', 'pt-PT'), voz('Felipe', 'pt-BR')])?.name,
    ).toBe('Felipe')
  })

  it('prefere vozes conhecidas por soar melhor', () => {
    expect(
      escolherVoz([voz('Felipe', 'pt-BR'), voz('Luciana', 'pt-BR')])?.name,
    ).toBe('Luciana')
  })

  it('aceita o formato pt_BR', () => {
    expect(escolherVoz([voz('Luciana', 'pt_BR')])?.name).toBe('Luciana')
  })
})
