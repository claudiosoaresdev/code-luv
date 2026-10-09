import type { Metadata } from 'next'

import { MeuSite } from '@/components/meu-site/meu-site'

export const metadata: Metadata = { title: 'Meu site' }

export default function MeuSitePage() {
  return (
    <>
      <h1 className="font-display text-3xl font-bold md:text-4xl">Meu site</h1>
      <MeuSite />
    </>
  )
}
