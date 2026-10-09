import type { Metadata } from 'next'

import { EmptyState } from '@/components/empty-state'

export const metadata: Metadata = { title: 'Aulas' }

export default function AulasPage() {
  return (
    <>
      <h1 className="font-display text-3xl font-bold md:text-4xl">Aulas</h1>
      <EmptyState
        luv="aprender"
        title="As aulas estão chegando"
        description="O módulo de HTML vai aparecer aqui, com uma aula por parte do seu site."
      />
    </>
  )
}
