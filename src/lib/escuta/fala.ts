/**
 * Prepara o texto de um trecho para a voz. Sem isto, a voz lê "<h1>" como
 * "menor que agá um maior que". O texto na tela continua igual.
 */
export function paraFala(texto: string) {
  return texto
    .replace(/<!--[\s\S]*?-->/g, ' comentário ')
    .replace(/<!doctype\s+html\s*>/gi, ' doctype html ')
    .replace(/<\/\s*([a-z][\w-]*)\s*>/gi, ' tag de fechamento $1 ')
    .replace(/<([a-z][\w-]*)(?:\s[^<>]*)?\/?>/gi, ' tag $1 ')
    .replace(/\s+([,.!?:;])/g, '$1')
    .replace(/\s{2,}/g, ' ')
    .trim()
}
