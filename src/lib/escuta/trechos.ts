export type Trecho = {
  /** A frase como aparece na tela. */
  texto: string
  /** Onde a frase está no DOM — usado para destacar e para rolar até ela. */
  range: Range
}

const BLOCOS = 'h2, h3, p, li'
/** Uma frase: tudo até . ! ? … (com aspas/parênteses de fechamento), ou até o fim. */
const FRASE = /[^.!?…]+(?:[.!?…]+["”'»)]*|$)/g

function nosDeTexto(elemento: Element) {
  const caminhante = elemento.ownerDocument.createTreeWalker(
    elemento,
    NodeFilter.SHOW_TEXT,
  )
  const nos: Text[] = []
  while (caminhante.nextNode()) nos.push(caminhante.currentNode as Text)
  return nos
}

/** Converte um deslocamento no texto do bloco em (nó de texto, deslocamento no nó). */
function posicao(nos: Text[], deslocamento: number, ehFim: boolean) {
  let resto = deslocamento
  for (const no of nos) {
    if (ehFim ? resto <= no.length : resto < no.length) {
      return [no, resto] as const
    }
    resto -= no.length
  }
  const ultimo = nos[nos.length - 1]
  return [ultimo, ultimo.length] as const
}

/**
 * Divide o texto renderizado em trechos de leitura (DS-06: uma frase cada).
 * Títulos são trechos próprios; blocos de código (<pre>) não são lidos.
 */
export function dividirEmTrechos(container: Element): Trecho[] {
  const blocos = [...container.querySelectorAll(BLOCOS)].filter(
    (bloco) => !bloco.closest('pre') && !bloco.querySelector(BLOCOS),
  )
  const trechos: Trecho[] = []

  for (const bloco of blocos) {
    const nos = nosDeTexto(bloco)
    if (nos.length === 0) continue
    const texto = nos.map((no) => no.data).join('')

    for (const encontrado of texto.matchAll(FRASE)) {
      const bruto = encontrado[0]
      const frase = bruto.trim()
      if (!frase) continue
      const inicio =
        (encontrado.index ?? 0) + (bruto.length - bruto.trimStart().length)
      const fim = inicio + frase.length

      const range = container.ownerDocument.createRange()
      const [noInicio, deslocInicio] = posicao(nos, inicio, false)
      const [noFim, deslocFim] = posicao(nos, fim, true)
      range.setStart(noInicio, deslocInicio)
      range.setEnd(noFim, deslocFim)
      trechos.push({ texto: frase, range })
    }
  }
  return trechos
}
