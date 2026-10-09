/** Nomes de vozes que costumam soar mais naturais em português. */
const PREFERIDAS = ['luciana', 'google', 'francisca', 'natural', 'neural']

function idioma(voz: SpeechSynthesisVoice) {
  return voz.lang.toLowerCase().replace('_', '-')
}

function nota(voz: SpeechSynthesisVoice) {
  const nome = voz.name.toLowerCase()
  return (
    (idioma(voz) === 'pt-br' ? 10 : 0) +
    (PREFERIDAS.some((p) => nome.includes(p)) ? 5 : 0) +
    (voz.localService ? 1 : 0)
  )
}

/** A melhor voz em português disponível, ou undefined se não houver. */
export function escolherVoz(vozes: SpeechSynthesisVoice[]) {
  return vozes
    .filter((voz) => idioma(voz).startsWith('pt'))
    .sort((a, b) => nota(b) - nota(a))[0]
}
