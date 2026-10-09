import type { NextConfig } from 'next'

import createMDX from '@next/mdx'

// Build do GitHub Pages (ver .github/workflows/pages.yml): site estático em
// /code-luv. Sem as variáveis, nada muda (desenvolvimento e testes).
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || undefined
const exportar = process.env.EXPORTAR_ESTATICO === '1'

const nextConfig: NextConfig = {
  basePath,
  ...(exportar && {
    output: 'export',
    trailingSlash: true,
    images: { unoptimized: true },
  }),
  // PPR não existe em export estático; o site estático serve HTML pronto.
  cacheComponents: !exportar,
  partialPrefetching: !exportar,
  turbopack: {
    rules: {
      '*.css': {
        loaders: ['@tailwindcss/turbopack'],
        as: '*.css',
      },
    },
  },
}

// As aulas são importadas como módulos (não viram rotas), então
// pageExtensions não muda. Ver node_modules/next/dist/docs/01-app/02-guides/mdx.md
const withMDX = createMDX({})

export default withMDX(nextConfig)
