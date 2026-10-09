import type { MDXContent } from 'mdx/types'

/**
 * Texto (MDX) de cada aula, carregado sob demanda pela página.
 * Separado de index.ts para que os testes não precisem compilar MDX.
 */
export const EXPLICACOES: Record<
  string,
  () => Promise<{ default: MDXContent }>
> = {
  'seu-primeiro-html': () => import('./01-seu-primeiro-html/explicacao.mdx'),
}
