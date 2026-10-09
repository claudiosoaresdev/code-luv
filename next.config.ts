import type { NextConfig } from 'next'

import createMDX from '@next/mdx'

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
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
