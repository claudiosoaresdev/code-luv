import type { Metadata } from 'next'

import { EmptyState } from '@/components/empty-state'

export const metadata: Metadata = { title: 'Conquistas' }

export default function ConquistasPage() {
  return (
    <>
      <h1 className="font-display text-3xl font-bold md:text-4xl">
        Conquistas
      </h1>
      <EmptyState
        luv="comemorar"
        title="Sua primeira conquista vem logo"
        description="Ela chega quando você concluir a primeira aula."
        action={{ label: 'Ver as aulas', href: '/aulas' }}
      />
    </>
  )
}
