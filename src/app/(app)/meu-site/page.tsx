import type { Metadata } from 'next'

import { EmptyState } from '@/components/empty-state'

export const metadata: Metadata = { title: 'Meu site' }

export default function MeuSitePage() {
  return (
    <>
      <h1 className="font-display text-3xl font-bold md:text-4xl">Meu site</h1>
      <EmptyState
        title="Seu site aparece aqui"
        description="Depois da primeira aula, cada parte que você criar vem morar nesta página."
        action={{ label: 'Ver as aulas', href: '/aulas' }}
      />
    </>
  )
}
