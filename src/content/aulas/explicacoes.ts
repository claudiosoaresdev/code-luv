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
  'titulos-e-destaques': () =>
    import('./02-titulos-e-destaques/explicacao.mdx'),
  listas: () => import('./03-listas/explicacao.mdx'),
  links: () => import('./04-links/explicacao.mdx'),
  imagens: () => import('./05-imagens/explicacao.mdx'),
  formularios: () => import('./06-formularios/explicacao.mdx'),
  'secoes-e-rodape': () => import('./07-secoes-e-rodape/explicacao.mdx'),
  cores: () => import('./css-01-cores/explicacao.mdx'),
  letras: () => import('./css-02-letras/explicacao.mdx'),
}
