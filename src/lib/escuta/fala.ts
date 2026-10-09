/**
 * Prepara o texto de um trecho para a voz. Sem isto, a voz lê "<h1>" como
 * "menor que agá um maior que". O texto na tela continua igual.
 */
export function paraFala(texto: string) {
  return texto
    .replace(/<\/(\w+)>/g, ' tag de fechamento $1 ')
    .replace(/<(\w+)>/g, ' tag $1 ')
    .replace(/\s+([,.!?:;])/g, '$1')
    .replace(/\s{2,}/g, ' ')
    .trim()
}
