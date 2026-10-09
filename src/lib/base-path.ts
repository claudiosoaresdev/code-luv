/**
 * Prefixo do site quando ele não está na raiz do domínio (GitHub Pages:
 * /code-luv). Vazio no desenvolvimento. Definido no build por
 * NEXT_PUBLIC_BASE_PATH (ver next.config.ts).
 */
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? ''

/** Caminho de um arquivo de public/ com o prefixo do site. */
export function comBase(caminho: string) {
  return `${BASE_PATH}${caminho}`
}

/**
 * O documento que vai no iframe do site da aluna. O <base> faz caminhos
 * relativos (como images/luv/ola.png) apontarem para os arquivos do CodeLuv,
 * esteja ele na raiz ou em /code-luv.
 */
export function paraIframe(html: string) {
  return `<base href="${BASE_PATH}/">\n${html}`
}
